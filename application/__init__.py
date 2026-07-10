"""应用层

应用层协调领域对象和基础设施，实现应用用例。
包含 DTOs 和应用服务。
"""
from application.core.dtos.novel_dto import NovelDTO
from application.core.dtos.chapter_dto import ChapterDTO
from application.core.services.novel_service import NovelService

__all__ = ["NovelDTO", "ChapterDTO", "NovelService"]
