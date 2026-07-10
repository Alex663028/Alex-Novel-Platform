# domain/ai/value_objects/token_usage.py
from dataclasses import dataclass


@dataclass(frozen=True)
class TokenUsage:
    """Token 使用量值对象"""
    input_tokens: int
    output_tokens: int

    def __post_init__(self):
        if self.input_tokens < 0 or self.output_tokens < 0:
            raise ValueError("Token counts cannot be negative")

    @property
    def total_tokens(self) -> int:
        """总 token 数"""
        return self.input_tokens + self.output_tokens

    def __add__(self, other: 'TokenUsage') -> 'TokenUsage':
        """相加两个 TokenUsage"""
        return TokenUsage(
            input_tokens=self.input_tokens + other.input_tokens,
            output_tokens=self.output_tokens + other.output_tokens
        )
