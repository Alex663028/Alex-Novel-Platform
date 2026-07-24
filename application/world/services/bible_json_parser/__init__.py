"""Bible LLM JSON output parser and repair utilities.

This module handles parsing, sanitizing, and repairing JSON output from LLM responses
for Bible generation (characters, locations, worldbuilding, style).
"""

import json
import re
from typing import Dict, Any, Optional, Tuple


# ============================================================================
# Streaming JSON array incremental parser
# ============================================================================

def try_extract_next_item(buf: str, array_key: str) -> Optional[Tuple[Dict[str, Any], str]]:
    """Try to extract the next complete JSON object from a streaming buffer.
    
    Strategy: Find the array region for array_key, then use bracket-depth matching
    to extract the first complete JSON object.
    
    Args:
        buf: Current accumulated LLM output text
        array_key: JSON array key name (e.g., "characters", "locations")
    
    Returns:
        (parsed_dict, remaining_buf) if a complete object is found
        None if no complete object yet
    """
    # Find array start marker "key": [
    # Loose matching: allows whitespace, newlines
    pattern = rf'"{array_key}"\s*:\s*\['
    m = re.search(pattern, buf)
    if m is None:
        return None

    arr_start = m.end()  # offset after [
    # Find first complete JSON object in array region
    depth = 0
    in_string = False
    escape_next = False
    obj_start = None

    i = arr_start
    while i < len(buf):
        ch = buf[i]

        if escape_next:
            escape_next = False
            i += 1
            continue

        if ch == '\\' and in_string:
            escape_next = True
            i += 1
            continue

        if ch == '"' and not escape_next:
            in_string = not in_string
            i += 1
            continue

        if in_string:
            i += 1
            continue

        if ch == '{':
            if depth == 0:
                obj_start = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and obj_start is not None:
                # Found complete object
                obj_str = buf[obj_start:i + 1]
                try:
                    parsed = json.loads(obj_str)
                    # Remove parsed object from buf (keep array prefix and remaining)
                    rest_start = i + 1
                    # Skip comma and whitespace
                    while rest_start < len(buf) and buf[rest_start] in ' ,\n\r\t':
                        rest_start += 1
                    # Keep array prefix + remaining unparsed content
                    remaining = f'{{"{array_key}": [' + buf[rest_start:]
                    return parsed, remaining
                except json.JSONDecodeError:
                    # Object looks complete but parse failed, skip
                    obj_start = None

        i += 1

    return None


# ============================================================================
# JSON output sanitization
# ============================================================================

# Common non-standard quote characters that appear in LLM output
_FIXABLE_QUOTES: Dict[int, str] = {
    0x201C: '"',   # " (left double quotation mark)
    0x201D: '"',   # " (right double quotation mark)
    0x2018: "'",   # ' (left single quotation mark)
    0x2019: "'",   # ' (right single quotation mark)
    0x201E: '"',   # " (double low-9 quotation mark)
    0x201F: '"',   # " (double high-reversed-9 quotation mark)
    0x2033: '"",   # " (double prime)
    0x2036: '"',   # " (reversed double prime)
    0x275D: '"',   # ? (heavy double turned comma quotation mark)
    0x275E: '"',   # ? (heavy double comma quotation mark)
    0xFF02: '"',   # ＂ (fullwidth quotation mark)
    0x02BA: "'",   # ? (modifier letter double prime)
    0x0060: "'",   # ` (grave accent - only replace inside strings)
}


def sanitize_llm_json_output(raw: str) -> str:
    """Sanitize LLM JSON output by removing code blocks and thinking tags."""
    content = (raw or "").strip()
    # Remove ANSI escape codes
    content = re.sub(r"\x1b\[[0-9;]*m", "", content)
    # Remove thinking/reasoning tags
    content = re.sub(r"<think\|?>.*?</think\|?>", "", content, flags=re.DOTALL)
    content = re.sub(r"<thinking>.*?</thinking>", "", content, flags=re.DOTALL)
    # Extract from code blocks
    if "```json" in content:
        content = content.split("```json", 1)[1].split("```", 1)[0]
    elif "```" in content:
        content = content.split("```", 1)[1].split("```", 1)[0]
    return content.strip()


def extract_outer_json_object(text: str) -> str:
    """Extract the outermost JSON object from text."""
    start = text.find("{")
    end = text.rfind("}")
    if start == -1:
        return text
    if end != -1 and end > start:
        return text[start : end + 1]
    return text[start:]


def normalize_quotes_in_json(text: str) -> str:
    """Replace non-standard Chinese quotation marks with ASCII quotes.
    
    Strategy: Only replace inside string values (between ASCII double quotes)
    to avoid corrupting JSON structure itself.
    """
    result = []
    in_string = False
    escape = False

    for ch in text:
        if escape:
            result.append(ch)
            escape = False
            continue
        if ch == "\\" and in_string:
            result.append(ch)
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
            result.append(ch)
            continue
        if in_string:
            cp = ord(ch)
            if cp in _FIXABLE_QUOTES:
                result.append(_FIXABLE_QUOTES[cp])
                continue
        result.append(ch)

    return "".join(result)


def repair_json_string(text: str) -> str:
    """Attempt to repair truncated or malformed JSON."""
    text = text.strip()
    if not text:
        return text

    # Phase 0: Direct parse (fastest path)
    try:
        json.loads(text)
        return text
    except (json.JSONDecodeError, ValueError):
        pass

    # Phase 1: Normalize non-standard quotes then retry
    normalized = normalize_quotes_in_json(text)
    if normalized != text:
        try:
            json.loads(normalized)
            return normalized
        except (json.JSONDecodeError, ValueError):
            pass
        text = normalized  # subsequent repair based on normalized text

    def _close_json(s: str) -> str:
        """Close unclosed brackets/braces in a JSON string."""
        s = s.strip()
        if not s:
            return "{}"

        in_string = False
        escape = False
        stack = []
        result = []

        for ch in s:
            if escape:
                result.append(ch)
                escape = False
                continue
            if ch == "\\" and in_string:
                result.append(ch)
                escape = True
                continue
            if ch == '"':
                in_string = not in_string
                result.append(ch)
                continue
            if in_string:
                result.append(ch)
                continue
            if ch == "{":
                stack.append("}")
                result.append(ch)
                continue
            if ch == "[":
                stack.append("]")
                result.append(ch)
                continue
            if ch in "}]":
                if stack and stack[-1] == ch:
                    stack.pop()
                result.append(ch)
                continue
            result.append(ch)

        if in_string:
            result.append('"')

        repaired = "".join(result).rstrip()
        while repaired.endswith(","):
            repaired = repaired[:-1].rstrip()
        while stack:
            while repaired.endswith(","):
                repaired = repaired[:-1].rstrip()
            repaired += stack.pop()
        return repaired

    candidate = text
    retries = 15
    while retries > 0 and candidate:
        repaired = _close_json(candidate)
        try:
            json.loads(repaired)
            return repaired
        except json.JSONDecodeError:
            last_comma = candidate.rfind(",")
            if last_comma == -1:
                break
            candidate = candidate[:last_comma]
        retries -= 1
    return _close_json(text)


def parse_llm_json_to_dict(raw: str) -> Dict[str, Any]:
    """Parse LLM JSON output (unified pipeline).
    
    Previously used custom parse_json_from_response + _repair_json_string,
    which only covered 3-4 cases and couldn't handle DeepSeek's Chinese quotes,
    thinking chains, etc. Now unified with llm_json_extract pipeline.
    """
    from application.ai.llm_json_extract import parse_llm_json_to_dict as _unified_parse
    data, errs = _unified_parse(raw)
    if data is not None:
        return data
    raise json.JSONDecodeError(errs[0] if errs else "parse failed", raw, 0)


# ============================================================================
# Character/Location helpers
# ============================================================================

def infer_character_importance(char_data: Dict[str, Any]) -> str:
    """Determine character importance: primary / secondary / minor."""
    role = str(char_data.get("role") or "").strip()
    desc_head = str(char_data.get("description") or "")[:160]
    blob = f"{role}{desc_head}"
    if "主角" in blob:
        return "primary"
    if any(k in blob for k in ("导师", "师父", "宿敌", "反派", "对手", "核心", "幕后")):
        return "secondary"
    return "minor"


def map_location_kind(raw_type: str) -> str:
    """Map location type to KnowledgeTriple.location_type categories."""
    t = str(raw_type or "")
    if "城" in t:
        return "city"
    if any(k in t for k in ("区域", "国", "郡", "县", "州", "省", "山脉")):
        return "region"
    if any(k in t for k in ("建筑", "楼", "阁", "塔", "庙", "宫", "殿", "城")):
        return "building"
    if any(k in t for k in ("势力", "帮", "派", "门", "宗", "会", "团")):
        return "faction"
    if any(k in t for k in ("特殊", "秘境", "领域", "遗迹", "幻境")):
        return "realm"
    return "region"


def default_location_importance(_loc_data: Dict[str, Any]) -> str:
    return "normal"