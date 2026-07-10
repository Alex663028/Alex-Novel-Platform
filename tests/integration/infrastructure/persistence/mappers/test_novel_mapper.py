"""NovelMapper 测试"""
import pytest
from datetime import datetime
from domain.novel.entities.novel import Novel
from domain.novel.entities.chapter import Chapter
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.chapter_id import ChapterId
from domain.novel.value_objects.word_count import WordCount
from domain.novel.value_objects.chapter_content import ChapterContent
from domain.novel.entities.novel import NovelStage
from infrastructure.persistence.mappers.novel_mapper import NovelMapper


class TestNovelMapper:
    """NovelMapper 测试"""

    def test_to_dict_minimal_novel(self):
        """测试最小化小说转换为字典"""
        novel = Novel(
            id=NovelId("test-novel"),
            title="测试小说",
            author="测试作者",
            target_chapters=10,
            stage=NovelStage.PLANNING
        )

        data = NovelMapper.to_dict(novel)

        assert data["id"] == "test-novel"
        assert data["title"] == "测试小说"
        assert data["author"] == "测试作者"
        assert data["target_chapters"] == 10
        assert data["stage"] == "planning"
        assert data["chapters"] == []

    def test_to_dict_with_chapters(self):
        """测试包含章节的小说转换"""
        novel = Novel(
            id=NovelId("test-novel"),
            title="测试小说",
            author="测试作者",
            target_chapters=10
        )

        chapter = Chapter(
            id="chapter-1",
            novel_id=NovelId("test-novel"),
            number=1,
            title="第一章",
            content="章节内容"
        )
        novel.add_chapter(chapter)

        data = NovelMapper.to_dict(novel)

        assert len(data["chapters"]) == 1
        assert data["chapters"][0]["id"] == "chapter-1"
        assert data["chapters"][0]["number"] == 1
        assert data["chapters"][0]["title"] == "第一章"
        assert data["chapters"][0]["content"] == "章节内容"
        assert data["chapters"][0]["word_count"] == 4

    def test_from_dict_minimal(self):
        """测试从字典创建最小化小说"""
        data = {
            "id": "test-novel",
            "title": "测试小说",
            "author": "测试作者",
            "target_chapters": 10,
            "stage": "planning",
            "chapters": []
        }

        novel = NovelMapper.from_dict(data)

        assert novel.novel_id.value == "test-novel"
        assert novel.title == "测试小说"
        assert novel.author == "测试作者"
        assert novel.target_chapters == 10
        assert novel.stage == NovelStage.PLANNING
        assert len(novel.chapters) == 0

    def test_from_dict_with_chapters(self):
        """测试从字典创建包含章节的小说"""
        data = {
            "id": "test-novel",
            "title": "测试小说",
            "author": "测试作者",
            "target_chapters": 10,
            "stage": "writing",
            "chapters": [
                {
                    "id": "chapter-1",
                    "novel_id": "test-novel",
                    "number": 1,
                    "title": "第一章",
                    "content": "章节内容",
                    "word_count": 4
                }
            ]
        }

        novel = NovelMapper.from_dict(data)

        assert len(novel.chapters) == 1
        chapter = novel.chapters[0]
        assert chapter.id == "chapter-1"
        assert chapter.number == 1
        assert chapter.title == "第一章"
        assert chapter.content == "章节内容"
        assert chapter.word_count.value == 4

    def test_round_trip(self):
        """测试往返转换"""
        original = Novel(
            id=NovelId("test-novel"),
            title="测试小说",
            author="测试作者",
            target_chapters=10
        )

        chapter = Chapter(
            id="chapter-1",
            novel_id=NovelId("test-novel"),
            number=1,
            title="第一章",
            content="章节内容"
        )
        original.add_chapter(chapter)

        # 转换为字典再转回来
        data = NovelMapper.to_dict(original)
        restored = NovelMapper.from_dict(data)

        assert restored.novel_id.value == original.novel_id.value
        assert restored.title == original.title
        assert len(restored.chapters) == len(original.chapters)

    def test_from_dict_missing_required_field(self):
        """测试缺少必需字段"""
        data = {
            "id": "test-novel",
            "title": "测试小说",
            # 缺少 author
            "target_chapters": 10,
            "stage": "planning",
            "chapters": []
        }

        with pytest.raises(ValueError, match="Missing required fields"):
            NovelMapper.from_dict(data)

    def test_from_dict_invalid_stage(self):
        """测试无效的 stage 值"""
        data = {
            "id": "test-novel",
            "title": "测试小说",
            "author": "测试作者",
            "target_chapters": 10,
            "stage": "invalid_stage",
            "chapters": []
        }

        with pytest.raises(ValueError, match="Invalid novel data format"):
            NovelMapper.from_dict(data)

    def test_from_dict_missing_chapter_field(self):
        """测试章节缺少必需字段"""
        data = {
            "id": "test-novel",
            "title": "测试小说",
            "author": "测试作者",
            "target_chapters": 10,
            "stage": "writing",
            "chapters": [
                {
                    "id": "chapter-1",
                    # 缺少 novel_id
                    "number": 1,
                    "title": "第一章",
                    "content": "章节内容",
                    "word_count": 4
                }
            ]
        }

        with pytest.raises(ValueError, match="Chapter missing required fields"):
            NovelMapper.from_dict(data)
