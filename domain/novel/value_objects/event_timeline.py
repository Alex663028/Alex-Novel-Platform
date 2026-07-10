from typing import List
from domain.novel.value_objects.novel_event import NovelEvent
from domain.bible.value_objects.character_id import CharacterId


class EventTimeline:
    """事件时间线"""

    def __init__(self):
        self._events: List[NovelEvent] = []

    @property
    def events(self) -> List[NovelEvent]:
        """返回事件列表的副本"""
        return self._events.copy()

    def add_event(self, event: NovelEvent) -> None:
        """添加事件并自动按章节号排序。

        Args:
            event: 要添加的小说事件

        Raises:
            ValueError: 如果 event 为 None
        """
        if event is None:
            raise ValueError("Event cannot be None")
        self._events.append(event)
        self._events.sort(key=lambda e: e.chapter_number)

    def get_events_before(self, chapter_number: int) -> List[NovelEvent]:
        """获取指定章节之前的事件（不包括该章节）。

        Args:
            chapter_number: 章节号

        Returns:
            章节号小于指定值的所有事件列表

        Raises:
            ValueError: 如果 chapter_number < 1
        """
        if chapter_number < 1:
            raise ValueError("Chapter number must be >= 1")
        return [e for e in self._events if e.chapter_number < chapter_number]

    def get_events_involving(self, character_id: CharacterId) -> List[NovelEvent]:
        """获取涉及特定角色的事件。

        Args:
            character_id: 角色ID

        Returns:
            涉及该角色的所有事件列表
        """
        return [e for e in self._events if character_id in e.involved_characters]
