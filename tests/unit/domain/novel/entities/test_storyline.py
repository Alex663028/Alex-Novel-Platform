import pytest
from domain.novel.entities.storyline import Storyline
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.storyline_type import StorylineType
from domain.novel.value_objects.storyline_status import StorylineStatus
from domain.novel.value_objects.storyline_milestone import StorylineMilestone


class TestStoryline:
    """Storyline 实体测试"""

    def test_create_storyline(self):
        """测试创建故事线"""
        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

        assert storyline.id == "storyline-1"
        assert storyline.novel_id == novel_id
        assert storyline.storyline_type == StorylineType.ROMANCE
        assert storyline.status == StorylineStatus.ACTIVE
        assert storyline.milestones == []
        assert storyline.current_milestone_index == 0
        assert storyline.estimated_chapter_start == 5
        assert storyline.estimated_chapter_end == 20

    def test_add_milestone(self):
        """测试添加里程碑"""
        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

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

        storyline.add_milestone(milestone1)
        storyline.add_milestone(milestone2)

        assert len(storyline.milestones) == 2
        assert storyline.milestones[0] == milestone1
        assert storyline.milestones[1] == milestone2

    def test_get_pending_milestones(self):
        """测试获取待完成里程碑"""
        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

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
        milestone3 = StorylineMilestone(
            order=2,
            title="Confession",
            description="Love confession",
            target_chapter_start=15,
            target_chapter_end=16,
            prerequisites=["date"],
            triggers=["confess"]
        )

        storyline.add_milestone(milestone1)
        storyline.add_milestone(milestone2)
        storyline.add_milestone(milestone3)

        # All milestones are pending initially
        pending = storyline.get_pending_milestones()
        assert len(pending) == 3
        assert pending[0] == milestone1
        assert pending[1] == milestone2
        assert pending[2] == milestone3

    def test_complete_milestone(self):
        """测试完成里程碑"""
        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

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

        storyline.add_milestone(milestone1)
        storyline.add_milestone(milestone2)

        # Complete first milestone
        storyline.complete_milestone(0)
        assert storyline.current_milestone_index == 1

        # Pending milestones should only include the second one
        pending = storyline.get_pending_milestones()
        assert len(pending) == 1
        assert pending[0] == milestone2

    def test_complete_milestone_invalid_order(self):
        """测试完成不存在的里程碑"""
        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

        milestone1 = StorylineMilestone(
            order=0,
            title="First Meeting",
            description="Hero meets love interest",
            target_chapter_start=5,
            target_chapter_end=6,
            prerequisites=[],
            triggers=["meet"]
        )

        storyline.add_milestone(milestone1)

        with pytest.raises(ValueError, match="Milestone with order 5 not found"):
            storyline.complete_milestone(5)

    def test_get_current_milestone(self):
        """测试获取当前里程碑"""
        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

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

        storyline.add_milestone(milestone1)
        storyline.add_milestone(milestone2)

        # Current milestone should be the first one
        current = storyline.get_current_milestone()
        assert current == milestone1

        # Complete first milestone
        storyline.complete_milestone(0)

        # Current milestone should be the second one
        current = storyline.get_current_milestone()
        assert current == milestone2

    def test_get_current_milestone_no_milestones(self):
        """测试获取当前里程碑 - 没有里程碑"""
        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

        current = storyline.get_current_milestone()
        assert current is None

    def test_get_current_milestone_all_completed(self):
        """测试获取当前里程碑 - 所有里程碑已完成"""
        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

        milestone1 = StorylineMilestone(
            order=0,
            title="First Meeting",
            description="Hero meets love interest",
            target_chapter_start=5,
            target_chapter_end=6,
            prerequisites=[],
            triggers=["meet"]
        )

        storyline.add_milestone(milestone1)
        storyline.complete_milestone(0)

        current = storyline.get_current_milestone()
        assert current is None

    def test_storyline_with_milestones_in_constructor(self):
        """测试在构造函数中传入里程碑"""
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

        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20,
            milestones=[milestone1],
            current_milestone_index=0
        )

        assert len(storyline.milestones) == 1
        assert storyline.milestones[0] == milestone1
        assert storyline.current_milestone_index == 0

    def test_complete_milestone_out_of_order(self):
        """测试完成里程碑 - 不按顺序完成"""
        novel_id = NovelId("novel-123")
        storyline = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.ROMANCE,
            status=StorylineStatus.ACTIVE,
            estimated_chapter_start=5,
            estimated_chapter_end=20
        )

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

        storyline.add_milestone(milestone1)
        storyline.add_milestone(milestone2)

        # Try to complete second milestone before first
        with pytest.raises(ValueError, match="Cannot complete milestone 1 before completing milestone 0"):
            storyline.complete_milestone(1)
