import pytest
from domain.novel.value_objects.novel_id import NovelId


def test_novel_id_creation():
    """测试创建 NovelId"""
    novel_id = NovelId("novel-123")
    assert novel_id.value == "novel-123"


def test_novel_id_immutable():
    """测试 NovelId 不可变"""
    novel_id = NovelId("novel-123")
    with pytest.raises(AttributeError):
        novel_id.value = "novel-456"


def test_novel_id_equality():
    """测试 NovelId 相等性"""
    id1 = NovelId("novel-123")
    id2 = NovelId("novel-123")
    id3 = NovelId("novel-456")

    assert id1 == id2
    assert id1 != id3


def test_novel_id_validation():
    """测试 NovelId 验证"""
    with pytest.raises(ValueError):
        NovelId("")  # 空字符串

    with pytest.raises(ValueError):
        NovelId("   ")  # 只有空格
