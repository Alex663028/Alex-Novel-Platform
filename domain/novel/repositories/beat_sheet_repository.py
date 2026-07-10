"""节拍表仓储接口"""

from abc import ABC, abstractmethod
from typing import Optional
from domain.novel.entities.beat_sheet import BeatSheet


class BeatSheetRepository(ABC):
    """节拍表仓储接口"""

    @abstractmethod
    async def save(self, beat_sheet: BeatSheet) -> None:
        """保存节拍表"""
        pass

    @abstractmethod
    async def get_by_chapter_id(self, chapter_id: str) -> Optional[BeatSheet]:
        """根据章节 ID 获取节拍表"""
        pass

    @abstractmethod
    async def delete_by_chapter_id(self, chapter_id: str) -> None:
        """删除章节的节拍表"""
        pass

    @abstractmethod
    async def exists(self, chapter_id: str) -> bool:
        """检查章节是否已有节拍表"""
        pass
