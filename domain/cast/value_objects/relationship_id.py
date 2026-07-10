"""Relationship ID value object"""
from dataclasses import dataclass


@dataclass(frozen=True)
class RelationshipId:
    """Relationship ID value object"""

    value: str

    def __post_init__(self):
        if not self.value or not self.value.strip():
            raise ValueError("Relationship ID cannot be empty")

    def __str__(self) -> str:
        return self.value
