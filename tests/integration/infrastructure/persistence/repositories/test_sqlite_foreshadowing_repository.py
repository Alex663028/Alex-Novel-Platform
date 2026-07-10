"""SqliteForeshadowingRepository 集成测试"""
from pathlib import Path

import pytest

from domain.novel.entities.foreshadowing_registry import ForeshadowingRegistry
from domain.novel.value_objects.foreshadowing import (
    Foreshadowing,
    ForeshadowingStatus,
    ImportanceLevel,
)
from domain.novel.value_objects.novel_id import NovelId
from infrastructure.persistence.database.connection import DatabaseConnection
from infrastructure.persistence.database.sqlite_foreshadowing_repository import (
    SqliteForeshadowingRepository,
)

# pathlib: parents[0]==parent；从本文件到仓库根需 parents[5]
SCHEMA_PATH = (
    Path(__file__).resolve().parents[5]
    / "infrastructure"
    / "persistence"
    / "database"
    / "schema.sql"
)


@pytest.fixture
def db():
    conn = DatabaseConnection(":memory:")
    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
    conn.get_connection().executescript(schema_sql)
    conn.get_connection().commit()
    yield conn
    conn.close()


@pytest.fixture
def repository(db):
    return SqliteForeshadowingRepository(db)


def _insert_novel(db: DatabaseConnection, novel_id: str = "test-novel") -> None:
    db.execute(
        "INSERT INTO novels (id, title, slug, target_chapters) VALUES (?, ?, ?, ?)",
        (novel_id, "T", novel_id, 10),
    )
    db.get_connection().commit()


def test_save_and_get(repository, db):
    _insert_novel(db)
    novel_id = NovelId("test-novel")
    registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

    foreshadowing = Foreshadowing(
        id="foreshadow-1",
        planted_in_chapter=1,
        description="神秘的预言",
        importance=ImportanceLevel.HIGH,
        status=ForeshadowingStatus.PLANTED,
        suggested_resolve_chapter=10,
    )
    registry.register(foreshadowing)

    repository.save(registry)
    retrieved = repository.get_by_novel_id(novel_id)

    assert retrieved is not None
    assert retrieved.id == "registry-1"
    assert retrieved.novel_id.value == "test-novel"
    assert len(retrieved.foreshadowings) == 1
    assert retrieved.foreshadowings[0].description == "神秘的预言"


def test_get_nonexistent_novel(repository, db):
    assert repository.get_by_novel_id(NovelId("missing")) is None


def test_delete(repository, db):
    _insert_novel(db)
    novel_id = NovelId("test-novel")
    registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

    repository.save(registry)
    assert repository.get_by_novel_id(novel_id) is not None
    assert repository.get_by_novel_id(novel_id).foreshadowings == []

    repository.delete(novel_id)
    row = db.fetch_one(
        "SELECT 1 FROM novel_foreshadow_registry WHERE novel_id = ?",
        (novel_id.value,),
    )
    assert row is None
    assert repository.get_by_novel_id(novel_id) is not None
    assert repository.get_by_novel_id(novel_id).foreshadowings == []


def test_save_with_multiple_foreshadowings(repository, db):
    _insert_novel(db)
    novel_id = NovelId("test-novel")
    registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

    registry.register(
        Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="第一个伏笔",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED,
        )
    )
    registry.register(
        Foreshadowing(
            id="foreshadow-2",
            planted_in_chapter=3,
            description="第二个伏笔",
            importance=ImportanceLevel.MEDIUM,
            status=ForeshadowingStatus.PLANTED,
            suggested_resolve_chapter=8,
        )
    )

    repository.save(registry)
    retrieved = repository.get_by_novel_id(novel_id)

    assert len(retrieved.foreshadowings) == 2
    assert retrieved.foreshadowings[0].id == "foreshadow-1"
    assert retrieved.foreshadowings[1].id == "foreshadow-2"


def test_save_with_resolved_foreshadowing(repository, db):
    _insert_novel(db)
    novel_id = NovelId("test-novel")
    registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

    registry.register(
        Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="已解决的伏笔",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.RESOLVED,
            resolved_in_chapter=5,
        )
    )

    repository.save(registry)
    retrieved = repository.get_by_novel_id(novel_id)

    assert len(retrieved.foreshadowings) == 1
    assert retrieved.foreshadowings[0].status == ForeshadowingStatus.RESOLVED
    assert retrieved.foreshadowings[0].resolved_in_chapter == 5


def test_overwrite_existing(repository, db):
    _insert_novel(db)
    novel_id = NovelId("test-novel")

    registry1 = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)
    registry1.register(
        Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="第一版",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.PLANTED,
        )
    )
    repository.save(registry1)

    registry2 = ForeshadowingRegistry(id="registry-2", novel_id=novel_id)
    registry2.register(
        Foreshadowing(
            id="foreshadow-2",
            planted_in_chapter=2,
            description="第二版",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED,
        )
    )
    repository.save(registry2)

    retrieved = repository.get_by_novel_id(novel_id)
    assert retrieved.id == "registry-2"
    assert len(retrieved.foreshadowings) == 1
    assert retrieved.foreshadowings[0].description == "第二版"
