"""
知识图谱自动推断服务
基于章节元素关联自动生成三元组
"""

import uuid
from typing import Dict, List, Optional, Tuple
from datetime import datetime

from domain.bible.triple import Triple, SourceType
from domain.knowledge.triple_provenance import TripleProvenanceRecord
from domain.structure.chapter_element import ChapterElement, ElementType, RelationType, Importance
from infrastructure.persistence.database.triple_repository import TripleRepository
from infrastructure.persistence.database.chapter_element_repository import ChapterElementRepository
from infrastructure.persistence.database.story_node_repository import StoryNodeRepository

InferenceBundle = Tuple[Triple, List[TripleProvenanceRecord]]


class KnowledgeGraphService:
    """知识图谱自动推断服务"""

    def __init__(
        self,
        triple_repo: TripleRepository,
        chapter_element_repo: ChapterElementRepository,
        story_node_repo: StoryNodeRepository
    ):
        self.triple_repo = triple_repo
        self.chapter_element_repo = chapter_element_repo
        self.story_node_repo = story_node_repo

    async def infer_from_chapter(self, chapter_id: str) -> List[Triple]:
        """
        从章节推断三元组

        Args:
            chapter_id: 章节 ID

        Returns:
            推断的三元组列表
        """
        # 获取章节信息
        chapter = await self.story_node_repo.get_by_id(chapter_id)
        if not chapter:
            return []

        # 获取章节关联的所有元素
        elements = await self.chapter_element_repo.get_by_chapter(chapter_id)

        bundles: List[InferenceBundle] = []

        bundles.extend(await self._infer_character_acquaintance(chapter, elements))
        bundles.extend(await self._infer_character_interaction(chapter, elements))
        bundles.extend(await self._infer_character_location(chapter, elements))
        bundles.extend(await self._infer_character_item(chapter, elements))
        bundles.extend(await self._infer_character_organization(chapter, elements))
        bundles.extend(await self._infer_character_event(chapter, elements))
        bundles.extend(await self._infer_event_location(chapter, elements))

        for triple, prov in bundles:
            await self._save_or_update_triple(triple, prov)

        return [t for t, _ in bundles]

    async def infer_from_novel(self, novel_id: str) -> Dict[str, int]:
        """
        从整部小说推断三元组

        Args:
            novel_id: 小说 ID

        Returns:
            统计信息
        """
        # 获取所有章节
        chapters = await self.story_node_repo.get_chapters_by_novel(novel_id)

        stats = {
            "total_chapters": len(chapters),
            "inferred_triples": 0,
            "updated_triples": 0
        }

        # 逐章推断
        for chapter in chapters:
            triples = await self.infer_from_chapter(chapter.id)
            stats["inferred_triples"] += len(triples)

        # 全局推断（跨章节分析）
        global_triples = await self._infer_global_patterns(novel_id)
        stats["inferred_triples"] += len(global_triples)

        return stats

    async def _infer_character_acquaintance(
        self,
        chapter,
        elements: List[ChapterElement]
    ) -> List[InferenceBundle]:
        """推断人物认识关系（共同出场）"""
        characters = [
            e for e in elements
            if e.element_type == ElementType.CHARACTER
            and e.relation_type == RelationType.APPEARS
            and e.importance in [Importance.MAJOR, Importance.NORMAL]
        ]

        if len(characters) < 2:
            return []

        out: List[InferenceBundle] = []
        for i, char_a in enumerate(characters):
            for char_b in characters[i + 1:]:
                triple = Triple(
                    id=f"triple-{uuid.uuid4().hex[:8]}",
                    novel_id=chapter.novel_id,
                    subject_type="character",
                    subject_id=char_a.element_id,
                    predicate="认识",
                    object_type="character",
                    object_id=char_b.element_id,
                    confidence=0.6,
                    source_type=SourceType.CHAPTER_INFERRED,
                    source_chapter_id=chapter.id,
                    first_appearance=str(chapter.number),
                    related_chapters=[str(chapter.number)],
                )
                prov = [
                    TripleProvenanceRecord(
                        "coappearance", chapter.id, char_a.id, "evidence"
                    ),
                    TripleProvenanceRecord(
                        "coappearance", chapter.id, char_b.id, "evidence"
                    ),
                ]
                out.append((triple, prov))

        return out

    async def _infer_character_interaction(
        self,
        chapter,
        elements: List[ChapterElement]
    ) -> List[InferenceBundle]:
        """推断人物互动关系（POV 人物 + 出场人物）"""
        if not chapter.pov_character_id:
            return []

        other_characters = [
            e for e in elements
            if e.element_type == ElementType.CHARACTER
            and e.relation_type == RelationType.APPEARS
            and e.importance == Importance.MAJOR
            and e.element_id != chapter.pov_character_id
        ]

        out: List[InferenceBundle] = []
        for char in other_characters:
            triple = Triple(
                id=f"triple-{uuid.uuid4().hex[:8]}",
                novel_id=chapter.novel_id,
                subject_type="character",
                subject_id=chapter.pov_character_id,
                predicate="互动",
                object_type="character",
                object_id=char.element_id,
                confidence=0.7,
                source_type=SourceType.CHAPTER_INFERRED,
                source_chapter_id=chapter.id,
                first_appearance=str(chapter.number),
                related_chapters=[str(chapter.number)],
            )
            prov = [
                TripleProvenanceRecord(
                    "pov_interaction",
                    story_node_id=chapter.id,
                    chapter_element_id=None,
                    role="pov_context",
                ),
                TripleProvenanceRecord(
                    "pov_interaction",
                    story_node_id=chapter.id,
                    chapter_element_id=char.id,
                    role="evidence",
                ),
            ]
            out.append((triple, prov))

        return out

    async def _infer_character_location(
        self,
        chapter,
        elements: List[ChapterElement]
    ) -> List[InferenceBundle]:
        """推断人物-地点关系（人物在地点出场）"""
        characters = [
            e for e in elements
            if e.element_type == ElementType.CHARACTER
            and e.relation_type == RelationType.APPEARS
        ]

        locations = [
            e for e in elements
            if e.element_type == ElementType.LOCATION
            and e.relation_type == RelationType.SCENE
        ]

        out: List[InferenceBundle] = []
        for char in characters:
            for loc in locations:
                triple = Triple(
                    id=f"triple-{uuid.uuid4().hex[:8]}",
                    novel_id=chapter.novel_id,
                    subject_type="character",
                    subject_id=char.element_id,
                    predicate="到访过",
                    object_type="location",
                    object_id=loc.element_id,
                    confidence=0.9,
                    source_type=SourceType.CHAPTER_INFERRED,
                    source_chapter_id=chapter.id,
                    first_appearance=str(chapter.number),
                    related_chapters=[str(chapter.number)],
                )
                prov = [
                    TripleProvenanceRecord(
                        "character_location", chapter.id, char.id, "subject_element"
                    ),
                    TripleProvenanceRecord(
                        "character_location", chapter.id, loc.id, "object_element"
                    ),
                ]
                out.append((triple, prov))

        return out

    async def _infer_character_item(
        self,
        chapter,
        elements: List[ChapterElement]
    ) -> List[InferenceBundle]:
        """推断人物-道具关系（人物使用道具）"""
        characters = [
            e for e in elements
            if e.element_type == ElementType.CHARACTER
            and e.relation_type == RelationType.APPEARS
        ]

        items = [
            e for e in elements
            if e.element_type == ElementType.ITEM
            and e.relation_type == RelationType.USES
        ]

        out: List[InferenceBundle] = []
        for char in characters:
            for item in items:
                triple = Triple(
                    id=f"triple-{uuid.uuid4().hex[:8]}",
                    novel_id=chapter.novel_id,
                    subject_type="character",
                    subject_id=char.element_id,
                    predicate="使用过",
                    object_type="item",
                    object_id=item.element_id,
                    confidence=0.8,
                    source_type=SourceType.CHAPTER_INFERRED,
                    source_chapter_id=chapter.id,
                    first_appearance=str(chapter.number),
                    related_chapters=[str(chapter.number)],
                )
                prov = [
                    TripleProvenanceRecord(
                        "character_item", chapter.id, char.id, "subject_element"
                    ),
                    TripleProvenanceRecord(
                        "character_item", chapter.id, item.id, "object_element"
                    ),
                ]
                out.append((triple, prov))

        return out

    async def _infer_character_organization(
        self,
        chapter,
        elements: List[ChapterElement]
    ) -> List[InferenceBundle]:
        """推断人物-组织关系"""
        characters = [
            e for e in elements
            if e.element_type == ElementType.CHARACTER
            and e.relation_type == RelationType.APPEARS
        ]

        organizations = [
            e for e in elements
            if e.element_type == ElementType.ORGANIZATION
            and e.relation_type == RelationType.INVOLVED
        ]

        out: List[InferenceBundle] = []
        for char in characters:
            for org in organizations:
                triple = Triple(
                    id=f"triple-{uuid.uuid4().hex[:8]}",
                    novel_id=chapter.novel_id,
                    subject_type="character",
                    subject_id=char.element_id,
                    predicate="与...有关",
                    object_type="organization",
                    object_id=org.element_id,
                    confidence=0.6,
                    source_type=SourceType.CHAPTER_INFERRED,
                    source_chapter_id=chapter.id,
                    first_appearance=str(chapter.number),
                    related_chapters=[str(chapter.number)],
                )
                prov = [
                    TripleProvenanceRecord(
                        "character_organization", chapter.id, char.id, "subject_element"
                    ),
                    TripleProvenanceRecord(
                        "character_organization", chapter.id, org.id, "object_element"
                    ),
                ]
                out.append((triple, prov))

        return out

    async def _infer_character_event(
        self,
        chapter,
        elements: List[ChapterElement]
    ) -> List[InferenceBundle]:
        """推断人物参与事件"""
        characters = [
            e for e in elements
            if e.element_type == ElementType.CHARACTER
            and e.relation_type == RelationType.APPEARS
        ]

        events = [
            e for e in elements
            if e.element_type == ElementType.EVENT
            and e.relation_type == RelationType.OCCURS
        ]

        out: List[InferenceBundle] = []
        for char in characters:
            for event in events:
                triple = Triple(
                    id=f"triple-{uuid.uuid4().hex[:8]}",
                    novel_id=chapter.novel_id,
                    subject_type="character",
                    subject_id=char.element_id,
                    predicate="参与",
                    object_type="event",
                    object_id=event.element_id,
                    confidence=0.9,
                    source_type=SourceType.CHAPTER_INFERRED,
                    source_chapter_id=chapter.id,
                    first_appearance=str(chapter.number),
                    related_chapters=[str(chapter.number)],
                )
                prov = [
                    TripleProvenanceRecord(
                        "character_event", chapter.id, char.id, "subject_element"
                    ),
                    TripleProvenanceRecord(
                        "character_event", chapter.id, event.id, "object_element"
                    ),
                ]
                out.append((triple, prov))

        return out

    async def _infer_event_location(
        self,
        chapter,
        elements: List[ChapterElement]
    ) -> List[InferenceBundle]:
        """推断事件发生地点"""
        events = [
            e for e in elements
            if e.element_type == ElementType.EVENT
            and e.relation_type == RelationType.OCCURS
        ]

        locations = [
            e for e in elements
            if e.element_type == ElementType.LOCATION
            and e.relation_type == RelationType.SCENE
        ]

        out: List[InferenceBundle] = []
        for event in events:
            for loc in locations:
                triple = Triple(
                    id=f"triple-{uuid.uuid4().hex[:8]}",
                    novel_id=chapter.novel_id,
                    subject_type="event",
                    subject_id=event.element_id,
                    predicate="发生于",
                    object_type="location",
                    object_id=loc.element_id,
                    confidence=1.0,
                    source_type=SourceType.CHAPTER_INFERRED,
                    source_chapter_id=chapter.id,
                    first_appearance=str(chapter.number),
                    related_chapters=[str(chapter.number)],
                )
                prov = [
                    TripleProvenanceRecord(
                        "event_location", chapter.id, event.id, "subject_element"
                    ),
                    TripleProvenanceRecord(
                        "event_location", chapter.id, loc.id, "object_element"
                    ),
                ]
                out.append((triple, prov))

        return out

    async def _infer_global_patterns(self, novel_id: str) -> List[Triple]:
        """推断全局模式（跨章节分析）"""
        triples = []

        # 分析人物共同出场频率
        co_appearance_stats = await self._analyze_co_appearance(novel_id)
        for (char_a, char_b), count in co_appearance_stats.items():
            if count >= 3:
                # 升级为"熟悉"关系
                existing = await self.triple_repo.find_by_relation(
                    novel_id, "character", char_a, "认识", "character", char_b
                )
                if existing:
                    existing.predicate = "熟悉"
                    existing.confidence = 0.8
                    await self.triple_repo.update(existing)

        # 分析人物-地点频率
        location_stats = await self._analyze_character_locations(novel_id)
        for (char_id, loc_id), count in location_stats.items():
            if count >= 5:
                # 生成"常驻于"关系
                triple = Triple(
                    id=f"triple-{uuid.uuid4().hex[:8]}",
                    novel_id=novel_id,
                    subject_type="character",
                    subject_id=char_id,
                    predicate="常驻于",
                    object_type="location",
                    object_id=loc_id,
                    confidence=0.8,
                    source_type=SourceType.CHAPTER_INFERRED,
                )
                triples.append(triple)
                await self._save_or_update_triple(
                    triple,
                    [
                        TripleProvenanceRecord(
                            "aggregate_resident_location",
                            story_node_id=None,
                            chapter_element_id=None,
                            role="aggregate",
                        )
                    ],
                )

        return triples

    async def _analyze_co_appearance(self, novel_id: str) -> Dict[Tuple[str, str], int]:
        """分析人物共同出场频率"""
        # 这里需要执行 SQL 查询
        # 简化实现：返回空字典
        return {}

    async def _analyze_character_locations(self, novel_id: str) -> Dict[Tuple[str, str], int]:
        """分析人物-地点频率"""
        # 这里需要执行 SQL 查询
        # 简化实现：返回空字典
        return {}

    async def _save_or_update_triple(
        self,
        triple: Triple,
        provenance: Optional[List[TripleProvenanceRecord]] = None,
    ) -> None:
        """保存或更新三元组，并写入/追加溯源"""
        existing = await self.triple_repo.find_by_relation(
            triple.novel_id,
            triple.subject_type,
            triple.subject_id,
            triple.predicate,
            triple.object_type,
            triple.object_id,
        )

        prov_list = provenance or []
        if existing:
            for rc in triple.related_chapters or []:
                if rc not in existing.related_chapters:
                    existing.add_related_chapter(rc)
            existing.increase_confidence(0.1)
            await self.triple_repo.update(existing)
            if prov_list:
                await self.triple_repo.append_provenance_for_triple(existing, prov_list)
        else:
            if prov_list:
                await self.triple_repo.save_with_provenance(triple, prov_list)
            else:
                await self.triple_repo.save(triple)
