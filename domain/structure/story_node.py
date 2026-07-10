"""
故事结构节点领域模型
"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import List, Optional
import json


class NodeType(str, Enum):
    """节点类型"""
    PART = "part"
    VOLUME = "volume"
    ACT = "act"
    CHAPTER = "chapter"


class PlanningStatus(str, Enum):
    """规划状态"""
    DRAFT = "draft"              # 草稿（未规划）
    AI_GENERATED = "ai_generated"  # AI 已生成
    USER_EDITED = "user_edited"    # 用户已编辑
    CONFIRMED = "confirmed"        # 已确认


class PlanningSource(str, Enum):
    """规划来源"""
    MANUAL = "manual"        # 手动创建
    AI_MACRO = "ai_macro"    # AI 宏观规划
    AI_ACT = "ai_act"        # AI 幕级规划


@dataclass
class StoryNode:
    """故事结构节点"""
    id: str
    novel_id: str
    node_type: NodeType
    number: int
    title: str
    order_index: int
    parent_id: Optional[str] = None
    description: Optional[str] = None

    # 规划相关
    planning_status: PlanningStatus = PlanningStatus.DRAFT
    planning_source: PlanningSource = PlanningSource.MANUAL

    # 章节范围（仅用于 part/volume/act）
    chapter_start: Optional[int] = None
    chapter_end: Optional[int] = None
    chapter_count: int = 0
    suggested_chapter_count: Optional[int] = None

    # 章节内容（仅用于 chapter 类型）
    content: Optional[str] = None
    outline: Optional[str] = None
    word_count: int = 0
    status: str = "draft"

    # 结构化规划信息
    themes: List[str] = field(default_factory=list)
    key_events: List[str] = field(default_factory=list)
    narrative_arc: Optional[str] = None
    conflicts: List[str] = field(default_factory=list)

    # POV 视角（仅用于 chapter）
    pov_character_id: Optional[str] = None

    # 时间线（仅用于 chapter）
    timeline_start: Optional[str] = None
    timeline_end: Optional[str] = None

    # 元数据
    metadata: dict = field(default_factory=dict)

    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)

    def __post_init__(self):
        """类型转换"""
        if isinstance(self.node_type, str):
            self.node_type = NodeType(self.node_type)
        if isinstance(self.planning_status, str):
            self.planning_status = PlanningStatus(self.planning_status)
        if isinstance(self.planning_source, str):
            self.planning_source = PlanningSource(self.planning_source)

        # JSON 字段解析
        if isinstance(self.themes, str):
            self.themes = json.loads(self.themes) if self.themes else []
        if isinstance(self.key_events, str):
            self.key_events = json.loads(self.key_events) if self.key_events else []
        if isinstance(self.conflicts, str):
            self.conflicts = json.loads(self.conflicts) if self.conflicts else []
        if isinstance(self.metadata, str):
            self.metadata = json.loads(self.metadata) if self.metadata else {}

    def is_planned(self) -> bool:
        """是否已规划"""
        return self.planning_status in [
            PlanningStatus.AI_GENERATED,
            PlanningStatus.USER_EDITED,
            PlanningStatus.CONFIRMED
        ]

    def is_container(self) -> bool:
        """是否是容器节点（part/volume/act）"""
        return self.node_type in [NodeType.PART, NodeType.VOLUME, NodeType.ACT]

    def is_chapter(self) -> bool:
        """是否是章节节点"""
        return self.node_type == NodeType.CHAPTER

    def to_dict(self) -> dict:
        """转换为字典"""
        result = {
            "id": self.id,
            "novel_id": self.novel_id,
            "parent_id": self.parent_id,
            "node_type": self.node_type.value,
            "number": self.number,
            "title": self.title,
            "description": self.description,
            "order_index": self.order_index,

            # 规划相关
            "planning_status": self.planning_status.value,
            "planning_source": self.planning_source.value,

            "metadata": self.metadata,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

        # 章节范围（仅用于 part/volume/act）
        if self.is_container():
            result.update({
                "chapter_start": self.chapter_start,
                "chapter_end": self.chapter_end,
                "chapter_count": self.chapter_count,
                "suggested_chapter_count": self.suggested_chapter_count,
                "themes": self.themes,
            })

        # 幕级字段
        if self.node_type == NodeType.ACT:
            result.update({
                "key_events": self.key_events,
                "narrative_arc": self.narrative_arc,
                "conflicts": self.conflicts,
            })

        # 章节内容（仅用于 chapter）
        if self.is_chapter():
            result.update({
                "content": self.content,
                "outline": self.outline,
                "word_count": self.word_count,
                "status": self.status,
                "pov_character_id": self.pov_character_id,
                "timeline_start": self.timeline_start,
                "timeline_end": self.timeline_end,
            })

        return result

    @classmethod
    def from_dict(cls, data: dict) -> "StoryNode":
        """从字典创建"""
        return cls(
            id=data["id"],
            novel_id=data["novel_id"],
            parent_id=data.get("parent_id"),
            node_type=NodeType(data["node_type"]),
            number=data["number"],
            title=data["title"],
            description=data.get("description"),
            order_index=data["order_index"],

            # 规划相关
            planning_status=PlanningStatus(data.get("planning_status", "draft")),
            planning_source=PlanningSource(data.get("planning_source", "manual")),

            # 章节范围
            chapter_start=data.get("chapter_start"),
            chapter_end=data.get("chapter_end"),
            chapter_count=data.get("chapter_count", 0),
            suggested_chapter_count=data.get("suggested_chapter_count"),

            # 章节内容
            content=data.get("content"),
            outline=data.get("outline"),
            word_count=data.get("word_count", 0),
            status=data.get("status", "draft"),

            # 结构化规划信息
            themes=data.get("themes", []),
            key_events=data.get("key_events", []),
            narrative_arc=data.get("narrative_arc"),
            conflicts=data.get("conflicts", []),

            # POV 和时间线
            pov_character_id=data.get("pov_character_id"),
            timeline_start=data.get("timeline_start"),
            timeline_end=data.get("timeline_end"),

            # 元数据
            metadata=data.get("metadata", {}),

            created_at=datetime.fromisoformat(data["created_at"]) if isinstance(data.get("created_at"), str) else data.get("created_at", datetime.now()),
            updated_at=datetime.fromisoformat(data["updated_at"]) if isinstance(data.get("updated_at"), str) else data.get("updated_at", datetime.now()),
        )


@dataclass
class StoryTree:
    """故事结构树"""
    novel_id: str
    nodes: List[StoryNode] = field(default_factory=list)

    def get_root_nodes(self) -> List[StoryNode]:
        """获取根节点（part 节点）"""
        return [n for n in self.nodes if n.parent_id is None]

    def get_children(self, parent_id: str) -> List[StoryNode]:
        """获取子节点"""
        return sorted(
            [n for n in self.nodes if n.parent_id == parent_id],
            key=lambda n: n.order_index
        )

    def get_node_by_id(self, node_id: str) -> Optional[StoryNode]:
        """根据 ID 获取节点"""
        for node in self.nodes:
            if node.id == node_id:
                return node
        return None

    def to_hierarchical_dict(self) -> dict:
        """转换为层级字典"""
        def build_tree(parent_id: Optional[str] = None) -> List[dict]:
            children = self.get_children(parent_id) if parent_id else self.get_root_nodes()
            result = []
            for child in children:
                node_dict = child.to_dict()
                node_dict["children"] = build_tree(child.id)
                result.append(node_dict)
            return result

        return {
            "novel_id": self.novel_id,
            "nodes": build_tree()
        }

    def to_tree_dict(self) -> dict:
        """转换为树形字典（别名方法）"""
        return self.to_hierarchical_dict()
