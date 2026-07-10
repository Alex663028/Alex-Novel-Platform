"""
数据模型：Pydantic模型定义
"""

from .responses import SuccessResponse, ErrorResponse, PaginatedResponse
from .stats_models import (
    GlobalStats,
    BookStats,
    ChapterStats,
    WritingProgress,
    ContentAnalysis
)

__all__ = [
    "SuccessResponse",
    "ErrorResponse",
    "PaginatedResponse",
    "GlobalStats",
    "BookStats",
    "ChapterStats",
    "WritingProgress",
    "ContentAnalysis"
]
