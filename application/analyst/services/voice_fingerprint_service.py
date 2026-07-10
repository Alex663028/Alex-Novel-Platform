"""Voice fingerprint computation service."""
import re
from typing import List, Optional

from domain.novel.repositories.voice_fingerprint_repository import (
    VoiceFingerprintRepository,
)
from domain.novel.repositories.voice_vault_repository import VoiceVaultRepository


class VoiceFingerprintService:
    """Service for computing and managing voice fingerprints."""

    RECOMPUTE_THRESHOLD = 10  # Trigger recompute every N samples

    # Common Chinese adjectives for density calculation
    COMMON_ADJECTIVES = set(
        "美丽漂亮英俊帅气可爱温柔善良聪明勇敢坚强勤奋努力认真仔细小心谨慎"
        "大小高低长短粗细胖瘦快慢冷热新旧好坏多少轻重深浅明暗干湿软硬"
        "红橙黄绿青蓝紫黑白灰粉棕金银"
    )

    def __init__(
        self,
        fingerprint_repo: VoiceFingerprintRepository,
        sample_repo: VoiceVaultRepository,
    ):
        """Initialize service with repositories.

        Args:
            fingerprint_repo: Voice fingerprint repository
            sample_repo: Voice vault repository
        """
        self.fingerprint_repo = fingerprint_repo
        self.sample_repo = sample_repo

    def compute_fingerprint(self, samples: List[dict]) -> dict:
        """Compute fingerprint metrics from samples.

        Args:
            samples: List of voice sample dicts with 'content' field

        Returns:
            Dict with metrics: adjective_density, avg_sentence_length, sentence_count
        """
        if not samples:
            return {
                "adjective_density": 0.0,
                "avg_sentence_length": 0.0,
                "sentence_count": 0,
            }

        # Concatenate all sample content
        full_text = "".join(sample["content"] for sample in samples)

        # Calculate adjective density
        adjective_count = sum(1 for char in full_text if char in self.COMMON_ADJECTIVES)
        total_chars = len(full_text)
        adjective_density = (
            adjective_count / total_chars if total_chars > 0 else 0.0
        )

        # Calculate sentence metrics (split by Chinese punctuation)
        sentences = re.split(r"[。！？]", full_text)
        sentences = [s.strip() for s in sentences if s.strip()]
        sentence_count = len(sentences)
        avg_sentence_length = (
            sum(len(s) for s in sentences) / sentence_count if sentence_count > 0 else 0.0
        )

        return {
            "adjective_density": round(adjective_density, 4),
            "avg_sentence_length": round(avg_sentence_length, 2),
            "sentence_count": sentence_count,
        }

    def maybe_recompute(
        self, novel_id: str, pov_character_id: Optional[str] = None
    ) -> bool:
        """Check sample count and trigger recompute if threshold reached.

        Args:
            novel_id: Novel identifier
            pov_character_id: Optional POV character identifier

        Returns:
            True if recompute was triggered, False otherwise
        """
        # Get all samples for this novel/POV
        samples = self.sample_repo.get_by_novel(novel_id, pov_character_id)
        sample_count = len(samples)

        # Check if we should recompute
        if sample_count < self.RECOMPUTE_THRESHOLD:
            return False

        if sample_count % self.RECOMPUTE_THRESHOLD != 0:
            return False

        # Compute fingerprint
        metrics = self.compute_fingerprint(samples)

        # Upsert to database
        fingerprint_data = {
            "metrics": metrics,
            "sample_count": sample_count,
        }
        self.fingerprint_repo.upsert(novel_id, fingerprint_data, pov_character_id)

        return True
