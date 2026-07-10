"""时间线仓储接口"""
from abc import ABC, abstractmethod
from typing import Optional
from domain.novel.entities.timeline_registry import TimelineRegistry
from domain.novel.value_objects.novel_id import NovelId


class TimelineRepository(ABC):
    """时间线仓储接口"""

    @abstractmethod
    def save(self, registry: TimelineRegistry) -> None:
        """保存时间线注册表"""
        pass

    @abstractmethod
    def get_by_novel_id(self, novel_id: NovelId) -> Optional[TimelineRegistry]:
        """根据小说ID获取时间线注册表"""
        pass

    @abstractmethod
    def delete(self, novel_id: NovelId) -> None:
        """删除时间线注册表"""
        pass
