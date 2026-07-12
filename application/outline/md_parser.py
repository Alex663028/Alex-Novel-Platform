"""
MD 大纲文件解析器

解析 Markdown 格式的小说大纲文件，提取：
- 基本元数据（标题、作者、类型、目标章节数等）
- 角色列表（主角、配角、关系）
- 世界观设定
- 地点列表
- 文风公约
- 剧情结构（卷/幕/章节树）
"""
import re
from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from pathlib import Path


@dataclass
class MDSchema:
    """MD 大纲解析结果"""
    title: str = ""
    author: str = ""
    genre: str = ""
    target_chapters: int = 0
    target_words_per_chapter: int = 0
    premise: str = ""
    
    protagonist: Optional[Dict[str, Any]] = None
    characters: List[Dict[str, Any]] = field(default_factory=list)
    world_settings: List[Dict[str, Any]] = field(default_factory=list)
    locations: List[Dict[str, Any]] = field(default_factory=list)
    
    # 文风公约
    narrative_style: str = ""
    rhythm_control: str = ""
    writing_style: str = ""
    special_requirements: str = ""
    pacing_control: str = ""
    
    # 剧情结构（嵌套树）
    structure_tree: List[Dict[str, Any]] = field(default_factory=list)
    
    # 缺失字段跟踪
    missing_fields: List[str] = field(default_factory=list)

    def to_params(self, novel_id: str) -> Dict[str, Any]:
        """转换为创建小说的参数字典（替代 schema_to_novel_params）。"""
        all_characters = []
        if self.protagonist:
            all_characters.append(self.protagonist)
        all_characters.extend(self.characters)

        return {
            'novel_id': novel_id,
            'title': self.title or '未命名小说',
            'author': self.author or 'Alex',
            'target_chapters': self.target_chapters or 100,
            'premise': self.premise or f"《{self.title}》的故事",
            'genre': self.genre or '都市脑洞',
            'target_words_per_chapter': self.target_words_per_chapter or 3000,
            'characters_md': all_characters,
            'locations_md': self.locations,
            'world_settings_md': self.world_settings,
            'narrative_style': self.narrative_style,
            'rhythm_control': self.rhythm_control,
            'writing_style': self.writing_style,
            'special_requirements': self.special_requirements,
            'structure_tree': self.structure_tree,
        }


def parse_markdown_outline(text: str) -> MDSchema:
    """解析 MD 大纲文本"""
    schema = MDSchema()
    lines = text.split('\n')
    
    current_section = None
    current_subsection = None
    current_buffer = []
    
    # 用于延迟计算每章字数
    pending_total_words = 0
    
    # 状态机解析
    for line in lines:
        stripped = line.strip()
        
        # H1: 标题
        if stripped.startswith('# ') and not stripped.startswith('## '):
            schema.title = stripped[2:].strip()
            continue
        
        # H2: 主章节
        if stripped.startswith('## '):
            # 保存之前的 section
            _flush_section(schema, current_section, current_subsection, current_buffer)
            current_section = stripped[3:].strip()
            current_subsection = None
            current_buffer = []
            continue
        
        # H3: 子章节
        if stripped.startswith('### '):
            # 保存之前的 subsection
            _flush_subsection(schema, current_section, current_subsection, current_buffer)
            current_subsection = stripped[4:].strip()
            current_buffer = []
            continue
        
        # H4: 次子章节
        if stripped.startswith('#### '):
            current_buffer.append(stripped)
            continue
        
        # 列表项
        if stripped.startswith('- '):
            current_buffer.append(stripped[2:].strip())
            continue
        
        # 普通文本
        if stripped:
            current_buffer.append(stripped)
    
    # 刷新最后一段
    _flush_section(schema, current_section, current_subsection, current_buffer)
    
    # 检测缺失字段
    _detect_missing(schema)
    
    return schema


def _detect_missing(schema: MDSchema):
    """检测缺失字段"""
    schema.missing_fields = []
    
    if not schema.premise:
        schema.missing_fields.append("premise")
    if not schema.characters:
        schema.missing_fields.append("characters")
    if not schema.world_settings:
        schema.missing_fields.append("world_settings")
    if not schema.locations:
        schema.missing_fields.append("locations")
    if not schema.narrative_style and not schema.writing_style:
        schema.missing_fields.append("style")
    if not schema.structure_tree:
        schema.missing_fields.append("structure")


def _flush_section(schema: MDSchema, section: Optional[str], 
                   subsection: Optional[str], buffer: List[str]):
    """刷新主章节数据"""
    if section is None:
        return
    
    _flush_subsection(schema, section, subsection, buffer)
    
    text = '\n'.join(buffer).strip()
    
    # 基本信息
    if '基本信息' in section or '基础信息' in section:
        _parse_basic_info(schema, text)
    
    # 故事梗概
    elif '故事梗概' in section or '梗概' in section or '简介' in section:
        schema.premise = text
    
    # 主角
    elif '主角' in section:
        if schema.protagonist is None or not schema.protagonist.get('name'):
            schema.protagonist = _parse_character(subsection or "主角", text)
    
    # 角色列表 / 人物
    elif '角色' in section or '人物' in section:
        if subsection is None and text:
            # 直接是列表
            chars = _parse_character_list(text)
            schema.characters.extend(chars)
    
    # 世界观
    elif '世界观' in section:
        if not text:
            return
        schema.world_settings.append({
            'name': subsection or '主世界',
            'description': text
        })
    
    # 地点
    elif '地点' in section or '场景' in section:
        if not text:
            return
        schema.locations.append({
            'name': subsection or '未命名地点',
            'description': text,
            'location_type': '地点'
        })
    
    # 文风公约
    elif _has_keywords(section, ['文风','写作风格','写作','风格','文笔','叙事口吻']):
        _parse_style(schema, text)

    # 剧情结构 / 大纲
    elif _has_keywords(section, ['剧情','结构','大纲','细纲','分卷','分章']):
        schema.structure_tree = _parse_structure(text)

    # 兜底：如果含有主角/角色/人物关键词但上面没命中，也尝试解析角色列表
    elif _has_keywords(section, ['主角','角色','人物','配角','人物设定','角色设定']) and section not in [None]:
        chars = _parse_character_list(text)
        if chars:
            schema.characters.extend(chars)

    # 兜底：世界观
    elif _has_keywords(section, ['世界观','世界','设定','背景']):
        if text:
            schema.world_settings.append({
                'name': subsection or '主世界',
                'description': text
            })

    # 兜底：地点
    elif _has_keywords(section, ['地点','场景','地图','位置']):
        if text:
            schema.locations.append({
                'name': subsection or '未命名地点',
                'description': text,
                'location_type': '地点'
            })


def _flush_subsection(schema: MDSchema, section: Optional[str],
                      subsection: Optional[str], buffer: List[str]):
    """刷新子章节数据"""
    if not section or not subsection or not buffer:
        return
    
    text = '\n'.join(buffer).strip()
    
    # 主角详情：仅保留第一个作为protagonist，其他按角色追加
    if '主角' in section:
        if schema.protagonist is None:
            schema.protagonist = _parse_character(subsection, text)
        else:
            char = _parse_character(subsection, text)
            if char:
                schema.characters.append(char)
    
    # 单个角色
    elif '角色' in section or '人物' in section:
        char = _parse_character(subsection, text)
        if char:
            schema.characters.append(char)
    
    # 地点详情 / 地点启发式子节：优先于世界观，避免被吞掉
    elif '地点' in section or _looks_like_location_subsection(subsection):
        loc = {
            'name': subsection,
            'description': text,
            'location_type': '地点'
        }
        schema.locations.append(loc)
        # 如果子节正文里还有具体地点列表，顺手拆出来
        _extract_locations_from_text(schema, text)
    
    # 世界观维度（兜底）
    elif '世界观' in section:
        schema.world_settings.append({
            'name': subsection,
            'description': text
        })

    # 文风/风格线索：创作原则、商业化设定、推进计划、市场对标等
    elif _has_keywords(section, ['文风','写作风格','写作','文笔','叙事口吻','创作原则','推进计划','商业化','付费卡点','市场对标','每章设计规范','核心创作原则']):
        _parse_style(schema, text)


def _parse_basic_info(schema: MDSchema, text: str):
    """解析基本信息"""
    for line in text.split('\n'):
        line = line.strip()
        if '：' in line:
            key, value = line.split('：', 1)
        elif ':' in line:
            key, value = line.split(':', 1)
        else:
            continue
        
        key = key.strip().strip('*').strip()
        value = value.strip()
        
        if '作者' in key:
            schema.author = value
        if '类型' in key or '赛道' in key or '题材' in key or '分类' in key:
            schema.genre = value
        elif ('目标' in key and '章' in key) or ('规划' in key and '章' in key) or key.strip().startswith('预计章数'):
            schema.target_chapters = _extract_int(value)
            # Also try to extract words per chapter from values like "550章 × 3500字/章"
            if not schema.target_words_per_chapter:
                schema.target_words_per_chapter = _extract_words_per_chapter(value)
        elif '每章' in key and '字' in key:
            schema.target_words_per_chapter = _extract_int(value)
        elif key.strip().startswith('预计字数') or key.strip().startswith('总字数') or key.strip().startswith('目标字数'):
            _extract_total_words(schema, value)


def _parse_character(name: str, text: str) -> Dict[str, Any]:
    """解析角色数据"""
    char = {
        'id': f'char_{hash(name) & 0xFFFFFF:06x}',
        'name': name,
        'description': '',
        'relationships': [],
    }
    
    if not text:
        return char
    
    for line in text.split('\n'):
        line = line.strip()
        # 支持 Markdown 表格格式：| key | value |
        if line.startswith('|') and line.endswith('|'):
            parts = [p.strip() for p in line.strip('|').split('|')]
            if len(parts) >= 2 and parts[0] not in ('', '-', '属性', '------'):
                key, value = parts[0], parts[1]
            else:
                continue
        elif line.startswith('- '):
            inner = line[2:].strip()
            if '：' in inner:
                key, value = inner.split('：', 1)
                key = key.strip('*').strip()
            elif ':' in inner:
                key, value = inner.split(':', 1)
                key = key.strip('*').strip()
            else:
                continue
        elif '：' in line:
            key, value = line.split('：', 1)
        elif ':' in line:
            key, value = line.split(':', 1)
        else:
            continue
        
        key = key.strip()
        value = value.strip()
        
        if '性别' in key:
            char['gender'] = value
        elif '年龄' in key:
            char['age'] = value
        elif '外貌' in key:
            char['appearance'] = value
        elif '性格' in key:
            char['personality'] = value
        elif '背景' in key or '经历' in key:
            char['background'] = value
        elif '驱动' in key or '动机' in key:
            char['core_motivation'] = value
        elif '缺口' in key or '缺失' in key:
            char['inner_lack'] = value
        elif '身份' in key:
            char['public_profile'] = value
        elif '隐藏' in key or '秘密' in key:
            char['hidden_profile'] = value
        elif '口头禅' in key:
            char['verbal_tic'] = value
        elif '信念' in key:
            char['core_belief'] = value
        elif '关系' in key:
            char['relationships'].append(value)
        elif '描述' in key:
            char['description'] = value
    
    if not char['description']:
        char['description'] = f"{name}，{char.get('background', '')}"
    
    return char


def _parse_character_list(text: str) -> List[Dict[str, Any]]:
    """解析角色列表"""
    characters = []
    current = None
    
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
        
        # 检测新角色（名称不带前缀标记的）
        if not line.startswith(('-', '·', '*')) and len(line) <= 20:
            if current:
                characters.append(current)
            current = {
                'id': f'char_{hash(line) & 0xFFFFFF:06x}',
                'name': line,
                'description': '',
                'relationships': []
            }
        elif current and line.startswith(('-', '·', '*')):
            content = line[1:].strip()
            current['description'] += content + '\n'
    
    if current:
        characters.append(current)
    
    return characters


def _parse_style(schema: MDSchema, text: str):
    """解析文风公约"""
    style_bits = []
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
        if '：' in line:
            key, value = line.split('：', 1)
            key = key.strip()
            value = value.strip()
            if '叙事' in key:
                schema.narrative_style = value
            elif '节奏' in key:
                schema.rhythm_control = value
            elif '风格' in key:
                schema.writing_style = value
            elif '要求' in key:
                schema.special_requirements = value
            style_bits.append(value)
        elif ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            if '叙事' in key:
                schema.narrative_style = value
            elif '节奏' in key:
                schema.rhythm_control = value
            elif '风格' in key:
                schema.writing_style = value
            elif '要求' in key:
                schema.special_requirements = value
            style_bits.append(value)
        else:
            # 无冒号行也纳入风格线索，避免纯列表项被丢弃
            style_bits.append(line)
    # 兜底：如果上面没有单独抽出 writing_style，就把 collected bits 合成一条
    if not schema.writing_style and style_bits:
        schema.writing_style = '；'.join(style_bits[:10])


def _parse_structure(text: str) -> List[Dict[str, Any]]:
    """解析剧情结构（卷/幕/章节树）"""
    # 简化版：按缩进解析
    lines = text.split('\n')
    root = []
    stack = [(root, -1)]  # (parent_list, indent_level)
    
    for line in lines:
        if not line.strip():
            continue
        
        # 计算缩进层级
        indent = len(line) - len(line.lstrip())
        name = line.strip().lstrip('- ').lstrip('* ')
        
        if not name:
            continue
        
        node = {
            'name': name,
            'children': [],
            'node_type': _guess_node_type(name, indent)
        }
        
        # 找到合适的父节点
        while len(stack) > 1 and stack[-1][1] >= indent:
            stack.pop()
        
        stack[-1][0].append(node)
        stack.append((node['children'], indent))
    
    return root


def _guess_node_type(name: str, indent: int) -> str:
    """猜测节点类型"""
    if '卷' in name or indent == 0:
        return 'volume'
    elif '幕' in name:
        return 'act'
    elif '章' in name or '回' in name or '节' in name:
        return 'chapter'
    elif indent <= 2:
        return 'volume'
    else:
        return 'act'


def _has_keywords(text: str, keywords: list) -> bool:
    """检查文本是否包含任意关键词"""
    if not text:
        return False
    return any(kw in text for kw in keywords)


def _extract_locations_from_text(schema: MDSchema, text: str):
    """从列表/编号文本里抽取像地名的子项"""
    prefixes = ('1.', '2.', '3.', '4.', '5.', '6.', '7.', '-', '·', '*')
    for raw in text.split('\n'):
        line = raw.strip()
        if not line:
            continue
        if line.startswith(prefixes):
            name = line.lstrip('0123456789.·-* ').strip()
            if not name:
                continue
            schema.locations.append({
                'name': name,
                'description': '',
                'location_type': '地点'
            })


def _looks_like_location_subsection(name: str) -> bool:
    """启发式：子节名称是否像地点，而不是抽象设定"""
    if not name:
        return False
    location_hints = ['东京', '巴黎', '纽约', '上海', '伦敦', '开罗', '南极', '北京', '成都', '武汉', '广州', '深圳', '区域', '城市', '迷宫', '回廊', '净土', '契约', '禁区', '城']
    return any(h in name for h in location_hints)


def _extract_total_words(schema: MDSchema, text: str):
    """从预计字数中提取总字数，并反推每章字数"""
    match = re.search(r'(\d+(?:\.\d+)?)\s*万', text.replace(',', ''))
    if match:
        total_wan = float(match.group(1))
        total = int(total_wan * 10000)
        # 先尝试用已有目标章节数反推
        chapters = schema.target_chapters or 0
        # 如果当前为0，尝试从同一段文本里抽取“XXX章”
        if not chapters:
            chapter_match = re.search(r'(\d+)\s*章', text.replace(' ', ''))
            if chapter_match:
                chapters = int(chapter_match.group(1))
                schema.target_chapters = chapters
        if chapters:
            schema.target_words_per_chapter = max(1, total // chapters)
        return total
    # 纯整数
    match = re.search(r'\d+', text.replace(',', ''))
    if match:
        return int(match.group())
    return 0


def _extract_words_per_chapter(text: str) -> int:
    """从“3500字/章”或“3500字每章”中提取每章字数"""
    match = re.search(r'(\d+)\s*字\s*[\/／]?\s*章', text.replace(' ', ''))
    if match:
        return int(match.group(1))
    match = re.search(r'(\d+)\s*字\s*每\s*章', text.replace(' ', ''))
    if match:
        return int(match.group(1))
    return 0


def _extract_int(text: str) -> int:
    """从文本中提取整数"""
    match = re.search(r'\d+', text.replace(',', ''))
    return int(match.group()) if match else 0


# === 数据合并逻辑 ===

def detect_missing_parts(schema: MDSchema) -> Dict[str, Any]:
    """
    检测 MD 中存在和缺失的部分，返回合并建议
    
    Returns:
        {
            'present': [...],
            'missing': [...],
            'needs_completion': bool
        }
    """
    present = []
    missing = []
    
    if schema.premise:
        present.append('premise')
    else:
        missing.append('premise')
    
    if schema.characters or schema.protagonist:
        present.append('characters')
    else:
        missing.append('characters')
    
    if schema.world_settings:
        present.append('world_settings')
    else:
        missing.append('world_settings')
    
    if schema.locations:
        present.append('locations')
    else:
        missing.append('locations')
    
    if schema.narrative_style or schema.writing_style:
        present.append('style')
    else:
        missing.append('style')
    
    if schema.structure_tree:
        present.append('structure')
    else:
        missing.append('structure')
    
    return {
        'present': present,
        'missing': missing,
        'needs_completion': len(missing) > 0
    }


def schema_to_novel_params(schema: MDSchema, novel_id: str) -> Dict[str, Any]:
    """[已废弃] 请改用 schema.to_params(novel_id)。保留作为向后兼容垫片。"""
    return schema.to_params(novel_id)


if __name__ == '__main__':
    import sys
    path = sys.argv[1]
    text = Path(path).read_text(encoding='utf-8')
    result = parse_markdown_outline(text)
    print(f"Title: {result.title}")
    print(f"Author: {result.author}")
    print(f"Genre: {result.genre}")
    print(f"Chapters: {result.target_chapters}")
    print(f"Premise: {result.premise[:50]}..." if result.premise else "Premise: None")
    print(f"Characters: {len(result.characters)}")
    print(f"Locations: {len(result.locations)}")
    print(f"World settings: {len(result.world_settings)}")
    print(f"Missing: {result.missing_fields}")
