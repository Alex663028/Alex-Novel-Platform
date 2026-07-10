import pytest
from domain.bible.entities.world_setting import WorldSetting


def test_world_setting_creation():
    """测试创建 WorldSetting"""
    setting = WorldSetting(
        id="setting-1",
        name="长安城",
        description="繁华的都城",
        setting_type="location"
    )
    assert setting.id == "setting-1"
    assert setting.name == "长安城"
    assert setting.description == "繁华的都城"
    assert setting.setting_type == "location"


def test_world_setting_creation_with_item_type():
    """测试创建物品类型的 WorldSetting"""
    setting = WorldSetting(
        id="setting-2",
        name="倚天剑",
        description="锋利的宝剑",
        setting_type="item"
    )
    assert setting.setting_type == "item"


def test_world_setting_creation_with_rule_type():
    """测试创建规则类型的 WorldSetting"""
    setting = WorldSetting(
        id="setting-3",
        name="武林规矩",
        description="江湖中的行为准则",
        setting_type="rule"
    )
    assert setting.setting_type == "rule"


def test_world_setting_creation_with_empty_name_raises_error():
    """测试创建空名称的 WorldSetting 抛出异常"""
    with pytest.raises(ValueError, match="Name cannot be empty"):
        WorldSetting(
            id="setting-1",
            name="",
            description="描述",
            setting_type="location"
        )


def test_world_setting_creation_with_whitespace_name_raises_error():
    """测试创建空白名称的 WorldSetting 抛出异常"""
    with pytest.raises(ValueError, match="Name cannot be empty"):
        WorldSetting(
            id="setting-1",
            name="   ",
            description="描述",
            setting_type="location"
        )


def test_world_setting_creation_with_invalid_type_raises_error():
    """测试创建无效类型的 WorldSetting 抛出异常"""
    with pytest.raises(ValueError, match="Setting type must be one of"):
        WorldSetting(
            id="setting-1",
            name="测试",
            description="描述",
            setting_type="invalid_type"
        )


def test_world_setting_update_description():
    """测试更新描述"""
    setting = WorldSetting(
        id="setting-1",
        name="长安城",
        description="繁华的都城",
        setting_type="location"
    )
    setting.update_description("繁华的都城，人口众多")
    assert setting.description == "繁华的都城，人口众多"


def test_world_setting_update_description_with_empty_raises_error():
    """测试更新空描述抛出异常"""
    setting = WorldSetting(
        id="setting-1",
        name="长安城",
        description="繁华的都城",
        setting_type="location"
    )
    with pytest.raises(ValueError, match="Description cannot be empty"):
        setting.update_description("")


def test_world_setting_update_description_with_whitespace_raises_error():
    """测试更新空白描述抛出异常"""
    setting = WorldSetting(
        id="setting-1",
        name="长安城",
        description="繁华的都城",
        setting_type="location"
    )
    with pytest.raises(ValueError, match="Description cannot be empty"):
        setting.update_description("   ")
