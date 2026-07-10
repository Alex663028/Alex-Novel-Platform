from abc import ABC, abstractmethod
from typing import Optional
from domain.novel.entities.plot_arc import PlotArc
from domain.novel.value_objects.novel_id import NovelId


class PlotArcRepository(ABC):
    """剧情弧仓储接口"""

    @abstractmethod
    def save(self, plot_arc: PlotArc) -> None:
        """保存剧情弧"""
        pass

    @abstractmethod
    def get_by_novel_id(self, novel_id: NovelId) -> Optional[PlotArc]:
        """根据小说 ID 获取剧情弧"""
        pass

    @abstractmethod
    def delete(self, novel_id: NovelId) -> None:
        """删除剧情弧"""
        pass
