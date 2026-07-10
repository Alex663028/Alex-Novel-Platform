import pytest
from domain.bible.entities.character_registry import CharacterRegistry
from domain.bible.entities.character import Character
from domain.bible.value_objects.character_id import CharacterId
from domain.bible.value_objects.character_importance import CharacterImportance
from domain.bible.value_objects.relationship_graph import RelationshipGraph


def test_character_registry_creation():
    """测试创建 CharacterRegistry"""
    registry = CharacterRegistry(
        id="registry-1",
        novel_id="novel-1"
    )
    assert registry.id == "registry-1"
    assert registry.novel_id == "novel-1"
    assert len(registry.characters_by_importance) == 0
    assert len(registry.activity_metrics) == 0


def test_register_character():
    """测试注册角色"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")
    char = Character(
        id=CharacterId("char-1"),
        name="张三",
        description="主角"
    )

    registry.register_character(char, CharacterImportance.PROTAGONIST)

    assert CharacterId("char-1") in registry.activity_metrics
    chars = registry.get_characters_by_importance(CharacterImportance.PROTAGONIST)
    assert len(chars) == 1
    assert chars[0].character_id.value == "char-1"


def test_register_multiple_characters():
    """测试注册多个角色"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")

    char1 = Character(CharacterId("char-1"), "张三", "主角")
    char2 = Character(CharacterId("char-2"), "李四", "配角")
    char3 = Character(CharacterId("char-3"), "王五", "配角")

    registry.register_character(char1, CharacterImportance.PROTAGONIST)
    registry.register_character(char2, CharacterImportance.MAJOR_SUPPORTING)
    registry.register_character(char3, CharacterImportance.MAJOR_SUPPORTING)

    assert len(registry.get_characters_by_importance(CharacterImportance.PROTAGONIST)) == 1
    assert len(registry.get_characters_by_importance(CharacterImportance.MAJOR_SUPPORTING)) == 2


def test_update_importance():
    """测试更新角色重要性"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")
    char = Character(CharacterId("char-1"), "张三", "主角")

    registry.register_character(char, CharacterImportance.MINOR)
    registry.update_importance(CharacterId("char-1"), CharacterImportance.PROTAGONIST)

    assert len(registry.get_characters_by_importance(CharacterImportance.MINOR)) == 0
    assert len(registry.get_characters_by_importance(CharacterImportance.PROTAGONIST)) == 1


def test_update_importance_nonexistent_character():
    """测试更新不存在的角色重要性"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")

    with pytest.raises(ValueError, match="Character .* not found"):
        registry.update_importance(CharacterId("nonexistent"), CharacterImportance.PROTAGONIST)


def test_update_activity():
    """测试更新角色活动"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")
    char = Character(CharacterId("char-1"), "张三", "主角")

    registry.register_character(char, CharacterImportance.PROTAGONIST)
    registry.update_activity(CharacterId("char-1"), chapter_number=5)

    metrics = registry.activity_metrics[CharacterId("char-1")]
    assert metrics.last_appearance_chapter == 5
    assert metrics.appearance_count == 1


def test_update_activity_with_dialogue():
    """测试更新角色活动并增加对话"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")
    char = Character(CharacterId("char-1"), "张三", "主角")

    registry.register_character(char, CharacterImportance.PROTAGONIST)
    registry.update_activity(CharacterId("char-1"), chapter_number=3, dialogue_count=10)

    metrics = registry.activity_metrics[CharacterId("char-1")]
    assert metrics.total_dialogue_count == 10


def test_get_active_characters():
    """测试获取活跃角色"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")

    char1 = Character(CharacterId("char-1"), "张三", "主角")
    char2 = Character(CharacterId("char-2"), "李四", "配角")
    char3 = Character(CharacterId("char-3"), "王五", "配角")

    registry.register_character(char1, CharacterImportance.PROTAGONIST)
    registry.register_character(char2, CharacterImportance.MAJOR_SUPPORTING)
    registry.register_character(char3, CharacterImportance.MINOR)

    registry.update_activity(CharacterId("char-1"), chapter_number=10)
    registry.update_activity(CharacterId("char-2"), chapter_number=8)
    registry.update_activity(CharacterId("char-3"), chapter_number=3)

    active_chars = registry.get_active_characters(since_chapter=5)

    assert len(active_chars) == 2
    char_ids = [c.character_id for c in active_chars]
    assert CharacterId("char-1") in char_ids
    assert CharacterId("char-2") in char_ids
    assert CharacterId("char-3") not in char_ids


def test_get_characters_for_context_basic():
    """测试基本的上下文角色选择"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")

    char1 = Character(CharacterId("char-1"), "张三", "主角，勇敢的战士")
    char2 = Character(CharacterId("char-2"), "李四", "配角，智慧的谋士")

    registry.register_character(char1, CharacterImportance.PROTAGONIST)
    registry.register_character(char2, CharacterImportance.MAJOR_SUPPORTING)

    # 简单测试：提到角色名字
    outline = "张三和李四一起去冒险"
    characters = registry.get_characters_for_context(outline, max_tokens=2000)

    assert len(characters) > 0
    char_ids = [c.character_id for c in characters]
    assert CharacterId("char-1") in char_ids


def test_get_characters_for_context_with_token_limit():
    """测试带 token 限制的上下文角色选择"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")

    # 创建多个角色
    for i in range(10):
        char = Character(
            CharacterId(f"char-{i}"),
            f"角色{i}",
            f"描述{i}" * 100  # 长描述
        )
        importance = CharacterImportance.PROTAGONIST if i == 0 else CharacterImportance.MINOR
        registry.register_character(char, importance)

    outline = "角色0 出现"
    characters = registry.get_characters_for_context(outline, max_tokens=1500)

    # 应该优先选择主角
    assert len(characters) > 0
    assert characters[0].character_id.value == "char-0"


def test_get_characters_for_context_with_relationship_expansion():
    """测试关系扩展的上下文角色选择"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")
    relationship_graph = RelationshipGraph()

    char1 = Character(CharacterId("char-1"), "张三", "主角")
    char2 = Character(CharacterId("char-2"), "李四", "配角")

    registry.register_character(char1, CharacterImportance.PROTAGONIST)
    registry.register_character(char2, CharacterImportance.MAJOR_SUPPORTING)

    # 设置关系图
    registry.set_relationship_graph(relationship_graph)

    outline = "张三 出现"
    characters = registry.get_characters_for_context(outline, max_tokens=2000)

    # 应该至少包含张三
    char_ids = [c.character_id for c in characters]
    assert CharacterId("char-1") in char_ids


def test_large_scale_character_registry():
    """测试大规模角色注册（1000+ 角色）"""
    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")

    # 注册 1000 个角色
    for i in range(1000):
        char = Character(
            CharacterId(f"char-{i}"),
            f"角色{i}",
            f"这是角色{i}的描述"
        )
        # 分配不同的重要性
        if i < 2:
            importance = CharacterImportance.PROTAGONIST
        elif i < 20:
            importance = CharacterImportance.MAJOR_SUPPORTING
        elif i < 100:
            importance = CharacterImportance.IMPORTANT_SUPPORTING
        elif i < 500:
            importance = CharacterImportance.MINOR
        else:
            importance = CharacterImportance.BACKGROUND

        registry.register_character(char, importance)

    # 验证注册成功
    assert len(registry.activity_metrics) == 1000

    # 测试按重要性获取
    protagonists = registry.get_characters_by_importance(CharacterImportance.PROTAGONIST)
    assert len(protagonists) == 2

    major_supporting = registry.get_characters_by_importance(CharacterImportance.MAJOR_SUPPORTING)
    assert len(major_supporting) == 18


def test_character_selection_performance():
    """测试角色选择性能（应该 < 200ms）"""
    import time

    registry = CharacterRegistry(id="registry-1", novel_id="novel-1")

    # 注册 10000 个角色
    for i in range(10000):
        char = Character(
            CharacterId(f"char-{i}"),
            f"角色{i}",
            f"这是角色{i}的详细描述" * 10
        )
        if i < 5:
            importance = CharacterImportance.PROTAGONIST
        elif i < 50:
            importance = CharacterImportance.MAJOR_SUPPORTING
        elif i < 500:
            importance = CharacterImportance.IMPORTANT_SUPPORTING
        elif i < 5000:
            importance = CharacterImportance.MINOR
        else:
            importance = CharacterImportance.BACKGROUND

        registry.register_character(char, importance)

    # 测试选择性能
    outline = "角色0 和 角色1 一起冒险"
    start_time = time.time()
    characters = registry.get_characters_for_context(outline, max_tokens=2000)
    elapsed_time = time.time() - start_time

    assert elapsed_time < 0.2  # 应该小于 200ms
    assert len(characters) > 0
