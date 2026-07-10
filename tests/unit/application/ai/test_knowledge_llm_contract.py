"""application.ai.knowledge_llm_contract 解析与校验。"""

from application.ai.knowledge_llm_contract import (
    initial_knowledge_openai_function_tool,
    parse_initial_knowledge_llm_response,
    to_knowledge_service_update_dict,
)


def test_parse_valid_with_fences_and_trailing_junk():
    raw = """以下为结果：
```json
{"premise_lock": "主角寻亲", "facts": [{"id": "fact-001", "subject": "甲", "predicate": "是", "object": "人"}]}
```
谢谢
"""
    payload, errs = parse_initial_knowledge_llm_response(raw)
    assert errs == []
    assert payload is not None
    assert payload.premise_lock == "主角寻亲"
    assert len(payload.facts) == 1
    assert payload.facts[0].obj == "人"


def test_parse_rejects_extra_root_field():
    data = '{"premise_lock": "x", "facts": [], "provenance": []}'
    payload, errs = parse_initial_knowledge_llm_response(data)
    assert payload is None
    assert errs and "extra" in errs[0].lower()


def test_parse_rejects_extra_fact_field():
    data = (
        '{"premise_lock": "x", "facts": ['
        '{"id": "f1", "subject": "a", "predicate": "p", "object": "b", "source_type": "manual"}'
        "]}"
    )
    payload, errs = parse_initial_knowledge_llm_response(data)
    assert payload is None


def test_parse_object_alias_obj():
    raw = '{"premise_lock": "", "facts": [{"id": "f1", "subject": "a", "predicate": "p", "obj": "b"}]}'
    payload, errs = parse_initial_knowledge_llm_response(raw)
    assert errs == []
    assert payload is not None
    assert payload.facts[0].obj == "b"


def test_to_service_dict_sets_source_type():
    from application.ai import LlmInitialKnowledgeFact, LlmInitialKnowledgePayload

    p = LlmInitialKnowledgePayload(
        premise_lock="梗概",
        facts=[LlmInitialKnowledgeFact(id="f1", subject="a", predicate="p", obj="b")],
    )
    d = to_knowledge_service_update_dict(p)
    assert d["facts"][0]["object"] == "b"
    assert d["facts"][0]["source_type"] == "ai_generated"


def test_openai_tool_has_name_and_parameters():
    tool = initial_knowledge_openai_function_tool()
    assert tool["type"] == "function"
    assert tool["function"]["name"] == "submit_initial_knowledge"
    assert "properties" in tool["function"]["parameters"]
