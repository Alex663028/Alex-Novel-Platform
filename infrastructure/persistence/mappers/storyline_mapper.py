"""Storyline 数据映射器"""
from typing import Dict, Any, List
from domain.novel.entities.storyline import Storyline
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.storyline_type import StorylineType
from domain.novel.value_objects.storyline_status import StorylineStatus
from domain.novel.value_objects.storyline_milestone import StorylineMilestone


class StorylineMapper:
    """Storyline 实体与字典数据之间的映射器"""

    @staticmethod
    def to_dict(storyline: Storyline) -> Dict[str, Any]:
        """将 Storyline 实体转换为字典

        Args:
            storyline: Storyline 实体

        Returns:
            字典表示
        """
        return {
            "id": storyline.id,
            "novel_id": storyline.novel_id.value,
            "storyline_type": storyline.storyline_type.value,
            "status": storyline.status.value,
            "estimated_chapter_start": storyline.estimated_chapter_start,
            "estimated_chapter_end": storyline.estimated_chapter_end,
            "current_milestone_index": storyline.current_milestone_index,
            "milestones": [
                {
                    "order": milestone.order,
                    "title": milestone.title,
                    "description": milestone.description,
                    "target_chapter_start": milestone.target_chapter_start,
                    "target_chapter_end": milestone.target_chapter_end,
                    "prerequisites": milestone.prerequisites,
                    "triggers": milestone.triggers
                }
                for milestone in storyline.milestones
            ]
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> Storyline:
        """从字典创建 Storyline 实体

        Args:
            data: 字典数据

        Returns:
            Storyline 实体

        Raises:
            ValueError: 如果数据格式不正确或缺少必需字段
        """
        # 验证必需字段
        required_fields = [
            "id", "novel_id", "storyline_type", "status",
            "estimated_chapter_start", "estimated_chapter_end",
            "current_milestone_index", "milestones"
        ]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

        try:
            # 解析里程碑
            milestones: List[StorylineMilestone] = []
            for milestone_data in data["milestones"]:
                milestone = StorylineMilestone(
                    order=milestone_data["order"],
                    title=milestone_data["title"],
                    description=milestone_data["description"],
                    target_chapter_start=milestone_data["target_chapter_start"],
                    target_chapter_end=milestone_data["target_chapter_end"],
                    prerequisites=milestone_data["prerequisites"],
                    triggers=milestone_data["triggers"]
                )
                milestones.append(milestone)

            # 创建 Storyline 实体
            storyline = Storyline(
                id=data["id"],
                novel_id=NovelId(data["novel_id"]),
                storyline_type=StorylineType(data["storyline_type"]),
                status=StorylineStatus(data["status"]),
                estimated_chapter_start=data["estimated_chapter_start"],
                estimated_chapter_end=data["estimated_chapter_end"],
                milestones=milestones,
                current_milestone_index=data["current_milestone_index"]
            )

            return storyline
        except (ValueError, KeyError) as e:
            raise ValueError(f"Invalid storyline data format: {str(e)}") from e
