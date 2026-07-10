import pytest
from domain.novel.value_objects.storyline_type import StorylineType
from domain.novel.value_objects.storyline_status import StorylineStatus


class TestStorylineType:
    """StorylineType 枚举测试"""

    def test_storyline_type_values(self):
        """测试故事线类型枚举值"""
        assert StorylineType.MAIN_PLOT.value == "main_plot"
        assert StorylineType.ROMANCE.value == "romance"
        assert StorylineType.REVENGE.value == "revenge"
        assert StorylineType.MYSTERY.value == "mystery"
        assert StorylineType.GROWTH.value == "growth"
        assert StorylineType.POLITICAL.value == "political"
        assert StorylineType.ADVENTURE.value == "adventure"
        assert StorylineType.FAMILY.value == "family"
        assert StorylineType.FRIENDSHIP.value == "friendship"

    def test_storyline_type_count(self):
        """测试故事线类型数量"""
        assert len(StorylineType) == 9


class TestStorylineStatus:
    """StorylineStatus 枚举测试"""

    def test_storyline_status_values(self):
        """测试故事线状态枚举值"""
        assert StorylineStatus.ACTIVE.value == "active"
        assert StorylineStatus.COMPLETED.value == "completed"
        assert StorylineStatus.ABANDONED.value == "abandoned"

    def test_storyline_status_count(self):
        """测试故事线状态数量"""
        assert len(StorylineStatus) == 3
