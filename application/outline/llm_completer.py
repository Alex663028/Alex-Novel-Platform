"""
LLM 大纲补全服务

当 MD 大纲缺失部分字段时，调用 LLM 自动生成缺失内容。
"""
import json
import logging
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class CompletionRequest:
    """补全请求"""
    novel_title: str
    genre: str
    premise: str
    existing_characters: List[Dict[str, Any]] = field(default_factory=list)
    existing_world: List[Dict[str, Any]] = field(default_factory=list)
    existing_style: str = ""
    missing_fields: List[str] = field(default_factory=list)


@dataclass
class CompletionResult:
    """补全结果"""
    characters: List[Dict[str, Any]] = field(default_factory=list)
    world_settings: List[Dict[str, Any]] = field(default_factory=list)
    locations: List[Dict[str, Any]] = field(default_factory=list)
    style: str = ""
    structure: List[Dict[str, Any]] = field(default_factory=list)
    premise: str = ""


# 补全提示词模板
COMPLETION_PROMPTS = {
    "premise": """你是一位专业的网文小说大纲设计师。请根据以下信息，为这本小说撰写一个精彩的故事梗概（300-500字）：

小说标题：{title}
类型：{genre}
已有信息：{context}

要求：
1. 故事梗概需要包含：主角身份、核心冲突、主要敌人/障碍、故事目标
2. 语言要有吸引力，能激发读者的阅读兴趣
3. 不要使用"讲述了一个..."这样的开头，直接描述故事
4. 控制在 300-500 字

请直接输出故事梗概文本，不要任何前缀或解释。""",

    "characters": """你是一位专业的网文小说角色设计师。请根据以下小说信息，设计 {count} 个重要角色：

小说标题：{title}
类型：{genre}
故事梗概：{premise}
已有角色：{existing_chars}

要求：
1. 必须包含 1 个主角、2-3 个重要配角、1 个反派
2. 每个角色需要包含：姓名、性别、年龄、外貌特征、性格特点、背景经历、核心驱动力、内在缺口
3. 角色之间要有明确的关系（如：师徒、兄弟、敌人、暗恋等）
4. 角色设定要符合小说类型和基调

请输出 JSON 格式：
```json
[
  {{
    "name": "角色名",
    "gender": "男/女",
    "age": "年龄段",
    "appearance": "外貌锚点（30字以内）",
    "personality": "性格底色（50字以内）",
    "background": "背景经历（100字以内）",
    "core_motivation": "核心驱动力（30字以内）",
    "inner_lack": "内在缺口（30字以内）",
    "relationships": ["与主角的关系"]
  }}
]
```

只输出 JSON，不要其他内容。""",

    "world_settings": """你是一位专业的网文世界观设计师。请根据以下小说信息，设计世界观核心设定：

小说标题：{title}
类型：{genre}
故事梗概：{premise}

要求：
1. 设计 3-5 个核心世界观维度（如：修炼体系、势力格局、天道规则、特殊设定等）
2. 每个维度需要：名称、详细描述（100-200字）
3. 设定要符合小说类型，有新颖性
4. 设定要为剧情服务，不要纯粹的堆砌

请输出 JSON 格式：
```json
[
  {{
    "name": "维度名称",
    "description": "详细描述（100-200字）"
  }}
]
```

只输出 JSON，不要其他内容。""",

    "locations": """你是一位专业的网文场景设计师。请根据以下小说信息，设计 3-5 个重要场景：

小说标题：{title}
类型：{genre}
故事梗概：{premise}
已有场景：{existing_locs}

要求：
1. 每个场景需要：名称、场景类型（城市/宗门/秘境/险地等）、详细描述（80-150字）
2. 场景要有辨识度，符合小说类型
3. 场景要为剧情服务，是重要事件的发生地

请输出 JSON 格式：
```json
[
  {{
    "name": "场景名",
    "location_type": "场景类型",
    "description": "详细描述（80-150字）"
  }}
]
```

只输出 JSON，不要其他内容。""",

    "style": """你是一位专业的网文写作风格顾问。请根据以下小说信息，设计文风公约：

小说标题：{title}
类型：{genre}
故事梗概：{premise}

要求：
1. 叙事风格：描述叙事视角、语言风格（如：轻松幽默、热血燃向、暗黑沉重等）
2. 节奏把控：描述剧情节奏（如：快慢结合、层层递进、高潮迭起等）
3. 写作风格：描述文字特色（如：简洁有力、华丽辞藻、白描手法等）
4. 特殊要求：其他写作注意事项

请输出纯文本格式，每项占一行：
叙事风格：...
节奏把控：...
写作风格：...
特殊要求：...

直接输出内容，不要前缀。""",

    "structure": """你是一位专业的网文大纲架构师。请根据以下小说信息，设计剧情结构树：

小说标题：{title}
类型：{genre}
故事梗概：{premise}
目标章节数：{chapters}

要求：
1. 设计卷-幕-章节三级结构
2. 第一卷 3-5 个幕，每个幕 3-8 个章节
3. 章节命名要有网文特色（如：第1章 废柴逆袭的开始）
4. 结构要符合类型文的节奏（开篇爽点、铺垫、高潮分布）

请输出 JSON 格式：
```json
[
  {{
    "name": "第一卷 卷名",
    "node_type": "volume",
    "children": [
      {{
        "name": "第一幕 幕名",
        "node_type": "act",
        "children": [
          {{
            "name": "第1章 章节名",
            "node_type": "chapter"
          }}
        ]
      }}
    ]
  }}
]
```

只输出 JSON，不要其他内容。"""
}


async def complete_outline(
    request: CompletionRequest,
    llm_call_func
) -> CompletionResult:
    """
    调用 LLM 补全缺失的大纲字段
    
    Args:
        request: 补全请求
        llm_call_func: LLM 调用函数，接收 prompt 返回文本
    
    Returns:
        CompletionResult: 补全结果
    """
    result = CompletionResult()
    context = _build_context(request)
    
    for field_name in request.missing_fields:
        try:
            completed = await _complete_field(
                field_name, request, context, llm_call_func
            )
            if completed:
                _assign_result(result, field_name, completed)
        except Exception as e:
            logger.error(f"LLM 补全 {field_name} 失败: {e}")
    
    return result


async def _complete_field(
    field_name: str,
    request: CompletionRequest,
    context: str,
    llm_call_func
) -> Any:
    """补全单个字段"""
    prompt_template = COMPLETION_PROMPTS.get(field_name)
    if not prompt_template:
        return None
    
    prompt = prompt_template.format(
        title=request.novel_title,
        genre=request.genre,
        premise=request.premise,
        context=context,
        count=5,
        existing_chars=json.dumps(request.existing_characters, ensure_ascii=False),
        existing_locs=json.dumps(request.existing_world, ensure_ascii=False),
        chapters=100
    )
    
    response = await llm_call_func(prompt)
    
    if field_name in ("characters", "world_settings", "locations", "structure"):
        return _parse_json_response(response)
    elif field_name == "style":
        return _parse_style_response(response)
    else:
        return response.strip()


def _build_context(request: CompletionRequest) -> str:
    """构建上下文信息"""
    parts = []
    if request.premise:
        parts.append(f"故事梗概：{request.premise}")
    if request.existing_characters:
        char_names = [c.get('name', '') for c in request.existing_characters]
        parts.append(f"已有角色：{', '.join(char_names)}")
    if request.existing_style:
        parts.append(f"已有风格：{request.existing_style}")
    return '\n'.join(parts)


def _parse_json_response(response: str) -> List[Dict[str, Any]]:
    """解析 JSON 响应"""
    # 清理 markdown 代码块
    text = response.strip()
    if text.startswith('```'):
        lines = text.split('\n')
        # 移除第一行（```json）和最后一行（```）
        text = '\n'.join(lines[1:-1] if lines[-1].strip() == '```' else lines[1:])
    
    try:
        data = json.loads(text)
        if isinstance(data, list):
            return data
        elif isinstance(data, dict):
            return [data]
        return []
    except json.JSONDecodeError as e:
        logger.error(f"JSON 解析失败: {e}, 文本: {text[:200]}")
        return []


def _parse_style_response(response: str) -> str:
    """解析文风公约响应"""
    return response.strip()


def _assign_result(result: CompletionResult, field_name: str, value: Any):
    """将补全结果赋值"""
    if field_name == "characters":
        result.characters = value
    elif field_name == "world_settings":
        result.world_settings = value
    elif field_name == "locations":
        result.locations = value
    elif field_name == "style":
        result.style = value
    elif field_name == "structure":
        result.structure = value
    elif field_name == "premise":
        result.premise = value
