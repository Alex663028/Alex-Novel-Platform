"""Voice Sample Service"""
import json
import logging
from typing import Optional
from difflib import SequenceMatcher
from domain.novel.repositories.voice_vault_repository import VoiceVaultRepository

logger = logging.getLogger(__name__)


class VoiceSampleService:
    """文风样本服务"""

    def __init__(
        self,
        voice_vault_repository: VoiceVaultRepository,
        fingerprint_service=None,
    ):
        self.voice_vault_repository = voice_vault_repository
        self.fingerprint_service = fingerprint_service

    def append_sample(
        self,
        novel_id: str,
        chapter_number: int,
        scene_type: Optional[str],
        ai_original: str,
        author_refined: str
    ) -> str:
        """
        添加文风样本

        Args:
            novel_id: 小说 ID
            chapter_number: 章节号
            scene_type: 场景类型（可选）
            ai_original: AI 原文
            author_refined: 作者改稿

        Returns:
            sample_id: 样本 ID
        """
        # 计算差异分析
        diff_analysis = self._calculate_diff_analysis(ai_original, author_refined)
        diff_json = json.dumps(diff_analysis, ensure_ascii=False)

        # 保存到仓储
        sample_id = self.voice_vault_repository.append_sample(
            novel_id=novel_id,
            chapter_number=chapter_number,
            scene_type=scene_type,
            ai_original=ai_original,
            author_refined=author_refined,
            diff_analysis=diff_json
        )

        logger.info(
            f"Appended voice sample {sample_id} for novel {novel_id}, "
            f"chapter {chapter_number}, edit_distance={diff_analysis['edit_distance']}"
        )

        # Trigger fingerprint recompute if threshold reached
        if self.fingerprint_service:
            recomputed = self.fingerprint_service.maybe_recompute(novel_id)
            if recomputed:
                logger.info(f"Fingerprint recomputed for novel {novel_id}")

        return sample_id

    def _calculate_diff_analysis(self, ai_original: str, author_refined: str) -> dict:
        """
        计算差异分析

        Args:
            ai_original: AI 原文
            author_refined: 作者改稿

        Returns:
            差异分析字典
        """
        # 计算编辑距离（基于 SequenceMatcher）
        matcher = SequenceMatcher(None, ai_original, author_refined)
        similarity_ratio = matcher.ratio()
        edit_distance = self._levenshtein_distance(ai_original, author_refined)

        # 计算字符变化
        original_len = len(ai_original)
        refined_len = len(author_refined)
        added_chars = max(0, refined_len - original_len)
        removed_chars = max(0, original_len - refined_len)

        return {
            "edit_distance": edit_distance,
            "similarity_ratio": round(similarity_ratio, 4),
            "original_length": original_len,
            "refined_length": refined_len,
            "added_chars": added_chars,
            "removed_chars": removed_chars,
            "length_change": refined_len - original_len
        }

    def _levenshtein_distance(self, s1: str, s2: str) -> int:
        """
        计算 Levenshtein 编辑距离

        Args:
            s1: 字符串 1
            s2: 字符串 2

        Returns:
            编辑距离
        """
        if len(s1) < len(s2):
            return self._levenshtein_distance(s2, s1)

        if len(s2) == 0:
            return len(s1)

        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                # 插入、删除、替换的成本
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row

        return previous_row[-1]
