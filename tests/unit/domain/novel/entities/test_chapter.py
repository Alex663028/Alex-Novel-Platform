# tests/unit/domain/novel/entities/test_chapter.py
import pytest
from domain.novel.entities.chapter import Chapter, ChapterStatus
from domain.novel.value_objects.novel_id import NovelId


def test_chapter_creation():
    """测试创建章节"""
    chapter = Chapter(
        id="chapter-1",
        novel_id=NovelId("novel-1"),
        number=1,
        title="第一章"
    )
    assert chapter.id == "chapter-1"
    assert chapter.novel_id.value == "novel-1"
    assert chapter.number == 1
    assert chapter.title == "第一章"
    assert chapter.content == ""
    assert chapter.status == ChapterStatus.DRAFT


def test_chapter_creation_with_content():
    """测试创建带内容的章节"""
    chapter = Chapter(
        id="chapter-1",
        novel_id=NovelId("novel-1"),
        number=1,
        title="第一章",
        content="这是章节内容"
    )
    assert chapter.content == "这是章节内容"


def test_chapter_creation_with_status():
    """测试创建指定状态的章节"""
    chapter = Chapter(
        id="chapter-1",
        novel_id=NovelId("novel-1"),
        number=1,
        title="第一章",
        status=ChapterStatus.COMPLETED
    )
    assert chapter.status == ChapterStatus.COMPLETED


def test_chapter_content_property():
    """测试 content 属性"""
    chapter = Chapter(
        id="chapter-1",
        novel_id=NovelId("novel-1"),
        number=1,
        title="第一章",
        content="测试内容"
    )
    assert chapter.content == "测试内容"


def test_chapter_word_count_empty():
    """测试空内容的字数统计"""
    chapter = Chapter(
        id="chapter-1",
        novel_id=NovelId("novel-1"),
        number=1,
        title="第一章"
    )
    assert chapter.word_count.value == 0


def test_chapter_word_count_with_content():
    """测试有内容的字数统计"""
    chapter = Chapter(
        id="chapter-1",
        novel_id=NovelId("novel-1"),
        number=1,
        title="第一章",
        content="这是一段测试内容，用来计算字数。"
    )
    # ChapterContent 会计算实际字数
    assert chapter.word_count.value > 0


def test_chapter_update_content():
    """测试更新内容"""
    import time
    chapter = Chapter(
        id="chapter-1",
        novel_id=NovelId("novel-1"),
        number=1,
        title="第一章",
        content="原始内容"
    )
    original_updated_at = chapter.updated_at

    time.sleep(0.01)  # 确保时间差异
    chapter.update_content("新内容")

    assert chapter.content == "新内容"
    assert chapter.updated_at >= original_updated_at


def test_chapter_update_content_to_empty():
    """测试更新内容为空（允许草稿）"""
    chapter = Chapter(
        id="chapter-1",
        novel_id=NovelId("novel-1"),
        number=1,
        title="第一章",
        content="原始内容"
    )

    chapter.update_content("")

    assert chapter.content == ""


def test_chapter_status_enum():
    """测试章节状态枚举"""
    assert ChapterStatus.DRAFT == "draft"
    assert ChapterStatus.REVIEWING == "reviewing"
    assert ChapterStatus.COMPLETED == "completed"


def test_chapter_status_values():
    """测试章节状态值"""
    assert ChapterStatus.DRAFT.value == "draft"
    assert ChapterStatus.REVIEWING.value == "reviewing"
    assert ChapterStatus.COMPLETED.value == "completed"
