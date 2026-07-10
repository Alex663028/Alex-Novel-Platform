from typing import Dict, List, Optional, Tuple
from domain.bible.value_objects.character_id import CharacterId
from domain.bible.value_objects.relationship import Relationship


class RelationshipGraph:
    """角色关系图值对象

    使用邻接表存储角色之间的关系历史
    """

    def __init__(self):
        # 邻接表: Dict[CharacterId, Dict[CharacterId, List[Relationship]]]
        self._adjacency_list: Dict[CharacterId, Dict[CharacterId, List[Relationship]]] = {}

    def add_relationship(
        self,
        char1: CharacterId,
        char2: CharacterId,
        relation: Relationship
    ) -> None:
        """添加关系（保留历史记录）

        关系是双向的，会同时添加到两个角色的邻接表中。

        注意：关系存储为双向的，使用相同的 Relationship 对象。
        这意味着关系是对称的（如果 A 是 B 的朋友，B 也是 A 的朋友）。
        对于非对称关系（如单向的爱慕），需要使用不同的设计。
        """
        # 添加 char1 -> char2
        if char1 not in self._adjacency_list:
            self._adjacency_list[char1] = {}
        if char2 not in self._adjacency_list[char1]:
            self._adjacency_list[char1][char2] = []
        self._adjacency_list[char1][char2].append(relation)

        # 添加 char2 -> char1 (双向)
        if char2 not in self._adjacency_list:
            self._adjacency_list[char2] = {}
        if char1 not in self._adjacency_list[char2]:
            self._adjacency_list[char2][char1] = []
        self._adjacency_list[char2][char1].append(relation)

    def get_current_relationship(
        self,
        char1: CharacterId,
        char2: CharacterId
    ) -> Optional[Relationship]:
        """获取最新的关系"""
        history = self.get_relationship_history(char1, char2)
        if not history:
            return None
        return history[-1]

    def get_relationship_history(
        self,
        char1: CharacterId,
        char2: CharacterId
    ) -> List[Relationship]:
        """获取所有关系历史"""
        if char1 not in self._adjacency_list:
            return []
        if char2 not in self._adjacency_list[char1]:
            return []
        return self._adjacency_list[char1][char2].copy()

    def get_all_relationships(
        self,
        char_id: CharacterId
    ) -> List[Tuple[CharacterId, Relationship]]:
        """获取角色的所有当前关系

        返回: List[Tuple[CharacterId, Relationship]]
        每个元组包含 (其他角色ID, 当前关系)
        """
        if char_id not in self._adjacency_list:
            return []

        result = []
        for other_char_id, relationships in self._adjacency_list[char_id].items():
            if relationships:
                # 获取最新的关系
                current_relation = relationships[-1]
                result.append((other_char_id, current_relation))

        return result
