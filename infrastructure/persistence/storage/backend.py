"""存储后端抽象接口"""
from abc import ABC, abstractmethod
from typing import Any, List
from pathlib import Path


class StorageBackend(ABC):
    """存储后端抽象接口

    定义了文件存储的基本操作接口，支持 JSON 和文本文件的读写。
    """

    @abstractmethod
    def read_json(self, path: str) -> Any:
        """读取 JSON 文件

        Args:
            path: 相对路径

        Returns:
            解析后的 JSON 数据

        Raises:
            FileNotFoundError: 文件不存在
        """
        pass

    @abstractmethod
    def write_json(self, path: str, data: Any) -> None:
        """写入 JSON 文件

        Args:
            path: 相对路径
            data: 要写入的数据
        """
        pass

    @abstractmethod
    def read_text(self, path: str) -> str:
        """读取文本文件

        Args:
            path: 相对路径

        Returns:
            文件内容

        Raises:
            FileNotFoundError: 文件不存在
        """
        pass

    @abstractmethod
    def write_text(self, path: str, content: str) -> None:
        """写入文本文件

        Args:
            path: 相对路径
            content: 文件内容
        """
        pass

    @abstractmethod
    def exists(self, path: str) -> bool:
        """检查文件是否存在

        Args:
            path: 相对路径

        Returns:
            文件是否存在
        """
        pass

    @abstractmethod
    def delete(self, path: str) -> None:
        """删除文件

        Args:
            path: 相对路径

        Note:
            如果文件不存在，不应该抛出异常（幂等操作）
        """
        pass

    @abstractmethod
    def list_files(self, pattern: str = "*") -> List[str]:
        """列出匹配的文件

        Args:
            pattern: glob 模式（如 "*.json"）

        Returns:
            匹配的文件路径列表（相对路径）
        """
        pass
