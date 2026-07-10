import pytest
from domain.bible.value_objects.character_id import CharacterId


def test_character_id_creation():
    """测试创建 CharacterId"""
    character_id = CharacterId("char-123")
    assert character_id.value == "char-123"


def test_character_id_immutable():
    """测试 CharacterId 不可变"""
    character_id = CharacterId("char-123")
    with pytest.raises(AttributeError):
        character_id.value = "char-456"


def test_character_id_equality():
    """测试 CharacterId 相等性"""
    id1 = CharacterId("char-123")
    id2 = CharacterId("char-123")
    id3 = CharacterId("char-456")

    assert id1 == id2
    assert id1 != id3


def test_character_id_hash():
    """测试 CharacterId 哈希"""
    id1 = CharacterId("char-123")
    id2 = CharacterId("char-123")
    id3 = CharacterId("char-456")

    assert hash(id1) == hash(id2)
    assert hash(id1) != hash(id3)


def test_character_id_string():
    """测试 CharacterId 字符串表示"""
    character_id = CharacterId("char-123")
    assert str(character_id) == "char-123"


def test_character_id_validation_empty():
    """测试 CharacterId 验证空字符串"""
    with pytest.raises(ValueError, match="Character ID cannot be empty"):
        CharacterId("")


def test_character_id_validation_whitespace():
    """测试 CharacterId 验证空格"""
    with pytest.raises(ValueError, match="Character ID cannot be empty"):
        CharacterId("   ")
