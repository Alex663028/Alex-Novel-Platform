//! FastAPI 后端进程管理器
//!
//! 职责：
//!   1. 优先启动 PyInstaller 冻结产物 `alex-backend.exe`（发布推荐）
//!   2. 否则回退：内嵌 / venv / 系统 Python + `python -m uvicorn`（开发）
//!   3. 健康检查轮询，等待 HTTP 就绪
//!   4. 管理子进程生命周期（退出时自动清理）

use std::io::BufReader;
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;
use std::thread;
use std::time::{Duration, Instant};
use tauri::path::BaseDirectory;
use tauri::{AppHandle, Manager};
use ureq::Agent;

#[cfg(target_os = "windows")]
use std::os::windows::io::AsRawHandle;
#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;
#[cfg(target_os = "windows")]
use win32job::Job;

const DEFAULT_BACKEND_PORT_START: u16 = 8005;
const BACKEND_PORT_SCAN_LIMIT: u16 = 100;

fn spawn_stdio_drainers(mut child: Child) -> Child {
    if let Some(out) = child.stdout.take() {
        thread::spawn(move || {
            let mut reader = BufReader::new(out);
            let mut sink = std::io::sink();
            let _ = std::io::copy(&mut reader, &mut sink);
        });
    }
    if let Some(err) = child.stderr.take() {
        thread::spawn(move || {
            let mut reader = BufReader::new(err);
            let mut sink = std::io::sink();
            let _ = std::io::copy(&mut reader, &mut sink);
        });
    }
    child
}

pub struct BackendManager {
    pub(crate) _app_handle: AppHandle,
    child: Mutex<Option<Child>>,
    port: Mutex<u16>,
    pub(crate) project_root: PathBuf,
    #[cfg(target_os = "windows")]
    job_kill_tree: Mutex<Option<Job>>,
}

impl BackendManager {
    pub fn new(app_handle: AppHandle) -> Self {
        let project_root = Self::detect_project_root(&app_handle);
        Self {
            _app_handle: app_handle,
            child: Mutex::new(None),
            port: Mutex::new(0),
            project_root,
            #[cfg(target_os = "windows")]
            job_kill_tree: Mutex::new(None),
        }
    }

    // === 公共 API（供 commands.rs 调用） ===

    pub fn get_port(&self) -> u16 {
        *self.port.lock().unwrap()
    }

    pub fn is_running(&self) -> bool {
        let child = self.child.lock().unwrap();
        child.as_ref().map_or(false, |c| c.id() > 0)
    }

    pub fn terminate(&self) {
        let mut child = self.child.lock().unwrap();
        if let Some(mut c) = child.take() {
            let _ = c.kill();
            let _ = c.wait();
        }
    }

    pub fn graceful_shutdown(&self, _timeout: Duration) {
        {
            let child = self.child.lock().unwrap();
            if let Some(ref c) = *child {
                log::info!("🔴 正在终止后端子进程 (PID={})...", c.id());
            }
        }
        self.terminate();
    }

    pub fn extract_python_from_zip(&self, zip_path: &PathBuf, target: &PathBuf) -> Result<(), String> {
        use zip::ZipArchive;
        let file = std::fs::File::open(zip_path)
            .map_err(|e| format!("无法打开 zip: {}", e))?;
        let mut archive = ZipArchive::new(file)
            .map_err(|e| format!("无效的 zip: {}", e))?;
        let parent = target.parent().unwrap();
        std::fs::create_dir_all(parent)
            .map_err(|e| format!("无法创建目标目录: {}", e))?;
        archive.extract(parent)
            .map_err(|e| format!("解压失败: {}", e))?;
        Ok(())
    }

    // === 内部实现 ===

    fn should_inject_prod_data_dir() -> bool {
        if cfg!(debug_assertions) {
            let force = std::env::var("PLOTPILOT_FORCE_PROD_DATA")
                .or_else(|_| std::env::var("AITEXT_FORCE_PROD_DATA"))
                .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
                .unwrap_or(false);
            force
        } else {
            true
        }
    }

    fn resolve_prod_data_dir(handle: &AppHandle) -> Result<PathBuf, String> {
        let base = handle
            .path()
            .app_data_dir()
            .map_err(|e| format!("无法解析 app_data_dir: {}", e))?;
        let data = base.join("data");
        std::fs::create_dir_all(&data)
            .map_err(|e| format!("无法创建数据目录 {}: {}", data.display(), e))?;
        Ok(data)
    }

    fn inject_prod_data_env(cmd: &mut Command, handle: &AppHandle) -> Result<(), String> {
        if !Self::should_inject_prod_data_dir() {
            return Ok(());
        }
        let path = Self::resolve_prod_data_dir(handle)?;
        cmd.env("PLOTPILOT_PROD_DATA_DIR", path.as_os_str());
        cmd.env("AITEXT_PROD_DATA_DIR", path.as_os_str());

        let logs_dir = path.join("logs");
        std::fs::create_dir_all(&logs_dir)
            .map_err(|e| format!("无法创建日志目录 {}: {}", logs_dir.display(), e))?;
        let log_file = logs_dir.join("alex.log");
        cmd.env("LOG_FILE", log_file.as_os_str());

        Ok(())
    }

    fn find_frozen_backend_exe(handle: &AppHandle) -> Option<PathBuf> {
        if let Ok(p) = handle.path().resolve(
            "alex-backend/alex-backend.exe",
            BaseDirectory::Resource,
        ) {
            if p.is_file() {
                log::info!("📦 后端路径 (resolve Resource): {}", p.display());
                return Some(p);
            }
        }

        if let Ok(p) = handle.path().resolve(
            "../../out/tauri/alex-backend/alex-backend.exe",
            BaseDirectory::Resource,
        ) {
            if p.is_file() {
                log::info!("📦 后端路径 (resolve legacy rel): {}", p.display());
                return Some(p);
            }
        }

        if let Ok(rd) = handle.path().resource_dir() {
            let nested = rd.join("alex-backend").join("alex-backend.exe");
            if nested.is_file() {
                log::info!("📦 后端路径 (resource_dir nested): {}", nested.display());
                return Some(nested);
            }
            let flat = rd.join("alex-backend.exe");
            if flat.is_file() {
                log::info!("📦 后端路径 (resource_dir flat): {}", flat.display());
                return Some(flat);
            }
        }

        if let Some(exe_path) = std::env::current_exe()
            .ok()
            .and_then(|p| p.canonicalize().ok())
        {
            let mut dir = exe_path.parent().map(PathBuf::from);
            for _ in 0..32 {
                let Some(ref d) = dir else { break };
                let candidate = d
                    .join("out")
                    .join("tauri")
                    .join("alex-backend")
                    .join("alex-backend.exe");
                if candidate.is_file() {
                    log::info!("📦 后端路径 (dev walk-up): {}", candidate.display());
                    return Some(candidate);
                }
                dir = d.parent().map(PathBuf::from);
            }

            if let Some(parent) = exe_path.parent() {
                let sibling = parent
                    .join("alex-backend")
                    .join("alex-backend.exe");
                if sibling.is_file() {
                    log::info!("📦 后端路径 (sibling dir): {}", sibling.display());
                    return Some(sibling);
                }
            }
        }

        None
    }

    fn detect_project_root(handle: &AppHandle) -> PathBuf {
        if let Ok(resource_dir) = handle.path().resource_dir() {
            let has_frozen = Self::find_frozen_backend_exe(handle).is_some();
            if has_frozen {
                log::info!("📂 资源根目录（冻结后端）: {}", resource_dir.display());
                return resource_dir;
            }
            for candidate in [
                resource_dir.join("../../../"),
                resource_dir.join("../../"),
                resource_dir.clone(),
            ] {
                if candidate.join("interfaces/main.py").exists() {
                    log::info!("📂 项目根目录: {}", candidate.display());
                    return candidate.canonicalize().unwrap_or(candidate);
                }
            }
        }

        handle
            .path()
            .resource_dir()
            .unwrap_or_else(|_| PathBuf::from("."))
    }

    fn configured_port_start() -> u16 {
        std::env::var("PLOTPILOT_BACKEND_PORT_START")
            .ok()
            .and_then(|raw| raw.parse::<u16>().ok())
            .filter(|&port| (1024..=u16::MAX - BACKEND_PORT_SCAN_LIMIT).contains(&port))
            .unwrap_or(DEFAULT_BACKEND_PORT_START)
    }

    fn pick_free_port() -> Option<u16> {
        let start = Self::configured_port_start();
        (start..start + BACKEND_PORT_SCAN_LIMIT)
            .find(|&port| std::net::TcpStream::connect(("127.0.0.1", port)).is_err())
    }

    fn python_version(path: &PathBuf) -> Option<String> {
        if !path.exists() {
            return None;
        }
        let mut cmd = Command::new(path);
        cmd.arg("--version");
        suppress_child_console(&mut cmd);
        let output = cmd.output().ok()?;
        let text = format!(
            "{}{}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        )
        .trim()
        .to_string();
        if text.is_empty() {
            None
        } else {
            Some(text)
        }
    }

    fn is_python_314(path: &PathBuf) -> bool {
        Self::python_version(path)
            .map(|version| version.contains("Python 3.14."))
            .unwrap_or(false)
    }

    fn accept_python_candidate(&self, label: &str, path: PathBuf) -> Option<PathBuf> {
        if !path.exists() {
            return None;
        }
        if Self::is_python_314(&path) {
            log::info!("🐍 使用{}: {}", label, path.display());
            Some(path)
        } else {
            let version = Self::python_version(&path).unwrap_or_else(|| "无法识别版本".to_string());
            log::warn!(
                "忽略{}，版本不是 Python 3.14: {} ({})",
                label,
                path.display(),
                version
            );
            None
        }
    }

    pub(crate) fn find_python(&self) -> Option<PathBuf> {
        if let Ok(configured) = std::env::var("PLOTPILOT_PYTHON_EXE") {
            let path = PathBuf::from(configured.trim_matches('"'));
            if let Some(path) = self.accept_python_candidate("显式配置的 Python 3.14", path) {
                return Some(path);
            }
        }
        if cfg!(target_os = "windows") {
            if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
                let python314 = PathBuf::from(local_app_data)
                    .join("Programs")
                    .join("Python")
                    .join("Python314")
                    .join("python.exe");
                if let Some(path) = self.accept_python_candidate("当前用户 Python 3.14", python314)
                {
                    return Some(path);
                }
            }
        }

        let embedded = self.project_root.join("tools/python_embed/python.exe");
        if let Some(path) = self.accept_python_candidate("项目目录内嵌 Python", embedded.clone())
        {
            return Some(path);
        }

        if let Ok(resource_dir) = self._app_handle.path().resource_dir() {
            let resource_python = resource_dir.join("python_embed/python.exe");
            if Self::is_python_314(&resource_python) {
                if let Err(e) = self.extract_embedded_python(&resource_dir) {
                    log::warn!("从资源目录提取内嵌 Python 失败: {}", e);
                } else if let Some(path) =
                    self.accept_python_candidate("资源目录内嵌 Python", embedded.clone())
                {
                    return Some(path);
                }
            }
        }

        if let Ok(resource_dir) = self._app_handle.path().resource_dir() {
            let zip_path = resource_dir.join("python-3.14.5-embed-amd64.zip");
            if zip_path.exists() {
                if let Err(e) = self.extract_python_from_zip(&zip_path, &embedded) {
                    log::warn!("解压内嵌 Python 失败: {}", e);
                } else if let Some(path) =
                    self.accept_python_candidate("内嵌 Python (从zip解压)", embedded.clone())
                {
                    return Some(path);
                }
            }
        }

        let venv = self.project_root.join(".venv/Scripts/python.exe");
        if let Some(path) = self.accept_python_candidate("虚拟环境 Python", venv) {
            return Some(path);
        }

        if let Ok(path) = which::which("python") {
            if let Some(path) = self.accept_python_candidate("系统 Python", path) {
                return Some(path);
            }
        }
        if let Ok(path) = which::which("python3") {
            if let Some(path) = self.accept_python_candidate("系统 python3", path) {
                return Some(path);
            }
        }

        None
    }

    pub fn start_and_wait(&mut self, timeout_secs: u64) -> Result<u16, String> {
        let port = self.spawn_only()?;
        Self::wait_for_ready(port, timeout_secs)?;
        Ok(port)
    }

    pub fn spawn_only(&mut self) -> Result<u16, String> {
        let port = Self::pick_free_port().ok_or("无法分配空闲端口")?;
        let frozen = Self::find_frozen_backend_exe(&self._app_handle);

        let mut cmd = if let Some(ref exe) = frozen {
            let work_dir = exe.parent().ok_or_else(|| "冻结后端路径无效".to_string())?;
            log::info!("📦 启动冻结后端: {}", exe.display());
            let mut c = Command::new(exe);
            c.arg("--port")
                .arg(port.to_string())
                .arg("--host")
                .arg("127.0.0.1")
                .current_dir(work_dir)
                .env("HF_HUB_OFFLINE", "1")
                .env("TRANSFORMERS_OFFLINE", "1")
                .env("HF_DATASETS_OFFLINE", "1")
                .stdout(Stdio::piped())
                .stderr(Stdio::piped());
            suppress_child_console(&mut c);
            c
        } else {
            let python = self.find_python().ok_or_else(|| {
                "未找到 alex-backend.exe，也未找到 Python。开发请安装 Python 3.14.5".to_string()
            })?;
            log::info!("🐍 启动 uvicorn（解释器）: {}", python.display());
            let mut c = Command::new(&python);
            c.arg("-m")
                .arg("uvicorn")
                .arg("interfaces.main:app")
                .arg("--host")
                .arg("127.0.0.1")
                .arg("--port")
                .arg(port.to_string())
                .arg("--log-level")
                .arg("info")
                .current_dir(&self.project_root)
                .env("PYTHONIOENCODING", "utf-8")
                .env("PYTHONUNBUFFERED", "1")
                .stdout(Stdio::piped())
                .stderr(Stdio::piped());
            suppress_child_console(&mut c);
            c
        };

        Self::inject_prod_data_env(&mut cmd, &self._app_handle)?;

        let child = cmd.spawn().map_err(|e| format!("启动后端失败: {}", e))?;

        #[cfg(target_os = "windows")]
        {
            let job = Job::create().map_err(|e| format!("创建 Job Object 失败: {}", e))?;
            let mut info = job
                .query_extended_limit_info()
                .map_err(|e| format!("Job 查询限制信息失败: {}", e))?;
            info.limit_kill_on_job_close();
            job.set_extended_limit_info(&mut info)
                .map_err(|e| format!("Job 设置限制失败: {}", e))?;
            let h = child.as_raw_handle() as isize;
            job.assign_process(h)
                .map_err(|e| format!("Job 绑定子进程失败: {}", e))?;
            *self.job_kill_tree.lock().unwrap() = Some(job);
        }

        let pid = child.id();
        log::info!("▶️  后端子进程已启动 (PID={})", pid);

        let child = spawn_stdio_drainers(child);
        *self.child.lock().unwrap() = Some(child);
        *self.port.lock().unwrap() = port;

        Ok(port)
    }

    pub fn wait_for_ready(port: u16, timeout_secs: u64) -> Result<(), String> {
        let health_url = format!("http://127.0.0.1:{}/health", port);
        let deadline = std::time::Instant::now() + Duration::from_secs(timeout_secs);

        log::info!("⏳ 等待后端端口 {} 监听...", port);
        loop {
            if std::time::Instant::now() > deadline {
                return Err(format!("超时：后端在 {}s 内未开始监听端口", timeout_secs));
            }
            if Self::is_port_listening(port) {
                break;
            }
            thread::sleep(Duration::from_millis(400));
        }

        log::info!("⏳ 等待 HTTP 健康检查...");
        let agent: Agent = Agent::config_builder()
            .timeout_global(Some(Duration::from_secs(2)))
            .build()
            .into();

        let start = Instant::now();
        loop {
            if Instant::now() > deadline {
                return Err(format!("超时：健康检查未在 {}s 内通过", timeout_secs));
            }
            let response = agent.get(&health_url).call();
            match response {
                Ok(resp) if resp.status() == 200 => {
                    log::info!("✅ 后端健康检查通过 (耗时 {}ms)", start.elapsed().as_millis());
                    return Ok(());
                }
                Ok(resp) => {
                    log::info!("⏳ 健康检查返回 {}，继续等待...", resp.status());
                }
                Err(e) => {
                    log::debug!("⏳ 连接失败: {}", e);
                }
            }
            thread::sleep(Duration::from_millis(500));
        }
    }

    fn is_port_listening(port: u16) -> bool {
        std::net::TcpListener::bind(("127.0.0.1", port)).is_err()
    }

    fn extract_embedded_python(&self, resource_dir: &PathBuf) -> Result<(), String> {
        let python_embed = resource_dir.join("python_embed");
        let target_dir = self.project_root.join("tools/python_embed");
        std::fs::create_dir_all(&target_dir)
            .map_err(|e| format!("无法创建目标目录: {}", e))?;
        for entry in std::fs::read_dir(&python_embed)
            .map_err(|e| format!("无法读取 resource python_embed: {}", e))?
        {
            let entry = entry.map_err(|e| format!("遍历失败: {}", e))?;
            let target = target_dir.join(entry.file_name());
            if entry.path().is_file() {
                std::fs::copy(&entry.path(), &target)
                    .map_err(|e| format!("拷贝 {} 失败: {}", entry.path().display(), e))?;
            }
        }
        Ok(())
    }
}

fn suppress_child_console(cmd: &mut Command) {
    #[cfg(target_os = "windows")]
    {
        cmd.creation_flags(0x08000000);
    }
}
