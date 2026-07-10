"""Character entity"""
from dataclasses import dataclass, field
from typing import List
from domain.cast.value_objects.character_id import CharacterId
from domain.cast.entities.story_event import StoryEvent


@dataclass
class Character:
    """Character entity

    Represents a character in the cast graph with their attributes and story events.
    """

    id: CharacterId
    name: str
    aliases: List[str] = field(default_factory=list)
    role: str = ""
    traits: str = ""
    note: str = ""
    story_events: List[StoryEvent] = field(default_factory=list)

    def __post_init__(self):
        if not self.name or not self.name.strip():
            raise ValueError("Character name cannot be empty")

    def add_story_event(self, event: StoryEvent) -> None:
        """Add a story event to the character

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
        """Remove a story event from the character

        Args:
            event_id: ID of the event to remove
        """
        self.story_events = [e for e in self.story_events if e.id != event_id]
