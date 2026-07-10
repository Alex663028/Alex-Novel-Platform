# tests/unit/domain/shared/test_events.py
import pytest
from datetime import datetime
from domain.shared.events import DomainEvent


class _TestEvent(DomainEvent):
    """测试用事件"""
    def __init__(self, aggregate_id: str, data: str):
        super().__init__(aggregate_id)
        self.data = data


def test_domain_event_has_event_id():
    """测试事件有 event_id"""
    event = _TestEvent(aggregate_id="agg-1", data="test")
    assert event.event_id is not None
    assert isinstance(event.event_id, str)
    assert len(event.event_id) > 0


def test_domain_event_has_aggregate_id():
    """测试事件有 aggregate_id"""
    event = _TestEvent(aggregate_id="agg-1", data="test")
    assert event.aggregate_id == "agg-1"


def test_domain_event_has_occurred_at():
    """测试事件有 occurred_at 时间戳"""
    event = _TestEvent(aggregate_id="agg-1", data="test")
    assert isinstance(event.occurred_at, datetime)


def test_domain_event_unique_event_ids():
    """测试每个事件有唯一的 event_id"""
    event1 = _TestEvent(aggregate_id="agg-1", data="test1")
    event2 = _TestEvent(aggregate_id="agg-1", data="test2")
    assert event1.event_id != event2.event_id


def test_domain_event_to_dict():
    """测试事件转换为字典"""
    event = _TestEvent(aggregate_id="agg-1", data="test")
    event_dict = event.to_dict()

    assert "event_id" in event_dict
    assert "aggregate_id" in event_dict
    assert "occurred_at" in event_dict
    assert "event_type" in event_dict

    assert event_dict["event_id"] == event.event_id
    assert event_dict["aggregate_id"] == "agg-1"
    assert event_dict["event_type"] == "_TestEvent"
    assert isinstance(event_dict["occurred_at"], str)  # ISO format string


def test_domain_event_occurred_at_iso_format():
    """测试 occurred_at 转换为 ISO 格式字符串"""
    event = _TestEvent(aggregate_id="agg-1", data="test")
    event_dict = event.to_dict()

    # 验证可以解析回 datetime
    occurred_at = datetime.fromisoformat(event_dict["occurred_at"])
    assert isinstance(occurred_at, datetime)
