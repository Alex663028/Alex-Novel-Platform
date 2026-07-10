import pytest
from domain.novel.value_objects.novel_event import NovelEvent, EventType
from domain.novel.value_objects.event_timeline import EventTimeline
from domain.bible.value_objects.character_id import CharacterId


def test_create_empty_timeline():
    """测试创建空时间线"""
    timeline = EventTimeline()
    assert timeline.events == []


def test_add_single_event():
    """测试添加单个事件"""
    timeline = EventTimeline()
    char_id = CharacterId("hero")
    event = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char_id,)
    )
    timeline.add_event(event)
    assert len(timeline.events) == 1
    assert timeline.events[0] == event


def test_add_multiple_events_auto_sort():
    """测试添加多个事件并自动排序"""
    timeline = EventTimeline()
    char1 = CharacterId("hero")
    char2 = CharacterId("villain")

    # 添加章节 3 的事件
    event3 = NovelEvent(
        chapter_number=3,
        event_type=EventType.CONFLICT,
        description="冲突爆发",
        involved_characters=(char1, char2)
    )
    timeline.add_event(event3)

    # 添加章节 1 的事件
    event1 = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char1,)
    )
    timeline.add_event(event1)

    # 添加章节 2 的事件
    event2 = NovelEvent(
        chapter_number=2,
        event_type=EventType.RELATIONSHIP_CHANGE,
        description="关系变化",
        involved_characters=(char1, char2)
    )
    timeline.add_event(event2)

    # 验证自动排序
    events = timeline.events
    assert len(events) == 3
    assert events[0].chapter_number == 1
    assert events[1].chapter_number == 2
    assert events[2].chapter_number == 3


def test_get_events_before_chapter():
    """测试获取指定章节之前的事件"""
    timeline = EventTimeline()
    char_id = CharacterId("hero")

    event1 = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char_id,)
    )
    event2 = NovelEvent(
        chapter_number=2,
        event_type=EventType.DECISION,
        description="做出决定",
        involved_characters=(char_id,)
    )
    event3 = NovelEvent(
        chapter_number=3,
        event_type=EventType.CONFLICT,
        description="冲突爆发",
        involved_characters=(char_id,)
    )
    event4 = NovelEvent(
        chapter_number=5,
        event_type=EventType.REVELATION,
        description="真相揭露",
        involved_characters=(char_id,)
    )

    timeline.add_event(event1)
    timeline.add_event(event2)
    timeline.add_event(event3)
    timeline.add_event(event4)

    # 获取章节 3 之前的事件（不包括章节 3）
    events_before_3 = timeline.get_events_before(3)
    assert len(events_before_3) == 2
    assert events_before_3[0].chapter_number == 1
    assert events_before_3[1].chapter_number == 2

    # 获取章节 1 之前的事件
    events_before_1 = timeline.get_events_before(1)
    assert len(events_before_1) == 0

    # 获取章节 10 之前的事件
    events_before_10 = timeline.get_events_before(10)
    assert len(events_before_10) == 4


def test_get_events_involving_character():
    """测试获取涉及特定角色的事件"""
    timeline = EventTimeline()
    hero = CharacterId("hero")
    villain = CharacterId("villain")
    sidekick = CharacterId("sidekick")

    event1 = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(hero,)
    )
    event2 = NovelEvent(
        chapter_number=2,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="反派登场",
        involved_characters=(villain,)
    )
    event3 = NovelEvent(
        chapter_number=3,
        event_type=EventType.CONFLICT,
        description="主角与反派冲突",
        involved_characters=(hero, villain)
    )
    event4 = NovelEvent(
        chapter_number=4,
        event_type=EventType.RELATIONSHIP_CHANGE,
        description="主角与助手结盟",
        involved_characters=(hero, sidekick)
    )

    timeline.add_event(event1)
    timeline.add_event(event2)
    timeline.add_event(event3)
    timeline.add_event(event4)

    # 获取涉及主角的事件
    hero_events = timeline.get_events_involving(hero)
    assert len(hero_events) == 3
    assert hero_events[0].chapter_number == 1
    assert hero_events[1].chapter_number == 3
    assert hero_events[2].chapter_number == 4

    # 获取涉及反派的事件
    villain_events = timeline.get_events_involving(villain)
    assert len(villain_events) == 2
    assert villain_events[0].chapter_number == 2
    assert villain_events[1].chapter_number == 3

    # 获取涉及助手的事件
    sidekick_events = timeline.get_events_involving(sidekick)
    assert len(sidekick_events) == 1
    assert sidekick_events[0].chapter_number == 4


def test_events_property_returns_copy():
    """测试 events 属性返回副本"""
    timeline = EventTimeline()
    char_id = CharacterId("hero")
    event = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char_id,)
    )
    timeline.add_event(event)

    # 获取事件列表
    events1 = timeline.events
    events2 = timeline.events

    # 验证返回的是副本
    assert events1 is not events2
    assert events1 == events2


def test_timeline_with_same_chapter_events():
    """测试同一章节的多个事件"""
    timeline = EventTimeline()
    char_id = CharacterId("hero")

    event1 = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char_id,)
    )
    event2 = NovelEvent(
        chapter_number=1,
        event_type=EventType.DECISION,
        description="做出决定",
        involved_characters=(char_id,)
    )

    timeline.add_event(event1)
    timeline.add_event(event2)

    assert len(timeline.events) == 2
    assert all(e.chapter_number == 1 for e in timeline.events)


def test_add_event_validation():
    """测试添加事件时的验证"""
    timeline = EventTimeline()

    with pytest.raises(ValueError, match="Event cannot be None"):
        timeline.add_event(None)


def test_get_events_before_validation():
    """测试获取事件前的章节号验证"""
    timeline = EventTimeline()

    with pytest.raises(ValueError, match="Chapter number must be >= 1"):
        timeline.get_events_before(0)

    with pytest.raises(ValueError, match="Chapter number must be >= 1"):
        timeline.get_events_before(-1)
