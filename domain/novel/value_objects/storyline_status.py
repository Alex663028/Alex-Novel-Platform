from enum import Enum


class StorylineStatus(Enum):
    """故事线状态枚举"""
    ACTIVE = "active"
    COMPLETED = "completed"
    ABANDONED = "abandoned"
