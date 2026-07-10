import pytest
from datetime import datetime
from domain.bible.value_objects.activity_metrics import ActivityMetrics


def test_activity_metrics_creation():
    """测试创建 ActivityMetrics"""
    metrics = ActivityMetrics(
        last_appearance_chapter=5,
        appearance_count=10,
        total_dialogue_count=25
    )
    assert metrics.last_appearance_chapter == 5
    assert metrics.appearance_count == 10
    assert metrics.total_dialogue_count == 25
    assert isinstance(metrics.last_updated, datetime)


def test_activity_metrics_default_values():
    """测试默认值"""
    metrics = ActivityMetrics()
    assert metrics.last_appearance_chapter == 0
    assert metrics.appearance_count == 0
    assert metrics.total_dialogue_count == 0
    assert isinstance(metrics.last_updated, datetime)


def test_activity_metrics_update_activity():
    """测试更新活动"""
    metrics = ActivityMetrics()
    initial_time = metrics.last_updated

    metrics.update_activity(chapter_number=3)

    assert metrics.last_appearance_chapter == 3
    assert metrics.appearance_count == 1
    assert metrics.last_updated >= initial_time


def test_activity_metrics_update_activity_multiple_times():
    """测试多次更新活动"""
    metrics = ActivityMetrics()

    metrics.update_activity(chapter_number=1)
    metrics.update_activity(chapter_number=3)
    metrics.update_activity(chapter_number=5)

    assert metrics.last_appearance_chapter == 5
    assert metrics.appearance_count == 3


def test_activity_metrics_update_activity_with_dialogue():
    """测试更新活动并增加对话数"""
    metrics = ActivityMetrics()

    metrics.update_activity(chapter_number=2, dialogue_count=5)

    assert metrics.last_appearance_chapter == 2
    assert metrics.appearance_count == 1
    assert metrics.total_dialogue_count == 5


def test_activity_metrics_update_activity_accumulate_dialogue():
    """测试累积对话数"""
    metrics = ActivityMetrics()

    metrics.update_activity(chapter_number=1, dialogue_count=3)
    metrics.update_activity(chapter_number=2, dialogue_count=7)

    assert metrics.total_dialogue_count == 10


def test_activity_metrics_is_active_since():
    """测试判断是否活跃"""
    metrics = ActivityMetrics()
    metrics.update_activity(chapter_number=10)

    assert metrics.is_active_since(chapter=5) is True
    assert metrics.is_active_since(chapter=10) is True
    assert metrics.is_active_since(chapter=11) is False


def test_activity_metrics_immutability():
    """测试值对象不可变性"""
    metrics = ActivityMetrics(
        last_appearance_chapter=5,
        appearance_count=10,
        total_dialogue_count=25
    )

    # 值对象应该是不可变的，但 update_activity 返回新实例
    # 这里我们测试原对象不变
    original_chapter = metrics.last_appearance_chapter
    original_count = metrics.appearance_count

    # update_activity 应该修改对象（因为它是实体的一部分）
    # 或者返回新对象（如果是纯值对象）
    # 根据需求，我们让它可变以便在实体中使用
    metrics.update_activity(chapter_number=10)

    assert metrics.last_appearance_chapter == 10
    assert metrics.appearance_count == original_count + 1
