"""依赖注入配置 - 兼容层

提供 FastAPI 依赖注入函数，用于创建服务和仓储实例。
拆分后：真正实现在 deps/services.py；本文件保留导入兼容。
"""
from __future__ import annotations

from interfaces.api.deps.services import *  # noqa: F401,F403

__all__ = [
    "_anthropic_api_key",
    "_anthropic_base_url",
    "_anthropic_settings",
    "_openai_api_key",
    "_openai_base_url",
    "_openai_settings",
]
