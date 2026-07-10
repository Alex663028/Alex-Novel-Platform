"""
章节元素关联领域模型
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional


class ElementType(str, Enum):
    """元素类型"""
    CHARACTER = "character"
    LOCATION = "location"
    ITEM = "item"
    ORGANIZATION = "organization"
    EVENT = "event"


class RelationType(str, Enum):
    """关联类型"""
    APPEARS = "appears"      # 出场
    MENTIONED = "mentioned"  # 提及
    SCENE = "scene"          # 场景
    USES = "uses"            # 使用（道具）
    INVOLVED = "involved"    # 涉及（组织）
    OCCURS = "occurs"        # 发生（事件）


class Importance(str, Enum):
    """重要性"""
    MAJOR = "major"    # 主要
    NORMAL = "normal"  # 普通
    MINOR = "minor"    # 次要


@dataclass
class ChapterElement:
    """章节元素关联"""
    id: str
    chapter_id: str
    element_type: ElementType
    element_id: str
    relation_type: RelationType
    importance: Importance = Importance.NORMAL
    appearance_order: Optional[int] = None
    notes: Optional[str] = None
    created_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        """类型转换"""
        if isinstance(self.element_type, str):
            self.element_type = ElementType(self.element_type)
        if isinstance(self.relation_type, str):
            self.relation_type = RelationType(self.relation_type)
        if isinstance(self.importance, str):
            self.importance = Importance(self.importance)

    def to_dict(self) -> dict:
        """转换为字典"""
        return {
            "id": self.id,
            "chapter_id": self.chapter_id,
            "element_type": self.element_type.value,
            "element_id": self.element_id,
            "relation_type": self.relation_type.value,
            "importance": self.importance.value,
            "appearance_order": self.appearance_order,
            "notes": self.notes,
            "created_at": self.created_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict) -> "ChapterElement":
        """从字典创建"""
        return cls(
            id=data["id"],
            chapter_id=data["chapter_id"],
            element_type=ElementType(data["element_type"]),
            element_id=data["element_id"],
            relation_type=RelationType(data["relation_type"]),
            importance=Importance(data.get("importance", "normal")),
            appearance_order=data.get("appearance_order"),
            notes=data.get("notes"),
            created_at=datetime.fromisoformat(data["created_at"]) if isinstance(data.get("created_at"), str) else data.get("created_at", datetime.now()),
        )
