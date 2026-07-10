"""索引服务 - 协调嵌入和向量存储"""
from typing import List
from domain.ai.services.embedding_service import EmbeddingService
from domain.ai.services.vector_store import VectorStore
from domain.ai.services.chapter_summarizer import ChapterSummarizer


class IndexingService:
    """索引服务

    协调 EmbeddingService、VectorStore 和 ChapterSummarizer，
    提供章节索引、搜索和删除功能。
    """

    def __init__(
        self,
        embedding_service: EmbeddingService,
        vector_store: VectorStore,
        summarizer: ChapterSummarizer
    ):
        """初始化索引服务

        Args:
            embedding_service: 嵌入服务
            vector_store: 向量存储
            summarizer: 章节摘要生成器
        """
        self._embedding_service = embedding_service
        self._vector_store = vector_store
        self._summarizer = summarizer

    async def index_chapter(
        self,
        novel_id: str,
        chapter_number: int,
        content: str
    ) -> None:
        """索引一个章节

        将章节内容摘要化、向量化并存储到向量数据库中。

        Args:
            novel_id: 小说ID
            chapter_number: 章节编号
            content: 章节内容

        Raises:
            ValueError: 如果参数无效
            RuntimeError: 如果索引过程失败
        """
        # 1. 生成摘要
        summary = await self._summarizer.summarize(content)

        # 2. 生成嵌入向量
        vector = await self._embedding_service.embed(summary)

        # 3. 存储到向量数据库
        chapter_id = f"{novel_id}_{chapter_number}"
        payload = {
            "novel_id": novel_id,
            "chapter_number": chapter_number,
            "summary": summary
        }

        await self._vector_store.insert(
            collection="chapters",
            id=chapter_id,
            vector=vector,
            payload=payload
        )

    async def search_chapters(
        self,
        query: str,
        limit: int = 5
    ) -> List[dict]:
        """通过语义相似度搜索章节

        Args:
            query: 搜索查询文本
            limit: 返回结果数量限制，默认为 5

        Returns:
            搜索结果列表，每个元素包含:
            - id: 章节ID (格式: "{novel_id}_{chapter_number}")
            - score: 相似度分数
            - payload: 包含 novel_id, chapter_number, summary

        Raises:
            ValueError: 如果查询为空
            RuntimeError: 如果搜索失败
        """
        # 1. 将查询文本向量化
        query_vector = await self._embedding_service.embed(query)

        # 2. 在向量数据库中搜索
        results = await self._vector_store.search(
            collection="chapters",
            query_vector=query_vector,
            limit=limit
        )

        return results

    async def delete_chapter(
        self,
        novel_id: str,
        chapter_number: int
    ) -> None:
        """从索引中删除章节

        Args:
            novel_id: 小说ID
            chapter_number: 章节编号

        Raises:
            RuntimeError: 如果删除失败
        """
        chapter_id = f"{novel_id}_{chapter_number}"
        await self._vector_store.delete(
            collection="chapters",
            id=chapter_id
        )
