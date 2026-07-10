from typing import List, Optional
from domain.shared.base_entity import BaseEntity
from domain.novel.value_objects.novel_id import NovelId
from domain.bible.entities.character import Character
from domain.bible.entities.world_setting import WorldSetting
from domain.bible.entities.location import Location
from domain.bible.entities.timeline_note import TimelineNote
from domain.bible.entities.style_note import StyleNote
from domain.bible.value_objects.character_id import CharacterId
from domain.shared.exceptions import InvalidOperationError


class Bible(BaseEntity):
    """Bible 聚合根 - 管理人物、世界设定、地点、时间线和风格笔记"""

    def __init__(self, id: str, novel_id: NovelId):
        super().__init__(id)
        self.novel_id = novel_id
        self._characters: List[Character] = []
        self._world_settings: List[WorldSetting] = []
        self._locations: List[Location] = []
        self._timeline_notes: List[TimelineNote] = []
        self._style_notes: List[StyleNote] = []

    @property
    def characters(self) -> List[Character]:
        """获取人物列表副本"""
        return self._characters.copy()

    @property
    def world_settings(self) -> List[WorldSetting]:
        """获取世界设定列表副本"""
        return self._world_settings.copy()

    @property
    def locations(self) -> List[Location]:
        """获取地点列表副本"""
        return self._locations.copy()

    @property
    def timeline_notes(self) -> List[TimelineNote]:
        """获取时间线笔记列表副本"""
        return self._timeline_notes.copy()

    @property
    def style_notes(self) -> List[StyleNote]:
        """获取风格笔记列表副本"""
        return self._style_notes.copy()

    def add_character(self, character: Character) -> None:
        """添加人物"""
        # 检查重复
        if any(c.character_id == character.character_id for c in self._characters):
            raise InvalidOperationError(
                f"Character with id '{character.character_id.value}' already exists"
            )
        self._characters.append(character)

    def remove_character(self, character_id: CharacterId) -> None:
        """删除人物"""
        character = self.get_character(character_id)
        if character is None:
            raise InvalidOperationError(
                f"Character with id '{character_id.value}' not found"
            )
        self._characters.remove(character)

    def get_character(self, character_id: CharacterId) -> Optional[Character]:
        """获取人物"""
        for character in self._characters:
            if character.character_id == character_id:
                return character
        return None

    def add_world_setting(self, setting: WorldSetting) -> None:
        """添加世界设定"""
        # 检查重复
        if any(s.id == setting.id for s in self._world_settings):
            raise InvalidOperationError(
                f"World setting with id '{setting.id}' already exists"
            )
        self._world_settings.append(setting)

    def remove_world_setting(self, setting_id: str) -> None:
        """删除世界设定"""
        setting = next((s for s in self._world_settings if s.id == setting_id), None)
        if setting is None:
            raise InvalidOperationError(
                f"World setting with id '{setting_id}' not found"
            )
        self._world_settings.remove(setting)

    def add_location(self, location: Location) -> None:
        """添加地点"""
        if any(loc.id == location.id for loc in self._locations):
            raise InvalidOperationError(
                f"Location with id '{location.id}' already exists"
            )
        self._locations.append(location)

    def remove_location(self, location_id: str) -> None:
        """删除地点"""
        location = next((loc for loc in self._locations if loc.id == location_id), None)
        if location is None:
            raise InvalidOperationError(
                f"Location with id '{location_id}' not found"
            )
        self._locations.remove(location)

    def add_timeline_note(self, note: TimelineNote) -> None:
        """添加时间线笔记"""
        if any(n.id == note.id for n in self._timeline_notes):
            raise InvalidOperationError(
                f"TimelineNote with id '{note.id}' already exists"
            )
        self._timeline_notes.append(note)

    def remove_timeline_note(self, note_id: str) -> None:
        """删除时间线笔记"""
        note = next((n for n in self._timeline_notes if n.id == note_id), None)
        if note is None:
            raise InvalidOperationError(
                f"TimelineNote with id '{note_id}' not found"
            )
        self._timeline_notes.remove(note)

    def add_style_note(self, note: StyleNote) -> None:
        """添加风格笔记"""
        if any(n.id == note.id for n in self._style_notes):
            raise InvalidOperationError(
                f"StyleNote with id '{note.id}' already exists"
            )
        self._style_notes.append(note)

    def remove_style_note(self, note_id: str) -> None:
        """删除风格笔记"""
        note = next((n for n in self._style_notes if n.id == note_id), None)
        if note is None:
            raise InvalidOperationError(
                f"StyleNote with id '{note_id}' not found"
            )
        self._style_notes.remove(note)
