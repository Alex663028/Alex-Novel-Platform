"""Chapter Structure 数据传输对象"""
from dataclasses import dataclass


@dataclass
class ChapterStructureDTO:
    """章节结构分析 DTO"""
    word_count: int
    paragraph_count: int
    dialogue_ratio: float
    scene_count: int
    pacing: str  # "slow", "medium", "fast"

    def to_dict(self) -> dict:
        """转换为字典"""
        return {
            "word_count": self.word_count,
            "paragraph_count": self.paragraph_count,
            "dialogue_ratio": self.dialogue_ratio,
            "scene_count": self.scene_count,
            "pacing": self.pacing
        }

    @classmethod
    def from_dict(cls, data: dict) -> 'ChapterStructureDTO':
        """从字典创建 DTO"""
        return cls(
            word_count=data.get("word_count", 0),
            paragraph_count=data.get("paragraph_count", 0),
            dialogue_ratio=data.get("dialogue_ratio", 0.0),
            scene_count=data.get("scene_count", 0),
            pacing=data.get("pacing", "medium")
        )
