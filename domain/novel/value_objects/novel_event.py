from dataclasses import dataclass
from enum import Enum
from typing import Tuple
from domain.bible.value_objects.character_id import CharacterId


class EventType(str, Enum):
    """事件类型枚举。

    定义小说中可能发生的事件类型：
    - CHARACTER_INTRODUCTION: 角色介绍
    - RELATIONSHIP_CHANGE: 关系变化
    - CONFLICT: 冲突
    - REVELATION: 揭示
    - DECISION: 决定
    """
    CHARACTER_INTRODUCTION = "character_introduction"  # 角色介绍
    RELATIONSHIP_CHANGE = "relationship_change"        # 关系变化
    CONFLICT = "conflict"                              # 冲突
    REVELATION = "revelation"                          # 揭示
    DECISION = "decision"                              # 决定


@dataclass(frozen=True)
class NovelEvent:
    """小说事件值对象。

    表示小说中发生的一个事件，包含事件发生的章节、类型、描述和涉及的角色。

    Attributes:
        chapter_number: 事件发生的章节号（必须 >= 1）
        event_type: 事件类型（EventType 枚举值）
        description: 事件描述（不能为空）
        involved_characters: 涉及的角色ID元组（使用元组确保不可变性）

    Example:
        >>> char_id = CharacterId("hero")
        >>> event = NovelEvent(
        ...     chapter_number=1,
        ...     event_type=EventType.CHARACTER_INTRODUCTION,
        ...     description="主角登场",
        ...     involved_characters=(char_id,)
        ... )
    """
    chapter_number: int
    event_type: EventType
    description: str
    involved_characters: Tuple[CharacterId, ...]

    def __post_init__(self):
        if self.chapter_number < 1:
            raise ValueError("Chapter number must be >= 1")
        if not self.description or not self.description.strip():
            raise ValueError("Description cannot be empty")
