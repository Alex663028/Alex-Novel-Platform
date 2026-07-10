from application.ai.chapter_state_llm_contract import (
    chapter_state_openai_function_tool,
    chapter_state_payload_to_domain,
    empty_chapter_state,
    parse_chapter_state_llm_response,
)


def test_parse_valid():
    raw = '{"new_characters": [], "character_actions": [], "relationship_changes": [], "foreshadowing_planted": [], "foreshadowing_resolved": [], "events": []}'
    p, errs = parse_chapter_state_llm_response(raw)
    assert errs == []
    assert p is not None
    st = chapter_state_payload_to_domain(p)
    assert st.new_characters == []


def test_rejects_extra_root_key():
    raw = (
        '{"new_characters": [], "character_actions": [], "relationship_changes": [], '
        '"foreshadowing_planted": [], "foreshadowing_resolved": [], "events": [], "extra": 1}'
    )
    p, errs = parse_chapter_state_llm_response(raw)
    assert p is None
    assert errs


def test_empty_chapter_state():
    st = empty_chapter_state()
    assert st.new_characters == [] and st.events == []


def test_openai_tool_shape():
    t = chapter_state_openai_function_tool()
    assert t["function"]["name"] == "submit_chapter_state_extraction"
    assert "properties" in t["function"]["parameters"]
