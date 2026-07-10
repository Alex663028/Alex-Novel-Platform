"""
章节场景领域模型
"""

from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List
import json


@dataclass
class ChapterScene:
    """章节场景"""
    id: str
    chapter_id: str
    scene_number: int
    order_index: int
    location_id: Optional[str] = None
    timeline: Optional[str] = None
    summary: Optional[str] = None
    purpose: Optional[str] = None
    content: Optional[str] = None
    word_count: int = 0
    characters: List[dict] = field(default_factory=list)  # [{"id": "char-1", "role": "protagonist"}]
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        """类型转换"""
        # 如果 characters 是字符串（从数据库读取），解析为列表
        if isinstance(self.characters, str):
            self.characters = json.loads(self.characters) if self.characters else []

    def to_dict(self) -> dict:
        """转换为字典"""
        return {
            "id": self.id,
            "chapter_id": self.chapter_id,
            "scene_number": self.scene_number,
            "order_index": self.order_index,
            "location_id": self.location_id,
            "timeline": self.timeline,
            "summary": self.summary,
            "purpose": self.purpose,
            "content": self.content,
            "word_count": self.word_count,
            "characters": self.characters,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict) -> "ChapterScene":
        """从字典创建"""
        return cls(
            id=data["id"],
            chapter_id=data["chapter_id"],
            scene_number=data["scene_number"],
            order_index=data["order_index"],
            location_id=data.get("location_id"),
            timeline=data.get("timeline"),
            summary=data.get("summary"),
            purpose=data.get("purpose"),
            content=data.get("content"),
            word_count=data.get("word_count", 0),
            characters=data.get("characters", []),
            created_at=datetime.fromisoformat(data["created_at"]) if isinstance(data.get("created_at"), str) else data.get("created_at", datetime.now()),
            updated_at=datetime.fromisoformat(data["updated_at"]) if isinstance(data.get("updated_at"), str) else data.get("updated_at", datetime.now()),
        )

    def add_character(self, character_id: str, role: str = "participant"):
        """添加场景中的人物"""
        if not any(c["id"] == character_id for c in self.characters):
            self.characters.append({"id": character_id, "role": role})

    def remove_character(self, character_id: str):
        """移除场景中的人物"""
        self.characters = [c for c in self.characters if c["id"] != character_id]

    def get_character_ids(self) -> List[str]:
        """获取场景中所有人物 ID"""
        return [c["id"] for c in self.characters]
