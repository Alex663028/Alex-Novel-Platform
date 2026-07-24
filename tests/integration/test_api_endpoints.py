"""API 集成测试

测试所有 API 端点的集成功能。
"""
import os
import tempfile

import pytest
from pathlib import Path
from fastapi.testclient import TestClient

from interfaces.main import app


SCHEMA_PATH = Path(__file__).resolve().parents[2] / "infrastructure" / "persistence" / "database" / "schema.sql"


def _build_client(db, monkeypatch):
    def mock_get_database():
        return db

    monkeypatch.setattr(
        "infrastructure.persistence.database.connection.get_database",
        mock_get_database,
    )
    monkeypatch.setattr(
        "interfaces.api.dependencies.get_database",
        mock_get_database,
    )
    monkeypatch.setattr(
        "interfaces.api.deps.services.get_database",
        mock_get_database,
    )
    return TestClient(app)


@pytest.fixture
def db(monkeypatch):
    """Temporary-file database with patched get_database."""
    from infrastructure.persistence.database.connection import DatabaseConnection

    fd, db_path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    db = DatabaseConnection(db_path)
    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
    db.get_connection().executescript(schema_sql)
    db.get_connection().commit()

    yield db
    try:
        db.close()
    except Exception:
        pass
    try:
        from infrastructure.persistence.database.connection import (
            _db_instance,
            _db_instances_by_path,
        )
        _db_instance = None
        _db_instances_by_path.clear()
    except Exception:
        pass
    try:
        from infrastructure.persistence.database.write_dispatch import clear_sqlite_writer_thread
        clear_sqlite_writer_thread()
    except Exception:
        pass
    try:
        os.unlink(db_path)
    except OSError:
        pass


@pytest.fixture
def client(db, monkeypatch):
    """FastAPI test client with mocked database."""
    return _build_client(db, monkeypatch)


@pytest.fixture(autouse=True)
def setup_test_env(monkeypatch, tmp_path):
    """设置测试环境，允许直连 SQLite 避免队列未就绪导致 database is locked"""
    test_output = tmp_path / "output"
    test_output.mkdir()
    monkeypatch.setenv("OUTPUT_DIR", str(test_output))
    monkeypatch.setenv("PLOTPILOT_ALLOW_DIRECT_SQLITE_WRITES", "true")
    monkeypatch.setenv("AITEXT_ALLOW_DIRECT_SQLITE_WRITES", "true")

    try:
        from infrastructure.persistence.database.connection import (
            _db_instance,
            _db_instances_by_path,
        )
        _db_instance = None
        _db_instances_by_path.clear()
    except Exception:
        pass
    try:
        from infrastructure.persistence.database.write_dispatch import clear_sqlite_writer_thread
        clear_sqlite_writer_thread()
    except Exception:
        pass

    yield

    if test_output.exists():
        import shutil
        shutil.rmtree(test_output)

    try:
        from infrastructure.persistence.database.connection import (
            _db_instance,
            _db_instances_by_path,
        )
        _db_instance = None
        _db_instances_by_path.clear()
    except Exception:
        pass
    try:
        from infrastructure.persistence.database.write_dispatch import clear_sqlite_writer_thread
        clear_sqlite_writer_thread()
    except Exception:
        pass


def test_root_endpoint(client, monkeypatch):
    """测试根路径（无前端构建时返回 JSON 欢迎信息）"""
    import interfaces.main as main_mod

    monkeypatch.setattr(main_mod, "_FRONTEND_DIR", Path("/__plotpilot_test_no_frontend__"))
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "Alex API"


def test_health_check(client):
    """测试健康检查"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_create_and_get_novel(client):
    """测试创建和获取小说"""
    response = client.post("/api/v1/novels/", json={
        "novel_id": "test-novel-1",
        "title": "测试小说",
        "author": "测试作者",
        "target_chapters": 10
    })
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "测试小说"
    assert data["author"] == "测试作者"
    assert data["target_chapters"] == 10

    response = client.get("/api/v1/novels/test-novel-1")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "测试小说"
    assert data["id"] == "test-novel-1"


def test_list_novels(client):
    """测试列出所有小说"""
    client.post("/api/v1/novels/", json={
        "novel_id": "test-novel-2",
        "title": "测试小说2",
        "author": "作者2",
        "target_chapters": 5
    })

    response = client.get("/api/v1/novels/")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_update_novel_stage(client):
    """测试更新小说阶段"""
    client.post("/api/v1/novels/", json={
        "novel_id": "test-novel-3",
        "title": "测试小说3",
        "author": "作者3",
        "target_chapters": 8
    })

    response = client.put("/api/v1/novels/test-novel-3/stage", json={
        "stage": "writing"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["stage"] == "writing"


def test_delete_novel(client):
    """测试删除小说"""
    client.post("/api/v1/novels/", json={
        "novel_id": "test-novel-4",
        "title": "测试小说4",
        "author": "作者4",
        "target_chapters": 3
    })

    response = client.delete("/api/v1/novels/test-novel-4")
    assert response.status_code == 204

    response = client.get("/api/v1/novels/test-novel-4")
    assert response.status_code == 404


def test_chapter_operations(client):
    """测试章节操作"""
    response = client.post("/api/v1/novels/", json={
        "novel_id": "test-novel-5",
        "title": "测试小说5",
        "author": "作者5",
        "target_chapters": 3
    })
    assert response.status_code == 201, f"create novel failed: {response.status_code} {response.text[:200]}"

    response = client.post("/api/v1/novels/test-novel-5/chapters", json={
        "chapter_id": "chapter-1",
        "number": 1,
        "title": "第一章",
        "content": "第一章内容"
    })
    assert response.status_code == 201, f"create chapter failed: {response.status_code} {response.text[:200]}"

    response = client.get("/api/v1/novels/test-novel-5/chapters/1")
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "第一章"


def test_bible_operations(client):
    """测试圣经/设定集操作"""
    response = client.post("/api/v1/novels/", json={
        "novel_id": "test-novel-6",
        "title": "测试小说6",
        "author": "作者6",
        "target_chapters": 5
    })
    assert response.status_code == 201, f"create novel failed: {response.status_code} {response.text[:200]}"

    response = client.post("/api/v1/bible/novels/test-novel-6/bible", json={
        "bible_id": "bible-1",
        "novel_id": "test-novel-6"
    })
    assert response.status_code == 201, f"create bible failed: {response.status_code} {response.text[:200]}"

    response = client.post("/api/v1/bible/novels/test-novel-6/bible/world-settings", json={
        "setting_id": "world-1",
        "name": "世界观",
        "description": "测试世界观",
        "setting_type": "location"
    })
    assert response.status_code == 200, f"create world failed: {response.status_code} {response.text[:200]}"

    response = client.get("/api/v1/bible/novels/test-novel-6/bible")
    assert response.status_code == 200
    data = response.json()
    assert len(data["world_settings"]) == 1


def test_404_errors(client):
    """测试 404 错误"""
    response = client.get("/api/v1/novels/nonexistent")
    assert response.status_code == 404

    response = client.get("/api/v1/chapters/nonexistent")
    assert response.status_code == 404

    response = client.get("/api/v1/bible/novels/nonexistent/bible")
    assert response.status_code == 404


def test_novel_statistics(client):
    """测试小说统计信息"""
    client.post("/api/v1/novels/", json={
        "novel_id": "test-novel-7",
        "title": "测试小说7",
        "author": "作者7",
        "target_chapters": 10
    })

    response = client.get("/api/v1/novels/test-novel-7/statistics")
    assert response.status_code == 200
    data = response.json()
    assert "total_chapters" in data
    assert "total_words" in data
    assert "completed_chapters" in data
    assert "stage" in data
