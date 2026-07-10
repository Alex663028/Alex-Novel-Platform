import pytest
from domain.bible.entities.bible import Bible
from domain.bible.entities.character import Character
from domain.bible.entities.world_setting import WorldSetting
from domain.bible.value_objects.character_id import CharacterId
from domain.novel.value_objects.novel_id import NovelId
from domain.shared.exceptions import InvalidOperationError


def test_bible_creation():
    """测试创建 Bible"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)
    assert bible.id == "bible-1"
    assert bible.novel_id.value == "novel-1"
    assert bible.characters == []
    assert bible.world_settings == []


def test_bible_characters_returns_copy():
    """测试 characters 属性返回副本"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    character = Character(
        id=CharacterId("char-1"),
        name="张三",
        description="主角"
    )
    bible.add_character(character)

    # 获取列表并尝试修改
    chars = bible.characters
    chars.append(Character(
        id=CharacterId("char-2"),
        name="李四",
        description="配角"
    ))

    # 原始列表不应被修改
    assert len(bible.characters) == 1


def test_bible_world_settings_returns_copy():
    """测试 world_settings 属性返回副本"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    setting = WorldSetting(
        id="setting-1",
        name="长安城",
        description="繁华的都城",
        setting_type="location"
    )
    bible.add_world_setting(setting)

    # 获取列表并尝试修改
    settings = bible.world_settings
    settings.append(WorldSetting(
        id="setting-2",
        name="洛阳城",
        description="另一座城市",
        setting_type="location"
    ))

    # 原始列表不应被修改
    assert len(bible.world_settings) == 1


def test_bible_add_character():
    """测试添加人物"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    character = Character(
        id=CharacterId("char-1"),
        name="张三",
        description="主角"
    )
    bible.add_character(character)

    assert len(bible.characters) == 1
    assert bible.characters[0].name == "张三"


def test_bible_add_duplicate_character_raises_error():
    """测试添加重复人物抛出异常"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    character1 = Character(
        id=CharacterId("char-1"),
        name="张三",
        description="主角"
    )
    character2 = Character(
        id=CharacterId("char-1"),
        name="张三",
        description="另一个描述"
    )

    bible.add_character(character1)
    with pytest.raises(InvalidOperationError, match="Character with id 'char-1' already exists"):
        bible.add_character(character2)


def test_bible_remove_character():
    """测试删除人物"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    character = Character(
        id=CharacterId("char-1"),
        name="张三",
        description="主角"
    )
    bible.add_character(character)
    bible.remove_character(CharacterId("char-1"))

    assert len(bible.characters) == 0


def test_bible_remove_nonexistent_character_raises_error():
    """测试删除不存在的人物抛出异常"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    with pytest.raises(InvalidOperationError, match="Character with id 'char-1' not found"):
        bible.remove_character(CharacterId("char-1"))


def test_bible_get_character():
    """测试获取人物"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    character = Character(
        id=CharacterId("char-1"),
        name="张三",
        description="主角"
    )
    bible.add_character(character)

    found = bible.get_character(CharacterId("char-1"))
    assert found is not None
    assert found.name == "张三"


def test_bible_get_nonexistent_character_returns_none():
    """测试获取不存在的人物返回 None"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    found = bible.get_character(CharacterId("char-1"))
    assert found is None


def test_bible_add_world_setting():
    """测试添加世界设定"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    setting = WorldSetting(
        id="setting-1",
        name="长安城",
        description="繁华的都城",
        setting_type="location"
    )
    bible.add_world_setting(setting)

    assert len(bible.world_settings) == 1
    assert bible.world_settings[0].name == "长安城"


def test_bible_add_duplicate_world_setting_raises_error():
    """测试添加重复世界设定抛出异常"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    setting1 = WorldSetting(
        id="setting-1",
        name="长安城",
        description="繁华的都城",
        setting_type="location"
    )
    setting2 = WorldSetting(
        id="setting-1",
        name="长安城",
        description="另一个描述",
        setting_type="location"
    )

    bible.add_world_setting(setting1)
    with pytest.raises(InvalidOperationError, match="World setting with id 'setting-1' already exists"):
        bible.add_world_setting(setting2)


def test_bible_remove_world_setting():
    """测试删除世界设定"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    setting = WorldSetting(
        id="setting-1",
        name="长安城",
        description="繁华的都城",
        setting_type="location"
    )
    bible.add_world_setting(setting)
    bible.remove_world_setting("setting-1")

    assert len(bible.world_settings) == 0


def test_bible_remove_nonexistent_world_setting_raises_error():
    """测试删除不存在的世界设定抛出异常"""
    novel_id = NovelId("novel-1")
    bible = Bible(id="bible-1", novel_id=novel_id)

    with pytest.raises(InvalidOperationError, match="World setting with id 'setting-1' not found"):
        bible.remove_world_setting("setting-1")
