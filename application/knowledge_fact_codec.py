"""知识三元组 ↔ 持久化/API 字典（单一形状，避免字段漂移）"""
from __future__ import annotations

from typing import Any, Dict

from domain.knowledge.knowledge_triple import KnowledgeTriple


def dict_to_knowledge_triple(d: Dict[str, Any]) -> KnowledgeTriple:
    return KnowledgeTriple(
        id=d["id"],
        subject=d.get("subject", ""),
        predicate=d.get("predicate", ""),
        object=d.get("object", ""),
        chapter_id=d.get("chapter_id"),
        note=d.get("note", "") or "",
        entity_type=d.get("entity_type"),
        importance=d.get("importance"),
        location_type=d.get("location_type"),
        description=d.get("description"),
        first_appearance=d.get("first_appearance"),
        related_chapters=d.get("related_chapters") or [],
        tags=d.get("tags") or [],
        attributes=d.get("attributes") or {},
        confidence=d.get("confidence"),
        source_type=d.get("source_type"),
        subject_entity_id=d.get("subject_entity_id"),
        object_entity_id=d.get("object_entity_id"),
    )


def knowledge_triple_to_dict(f: KnowledgeTriple) -> Dict[str, Any]:
    return {
        "id": f.id,
        "subject": f.subject,
        "predicate": f.predicate,
        "object": f.object,
        "chapter_id": f.chapter_id,
        "note": f.note,
        "entity_type": f.entity_type,
        "importance": f.importance,
        "location_type": f.location_type,
        "description": f.description,
        "first_appearance": f.first_appearance,
        "related_chapters": list(f.related_chapters),
        "tags": list(f.tags),
        "attributes": dict(f.attributes),
        "confidence": f.confidence,
        "source_type": f.source_type,
        "subject_entity_id": f.subject_entity_id,
        "object_entity_id": f.object_entity_id,
    }
