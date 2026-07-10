# tests/unit/domain/ai/value_objects/test_token_usage.py
import pytest
from domain.ai.value_objects.token_usage import TokenUsage


def test_token_usage_creation():
    """测试创建 TokenUsage"""
    usage = TokenUsage(input_tokens=100, output_tokens=200)
    assert usage.input_tokens == 100
    assert usage.output_tokens == 200
    assert usage.total_tokens == 300


def test_token_usage_negative_raises_error():
    """测试负数 token 抛出异常"""
    with pytest.raises(ValueError):
        TokenUsage(input_tokens=-10, output_tokens=100)


def test_token_usage_addition():
    """测试 TokenUsage 相加"""
    usage1 = TokenUsage(input_tokens=100, output_tokens=200)
    usage2 = TokenUsage(input_tokens=50, output_tokens=150)

    total = usage1 + usage2

    assert total.input_tokens == 150
    assert total.output_tokens == 350
    assert total.total_tokens == 500
