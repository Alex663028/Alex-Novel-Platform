"""Cast repository interface"""
from abc import ABC, abstractmethod
from typing import Optional
from domain.cast.aggregates.cast_graph import CastGraph
from domain.novel.value_objects.novel_id import NovelId


class CastRepository(ABC):
    """Cast repository interface

    Defines the contract for persisting and retrieving cast graphs.
    """

    @abstractmethod
    def save(self, cast_graph: CastGraph) -> None:
        """Save a cast graph

        Args:
            cast_graph: Cast graph to save
        """
        pass

    @abstractmethod
    def get_by_novel_id(self, novel_id: NovelId) -> Optional[CastGraph]:
        """Get cast graph by novel ID

        Args:
            novel_id: Novel ID

        Returns:
            Cast graph if found, None otherwise
        """
        pass

    @abstractmethod
    def delete(self, novel_id: NovelId) -> None:
        """Delete cast graph by novel ID

        Args:
            novel_id: Novel ID
        """
        pass

    @abstractmethod
    def exists(self, novel_id: NovelId) -> bool:
        """Check if cast graph exists for novel

        Args:
            novel_id: Novel ID

        Returns:
            True if exists, False otherwise
        """
        pass
