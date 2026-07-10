from abc import ABC, abstractmethod
from typing import Optional
from domain.novel.entities.foreshadowing_registry import ForeshadowingRegistry
from domain.novel.value_objects.novel_id import NovelId


class ForeshadowingRepository(ABC):
    """伏笔注册表仓储接口"""

    @abstractmethod
    def save(self, registry: ForeshadowingRegistry) -> None:
        """保存伏笔注册表"""
        pass

    @abstractmethod
    def get_by_novel_id(self, novel_id: NovelId) -> Optional[ForeshadowingRegistry]:
        """根据小说 ID 获取伏笔注册表"""
        pass

    @abstractmethod
    def delete(self, novel_id: NovelId) -> None:
        """删除伏笔注册表"""
        pass
