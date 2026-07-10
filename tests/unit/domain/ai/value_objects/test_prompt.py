# tests/unit/domain/ai/value_objects/test_prompt.py
import pytest
from domain.ai.value_objects.prompt import Prompt


def test_prompt_creation():
    """测试创建 Prompt"""
    prompt = Prompt(
        system="你是一个小说创作助手",
        user="请帮我写一个开头"
    )
    assert prompt.system == "你是一个小说创作助手"
    assert prompt.user == "请帮我写一个开头"


def test_prompt_empty_user_raises_error():
    """测试空用户消息抛出异常"""
    with pytest.raises(ValueError):
        Prompt(system="系统消息", user="")


def test_prompt_whitespace_only_user_raises_error():
    """测试仅空白字符的用户消息抛出异常"""
    with pytest.raises(ValueError):
        Prompt(system="系统消息", user="   ")


def test_prompt_empty_system_raises_error():
    """测试空系统消息抛出异常"""
    with pytest.raises(ValueError):
        Prompt(system="", user="用户消息")


def test_prompt_whitespace_only_system_raises_error():
    """测试仅空白字符的系统消息抛出异常"""
    with pytest.raises(ValueError):
        Prompt(system="   ", user="用户消息")


def test_prompt_to_messages():
    """测试转换为消息列表"""
    prompt = Prompt(
        system="系统消息",
        user="用户消息"
    )
    messages = prompt.to_messages()

    assert len(messages) == 2
    assert messages[0]["role"] == "system"
    assert messages[0]["content"] == "系统消息"
    assert messages[1]["role"] == "user"
    assert messages[1]["content"] == "用户消息"
