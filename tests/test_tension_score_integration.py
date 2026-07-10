"""测试章节张力分数集成功能"""
import pytest
from domain.novel.entities.chapter import Chapter, ChapterStatus
from domain.novel.value_objects.novel_id import NovelId


def test_chapter_tension_score_default():
    """测试章节默认张力分数"""
    chapter = Chapter(
        id="test-ch-1",
        novel_id=NovelId("test-novel"),
        number=1,
        title="测试章节",
        content="测试内容"
    )
    assert chapter.tension_score == 50.0


def test_chapter_tension_score_custom():
    """测试自定义张力分数"""
    chapter = Chapter(
        id="test-ch-2",
        novel_id=NovelId("test-novel"),
        number=2,
        title="高潮章节",
        content="激烈的战斗场景",
        tension_score=85.0
    )
    assert chapter.tension_score == 85.0


def test_update_tension_score():
    """测试更新张力分数"""
    chapter = Chapter(
        id="test-ch-3",
        novel_id=NovelId("test-novel"),
        number=3,
        title="测试章节",
        content="测试内容"
    )

    chapter.update_tension_score(75.0)
    assert chapter.tension_score == 75.0


def test_update_tension_score_validation():
    """测试张力分数验证"""
    chapter = Chapter(
        id="test-ch-4",
        novel_id=NovelId("test-novel"),
        number=4,
        title="测试章节",
        content="测试内容"
    )

    # 测试超出范围的值
    with pytest.raises(ValueError):
        chapter.update_tension_score(150.0)

    with pytest.raises(ValueError):
        chapter.update_tension_score(-10.0)

    # 边界值应该正常
    chapter.update_tension_score(0.0)
    assert chapter.tension_score == 0.0

    chapter.update_tension_score(100.0)
    assert chapter.tension_score == 100.0
