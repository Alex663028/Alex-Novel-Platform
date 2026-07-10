import pytest
from domain.novel.value_objects.plot_point import PlotPoint, PlotPointType
from domain.novel.value_objects.tension_level import TensionLevel


def test_plot_point_creation():
    """测试创建 PlotPoint"""
    plot_point = PlotPoint(
        chapter_number=1,
        point_type=PlotPointType.OPENING,
        description="故事开端",
        tension=TensionLevel.LOW
    )
    assert plot_point.chapter_number == 1
    assert plot_point.point_type == PlotPointType.OPENING
    assert plot_point.description == "故事开端"
    assert plot_point.tension == TensionLevel.LOW


def test_plot_point_type_enum_values():
    """测试 PlotPointType 枚举值"""
    assert PlotPointType.OPENING == "opening"
    assert PlotPointType.RISING_ACTION == "rising"
    assert PlotPointType.TURNING_POINT == "turning"
    assert PlotPointType.CLIMAX == "climax"
    assert PlotPointType.FALLING_ACTION == "falling"
    assert PlotPointType.RESOLUTION == "resolution"


def test_plot_point_immutable():
    """测试 PlotPoint 不可变"""
    plot_point = PlotPoint(
        chapter_number=1,
        point_type=PlotPointType.OPENING,
        description="故事开端",
        tension=TensionLevel.LOW
    )
    with pytest.raises(AttributeError):
        plot_point.chapter_number = 2


def test_plot_point_chapter_number_validation():
    """测试 PlotPoint 章节号验证"""
    with pytest.raises(ValueError, match="Chapter number must be >= 1"):
        PlotPoint(
            chapter_number=0,
            point_type=PlotPointType.OPENING,
            description="故事开端",
            tension=TensionLevel.LOW
        )

    with pytest.raises(ValueError, match="Chapter number must be >= 1"):
        PlotPoint(
            chapter_number=-1,
            point_type=PlotPointType.OPENING,
            description="故事开端",
            tension=TensionLevel.LOW
        )


def test_plot_point_description_validation():
    """测试 PlotPoint 描述验证"""
    with pytest.raises(ValueError, match="Description cannot be empty"):
        PlotPoint(
            chapter_number=1,
            point_type=PlotPointType.OPENING,
            description="",
            tension=TensionLevel.LOW
        )

    with pytest.raises(ValueError, match="Description cannot be empty"):
        PlotPoint(
            chapter_number=1,
            point_type=PlotPointType.OPENING,
            description="   ",
            tension=TensionLevel.LOW
        )


def test_plot_point_equality():
    """测试 PlotPoint 相等性"""
    plot_point1 = PlotPoint(
        chapter_number=1,
        point_type=PlotPointType.OPENING,
        description="故事开端",
        tension=TensionLevel.LOW
    )
    plot_point2 = PlotPoint(
        chapter_number=1,
        point_type=PlotPointType.OPENING,
        description="故事开端",
        tension=TensionLevel.LOW
    )
    plot_point3 = PlotPoint(
        chapter_number=2,
        point_type=PlotPointType.RISING_ACTION,
        description="冲突升级",
        tension=TensionLevel.MEDIUM
    )

    assert plot_point1 == plot_point2
    assert plot_point1 != plot_point3


def test_plot_point_with_different_types():
    """测试不同类型的 PlotPoint"""
    opening = PlotPoint(
        chapter_number=1,
        point_type=PlotPointType.OPENING,
        description="故事开端",
        tension=TensionLevel.LOW
    )

    climax = PlotPoint(
        chapter_number=10,
        point_type=PlotPointType.CLIMAX,
        description="故事高潮",
        tension=TensionLevel.PEAK
    )

    resolution = PlotPoint(
        chapter_number=15,
        point_type=PlotPointType.RESOLUTION,
        description="故事结局",
        tension=TensionLevel.LOW
    )

    assert opening.point_type == PlotPointType.OPENING
    assert climax.point_type == PlotPointType.CLIMAX
    assert resolution.point_type == PlotPointType.RESOLUTION
