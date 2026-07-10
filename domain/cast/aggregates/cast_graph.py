"""Cast Graph aggregate root"""
from dataclasses import dataclass, field
from typing import List, Optional
from domain.cast.entities.character import Character
from domain.cast.entities.relationship import Relationship
from domain.cast.value_objects.character_id import CharacterId
from domain.cast.value_objects.relationship_id import RelationshipId
from domain.novel.value_objects.novel_id import NovelId


@dataclass
class CastGraph:
    """Cast Graph aggregate root

    Manages the character relationship graph for a novel.
    """

    id: str
    novel_id: NovelId
    version: int = 2
    characters: List[Character] = field(default_factory=list)
    relationships: List[Relationship] = field(default_factory=list)

    def add_character(self, character: Character) -> None:
        """Add a character to the cast graph

        Args:
            character: Character to add
        """
        # Check if character already exists
        existing_ids = {c.id for c in self.characters}
        if character.id in existing_ids:
            # Update existing character
            self.characters = [c if c.id != character.id else character for c in self.characters]
        else:
            self.characters.append(character)

    def remove_character(self, character_id: CharacterId) -> None:
        """Remove a character from the cast graph

        Also removes all relationships involving this character.

        Args:
            character_id: ID of the character to remove
        """
        self.characters = [c for c in self.characters if c.id != character_id]
        # Remove relationships involving this character
        self.relationships = [
            r for r in self.relationships
            if r.source_id != character_id and r.target_id != character_id
        ]

    def get_character(self, character_id: CharacterId) -> Optional[Character]:
        """Get a character by ID

        Args:
            character_id: Character ID

        Returns:
            Character if found, None otherwise
        """
        for character in self.characters:
            if character.id == character_id:
                return character
        return None

    def add_relationship(self, relationship: Relationship) -> None:
        """Add a relationship to the cast graph

        Args:
            relationship: Relationship to add
        """
        # Validate that both characters exist
        source_exists = any(c.id == relationship.source_id for c in self.characters)
        target_exists = any(c.id == relationship.target_id for c in self.characters)

        if not source_exists:
            raise ValueError(f"Source character {relationship.source_id} does not exist")
        if not target_exists:
            raise ValueError(f"Target character {relationship.target_id} does not exist")

        # Check if relationship already exists
        existing_ids = {r.id for r in self.relationships}
        if relationship.id in existing_ids:
            # Update existing relationship
            self.relationships = [r if r.id != relationship.id else relationship for r in self.relationships]
        else:
            self.relationships.append(relationship)

    def remove_relationship(self, relationship_id: RelationshipId) -> None:
        """Remove a relationship from the cast graph

        Args:
            relationship_id: ID of the relationship to remove
        """
        self.relationships = [r for r in self.relationships if r.id != relationship_id]

    def get_relationship(self, relationship_id: RelationshipId) -> Optional[Relationship]:
        """Get a relationship by ID

        Args:
            relationship_id: Relationship ID

        Returns:
            Relationship if found, None otherwise
        """
        for relationship in self.relationships:
            if relationship.id == relationship_id:
                return relationship
        return None

    def search_characters(self, query: str) -> List[Character]:
        """Search characters by name, role, or traits

        Args:
            query: Search query

        Returns:
            List of matching characters
        """
        query_lower = query.lower()
        results = []

        for character in self.characters:
            # Search in name, aliases, role, traits, note
            searchable = [
                character.name,
                *character.aliases,
                character.role,
                character.traits,
                character.note
            ]

            if any(query_lower in field.lower() for field in searchable if field):
                results.append(character)

        return results

    def search_relationships(self, query: str) -> List[Relationship]:
        """Search relationships by label or note

        Args:
            query: Search query

        Returns:
            List of matching relationships
        """
        query_lower = query.lower()
        results = []

        for relationship in self.relationships:
            # Search in label and note
            searchable = [relationship.label, relationship.note]

            if any(query_lower in field.lower() for field in searchable if field):
                results.append(relationship)

        return results
