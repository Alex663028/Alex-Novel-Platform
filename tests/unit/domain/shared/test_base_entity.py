# tests/unit/domain/shared/test_base_entity.py
import pytest
from datetime import datetime
from domain.shared.base_entity import BaseEntity


class _TestEntity(BaseEntity):
    """测试用实体"""
    def __init__(self, id: str, name: str):
        super().__init__(id)
        self.name = name


def test_base_entity_has_id():
    """测试实体有 ID"""
    entity = _TestEntity(id="test-1", name="Test")
    assert entity.id == "test-1"


def test_base_entity_has_timestamps():
    """测试实体有时间戳"""
    entity = _TestEntity(id="test-1", name="Test")
    assert isinstance(entity.created_at, datetime)
    assert isinstance(entity.updated_at, datetime)


def test_base_entity_equality_by_id():
    """测试实体相等性基于 ID"""
    entity1 = _TestEntity(id="test-1", name="Test1")
    entity2 = _TestEntity(id="test-1", name="Test2")
    entity3 = _TestEntity(id="test-2", name="Test1")

    assert entity1 == entity2  # 相同 ID
    assert entity1 != entity3  # 不同 ID
