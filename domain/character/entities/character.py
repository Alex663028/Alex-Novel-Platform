from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from domain.shared.character_id import CharacterId
from domain.shared.time_utils import utcnow_iso
from domain.shared.exceptions import InvalidOperationError


@dataclass
class Character:
    """统一角色聚合根 — 唯一角色实体，供 Bible / Cast / 引擎共享。

    合并自：
    - domain.bible.entities.character (POV 防火墙 / reveal_chapter / relationships)
    - domain.cast.entities.character (aliases / traits / story_events)
    - domain.character.entities.character (心理画像 / 动态状态)
    """
    id: CharacterId
    name: str
    description: str = ""
    novel_id: str = ""
    gender: str = ""
    age: str = ""
    appearance: str = ""
    personality: str = ""
    background: str = ""
    core_motivation: str = ""
    inner_lack: str = ""
    public_profile: str = ""
    hidden_profile: str = ""
    reveal_chapter: Optional[int] = None
    role: str = ""
    faction_id: Optional[str] = None
    verbal_tic: str = ""
    idle_behavior: str = ""
    voice_style: str = ""
    sentence_pattern: str = ""
    speech_tempo: str = ""
    core_belief: str = ""
    moral_taboos: List[str] = field(default_factory=list)
    active_wounds: List[Dict[str, str]] = field(default_factory=list)
    mental_state: str = "NORMAL"
    mental_state_reason: str = ""
    emotional_arc: List[Dict[str, Any]] = field(default_factory=list)
    current_state_summary: str = ""
    last_updated_chapter: int = 0
    created_at: str = field(default_factory=utcnow_iso)
    updated_at: str = field(default_factory=utcnow_iso)
    # Bible 来源字段
    relationships: List[Any] = field(default_factory=list)
    voice_profile: Dict[str, Any] = field(default_factory=dict)
    # Cast 来源字段
    aliases: List[str] = field(default_factory=list)
    traits: str = ""
    note: str = ""
    story_events: List[Any] = field(default_factory=list)

    @property
    def character_id(self) -> CharacterId:
        """兼容旧版 Bible 接口（character_id → id）"""
        return self.id

    def update_state(
        self,
        chapter: int,
        mental_state: Optional[str] = None,
        summary: Optional[str] = None,
        arc_entry: Optional[Dict[str, Any]] = None,
    ) -> None:
        if mental_state:
            self.mental_state = mental_state
        if summary:
            self.current_state_summary = summary
        if arc_entry:
            self.emotional_arc.append(arc_entry)
        self.last_updated_chapter = chapter
        self.updated_at = utcnow_iso()

    def to_voice_lock(self) -> str:
        parts = [f"[角色声纹 - {self.name}]"]
        if self.core_belief:
            parts.append(f"核心信念: {self.core_belief}")
        if self.verbal_tic:
            parts.append(f"口头禅: {self.verbal_tic}")
        if self.voice_style:
            parts.append(f"语言风格: {self.voice_style}")
        if self.mental_state != "NORMAL":
            parts.append(f"当前状态: {self.mental_state}（{self.mental_state_reason}）")
        return "\n".join(parts)

    # ── Bible 方法 ──

    def add_relationship(self, relationship: Any) -> None:
        """添加关系（字符串或结构化 dict）"""
        if relationship in self.relationships:
            raise InvalidOperationError(f"Relationship already exists: {relationship}")
        self.relationships.append(relationship)

    def remove_relationship(self, relationship: str) -> None:
        """删除关系"""
        if relationship not in self.relationships:
            raise InvalidOperationError(f"Relationship not found: {relationship}")
        self.relationships.remove(relationship)

    def update_description(self, description: str) -> None:
        """更新描述"""
        if not description or not description.strip():
            raise ValueError("Description cannot be empty")
        self.description = description

    # ── Cast 方法 ──

    def add_story_event(self, event: Any) -> None:
        """添加故事事件"""
        existing_ids = {e.id for e in self.story_events if hasattr(e, "id")}
        if hasattr(event, "id") and event.id in existing_ids:
            self.story_events = [e if not hasattr(e, "id") or e.id != event.id else event for e in self.story_events]
        else:
            self.story_events.append(event)

    def remove_story_event(self, event_id: str) -> None:
        """删除故事事件"""
        self.story_events = [e for e in self.story_events if not hasattr(e, "id") or e.id != event_id]
