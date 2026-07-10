"""Chapter 数据映射器"""
import re
from typing import Dict, Any
from domain.novel.entities.chapter import Chapter, ChapterStatus
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.chapter_id import ChapterId
from domain.novel.value_objects.word_count import WordCount
from domain.novel.value_objects.chapter_content import ChapterContent


class ChapterMapper:
    """Chapter 实体与字典数据之间的映射器

    负责将 Chapter 领域对象转换为可持久化的字典格式，
    以及从字典数据重建 Chapter 对象。
    """

    @staticmethod
    def _extract_title_from_content(content: str) -> str:
        """从content中提取标题

        Args:
            content: 章节内容

        Returns:
            提取的标题，如果没有找到则返回空字符串
        """
        if not content:
            return ""

        # 查找第一行的Markdown标题
        lines = content.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('#'):
                # 移除#号和空格
                title = re.sub(r'^#+\s*', '', line)
                return title

        return ""

    @staticmethod
    def to_dict(chapter: Chapter) -> Dict[str, Any]:
        """将 Chapter 实体转换为字典

        Args:
            chapter: Chapter 实体

        Returns:
            字典表示
        """
        # 尝试从content中提取标题
        extracted_title = ChapterMapper._extract_title_from_content(chapter.content)

        # 如果提取到了标题且不同于当前标题，使用提取的标题
        title = extracted_title if extracted_title else chapter.title

        return {
            "id": chapter.id,
            "novel_id": chapter.novel_id.value,
            "number": chapter.number,
            "title": title,
            "content": chapter.content,
            "word_count": chapter.word_count.value
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> Chapter:
        """从字典创建 Chapter 实体

        Args:
            data: 字典数据

        Returns:
            Chapter 实体

        Raises:
            ValueError: 如果数据格式不正确或缺少必需字段
        """
        # 验证必需字段
        required_fields = ["id", "novel_id", "number", "title", "content", "word_count"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

        try:
            # 创建 Chapter 实体
            chapter = Chapter(
                id=data["id"],
                novel_id=NovelId(data["novel_id"]),
                number=data["number"],
                title=data["title"],
                content=data["content"]
            )

            return chapter
        except (ValueError, KeyError) as e:
            raise ValueError(f"Invalid chapter data format: {str(e)}") from e
