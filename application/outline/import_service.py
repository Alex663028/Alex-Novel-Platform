"""
MD 大纲导入服务

完整流程：MD 解析 → 缺失检测 → LLM 补全 → DB 持久化
"""
import logging
import uuid
from typing import Dict, Any, List, Optional
from pathlib import Path

from domain.ai.value_objects.prompt import Prompt
from domain.ai.services.llm_service import GenerationConfig

from application.outline.md_parser import (
    parse_markdown_outline,
    detect_missing_parts,
    schema_to_novel_params,
)
from application.outline.llm_completer import (
    CompletionRequest,
    CompletionResult,
    complete_outline,
)

logger = logging.getLogger(__name__)


async def import_md_outline(
    md_text: str,
    novel_id: Optional[str],
    novel_service,
    bible_service,
    llm_service,
    auto_complete: bool = True,
) -> Dict[str, Any]:
    """
    导入 MD 大纲到系统
    
    Args:
        md_text: MD 文本内容
        novel_id: 小说 ID（可选，不传则自动创建）
        novel_service: Novel 服务实例
        bible_service: Bible 服务实例
        llm_service: LLM 服务实例
        auto_complete: 是否自动调用 LLM 补全缺失
        
    Returns:
        {
            'novel_id': str,
            'title': str,
            'parsed': {...},
            'completed': {...},
            'saved': bool,
            'message': str,
        }
    """
    # 1. 解析 MD
    schema = parse_markdown_outline(md_text)
    
    if not novel_id:
        novel_id = f"novel-{uuid.uuid4().hex[:16]}"
    
    result = {
        'novel_id': novel_id,
        'parsed': {
            'title': schema.title,
            'author': schema.author,
            'genre': schema.genre,
            'target_chapters': schema.target_chapters,
            'premise_length': len(schema.premise),
            'characters_count': len(schema.characters) + (1 if schema.protagonist else 0),
            'world_settings_count': len(schema.world_settings),
            'locations_count': len(schema.locations),
            'structure_nodes': len(schema.structure_tree),
        },
        'completed': {},
        'saved': False,
        'message': '',
    }
    
    # 2. 检测缺失
    missing_info = detect_missing_parts(schema)
    result['missing_fields'] = missing_info['missing']
    result['present_fields'] = missing_info['present']
    
    # 3. LLM 补全
    if auto_complete and missing_info['needs_completion']:
        logger.info(f"检测缺失字段 {missing_info['missing']}，开始 LLM 补全...")
        
        # 准备已有角色
        existing_chars = []
        if schema.protagonist:
            existing_chars.append(schema.protagonist)
        existing_chars.extend(schema.characters)
        
        request = CompletionRequest(
            novel_title=schema.title or '未命名小说',
            genre=schema.genre or '都市脑洞',
            premise=schema.premise,
            existing_characters=existing_chars,
            existing_world=schema.world_settings,
            existing_style=schema.writing_style,
            missing_fields=missing_info['missing'],
        )
        
        # 注入 llm_call - 适配领域 LLM 服务 API
        async def llm_call(prompt_text: str) -> str:
            prompt = Prompt(
                system="你是一位专业的网文小说大纲设计师。请根据要求输出高质量内容。",
                user=prompt_text,
            )
            config = GenerationConfig(max_tokens=4000, temperature=0.8)
            gen_result = await llm_service.generate(prompt, config)
            return gen_result.content
        
        completion = await complete_outline(request, llm_call)
        
        # 合并补全结果
        _merge_completion(schema, completion)
        
        result['completed'] = {
            'characters_added': len(completion.characters),
            'world_settings_added': len(completion.world_settings),
            'locations_added': len(completion.locations),
            'style_completed': bool(completion.style),
            'structure_completed': bool(completion.structure),
            'premise_completed': bool(completion.premise),
        }
    
    # 4. 保存到数据库
    try:
        await _save_to_database(schema, novel_id, novel_service, bible_service)
        result['saved'] = True
        result['message'] = '导入成功'
    except Exception as e:
        logger.error(f"保存到数据库失败: {e}")
        result['saved'] = False
        result['message'] = f'数据库保存失败: {str(e)}'
    
    return result


def _merge_completion(schema, completion: CompletionResult):
    """将 LLM 补全结果合并到 schema"""
    if completion.premise and not schema.premise:
        schema.premise = completion.premise
    
    if completion.characters:
        existing_names = {c.get('name') for c in schema.characters}
        for char in completion.characters:
            if char.get('name') not in existing_names:
                schema.characters.append(char)
                existing_names.add(char.get('name'))
    
    if completion.world_settings:
        existing_names = {w.get('name') for w in schema.world_settings}
        for ws in completion.world_settings:
            if ws.get('name') not in existing_names:
                schema.world_settings.append(ws)
                existing_names.add(ws.get('name'))
    
    if completion.locations:
        existing_names = {l.get('name') for l in schema.locations}
        for loc in completion.locations:
            if loc.get('name') not in existing_names:
                schema.locations.append(loc)
                existing_names.add(loc.get('name'))
    
    if completion.style:
        schema.writing_style = completion.style
    
    if completion.structure:
        schema.structure_tree = completion.structure
    
    # 重新检测缺失
    schema.missing_fields = []
    detect_missing_parts(schema)


async def _save_to_database(
    schema,
    novel_id: str,
    novel_service,
    blog_service,
):
    """将解析结果保存到数据库"""
    params = schema_to_novel_params(schema, novel_id)
    
    # 1. 创建小说
    novel_service.create_novel(
        novel_id=params['novel_id'],
        title=params['title'],
        author=params['author'],
        target_chapters=params['target_chapters'],
        premise=params['premise'],
        genre=params['genre'],
        target_words_per_chapter=params['target_words_per_chapter'],
    )
    
    # 2. 创建 Bible
    blog_service.create_bible(bible_id=f"bible-{novel_id}", novel_id=novel_id)
    
    # 3. 添加角色
    for i, char in enumerate(params.get('characters_md', [])):
        char_id = char.get('id', f"char-{novel_id}-{i+1}")
        blog_service.upsert_character(
            novel_id=novel_id,
            character_id=char_id,
            name=char.get('name', f'角色{i+1}'),
            description=char.get('description', ''),
            relationships=char.get('relationships', []),
            gender=char.get('gender', ''),
            age=char.get('age', ''),
            appearance=char.get('appearance', ''),
            personality=char.get('personality', ''),
            background=char.get('background', ''),
            core_motivation=char.get('core_motivation', ''),
            inner_lack=char.get('inner_lack', ''),
            public_profile=char.get('public_profile', ''),
            hidden_profile=char.get('hidden_profile', ''),
            reveal_chapter=char.get('reveal_chapter'),
            verbal_tic=char.get('verbal_tic', ''),
            core_belief=char.get('core_belief', ''),
        )
    
    # 4. 添加世界观
    for i, ws in enumerate(params.get('world_settings_md', [])):
        setting_id = f"ws-{novel_id}-{i+1}"
        # 类型映射：世界观 → rule（规则/体系），location → 地点
        raw_type = ws.get('setting_type', '')
        if raw_type in ('location', 'item', 'rule'):
            st = raw_type
        elif '地点' in raw_type or '场景' in raw_type:
            st = 'location'
        else:
            st = 'rule'
        blog_service.add_world_setting(
            novel_id=novel_id,
            setting_id=setting_id,
            name=ws.get('name', f'设定{i+1}'),
            description=ws.get('description', ''),
            setting_type=st,
        )
    
    # 5. 添加地点
    for i, loc in enumerate(params.get('locations_md', [])):
        loc_id = f"loc-{novel_id}-{i+1}"
        blog_service.add_location(
            novel_id=novel_id,
            location_id=loc_id,
            name=loc.get('name', f'地点{i+1}'),
            description=loc.get('description', ''),
            location_type=loc.get('location_type', '地点'),
        )
    
    # 6. 添加剧情结构
    structure_tree = params.get('structure_tree', [])
    if structure_tree:
        _save_structure_tree(structure_tree, novel_id, novel_service)


def _save_structure_tree(tree: List[Dict[str, Any]], novel_id: str, novel_service):
    """保存剧情结构树"""
    from domain.structure.story_node import StoryNode, NodeType, PlanningStatus, PlanningSource
    from datetime import datetime
    
    def _node_type(name: str) -> NodeType:
        if '卷' in name:
            return NodeType.VOLUME
        elif '幕' in name:
            return NodeType.ACT
        else:
            return NodeType.CHAPTER
    
    def _save_node(node: Dict[str, Any], parent_id: Optional[str], order: int):
        name = node.get('name', '')
        ntype = node.get('node_type', '') or _node_type(name)
        if isinstance(ntype, str):
            ntype = NodeType(ntype)
        
        story_node = StoryNode(
            id=f"sn-{uuid.uuid4().hex[:12]}",
            novel_id=novel_id,
            node_type=ntype,
            number=order,
            title=name,
            description=node.get('description', ''),
            parent_id=parent_id,
            order_index=order,
            planning_status=PlanningStatus.CONFIRMED,
            planning_source=PlanningSource.MANUAL,
            created_at=datetime.now(),
            updated_at=datetime.now(),
        )
        
        try:
            from infrastructure.persistence.database.story_node_repository import StoryNodeRepository
            from application.paths import get_db_path
            repo = StoryNodeRepository(get_db_path())
            repo.save_sync(story_node)
        except Exception as e:
            logger.warning(f"保存节点失败 {name}: {e}")
            return
        
        # 递归保存子节点
        for i, child in enumerate(node.get('children', [])):
            _save_node(child, story_node.id, i)
    
    # 保存根节点（卷级别）
    for i, node in enumerate(tree):
        _save_node(node, None, i)


async def import_md_file(
    file_path: str,
    novel_id: Optional[str],
    novel_service,
    blog_service,
    llm_service,
    auto_complete: bool = True,
) -> Dict[str, Any]:
    """从文件导入 MD 大纲"""
    text = Path(file_path).read_text(encoding='utf-8')
    return await import_md_outline(
        md_text=text,
        novel_id=novel_id,
        novel_service=novel_service,
        bible_service=blog_service,
        llm_service=llm_service,
        auto_complete=auto_complete,
    )
