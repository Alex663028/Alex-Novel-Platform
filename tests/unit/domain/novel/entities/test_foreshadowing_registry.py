# tests/unit/domain/novel/entities/test_foreshadowing_registry.py
import pytest
from domain.novel.entities.foreshadowing_registry import ForeshadowingRegistry
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.foreshadowing import (
    Foreshadowing,
    ForeshadowingStatus,
    ImportanceLevel
)
from domain.shared.exceptions import InvalidOperationError


class TestForeshadowingRegistry:
    """测试伏笔注册表实体"""

    def test_create_registry(self):
        """测试创建注册表"""
        novel_id = NovelId("novel-123")
        registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

        assert registry.id == "registry-1"
        assert registry.novel_id == novel_id
        assert registry.foreshadowings == []

    def test_register_foreshadowing(self):
        """测试注册伏笔"""
        novel_id = NovelId("novel-123")
        registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

        foreshadowing = Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="神秘的预言",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED,
            suggested_resolve_chapter=10
        )

        registry.register(foreshadowing)

        assert len(registry.foreshadowings) == 1
        assert registry.foreshadowings[0] == foreshadowing

    def test_register_duplicate_foreshadowing(self):
        """测试注册重复伏笔"""
        novel_id = NovelId("novel-123")
        registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

        foreshadowing = Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="神秘的预言",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED
        )

        registry.register(foreshadowing)

        with pytest.raises(InvalidOperationError, match="Foreshadowing with id 'foreshadow-1' already exists"):
            registry.register(foreshadowing)

    def test_mark_resolved(self):
        """测试标记伏笔为已解决"""
        novel_id = NovelId("novel-123")
        registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

        foreshadowing = Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="神秘的预言",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED
        )

        registry.register(foreshadowing)
        registry.mark_resolved("foreshadow-1", resolved_in_chapter=10)

        resolved = registry.get_by_id("foreshadow-1")
        assert resolved is not None
        assert resolved.status == ForeshadowingStatus.RESOLVED
        assert resolved.resolved_in_chapter == 10

    def test_mark_resolved_nonexistent(self):
        """测试标记不存在的伏笔为已解决"""
        novel_id = NovelId("novel-123")
        registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

        with pytest.raises(InvalidOperationError, match="Foreshadowing with id 'nonexistent' not found"):
            registry.mark_resolved("nonexistent", resolved_in_chapter=10)

    def test_get_by_id(self):
        """测试通过 ID 获取伏笔"""
        novel_id = NovelId("novel-123")
        registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

        foreshadowing = Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="神秘的预言",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED
        )

        registry.register(foreshadowing)

        found = registry.get_by_id("foreshadow-1")
        assert found == foreshadowing

        not_found = registry.get_by_id("nonexistent")
        assert not_found is None

    def test_get_unresolved(self):
        """测试获取未解决的伏笔"""
        novel_id = NovelId("novel-123")
        registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

        planted = Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="未解决的伏笔",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED
        )

        resolved = Foreshadowing(
            id="foreshadow-2",
            planted_in_chapter=2,
            description="已解决的伏笔",
            importance=ImportanceLevel.MEDIUM,
            status=ForeshadowingStatus.RESOLVED,
            resolved_in_chapter=5
        )

        registry.register(planted)
        registry.register(resolved)

        unresolved = registry.get_unresolved()
        assert len(unresolved) == 1
        assert unresolved[0] == planted

    def test_get_ready_to_resolve(self):
        """测试获取准备解决的伏笔"""
        novel_id = NovelId("novel-123")
        registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

        # 建议在第 10 章解决
        ready = Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="准备解决的伏笔",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED,
            suggested_resolve_chapter=10
        )

        # 建议在第 15 章解决
        not_ready = Foreshadowing(
            id="foreshadow-2",
            planted_in_chapter=2,
            description="还不能解决的伏笔",
            importance=ImportanceLevel.MEDIUM,
            status=ForeshadowingStatus.PLANTED,
            suggested_resolve_chapter=15
        )

        # 没有建议解决章节
        no_suggestion = Foreshadowing(
            id="foreshadow-3",
            planted_in_chapter=3,
            description="没有建议的伏笔",
            importance=ImportanceLevel.LOW,
            status=ForeshadowingStatus.PLANTED
        )

        registry.register(ready)
        registry.register(not_ready)
        registry.register(no_suggestion)

        # 当前在第 12 章
        ready_list = registry.get_ready_to_resolve(current_chapter=12)
        assert len(ready_list) == 1
        assert ready_list[0] == ready

    def test_foreshadowings_returns_copy(self):
        """测试 foreshadowings 属性返回副本"""
        novel_id = NovelId("novel-123")
        registry = ForeshadowingRegistry(id="registry-1", novel_id=novel_id)

        foreshadowing = Foreshadowing(
            id="foreshadow-1",
            planted_in_chapter=1,
            description="测试伏笔",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED
        )

        registry.register(foreshadowing)

        # 获取副本并尝试修改
        copy = registry.foreshadowings
        copy.clear()

        # 原始数据应该不受影响
        assert len(registry.foreshadowings) == 1
