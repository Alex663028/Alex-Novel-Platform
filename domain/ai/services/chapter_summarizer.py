# domain/ai/services/chapter_summarizer.py
from abc import ABC, abstractmethod


class ChapterSummarizer(ABC):
    """章节摘要生成器接口（领域服务）"""

    @abstractmethod
    async def summarize(self, content: str, max_length: int = 300) -> str:
        """生成章节摘要

        Args:
            content: 章节内容
            max_length: 摘要最大长度（字符数），默认 300

        Returns:
            生成的摘要文本

        Raises:
            ValueError: 当内容为空时
            RuntimeError: 当摘要生成失败时
        """
        pass
