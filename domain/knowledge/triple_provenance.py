"""三元组与章节元素/结构节点之间的显式溯源（推断证据链）。"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional


@dataclass(frozen=True)
class TripleProvenanceRecord:
    """单条证据：关联 story_node（章节结构节点）与可选的 chapter_element 行。"""

    rule_id: str
    story_node_id: Optional[str] = None
    chapter_element_id: Optional[str] = None
    role: str = "primary"

    def to_row_dict(self, novel_id: str, triple_id: str, row_id: str) -> Dict[str, Any]:
        return {
            "id": row_id,
            "triple_id": triple_id,
            "novel_id": novel_id,
            "story_node_id": self.story_node_id,
            "chapter_element_id": self.chapter_element_id,
            "rule_id": self.rule_id,
            "role": self.role,
        }
