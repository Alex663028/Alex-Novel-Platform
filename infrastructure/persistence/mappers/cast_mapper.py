"""Cast mapper for persistence"""
from typing import Dict, Any, List, Optional
from domain.cast.aggregates.cast_graph import CastGraph
from domain.cast.entities.character import Character
from domain.cast.entities.relationship import Relationship
from domain.cast.entities.story_event import StoryEvent
from domain.cast.value_objects.character_id import CharacterId
from domain.cast.value_objects.relationship_id import RelationshipId
from domain.novel.value_objects.novel_id import NovelId


class CastMapper:
    """Mapper for converting between Cast domain objects and persistence format"""

    @staticmethod
    def to_dict(cast_graph: CastGraph) -> Dict[str, Any]:
        """Convert CastGraph to dictionary for persistence

        Args:
            cast_graph: Cast graph domain object

        Returns:
            Dictionary representation
        """
        return {
            "version": cast_graph.version,
            "characters": [
                CastMapper._character_to_dict(char) for char in cast_graph.characters
            ],
            "relationships": [
                CastMapper._relationship_to_dict(rel) for rel in cast_graph.relationships
            ]
        }

    @staticmethod
    def from_dict(data: Dict[str, Any], novel_id: str) -> CastGraph:
        """Convert dictionary to CastGraph domain object

        Args:
            data: Dictionary representation
            novel_id: Novel ID

        Returns:
            Cast graph domain object
        """
        cast_id = f"cast_{novel_id}"
        version = data.get("version", 2)

        characters = [
            CastMapper._character_from_dict(char_data)
            for char_data in data.get("characters", [])
        ]

        relationships = [
            CastMapper._relationship_from_dict(rel_data)
            for rel_data in data.get("relationships", [])
        ]

        return CastGraph(
            id=cast_id,
            novel_id=NovelId(novel_id),
            version=version,
            characters=characters,
            relationships=relationships
        )

    @staticmethod
    def _character_to_dict(character: Character) -> Dict[str, Any]:
        """Convert Character to dictionary

        Args:
            character: Character entity

        Returns:
            Dictionary representation
        """
        result = {
            "id": character.id.value,
            "name": character.name,
            "aliases": character.aliases,
            "role": character.role,
            "traits": character.traits,
            "note": character.note
        }

        if character.story_events:
            result["story_events"] = [
                CastMapper._story_event_to_dict(event)
                for event in character.story_events
            ]

        return result

    @staticmethod
    def _character_from_dict(data: Dict[str, Any]) -> Character:
        """Convert dictionary to Character

        Args:
            data: Dictionary representation

        Returns:
            Character entity
        """
        story_events = [
            CastMapper._story_event_from_dict(event_data)
            for event_data in data.get("story_events", [])
        ]

        return Character(
            id=CharacterId(data["id"]),
            name=data["name"],
            aliases=data.get("aliases", []),
            role=data.get("role", ""),
            traits=data.get("traits", ""),
            note=data.get("note", ""),
            story_events=story_events
        )

    @staticmethod
    def _relationship_to_dict(relationship: Relationship) -> Dict[str, Any]:
        """Convert Relationship to dictionary

        Args:
            relationship: Relationship entity

        Returns:
            Dictionary representation
        """
        result = {
            "id": relationship.id.value,
            "source_id": relationship.source_id.value,
            "target_id": relationship.target_id.value,
            "label": relationship.label,
            "note": relationship.note,
            "directed": relationship.directed
        }

        if relationship.story_events:
            result["story_events"] = [
                CastMapper._story_event_to_dict(event)
                for event in relationship.story_events
            ]

        return result

    @staticmethod
    def _relationship_from_dict(data: Dict[str, Any]) -> Relationship:
        """Convert dictionary to Relationship

        Args:
            data: Dictionary representation

        Returns:
            Relationship entity
        """
        story_events = [
            CastMapper._story_event_from_dict(event_data)
            for event_data in data.get("story_events", [])
        ]

        return Relationship(
            id=RelationshipId(data["id"]),
            source_id=CharacterId(data["source_id"]),
            target_id=CharacterId(data["target_id"]),
            label=data.get("label", ""),
            note=data.get("note", ""),
            directed=data.get("directed", True),
            story_events=story_events
        )

    @staticmethod
    def _story_event_to_dict(event: StoryEvent) -> Dict[str, Any]:
        """Convert StoryEvent to dictionary

        Args:
            event: Story event entity

        Returns:
            Dictionary representation
        """
        result = {
            "id": event.id,
            "summary": event.summary,
            "importance": event.importance
        }

        if event.chapter_id is not None:
            result["chapter_id"] = event.chapter_id

        return result

    @staticmethod
    def _story_event_from_dict(data: Dict[str, Any]) -> StoryEvent:
        """Convert dictionary to StoryEvent

        Args:
            data: Dictionary representation

        Returns:
            Story event entity
        """
        return StoryEvent(
            id=data["id"],
            summary=data["summary"],
            chapter_id=data.get("chapter_id"),
            importance=data.get("importance", "normal")
        )
