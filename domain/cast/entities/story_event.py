"""Story Event entity"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class StoryEvent:
    """Story Event entity

    Represents a milestone or key event in the story timeline.
    """

    id: str
    summary: str
    chapter_id: Optional[int] = None
    importance: str = "normal"  # "normal" or "key"

    def __post_init__(self):
        if not self.id or not self.id.strip():
            raise ValueError("Story event ID cannot be empty")
        if not self.summary or not self.summary.strip():
            raise ValueError("Story event summary cannot be empty")
        if self.importance not in ["normal", "key"]:
            raise ValueError("Story event importance must be 'normal' or 'key'")
