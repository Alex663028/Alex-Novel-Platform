import pytest
from domain.novel.value_objects.storyline_milestone import StorylineMilestone


class TestStorylineMilestone:
    """StorylineMilestone 值对象测试"""

    def test_create_milestone(self):
        """测试创建里程碑"""
        milestone = StorylineMilestone(
            order=1,
            title="First Meeting",
            description="Hero meets the mentor",
            target_chapter_start=5,
            target_chapter_end=7,
            prerequisites=["intro_complete"],
            triggers=["mentor_appears"]
        )

        assert milestone.order == 1
        assert milestone.title == "First Meeting"
        assert milestone.description == "Hero meets the mentor"
        assert milestone.target_chapter_start == 5
        assert milestone.target_chapter_end == 7
        assert milestone.prerequisites == ["intro_complete"]
        assert milestone.triggers == ["mentor_appears"]

    def test_milestone_is_frozen(self):
        """测试里程碑是不可变的"""
        milestone = StorylineMilestone(
            order=1,
            title="First Meeting",
            description="Hero meets the mentor",
            target_chapter_start=5,
            target_chapter_end=7,
            prerequisites=[],
            triggers=[]
        )

        with pytest.raises(AttributeError):
            milestone.order = 2

    def test_milestone_with_empty_lists(self):
        """测试创建没有前置条件和触发器的里程碑"""
        milestone = StorylineMilestone(
            order=0,
            title="Start",
            description="Beginning",
            target_chapter_start=1,
            target_chapter_end=1,
            prerequisites=[],
            triggers=[]
        )

        assert milestone.prerequisites == []
        assert milestone.triggers == []

    def test_milestone_order_validation_negative(self):
        """测试里程碑顺序验证 - 负数"""
        with pytest.raises(ValueError, match="Order must be non-negative"):
            StorylineMilestone(
                order=-1,
                title="Invalid",
                description="Invalid order",
                target_chapter_start=1,
                target_chapter_end=2,
                prerequisites=[],
                triggers=[]
            )

    def test_milestone_chapter_range_validation_invalid(self):
        """测试章节范围验证 - 结束章节小于开始章节"""
        with pytest.raises(ValueError, match="target_chapter_end must be >= target_chapter_start"):
            StorylineMilestone(
                order=1,
                title="Invalid Range",
                description="End before start",
                target_chapter_start=10,
                target_chapter_end=5,
                prerequisites=[],
                triggers=[]
            )

    def test_milestone_chapter_range_validation_zero(self):
        """测试章节范围验证 - 零或负数"""
        with pytest.raises(ValueError, match="Chapter numbers must be positive"):
            StorylineMilestone(
                order=1,
                title="Invalid",
                description="Zero chapter",
                target_chapter_start=0,
                target_chapter_end=1,
                prerequisites=[],
                triggers=[]
            )

        with pytest.raises(ValueError, match="Chapter numbers must be positive"):
            StorylineMilestone(
                order=1,
                title="Invalid",
                description="Negative chapter",
                target_chapter_start=1,
                target_chapter_end=-1,
                prerequisites=[],
                triggers=[]
            )

    def test_milestone_equality(self):
        """测试里程碑相等性"""
        milestone1 = StorylineMilestone(
            order=1,
            title="Meeting",
            description="First meeting",
            target_chapter_start=5,
            target_chapter_end=7,
            prerequisites=["intro"],
            triggers=["meet"]
        )
        milestone2 = StorylineMilestone(
            order=1,
            title="Meeting",
            description="First meeting",
            target_chapter_start=5,
            target_chapter_end=7,
            prerequisites=["intro"],
            triggers=["meet"]
        )
        milestone3 = StorylineMilestone(
            order=2,
            title="Meeting",
            description="First meeting",
            target_chapter_start=5,
            target_chapter_end=7,
            prerequisites=["intro"],
            triggers=["meet"]
        )

        assert milestone1 == milestone2
        assert milestone1 != milestone3

    def test_milestone_same_start_end_chapter(self):
        """测试开始和结束章节相同的里程碑"""
        milestone = StorylineMilestone(
            order=1,
            title="Single Chapter Event",
            description="Happens in one chapter",
            target_chapter_start=5,
            target_chapter_end=5,
            prerequisites=[],
            triggers=[]
        )

        assert milestone.target_chapter_start == 5
        assert milestone.target_chapter_end == 5
