import pytest
from domain.novel.value_objects.novel_event import NovelEvent, EventType
from domain.bible.value_objects.character_id import CharacterId


def test_novel_event_creation():
    """测试创建 NovelEvent"""
    char_id = CharacterId("hero")
    event = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char_id,)
    )
    assert event.chapter_number == 1
    assert event.event_type == EventType.CHARACTER_INTRODUCTION
    assert event.description == "主角登场"
    assert event.involved_characters == (char_id,)


def test_event_type_enum_values():
    """测试 EventType 枚举值"""
    assert EventType.CHARACTER_INTRODUCTION == "character_introduction"
    assert EventType.RELATIONSHIP_CHANGE == "relationship_change"
    assert EventType.CONFLICT == "conflict"
    assert EventType.REVELATION == "revelation"
    assert EventType.DECISION == "decision"


def test_novel_event_immutable():
    """测试 NovelEvent 不可变"""
    char_id = CharacterId("hero")
    event = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char_id,)
    )
    with pytest.raises(AttributeError):
        event.chapter_number = 2


def test_novel_event_chapter_number_validation():
    """测试 NovelEvent 章节号验证"""
    char_id = CharacterId("hero")

    with pytest.raises(ValueError, match="Chapter number must be >= 1"):
        NovelEvent(
            chapter_number=0,
            event_type=EventType.CHARACTER_INTRODUCTION,
            description="主角登场",
            involved_characters=(char_id,)
        )

    with pytest.raises(ValueError, match="Chapter number must be >= 1"):
        NovelEvent(
            chapter_number=-1,
            event_type=EventType.CHARACTER_INTRODUCTION,
            description="主角登场",
            involved_characters=(char_id,)
        )


def test_novel_event_description_validation():
    """测试 NovelEvent 描述验证"""
    char_id = CharacterId("hero")

    with pytest.raises(ValueError, match="Description cannot be empty"):
        NovelEvent(
            chapter_number=1,
            event_type=EventType.CHARACTER_INTRODUCTION,
            description="",
            involved_characters=(char_id,)
        )

    with pytest.raises(ValueError, match="Description cannot be empty"):
        NovelEvent(
            chapter_number=1,
            event_type=EventType.CHARACTER_INTRODUCTION,
            description="   ",
            involved_characters=(char_id,)
        )


def test_novel_event_with_multiple_characters():
    """测试涉及多个角色的事件"""
    hero = CharacterId("hero")
    villain = CharacterId("villain")
    sidekick = CharacterId("sidekick")

    event = NovelEvent(
        chapter_number=5,
        event_type=EventType.CONFLICT,
        description="三方对峙",
        involved_characters=(hero, villain, sidekick)
    )

    assert len(event.involved_characters) == 3
    assert hero in event.involved_characters
    assert villain in event.involved_characters
    assert sidekick in event.involved_characters


def test_novel_event_with_empty_characters():
    """测试没有涉及角色的事件"""
    event = NovelEvent(
        chapter_number=1,
        event_type=EventType.REVELATION,
        description="环境描述",
        involved_characters=()
    )

    assert event.involved_characters == ()


def test_novel_event_equality():
    """测试 NovelEvent 相等性"""
    char_id = CharacterId("hero")

    event1 = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char_id,)
    )
    event2 = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char_id,)
    )
    event3 = NovelEvent(
        chapter_number=2,
        event_type=EventType.CONFLICT,
        description="冲突爆发",
        involved_characters=(char_id,)
    )

    assert event1 == event2
    assert event1 != event3


def test_novel_event_with_different_types():
    """测试不同类型的事件"""
    char_id = CharacterId("hero")

    intro = NovelEvent(
        chapter_number=1,
        event_type=EventType.CHARACTER_INTRODUCTION,
        description="主角登场",
        involved_characters=(char_id,)
    )

    conflict = NovelEvent(
        chapter_number=5,
        event_type=EventType.CONFLICT,
        description="冲突爆发",
        involved_characters=(char_id,)
    )

    revelation = NovelEvent(
        chapter_number=10,
        event_type=EventType.REVELATION,
        description="真相揭露",
        involved_characters=(char_id,)
    )

    decision = NovelEvent(
        chapter_number=12,
        event_type=EventType.DECISION,
        description="做出选择",
        involved_characters=(char_id,)
    )

    relationship = NovelEvent(
        chapter_number=3,
        event_type=EventType.RELATIONSHIP_CHANGE,
        description="关系变化",
        involved_characters=(char_id,)
    )

    assert intro.event_type == EventType.CHARACTER_INTRODUCTION
    assert conflict.event_type == EventType.CONFLICT
    assert revelation.event_type == EventType.REVELATION
    assert decision.event_type == EventType.DECISION
    assert relationship.event_type == EventType.RELATIONSHIP_CHANGE
