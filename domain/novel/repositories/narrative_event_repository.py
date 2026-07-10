"""Narrative Event Repository 抽象接口"""
from abc import ABC, abstractmethod
from typing import Optional


class NarrativeEventRepository(ABC):
    """叙事事件仓储抽象接口"""

    @abstractmethod
    def list_up_to_chapter(self, novel_id: str, max_chapter_inclusive: int) -> list[dict]:
        """获取指定章节及之前的所有事件

        Args:
            novel_id: 小说 ID
            max_chapter_inclusive: 最大章节号（包含）

        Returns:
            事件列表，按 chapter_number ASC 排序
            每个事件包含: event_id, novel_id, chapter_number, event_summary, mutations, timestamp_ts
        """
        pass

    @abstractmethod
    def append_event(
        self,
        novel_id: str,
        chapter_number: int,
        event_summary: str,
        mutations: list[dict],
        tags: list[str] = None
    ) -> str:
        """追加新事件

        Args:
            novel_id: 小说 ID
            chapter_number: 章节号
            event_summary: 事件摘要
            mutations: 变更列表
            tags: 事件标签列表（可选，默认空列表）

        Returns:
            新创建的 event_id
        """
        pass

    @abstractmethod
    def get_event(self, novel_id: str, event_id: str) -> Optional[dict]:
        """获取单个事件

        Args:
            novel_id: 小说 ID
            event_id: 事件 ID

        Returns:
            事件字典，如果不存在返回 None
        """
        pass

    @abstractmethod
    def update_event(
        self,
        novel_id: str,
        event_id: str,
        event_summary: str,
        tags: list[str]
    ) -> None:
        """更新事件

        Args:
            novel_id: 小说 ID
            event_id: 事件 ID
            event_summary: 新的事件摘要
            tags: 新的标签列表
        """
        pass
