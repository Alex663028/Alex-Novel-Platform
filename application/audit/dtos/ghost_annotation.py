"""Ghost Annotation DTO - 幽灵批注数据传输对象"""
from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class GhostAnnotation:
    """幽灵批注 - 非侵入式冲突提示

    在章节生成后，侧边栏显示的设定偏离警告。
    不打断生成流程，只在后置审查时提示。
    """
    type: str  # "setting_conflict", "character_inconsistency", "timeline_error"
    severity: str  # "warning", "error", "info"
    message: str  # 人类可读的提示信息
    entity_id: Optional[str] = None  # 相关实体 ID（可选）
    entity_name: Optional[str] = None  # 相关实体名称（可选）
    expected: Optional[str] = None  # 期望值（设定库中的值）
    actual: Optional[str] = None  # 实际值（大纲中的值）

    def __post_init__(self):
        """验证字段"""
        if not self.type:
            raise ValueError("type cannot be empty")
        if not self.severity:
            raise ValueError("severity cannot be empty")
        if not self.message:
            raise ValueError("message cannot be empty")

        valid_types = ["setting_conflict", "character_inconsistency", "timeline_error", "other"]
        if self.type not in valid_types:
            raise ValueError(f"type must be one of {valid_types}")

        valid_severities = ["info", "warning", "error"]
        if self.severity not in valid_severities:
            raise ValueError(f"severity must be one of {valid_severities}")

    def to_dict(self):
        """转换为字典（用于 JSON 序列化）"""
        return {
            "type": self.type,
            "severity": self.severity,
            "message": self.message,
            "entity_id": self.entity_id,
            "entity_name": self.entity_name,
            "expected": self.expected,
            "actual": self.actual,
        }
