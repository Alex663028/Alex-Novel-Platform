from dataclasses import dataclass
from enum import Enum


class RelationType(Enum):
    """关系类型枚举"""
    STRANGER = "stranger"
    ACQUAINTANCE = "acquaintance"
    FRIEND = "friend"
    CLOSE_FRIEND = "close_friend"
    LOVER = "lover"
    ENEMY = "enemy"
    RIVAL = "rival"
    FAMILY = "family"


@dataclass(frozen=True)
class Relationship:
    """角色关系值对象"""
    relation_type: RelationType
    established_in_chapter: int
    description: str

    def __post_init__(self):
        # Validate relation_type is actually a RelationType enum
        if not isinstance(self.relation_type, RelationType):
            raise TypeError(f"relation_type must be a RelationType enum, got {type(self.relation_type).__name__}")

        # Validate description is a string
        if not isinstance(self.description, str):
            raise TypeError(f"description must be a string, got {type(self.description).__name__}")

        if self.established_in_chapter < 1:
            raise ValueError("established_in_chapter must be >= 1")
        if not self.description or not self.description.strip():
            raise ValueError("description cannot be empty")
