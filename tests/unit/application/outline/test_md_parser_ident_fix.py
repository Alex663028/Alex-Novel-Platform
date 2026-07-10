"""验证 MD 解析器对用户反馈字段的识别能力"""
from application.outline.md_parser import (
    parse_markdown_outline,
    detect_missing_parts,
    _extract_total_words,
    MDSchema,
)


def test_extract_total_words_from_wan_unit():
    schema = MDSchema()
    schema.target_chapters = 550
    _extract_total_words(schema, "192.5万字（550章 × 3500字/章）")
    assert schema.target_words_per_chapter == 3500


def test_extract_total_words_pure_int():
    schema = MDSchema()
    _extract_total_words(schema, "2000000字")
    assert schema.target_words_per_chapter == 0  # no chapter count to divide


def test_parse_total_words_per_chapter():
    text = """
# 标题

## 基本信息
- 预计字数：192.5万字（550章 x 3500字/章）
- 目标章节：550章

## 故事梗概
大纲内容

## 主角设定
- 身份：收容所实习生

## 角色设定
### 林默认
- 性别：男

### 赵立新
- 性格：果断

## 剧情结构
- 第一卷 入所
  - 第1章
"""
    schema = parse_markdown_outline(text)
    info = detect_missing_parts(schema)
    assert schema.title == "标题"
    assert schema.target_chapters == 550
    assert schema.target_words_per_chapter == 3500
    assert schema.protagonist is not None
    assert len(schema.characters) == 2
    assert "premise" in info["present"]
    assert "characters" in info["present"]
    assert "structure" in info["present"]


def test_parse_genre_synonyms():
    text = """
# 测试

## 基本信息
- 题材：都市异能
- 分类：轻小说

## 故事梗概
内容
"""
    schema = parse_markdown_outline(text)
    assert schema.genre in ("都市异能", "轻小说")


def test_parse_style_and_structure_synonyms():
    text = """
# 测试

## 细纲
- 第一卷 入所
  - 第1章

## 文风公约
- 叙事：第一人称
- 节奏：快节奏
"""
    schema = parse_markdown_outline(text)
    assert len(schema.structure_tree) > 0
    assert schema.narrative_style or schema.writing_style
