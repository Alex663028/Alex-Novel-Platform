"""Knowledge repository interface"""
from abc import ABC, abstractmethod
from typing import Optional
from domain.knowledge.story_knowledge import StoryKnowledge


class KnowledgeRepository(ABC):
    """知识仓储接口"""

    @abstractmethod
    def get_by_novel_id(self, novel_id: str) -> Optional[StoryKnowledge]:
        """根据小说ID获取知识图谱

        Args:
            novel_id: 小说ID

        Returns:
            故事知识或None
        """
        pass

    @abstractmethod
    def save(self, knowledge: StoryKnowledge) -> None:
        """保存知识图谱

        Args:
            knowledge: 故事知识
        """
        pass

    @abstractmethod
    def exists(self, novel_id: str) -> bool:
        """检查知识图谱是否存在

        Args:
            novel_id: 小说ID

        Returns:
            是否存在
        """
        pass

    @abstractmethod
    def delete(self, novel_id: str) -> None:
        """删除知识图谱

        Args:
            novel_id: 小说ID
        """
        pass
