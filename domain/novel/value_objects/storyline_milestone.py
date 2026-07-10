from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class StorylineMilestone:
    """故事线里程碑值对象"""
    order: int
    title: str
    description: str
    target_chapter_start: int
    target_chapter_end: int
    prerequisites: List[str]
    triggers: List[str]

    def __post_init__(self):
        if self.order < 0:
            raise ValueError("Order must be non-negative")

        if self.target_chapter_start < 1 or self.target_chapter_end < 1:
            raise ValueError("Chapter numbers must be positive")

        if self.target_chapter_end < self.target_chapter_start:
            raise ValueError("target_chapter_end must be >= target_chapter_start")
