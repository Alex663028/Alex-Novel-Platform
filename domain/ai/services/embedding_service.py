"""嵌入服务接口"""
from abc import ABC, abstractmethod
from typing import List


class EmbeddingService(ABC):
    """嵌入服务接口（领域服务）

    提供文本向量化功能，将文本转换为固定维度的向量表示。
    """

    @abstractmethod
    async def embed(self, text: str) -> List[float]:
        """生成单个文本的嵌入向量

        Args:
            text: 要嵌入的文本

        Returns:
            浮点数列表，表示文本的向量表示

        Raises:
            ValueError: 如果文本为空
            RuntimeError: 如果嵌入生成失败
        """
        pass

    @abstractmethod
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """批量生成文本的嵌入向量

        Args:
            texts: 要嵌入的文本列表

        Returns:
            嵌入向量列表，每个元素对应一个输入文本的向量

        Raises:
            ValueError: 如果文本列表为空或包含空文本
            RuntimeError: 如果嵌入生成失败
        """
        pass

    @abstractmethod
    def get_dimension(self) -> int:
        """获取嵌入向量的维度

        Returns:
            向量维度（整数）
        """
        pass
