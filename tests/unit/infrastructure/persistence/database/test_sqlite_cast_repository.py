"""测试 SQLite Cast Repository"""
import pytest
from domain.cast.aggregates.cast_graph import CastGraph
from domain.cast.entities.character import Character
from domain.cast.entities.relationship import Relationship
from domain.cast.value_objects.character_id import CharacterId
from domain.cast.value_objects.relationship_id import RelationshipId
from domain.novel.value_objects.novel_id import NovelId
from infrastructure.persistence.database.sqlite_cast_repository import SqliteCastRepository
from infrastructure.persistence.database.connection import get_database


@pytest.fixture
def repository():
    """创建测试仓储"""
    db = get_database()
    return SqliteCastRepository(db)


@pytest.fixture
def sample_cast_graph():
    """创建示例 Cast Graph"""
    novel_id = NovelId("test_novel_cast")
    cast_graph = CastGraph(id="cast_001", novel_id=novel_id)

    # 添加角色
    char1 = Character(
        id=CharacterId("char_001"),
        name="李明",
        role="主角",
        traits="剑术高超，青山派弟子"
    )

    char2 = Character(
        id=CharacterId("char_002"),
        name="王总",
        role="反派",
        traits="亦敌亦友"
    )

    cast_graph.add_character(char1)
    cast_graph.add_character(char2)

    # 添加关系
    relationship = Relationship(
        id=RelationshipId("rel_001"),
        source_id=CharacterId("char_001"),
        target_id=CharacterId("char_002"),
        label="亦敌亦友"
    )
    cast_graph.add_relationship(relationship)

    return cast_graph


def test_save_and_load(repository, sample_cast_graph):
    """测试保存和加载"""
    # 保存
    repository.save(sample_cast_graph)

    # 加载
    loaded = repository.get_by_novel_id(sample_cast_graph.novel_id)

    assert loaded is not None
    assert loaded.novel_id == sample_cast_graph.novel_id
    assert len(loaded.characters) == 2

    # 验证角色属性
    char1 = loaded.get_character(CharacterId("char_001"))
    assert char1 is not None
    assert char1.name == "李明"
    assert char1.role == "主角"
    assert "剑术" in char1.traits


def test_update_cast_graph(repository, sample_cast_graph):
    """测试更新 Cast Graph"""
    # 首次保存
    repository.save(sample_cast_graph)

    # 修改并再次保存
    char3 = Character(
        id=CharacterId("char_003"),
        name="张三"
    )
    sample_cast_graph.add_character(char3)
    repository.save(sample_cast_graph)

    # 验证更新
    loaded = repository.get_by_novel_id(sample_cast_graph.novel_id)
    assert len(loaded.characters) == 3
    assert loaded.get_character(CharacterId("char_003")) is not None


def test_delete(repository, sample_cast_graph):
    """测试删除"""
    # 保存
    repository.save(sample_cast_graph)
    assert repository.exists(sample_cast_graph.novel_id)

    # 删除
    repository.delete(sample_cast_graph.novel_id)
    assert not repository.exists(sample_cast_graph.novel_id)

    # 验证已删除
    loaded = repository.get_by_novel_id(sample_cast_graph.novel_id)
    assert loaded is None


def test_exists(repository, sample_cast_graph):
    """测试存在性检查"""
    novel_id = NovelId("nonexistent_novel")

    # 不存在
    assert not repository.exists(novel_id)

    # 保存后存在
    repository.save(sample_cast_graph)
    assert repository.exists(sample_cast_graph.novel_id)


def test_json_flexibility(repository):
    """测试 JSON 灵活性 - 动态属性"""
    novel_id = NovelId("test_dynamic_attrs")
    cast_graph = CastGraph(id="cast_dynamic", novel_id=novel_id)

    # 创建角色，使用 note 字段存储复杂数据
    char = Character(
        id=CharacterId("char_dynamic"),
        name="李明",
        role="主角",
        traits="剑术高超，拥有龙族血脉",
        note="武器：剑\n血脉：龙族\n状态：被诅咒"
    )

    cast_graph.add_character(char)
    repository.save(cast_graph)

    # 加载并验证
    loaded = repository.get_by_novel_id(novel_id)
    loaded_char = loaded.get_character(CharacterId("char_dynamic"))

    assert loaded_char.name == "李明"
    assert loaded_char.role == "主角"
    assert "龙族血脉" in loaded_char.traits
    assert "被诅咒" in loaded_char.note


def test_get_nonexistent(repository):
    """测试获取不存在的 Cast Graph"""
    novel_id = NovelId("nonexistent_novel")
    result = repository.get_by_novel_id(novel_id)
    assert result is None
