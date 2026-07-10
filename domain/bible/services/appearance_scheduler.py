from typing import List, Tuple, TYPE_CHECKING

if TYPE_CHECKING:
    from domain.bible.entities.character import Character
    from domain.bible.value_objects.activity_metrics import ActivityMetrics

# Import at runtime to avoid circular imports
from domain.bible.value_objects.character_importance import CharacterImportance


class AppearanceScheduler:
    """角色出场调度器领域服务

    决定哪些角色应该在章节中出现，基于：
    1. 大纲中提到的角色（最高优先级）
    2. 角色重要性级别
    3. 最近活动度
    4. 与提到角色的关系
    """

    def schedule_appearances(
        self,
        outline: str,
        available_characters: List[Tuple["Character", "CharacterImportance", "ActivityMetrics"]],
        max_characters: int
    ) -> List["Character"]:
        """调度角色出场

        Args:
            outline: 章节大纲
            available_characters: 可用角色列表，每项为 (角色, 重要性, 活动度指标)
            max_characters: 最大角色数

        Returns:
            选中的角色列表
        """
        if not available_characters:
            return []

        # 1. 提取大纲中提到的角色
        mentioned = []
        not_mentioned = []

        for char, importance, metrics in available_characters:
            if char.name in outline:
                mentioned.append((char, importance, metrics))
            else:
                not_mentioned.append((char, importance, metrics))

        # 2. 对未提到的角色排序：重要性 > 活动度
        not_mentioned_sorted = sorted(
            not_mentioned,
            key=lambda x: (
                self._importance_priority(x[1]),  # 重要性优先级
                -x[2].appearance_count,  # 活动度（降序）
                -x[2].last_appearance_chapter  # 最近出现章节（降序）
            )
        )

        # 3. 合并：提到的角色 + 未提到的角色
        all_sorted = mentioned + not_mentioned_sorted

        # 4. 截断到最大数量
        selected = all_sorted[:max_characters]

        return [char for char, _, _ in selected]

    def _importance_priority(self, importance: "CharacterImportance") -> int:
        """获取重要性优先级（数字越小优先级越高）"""
        priority_map = {
            CharacterImportance.PROTAGONIST: 0,
            CharacterImportance.MAJOR_SUPPORTING: 1,
            CharacterImportance.IMPORTANT_SUPPORTING: 2,
            CharacterImportance.MINOR: 3,
            CharacterImportance.BACKGROUND: 4
        }
        return priority_map.get(importance, 999)
