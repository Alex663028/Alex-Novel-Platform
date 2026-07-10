"""Voice Vault Repository Interface"""
from abc import ABC, abstractmethod
from typing import List, Optional


class VoiceVaultRepository(ABC):
    """文风金库仓储接口"""

    @abstractmethod
    def append_sample(
        self,
        novel_id: str,
        chapter_number: int,
        scene_type: Optional[str],
        ai_original: str,
        author_refined: str,
        diff_analysis: str
    ) -> str:
        """
        添加文风样本

        Args:
            novel_id: 小说 ID
            chapter_number: 章节号
            scene_type: 场景类型（可选）
            ai_original: AI 原文
            author_refined: 作者改稿
            diff_analysis: 差异分析（JSON 字符串）

        Returns:
            sample_id: 样本 ID
        """
        pass

    @abstractmethod
    def list_samples(self, novel_id: str, limit: Optional[int] = None) -> List[dict]:
        """
        列出小说的文风样本

        Args:
            novel_id: 小说 ID
            limit: 限制返回数量（可选）

        Returns:
            样本列表
        """
        pass

    @abstractmethod
    def get_sample_count(self, novel_id: str) -> int:
        """
        获取小说的样本数量

        Args:
            novel_id: 小说 ID

        Returns:
            样本数量
        """
        pass

    @abstractmethod
    def get_by_novel(
        self, novel_id: str, pov_character_id: Optional[str] = None
    ) -> List[dict]:
        """
        获取小说的所有样本（用于指纹计算）

        Args:
            novel_id: 小说 ID
            pov_character_id: 可选的 POV 角色 ID

        Returns:
            样本列表，每个样本包含 content 字段
        """
        pass
