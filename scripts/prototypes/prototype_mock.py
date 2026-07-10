"""战役一验证原型（模拟版）：零成本架构流程验证

目标：
1. 验证状态机流转逻辑（planning → writing → continue）
2. 验证幕级跨越是否平滑
3. 验证异步扇出机制

特点：
- 不调用真实 LLM（使用模拟延迟）
- 不花费 API 费用
- 5 分钟内完成 30 章流程验证
"""
import asyncio
import logging
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class MockForeshadowLedger:
    """模拟伏笔账本"""
    def __init__(self):
        self.planted = []
        self.resolved = []

        # 手动硬塞 5 个伏笔用于验证
        self.planted = [
            {"id": "f1", "chapter": 3, "hint": "一把刻着'林'字的断剑掉进了下水道", "resolve_at": 12},
            {"id": "f2", "chapter": 5, "hint": "神秘老人留下的半张地图", "resolve_at": 15},
            {"id": "f3", "chapter": 8, "hint": "主角发现自己的影子有时会消失", "resolve_at": 20},
            {"id": "f4", "chapter": 11, "hint": "城主府地下传来奇怪的敲击声", "resolve_at": 25},
            {"id": "f5", "chapter": 14, "hint": "苏晴的眼睛在月光下变成了金色", "resolve_at": 28},
        ]

    def get_ready_to_resolve(self, chapter: int) -> List[Dict]:
        """获取应该在当前章回收的伏笔"""
        ready = [f for f in self.planted if f["resolve_at"] == chapter]
        return ready

    def resolve(self, foreshadow_id: str, chapter: int):
        """回收伏笔"""
        for f in self.planted:
            if f["id"] == foreshadow_id:
                f["resolved_chapter"] = chapter
                self.resolved.append(f)
                self.planted.remove(f)
                logger.info(f"  ✅ 伏笔已回收 (章节 {chapter}): {f['hint']}")
                return


class AutoPilotPrototype:
    """自动驾驶原型（模拟版）"""

    def __init__(self, novel_id: str, core_idea: str):
        self.novel_id = novel_id
        self.core_idea = core_idea
        self.current_act_id = None
        self.chapter_count = 0
        self.target_chapters = 30
        self.foreshadow_ledger = MockForeshadowLedger()
        self.generated_chapters = []

        # 状态机
        self.stage = "planning"  # planning → writing → continue

    async def run(self):
        logger.info("=" * 80)
        logger.info(f"🚀 启动全托管验证原型（模拟版）：目标 {self.target_chapters} 章")
        logger.info("=" * 80)

        # 1. 战前准备：生成宏观骨架
        logger.info("\n阶段 1: 建立初始宏观骨架 (Macro Plan)")
        self.stage = "planning"
        await self._generate_macro_plan()

        # 2. 进入主状态机死循环
        while self.chapter_count < self.target_chapters:
            self.stage = "writing"
            await self._execute_act(self.current_act_id)

            if self.chapter_count >= self.target_chapters:
                break

            # 3. 动态跨幕推进
            self.stage = "continue"
            logger.info("\n" + "=" * 80)
            logger.info(">>> 当前幕结束，触发 continue 机制，生成下一幕纲要 <<<")
            logger.info("=" * 80)
            await self._create_next_act()

        # 4. 生成验证报告
        await self._generate_report()

        logger.info("\n" + "=" * 80)
        logger.info("✅ 30 章验证生成完毕")
        logger.info("=" * 80)

    async def _generate_macro_plan(self):
        """生成宏观规划（模拟）"""
        logger.info("  → 调用 PlanningService.generate_macro_plan()")
        await asyncio.sleep(0.5)  # 模拟 LLM 延迟

        self.current_act_id = "act_001"
        logger.info(f"  ✓ 宏观骨架已生成：3 幕，每幕 10 章")
        logger.info(f"  ✓ 当前幕: {self.current_act_id}")

    async def _execute_act(self, act_id: str):
        """执行一幕（生成 10 章）"""
        logger.info(f"\n🎬 开始执行幕: {act_id}")

        # 生成本幕的章节列表
        logger.info("  → 调用 PlanningService.generate_act_chapters()")
        await asyncio.sleep(0.3)

        act_number = int(act_id.split("_")[1])
        start_chapter = (act_number - 1) * 10 + 1

        for i in range(10):
            if self.chapter_count >= self.target_chapters:
                break

            self.chapter_count += 1
            chapter_num = start_chapter + i

            logger.info(f"\n✍️  正在生成: 第 {chapter_num} 章")

            # A. 检查伏笔
            ready_foreshadows = self.foreshadow_ledger.get_ready_to_resolve(chapter_num)
            if ready_foreshadows:
                logger.info(f"  📌 检测到 {len(ready_foreshadows)} 个待回收伏笔")

            # B. 拼装上下文
            logger.info("  → 调用 ContextBuilder.build_structured_context()")
            await asyncio.sleep(0.2)
            logger.info("  ✓ 上下文已构建: 35K tokens")

            # C. 生成节拍表
            logger.info("  → 调用 BeatSheetService.generate()")
            await asyncio.sleep(0.2)
            logger.info("  ✓ 节拍表已生成: 5 个动作")

            # D. 生成正文
            logger.info("  → 调用 GenerationService.generate_chapter_stream()")
            await asyncio.sleep(0.5)
            content = f"[模拟正文内容 - 第 {chapter_num} 章，约 2500 字]"
            logger.info(f"  ✓ 正文已生成: 2500 字")

            # E. 回收伏笔
            for f in ready_foreshadows:
                self.foreshadow_ledger.resolve(f["id"], chapter_num)

            # F. 异步扇出
            asyncio.create_task(self._async_fan_out(chapter_num, content))

            # 保存章节
            self.generated_chapters.append({
                "chapter": chapter_num,
                "act": act_id,
                "content": content,
                "word_count": 2500
            })

    async def _async_fan_out(self, chapter_num: int, content: str):
        """异步扇出：后台处理（模拟）"""
        logger.info(f"  🔄 [后台] 章节 {chapter_num} 异步扇出开始")

        # 模拟各种后台任务
        await asyncio.sleep(0.1)
        # logger.info(f"  🔄 [后台] 提取伏笔...")
        # logger.info(f"  🔄 [后台] 计算文风漂移...")
        # logger.info(f"  🔄 [后台] 更新知识图谱...")

        logger.info(f"  ✓ [后台] 章节 {chapter_num} 异步扇出完成")

    async def _create_next_act(self):
        """创建下一幕（持续规划）"""
        act_number = int(self.current_act_id.split("_")[1]) + 1
        next_act_id = f"act_{act_number:03d}"

        logger.info(f"  → 调用 PlanningService.create_next_act()")
        logger.info(f"  → 输入: 前一幕摘要 + 待回收伏笔")
        await asyncio.sleep(0.5)

        self.current_act_id = next_act_id
        logger.info(f"  ✓ 下一幕已规划: {next_act_id}")

    async def _generate_report(self):
        """生成验证报告"""
        logger.info("\n" + "=" * 80)
        logger.info("验证报告")
        logger.info("=" * 80)

        total_words = sum(ch["word_count"] for ch in self.generated_chapters)

        # 伏笔统计
        total_planted = len(self.foreshadow_ledger.planted) + len(self.foreshadow_ledger.resolved)
        resolved = len(self.foreshadow_ledger.resolved)
        pending = len(self.foreshadow_ledger.planted)
        resolve_rate = (resolved / total_planted * 100) if total_planted > 0 else 0

        logger.info(f"\n总章节数: {len(self.generated_chapters)}")
        logger.info(f"总字数: {total_words:,}")
        logger.info(f"\n伏笔统计:")
        logger.info(f"  总埋设: {total_planted}")
        logger.info(f"  已回收: {resolved}")
        logger.info(f"  待回收: {pending}")
        logger.info(f"  回收率: {resolve_rate:.1f}%")

        # 检查断层
        logger.info(f"\n断层检查:")
        for i in range(1, 4):
            boundary = i * 10
            if boundary <= len(self.generated_chapters):
                logger.info(f"  第 {boundary} 章 → 第 {boundary + 1} 章: 幕级跨越")

        # 保存报告
        output_dir = Path(__file__).parent.parent / "data" / "prototype_results"
        output_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = output_dir / f"mock_prototype_report_{timestamp}.json"

        report = {
            "mode": "mock",
            "total_chapters": len(self.generated_chapters),
            "total_words": total_words,
            "foreshadowing": {
                "total_planted": total_planted,
                "resolved": resolved,
                "pending": pending,
                "resolve_rate": f"{resolve_rate:.1f}%"
            },
            "chapters": self.generated_chapters,
            "pending_foreshadows": self.foreshadow_ledger.planted,
            "resolved_foreshadows": self.foreshadow_ledger.resolved
        }

        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        logger.info(f"\n报告已保存: {report_file}")

        # 验证结论
        logger.info("\n" + "=" * 80)
        logger.info("核心验证结论")
        logger.info("=" * 80)

        if resolve_rate >= 60:
            logger.info("✅ 伏笔账本验证通过：回收率 >= 60%")
        else:
            logger.warning(f"⚠️  伏笔账本需要优化：回收率 {resolve_rate:.1f}% < 60%")

        if len(self.generated_chapters) == 30:
            logger.info("✅ 持续规划验证通过：成功生成 30 章")
        else:
            logger.warning(f"⚠️  持续规划未完成：{len(self.generated_chapters)} 章")

        logger.info("\n架构流程验证完成！可以进入真实 LLM 测试。")


async def main():
    prototype = AutoPilotPrototype(
        novel_id="test_mock_001",
        core_idea="主角穿越到赛博朋克修仙界，发现所有的系统本质上都是夺舍程序..."
    )
    await prototype.run()


if __name__ == "__main__":
    asyncio.run(main())
