import pytest
from domain.novel.value_objects.consistency_context import ConsistencyContext
from domain.bible.entities.bible import Bible
from domain.bible.entities.character_registry import CharacterRegistry
from domain.novel.entities.foreshadowing_registry import ForeshadowingRegistry
from domain.novel.entities.plot_arc import PlotArc
from domain.novel.value_objects.event_timeline import EventTimeline
from domain.bible.value_objects.relationship_graph import RelationshipGraph
from domain.novel.value_objects.novel_id import NovelId


class TestConsistencyContext:
    """测试 ConsistencyContext 聚合器"""

    def test_create_context(self):
        """测试创建上下文"""
        novel_id = NovelId("novel-1")
        bible = Bible(id="bible-1", novel_id=novel_id)
        character_registry = CharacterRegistry(id="registry-1", novel_id="novel-1")
        foreshadowing_registry = ForeshadowingRegistry(id="foreshadow-1", novel_id=novel_id)
        plot_arc = PlotArc(id="arc-1", novel_id=novel_id)
        event_timeline = EventTimeline()
        relationship_graph = RelationshipGraph()

        context = ConsistencyContext(
            bible=bible,
            character_registry=character_registry,
            foreshadowing_registry=foreshadowing_registry,
            plot_arc=plot_arc,
            event_timeline=event_timeline,
            relationship_graph=relationship_graph
        )

        assert context.bible == bible
        assert context.character_registry == character_registry
        assert context.foreshadowing_registry == foreshadowing_registry
        assert context.plot_arc == plot_arc
        assert context.event_timeline == event_timeline
        assert context.relationship_graph == relationship_graph

    def test_context_immutable(self):
        """测试上下文对象不可变"""
        novel_id = NovelId("novel-1")
        bible = Bible(id="bible-1", novel_id=novel_id)
        character_registry = CharacterRegistry(id="registry-1", novel_id="novel-1")
        foreshadowing_registry = ForeshadowingRegistry(id="foreshadow-1", novel_id=novel_id)
        plot_arc = PlotArc(id="arc-1", novel_id=novel_id)
        event_timeline = EventTimeline()
        relationship_graph = RelationshipGraph()

        context = ConsistencyContext(
            bible=bible,
            character_registry=character_registry,
            foreshadowing_registry=foreshadowing_registry,
            plot_arc=plot_arc,
            event_timeline=event_timeline,
            relationship_graph=relationship_graph
        )

        with pytest.raises(AttributeError):
            context.bible = None

    def test_get_character_from_bible(self):
        """测试从 Bible 获取角色"""
        from domain.bible.entities.character import Character
        from domain.bible.value_objects.character_id import CharacterId

        novel_id = NovelId("novel-1")
        bible = Bible(id="bible-1", novel_id=novel_id)

        char_id = CharacterId("char-1")
        character = Character(
            id=char_id,
            name="张三",
            description="主角"
        )
        bible.add_character(character)

        context = ConsistencyContext(
            bible=bible,
            character_registry=CharacterRegistry(id="registry-1", novel_id="novel-1"),
            foreshadowing_registry=ForeshadowingRegistry(id="foreshadow-1", novel_id=novel_id),
            plot_arc=PlotArc(id="arc-1", novel_id=novel_id),
            event_timeline=EventTimeline(),
            relationship_graph=RelationshipGraph()
        )

        found_char = context.bible.get_character(char_id)
        assert found_char is not None
        assert found_char.name == "张三"

    def test_get_foreshadowing_from_registry(self):
        """测试从注册表获取伏笔"""
        from domain.novel.value_objects.foreshadowing import (
            Foreshadowing,
            ForeshadowingStatus,
            ImportanceLevel
        )

        novel_id = NovelId("novel-1")
        foreshadowing_registry = ForeshadowingRegistry(id="foreshadow-1", novel_id=novel_id)

        foreshadowing = Foreshadowing(
            id="f-1",
            planted_in_chapter=1,
            description="神秘预言",
            importance=ImportanceLevel.HIGH,
            status=ForeshadowingStatus.PLANTED
        )
        foreshadowing_registry.register(foreshadowing)

        context = ConsistencyContext(
            bible=Bible(id="bible-1", novel_id=novel_id),
            character_registry=CharacterRegistry(id="registry-1", novel_id="novel-1"),
            foreshadowing_registry=foreshadowing_registry,
            plot_arc=PlotArc(id="arc-1", novel_id=novel_id),
            event_timeline=EventTimeline(),
            relationship_graph=RelationshipGraph()
        )

        found = context.foreshadowing_registry.get_by_id("f-1")
        assert found is not None
        assert found.description == "神秘预言"

    def test_get_events_from_timeline(self):
        """测试从时间线获取事件"""
        from domain.novel.value_objects.novel_event import NovelEvent, EventType
        from domain.bible.value_objects.character_id import CharacterId

        event_timeline = EventTimeline()
        char_id = CharacterId("char-1")

        event = NovelEvent(
            chapter_number=1,
            event_type=EventType.CHARACTER_INTRODUCTION,
            description="主角登场",
            involved_characters=(char_id,)
        )
        event_timeline.add_event(event)

        novel_id = NovelId("novel-1")
        context = ConsistencyContext(
            bible=Bible(id="bible-1", novel_id=novel_id),
            character_registry=CharacterRegistry(id="registry-1", novel_id="novel-1"),
            foreshadowing_registry=ForeshadowingRegistry(id="foreshadow-1", novel_id=novel_id),
            plot_arc=PlotArc(id="arc-1", novel_id=novel_id),
            event_timeline=event_timeline,
            relationship_graph=RelationshipGraph()
        )

        events = context.event_timeline.events
        assert len(events) == 1
        assert events[0].description == "主角登场"
