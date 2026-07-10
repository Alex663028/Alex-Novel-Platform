"""StyleNote 实体"""
from dataclasses import dataclass


@dataclass
class StyleNote:
    """风格笔记实体"""
    id: str
    category: str  # "tone", "vocabulary", "pacing", "other"
    content: str

    def __post_init__(self):
        """验证实体"""
        if not self.id or not self.id.strip():
            raise ValueError("StyleNote id cannot be empty")
        if not self.category or not self.category.strip():
            raise ValueError("StyleNote category cannot be empty")
        if not self.content or not self.content.strip():
            raise ValueError("StyleNote content cannot be empty")
