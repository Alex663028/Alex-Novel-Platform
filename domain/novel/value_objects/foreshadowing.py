from dataclasses import dataclass
from enum import Enum
from typing import Optional


class ForeshadowingStatus(str, Enum):
    """伏笔状态"""
    PLANTED = "planted"      # 已埋下
    RESOLVED = "resolved"    # 已解决
    ABANDONED = "abandoned"  # 已放弃


class ImportanceLevel(int, Enum):
    """重要性级别"""
    LOW = 1        # 低
    MEDIUM = 2     # 中等
    HIGH = 3       # 高
    CRITICAL = 4   # 关键


@dataclass(frozen=True)
class Foreshadowing:
    """伏笔值对象"""
    id: str
    planted_in_chapter: int
    description: str
    importance: ImportanceLevel
    status: ForeshadowingStatus
    suggested_resolve_chapter: Optional[int] = None
    resolved_in_chapter: Optional[int] = None

    def __post_init__(self):
        if self.planted_in_chapter < 1:
            raise ValueError("planted_in_chapter must be >= 1")
        if not self.description or not self.description.strip():
            raise ValueError("description cannot be empty")
        if self.status == ForeshadowingStatus.RESOLVED and self.resolved_in_chapter is None:
            raise ValueError("RESOLVED status requires resolved_in_chapter")

        # Validate optional chapter fields
        if self.suggested_resolve_chapter is not None and self.suggested_resolve_chapter < 1:
            raise ValueError("suggested_resolve_chapter must be >= 1")
        if self.resolved_in_chapter is not None and self.resolved_in_chapter < 1:
            raise ValueError("resolved_in_chapter must be >= 1")

        # Validate business rules
        if self.resolved_in_chapter is not None and self.resolved_in_chapter < self.planted_in_chapter:
            raise ValueError("resolved_in_chapter must be >= planted_in_chapter")
        if self.suggested_resolve_chapter is not None and self.suggested_resolve_chapter < self.planted_in_chapter:
            raise ValueError("suggested_resolve_chapter must be >= planted_in_chapter")
