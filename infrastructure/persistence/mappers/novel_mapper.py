"""Novel 数据映射器"""
from typing import Dict, Any
from domain.novel.entities.novel import Novel, NovelStage
from domain.novel.entities.chapter import Chapter
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.chapter_id import ChapterId
from domain.novel.value_objects.word_count import WordCount
from domain.novel.value_objects.chapter_content import ChapterContent


class NovelMapper:
    """Novel 实体与字典数据之间的映射器

    负责将 Novel 领域对象转换为可持久化的字典格式，
    以及从字典数据重建 Novel 对象。
    """

    @staticmethod
    def to_dict(novel: Novel) -> Dict[str, Any]:
        """将 Novel 实体转换为字典

        Args:
            novel: Novel 实体

        Returns:
            字典表示
        """
        return {
            "id": novel.novel_id.value,
            "title": novel.title,
            "author": novel.author,
            "target_chapters": novel.target_chapters,
            "premise": getattr(novel, 'premise', ''),  # 兼容旧数据
            "stage": novel.stage.value,
            "chapters": [
                {
                    "id": chapter.id,
                    "novel_id": chapter.novel_id.value,
                    "number": chapter.number,
                    "title": chapter.title,
                    "content": chapter.content,
                    "word_count": chapter.word_count.value
                }
                for chapter in novel.chapters
            ]
        }

    @staticmethod
    def from_dict(data: Dict[str, Any]) -> Novel:
        """从字典创建 Novel 实体

        Args:
            data: 字典数据

        Returns:
            Novel 实体

        Raises:
            ValueError: 如果数据格式不正确或缺少必需字段
        """
        # 验证必需字段
        required_fields = ["id", "title", "author", "target_chapters", "stage"]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

        try:
            # 创建 Novel 实体
            novel = Novel(
                id=NovelId(data["id"]),
                title=data["title"],
                author=data["author"],
                target_chapters=data["target_chapters"],
                premise=data.get("premise", ""),  # 兼容旧数据
                stage=NovelStage(data["stage"])
            )

            # 添加章节
            for chapter_data in data.get("chapters", []):
                # 验证章节必需字段
                chapter_required = ["id", "novel_id", "number", "title", "content", "word_count"]
                chapter_missing = [field for field in chapter_required if field not in chapter_data]
                if chapter_missing:
                    raise ValueError(f"Chapter missing required fields: {', '.join(chapter_missing)}")

                chapter = Chapter(
                    id=chapter_data["id"],
                    novel_id=NovelId(chapter_data["novel_id"]),
                    number=chapter_data["number"],
                    title=chapter_data["title"],
                    content=chapter_data["content"]
                )
                novel.add_chapter(chapter)

            return novel
        except (ValueError, KeyError) as e:
            raise ValueError(f"Invalid novel data format: {str(e)}") from e
