"""时间线注册表实体"""
from typing import List, Optional
from domain.shared.base_entity import BaseEntity
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.timeline_event import TimelineEvent


class TimelineRegistry(BaseEntity):
    """时间线注册表

    管理小说中所有时间线事件，支持绝对时间、相对时间和模糊时间
    """

    def __init__(
        self,
        id: str,
        novel_id: NovelId,
        events: Optional[List[TimelineEvent]] = None
    ):
        super().__init__(id)
        self.novel_id = novel_id
        self.events: List[TimelineEvent] = events if events is not None else []

    def add_event(self, event: TimelineEvent) -> None:
        """添加时间线事件"""
        if event is None:
            raise ValueError("TimelineEvent cannot be None")
        self.events.append(event)

    def get_events_by_chapter(self, chapter_number: int) -> List[TimelineEvent]:
        """获取指定章节的所有事件"""
        return [e for e in self.events if e.chapter_number == chapter_number]

    def get_events_by_type(self, timestamp_type: str) -> List[TimelineEvent]:
        """按时间类型筛选事件（absolute/relative/vague）"""
        return [e for e in self.events if e.timestamp_type == timestamp_type]

    def get_all_events_sorted(self) -> List[TimelineEvent]:
        """获取所有事件，按章节号排序"""
        return sorted(self.events, key=lambda e: e.chapter_number)
