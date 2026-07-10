"""PlotArc 数据映射器"""
from typing import Dict, Any, List
from domain.novel.entities.plot_arc import PlotArc
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.plot_point import PlotPoint, PlotPointType
from domain.novel.value_objects.tension_level import TensionLevel


class PlotArcMapper:
    """PlotArc 实体与字典数据之间的映射器"""

    @staticmethod
    def to_dict(plot_arc: PlotArc) -> Dict[str, Any]:
        """将 PlotArc 实体转换为字典

        Args:
            plot_arc: PlotArc 实体

        Returns:
            字典表示
        """
        return {
            "id": plot_arc.id,
            "novel_id": plot_arc.novel_id.value,
            "slug": getattr(plot_arc, "slug", "default") or "default",
            "display_name": getattr(plot_arc, "display_name", "") or "",
            "key_points": [
                {
                    "chapter_number": point.chapter_number,
                    "point_type": point.point_type.value,
                    "description": point.description,
                    "tension": point.tension.value
                }
                for point in plot_arc.key_points
            ]
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> PlotArc:
        """从字典创建 PlotArc 实体

        Args:
            data: 字典数据

        Returns:
            PlotArc 实体

        Raises:
            ValueError: 如果数据格式不正确或缺少必需字段
        """
        # 验证必需字段
        required_fields = ["id", "novel_id", "key_points"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

        try:
            # 解析剧情点
            key_points: List[PlotPoint] = []
            for point_data in data["key_points"]:
                point = PlotPoint(
                    chapter_number=point_data["chapter_number"],
                    point_type=PlotPointType(point_data["point_type"]),
                    description=point_data["description"],
                    tension=TensionLevel(point_data["tension"])
                )
                key_points.append(point)

            # 创建 PlotArc 实体
            plot_arc = PlotArc(
                id=data["id"],
                novel_id=NovelId(data["novel_id"]),
                key_points=key_points,
                slug=data.get("slug") or "default",
                display_name=data.get("display_name") or "",
            )

            return plot_arc
        except (ValueError, KeyError) as e:
            raise ValueError(f"Invalid plot arc data format: {str(e)}") from e
