"""Entity Base Repository 抽象接口"""
from abc import ABC, abstractmethod
from typing import Optional


class EntityBaseRepository(ABC):
    """实体基座仓储抽象接口"""

    @abstractmethod
    def get_by_id(self, entity_id: str) -> Optional[dict]:
        """根据 ID 获取实体基座

        Args:
            entity_id: 实体 ID

        Returns:
            实体字典，包含: id, novel_id, entity_type, name, core_attributes, created_at
            如果不存在返回 None
        """
        pass

    @abstractmethod
    def create(
        self,
        novel_id: str,
        entity_type: str,
        name: str,
        core_attributes: dict
    ) -> str:
        """创建新实体基座

        Args:
            novel_id: 小说 ID
            entity_type: 实体类型
            name: 实体名称
            core_attributes: 核心属性字典

        Returns:
            新创建的实体 ID
        """
        pass
