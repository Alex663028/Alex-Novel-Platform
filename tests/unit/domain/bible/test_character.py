import pytest
from domain.bible.entities.character import Character
from domain.bible.value_objects.character_id import CharacterId
from domain.shared.exceptions import InvalidOperationError


def test_character_creation():
    """测试创建 Character"""
    char_id = CharacterId("char-1")
    character = Character(
        id=char_id,
        name="张三",
        description="主角，勇敢的战士"
    )
    assert character.id == "char-1"
    assert character.character_id.value == "char-1"
    assert character.name == "张三"
    assert character.description == "主角，勇敢的战士"
    assert character.relationships == []


def test_character_creation_with_relationships():
    """测试创建带关系的 Character"""
    char_id = CharacterId("char-1")
    relationships = ["与李四是好友", "与王五是敌人"]
    character = Character(
        id=char_id,
        name="张三",
        description="主角",
        relationships=relationships
    )
    assert character.relationships == relationships


def test_character_add_relationship():
    """测试添加关系"""
    char_id = CharacterId("char-1")
    character = Character(
        id=char_id,
        name="张三",
        description="主角"
    )
    character.add_relationship("与李四是好友")
    assert len(character.relationships) == 1
    assert "与李四是好友" in character.relationships


def test_character_add_multiple_relationships():
    """测试添加多个关系"""
    char_id = CharacterId("char-1")
    character = Character(
        id=char_id,
        name="张三",
        description="主角"
    )
    character.add_relationship("与李四是好友")
    character.add_relationship("与王五是敌人")
    assert len(character.relationships) == 2


def test_character_add_duplicate_relationship_raises_error():
    """测试添加重复关系抛出异常"""
    char_id = CharacterId("char-1")
    character = Character(
        id=char_id,
        name="张三",
        description="主角"
    )
    character.add_relationship("与李四是好友")
    with pytest.raises(InvalidOperationError, match="Relationship already exists: 与李四是好友"):
        character.add_relationship("与李四是好友")


def test_character_remove_relationship():
    """测试删除关系"""
    char_id = CharacterId("char-1")
    character = Character(
        id=char_id,
        name="张三",
        description="主角"
    )
    character.add_relationship("与李四是好友")
    character.add_relationship("与王五是敌人")
    character.remove_relationship("与李四是好友")
    assert len(character.relationships) == 1
    assert "与李四是好友" not in character.relationships
    assert "与王五是敌人" in character.relationships


def test_character_remove_nonexistent_relationship_raises_error():
    """测试删除不存在的关系抛出异常"""
    char_id = CharacterId("char-1")
    character = Character(
        id=char_id,
        name="张三",
        description="主角"
    )
    with pytest.raises(InvalidOperationError, match="Relationship not found: 与李四是好友"):
        character.remove_relationship("与李四是好友")


def test_character_update_description():
    """测试更新描述"""
    char_id = CharacterId("char-1")
    character = Character(
        id=char_id,
        name="张三",
        description="主角"
    )
    character.update_description("主角，勇敢的战士，拥有强大的力量")
    assert character.description == "主角，勇敢的战士，拥有强大的力量"


def test_character_update_description_validation():
    """测试更新描述验证"""
    char_id = CharacterId("char-1")
    character = Character(
        id=char_id,
        name="张三",
        description="主角"
    )
    with pytest.raises(ValueError, match="Description cannot be empty"):
        character.update_description("")
