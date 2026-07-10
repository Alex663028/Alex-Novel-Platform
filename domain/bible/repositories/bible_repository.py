from abc import ABC, abstractmethod
from typing import Optional
from domain.bible.entities.bible import Bible
from domain.novel.value_objects.novel_id import NovelId


class BibleRepository(ABC):
    """Bible 仓储接口"""

    @abstractmethod
    def save(self, bible: Bible) -> None:
        """保存 Bible"""
        pass

    @abstractmethod
    def get_by_id(self, bible_id: str) -> Optional[Bible]:
        """根据 ID 获取 Bible"""
        pass

    @abstractmethod
    def get_by_novel_id(self, novel_id: NovelId) -> Optional[Bible]:
        """根据小说 ID 获取 Bible"""
        pass

    @abstractmethod
    def delete(self, bible_id: str) -> None:
        """删除 Bible"""
        pass

    @abstractmethod
    def exists(self, bible_id: str) -> bool:
        """检查 Bible 是否存在"""
        pass
