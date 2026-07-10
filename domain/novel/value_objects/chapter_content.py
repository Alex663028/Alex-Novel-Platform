from dataclasses import dataclass


@dataclass(frozen=True)
class ChapterContent:
    """章节内容值对象"""
    raw_text: str

    def __post_init__(self):
        if not self.raw_text or not self.raw_text.strip():
            raise ValueError("Chapter content cannot be None or empty")

    def word_count(self) -> int:
        """计算字数（简单实现）"""
        return len(self.raw_text)

    def __str__(self) -> str:
        preview_length = 50
        if len(self.raw_text) <= preview_length:
            return self.raw_text
        return f"{self.raw_text[:preview_length]}..."
