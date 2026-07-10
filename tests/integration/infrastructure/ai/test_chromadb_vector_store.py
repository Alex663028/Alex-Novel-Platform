"""ChromaDB 向量存储集成测试"""
import pytest
import tempfile
import shutil
from infrastructure.ai.chromadb_vector_store import ChromaDBVectorStore
from infrastructure.ai.openai_embedding_service import OpenAIEmbeddingService
import os


@pytest.fixture
def temp_dir():
    """创建临时目录"""
    temp_path = tempfile.mkdtemp()
    yield temp_path
    shutil.rmtree(temp_path)


@pytest.fixture
def vector_store(temp_dir):
    """创建测试用向量存储实例"""
    return ChromaDBVectorStore(persist_directory=temp_dir)


@pytest.fixture
def embedding_service():
    """创建 Embedding 服务（需要 OPENAI_API_KEY）"""
    if not os.getenv("OPENAI_API_KEY"):
        pytest.skip("OPENAI_API_KEY not set, skipping integration test")
    return OpenAIEmbeddingService()


@pytest.mark.asyncio
async def test_full_workflow_with_embeddings(vector_store, embedding_service):
    """测试完整工作流：文本 -> Embedding -> 存储 -> 检索"""
    collection = "test_chapters"
    await vector_store.create_collection(collection, dimension=1536)

    # 准备测试文本
    texts = [
        "林雪站在雪山之巅，寒风刺骨。",
        "李明在图书馆里翻阅古籍，寻找线索。",
        "雪山上的风越来越大，林雪感到一丝不安。"
    ]

    # 生成 embeddings 并插入
    for i, text in enumerate(texts):
        vector = await embedding_service.embed(text)
        await vector_store.insert(
            collection=collection,
            id=f"chapter_{i}",
            vector=vector,
            payload={"text": text, "chapter": i}
        )

    # 搜索：查找与"雪山"相关的内容
    query_vector = await embedding_service.embed("雪山上的场景")
    results = await vector_store.search(
        collection=collection,
        query_vector=query_vector,
        limit=2
    )

    # 验证结果
    assert len(results) == 2
    # 前两个结果应该都包含"雪山"或"林雪"
    assert any("雪" in results[0]["payload"]["text"] for _ in [0])
    assert results[0]["score"] > 0.5  # 相似度应该较高


@pytest.mark.asyncio
async def test_persistence(temp_dir, embedding_service):
    """测试持久化：重启后数据仍然存在"""
    collection = "test_persistence"

    # 第一个实例：插入数据
    store1 = ChromaDBVectorStore(persist_directory=temp_dir)
    await store1.create_collection(collection, dimension=1536)

    text = "这是一段测试文本"
    vector = await embedding_service.embed(text)
    await store1.insert(
        collection=collection,
        id="test_id",
        vector=vector,
        payload={"text": text}
    )

    # 模拟重启：创建新实例
    store2 = ChromaDBVectorStore(persist_directory=temp_dir)

    # 验证数据仍然存在
    query_vector = await embedding_service.embed("测试文本")
    results = await store2.search(
        collection=collection,
        query_vector=query_vector,
        limit=1
    )

    assert len(results) == 1
    assert results[0]["id"] == "test_id"
    assert results[0]["payload"]["text"] == text
