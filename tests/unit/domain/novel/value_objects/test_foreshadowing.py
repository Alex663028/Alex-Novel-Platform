import pytest
from domain.novel.value_objects.foreshadowing import (
    Foreshadowing,
    ForeshadowingStatus,
    ImportanceLevel
)


def test_foreshadowing_creation():
    """测试创建 Foreshadowing"""
    foreshadowing = Foreshadowing(
        id="fh-001",
        planted_in_chapter=1,
        description="主角在开场时提到的神秘预言",
        importance=ImportanceLevel.HIGH,
        status=ForeshadowingStatus.PLANTED
    )
    assert foreshadowing.id == "fh-001"
    assert foreshadowing.planted_in_chapter == 1
    assert foreshadowing.description == "主角在开场时提到的神秘预言"
    assert foreshadowing.importance == ImportanceLevel.HIGH
    assert foreshadowing.status == ForeshadowingStatus.PLANTED
    assert foreshadowing.suggested_resolve_chapter is None
    assert foreshadowing.resolved_in_chapter is None


def test_foreshadowing_status_enum_values():
    """测试 ForeshadowingStatus 枚举值"""
    assert ForeshadowingStatus.PLANTED == "planted"
    assert ForeshadowingStatus.RESOLVED == "resolved"
    assert ForeshadowingStatus.ABANDONED == "abandoned"


def test_importance_level_enum_values():
    """测试 ImportanceLevel 枚举值"""
    assert ImportanceLevel.LOW == 1
    assert ImportanceLevel.MEDIUM == 2
    assert ImportanceLevel.HIGH == 3
    assert ImportanceLevel.CRITICAL == 4


def test_foreshadowing_with_suggested_resolve_chapter():
    """测试带建议解决章节的 Foreshadowing"""
    foreshadowing = Foreshadowing(
        id="fh-002",
        planted_in_chapter=3,
        description="神秘人物的身份暗示",
        importance=ImportanceLevel.CRITICAL,
        status=ForeshadowingStatus.PLANTED,
        suggested_resolve_chapter=10
    )
    assert foreshadowing.suggested_resolve_chapter == 10
    assert foreshadowing.resolved_in_chapter is None


def test_foreshadowing_resolved():
    """测试已解决的 Foreshadowing"""
    foreshadowing = Foreshadowing(
        id="fh-003",
        planted_in_chapter=2,
        description="关于宝藏位置的线索",
        importance=ImportanceLevel.MEDIUM,
        status=ForeshadowingStatus.RESOLVED,
        suggested_resolve_chapter=8,
        resolved_in_chapter=7
    )
    assert foreshadowing.status == ForeshadowingStatus.RESOLVED
    assert foreshadowing.resolved_in_chapter == 7


def test_foreshadowing_immutable():
    """测试 Foreshadowing 不可变"""
    foreshadowing = Foreshadowing(
        id="fh-004",
        planted_in_chapter=1,
        description="预言",
        importance=ImportanceLevel.LOW,
        status=ForeshadowingStatus.PLANTED
    )
    with pytest.raises(AttributeError):
        foreshadowing.status = ForeshadowingStatus.RESOLVED


def test_foreshadowing_planted_chapter_validation():
    """测试 planted_in_chapter 验证"""
    with pytest.raises(ValueError, match="planted_in_chapter must be >= 1"):
        Foreshadowing(
            id="fh-005",
            planted_in_chapter=0,
            description="无效章节",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.PLANTED
        )

    with pytest.raises(ValueError, match="planted_in_chapter must be >= 1"):
        Foreshadowing(
            id="fh-006",
            planted_in_chapter=-1,
            description="负数章节",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.PLANTED
        )


def test_foreshadowing_description_validation():
    """测试 description 验证"""
    with pytest.raises(ValueError, match="description cannot be empty"):
        Foreshadowing(
            id="fh-007",
            planted_in_chapter=1,
            description="",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.PLANTED
        )

    with pytest.raises(ValueError, match="description cannot be empty"):
        Foreshadowing(
            id="fh-008",
            planted_in_chapter=1,
            description="   ",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.PLANTED
        )


def test_foreshadowing_resolved_status_validation():
    """测试 RESOLVED 状态必须有 resolved_in_chapter"""
    with pytest.raises(ValueError, match="RESOLVED status requires resolved_in_chapter"):
        Foreshadowing(
            id="fh-009",
            planted_in_chapter=1,
            description="已解决但缺少章节",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.RESOLVED
        )


def test_foreshadowing_resolved_with_chapter():
    """测试 RESOLVED 状态带有 resolved_in_chapter 可以创建"""
    foreshadowing = Foreshadowing(
        id="fh-010",
        planted_in_chapter=1,
        description="正确的已解决伏笔",
        importance=ImportanceLevel.LOW,
        status=ForeshadowingStatus.RESOLVED,
        resolved_in_chapter=5
    )
    assert foreshadowing.status == ForeshadowingStatus.RESOLVED
    assert foreshadowing.resolved_in_chapter == 5


def test_foreshadowing_equality():
    """测试 Foreshadowing 相等性"""
    foreshadowing1 = Foreshadowing(
        id="fh-011",
        planted_in_chapter=1,
        description="预言",
        importance=ImportanceLevel.HIGH,
        status=ForeshadowingStatus.PLANTED
    )
    foreshadowing2 = Foreshadowing(
        id="fh-011",
        planted_in_chapter=1,
        description="预言",
        importance=ImportanceLevel.HIGH,
        status=ForeshadowingStatus.PLANTED
    )
    foreshadowing3 = Foreshadowing(
        id="fh-012",
        planted_in_chapter=2,
        description="另一个预言",
        importance=ImportanceLevel.LOW,
        status=ForeshadowingStatus.PLANTED
    )

    assert foreshadowing1 == foreshadowing2
    assert foreshadowing1 != foreshadowing3


def test_foreshadowing_abandoned_status():
    """测试 ABANDONED 状态"""
    foreshadowing = Foreshadowing(
        id="fh-013",
        planted_in_chapter=1,
        description="被放弃的伏笔",
        importance=ImportanceLevel.LOW,
        status=ForeshadowingStatus.ABANDONED
    )
    assert foreshadowing.status == ForeshadowingStatus.ABANDONED
    assert foreshadowing.resolved_in_chapter is None


def test_foreshadowing_different_importance_levels():
    """测试不同重要性级别的 Foreshadowing"""
    low = Foreshadowing(
        id="fh-014",
        planted_in_chapter=1,
        description="低重要性",
        importance=ImportanceLevel.LOW,
        status=ForeshadowingStatus.PLANTED
    )
    medium = Foreshadowing(
        id="fh-015",
        planted_in_chapter=1,
        description="中等重要性",
        importance=ImportanceLevel.MEDIUM,
        status=ForeshadowingStatus.PLANTED
    )
    high = Foreshadowing(
        id="fh-016",
        planted_in_chapter=1,
        description="高重要性",
        importance=ImportanceLevel.HIGH,
        status=ForeshadowingStatus.PLANTED
    )
    critical = Foreshadowing(
        id="fh-017",
        planted_in_chapter=1,
        description="关键重要性",
        importance=ImportanceLevel.CRITICAL,
        status=ForeshadowingStatus.PLANTED
    )

    assert low.importance == ImportanceLevel.LOW
    assert medium.importance == ImportanceLevel.MEDIUM
    assert high.importance == ImportanceLevel.HIGH
    assert critical.importance == ImportanceLevel.CRITICAL
    assert low.importance < medium.importance < high.importance < critical.importance


def test_suggested_resolve_chapter_validation():
    """测试 suggested_resolve_chapter 验证"""
    with pytest.raises(ValueError, match="suggested_resolve_chapter must be >= 1"):
        Foreshadowing(
            id="fh-018",
            planted_in_chapter=1,
            description="无效建议章节",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.PLANTED,
            suggested_resolve_chapter=0
        )

    with pytest.raises(ValueError, match="suggested_resolve_chapter must be >= 1"):
        Foreshadowing(
            id="fh-019",
            planted_in_chapter=1,
            description="负数建议章节",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.PLANTED,
            suggested_resolve_chapter=-1
        )


def test_resolved_in_chapter_validation():
    """测试 resolved_in_chapter 验证"""
    with pytest.raises(ValueError, match="resolved_in_chapter must be >= 1"):
        Foreshadowing(
            id="fh-020",
            planted_in_chapter=1,
            description="无效解决章节",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.RESOLVED,
            resolved_in_chapter=0
        )

    with pytest.raises(ValueError, match="resolved_in_chapter must be >= 1"):
        Foreshadowing(
            id="fh-021",
            planted_in_chapter=1,
            description="负数解决章节",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.RESOLVED,
            resolved_in_chapter=-1
        )


def test_resolved_in_chapter_business_rule():
    """测试 resolved_in_chapter 必须 >= planted_in_chapter"""
    with pytest.raises(ValueError, match="resolved_in_chapter must be >= planted_in_chapter"):
        Foreshadowing(
            id="fh-022",
            planted_in_chapter=5,
            description="解决章节早于埋下章节",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.RESOLVED,
            resolved_in_chapter=3
        )

    # 同一章节解决应该可以
    foreshadowing = Foreshadowing(
        id="fh-023",
        planted_in_chapter=5,
        description="同章节解决",
        importance=ImportanceLevel.LOW,
        status=ForeshadowingStatus.RESOLVED,
        resolved_in_chapter=5
    )
    assert foreshadowing.resolved_in_chapter == 5


def test_suggested_resolve_chapter_business_rule():
    """测试 suggested_resolve_chapter 必须 >= planted_in_chapter"""
    with pytest.raises(ValueError, match="suggested_resolve_chapter must be >= planted_in_chapter"):
        Foreshadowing(
            id="fh-024",
            planted_in_chapter=5,
            description="建议章节早于埋下章节",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.PLANTED,
            suggested_resolve_chapter=3
        )

    # 同一章节建议应该可以
    foreshadowing = Foreshadowing(
        id="fh-025",
        planted_in_chapter=5,
        description="同章节建议",
        importance=ImportanceLevel.LOW,
        status=ForeshadowingStatus.PLANTED,
        suggested_resolve_chapter=5
    )
    assert foreshadowing.suggested_resolve_chapter == 5
