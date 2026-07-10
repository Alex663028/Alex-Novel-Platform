"""Voice fingerprint repository interface."""
from abc import ABC, abstractmethod
from typing import Optional


class VoiceFingerprintRepository(ABC):
    """Repository for voice fingerprint data."""

    @abstractmethod
    def get_by_novel(
        self, novel_id: str, pov_character_id: Optional[str] = None
    ) -> Optional[dict]:
        """Get fingerprint by novel ID and optional POV character.

        Args:
            novel_id: Novel identifier
            pov_character_id: Optional POV character identifier

        Returns:
            Fingerprint data dict or None if not found
        """
        pass

    @abstractmethod
    def upsert(
        self,
        novel_id: str,
        fingerprint_data: dict,
        pov_character_id: Optional[str] = None,
    ) -> str:
        """Insert or update fingerprint data.

        Args:
            novel_id: Novel identifier
            fingerprint_data: Fingerprint metrics
            pov_character_id: Optional POV character identifier

        Returns:
            Fingerprint ID (UUID)
        """
        pass
