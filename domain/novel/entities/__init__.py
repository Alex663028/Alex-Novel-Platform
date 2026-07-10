# domain/novel/entities/__init__.py
from domain.novel.entities.novel import Novel, NovelStage
from domain.novel.entities.chapter import Chapter, ChapterStatus
from domain.novel.entities.storyline import Storyline

__all__ = ["Novel", "NovelStage", "Chapter", "ChapterStatus", "Storyline"]
