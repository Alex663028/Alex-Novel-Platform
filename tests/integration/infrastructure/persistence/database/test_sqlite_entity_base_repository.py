"""SQLite Entity Base Repository 集成测试"""
import pytest
import json
from pathlib import Path
from infrastructure.persistence.database.connection import DatabaseConnection
from infrastructure.persistence.database.sqlite_entity_base_repository import (
    SqliteEntityBaseRepository
)

SCHEMA_PATH = (
    Path(__file__).resolve().parents[5] / "infrastructure" / "persistence" / "database" / "schema.sql"
)


@pytest.fixture
def db():
    """内存数据库 fixture"""
    db = DatabaseConnection(":memory:")
    # 手动加载 schema（因为 DatabaseConnection 的 _ensure_database_exists 只在文件路径时加载）
    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
    db.get_connection().executescript(schema_sql)
    db.get_connection().commit()
    yield db
    db.close()


@pytest.fixture
def repository(db):
    """仓储 fixture"""
    return SqliteEntityBaseRepository(db)


def test_get_by_id_not_found(repository):
    """测试获取不存在的实体返回 None"""
    entity = repository.get_by_id("non-existent-id")
    assert entity is None


def test_create_and_get_entity(repository, db):
    """测试创建实体后可以获取"""
    # 先创建小说
    db.execute(
        "INSERT INTO novels (id, title, slug, target_chapters) VALUES (?, ?, ?, ?)",
        ("novel-1", "Test Novel", "test-novel", 10)
    )
    db.get_connection().commit()

    # 创建实体
    core_attributes = {
        "age": 25,
        "gender": "male",
        "occupation": "warrior"
    }

    entity_id = repository.create(
        novel_id="novel-1",
        entity_type="character",
        name="张三",
        core_attributes=core_attributes
    )

    # 验证返回的 ID 不为空
    assert entity_id
    assert isinstance(entity_id, str)

    # 获取实体
    entity = repository.get_by_id(entity_id)
    assert entity is not None
    assert entity["id"] == entity_id
    assert entity["novel_id"] == "novel-1"
    assert entity["entity_type"] == "character"
    assert entity["name"] == "张三"
    assert entity["core_attributes"] == core_attributes
    assert "created_at" in entity


def test_create_multiple_entities(repository, db):
    """测试创建多个实体"""
    # 先创建小说
    db.execute(
        "INSERT INTO novels (id, title, slug, target_chapters) VALUES (?, ?, ?, ?)",
        ("novel-1", "Test Novel", "test-novel", 10)
    )
    db.get_connection().commit()

    # 创建多个实体
    char_id = repository.create(
        "novel-1", "character", "主角", {"level": 1}
    )
    location_id = repository.create(
        "novel-1", "location", "城市A", {"population": 10000}
    )
    item_id = repository.create(
        "novel-1", "item", "神剑", {"power": 100}
    )

    # 验证每个实体都能获取
    char = repository.get_by_id(char_id)
    assert char["entity_type"] == "character"
    assert char["name"] == "主角"

    location = repository.get_by_id(location_id)
    assert location["entity_type"] == "location"
    assert location["name"] == "城市A"

    item = repository.get_by_id(item_id)
    assert item["entity_type"] == "item"
    assert item["name"] == "神剑"


def test_core_attributes_json_serialization(repository, db):
    """测试 core_attributes JSON 序列化/反序列化"""
    # 先创建小说
    db.execute(
        "INSERT INTO novels (id, title, slug, target_chapters) VALUES (?, ?, ?, ?)",
        ("novel-1", "Test Novel", "test-novel", 10)
    )
    db.get_connection().commit()

    # 复杂的 core_attributes 结构
    core_attributes = {
        "basic": {
            "age": 30,
            "gender": "female"
        },
        "skills": ["剑术", "魔法", "炼金"],
        "stats": {
            "hp": 100,
            "mp": 50,
            "strength": 15
        },
        "flags": {
            "is_alive": True,
            "is_leader": False
        }
    }

    entity_id = repository.create(
        "novel-1", "character", "复杂角色", core_attributes
    )

    # 获取并验证反序列化
    entity = repository.get_by_id(entity_id)
    assert entity is not None

    retrieved_attrs = entity["core_attributes"]
    assert isinstance(retrieved_attrs, dict)
    assert retrieved_attrs["basic"]["age"] == 30
    assert retrieved_attrs["skills"] == ["剑术", "魔法", "炼金"]
    assert retrieved_attrs["stats"]["hp"] == 100
    assert retrieved_attrs["flags"]["is_alive"] is True


def test_empty_core_attributes(repository, db):
    """测试空 core_attributes"""
    # 先创建小说
    db.execute(
        "INSERT INTO novels (id, title, slug, target_chapters) VALUES (?, ?, ?, ?)",
        ("novel-1", "Test Novel", "test-novel", 10)
    )
    db.get_connection().commit()

    entity_id = repository.create(
        "novel-1", "character", "简单角色", {}
    )

    entity = repository.get_by_id(entity_id)
    assert entity is not None
    assert entity["core_attributes"] == {}
