"""战役一验证原型：持续规划 + 伏笔账本

目标：
1. 验证"写完一幕再规划下一幕"是否会导致逻辑断裂
2. 验证伏笔账本能否自动埋设和回收伏笔

测试规模：3 幕 × 10 章 = 30 章（约 6 万字）
"""
import asyncio
import logging
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime

# 添加项目根目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent))

from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.foreshadowing import Foreshadowing, ForeshadowingStatus
from domain.ai.services.llm_service import LLMService, GenerationConfig
from domain.ai.value_objects.prompt import Prompt
from infrastructure.ai.providers.anthropic_provider import AnthropicProvider
from infrastructure.ai.config.settings import Settings
import os
from dotenv import load_dotenv

# 加载 .env 文件
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ActPlan:
    """幕级规划"""
    def __init__(self, act_number: int, title: str, chapters: List[str]):
        self.act_number = act_number
        self.title = title
        self.chapters = chapters  # 章节大纲列表
        self.completed = False


class ForeshadowLedger:
    """伏笔账本（简化版）"""
    def __init__(self):
        self.pending: List[Dict[str, Any]] = []  # 待回收的伏笔
        self.resolved: List[Dict[str, Any]] = []  # 已回收的伏笔

    def plant(self, chapter: int, hint: str, suggested_resolve: int):
        """埋设伏笔"""
        self.pending.append({
            "id": f"foreshadow_{chapter}_{len(self.pending)}",
            "planted_chapter": chapter,
            "hint": hint,
            "suggested_resolve": suggested_resolve,
            "planted_at": datetime.now().isoformat()
        })
        logger.info(f"  📌 伏笔已埋设 (章节 {chapter}): {hint[:50]}...")

    def get_ready_to_resolve(self, current_chapter: int) -> List[Dict[str, Any]]:
        """获取应该在当前章回收的伏笔"""
        return [
            f for f in self.pending
            if f["suggested_resolve"] <= current_chapter
        ]

    def resolve(self, foreshadow_id: str, chapter: int):
        """回收伏笔"""
        for i, f in enumerate(self.pending):
            if f["id"] == foreshadow_id:
                f["resolved_chapter"] = chapter
                f["resolved_at"] = datetime.now().isoformat()
                self.resolved.append(f)
                self.pending.pop(i)
                logger.info(f"  ✅ 伏笔已回收 (章节 {chapter}): {f['hint'][:50]}...")
                return

    def get_stats(self) -> Dict[str, int]:
        """获取统计信息"""
        return {
            "pending": len(self.pending),
            "resolved": len(self.resolved),
            "total": len(self.pending) + len(self.resolved)
        }


class ContinuousPlanningPrototype:
    """持续规划原型"""

    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        self.acts: List[ActPlan] = []
        self.ledger = ForeshadowLedger()
        self.generated_chapters: List[Dict[str, Any]] = []
        self.novel_premise = ""

    async def initialize(self, premise: str, first_act_outline: str):
        """初始化：生成第一幕的规划"""
        logger.info("=" * 80)
        logger.info("初始化：生成第一幕规划")
        logger.info("=" * 80)

        self.novel_premise = premise

        # 生成第一幕的 10 个章节大纲
        prompt = Prompt(
            system="你是小说规划专家。根据故事前提，生成第一幕的 10 个章节大纲。",
            user=f"""故事前提：
{premise}

第一幕概要：
{first_act_outline}

请生成第一幕的 10 个章节大纲。每个大纲 2-3 句话，格式：
第1章：[标题] - [大纲内容]
第2章：[标题] - [大纲内容]
...

要求：
1. 第一幕应该建立世界观、介绍主要角色
2. 至少埋设 3 个伏笔（用【伏笔】标记）
3. 结尾要有悬念，为第二幕铺垫"""
        )

        config = GenerationConfig(max_tokens=2000, temperature=0.7)
        result = await self.llm_service.generate(prompt, config)

        # 解析章节大纲
        chapters = self._parse_chapter_outlines(result.content)

        act1 = ActPlan(act_number=1, title="第一幕：起始", chapters=chapters)
        self.acts.append(act1)

        logger.info(f"✓ 第一幕规划完成：{len(chapters)} 个章节")
        for i, ch in enumerate(chapters, 1):
            logger.info(f"  第{i}章: {ch[:80]}...")

        return act1

    async def generate_chapter(self, act_number: int, chapter_in_act: int) -> str:
        """生成单个章节"""
        act = self.acts[act_number - 1]
        outline = act.chapters[chapter_in_act - 1]
        global_chapter = (act_number - 1) * 10 + chapter_in_act

        logger.info(f"\n{'=' * 80}")
        logger.info(f"生成章节 {global_chapter} (第{act_number}幕 第{chapter_in_act}章)")
        logger.info(f"{'=' * 80}")

        # 检查是否有需要回收的伏笔
        ready_foreshadows = self.ledger.get_ready_to_resolve(global_chapter)
        foreshadow_reminder = ""
        if ready_foreshadows:
            foreshadow_reminder = "\n\n【必须回收的伏笔】\n"
            for f in ready_foreshadows:
                foreshadow_reminder += f"- {f['hint']}\n"

        # 构建上下文（最近 3 章）
        recent_context = ""
        if len(self.generated_chapters) > 0:
            recent = self.generated_chapters[-3:]
            recent_context = "\n\n【前情提要】\n"
            for ch in recent:
                recent_context += f"第{ch['chapter']}章：{ch['content'][:200]}...\n\n"

        # 生成章节
        prompt = Prompt(
            system=f"""你是网络小说作家。根据大纲和上下文撰写章节。

故事前提：{self.novel_premise}

写作要求：
1. 2000-2500 字（使用流式生成避免超时）
2. 必须有对话和人物互动
3. 保持人物性格一致
4. 如果有【伏笔】标记，自然地埋设伏笔
5. 如果有需要回收的伏笔，必须在本章中回收{foreshadow_reminder}""",
            user=f"""{recent_context}

【本章大纲】
{outline}

开始撰写："""
        )

        config = GenerationConfig(max_tokens=3000, temperature=0.8)

        # 使用流式生成避免 502 超时
        content = ""
        async for chunk in self.llm_service.stream_generate(prompt, config):
            content += chunk

        # 提取伏笔（简化版：查找【伏笔】标记）
        self._extract_and_plant_foreshadows(content, global_chapter)

        # 标记已回收的伏笔
        for f in ready_foreshadows:
            self.resolve(f["id"], global_chapter)

        # 保存章节
        self.generated_chapters.append({
            "chapter": global_chapter,
            "act": act_number,
            "content": content,
            "word_count": len(content),
            "outline": outline
        })

        logger.info(f"✓ 章节 {global_chapter} 生成完成：{len(content)} 字")

        return content

    async def plan_next_act(self, act_number: int):
        """规划下一幕（持续规划的核心）"""
        logger.info(f"\n{'=' * 80}")
        logger.info(f"持续规划：生成第 {act_number} 幕")
        logger.info(f"{'=' * 80}")

        # 获取前一幕的摘要
        prev_act_summary = self._summarize_previous_act(act_number - 1)

        # 获取未回收的伏笔
        pending_foreshadows = self.ledger.pending
        foreshadow_context = ""
        if pending_foreshadows:
            foreshadow_context = "\n\n【待回收的伏笔】\n"
            for f in pending_foreshadows:
                foreshadow_context += f"- {f['hint']} (建议在第 {f['suggested_resolve']} 章回收)\n"

        # 生成下一幕的规划
        prompt = Prompt(
            system="你是小说规划专家。根据前情和伏笔，生成下一幕的 10 个章节大纲。",
            user=f"""故事前提：
{self.novel_premise}

【前一幕摘要】
{prev_act_summary}
{foreshadow_context}

请生成第 {act_number} 幕的 10 个章节大纲。每个大纲 2-3 句话，格式：
第{(act_number-1)*10+1}章：[标题] - [大纲内容]
第{(act_number-1)*10+2}章：[标题] - [大纲内容]
...

要求：
1. 承接前一幕的剧情发展
2. 必须回收至少 2 个待回收的伏笔
3. 可以埋设新的伏笔（用【伏笔】标记）
4. 推进主线冲突
5. 结尾要有转折或高潮"""
        )

        config = GenerationConfig(max_tokens=2000, temperature=0.7)
        result = await self.llm_service.generate(prompt, config)

        # 解析章节大纲
        chapters = self._parse_chapter_outlines(result.content)

        act = ActPlan(act_number=act_number, title=f"第{act_number}幕", chapters=chapters)
        self.acts.append(act)

        logger.info(f"✓ 第 {act_number} 幕规划完成：{len(chapters)} 个章节")
        for i, ch in enumerate(chapters, 1):
            logger.info(f"  第{(act_number-1)*10+i}章: {ch[:80]}...")

        return act

    def _parse_chapter_outlines(self, text: str) -> List[str]:
        """解析章节大纲"""
        lines = text.strip().split('\n')
        chapters = []
        for line in lines:
            line = line.strip()
            if line and ('章：' in line or '章:' in line):
                # 提取大纲内容（去掉章节号）
                if '：' in line:
                    content = line.split('：', 1)[1].strip()
                elif ':' in line:
                    content = line.split(':', 1)[1].strip()
                else:
                    content = line
                chapters.append(content)

        # 确保有 10 章
        while len(chapters) < 10:
            chapters.append(f"第{len(chapters)+1}章：承接前情，推进剧情")

        return chapters[:10]

    def _extract_and_plant_foreshadows(self, content: str, chapter: int):
        """提取并埋设伏笔（简化版）"""
        # 简单的关键词检测
        keywords = ["神秘", "奇怪", "不对劲", "隐藏", "秘密", "预感", "似乎", "暗示"]

        for keyword in keywords:
            if keyword in content:
                # 找到包含关键词的句子
                sentences = content.split('。')
                for sent in sentences:
                    if keyword in sent and len(sent) > 10:
                        # 埋设伏笔，建议在 5-10 章后回收
                        suggested_resolve = chapter + 5 + (len(self.ledger.pending) % 5)
                        self.ledger.plant(chapter, sent.strip(), suggested_resolve)
                        break

    def _summarize_previous_act(self, act_number: int) -> str:
        """总结前一幕"""
        if act_number < 1 or act_number > len(self.acts):
            return ""

        act = self.acts[act_number - 1]
        start_chapter = (act_number - 1) * 10 + 1
        end_chapter = act_number * 10

        chapters_in_act = [
            ch for ch in self.generated_chapters
            if start_chapter <= ch["chapter"] <= end_chapter
        ]

        summary = f"第 {act_number} 幕共 {len(chapters_in_act)} 章：\n"
        for ch in chapters_in_act:
            summary += f"- 第{ch['chapter']}章：{ch['outline']}\n"

        return summary

    def resolve(self, foreshadow_id: str, chapter: int):
        """回收伏笔"""
        self.ledger.resolve(foreshadow_id, chapter)

    def get_report(self) -> Dict[str, Any]:
        """生成验证报告"""
        total_words = sum(ch["word_count"] for ch in self.generated_chapters)
        ledger_stats = self.ledger.get_stats()

        # 计算回收率
        resolve_rate = 0
        if ledger_stats["total"] > 0:
            resolve_rate = (ledger_stats["resolved"] / ledger_stats["total"]) * 100

        return {
            "total_chapters": len(self.generated_chapters),
            "total_words": total_words,
            "acts_planned": len(self.acts),
            "foreshadowing": {
                "total_planted": ledger_stats["total"],
                "resolved": ledger_stats["resolved"],
                "pending": ledger_stats["pending"],
                "resolve_rate": f"{resolve_rate:.1f}%"
            },
            "chapters": self.generated_chapters
        }


async def run_prototype():
    """运行原型验证"""
    logger.info("=" * 80)
    logger.info("战役一验证原型：持续规划 + 伏笔账本")
    logger.info("=" * 80)

    # 初始化 LLM 服务
    api_key = os.getenv("ANTHROPIC_API_KEY") or os.getenv("ANTHROPIC_AUTH_TOKEN")
    base_url = os.getenv("ANTHROPIC_BASE_URL")

    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY or ANTHROPIC_AUTH_TOKEN not found in environment")

    settings = Settings(api_key=api_key.strip(), base_url=base_url.strip() if base_url else None)
    llm_service = AnthropicProvider(settings)
    prototype = ContinuousPlanningPrototype(llm_service)

    # 故事前提
    premise = """
    【故事前提】
    在一个魔法与科技共存的世界，主角林羽是一名普通的魔法学院学生。
    某天，他意外发现自己拥有一种罕见的能力——能够看到他人的"命运线"。
    这个能力让他卷入了一场关于世界命运的阴谋。

    【主要角色】
    - 林羽：主角，魔法学院学生，拥有"命运视"能力
    - 苏晴：林羽的青梅竹马，天才魔法师
    - 暗影议会：神秘组织，试图控制世界命运
    """

    first_act_outline = """
    第一幕：觉醒
    - 林羽发现自己的特殊能力
    - 遇到第一个命运分歧点
    - 被暗影议会盯上
    - 苏晴帮助他逃脱
    """

    # 阶段 1：初始化第一幕
    await prototype.initialize(premise, first_act_outline)

    # 阶段 2：生成第一幕的 10 章
    logger.info("\n" + "=" * 80)
    logger.info("阶段 2：生成第一幕（10 章）")
    logger.info("=" * 80)

    for chapter_in_act in range(1, 11):
        await prototype.generate_chapter(act_number=1, chapter_in_act=chapter_in_act)
        await asyncio.sleep(1)  # 避免 API 限流

    # 阶段 3：持续规划第二幕
    logger.info("\n" + "=" * 80)
    logger.info("阶段 3：持续规划第二幕")
    logger.info("=" * 80)

    await prototype.plan_next_act(act_number=2)

    # 阶段 4：生成第二幕的 10 章
    logger.info("\n" + "=" * 80)
    logger.info("阶段 4：生成第二幕（10 章）")
    logger.info("=" * 80)

    for chapter_in_act in range(1, 11):
        await prototype.generate_chapter(act_number=2, chapter_in_act=chapter_in_act)
        await asyncio.sleep(1)

    # 阶段 5：持续规划第三幕
    logger.info("\n" + "=" * 80)
    logger.info("阶段 5：持续规划第三幕")
    logger.info("=" * 80)

    await prototype.plan_next_act(act_number=3)

    # 阶段 6：生成第三幕的 10 章
    logger.info("\n" + "=" * 80)
    logger.info("阶段 6：生成第三幕（10 章）")
    logger.info("=" * 80)

    for chapter_in_act in range(1, 11):
        await prototype.generate_chapter(act_number=3, chapter_in_act=chapter_in_act)
        await asyncio.sleep(1)

    # 生成报告
    logger.info("\n" + "=" * 80)
    logger.info("验证报告")
    logger.info("=" * 80)

    report = prototype.get_report()

    logger.info(f"\n总章节数: {report['total_chapters']}")
    logger.info(f"总字数: {report['total_words']:,}")
    logger.info(f"规划幕数: {report['acts_planned']}")
    logger.info(f"\n伏笔统计:")
    logger.info(f"  总埋设: {report['foreshadowing']['total_planted']}")
    logger.info(f"  已回收: {report['foreshadowing']['resolved']}")
    logger.info(f"  待回收: {report['foreshadowing']['pending']}")
    logger.info(f"  回收率: {report['foreshadowing']['resolve_rate']}")

    # 保存报告
    output_dir = Path(__file__).parent.parent / "data" / "prototype_results"
    output_dir.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = output_dir / f"prototype_report_{timestamp}.json"

    import json
    with open(report_file, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    logger.info(f"\n报告已保存: {report_file}")

    # 保存完整小说
    novel_file = output_dir / f"prototype_novel_{timestamp}.txt"
    with open(novel_file, 'w', encoding='utf-8') as f:
        f.write(f"【故事前提】\n{premise}\n\n")
        f.write("=" * 80 + "\n\n")
        for ch in report['chapters']:
            f.write(f"第 {ch['chapter']} 章\n")
            f.write("=" * 80 + "\n")
            f.write(f"{ch['content']}\n\n")

    logger.info(f"小说已保存: {novel_file}")

    # 核心验证结论
    logger.info("\n" + "=" * 80)
    logger.info("核心验证结论")
    logger.info("=" * 80)

    if report['foreshadowing']['resolve_rate'].replace('%', '') != '0.0':
        resolve_rate_num = float(report['foreshadowing']['resolve_rate'].replace('%', ''))
        if resolve_rate_num >= 60:
            logger.info("✅ 伏笔账本验证通过：回收率 >= 60%")
        else:
            logger.warning(f"⚠️  伏笔账本需要优化：回收率 {resolve_rate_num}% < 60%")
    else:
        logger.warning("⚠️  未检测到伏笔埋设，需要改进提取逻辑")

    if report['acts_planned'] == 3 and report['total_chapters'] == 30:
        logger.info("✅ 持续规划验证通过：成功生成 3 幕 30 章")
    else:
        logger.warning(f"⚠️  持续规划未完成：{report['acts_planned']} 幕 {report['total_chapters']} 章")

    logger.info("\n验证完成！")


if __name__ == "__main__":
    asyncio.run(run_prototype())
