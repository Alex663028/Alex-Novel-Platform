"""LLM 侧契约：结构化输出解析、校验与（可选）function-calling schema。"""

from application.ai.chapter_state_llm_contract import (
    ChapterStateLlmPayload,
    build_chapter_state_extraction_system_prompt,
    chapter_state_openai_function_tool,
    chapter_state_payload_to_domain,
    empty_chapter_state,
    parse_chapter_state_llm_response,
)
from application.ai.knowledge_llm_contract import (
    LlmInitialKnowledgeFact,
    LlmInitialKnowledgePayload,
    build_initial_knowledge_system_prompt,
    initial_knowledge_openai_function_tool,
    parse_initial_knowledge_llm_response,
    to_knowledge_service_update_dict,
)
from application.ai.llm_json_extract import (
    extract_outer_json_object,
    parse_llm_json_to_dict,
    strip_json_fences,
)

__all__ = [
    "ChapterStateLlmPayload",
    "LlmInitialKnowledgeFact",
    "LlmInitialKnowledgePayload",
    "build_chapter_state_extraction_system_prompt",
    "build_initial_knowledge_system_prompt",
    "chapter_state_openai_function_tool",
    "chapter_state_payload_to_domain",
    "empty_chapter_state",
    "extract_outer_json_object",
    "initial_knowledge_openai_function_tool",
    "parse_chapter_state_llm_response",
    "parse_initial_knowledge_llm_response",
    "parse_llm_json_to_dict",
    "strip_json_fences",
    "to_knowledge_service_update_dict",
]
