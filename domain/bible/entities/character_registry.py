from typing import Dict, List, Optional
from collections import defaultdict
import re

from domain.shared.base_entity import BaseEntity
from domain.bible.entities.character import Character
from domain.bible.value_objects.character_id import CharacterId
from domain.bible.value_objects.character_importance import CharacterImportance
from domain.bible.value_objects.activity_metrics import ActivityMetrics
from domain.bible.value_objects.relationship_graph import RelationshipGraph


class CharacterRegistry(BaseEntity):
    """角色注册表实体

    支持分层管理 10,000+ 角色，提供智能角色选择和上下文生成。
    """

    def __init__(self, id: str, novel_id: str):
        super().__init__(id)
        self.novel_id = novel_id
        # 按重要性分层存储角色
        self.characters_by_importance: Dict[CharacterImportance, List[Character]] = defaultdict(list)
        # 角色活动度指标
        self.activity_metrics: Dict[CharacterId, ActivityMetrics] = {}
        # 角色索引：快速查找
        self._character_index: Dict[CharacterId, Character] = {}
        # 关系图（可选）
        self._relationship_graph: Optional[RelationshipGraph] = None

    def register_character(
        self,
        character: Character,
        importance: CharacterImportance
    ) -> None:
        """注册角色并设置重要性级别

        Args:
            character: 角色实体
            importance: 重要性级别
        """
        self.characters_by_importance[importance].append(character)
        self.activity_metrics[character.character_id] = ActivityMetrics()
        self._character_index[character.character_id] = character

    def update_importance(
        self,
        character_id: CharacterId,
        new_importance: CharacterImportance
    ) -> None:
        """更新角色重要性级别

        Args:
            character_id: 角色 ID
            new_importance: 新的重要性级别

        Raises:
            ValueError: 如果角色不存在
        """
        if character_id not in self._character_index:
            raise ValueError(f"Character {character_id} not found")

        character = self._character_index[character_id]

        # 从旧的重要性列表中移除
        for importance, chars in self.characters_by_importance.items():
            if character in chars:
                chars.remove(character)
                break

        # 添加到新的重要性列表
        self.characters_by_importance[new_importance].append(character)

    def update_activity(
        self,
        character_id: CharacterId,
        chapter_number: int,
        dialogue_count: int = 0
    ) -> None:
        """更新角色活动度

        Args:
            character_id: 角色 ID
            chapter_number: 章节号
            dialogue_count: 对话数量（可选）
        """
        if character_id in self.activity_metrics:
            self.activity_metrics[character_id].update_activity(
                chapter_number,
                dialogue_count
            )

    def get_characters_by_importance(
        self,
        importance: CharacterImportance
    ) -> List[Character]:
        """获取指定重要性级别的所有角色

        Args:
            importance: 重要性级别

        Returns:
            角色列表
        """
        return self.characters_by_importance.get(importance, []).copy()

    def get_active_characters(self, since_chapter: int) -> List[Character]:
        """获取指定章节之后活跃的角色

        Args:
            since_chapter: 章节号

        Returns:
            活跃角色列表
        """
        active_chars = []
        for char_id, metrics in self.activity_metrics.items():
            if metrics.is_active_since(since_chapter):
                active_chars.append(self._character_index[char_id])
        return active_chars

    def set_relationship_graph(self, graph: RelationshipGraph) -> None:
        """设置关系图

        Args:
            graph: 关系图
        """
        self._relationship_graph = graph

    def get_characters_for_context(
        self,
        outline: str,
        max_tokens: int,
        relationship_graph: Optional[RelationshipGraph] = None
    ) -> List[Character]:
        """智能选择角色用于上下文生成

        策略：
        1. 从大纲中提取角色名字
        2. 按重要性级别获取角色
        3. 使用关系图扩展相关角色
        4. 按优先级排序：重要性 > 活动度 > 相关性
        5. 根据 token 限制截断

        Args:
            outline: 章节大纲
            max_tokens: 最大 token 数
            relationship_graph: 关系图（可选）

        Returns:
            选中的角色列表
        """
        # 1. 提取大纲中提到的角色名字
        mentioned_char_ids = self._extract_character_names(outline)

        # 2. 收集候选角色
        candidates = []

        # 优先添加提到的角色
        for char_id in mentioned_char_ids:
            if char_id in self._character_index:
                char = self._character_index[char_id]
                candidates.append(char)

        # 3. 按重要性添加角色（如果还有空间）
        for importance in [
            CharacterImportance.PROTAGONIST,
            CharacterImportance.MAJOR_SUPPORTING,
            CharacterImportance.IMPORTANT_SUPPORTING
        ]:
            for char in self.characters_by_importance[importance]:
                if char not in candidates:
                    candidates.append(char)

        # 4. 使用关系图扩展（如果提供）
        if relationship_graph or self._relationship_graph:
            graph = relationship_graph or self._relationship_graph
            expanded = self._expand_with_relationships(candidates, graph)
            for char in expanded:
                if char not in candidates:
                    candidates.append(char)

        # 5. 按优先级排序
        candidates = self._sort_by_priority(candidates)

        # 6. 根据 token 限制截断
        selected = self._truncate_by_tokens(candidates, max_tokens)

        return selected

    def _extract_character_names(self, outline: str) -> List[CharacterId]:
        """从大纲中提取角色名字

        简单实现：匹配已注册角色的名字

        Args:
            outline: 大纲文本

        Returns:
            角色 ID 列表
        """
        mentioned = []
        for char_id, char in self._character_index.items():
            if char.name in outline:
                mentioned.append(char_id)
        return mentioned

    def _expand_with_relationships(
        self,
        characters: List[Character],
        graph: RelationshipGraph
    ) -> List[Character]:
        """使用关系图扩展角色列表

        Args:
            characters: 初始角色列表
            graph: 关系图

        Returns:
            扩展后的角色列表
        """
        expanded = []
        for char in characters:
            relationships = graph.get_all_relationships(char.character_id)
            for related_char_id, _ in relationships:
                if related_char_id in self._character_index:
                    related_char = self._character_index[related_char_id]
                    if related_char not in expanded:
                        expanded.append(related_char)
        return expanded

    def _sort_by_priority(self, characters: List[Character]) -> List[Character]:
        """按优先级排序角色

        优先级：重要性 > 活动度 > 名字

        Args:
            characters: 角色列表

        Returns:
            排序后的角色列表
        """
        def get_importance(char: Character) -> int:
            """获取角色重要性排序值"""
            for importance, chars in self.characters_by_importance.items():
                if char in chars:
                    order = {
                        CharacterImportance.PROTAGONIST: 0,
                        CharacterImportance.MAJOR_SUPPORTING: 1,
                        CharacterImportance.IMPORTANT_SUPPORTING: 2,
                        CharacterImportance.MINOR: 3,
                        CharacterImportance.BACKGROUND: 4
                    }
                    return order[importance]
            return 999

        def get_activity(char: Character) -> int:
            """获取角色活动度"""
            if char.character_id in self.activity_metrics:
                return self.activity_metrics[char.character_id].appearance_count
            return 0

        return sorted(
            characters,
            key=lambda c: (get_importance(c), -get_activity(c), c.name)
        )

    def _truncate_by_tokens(
        self,
        characters: List[Character],
        max_tokens: int
    ) -> List[Character]:
        """根据 token 限制截断角色列表

        Args:
            characters: 角色列表
            max_tokens: 最大 token 数

        Returns:
            截断后的角色列表
        """
        selected = []
        total_tokens = 0

        for char in characters:
            # 获取角色的重要性级别
            importance = None
            for imp, chars in self.characters_by_importance.items():
                if char in chars:
                    importance = imp
                    break

            if importance is None:
                continue

            # 计算该角色需要的 token
            char_tokens = importance.token_allocation()

            if total_tokens + char_tokens <= max_tokens:
                selected.append(char)
                total_tokens += char_tokens
            else:
                break

        return selected
