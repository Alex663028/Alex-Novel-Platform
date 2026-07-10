"""Sandbox DTO for dialogue whitelist and simulation.

This module defines data transfer objects for sandbox simulation features,
including dialogue whitelist for scenario planning.
"""

from typing import List

from pydantic import BaseModel, Field


class DialogueEntry(BaseModel):
    """Represents a single dialogue entry available for sandbox simulation."""

    dialogue_id: str = Field(..., description="Unique identifier for the dialogue")
    chapter: int = Field(..., description="Chapter number where dialogue appears")
    speaker: str = Field(..., description="Character who speaks this dialogue")
    content: str = Field(..., description="The actual dialogue content")
    context: str = Field(..., description="Context summary for the dialogue")
    tags: List[str] = Field(default_factory=list, description="Associated tags")


class DialogueWhitelistResponse(BaseModel):
    """Response model for dialogue whitelist query."""

    dialogues: List[DialogueEntry] = Field(
        default_factory=list, description="List of available dialogues"
    )
    total_count: int = Field(..., description="Total number of dialogues")
