"""Relationship entity"""
from dataclasses import dataclass, field
from typing import List
from domain.cast.value_objects.relationship_id import RelationshipId
from domain.cast.value_objects.character_id import CharacterId
from domain.cast.entities.story_event import StoryEvent


@dataclass
class Relationship:
    """Relationship entity

    Represents a relationship between two characters in the cast graph.
    """

    id: RelationshipId
    source_id: CharacterId
    target_id: CharacterId
    label: str = ""
    note: str = ""
    directed: bool = True
    story_events: List[StoryEvent] = field(default_factory=list)

    def __post_init__(self):
        if self.source_id == self.target_id:
            raise ValueError("Relationship cannot be between the same character")

    def add_story_event(self, event: StoryEvent) -> None:
        """Add a story event to the relationship

        Args:
            event: Story event to add
        """
        # Check if event with same ID already exists
        existing_ids = {e.id for e in self.story_events}
        if event.id in existing_ids:
            # Update existing event
            self.story_events = [e if e.id != event.id else event for e in self.story_events]
        else:
            self.story_events.append(event)

    def remove_story_event(self, event_id: str) -> None:
        """Remove a story event from the relationship

        Args:
            event_id: ID of the event to remove
        """
        self.story_events = [e for e in self.story_events if e.id != event_id]
