import pytest
from unittest.mock import Mock
from domain.novel.services.storyline_manager import StorylineManager
from domain.novel.entities.storyline import Storyline
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.storyline_type import StorylineType
from domain.novel.value_objects.storyline_status import StorylineStatus
from domain.novel.value_objects.storyline_milestone import StorylineMilestone
from domain.novel.repositories.storyline_repository import StorylineRepository


class TestStorylineManager:
    """StorylineManager 领域服务测试"""

    def test_create_storyline(self):
        """测试创建故事线"""
        mock_repo = Mock(spec=StorylineRepository)
        manager = StorylineManager(mock_repo)

        novel_id = NovelId("novel-123")
        storyline = manager.create_storyline(
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

        assert storyline.novel_id == novel_id
        assert storyline.storyline_type == StorylineType.ROMANCE
        assert storyline.status == StorylineStatus.ACTIVE
        assert storyline.estimated_chapter_start == 5
        assert storyline.estimated_chapter_end == 20
        assert storyline.milestones == []
        assert storyline.current_milestone_index == 0

        # Verify save was called
        mock_repo.save.assert_called_once_with(storyline)

    def test_get_pending_milestones(self):
        """测试获取待完成里程碑"""
        mock_repo = Mock(spec=StorylineRepository)
        manager = StorylineManager(mock_repo)

        novel_id = NovelId("novel-123")
        milestone1 = StorylineMilestone(
            order=0,
            title="First Meeting",
            description="Hero meets love interest",
            target_chapter_start=5,
            target_chapter_end=6,
            prerequisites=[],
            triggers=["meet"]
        )
        milestone2 = StorylineMilestone(
            order=1,
            title="First Date",
            description="They go on a date",
            target_chapter_start=8,
            target_chapter_end=9,
            prerequisites=["meet"],
            triggers=["date"]
        )

        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20,
            milestones=[milestone1, milestone2],
            current_milestone_index=0
        )

        mock_repo.get_by_id.return_value = storyline

        pending = manager.get_pending_milestones("storyline-1")

        assert len(pending) == 2
        assert pending[0] == milestone1
        assert pending[1] == milestone2
        mock_repo.get_by_id.assert_called_once_with("storyline-1")

    def test_get_pending_milestones_not_found(self):
        """测试获取待完成里程碑 - 故事线不存在"""
        mock_repo = Mock(spec=StorylineRepository)
        mock_repo.get_by_id.return_value = None
        manager = StorylineManager(mock_repo)

        with pytest.raises(ValueError, match="Storyline storyline-1 not found"):
            manager.get_pending_milestones("storyline-1")

    def test_complete_milestone(self):
        """测试完成里程碑"""
        mock_repo = Mock(spec=StorylineRepository)
        manager = StorylineManager(mock_repo)

        novel_id = NovelId("novel-123")
        milestone1 = StorylineMilestone(
            order=0,
            title="First Meeting",
            description="Hero meets love interest",
            target_chapter_start=5,
            target_chapter_end=6,
            prerequisites=[],
            triggers=["meet"]
        )
        milestone2 = StorylineMilestone(
            order=1,
            title="First Date",
            description="They go on a date",
            target_chapter_start=8,
            target_chapter_end=9,
            prerequisites=["meet"],
            triggers=["date"]
        )

        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20,
            milestones=[milestone1, milestone2],
            current_milestone_index=0
        )

        mock_repo.get_by_id.return_value = storyline

        manager.complete_milestone("storyline-1", 0)

        assert storyline.current_milestone_index == 1
        mock_repo.save.assert_called_once_with(storyline)

    def test_complete_milestone_not_found(self):
        """测试完成里程碑 - 故事线不存在"""
        mock_repo = Mock(spec=StorylineRepository)
        mock_repo.get_by_id.return_value = None
        manager = StorylineManager(mock_repo)

        with pytest.raises(ValueError, match="Storyline storyline-1 not found"):
            manager.complete_milestone("storyline-1", 0)

    def test_get_storyline_context(self):
        """测试获取故事线上下文"""
        mock_repo = Mock(spec=StorylineRepository)
        manager = StorylineManager(mock_repo)

        novel_id = NovelId("novel-123")
        milestone1 = StorylineMilestone(
            order=0,
            title="First Meeting",
            description="Hero meets love interest",
            target_chapter_start=5,
            target_chapter_end=6,
            prerequisites=[],
            triggers=["meet"]
        )
        milestone2 = StorylineMilestone(
            order=1,
            title="First Date",
            description="They go on a date",
            target_chapter_start=8,
            target_chapter_end=9,
            prerequisites=["meet"],
            triggers=["date"]
        )

        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20,
            milestones=[milestone1, milestone2],
            current_milestone_index=1
        )

        mock_repo.get_by_id.return_value = storyline

        context = manager.get_storyline_context("storyline-1")

        assert "romance" in context.lower()
        assert "active" in context.lower()
        assert "First Date" in context
        assert "They go on a date" in context
        assert "8" in context
        assert "9" in context

    def test_get_storyline_context_not_found(self):
        """测试获取故事线上下文 - 故事线不存在"""
        mock_repo = Mock(spec=StorylineRepository)
        mock_repo.get_by_id.return_value = None
        manager = StorylineManager(mock_repo)

        with pytest.raises(ValueError, match="Storyline storyline-1 not found"):
            manager.get_storyline_context("storyline-1")

    def test_get_storyline_context_no_current_milestone(self):
        """测试获取故事线上下文 - 没有当前里程碑"""
        mock_repo = Mock(spec=StorylineRepository)
        manager = StorylineManager(mock_repo)

        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.COMPLETED,
            estimated_chapter_start=5,
            estimated_chapter_end=20,
            milestones=[],
            current_milestone_index=0
        )

        mock_repo.get_by_id.return_value = storyline

        context = manager.get_storyline_context("storyline-1")

        assert "romance" in context.lower()
        assert "completed" in context.lower()
        assert "No current milestone" in context
