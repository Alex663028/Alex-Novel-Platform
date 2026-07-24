"""端到端集成测试 - Novel 工作流（SQLite 架构版）

重写说明：原测试用 FileStorage（旧文件存储），当前架构已迁移到 SQLite。
测试脚手架改为 DatabaseConnection + SqliteNovelRepository + SqliteChapterRepository。
删除 test_novel_metadata_fields（has_bible/has_outline 文件检测在当前架构已移除）。
"""
import pytest
from pathlib import Path
from fastapi.testclient import TestClient
from infrastructure.persistence.database.connection import DatabaseConnection
from infrastructure.persistence.database.sqlite_novel_repository import SqliteNovelRepository
from infrastructure.persistence.database.sqlite_chapter_repository import SqliteChapterRepository
from application.core.services.novel_service import NovelService


SCHEMA_PATH = Path(__file__).resolve().parents[2] / "infrastructure" / "persistence" / "database" / "schema.sql"


class TestNovelWorkflow:
    """Novel 完整工作流集成测试"""

    @pytest.fixture
    def db(self, tmp_path, monkeypatch):
        """创建隔离磁盘 SQLite 数据库，避免 in-memory 单例缓存污染。"""
        db_path = tmp_path / "test.db"
        db = DatabaseConnection(str(db_path))
        schema_sql = SCHEMA_PATH.read_text(encoding="utf-8")
        db.get_connection().executescript(schema_sql)
        db.get_connection().commit()
        monkeypatch.setenv("PLOTPILOT_ALLOW_DIRECT_SQLITE_WRITES", "true")
        monkeypatch.setenv("AITEXT_ALLOW_DIRECT_SQLITE_WRITES", "true")
        yield db
        try:
            db.close()
        except Exception:
            pass

    @pytest.fixture
    def service(self, db):
        """创建完整的服务栈"""
        novel_repo = SqliteNovelRepository(db)
        chapter_repo = SqliteChapterRepository(db)
        return NovelService(novel_repo, chapter_repo)

    def test_complete_novel_workflow(self, service):
        """测试完整的小说创建和管理流程"""
        # 1. 创建小说
        novel_dto = service.create_novel(
            novel_id="test-novel",
            title="测试小说",
            author="测试作者",
            target_chapters=3
        )

        assert novel_dto.id == "test-novel"
        assert novel_dto.title == "测试小说"
        assert novel_dto.stage == "planning"
        assert len(novel_dto.chapters) == 0

        # 2. 添加第一章
        novel_dto = service.add_chapter(
            novel_id="test-novel",
            chapter_id="chapter-1",
            number=1,
            title="第一章：开始",
            content="这是第一章的内容。"
        )

        assert len(novel_dto.chapters) == 1
        assert novel_dto.chapters[0].title == "第一章：开始"
        assert novel_dto.total_word_count == 9

        # 3. 添加第二章
        novel_dto = service.add_chapter(
            novel_id="test-novel",
            chapter_id="chapter-2",
            number=2,
            title="第二章：发展",
            content="这是第二章的内容，更长一些。"
        )

        assert len(novel_dto.chapters) == 2
        assert novel_dto.total_word_count == 23

        # 4. 获取小说
        retrieved = service.get_novel("test-novel")
        assert retrieved is not None
        assert retrieved.id == "test-novel"
        assert len(retrieved.chapters) == 2

        # 5. 列出所有小说
        novels = service.list_novels()
        assert len(novels) == 1
        assert novels[0].id == "test-novel"

    def test_multiple_novels(self, service):
        """测试多本小说的管理"""
        # 创建第一本
        service.create_novel("novel-1", "小说一", "作者A", 5)
        # 创建第二本
        service.create_novel("novel-2", "小说二", "作者B", 10)

        # 列出所有小说
        novels = service.list_novels()
        assert len(novels) == 2
        titles = {n.title for n in novels}
        assert "小说一" in titles
        assert "小说二" in titles

        # 确保各小说独立
        novel1 = service.get_novel("novel-1")
        novel2 = service.get_novel("novel-2")
        assert novel1.title == "小说一"
        assert novel2.title == "小说二"
        assert novel1.author == "作者A"
        assert novel2.author == "作者B"
        assert novel1.target_chapters == 5
        assert novel2.target_chapters == 10

    def test_novel_with_multiple_chapters(self, service):
        """测试多章节管理"""
        service.create_novel("multi-chapter", "多章节小说", "作者", 10)

        # 添加5个章节
        for i in range(1, 6):
            service.add_chapter(
                novel_id="multi-chapter",
                chapter_id=f"ch-{i}",
                number=i,
                title=f"第{i}章",
                content=f"这是第{i}章的内容。"
            )

        # 验证
        novel = service.get_novel("multi-chapter")
        assert len(novel.chapters) == 5
        assert novel.total_word_count == 45  # 5 × 9 字

        # 验证章节顺序
        for i, chapter in enumerate(novel.chapters, 1):
            assert chapter.number == i
            assert chapter.title == f"第{i}章"
