# tests/unit/domain/novel/entities/test_novel_id_handling.py
"""测试 Novel 实体的 ID 处理机制"""
import pytest
from domain.novel.entities.novel import Novel, NovelStage
from domain.novel.value_objects.novel_id import NovelId


def test_novel_base_entity_id_is_string():
    """测试 BaseEntity.id 是字符串类型"""
    novel = Novel(
        id=NovelId("novel-1"),
        title="测试小说",
        author="测试作者",
        target_chapters=10
    )
    assert isinstance(novel.id, str)
    assert novel.id == "novel-1"


def test_novel_novel_id_is_novel_id_object():
    """测试 novel_id 是 NovelId 对象"""
    novel = Novel(
        id=NovelId("novel-1"),
        title="测试小说",
        author="测试作者",
        target_chapters=10
    )
    assert isinstance(novel.novel_id, NovelId)
    assert novel.novel_id.value == "novel-1"


def test_novel_equality_uses_base_entity_id():
    """测试 Novel 相等性基于 BaseEntity.id（字符串）"""
    novel1 = Novel(
        id=NovelId("novel-1"),
        title="测试小说1",
        author="作者1",
        target_chapters=10
    )
    novel2 = Novel(
        id=NovelId("novel-1"),
        title="测试小说2",
        author="作者2",
        target_chapters=20
    )
    # 相同 ID 应该相等
    assert novel1 == novel2


def test_novel_hash_uses_base_entity_id():
    """测试 Novel 哈希基于 BaseEntity.id（字符串）"""
    novel1 = Novel(
        id=NovelId("novel-1"),
        title="测试小说1",
        author="作者1",
        target_chapters=10
    )
    novel2 = Novel(
        id=NovelId("novel-1"),
        title="测试小说2",
        author="作者2",
        target_chapters=20
    )
    # 相同 ID 应该有相同哈希
    assert hash(novel1) == hash(novel2)


def test_novel_can_be_used_in_set():
    """测试 Novel 可以放入集合（依赖正确的 __hash__）"""
    novel1 = Novel(
        id=NovelId("novel-1"),
        title="测试小说1",
        author="作者1",
        target_chapters=10
    )
    novel2 = Novel(
        id=NovelId("novel-1"),
        title="测试小说2",
        author="作者2",
        target_chapters=20
    )
    novel3 = Novel(
        id=NovelId("novel-2"),
        title="测试小说3",
        author="作者3",
        target_chapters=30
    )

    novel_set = {novel1, novel2, novel3}
    # novel1 和 novel2 有相同 ID，集合中应该只有 2 个元素
    assert len(novel_set) == 2


def test_novel_can_be_used_as_dict_key():
    """测试 Novel 可以作为字典键（依赖正确的 __hash__）"""
    novel1 = Novel(
        id=NovelId("novel-1"),
        title="测试小说",
        author="测试作者",
        target_chapters=10
    )

    novel_dict = {novel1: "value1"}
    assert novel_dict[novel1] == "value1"

    # 相同 ID 的 Novel 应该能访问相同的值
    novel2 = Novel(
        id=NovelId("novel-1"),
        title="另一个标题",
        author="另一个作者",
        target_chapters=20
    )
    assert novel_dict[novel2] == "value1"
