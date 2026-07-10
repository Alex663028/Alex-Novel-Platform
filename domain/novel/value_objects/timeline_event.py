"""时间线事件值对象"""
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class TimelineEvent:
    """时间线事件

    记录小说中发生的事件及其时间戳
    """
    id: str
    chapter_number: int
    event: str  # 事件描述
    timestamp: str  # 时间戳（如"第三年春"、"2024-03-15"、"午夜"）
    timestamp_type: str  # 时间类型：absolute/relative/vague

    def __post_init__(self):
        if self.chapter_number < 1:
            raise ValueError("chapter_number must be >= 1")
        if not self.event or not self.event.strip():
            raise ValueError("event cannot be empty")
        if not self.timestamp or not self.timestamp.strip():
            raise ValueError("timestamp cannot be empty")
        if self.timestamp_type not in ("absolute", "relative", "vague"):
            raise ValueError("timestamp_type must be one of: absolute, relative, vague")
