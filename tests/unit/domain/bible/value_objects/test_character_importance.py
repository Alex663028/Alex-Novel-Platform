import pytest
from domain.bible.value_objects.character_importance import CharacterImportance


def test_character_importance_enum_values():
    """测试 CharacterImportance 枚举值"""
    assert CharacterImportance.PROTAGONIST.value == "protagonist"
    assert CharacterImportance.MAJOR_SUPPORTING.value == "major_supporting"
    assert CharacterImportance.IMPORTANT_SUPPORTING.value == "important_supporting"
    assert CharacterImportance.MINOR.value == "minor"
    assert CharacterImportance.BACKGROUND.value == "background"


def test_character_importance_ordering():
    """测试重要性排序"""
    assert CharacterImportance.PROTAGONIST > CharacterImportance.MAJOR_SUPPORTING
    assert CharacterImportance.MAJOR_SUPPORTING > CharacterImportance.IMPORTANT_SUPPORTING
    assert CharacterImportance.IMPORTANT_SUPPORTING > CharacterImportance.MINOR
    assert CharacterImportance.MINOR > CharacterImportance.BACKGROUND


def test_character_importance_token_allocation():
    """测试每个重要性级别的 token 分配"""
    assert CharacterImportance.PROTAGONIST.token_allocation() == 1000
    assert CharacterImportance.MAJOR_SUPPORTING.token_allocation() == 800
    assert CharacterImportance.IMPORTANT_SUPPORTING.token_allocation() == 150
    assert CharacterImportance.MINOR.token_allocation() == 50
    assert CharacterImportance.BACKGROUND.token_allocation() == 20
