import pytest
from domain.novel.value_objects.chapter_content import ChapterContent


def test_chapter_content_creation():
    """测试创建 ChapterContent"""
    content = ChapterContent("这是一段章节内容")
    assert content.raw_text == "这是一段章节内容"


def test_chapter_content_immutability():
    """测试 ChapterContent 不可变性"""
    content = ChapterContent("原始内容")
    with pytest.raises(Exception):  # dataclass frozen=True 会抛出异常
        content.raw_text = "新内容"


def test_chapter_content_none_raises_error():
    """测试 None 内容抛出异常"""
    with pytest.raises(ValueError, match="Chapter content cannot be None or empty"):
        ChapterContent(None)


def test_chapter_content_empty_string_raises_error():
    """测试空字符串抛出异常"""
    with pytest.raises(ValueError, match="Chapter content cannot be None or empty"):
        ChapterContent("")


def test_chapter_content_whitespace_only():
    """测试纯空格内容抛出异常"""
    with pytest.raises(ValueError, match="Chapter content cannot be None or empty"):
        ChapterContent("   ")
    with pytest.raises(ValueError, match="Chapter content cannot be None or empty"):
        ChapterContent("\t\n  ")


def test_chapter_content_word_count():
    """测试 word_count 方法"""
    content = ChapterContent("这是测试内容")
    assert content.word_count() == 6


def test_chapter_content_word_count_with_spaces():
    """测试包含空格的字数计算"""
    content = ChapterContent("Hello World")
    assert content.word_count() == 11  # 包含空格的字符数


def test_chapter_content_str_short():
    """测试短内容的字符串表示"""
    content = ChapterContent("短内容")
    assert str(content) == "短内容"


def test_chapter_content_str_long():
    """测试长内容的字符串表示（截断）"""
    long_text = "这是一段很长的内容" * 10
    content = ChapterContent(long_text)
    result = str(content)
    assert len(result) <= 53  # 50 + "..."
    assert result.endswith("...")
