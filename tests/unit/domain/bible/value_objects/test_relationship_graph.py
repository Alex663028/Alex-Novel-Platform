import pytest
from domain.bible.value_objects.character_id import CharacterId
from domain.bible.value_objects.relationship import Relationship, RelationType
from domain.bible.value_objects.relationship_graph import RelationshipGraph


class TestRelationType:
    """测试 RelationType 枚举"""

    def test_relation_type_values(self):
        """测试所有关系类型枚举值"""
        assert RelationType.STRANGER
        assert RelationType.ACQUAINTANCE
        assert RelationType.FRIEND
        assert RelationType.CLOSE_FRIEND
        assert RelationType.LOVER
        assert RelationType.ENEMY
        assert RelationType.RIVAL
        assert RelationType.FAMILY


class TestRelationship:
    """测试 Relationship 值对象"""

    def test_create_valid_relationship(self):
        """测试创建有效的关系"""
        rel = Relationship(
            relation_type=RelationType.FRIEND,
            established_in_chapter=1,
            description="Met at school"
        )
        assert rel.relation_type == RelationType.FRIEND
        assert rel.established_in_chapter == 1
        assert rel.description == "Met at school"

    def test_relationship_is_frozen(self):
        """测试关系对象是不可变的"""
        rel = Relationship(
            relation_type=RelationType.FRIEND,
            established_in_chapter=1,
            description="Met at school"
        )
        with pytest.raises((AttributeError, TypeError)):  # dataclass frozen raises one of these
            rel.relation_type = RelationType.ENEMY

    def test_invalid_chapter_number(self):
        """测试无效的章节号"""
        with pytest.raises(ValueError, match="established_in_chapter must be >= 1"):
            Relationship(
                relation_type=RelationType.FRIEND,
                established_in_chapter=0,
                description="Met at school"
            )

        with pytest.raises(ValueError, match="established_in_chapter must be >= 1"):
            Relationship(
                relation_type=RelationType.FRIEND,
                established_in_chapter=-1,
                description="Met at school"
            )

    def test_empty_description(self):
        """测试空描述"""
        with pytest.raises(ValueError, match="description cannot be empty"):
            Relationship(
                relation_type=RelationType.FRIEND,
                established_in_chapter=1,
                description=""
            )

        with pytest.raises(ValueError, match="description cannot be empty"):
            Relationship(
                relation_type=RelationType.FRIEND,
                established_in_chapter=1,
                description="   "
            )

    def test_invalid_relation_type(self):
        """测试无效的关系类型"""
        with pytest.raises(TypeError, match="relation_type must be a RelationType enum"):
            Relationship(
                relation_type="friend",  # string instead of enum
                established_in_chapter=1,
                description="Met at school"
            )

    def test_invalid_description_type(self):
        """测试无效的描述类型"""
        with pytest.raises(TypeError, match="description must be a string"):
            Relationship(
                relation_type=RelationType.FRIEND,
                established_in_chapter=1,
                description=123  # number instead of string
            )


class TestRelationshipGraph:
    """测试 RelationshipGraph 值对象"""

    def test_create_empty_graph(self):
        """测试创建空关系图"""
        graph = RelationshipGraph()
        assert graph is not None

    def test_add_relationship(self):
        """测试添加关系"""
        graph = RelationshipGraph()
        char1 = CharacterId("alice")
        char2 = CharacterId("bob")
        rel = Relationship(
            relation_type=RelationType.FRIEND,
            established_in_chapter=1,
            description="Met at school"
        )

        graph.add_relationship(char1, char2, rel)

        current = graph.get_current_relationship(char1, char2)
        assert current is not None
        assert current.relation_type == RelationType.FRIEND
        assert current.description == "Met at school"

    def test_get_current_relationship_none_when_not_exists(self):
        """测试获取不存在的关系返回 None"""
        graph = RelationshipGraph()
        char1 = CharacterId("alice")
        char2 = CharacterId("bob")

        current = graph.get_current_relationship(char1, char2)
        assert current is None

    def test_relationship_history(self):
        """测试关系历史记录"""
        graph = RelationshipGraph()
        char1 = CharacterId("alice")
        char2 = CharacterId("bob")

        # 第一次见面 - 陌生人
        rel1 = Relationship(
            relation_type=RelationType.STRANGER,
            established_in_chapter=1,
            description="First encounter"
        )
        graph.add_relationship(char1, char2, rel1)

        # 成为朋友
        rel2 = Relationship(
            relation_type=RelationType.FRIEND,
            established_in_chapter=3,
            description="Became friends after working together"
        )
        graph.add_relationship(char1, char2, rel2)

        # 成为密友
        rel3 = Relationship(
            relation_type=RelationType.CLOSE_FRIEND,
            established_in_chapter=7,
            description="Shared deep secrets"
        )
        graph.add_relationship(char1, char2, rel3)

        # 检查当前关系
        current = graph.get_current_relationship(char1, char2)
        assert current.relation_type == RelationType.CLOSE_FRIEND
        assert current.established_in_chapter == 7

        # 检查历史记录
        history = graph.get_relationship_history(char1, char2)
        assert len(history) == 3
        assert history[0].relation_type == RelationType.STRANGER
        assert history[1].relation_type == RelationType.FRIEND
        assert history[2].relation_type == RelationType.CLOSE_FRIEND

    def test_relationship_is_bidirectional(self):
        """测试关系是双向的"""
        graph = RelationshipGraph()
        char1 = CharacterId("alice")
        char2 = CharacterId("bob")
        rel = Relationship(
            relation_type=RelationType.FRIEND,
            established_in_chapter=1,
            description="Met at school"
        )

        graph.add_relationship(char1, char2, rel)

        # 双向都应该能获取到关系
        current_1_2 = graph.get_current_relationship(char1, char2)
        current_2_1 = graph.get_current_relationship(char2, char1)

        assert current_1_2 is not None
        assert current_2_1 is not None
        assert current_1_2.relation_type == current_2_1.relation_type

    def test_get_all_relationships(self):
        """测试获取角色的所有关系"""
        graph = RelationshipGraph()
        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")

        rel1 = Relationship(
            relation_type=RelationType.FRIEND,
            established_in_chapter=1,
            description="Alice and Bob are friends"
        )
        rel2 = Relationship(
            relation_type=RelationType.ENEMY,
            established_in_chapter=2,
            description="Alice and Charlie are enemies"
        )

        graph.add_relationship(alice, bob, rel1)
        graph.add_relationship(alice, charlie, rel2)

        # 获取 Alice 的所有关系
        alice_relationships = graph.get_all_relationships(alice)
        assert len(alice_relationships) == 2

        # 检查关系内容
        char_ids = {char_id.value for char_id, _ in alice_relationships}
        assert "bob" in char_ids
        assert "charlie" in char_ids

        # 检查关系类型
        relations = {rel.relation_type for _, rel in alice_relationships}
        assert RelationType.FRIEND in relations
        assert RelationType.ENEMY in relations

    def test_get_all_relationships_empty(self):
        """测试获取没有关系的角色"""
        graph = RelationshipGraph()
        alice = CharacterId("alice")

        relationships = graph.get_all_relationships(alice)
        assert len(relationships) == 0

    def test_get_relationship_history_empty(self):
        """测试获取不存在的关系历史"""
        graph = RelationshipGraph()
        char1 = CharacterId("alice")
        char2 = CharacterId("bob")

        history = graph.get_relationship_history(char1, char2)
        assert len(history) == 0

    def test_complex_relationship_evolution(self):
        """测试复杂的关系演变"""
        graph = RelationshipGraph()
        alice = CharacterId("alice")
        bob = CharacterId("bob")

        # 陌生人 -> 朋友 -> 恋人 -> 敌人
        relationships = [
            Relationship(RelationType.STRANGER, 1, "First met"),
            Relationship(RelationType.FRIEND, 3, "Became friends"),
            Relationship(RelationType.LOVER, 5, "Fell in love"),
            Relationship(RelationType.ENEMY, 10, "Betrayal")
        ]

        for rel in relationships:
            graph.add_relationship(alice, bob, rel)

        # 验证当前关系
        current = graph.get_current_relationship(alice, bob)
        assert current.relation_type == RelationType.ENEMY

        # 验证完整历史
        history = graph.get_relationship_history(alice, bob)
        assert len(history) == 4
        assert [r.relation_type for r in history] == [
            RelationType.STRANGER,
            RelationType.FRIEND,
            RelationType.LOVER,
            RelationType.ENEMY
        ]
