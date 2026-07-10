from dataclasses import dataclass
from enum import Enum
from domain.novel.value_objects.tension_level import TensionLevel


class PlotPointType(str, Enum):
    """剧情点类型"""
    OPENING = "opening"              # 开端
    RISING_ACTION = "rising"         # 上升
    TURNING_POINT = "turning"        # 转折
    CLIMAX = "climax"                # 高潮
    FALLING_ACTION = "falling"       # 下降
    RESOLUTION = "resolution"        # 结局


@dataclass(frozen=True)
class PlotPoint:
    """剧情点值对象"""
    chapter_number: int
    point_type: PlotPointType
    description: str
    tension: TensionLevel

    def __post_init__(self):
        if self.chapter_number < 1:
            raise ValueError("Chapter number must be >= 1")
        if not self.description or not self.description.strip():
            raise ValueError("Description cannot be empty")
