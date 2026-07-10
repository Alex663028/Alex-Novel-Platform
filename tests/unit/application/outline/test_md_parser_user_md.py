"""Md parser 针对用户 MD 的定向回归验证。"""
from pathlib import Path
import sys

sys.path.insert(0, r"F:\小说工具\PlotPilot-Optimized-Source")

from application.outline.md_parser import parse_markdown_outline

USER_MD = r"C:\Users\li596\.hermes-web-ui\upload\default\9f848703669148a0.md"


def load_user_md() -> str:
    return Path(USER_MD).read_text(encoding="utf-8")


def test_user_md_basic_info():
    result = parse_markdown_outline(load_user_md())
    assert result.title == "死后我成了世界规则的bug"
    assert result.author == "AI创作"
    assert result.genre == "都市/规则怪谈/无限流"
    assert result.target_chapters == 550
    assert result.target_words_per_chapter == 3500


def test_user_md_characters_from_tables():
    result = parse_markdown_outline(load_user_md())
    names = [c.get("name") for c in result.characters]
    assert any(name.startswith("苏白") for name in names)
    assert any(name.startswith("陈锋") for name in names)
    assert any(name.startswith("陆渊父母") for name in names)


def test_user_md_locations_from_world_subsections():
    result = parse_markdown_outline(load_user_md())
    loc_names = [c.get("name") for c in result.locations]
    assert any("东京" in name for name in loc_names)
    assert any("上海" in name for name in loc_names)


def test_user_md_style_from_nonstandard_sections():
    result = parse_markdown_outline(load_user_md())
    assert result.writing_style or result.narrative_style or result.special_requirements


def test_user_md_no_missing_critical_fields():
    result = parse_markdown_outline(load_user_md())
    assert "characters" not in result.missing_fields
    assert "locations" not in result.missing_fields
    assert "style" not in result.missing_fields
