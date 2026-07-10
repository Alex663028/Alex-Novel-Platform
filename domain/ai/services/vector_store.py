# domain/ai/services/vector_store.py
from abc import ABC, abstractmethod
from typing import List


class VectorStore(ABC):
    """向量存储接口（领域服务）"""

    @abstractmethod
    async def insert(
        self,
        collection: str,
        id: str,
        vector: List[float],
        payload: dict
    ) -> None:
        """
        插入向量到集合中

        Args:
            collection: 集合名称
            id: 向量ID
            vector: 向量数据
            payload: 附加元数据
        """
        pass

    @abstractmethod
    async def search(
        self,
        collection: str,
        query_vector: List[float],
        limit: int
    ) -> List[dict]:
        """
        搜索相似向量

        Args:
            collection: 集合名称
            query_vector: 查询向量
            limit: 返回结果数量

        Returns:
            相似向量列表，每个元素包含 id, score, payload
        """
        pass

    @abstractmethod
    async def delete(
        self,
        collection: str,
        id: str
    ) -> None:
        """
        删除向量

        Args:
            collection: 集合名称
            id: 向量ID
        """
        pass

    @abstractmethod
    async def create_collection(
        self,
        collection: str,
        dimension: int
    ) -> None:
        """
        创建集合

        Args:
            collection: 集合名称
            dimension: 向量维度
        """
        pass

    @abstractmethod
    async def delete_collection(
        self,
        collection: str
    ) -> None:
        """
        删除集合

        Args:
            collection: 集合名称
        """
        pass

    @abstractmethod
    async def list_collections(self) -> List[str]:
        """
        列出所有集合

        Returns:
            集合名称列表
        """
        pass
