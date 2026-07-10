from enum import Enum


class CharacterImportance(Enum):
    """角色重要性枚举

    定义角色在小说中的重要性级别，用于分层管理和上下文生成。
    """

    PROTAGONIST = "protagonist"  # 主角
    MAJOR_SUPPORTING = "major_supporting"  # 主要配角
    IMPORTANT_SUPPORTING = "important_supporting"  # 重要配角
    MINOR = "minor"  # 次要角色
    BACKGROUND = "background"  # 背景角色

    def __lt__(self, other):
        """定义排序规则：重要性越高，值越大（PROTAGONIST > MAJOR_SUPPORTING）"""
        if not isinstance(other, CharacterImportance):
            return NotImplemented

        order = {
            CharacterImportance.PROTAGONIST: 5,
            CharacterImportance.MAJOR_SUPPORTING: 4,
            CharacterImportance.IMPORTANT_SUPPORTING: 3,
            CharacterImportance.MINOR: 2,
            CharacterImportance.BACKGROUND: 1
        }
        return order[self] < order[other]

    def __gt__(self, other):
        """定义排序规则：重要性越高，值越大（PROTAGONIST > MAJOR_SUPPORTING）"""
        if not isinstance(other, CharacterImportance):
            return NotImplemented

        order = {
            CharacterImportance.PROTAGONIST: 5,
            CharacterImportance.MAJOR_SUPPORTING: 4,
            CharacterImportance.IMPORTANT_SUPPORTING: 3,
            CharacterImportance.MINOR: 2,
            CharacterImportance.BACKGROUND: 1
        }
        return order[self] > order[other]

    def token_allocation(self) -> int:
        """返回该重要性级别的 token 分配

        Returns:
            int: 分配的 token 数量
        """
        allocations = {
            CharacterImportance.PROTAGONIST: 1000,
            CharacterImportance.MAJOR_SUPPORTING: 800,
            CharacterImportance.IMPORTANT_SUPPORTING: 150,
            CharacterImportance.MINOR: 50,
            CharacterImportance.BACKGROUND: 20
        }
        return allocations[self]
