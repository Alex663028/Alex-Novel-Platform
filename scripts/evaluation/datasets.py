"""评测数据集

包含各种测试用例，用于评测AI功能。
"""

# 章节生成测试数据
CHAPTER_TEST_CASES = [
    {
        "name": "玄幻开篇",
        "outline": "林尘在山中修炼时遇到受伤的苏婉儿，决定救她。在救治过程中，玉佩发出异光。",
        "context": "修仙世界，主角是被家族遗弃的少年，有神秘玉佩。",
        "expected_words": 2500,
    },
    {
        "name": "战斗场景",
        "outline": "林尘与陈傲天展开激烈对决，在劣势中突破，以一招险胜。",
        "context": "仙侠世界，主角金丹期对决元婴期高手。",
        "expected_words": 3000,
    },
    {
        "name": "都市日常",
        "outline": "张明和李薇加班时独处，两人聊起人生经历，产生微妙情愫。",
        "context": "都市职场，主角是程序员。",
        "expected_words": 2500,
    },
    {
        "name": "悬疑推理",
        "outline": "陆远发现关键线索，意识到被监视，决定设下陷阱引出幕后黑手。",
        "context": "现代悬疑，专门调查悬案的组织。",
        "expected_words": 2800,
    },
]

# 宏观规划测试数据
MACRO_PLANNING_CASES = [
    {
        "name": "玄幻长篇",
        "target_chapters": 300,
        "worldview": "修仙世界，穿越者主角，神秘金手指",
        "characters": [
            {"name": "林尘", "role": "主角"},
            {"name": "苏婉儿", "role": "女主"},
            {"name": "陈傲天", "role": "反派"},
        ],
    },
    {
        "name": "都市短篇",
        "target_chapters": 50,
        "worldview": "现代都市，程序员获得预测未来系统",
        "characters": [
            {"name": "张明", "role": "主角"},
            {"name": "李薇", "role": "女主"},
        ],
    },
]

# 节拍表测试数据
BEAT_SHEET_CASES = [
    {
        "name": "对决章节",
        "outline": "林尘与陈傲天在宗门大比中相遇，展开激烈对决。",
        "expected_scenes": 4,
    },
    {
        "name": "日常章节",
        "outline": "张明和李薇加班时独处，产生微妙情愫。",
        "expected_scenes": 3,
    },
]

# 知识提取测试数据
KNOWLEDGE_CASES = [
    {
        "name": "玄幻设定",
        "title": "逆天仙途",
        "settings": "修仙世界，主角穿越者，玉佩金手指，炼气筑基金丹元婴",
        "expected_entities": ["林尘", "玉佩"],
    },
    {
        "name": "都市设定",
        "title": "程序员的逆袭",
        "settings": "现代都市，程序员获得预测系统",
        "expected_entities": ["张明", "系统"],
    },
]

# 一致性检测测试数据
CONSISTENCY_CASES = [
    {
        "name": "性格违背",
        "content": "冷静的林尘突然失控冲了上去。",
        "setting": "林尘：性格冷静理智",
        "expected_issues": 1,
    },
    {
        "name": "设定违背",
        "content": "筑基期林尘御剑飞行，一剑斩杀元婴期高手。",
        "setting": "筑基期无法飞行，境界差距巨大",
        "expected_issues": 2,
    },
    {
        "name": "正常文本",
        "content": "林尘冷静分析局势，制定周密计划。",
        "setting": "林尘：性格冷静理智",
        "expected_issues": 0,
    },
]

# 提示词模板评测数据
PROMPT_TEMPLATES = {
    "chapter_basic": {
        "system": "你是一位专业的小说作家。",
        "user_template": "根据大纲创作：{outline}",
    },
    "chapter_enhanced": {
        "system": "你是资深网文作家。要求：1. 2000-3000字 2. 有对话互动 3. 感官描写",
        "user_template": "背景：{context}\n大纲：{outline}",
    },
    "macro_planning": {
        "system": "你是顶级网文主编，精通商业节奏。设计完整叙事骨架。",
        "user_template": "目标章节：{target}\n世界观：{worldview}",
    },
}


def get_all_test_cases():
    """获取所有测试用例"""
    return {
        "chapter": CHAPTER_TEST_CASES,
        "macro_planning": MACRO_PLANNING_CASES,
        "beat_sheet": BEAT_SHEET_CASES,
        "knowledge": KNOWLEDGE_CASES,
        "consistency": CONSISTENCY_CASES,
    }
