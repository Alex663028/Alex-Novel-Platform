"""ChromaDB 向量存储单元测试"""
import pytest
import tempfile
import shutil
from pathlib import Path
from infrastructure.ai.chromadb_vector_store import ChromaDBVectorStore


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


@pytest.mark.asyncio
async def test_create_collection(vector_store):
    """测试创建集合"""
    await vector_store.create_collection("test_collection", dimension=128)
    collections = await vector_store.list_collections()
    assert "test_collection" in collections


@pytest.mark.asyncio
async def test_insert_and_search(vector_store):
    """测试插入和搜索向量"""
    collection = "test_collection"
    await vector_store.create_collection(collection, dimension=3)

    # 插入测试向量
    await vector_store.insert(
        collection=collection,
        id="vec1",
        vector=[1.0, 0.0, 0.0],
        payload={"text": "第一个向量", "chapter": 1}
    )
    await vector_store.insert(
        collection=collection,
        id="vec2",
        vector=[0.0, 1.0, 0.0],
        payload={"text": "第二个向量", "chapter": 2}
    )
    await vector_store.insert(
        collection=collection,
        id="vec3",
        vector=[0.9, 0.1, 0.0],
        payload={"text": "第三个向量", "chapter": 1}
    )

    # 搜索相似向量
    results = await vector_store.search(
        collection=collection,
        query_vector=[1.0, 0.0, 0.0],
        limit=2
    )

    assert len(results) == 2
    assert results[0]["id"] == "vec1"  # 最相似
    assert results[0]["payload"]["text"] == "第一个向量"
    assert results[1]["id"] == "vec3"  # 次相似


@pytest.mark.asyncio
async def test_delete_vector(vector_store):
    """测试删除向量"""
    collection = "test_collection"
    await vector_store.create_collection(collection, dimension=3)

    # 插入向量
    await vector_store.insert(
        collection=collection,
        id="vec1",
        vector=[1.0, 0.0, 0.0],
        payload={"text": "测试向量"}
    )

    # 删除向量
    await vector_store.delete(collection=collection, id="vec1")

    # 验证已删除
    results = await vector_store.search(
        collection=collection,
        query_vector=[1.0, 0.0, 0.0],
        limit=1
    )
    assert len(results) == 0


@pytest.mark.asyncio
async def test_delete_collection(vector_store):
    """测试删除集合"""
    collection = "test_collection"
    await vector_store.create_collection(collection, dimension=3)

    # 删除集合
    await vector_store.delete_collection(collection)

    # 验证集合已删除
    collections = await vector_store.list_collections()
    assert collection not in collections


@pytest.mark.asyncio
async def test_list_collections(vector_store):
    """测试列出所有集合"""
    await vector_store.create_collection("collection1", dimension=3)
    await vector_store.create_collection("collection2", dimension=3)

    collections = await vector_store.list_collections()
    assert "collection1" in collections
    assert "collection2" in collections


@pytest.mark.asyncio
async def test_upsert_behavior(vector_store):
    """测试更新插入行为（相同 ID 会覆盖）"""
    collection = "test_collection"
    await vector_store.create_collection(collection, dimension=3)

    # 首次插入
    await vector_store.insert(
        collection=collection,
        id="vec1",
        vector=[1.0, 0.0, 0.0],
        payload={"text": "原始文本"}
    )

    # 相同 ID 再次插入（应该覆盖）
    await vector_store.insert(
        collection=collection,
        id="vec1",
        vector=[0.0, 1.0, 0.0],
        payload={"text": "更新文本"}
    )

    # 搜索验证
    results = await vector_store.search(
        collection=collection,
        query_vector=[0.0, 1.0, 0.0],
        limit=1
    )

    assert len(results) == 1
    assert results[0]["id"] == "vec1"
    assert results[0]["payload"]["text"] == "更新文本"
