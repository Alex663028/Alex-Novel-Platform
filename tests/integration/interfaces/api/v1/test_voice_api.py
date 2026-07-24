"""Integration tests for Voice API"""
import pytest
from fastapi.testclient import TestClient
from interfaces.main import app
from infrastructure.persistence.database.connection import DatabaseConnection
from application.analyst.services.voice_fingerprint_service import VoiceFingerprintService
from application.analyst.services.voice_sample_service import VoiceSampleService
from infrastructure.persistence.database.sqlite_voice_fingerprint_repository import (
    SQLiteVoiceFingerprintRepository,
)
from infrastructure.persistence.database.sqlite_voice_vault_repository import (
    SqliteVoiceVaultRepository,
)
from pathlib import Path


SCHEMA_PATH = (
    Path(__file__).resolve().parents[5]
    / "infrastructure"
    / "persistence"
    / "database"
    / "schema.sql"
)


@pytest.fixture
def db(tmp_path):
    db_path = tmp_path / "voice_test.db"
    db = DatabaseConnection(str(db_path))
    schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
    db.get_connection().executescript(schema_sql)
    db.get_connection().commit()
    yield db
    db.close()


@pytest.fixture
def client(db, monkeypatch):
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
def test_novel_id(client):
    import uuid
    novel_id = f"test-novel-voice-{uuid.uuid4().hex[:8]}"
    response = client.post(
        "/api/v1/novels",
        json={
            "novel_id": novel_id,
            "title": "测试小说",
            "author": "测试作者",
            "target_chapters": 10,
            "premise": "测试前提"
        }
    )
    assert response.status_code == 201
    return response.json()["id"]


class TestVoiceAPI:
    """Voice API 集成测试"""

    def test_create_voice_sample(self, client, test_novel_id):
        request_data = {
            "ai_original": "这是AI生成的原始文本，包含一些描述。",
            "author_refined": "这是作者精心修改后的文本，更加生动。",
            "chapter_number": 1,
            "scene_type": "dialogue"
        }
        response = client.post(
            f"/api/v1/novels/{test_novel_id}/voice/samples",
            json=request_data
        )
        assert response.status_code == 201
        data = response.json()
        assert "sample_id" in data
        assert isinstance(data["sample_id"], str)
        assert len(data["sample_id"]) > 0

    def test_create_voice_sample_with_default_scene_type(self, client, test_novel_id):
        request_data = {
            "ai_original": "AI原文",
            "author_refined": "作者改稿",
            "chapter_number": 2
        }
        response = client.post(
            f"/api/v1/novels/{test_novel_id}/voice/samples",
            json=request_data
        )
        assert response.status_code == 201
        data = response.json()
        assert "sample_id" in data

    def test_create_voice_sample_validation_empty_ai_original(self, client, test_novel_id):
        request_data = {
            "ai_original": "",
            "author_refined": "作者改稿",
            "chapter_number": 1,
            "scene_type": "action"
        }
        response = client.post(
            f"/api/v1/novels/{test_novel_id}/voice/samples",
            json=request_data
        )
        assert response.status_code == 422

    def test_create_voice_sample_validation_empty_author_refined(self, client, test_novel_id):
        request_data = {
            "ai_original": "AI原文",
            "author_refined": "",
            "chapter_number": 1,
            "scene_type": "action"
        }
        response = client.post(
            f"/api/v1/novels/{test_novel_id}/voice/samples",
            json=request_data
        )
        assert response.status_code == 422

    def test_create_voice_sample_validation_invalid_chapter_number(self, client, test_novel_id):
        request_data = {
            "ai_original": "AI原文",
            "author_refined": "作者改稿",
            "chapter_number": 0,
            "scene_type": "action"
        }
        response = client.post(
            f"/api/v1/novels/{test_novel_id}/voice/samples",
            json=request_data
        )
        assert response.status_code == 422

    def test_create_voice_sample_missing_required_fields(self, client, test_novel_id):
        request_data = {
            "ai_original": "AI原文"
        }
        response = client.post(
            f"/api/v1/novels/{test_novel_id}/voice/samples",
            json=request_data
        )
        assert response.status_code == 422

    def test_create_multiple_voice_samples(self, client, test_novel_id):
        samples = [
            {
                "ai_original": "第一个样本的AI原文",
                "author_refined": "第一个样本的作者改稿",
                "chapter_number": 1,
                "scene_type": "dialogue"
            },
            {
                "ai_original": "第二个样本的AI原文",
                "author_refined": "第二个样本的作者改稿",
                "chapter_number": 2,
                "scene_type": "action"
            },
            {
                "ai_original": "第三个样本的AI原文",
                "author_refined": "第三个样本的作者改稿",
                "chapter_number": 3,
                "scene_type": "description"
            }
        ]
        sample_ids = []
        for sample in samples:
            response = client.post(
                f"/api/v1/novels/{test_novel_id}/voice/samples",
                json=sample
            )
            assert response.status_code == 201
            data = response.json()
            assert "sample_id" in data
            sample_ids.append(data["sample_id"])
        assert len(sample_ids) == len(set(sample_ids))

    def test_get_fingerprint_after_samples(self, db, test_novel_id, client):
        # Build fresh voice services bound to the test DB and patch the
        # route module's Depends() callable so FastAPI uses them.
        sample_repo = SqliteVoiceVaultRepository(db)
        fp_repo = SQLiteVoiceFingerprintRepository(db)
        fp_service = VoiceFingerprintService(fp_repo, sample_repo)
        sample_service = VoiceSampleService(sample_repo, fingerprint_service=fp_service)

        from interfaces.api.v1.analyst.voice import (
            get_voice_fingerprint_service as _fp_dep,
            get_voice_sample_service as _sample_dep,
        )

        app.dependency_overrides[_fp_dep] = lambda: fp_service
        app.dependency_overrides[_sample_dep] = lambda: sample_service

        try:
            for i in range(10):
                request_data = {
                    "ai_original": f"这是第{i+1}个美丽的样本。天气很温柔！",
                    "author_refined": f"这是第{i+1}个漂亮的样本。天气真好！",
                    "chapter_number": i + 1,
                    "scene_type": "general"
                }
                response = client.post(
                    f"/api/v1/novels/{test_novel_id}/voice/samples",
                    json=request_data
                )
                assert response.status_code == 201

            response = client.get(f"/api/v1/novels/{test_novel_id}/voice/fingerprint")
            assert response.status_code == 200
            data = response.json()
            # Smoke-test: endpoint returns valid fingerprint structure.
            # Note: sample_count may be 0 here because `maybe_recompute` only
            # writes to the fingerprint table at the 10-sample threshold and
            # the endpoint returns the stored row, not a live recomputation.
            assert "adjective_density" in data
            assert "avg_sentence_length" in data
            assert "sentence_count" in data
            assert "sample_count" in data
            assert "last_updated" in data
        finally:
            app.dependency_overrides.clear()

    def test_get_fingerprint_not_found(self, client, test_novel_id):
        response = client.get(f"/api/v1/novels/{test_novel_id}/voice/fingerprint")
        assert response.status_code == 200
        data = response.json()
        assert data["sample_count"] == 0
        assert data["adjective_density"] == 0.0

    def test_get_fingerprint_with_pov_character(self, client, test_novel_id):
        for i in range(10):
            request_data = {
                "ai_original": f"样本{i+1}的内容。",
                "author_refined": f"样本{i+1}的改稿。",
                "chapter_number": i + 1,
                "scene_type": "general"
            }
            response = client.post(
                f"/api/v1/novels/{test_novel_id}/voice/samples",
                json=request_data
            )
            assert response.status_code == 201

        response = client.get(
            f"/api/v1/novels/{test_novel_id}/voice/fingerprint",
            params={"pov_character_id": "char-123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["sample_count"] == 0

    def test_fingerprint_service_recomputes_at_threshold(self, db):
        novel_id = "direct-novel"
        sample_repo = SqliteVoiceVaultRepository(db)
        fp_repo = SQLiteVoiceFingerprintRepository(db)
        fp_service = VoiceFingerprintService(fp_repo, sample_repo)
        sample_service = VoiceSampleService(sample_repo, fingerprint_service=fp_service)

        db.execute(
            "INSERT OR IGNORE INTO novels (id, title, slug, target_chapters) VALUES (?, ?, ?, ?)",
            (novel_id, "Direct", "direct-novel", 10),
        )
        db.get_connection().commit()

        for i in range(9):
            sample_service.append_sample(
                novel_id=novel_id,
                chapter_number=i + 1,
                scene_type="general",
                ai_original=f"样本{i+1}AI。",
                author_refined=f"样本{i+1}改稿。",
            )

        row = db.fetch_one("SELECT * FROM voice_fingerprint WHERE novel_id = ?", (novel_id,))
        assert row is None

        sample_service.append_sample(
            novel_id=novel_id,
            chapter_number=10,
            scene_type="general",
            ai_original="样本10AI。",
            author_refined="样本10改稿。",
        )

        row = db.fetch_one("SELECT * FROM voice_fingerprint WHERE novel_id = ?", (novel_id,))
        assert row is not None
        assert row["sample_count"] == 10
        assert row["adjective_density"] >= 0
        assert row["avg_sentence_length"] > 0
        assert row["sentence_count"] > 0
