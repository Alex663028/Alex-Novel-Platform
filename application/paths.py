"""仓库内路径（不依赖进程当前工作目录）。"""
from __future__ import annotations

import logging
from pathlib import Path
from infrastructure.runtime.data_directory_environment import (
    DataDirectoryEnvironmentSettings,
    LEGACY_PROD_DATA_DIR_ENV,
    PLOTPILOT_PROD_DATA_DIR_ENV,
    ALEX_APP_IDENTIFIER,
)

logger = logging.getLogger(__name__)

# application/paths.py → Alex仓库根目录
PLOTPILOT_ROOT = Path(__file__).resolve().parents[1]

# 旧版壳/脚本仍可能注入 LEGACY_PROD_DATA_DIR_ENV，读取时作为回退。
# TAURI_APP_IDENTIFIER 须与 frontend/src-tauri/tauri.conf.json 中 identifier 一致。
# 自 com.plotpilot.app 迁移：旧数据在 %APPDATA%/com.plotpilot.app/data。
# 自 com.plotpilot.desktop 迁移：旧数据在 %APPDATA%/com.plotpilot.desktop/data。
# 冻结进程启动时若检测到旧版目录有数据而新版目录无数据，自动迁移。
# ALEX_APP_IDENTIFIER 须与 frontend/src-tauri/tauri.conf.json 中 identifier 一致。


def _environment_settings() -> DataDirectoryEnvironmentSettings:
    return DataDirectoryEnvironmentSettings.from_env()


def _prod_data_dir_raw(settings: DataDirectoryEnvironmentSettings | None = None) -> str:
    return (settings or _environment_settings()).prod_data_dir_raw


def _frozen_fallback_data_dir(settings: DataDirectoryEnvironmentSettings | None = None) -> Path:
    """PyInstaller 等冻结产物在未注入生产数据目录环境变量时的默认数据目录。

    不可使用 PLOTPILOT_ROOT / data：冻结时 PLOTPILOT_ROOT 会落在 _internal/，通常只读或易被安全软件锁，
    SQLite WAL 会触发 disk I/O error。此处与 Tauri resolve_prod_data_dir 语义对齐（Roaming 下 identifier/data）。
    """
    return (settings or _environment_settings()).frozen_fallback_data_dir()


def _resolve_data_dir() -> Path:
    """
    解析持久化数据根目录。

    - 若设置 PLOTPILOT_PROD_DATA_DIR（或旧名 AITEXT_PROD_DATA_DIR）：桌面安装版，使用用户数据目录（由 Rust 注入）。
    - 否则若 PyInstaller 冻结：使用与 Tauri 一致的用户可写目录 (com.alex.desktop)，避免写入 _internal。
      - 若旧版 com.plotpilot.desktop 存在数据而新版目录无数据，自动迁移。
    - 否则：本地开发 / CLI，使用仓库内 data/。
    """
    settings = _environment_settings()
    raw = _prod_data_dir_raw(settings)
    if raw:
        p = Path(raw).expanduser().resolve()
    elif settings.frozen:
        p = _frozen_fallback_data_dir(settings)
        # 迁移：旧版 com.plotpilot.desktop → 新版 com.alex.desktop
        if settings.needs_migration():
            legacy_dir = settings.legacy_data_dir
            logger.info("检测到旧版数据目录 %s，开始迁移到 %s", legacy_dir, p)
            p.mkdir(parents=True, exist_ok=True)
            _migrate_data(legacy_dir, p)
        else:
            p.mkdir(parents=True, exist_ok=True)
    else:
        p = PLOTPILOT_ROOT / "data"
        p.mkdir(parents=True, exist_ok=True)
    return p


def _migrate_data(src: Path, dst: Path) -> None:
    """从旧版目录迁移数据到新版目录"""
    import shutil
    copied = False
    for item in src.iterdir():
        target = dst / item.name
        try:
            if item.is_dir():
                if not target.exists():
                    shutil.copytree(item, target)
                    copied = True
            elif item.is_file():
                shutil.copy2(item, target)
                copied = True
        except Exception as e:
            logger.warning("迁移 %s → %s 失败: %s", item, target, e)
    if copied:
        logger.info("数据迁移完成：%s → %s", src, dst)


DATA_DIR = _resolve_data_dir()


def get_db_path() -> str:
    """获取数据库文件路径

    默认使用 ``plotpilot.db``；若仅有旧版 ``aitext.db`` 则继续沿用，避免静默新建空库。
    """
    primary = DATA_DIR / "plotpilot.db"
    legacy = DATA_DIR / "aitext.db"
    if primary.is_file():
        return str(primary)
    if legacy.is_file():
        return str(legacy)
    return str(primary)


def resolve_runtime_data_path(path: str | Path, *, strip_data_prefix: bool = True) -> Path:
    """Resolve a user-writable runtime data path.

    Absolute paths are honored. Relative paths are anchored under ``DATA_DIR`` so
    packaged builds do not try to write beside the installed application. When a
    legacy relative path starts with ``data/``, that prefix is treated as the data
    root itself.
    """
    p = Path(path).expanduser()
    if p.is_absolute():
        return p
    parts = [part for part in p.parts if part not in ("", ".")]
    if strip_data_prefix and parts and parts[0].lower() == "data":
        parts = parts[1:]
    return DATA_DIR.joinpath(*parts) if parts else DATA_DIR
