"""无 knowledge 表行时仍能按 triples 读出事实（Bible 同步等场景）。"""
import sqlite3
from pathlib import Path

import pytest

from domain.novel.value_objects.novel_id import NovelId
from infrastructure.persistence.database.connection import DatabaseConnection
from infrastructure.persistence.database.sqlite_knowledge_repository import SqliteKnowledgeRepository

SCHEMA_PATH = (
    Path(__file__).resolve().parents[5] / "infrastructure" / "persistence" / "database" / "schema.sql"
)


@pytest.fixture
def repo(tmp_path):
    db_path = tmp_path / "t.db"
    conn = sqlite3.connect(str(db_path))
    conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    conn.execute(
        "INSERT INTO novels (id, title, slug, target_chapters) VALUES ('n1', 'T', 'slug1', 0)"
    )
    conn.execute(
        """
        INSERT INTO triples (
            id, novel_id, subject, predicate, object, chapter_number, note,
            entity_type, importance, location_type, description, first_appearance,
            confidence, source_type, subject_entity_id, object_entity_id
        ) VALUES (
            't-loc-1', 'n1', '青城', '地图地点', '青城', NULL, '',
            'location', 'normal', 'region', NULL, NULL,
            1.0, 'bible_generated', 'loc1', 'loc1'
        )
        """
    )
    conn.commit()
    conn.close()
    db = DatabaseConnection(str(db_path))
    return SqliteKnowledgeRepository(db)


def test_get_by_novel_id_returns_facts_without_knowledge_row(repo):
    sk = repo.get_by_novel_id(NovelId("n1"))
    assert sk is not None
    assert sk.premise_lock == ""
    assert sk.chapters == []
    assert len(sk.facts) == 1
    assert sk.facts[0].subject == "青城"
    assert sk.facts[0].entity_type == "location"
    assert sk.facts[0].source_type == "bible_generated"
