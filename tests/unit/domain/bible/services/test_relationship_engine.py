import pytest
import time
from domain.bible.value_objects.character_id import CharacterId
from domain.bible.value_objects.relationship import Relationship, RelationType
from domain.bible.value_objects.relationship_graph import RelationshipGraph
from domain.bible.services.relationship_engine import (
    RelationshipEngine,
    RelationshipTrend,
)


class TestRelationshipEngineBasics:
    """测试 RelationshipEngine 基本功能"""

    def test_create_engine(self):
        """测试创建关系引擎"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)
        assert engine is not None

    def test_add_relationship(self):
        """测试添加关系"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        char1 = CharacterId("alice")
        char2 = CharacterId("bob")
        rel = Relationship(
            relation_type=RelationType.FRIEND,
            established_in_chapter=1,
            description="Met at school"
        )

        engine.add_relationship(char1, char2, rel)

        current = engine.get_current_relationship(char1, char2)
        assert current is not None
        assert current.relation_type == RelationType.FRIEND

    def test_get_current_relationship(self):
        """测试获取当前关系"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        char1 = CharacterId("alice")
        char2 = CharacterId("bob")

        # 添加多个关系
        rel1 = Relationship(RelationType.STRANGER, 1, "First met")
        rel2 = Relationship(RelationType.FRIEND, 3, "Became friends")

        engine.add_relationship(char1, char2, rel1)
        engine.add_relationship(char1, char2, rel2)

        current = engine.get_current_relationship(char1, char2)
        assert current.relation_type == RelationType.FRIEND

    def test_get_relationship_history(self):
        """测试获取关系历史"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        char1 = CharacterId("alice")
        char2 = CharacterId("bob")

        rel1 = Relationship(RelationType.STRANGER, 1, "First met")
        rel2 = Relationship(RelationType.FRIEND, 3, "Became friends")
        rel3 = Relationship(RelationType.CLOSE_FRIEND, 5, "Best friends")

        engine.add_relationship(char1, char2, rel1)
        engine.add_relationship(char1, char2, rel2)
        engine.add_relationship(char1, char2, rel3)

        history = engine.get_relationship_history(char1, char2)
        assert len(history) == 3
        assert history[0].relation_type == RelationType.STRANGER
        assert history[1].relation_type == RelationType.FRIEND
        assert history[2].relation_type == RelationType.CLOSE_FRIEND


class TestRelationshipEnginePathFinding:
    """测试路径查找功能"""

    def test_find_direct_path(self):
        """测试查找直接连接"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        rel = Relationship(RelationType.FRIEND, 1, "Friends")
        engine.add_relationship(alice, bob, rel)

        path = engine.find_path(alice, bob)
        assert path is not None
        assert len(path) == 2
        assert path[0] == alice
        assert path[1] == bob

    def test_find_indirect_path(self):
        """测试查找间接连接"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")

        # Alice -> Bob -> Charlie
        rel1 = Relationship(RelationType.FRIEND, 1, "Alice and Bob")
        rel2 = Relationship(RelationType.FRIEND, 2, "Bob and Charlie")

        engine.add_relationship(alice, bob, rel1)
        engine.add_relationship(bob, charlie, rel2)

        path = engine.find_path(alice, charlie)
        assert path is not None
        assert len(path) == 3
        assert path[0] == alice
        assert path[1] == bob
        assert path[2] == charlie

    def test_find_path_no_connection(self):
        """测试查找不存在的路径"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")

        # Alice -> Bob, Charlie is isolated
        rel = Relationship(RelationType.FRIEND, 1, "Alice and Bob")
        engine.add_relationship(alice, bob, rel)

        path = engine.find_path(alice, charlie)
        assert path is None

    def test_find_path_max_depth(self):
        """测试路径查找深度限制"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        # Create a chain: A -> B -> C -> D -> E
        chars = [CharacterId(name) for name in ["alice", "bob", "charlie", "dave", "eve"]]

        for i in range(len(chars) - 1):
            rel = Relationship(RelationType.FRIEND, i + 1, f"Connection {i}")
            engine.add_relationship(chars[i], chars[i + 1], rel)

        # Should find path with max_depth=5
        path = engine.find_path(chars[0], chars[4], max_depth=5)
        assert path is not None
        assert len(path) == 5

        # Should not find path with max_depth=3
        path = engine.find_path(chars[0], chars[4], max_depth=3)
        assert path is None

    def test_find_path_self(self):
        """测试查找自己到自己的路径"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")

        path = engine.find_path(alice, alice)
        assert path is not None
        assert len(path) == 1
        assert path[0] == alice


class TestRelationshipEngineCommonConnections:
    """测试共同连接功能"""

    def test_get_common_connections_none(self):
        """测试没有共同连接"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        common = engine.get_common_connections(alice, bob)
        assert len(common) == 0

    def test_get_common_connections_single(self):
        """测试单个共同连接"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")

        # Alice -> Charlie, Bob -> Charlie
        rel1 = Relationship(RelationType.FRIEND, 1, "Alice and Charlie")
        rel2 = Relationship(RelationType.FRIEND, 2, "Bob and Charlie")

        engine.add_relationship(alice, charlie, rel1)
        engine.add_relationship(bob, charlie, rel2)

        common = engine.get_common_connections(alice, bob)
        assert len(common) == 1
        assert charlie in common

    def test_get_common_connections_multiple(self):
        """测试多个共同连接"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")
        dave = CharacterId("dave")
        eve = CharacterId("eve")

        # Alice -> Charlie, Dave, Eve
        # Bob -> Charlie, Dave
        engine.add_relationship(alice, charlie, Relationship(RelationType.FRIEND, 1, "AC"))
        engine.add_relationship(alice, dave, Relationship(RelationType.FRIEND, 1, "AD"))
        engine.add_relationship(alice, eve, Relationship(RelationType.FRIEND, 1, "AE"))
        engine.add_relationship(bob, charlie, Relationship(RelationType.FRIEND, 1, "BC"))
        engine.add_relationship(bob, dave, Relationship(RelationType.FRIEND, 1, "BD"))

        common = engine.get_common_connections(alice, bob)
        assert len(common) == 2
        assert charlie in common
        assert dave in common
        assert eve not in common

    def test_get_common_connections_direct_relationship(self):
        """测试直接关系不算共同连接"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")

        # Alice -> Bob (direct)
        # Alice -> Charlie, Bob -> Charlie (common)
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "AB"))
        engine.add_relationship(alice, charlie, Relationship(RelationType.FRIEND, 1, "AC"))
        engine.add_relationship(bob, charlie, Relationship(RelationType.FRIEND, 1, "BC"))

        common = engine.get_common_connections(alice, bob)
        assert len(common) == 1
        assert charlie in common
        assert alice not in common
        assert bob not in common


class TestRelationshipEngineCluster:
    """测试关系网络聚类功能"""

    def test_get_relationship_cluster_depth_1(self):
        """测试获取深度1的关系网络"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")

        # Alice -> Bob, Charlie
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "AB"))
        engine.add_relationship(alice, charlie, Relationship(RelationType.FRIEND, 1, "AC"))

        cluster = engine.get_relationship_cluster(alice, depth=1)
        assert len(cluster) == 2
        assert bob in cluster
        assert charlie in cluster

    def test_get_relationship_cluster_depth_2(self):
        """测试获取深度2的关系网络"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")
        dave = CharacterId("dave")

        # Alice -> Bob -> Charlie
        # Alice -> Dave
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "AB"))
        engine.add_relationship(bob, charlie, Relationship(RelationType.FRIEND, 1, "BC"))
        engine.add_relationship(alice, dave, Relationship(RelationType.FRIEND, 1, "AD"))

        cluster = engine.get_relationship_cluster(alice, depth=2)
        assert len(cluster) == 3
        assert bob in cluster
        assert charlie in cluster
        assert dave in cluster

    def test_get_relationship_cluster_no_duplicates(self):
        """测试关系网络不包含重复"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")

        # Triangle: Alice -> Bob -> Charlie -> Alice
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "AB"))
        engine.add_relationship(bob, charlie, Relationship(RelationType.FRIEND, 1, "BC"))
        engine.add_relationship(charlie, alice, Relationship(RelationType.FRIEND, 1, "CA"))

        cluster = engine.get_relationship_cluster(alice, depth=2)
        assert len(cluster) == 2
        assert bob in cluster
        assert charlie in cluster


class TestRelationshipEngineStrength:
    """测试关系强度计算"""

    def test_calculate_strength_no_relationship(self):
        """测试没有关系的强度"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        strength = engine.calculate_relationship_strength(alice, bob)
        assert strength == 0.0

    def test_calculate_strength_base_values(self):
        """测试基础关系强度"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")

        # Test different relationship types
        test_cases = [
            (RelationType.FAMILY, 10.0),
            (RelationType.LOVER, 9.0),
            (RelationType.CLOSE_FRIEND, 8.0),
            (RelationType.FRIEND, 6.0),
            (RelationType.RIVAL, 4.0),
            (RelationType.ACQUAINTANCE, 3.0),
            (RelationType.ENEMY, 2.0),
            (RelationType.STRANGER, 1.0),
        ]

        for rel_type, expected_base in test_cases:
            bob = CharacterId(f"bob_{rel_type.value}")
            rel = Relationship(rel_type, 1, f"Test {rel_type.value}")
            engine.add_relationship(alice, bob, rel)

            strength = engine.calculate_relationship_strength(alice, bob)
            assert strength == expected_base

    def test_calculate_strength_with_history(self):
        """测试包含历史的关系强度"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        # Add multiple relationships (history)
        engine.add_relationship(alice, bob, Relationship(RelationType.STRANGER, 1, "Met"))
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 2, "Friends"))
        engine.add_relationship(alice, bob, Relationship(RelationType.CLOSE_FRIEND, 3, "Close"))

        strength = engine.calculate_relationship_strength(alice, bob)
        # Base: 8.0 (CLOSE_FRIEND) + 2 interactions (3 total - 1) = 10.0
        assert strength == 10.0

    def test_calculate_strength_with_common_connections(self):
        """测试包含共同连接的关系强度"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")
        charlie = CharacterId("charlie")
        dave = CharacterId("dave")

        # Alice and Bob are friends
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "AB"))

        # Add common connections
        engine.add_relationship(alice, charlie, Relationship(RelationType.FRIEND, 1, "AC"))
        engine.add_relationship(bob, charlie, Relationship(RelationType.FRIEND, 1, "BC"))
        engine.add_relationship(alice, dave, Relationship(RelationType.FRIEND, 1, "AD"))
        engine.add_relationship(bob, dave, Relationship(RelationType.FRIEND, 1, "BD"))

        strength = engine.calculate_relationship_strength(alice, bob)
        # Base: 6.0 (FRIEND) + 0 interactions + 2 common connections * 0.5 = 7.0
        assert strength == 7.0


class TestRelationshipEngineTrend:
    """测试关系趋势分析"""

    def test_analyze_trend_no_relationship(self):
        """测试没有关系的趋势"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        trend = engine.analyze_relationship_trend(alice, bob)
        assert trend == RelationshipTrend.STABLE

    def test_analyze_trend_single_relationship(self):
        """测试单一关系的趋势"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "Friends"))

        trend = engine.analyze_relationship_trend(alice, bob)
        assert trend == RelationshipTrend.STABLE

    def test_analyze_trend_improving(self):
        """测试改善趋势"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        # Stranger -> Friend -> Close Friend
        engine.add_relationship(alice, bob, Relationship(RelationType.STRANGER, 1, "Met"))
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 2, "Friends"))
        engine.add_relationship(alice, bob, Relationship(RelationType.CLOSE_FRIEND, 3, "Close"))

        trend = engine.analyze_relationship_trend(alice, bob)
        assert trend == RelationshipTrend.IMPROVING

    def test_analyze_trend_deteriorating(self):
        """测试恶化趋势"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        # Close Friend -> Friend -> Acquaintance
        engine.add_relationship(alice, bob, Relationship(RelationType.CLOSE_FRIEND, 1, "Close"))
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 2, "Drifting"))
        engine.add_relationship(alice, bob, Relationship(RelationType.ACQUAINTANCE, 3, "Distant"))

        trend = engine.analyze_relationship_trend(alice, bob)
        assert trend == RelationshipTrend.DETERIORATING

    def test_analyze_trend_volatile(self):
        """测试波动趋势"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        # Friend -> Enemy -> Friend -> Enemy
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "Friends"))
        engine.add_relationship(alice, bob, Relationship(RelationType.ENEMY, 2, "Fight"))
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 3, "Reconcile"))
        engine.add_relationship(alice, bob, Relationship(RelationType.ENEMY, 4, "Fight again"))

        trend = engine.analyze_relationship_trend(alice, bob)
        assert trend == RelationshipTrend.VOLATILE

    def test_analyze_trend_stable_with_history(self):
        """测试稳定趋势（有历史但无显著变化）"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        # Friend -> Friend -> Friend (same type, different descriptions)
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "Met"))
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 2, "Still friends"))
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 3, "Good friends"))

        trend = engine.analyze_relationship_trend(alice, bob)
        assert trend == RelationshipTrend.STABLE


class TestRelationshipEngineSuggestions:
    """测试关系发展建议"""

    def test_suggest_no_relationship(self):
        """测试没有关系的建议"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        suggestions = engine.suggest_relationship_development(alice, bob)
        assert len(suggestions) > 0
        assert any("introduce" in s.lower() or "meet" in s.lower() for s in suggestions)

    def test_suggest_stranger(self):
        """测试陌生人关系的建议"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        engine.add_relationship(alice, bob, Relationship(RelationType.STRANGER, 1, "Met"))

        suggestions = engine.suggest_relationship_development(alice, bob)
        assert len(suggestions) > 0
        assert any("conversation" in s.lower() or "interact" in s.lower() for s in suggestions)

    def test_suggest_friend(self):
        """测试朋友关系的建议"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "Friends"))

        suggestions = engine.suggest_relationship_development(alice, bob)
        assert len(suggestions) > 0

    def test_suggest_enemy(self):
        """测试敌人关系的建议"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        engine.add_relationship(alice, bob, Relationship(RelationType.ENEMY, 1, "Enemies"))

        suggestions = engine.suggest_relationship_development(alice, bob)
        assert len(suggestions) > 0
        assert any("conflict" in s.lower() or "reconcile" in s.lower() for s in suggestions)

    def test_suggest_improving_trend(self):
        """测试改善趋势的建议"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        # Improving relationship
        engine.add_relationship(alice, bob, Relationship(RelationType.STRANGER, 1, "Met"))
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 2, "Friends"))

        suggestions = engine.suggest_relationship_development(alice, bob)
        assert len(suggestions) > 0


class TestRelationshipEnginePerformance:
    """测试性能要求"""

    def test_large_graph_path_finding(self):
        """测试大规模图的路径查找性能"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        # Create 1000 characters in a chain
        chars = [CharacterId(f"char_{i}") for i in range(1000)]

        for i in range(len(chars) - 1):
            rel = Relationship(RelationType.FRIEND, 1, f"Connection {i}")
            engine.add_relationship(chars[i], chars[i + 1], rel)

        # Measure path finding time
        start = time.time()
        path = engine.find_path(chars[0], chars[999], max_depth=1000)
        elapsed = time.time() - start

        assert path is not None
        assert len(path) == 1000
        assert elapsed < 0.1  # Should be < 100ms

    def test_large_graph_relationship_query(self):
        """测试大规模图的关系查询性能"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        # Create a hub with 10000 connections
        hub = CharacterId("hub")
        chars = [CharacterId(f"char_{i}") for i in range(10000)]

        for char in chars:
            rel = Relationship(RelationType.FRIEND, 1, f"Connection to {char.value}")
            engine.add_relationship(hub, char, rel)

        # Measure query time
        start = time.time()
        current = engine.get_current_relationship(hub, chars[5000])
        elapsed = time.time() - start

        assert current is not None
        assert elapsed < 0.01  # Should be < 10ms

    def test_large_graph_common_connections(self):
        """测试大规模图的共同连接查询性能"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        # Create 5000 common connections
        for i in range(5000):
            char = CharacterId(f"char_{i}")
            engine.add_relationship(alice, char, Relationship(RelationType.FRIEND, 1, f"AC{i}"))
            engine.add_relationship(bob, char, Relationship(RelationType.FRIEND, 1, f"BC{i}"))

        # Measure query time
        start = time.time()
        common = engine.get_common_connections(alice, bob)
        elapsed = time.time() - start

        assert len(common) == 5000
        assert elapsed < 0.1  # Should be reasonable

    def test_large_graph_strength_calculation(self):
        """测试大规模图的强度计算性能"""
        graph = RelationshipGraph()
        engine = RelationshipEngine(graph)

        alice = CharacterId("alice")
        bob = CharacterId("bob")

        # Add relationship with many common connections
        engine.add_relationship(alice, bob, Relationship(RelationType.FRIEND, 1, "AB"))

        # Create 1000 common connections
        for i in range(1000):
            char = CharacterId(f"char_{i}")
            engine.add_relationship(alice, char, Relationship(RelationType.FRIEND, 1, f"AC{i}"))
            engine.add_relationship(bob, char, Relationship(RelationType.FRIEND, 1, f"BC{i}"))

        # Measure calculation time
        start = time.time()
        strength = engine.calculate_relationship_strength(alice, bob)
        elapsed = time.time() - start

        assert strength > 0
        assert elapsed < 0.1  # Should be reasonable
