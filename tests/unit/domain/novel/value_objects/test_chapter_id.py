import pytest
from domain.novel.value_objects.chapter_id import ChapterId


def test_chapter_id_creation():
    """测试创建 ChapterId"""
    chapter_id = ChapterId("chapter-123")
    assert chapter_id.value == "chapter-123"


def test_chapter_id_immutable():
    """测试 ChapterId 不可变"""
    chapter_id = ChapterId("chapter-123")
    with pytest.raises(AttributeError):
        chapter_id.value = "chapter-456"


def test_chapter_id_equality():
    """测试 ChapterId 相等性"""
    id1 = ChapterId("chapter-123")
    id2 = ChapterId("chapter-123")
    id3 = ChapterId("chapter-456")

    assert id1 == id2
    assert id1 != id3


def test_chapter_id_validation():
    """测试 ChapterId 验证"""
    with pytest.raises(ValueError):
        ChapterId("")  # 空字符串

    with pytest.raises(ValueError):
        ChapterId("   ")  # 只有空格


def test_chapter_id_str_conversion():
    """测试 ChapterId 字符串转换"""
    chapter_id = ChapterId("chapter-123")
    assert str(chapter_id) == "chapter-123"


def test_chapter_id_hash():
    """测试 ChapterId 可哈希"""
    id1 = ChapterId("chapter-123")
    id2 = ChapterId("chapter-123")
    id3 = ChapterId("chapter-456")

    # 相同值应该有相同的哈希
    assert hash(id1) == hash(id2)

    # 可以用于集合和字典
    id_set = {id1, id2, id3}
    assert len(id_set) == 2  # id1 和 id2 是相同的
