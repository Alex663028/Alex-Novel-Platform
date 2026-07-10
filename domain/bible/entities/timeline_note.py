"""TimelineNote 实体"""
from dataclasses import dataclass


@dataclass
class TimelineNote:
    """时间线笔记实体"""
    id: str
    event: str
    time_point: str  # 时间点描述，如 "第一章"、"三年后"
    description: str

    def __post_init__(self):
        """验证实体"""
        if not self.id or not self.id.strip():
            raise ValueError("TimelineNote id cannot be empty")
        if not self.event or not self.event.strip():
            raise ValueError("TimelineNote event cannot be empty")
