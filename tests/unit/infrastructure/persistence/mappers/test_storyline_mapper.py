import pytest
from domain.novel.entities.storyline import Storyline
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.storyline_type import StorylineType
from domain.novel.value_objects.storyline_status import StorylineStatus
from domain.novel.value_objects.storyline_milestone import StorylineMilestone
from infrastructure.persistence.mappers.storyline_mapper import StorylineMapper


class TestStorylineMapper:
    """StorylineMapper 测试"""

    def test_to_dict(self):
        """测试将 Storyline 转换为字典"""
        novel_id = NovelId("novel-123")
        milestone1 = StorylineMilestone(
            order=0,
            title="First Meeting",
            description="Hero meets love interest",
            target_chapter_start=5,
            target_chapter_end=6,
            prerequisites=["intro"],
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

        data = StorylineMapper.to_dict(storyline)

        assert data["id"] == "storyline-1"
        assert data["novel_id"] == "novel-123"
        assert data["storyline_type"] == "romance"
        assert data["status"] == "active"
        assert data["estimated_chapter_start"] == 5
        assert data["estimated_chapter_end"] == 20
        assert data["current_milestone_index"] == 1
        assert len(data["milestones"]) == 2

        assert data["milestones"][0]["order"] == 0
        assert data["milestones"][0]["title"] == "First Meeting"
        assert data["milestones"][0]["description"] == "Hero meets love interest"
        assert data["milestones"][0]["target_chapter_start"] == 5
        assert data["milestones"][0]["target_chapter_end"] == 6
        assert data["milestones"][0]["prerequisites"] == ["intro"]
        assert data["milestones"][0]["triggers"] == ["meet"]

    def test_from_dict(self):
        """测试从字典创建 Storyline"""
        data = {
            "id": "storyline-1",
            "novel_id": "novel-123",
            "storyline_type": "romance",
            "status": "active",
            "estimated_chapter_start": 5,
            "estimated_chapter_end": 20,
            "current_milestone_index": 1,
            "milestones": [
                {
                    "order": 0,
                    "title": "First Meeting",
                    "description": "Hero meets love interest",
                    "target_chapter_start": 5,
                    "target_chapter_end": 6,
                    "prerequisites": ["intro"],
                    "triggers": ["meet"]
                },
                {
                    "order": 1,
                    "title": "First Date",
                    "description": "They go on a date",
                    "target_chapter_start": 8,
                    "target_chapter_end": 9,
                    "prerequisites": ["meet"],
                    "triggers": ["date"]
                }
            ]
        }

        storyline = StorylineMapper.from_dict(data)

        assert storyline.id == "storyline-1"
        assert storyline.novel_id == NovelId("novel-123")
        assert storyline.storyline_type == StorylineType.ROMANCE
        assert storyline.status == StorylineStatus.ACTIVE
        assert storyline.estimated_chapter_start == 5
        assert storyline.estimated_chapter_end == 20
        assert storyline.current_milestone_index == 1
        assert len(storyline.milestones) == 2

        assert storyline.milestones[0].order == 0
        assert storyline.milestones[0].title == "First Meeting"
        assert storyline.milestones[1].order == 1
        assert storyline.milestones[1].title == "First Date"

    def test_from_dict_missing_fields(self):
        """测试从字典创建 Storyline - 缺少必需字段"""
        data = {
            "id": "storyline-1",
            "novel_id": "novel-123"
        }

        with pytest.raises(ValueError, match="Missing required fields"):
            StorylineMapper.from_dict(data)

    def test_from_dict_invalid_enum(self):
        """测试从字典创建 Storyline - 无效的枚举值"""
        data = {
            "id": "storyline-1",
            "novel_id": "novel-123",
            "storyline_type": "invalid_type",
            "status": "active",
            "estimated_chapter_start": 5,
            "estimated_chapter_end": 20,
            "current_milestone_index": 0,
            "milestones": []
        }

        with pytest.raises(ValueError, match="Invalid storyline data format"):
            StorylineMapper.from_dict(data)

    def test_roundtrip(self):
        """测试往返转换"""
        novel_id = NovelId("novel-123")
        milestone = StorylineMilestone(
            order=0,
            title="Test",
            description="Test milestone",
            target_chapter_start=1,
            target_chapter_end=2,
            prerequisites=[],
            triggers=[]
        )

        original = Storyline(
            id="storyline-1",
            novel_id=novel_id,
            storyline_type=StorylineType.MYSTERY,
            status=StorylineStatus.COMPLETED,
            estimated_chapter_start=1,
            estimated_chapter_end=10,
            milestones=[milestone],
            current_milestone_index=1
        )

        data = StorylineMapper.to_dict(original)
        restored = StorylineMapper.from_dict(data)

        assert restored.id == original.id
        assert restored.novel_id == original.novel_id
        assert restored.storyline_type == original.storyline_type
        assert restored.status == original.status
        assert restored.estimated_chapter_start == original.estimated_chapter_start
        assert restored.estimated_chapter_end == original.estimated_chapter_end
        assert restored.current_milestone_index == original.current_milestone_index
        assert len(restored.milestones) == len(original.milestones)
