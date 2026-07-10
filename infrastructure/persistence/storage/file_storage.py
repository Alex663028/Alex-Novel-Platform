"""基于文件系统的存储实现"""
import json
from pathlib import Path
from typing import Any, List
from .backend import StorageBackend


class FileStorage(StorageBackend):
    """基于文件系统的存储实现

    将数据存储在本地文件系统中。
    """

    def __init__(self, base_path: Path):
        """初始化文件存储

        Args:
            base_path: 基础路径（所有操作都相对于此路径）
        """
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)

    def _resolve_path(self, path: str) -> Path:
        """解析相对路径为绝对路径

        Args:
            path: 相对路径

        Returns:
            绝对路径
        """
        return self.base_path / path

    def read_json(self, path: str) -> Any:
        """读取 JSON 文件"""
        full_path = self._resolve_path(path)
        if not full_path.exists():
            raise FileNotFoundError(f"File not found: {path}")

        with open(full_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def write_json(self, path: str, data: Any) -> None:
        """写入 JSON 文件"""
        full_path = self._resolve_path(path)
        full_path.parent.mkdir(parents=True, exist_ok=True)

        with open(full_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def read_text(self, path: str) -> str:
        """读取文本文件"""
        full_path = self._resolve_path(path)
        if not full_path.exists():
            raise FileNotFoundError(f"File not found: {path}")

        with open(full_path, 'r', encoding='utf-8') as f:
            return f.read()

    def write_text(self, path: str, content: str) -> None:
        """写入文本文件"""
        full_path = self._resolve_path(path)
        full_path.parent.mkdir(parents=True, exist_ok=True)

        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)

    def exists(self, path: str) -> bool:
        """检查文件是否存在"""
        return self._resolve_path(path).exists()

    def delete(self, path: str) -> None:
        """删除文件"""
        full_path = self._resolve_path(path)
        if full_path.exists():
            full_path.unlink()

    def list_files(self, pattern: str = "*") -> List[str]:
        """列出匹配的文件"""
        matches = self.base_path.glob(pattern)
        return [str(p.relative_to(self.base_path)) for p in matches if p.is_file()]
