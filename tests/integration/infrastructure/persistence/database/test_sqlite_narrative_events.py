"""测试 entity_base 和 narrative_events 表的存在性与结构（事件溯源架构）。"""
import sqlite3
from pathlib import Path

import pytest

SCHEMA_PATH = (
    Path(__file__).resolve().parents[5] / "infrastructure" / "persistence" / "database" / "schema.sql"
)


@pytest.fixture
def db_conn(tmp_path):
    """创建临时数据库并应用 schema。"""
    db_path = tmp_path / "test_narrative.db"
    conn = sqlite3.connect(str(db_path))
    conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
    yield conn
    conn.close()


def test_entity_base_table_exists(db_conn):
    """验证 entity_base 表存在且结构正确。"""
    cursor = db_conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='entity_base'"
    )
    assert cursor.fetchone() is not None, "entity_base 表不存在"

    # 验证列结构
    cursor = db_conn.execute("PRAGMA table_info(entity_base)")
    columns = {row[1]: row[2] for row in cursor.fetchall()}

    assert "id" in columns
    assert "novel_id" in columns
    assert "entity_type" in columns
    assert "name" in columns
    assert "core_attributes" in columns
    assert "created_at" in columns


def test_narrative_events_table_exists(db_conn):
    """验证 narrative_events 表存在且结构正确。"""
    cursor = db_conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='narrative_events'"
    )
    assert cursor.fetchone() is not None, "narrative_events 表不存在"

    # 验证列结构
    cursor = db_conn.execute("PRAGMA table_info(narrative_events)")
    columns = {row[1]: row[2] for row in cursor.fetchall()}

    assert "event_id" in columns
    assert "novel_id" in columns
    assert "chapter_number" in columns
    assert "event_summary" in columns
    assert "mutations" in columns
    assert "timestamp_ts" in columns


def test_entity_base_indexes_exist(db_conn):
    """验证 entity_base 索引存在。"""
    cursor = db_conn.execute(
        "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='entity_base'"
    )
    indexes = [row[0] for row in cursor.fetchall()]
    assert "idx_entity_base_novel" in indexes


def test_narrative_events_indexes_exist(db_conn):
    """验证 narrative_events 索引存在。"""
    cursor = db_conn.execute(
        "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='narrative_events'"
    )
    indexes = [row[0] for row in cursor.fetchall()]
    assert "idx_narrative_events_novel_chapter" in indexes


def test_entity_base_foreign_key_constraint(db_conn):
    """验证 entity_base 外键约束到 novels 表。"""
    cursor = db_conn.execute("PRAGMA foreign_key_list(entity_base)")
    fks = cursor.fetchall()
    assert len(fks) > 0
    assert any(fk[2] == "novels" for fk in fks)


def test_narrative_events_foreign_key_constraint(db_conn):
    """验证 narrative_events 外键约束到 novels 表。"""
    cursor = db_conn.execute("PRAGMA foreign_key_list(narrative_events)")
    fks = cursor.fetchall()
    assert len(fks) > 0
    assert any(fk[2] == "novels" for fk in fks)


def test_narrative_events_has_tags_column(db_conn):
    """验证 narrative_events 表包含 tags 列。"""
    cursor = db_conn.execute("PRAGMA table_info(narrative_events)")
    columns = {row[1]: row[2] for row in cursor.fetchall()}
    assert "tags" in columns, "tags 列不存在"
    assert columns["tags"] == "TEXT", "tags 列类型应为 TEXT"


def test_narrative_events_tags_default_empty_array(db_conn):
    """验证 tags 列默认值为空 JSON 数组。"""
    # 插入测试小说
    db_conn.execute(
        "INSERT INTO novels (id, title, slug) VALUES (?, ?, ?)",
        ("test-novel-1", "Test Novel", "test-novel")
    )

    # 插入事件但不指定 tags
    db_conn.execute(
        """INSERT INTO narrative_events (event_id, novel_id, chapter_number, event_summary, mutations)
           VALUES (?, ?, ?, ?, ?)""",
        ("evt-1", "test-novel-1", 1, "Test event", "[]")
    )

    # 验证默认值
    cursor = db_conn.execute(
        "SELECT tags FROM narrative_events WHERE event_id = ?",
        ("evt-1",)
    )
    tags = cursor.fetchone()[0]
    assert tags == "[]", f"默认 tags 应为 '[]'，实际为 {tags}"


def test_append_event_with_tags(db_conn):
    """验证可以插入带 tags 的事件。"""
    import json

    # 插入测试小说
    db_conn.execute(
        "INSERT INTO novels (id, title, slug) VALUES (?, ?, ?)",
        ("test-novel-2", "Test Novel 2", "test-novel-2")
    )

    # 插入带 tags 的事件
    tags = ["动机:冲动", "情绪:愤怒"]
    tags_json = json.dumps(tags, ensure_ascii=False)

    db_conn.execute(
        """INSERT INTO narrative_events (event_id, novel_id, chapter_number, event_summary, mutations, tags)
           VALUES (?, ?, ?, ?, ?, ?)""",
        ("evt-2", "test-novel-2", 1, "Character acts impulsively", "[]", tags_json)
    )

    # 验证插入成功
    cursor = db_conn.execute(
        "SELECT tags FROM narrative_events WHERE event_id = ?",
        ("evt-2",)
    )
    stored_tags = cursor.fetchone()[0]
    assert json.loads(stored_tags) == tags


def test_list_events_includes_tags(db_conn):
    """验证查询结果包含 tags 字段。"""
    import json

    # 插入测试小说
    db_conn.execute(
        "INSERT INTO novels (id, title, slug) VALUES (?, ?, ?)",
        ("test-novel-3", "Test Novel 3", "test-novel-3")
    )

    # 插入多个事件，有的有 tags，有的没有
    db_conn.execute(
        """INSERT INTO narrative_events (event_id, novel_id, chapter_number, event_summary, mutations, tags)
           VALUES (?, ?, ?, ?, ?, ?)""",
        ("evt-3a", "test-novel-3", 1, "Event with tags", "[]", '["标签1", "标签2"]')
    )

    db_conn.execute(
        """INSERT INTO narrative_events (event_id, novel_id, chapter_number, event_summary, mutations)
           VALUES (?, ?, ?, ?, ?)""",
        ("evt-3b", "test-novel-3", 2, "Event without tags", "[]")
    )

    # 查询所有事件
    cursor = db_conn.execute(
        """SELECT event_id, tags FROM narrative_events
           WHERE novel_id = ? ORDER BY chapter_number""",
        ("test-novel-3",)
    )
    rows = cursor.fetchall()

    assert len(rows) == 2
    assert json.loads(rows[0][1]) == ["标签1", "标签2"]
    assert json.loads(rows[1][1]) == []
