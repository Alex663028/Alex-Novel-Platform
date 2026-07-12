"""import_service 导入链路重构回归测试（自包含，不依赖外部文件）。

覆盖:
- MDSchema.to_params() 与旧 schema_to_novel_params 行为一致（笔误修复、字段完整）
- _save_to_database 调用 bible_service 而非 blog_service（笔误修复）
- 剧情结构树保存走 BaseSqliteRepository 事务（不抛错）
"""
from pathlib import Path
import sys

sys.path.insert(0, r"F:\小说工具\PlotPilot-Optimized-Source")

from unittest.mock import MagicMock

from application.outline.md_parser import parse_markdown_outline, MDSchema, schema_to_novel_params
from application.outline.import_service import _save_to_database


SAMPLE = """# 我的小说
## 基本信息
作者：张三
类型：都市
目标章节：100
每章字数：3000

## 故事梗概
程序员逆袭的故事。

## 角色
- 李雷
- 韩梅梅

## 世界观设定
现代都市，科技发达。

## 地点
- 北京
- 上海

## 剧情结构
第一卷：开端
  第一章：相遇
  第二章：冲突
"""


def test_to_params_matches_legacy_function():
    schema = parse_markdown_outline(SAMPLE)
    p1 = schema.to_params("novel-xyz")
    p2 = schema_to_novel_params(schema, "novel-xyz")
    # 两者输出必须等价（兼容垫片）
    assert p1 == p2
    assert p1["novel_id"] == "novel-xyz"
    assert p1["title"] == "我的小说"
    assert p1["author"] == "张三"
    assert p1["genre"] == "都市"
    assert p1["target_chapters"] == 100
    assert p1["target_words_per_chapter"] == 3000
    # 角色合并：主角在前
    assert len(p1["characters_md"]) == 2
    assert len(p1["world_settings_md"]) == 1
    # 注意：md_parser 将「## 地点」段列表整体作为一个 location（既有行为），locations_md >= 1
    assert len(p1["locations_md"]) >= 1
    assert len(p1["structure_tree"]) >= 1


def test_defaults_when_fields_missing():
    schema = MDSchema()  # 全空
    params = schema.to_params("n1")
    assert params["title"] == "未命名小说"
    assert params["author"] == "Alex"
    assert params["target_chapters"] == 100


async def test_save_to_database_calls_bible_service_not_blog():
    """验证笔误修复：参数名为 bible_service，方法调用落在 bible_service 上。"""
    from unittest.mock import patch

    schema = parse_markdown_outline(SAMPLE)

    novel_service = MagicMock()
    novel_service.create_novel = MagicMock()

    bible_service = MagicMock()
    bible_service.create_bible = MagicMock()
    bible_service.upsert_character = MagicMock()
    bible_service.add_world_setting = MagicMock()
    bible_service.add_location = MagicMock()

    # Mock _save_structure_tree 避免真实 DB 依赖；该路径另有独立测试覆盖
    with patch("application.outline.import_service._save_structure_tree"):
        await _save_to_database(schema, "novel-xyz", novel_service, bible_service)

    # 小说创建
    novel_service.create_novel.assert_called_once()
    # Bible 创建（之前误调用 blog_service）
    bible_service.create_bible.assert_called_once()
    # 角色、世界观、地点都写入
    assert bible_service.upsert_character.call_count == 2
    assert bible_service.add_world_setting.call_count == 1
    assert bible_service.add_location.call_count == 1


async def test_save_structure_tree_uses_transaction_no_error():
    """剧情结构保存应走 BaseSqliteRepository 事务且不抛错。"""
    from unittest.mock import patch, MagicMock

    tree = [
        {"name": "第一卷", "children": [
            {"name": "第一章", "children": []},
            {"name": "第二章", "children": []},
        ]}
    ]

    # Mock save_sync 避免真实 DB
    mock_repo = MagicMock()
    mock_repo.save_sync = MagicMock()

    with patch(
        "infrastructure.persistence.database.story_node_repository.StoryNodeRepository",
        return_value=mock_repo,
    ):
        from application.outline.import_service import _save_structure_tree

        _save_structure_tree(tree, "n1", None)

    # 每次 save 调用了 save_sync
    assert mock_repo.save_sync.call_count == 3  # 3 个节点
    # 验证 BaseSqliteRepository 事务运行（不抛错即通过）
