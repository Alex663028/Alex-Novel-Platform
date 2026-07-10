import pytest
from domain.novel.value_objects.word_count import WordCount


def test_word_count_creation():
    """测试创建 WordCount"""
    wc = WordCount(1000)
    assert wc.value == 1000


def test_word_count_negative_raises_error():
    """测试负数字数抛出异常"""
    with pytest.raises(ValueError):
        WordCount(-100)


def test_word_count_addition():
    """测试字数相加"""
    wc1 = WordCount(1000)
    wc2 = WordCount(500)
    result = wc1 + wc2
    assert result.value == 1500


def test_word_count_comparison():
    """测试字数比较"""
    wc1 = WordCount(1000)
    wc2 = WordCount(500)
    wc3 = WordCount(1000)

    assert wc1 > wc2
    assert wc2 < wc1
    assert wc1 == wc3


def test_word_count_as_dict_key():
    """测试 WordCount 可以用作字典键"""
    wc1 = WordCount(1000)
    wc2 = WordCount(500)
    wc3 = WordCount(1000)

    word_dict = {wc1: "first", wc2: "second"}
    assert word_dict[wc1] == "first"
    assert word_dict[wc2] == "second"
    assert word_dict[wc3] == "first"  # wc3 equals wc1


def test_word_count_in_set():
    """测试 WordCount 可以用作集合元素"""
    wc1 = WordCount(1000)
    wc2 = WordCount(500)
    wc3 = WordCount(1000)

    word_set = {wc1, wc2, wc3}
    assert len(word_set) == 2  # wc1 and wc3 are equal
    assert wc1 in word_set
    assert wc2 in word_set
