"""故事线系统集成测试（SQLite 架构版）

重写说明：原测试用 FileStorage（旧文件存储），当前架构已迁移到 SQLite。
测试脚手架改为 DatabaseConnection + SqliteStorylineRepository。
需要在 fixture 中预先插入 novels 记录，满足外键约束 storylines.novel_id → novels.id。
"""
import pytest
import tempfile
import shutil
from pathlib import Path
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.storyline_type import StorylineType
from domain.novel.value_objects.storyline_status import StorylineStatus
from domain.novel.value_objects.storyline_milestone import StorylineMilestone
from domain.novel.services.storyline_manager import StorylineManager
from infrastructure.persistence.database.connection import DatabaseConnection
from infrastructure.persistence.database.sqlite_storyline_repository import SqliteStorylineRepository


class TestStorylineIntegration:
    """故事线管理系统集成测试"""

    @pytest.fixture
    def db(self):
        """创建临时 SQLite 数据库"""
        temp_dir = tempfile.mkdtemp()
        db_path = Path(temp_dir) / "test.db"
        db = DatabaseConnection(str(db_path))
        yield db
        db.close()
        shutil.rmtree(temp_dir, ignore_errors=True)

    @pytest.fixture
    def storyline_manager(self, db):
        """创建故事线管理器，并预置测试用小说记录"""
        # 预置 novels 记录以满足外键约束：storylines.novel_id → novels.id
        test_novel_ids = ["novel-123", "novel-456", "novel-validation"]
        for nid in test_novel_ids:
            db.execute(
                "INSERT OR IGNORE INTO novels (id, title, slug, target_chapters) VALUES (?, ?, ?, ?)",
                (nid, f"小说-{nid}", nid, 10)
            )
        db.commit()

        repository = SqliteStorylineRepository(db)
        return StorylineManager(repository)

    def test_create_and_retrieve_storyline(self, storyline_manager):
        """测试创建和检索故事线"""
        novel_id = NovelId("novel-123")

        # Create storyline
        storyline = storyline_manager.create_storyline(
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

        assert storyline.id is not None
        assert storyline.novel_id == novel_id
        assert storyline.storyline_type == StorylineType.ROMANCE
        assert storyline.status == StorylineStatus.ACTIVE

        # Retrieve storyline
        retrieved = storyline_manager.repository.get_by_id(storyline.id)
        assert retrieved is not None
        assert retrieved.id == storyline.id
        assert retrieved.novel_id == novel_id

    def test_storyline_with_milestones_workflow(self, storyline_manager):
        """测试带有里程碑的故事线完整工作流"""
        novel_id = NovelId("novel-456")

        # Create storyline
        storyline = storyline_manager.create_storyline(
            novel_id=novel_id,
            storyline_type=StorylineType.MYSTERY,
            estimated_chapter_start=1,
            estimated_chapter_end=30
        )

        # Add milestones
        milestone1 = StorylineMilestone(
            order=0,
            title="Discovery",
            description="The mystery is discovered",
            target_chapter_start=1,
            target_chapter_end=3,
            prerequisites=[],
            triggers=["mystery_found"]
        )
        milestone2 = StorylineMilestone(
            order=1,
            title="Investigation",
            description="Clues are gathered",
            target_chapter_start=5,
            target_chapter_end=15,
            prerequisites=["mystery_found"],
            triggers=["clues_gathered"]
        )
        milestone3 = StorylineMilestone(
            order=2,
            title="Resolution",
            description="Mystery is solved",
            target_chapter_start=25,
            target_chapter_end=30,
            prerequisites=["clues_gathered"],
            triggers=["solved"]
        )

        storyline.add_milestone(milestone1)
        storyline.add_milestone(milestone2)
        storyline.add_milestone(milestone3)
        storyline_manager.repository.save(storyline)

        # Get pending milestones
        pending = storyline_manager.get_pending_milestones(storyline.id)
        assert len(pending) == 3
        assert pending[0].title == "Discovery"

        # Complete first milestone
        storyline_manager.complete_milestone(storyline.id, 0)

        # Check pending milestones again
        pending = storyline_manager.get_pending_milestones(storyline.id)
        assert len(pending) == 2
        assert pending[0].title == "Investigation"

        # Complete all milestones
        storyline_manager.complete_milestone(storyline.id, 1)
        storyline_manager.complete_milestone(storyline.id, 2)

        # All milestones should be completed
        pending = storyline_manager.get_pending_milestones(storyline.id)
        assert len(pending) == 0

    def test_multiple_storylines_for_novel(self, storyline_manager):
        """测试同一小说多个故事线"""
        novel_id = NovelId("novel-123")

        # Create multiple storylines
        romance = storyline_manager.create_storyline(
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            estimated_chapter_start=1,
            estimated_chapter_end=30
        )
        mystery = storyline_manager.create_storyline(
            novel_id=novel_id,
            storyline_type=StorylineType.MYSTERY,
            estimated_chapter_start=5,
            estimated_chapter_end=25
        )
        political = storyline_manager.create_storyline(
            novel_id=novel_id,
            storyline_type=StorylineType.POLITICAL,
            estimated_chapter_start=10,
            estimated_chapter_end=20
        )

        # Verify all exist
        assert romance.id is not None
        assert mystery.id is not None
        assert political.id is not None

        # Verify they are independent
        assert romance.storyline_type != mystery.storyline_type
        assert romance.estimated_chapter_start != political.estimated_chapter_start

    def test_delete_storyline(self, storyline_manager):
        """测试删除故事线"""
        novel_id = NovelId("novel-validation")

        # Create storyline
        storyline = storyline_manager.create_storyline(
            novel_id=novel_id,
            storyline_type=StorylineType.POLITICAL,
            estimated_chapter_start=1,
            estimated_chapter_end=50
        )

        storyline_id = storyline.id
        assert storyline_id is not None

        # Delete storyline
        storyline_manager.repository.delete(storyline_id)

        # Verify it's gone
        retrieved = storyline_manager.repository.get_by_id(storyline_id)
        assert retrieved is None

    def test_complete_milestone_validation(self, storyline_manager):
        """测试完成里程碑的验证"""
        novel_id = NovelId("novel-123")

        # Create storyline with milestones
        storyline = storyline_manager.create_storyline(
            novel_id=novel_id,
            storyline_type=StorylineType.POLITICAL,
            estimated_chapter_start=1,
            estimated_chapter_end=50
        )

        milestone1 = StorylineMilestone(
            order=0,
            title="First",
            description="First milestone",
            target_chapter_start=1,
            target_chapter_end=10,
            prerequisites=[],
            triggers=[]
        )
        milestone2 = StorylineMilestone(
            order=1,
            title="Second",
            description="Second milestone",
            target_chapter_start=20,
            target_chapter_end=30,
            prerequisites=[],
            triggers=[]
        )

        storyline.add_milestone(milestone1)
        storyline.add_milestone(milestone2)
        storyline_manager.repository.save(storyline)

        # Try to complete second milestone before first
        with pytest.raises(ValueError, match="Cannot complete milestone 1 before completing milestone 0"):
            storyline_manager.complete_milestone(storyline.id, 1)

        # Complete first milestone
        storyline_manager.complete_milestone(storyline.id, 0)

        # Now complete second milestone should work
        storyline_manager.complete_milestone(storyline.id, 1)

        # All milestones completed
        pending = storyline_manager.get_pending_milestones(storyline.id)
        assert len(pending) == 0