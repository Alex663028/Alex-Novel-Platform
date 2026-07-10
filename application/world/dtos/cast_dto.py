"""Cast DTOs"""
from dataclasses import dataclass
from typing import List, Optional, TYPE_CHECKING

if TYPE_CHECKING:
    from domain.cast.aggregates.cast_graph import CastGraph
    from domain.cast.entities.character import Character
    from domain.cast.entities.relationship import Relationship
    from domain.cast.entities.story_event import StoryEvent


@dataclass
class StoryEventDTO:
    """Story Event DTO"""
    id: str
    summary: str
    chapter_id: Optional[int]
    importance: str

    @classmethod
    def from_domain(cls, event: 'StoryEvent') -> 'StoryEventDTO':
        """Create DTO from domain object

        Args:
            event: StoryEvent domain object

        Returns:
            StoryEventDTO
        """
        return cls(
            id=event.id,
            summary=event.summary,
            chapter_id=event.chapter_id,
            importance=event.importance
        )


@dataclass
class CharacterDTO:
    """Character DTO"""
    id: str
    name: str
    aliases: List[str]
    role: str
    traits: str
    note: str
    story_events: List[StoryEventDTO]

    @classmethod
    def from_domain(cls, character: 'Character') -> 'CharacterDTO':
        """Create DTO from domain object

        Args:
            character: Character domain object

        Returns:
            CharacterDTO
        """
        return cls(
            id=character.id.value,
            name=character.name,
            aliases=character.aliases.copy(),
            role=character.role,
            traits=character.traits,
            note=character.note,
            story_events=[StoryEventDTO.from_domain(e) for e in character.story_events]
        )


@dataclass
class RelationshipDTO:
    """Relationship DTO"""
    id: str
    source_id: str
    target_id: str
    label: str
    note: str
    directed: bool
    story_events: List[StoryEventDTO]

    @classmethod
    def from_domain(cls, relationship: 'Relationship') -> 'RelationshipDTO':
        """Create DTO from domain object

        Args:
            relationship: Relationship domain object

        Returns:
            RelationshipDTO
        """
        return cls(
            id=relationship.id.value,
            source_id=relationship.source_id.value,
            target_id=relationship.target_id.value,
            label=relationship.label,
            note=relationship.note,
            directed=relationship.directed,
            story_events=[StoryEventDTO.from_domain(e) for e in relationship.story_events]
        )


@dataclass
class CastGraphDTO:
    """Cast Graph DTO"""
    version: int
    characters: List[CharacterDTO]
    relationships: List[RelationshipDTO]

    @classmethod
    def from_domain(cls, cast_graph: 'CastGraph') -> 'CastGraphDTO':
        """Create DTO from domain object

        Args:
            cast_graph: CastGraph domain object

        Returns:
            CastGraphDTO
        """
        return cls(
            version=cast_graph.version,
            characters=[CharacterDTO.from_domain(c) for c in cast_graph.characters],
            relationships=[RelationshipDTO.from_domain(r) for r in cast_graph.relationships]
        )


@dataclass
class CastSearchResultDTO:
    """Cast search result DTO"""
    characters: List[CharacterDTO]
    relationships: List[RelationshipDTO]

    @classmethod
    def from_domain_lists(cls, characters: List['Character'], relationships: List['Relationship']) -> 'CastSearchResultDTO':
        """Create DTO from domain lists

        Args:
            characters: List of Character domain objects
            relationships: List of Relationship domain objects

        Returns:
            CastSearchResultDTO
        """
        return cls(
            characters=[CharacterDTO.from_domain(c) for c in characters],
            relationships=[RelationshipDTO.from_domain(r) for r in relationships]
        )


@dataclass
class CharacterCoverageDTO:
    """Character coverage DTO"""
    id: str
    name: str
    mentioned: bool
    chapter_ids: List[int]


@dataclass
class BibleCharacterDTO:
    """Bible character DTO (for coverage analysis)"""
    name: str
    role: str
    in_novel_text: bool
    chapter_ids: List[int]


@dataclass
class QuotedTextDTO:
    """Quoted text DTO (for coverage analysis)"""
    text: str
    count: int
    chapter_ids: List[int]


@dataclass
class CastCoverageDTO:
    """Cast coverage analysis DTO"""
    chapter_files_scanned: int
    characters: List[CharacterCoverageDTO]
    bible_not_in_cast: List[BibleCharacterDTO]
    quoted_not_in_cast: List[QuotedTextDTO]
