import pytest

from domain.bible.bible_location_tree import validate_location_forest


def test_accepts_valid_forest():
    locs = [
        {"id": "a", "parent_id": None},
        {"id": "b", "parent_id": "a"},
    ]
    validate_location_forest(locs)


def test_rejects_orphan_parent():
    locs = [{"id": "a", "parent_id": "missing"}]
    with pytest.raises(ValueError, match="orphan"):
        validate_location_forest(locs)


def test_rejects_cycle():
    locs = [
        {"id": "a", "parent_id": "b"},
        {"id": "b", "parent_id": "a"},
    ]
    with pytest.raises(ValueError, match="cycle"):
        validate_location_forest(locs)


def test_rejects_duplicate_id():
    locs = [{"id": "a"}, {"id": "a"}]
    with pytest.raises(ValueError, match="duplicate"):
        validate_location_forest(locs)
