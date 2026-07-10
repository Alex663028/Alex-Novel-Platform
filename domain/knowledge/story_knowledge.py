"""Story Knowledge aggregate root"""
from typing import List, Optional
from domain.shared.base_entity import BaseEntity
from domain.knowledge.knowledge_triple import KnowledgeTriple
from domain.knowledge.chapter_summary import ChapterSummary


class StoryKnowledge(BaseEntity):
    """故事知识聚合根

    管理小说的叙事知识，包括梗概锁定、章节摘要和知识三元组
    """

    def __init__(
        self,
        novel_id: str,
        version: int = 1,
        premise_lock: str = "",
        chapters: List[ChapterSummary] = None,
        facts: List[KnowledgeTriple] = None
    ):
        """初始化故事知识

        Args:
            novel_id: 小说ID
            version: 数据版本
            premise_lock: 梗概锁定
            chapters: 章节摘要列表
            facts: 知识三元组列表
        """
        super().__init__(novel_id)
        self.novel_id = novel_id
        self.version = version
        self.premise_lock = premise_lock
        self.chapters = chapters or []
        self.facts = facts or []

    def add_or_update_chapter(self, chapter: ChapterSummary) -> None:
        """添加或更新章节摘要

        Args:
            chapter: 章节摘要
        """
        for i, existing in enumerate(self.chapters):
            if existing.chapter_id == chapter.chapter_id:
                self.chapters[i] = chapter
                return
        self.chapters.append(chapter)

    def remove_chapter(self, chapter_id: int) -> None:
        """移除章节摘要

        Args:
            chapter_id: 章节号
        """
        self.chapters = [c for c in self.chapters if c.chapter_id != chapter_id]

    def get_chapter(self, chapter_id: int) -> Optional[ChapterSummary]:
        """获取章节摘要

        Args:
            chapter_id: 章节号

        Returns:
            章节摘要或None
        """
        for chapter in self.chapters:
            if chapter.chapter_id == chapter_id:
                return chapter
        return None

    def add_or_update_fact(self, fact: KnowledgeTriple) -> None:
        """添加或更新知识三元组

        Args:
            fact: 知识三元组
        """
        for i, existing in enumerate(self.facts):
            if existing.id == fact.id:
                self.facts[i] = fact
                return
        self.facts.append(fact)

    def remove_fact(self, fact_id: str) -> None:
        """移除知识三元组

        Args:
            fact_id: 三元组ID
        """
        self.facts = [f for f in self.facts if f.id != fact_id]

    def get_fact(self, fact_id: str) -> Optional[KnowledgeTriple]:
        """获取知识三元组

        Args:
            fact_id: 三元组ID

        Returns:
            知识三元组或None
        """
        for fact in self.facts:
            if fact.id == fact_id:
                return fact
        return None

    def __repr__(self) -> str:
        return f"<StoryKnowledge novel_id={self.novel_id} chapters={len(self.chapters)} facts={len(self.facts)}>"
