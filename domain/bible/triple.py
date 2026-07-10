"""
三元组（知识图谱关系）领域模型
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional, List
import json


class SourceType(str, Enum):
    """来源类型（与 triples.source_type 及 API 对齐）"""
    MANUAL = "manual"
    AUTO_INFERRED = "auto_inferred"  # 兼容旧 API，持久化为 chapter_inferred
    CHAPTER_INFERRED = "chapter_inferred"  # 章节/结构推断
    BIBLE_GENERATED = "bible_generated"  # 自动 Bible 写入
    AI_GENERATED = "ai_generated"


@dataclass
class Triple:
    """三元组（知识图谱关系）"""
    id: str
    novel_id: str
    subject_type: str  # character, location, item, organization, event
    subject_id: str
    predicate: str     # 关系类型，如：认识、熟悉、到访过、持有、参与等
    object_type: str   # character, location, item, organization, event
    object_id: str

    # 自动推断相关
    confidence: float = 1.0  # 置信度 (0.0-1.0)
    source_type: SourceType = SourceType.MANUAL
    source_chapter_id: Optional[str] = None  # 来源章节
    first_appearance: Optional[str] = None   # 首次出现（章节标题）
    related_chapters: List[str] = field(default_factory=list)  # 相关章节列表

    # 描述和属性
    description: Optional[str] = None
    tags: List[str] = field(default_factory=list)
    attributes: dict = field(default_factory=dict)

    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        """类型转换"""
        if isinstance(self.source_type, str):
            self.source_type = SourceType(self.source_type)

        # JSON 字段解析
        if isinstance(self.related_chapters, str):
            self.related_chapters = json.loads(self.related_chapters) if self.related_chapters else []
        if isinstance(self.tags, str):
            self.tags = json.loads(self.tags) if self.tags else []
        if isinstance(self.attributes, str):
            self.attributes = json.loads(self.attributes) if self.attributes else {}

    def is_auto_inferred(self) -> bool:
        """是否是自动推断的"""
        return self.source_type in (SourceType.AUTO_INFERRED, SourceType.CHAPTER_INFERRED)

    def is_confirmed(self) -> bool:
        """是否已确认（置信度为 1.0）"""
        return self.confidence >= 1.0

    def add_related_chapter(self, chapter_id: str):
        """添加相关章节"""
        if chapter_id not in self.related_chapters:
            self.related_chapters.append(chapter_id)
            self.updated_at = datetime.now()

    def increase_confidence(self, amount: float = 0.1):
        """提高置信度"""
        self.confidence = min(1.0, self.confidence + amount)
        self.updated_at = datetime.now()

    def confirm(self):
        """确认三元组（将置信度设为 1.0，来源改为手动）"""
        self.confidence = 1.0
        self.source_type = SourceType.MANUAL
        self.updated_at = datetime.now()

    def to_dict(self) -> dict:
        """转换为字典"""
        return {
            "id": self.id,
            "novel_id": self.novel_id,
            "subject_type": self.subject_type,
            "subject_id": self.subject_id,
            "predicate": self.predicate,
            "object_type": self.object_type,
            "object_id": self.object_id,

            "confidence": self.confidence,
            "source_type": self.source_type.value,
            "source_chapter_id": self.source_chapter_id,
            "first_appearance": self.first_appearance,
            "related_chapters": self.related_chapters,

            "description": self.description,
            "tags": self.tags,
            "attributes": self.attributes,

            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Triple":
        """从字典创建"""
        return cls(
            id=data["id"],
            novel_id=data["novel_id"],
            subject_type=data["subject_type"],
            subject_id=data["subject_id"],
            predicate=data["predicate"],
            object_type=data["object_type"],
            object_id=data["object_id"],

            confidence=data.get("confidence", 1.0),
            source_type=SourceType(data.get("source_type", "manual")),
            source_chapter_id=data.get("source_chapter_id"),
            first_appearance=data.get("first_appearance"),
            related_chapters=data.get("related_chapters", []),

            description=data.get("description"),
            tags=data.get("tags", []),
            attributes=data.get("attributes", {}),

            created_at=datetime.fromisoformat(data["created_at"]) if isinstance(data.get("created_at"), str) else data.get("created_at", datetime.now()),
            updated_at=datetime.fromisoformat(data["updated_at"]) if isinstance(data.get("updated_at"), str) else data.get("updated_at", datetime.now()),
        )

    def get_relation_key(self) -> tuple:
        """获取关系唯一键（用于去重和合并）"""
        return (
            self.subject_type,
            self.subject_id,
            self.predicate,
            self.object_type,
            self.object_id
        )
