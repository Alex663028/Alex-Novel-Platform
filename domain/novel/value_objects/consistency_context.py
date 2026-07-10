from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from domain.bible.entities.bible import Bible
    from domain.bible.entities.character_registry import CharacterRegistry
    from domain.novel.entities.foreshadowing_registry import ForeshadowingRegistry
    from domain.novel.entities.plot_arc import PlotArc
    from domain.novel.value_objects.event_timeline import EventTimeline
    from domain.bible.value_objects.relationship_graph import RelationshipGraph


@dataclass(frozen=True)
class ConsistencyContext:
    """一致性检查上下文聚合器

    聚合所有用于一致性检查的领域对象
    """
    bible: "Bible"
    character_registry: "CharacterRegistry"
    foreshadowing_registry: "ForeshadowingRegistry"
    plot_arc: "PlotArc"
    event_timeline: "EventTimeline"
    relationship_graph: "RelationshipGraph"
