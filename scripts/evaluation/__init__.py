"""AI 功能评测脚本集

用于测试和优化各种 AI 生成功能的效果。
使用项目现有服务接口，不重新实现LLM调用。
"""

from .base_evaluator import (
    BaseEvaluator,
    EvaluationResult,
    EvaluationReport,
    EvaluationMetric,
    create_metric,
)
from .chapter_generation_evaluator import ChapterGenerationEvaluator
from .macro_planning_evaluator import MacroPlanningEvaluator
from .beat_sheet_evaluator import BeatSheetEvaluator
from .knowledge_evaluator import KnowledgeEvaluator
from .consistency_evaluator import ConsistencyEvaluator

__all__ = [
    "BaseEvaluator",
    "EvaluationResult",
    "EvaluationReport",
    "EvaluationMetric",
    "create_metric",
    "ChapterGenerationEvaluator",
    "MacroPlanningEvaluator",
    "BeatSheetEvaluator",
    "KnowledgeEvaluator",
    "ConsistencyEvaluator",
]
