from abc import ABC, abstractmethod
from typing import Optional, List
from domain.novel.entities.storyline import Storyline
from domain.novel.value_objects.novel_id import NovelId


class StorylineRepository(ABC):
    """故事线仓储接口"""

    @abstractmethod
    def save(self, storyline: Storyline) -> None:
        """保存故事线"""
        pass

    @abstractmethod
    def get_by_id(self, storyline_id: str) -> Optional[Storyline]:
        """根据 ID 获取故事线"""
        pass

    @abstractmethod
    def get_by_novel_id(self, novel_id: NovelId) -> List[Storyline]:
        """根据小说 ID 获取所有故事线"""
        pass

    @abstractmethod
    def delete(self, storyline_id: str) -> None:
        """删除故事线"""
        pass
