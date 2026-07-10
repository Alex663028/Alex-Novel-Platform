"""章节生成评测器 - 使用项目现有服务

评测 AutoNovelGenerationWorkflow 的章节生成质量。
"""

import re
import sys
from pathlib import Path
from typing import Any, Dict, List

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from .base_evaluator import (
    BaseEvaluator,
    EvaluationResult,
    create_metric,
)


class ChapterGenerationEvaluator(BaseEvaluator):
    """章节生成评测器 - 使用 AutoNovelGenerationWorkflow"""

    @property
    def name(self) -> str:
        return "chapter_generation"

    def get_test_cases(self) -> List[Dict[str, Any]]:
        """获取测试用例"""
        return [
            {
                "name": "玄幻开篇章节",
                "chapter_number": 1,
                "outline": "林尘在山中修炼时遇到受伤的苏婉儿，他本想置之不理，但看到苏婉儿身上的药王谷信物后，决定救她。在救治过程中，林尘体内的玉佩突然发出异光。",
                "context": "这是一个修仙世界，主角林尘是一个被家族遗弃的少年，在山中意外获得了一块神秘玉佩。",
                "expected_words": 2500,
                "expected_elements": ["对话", "感官描写", "人物互动", "悬念"],
            },
            {
                "name": "冲突高潮章节",
                "chapter_number": 10,
                "outline": "决战前夕，主角回顾过往，准备迎接生死之战。仇人出现，双方展开激烈对决，主角在危急关头突破境界。",
                "context": "仙侠世界，主角已修炼至金丹期，即将面对杀死师父的仇人。",
                "expected_words": 3000,
                "expected_elements": ["情绪起伏", "战斗描写", "对话张力", "突破"],
            },
        ]

    async def run_single_test(self, test_case: Dict[str, Any]) -> EvaluationResult:
        """运行单个测试"""
        import time
        start_time = time.time()

        try:
            # 直接使用LLM测试章节生成
            llm = self._get_service("llm")
            from domain.ai.value_objects.prompt import Prompt
            from domain.ai.services.llm_service import GenerationConfig

            system_prompt = """你是一位专业的小说作家，正在创作一部玄幻小说。
写作要求：
1. 章节长度：2000-3000字
2. 必须有对话和人物互动
3. 保持人物性格一致
4. 不要写章节标题"""

            user_prompt = f"""请根据以下大纲创作章节：

【背景】
{test_case.get('context', '')}

【本章大纲】
{test_case.get('outline', '')}

开始撰写："""

            prompt = Prompt(system=system_prompt, user=user_prompt)
            config = GenerationConfig(max_tokens=4096, temperature=0.85)

            result = await llm.generate(prompt, config)
            content = result.content
            duration = time.time() - start_time

            # 评测各项指标
            metrics = self._evaluate_content(content, test_case)
            success = all(m.passed for m in metrics)

            return EvaluationResult(
                test_name=test_case["name"],
                success=success,
                metrics=metrics,
                input_data={
                    "outline": test_case.get("outline", "")[:100],
                },
                output_data=content[:500] + "..." if len(content) > 500 else content,
                duration_seconds=duration,
                token_usage={
                    "input": result.token_usage.input_tokens,
                    "output": result.token_usage.output_tokens,
                },
            )

        except Exception as e:
            duration = time.time() - start_time
            return EvaluationResult(
                test_name=test_case["name"],
                success=False,
                error=str(e),
                duration_seconds=duration,
            )

    def _evaluate_content(self, content: str, test_case: Dict) -> List:
        """评测生成内容"""
        metrics = []

        # 1. 字数控制
        word_count = len(content)
        expected_words = test_case.get("expected_words", 2500)
        word_score = self._evaluate_word_count(word_count, expected_words)
        metrics.append(create_metric(
            name="字数控制",
            score=word_score,
            weight=1.5,
            details=f"实际字数: {word_count}, 目标: {expected_words}",
        ))

        # 2. 对话质量
        dialogue_score, dialogue_details = self._evaluate_dialogue(content)
        metrics.append(create_metric(
            name="对话质量",
            score=dialogue_score,
            weight=1.2,
            details=dialogue_details,
        ))

        # 3. 感官描写
        sensory_score, sensory_details = self._evaluate_sensory(content)
        metrics.append(create_metric(
            name="感官描写",
            score=sensory_score,
            weight=1.0,
            details=sensory_details,
        ))

        # 4. 情节连贯性
        coherence_score, coherence_details = self._evaluate_coherence(content, test_case)
        metrics.append(create_metric(
            name="情节连贯性",
            score=coherence_score,
            weight=1.3,
            details=coherence_details,
        ))

        # 5. 预期元素
        elements_score, elements_details = self._evaluate_expected_elements(
            content, test_case.get("expected_elements", [])
        )
        metrics.append(create_metric(
            name="预期元素",
            score=elements_score,
            weight=0.8,
            details=elements_details,
        ))

        return metrics

    def _evaluate_word_count(self, actual: int, expected: int) -> float:
        """评测字数控制"""
        diff_ratio = abs(actual - expected) / expected
        if diff_ratio <= 0.1:
            return 10.0
        elif diff_ratio <= 0.2:
            return 8.0
        elif diff_ratio <= 0.3:
            return 6.0
        elif diff_ratio <= 0.5:
            return 4.0
        else:
            return 2.0

    def _evaluate_dialogue(self, content: str) -> tuple:
        """评测对话质量"""
        dialogues = re.findall(r'[""「」『』](.+?)[""「」『』]', content)
        dialogue_count = len(dialogues)
        dialogue_chars = sum(len(d) for d in dialogues)
        dialogue_ratio = dialogue_chars / len(content) if content else 0

        score = 5.0
        details = []

        if dialogue_count >= 10:
            score += 1.5
            details.append(f"对话数量充足({dialogue_count}处)")
        elif dialogue_count >= 5:
            score += 0.5
            details.append(f"对话数量一般({dialogue_count}处)")
        else:
            details.append(f"对话数量不足({dialogue_count}处)")

        if 0.2 <= dialogue_ratio <= 0.5:
            score += 1.5
            details.append(f"对话比例合理({dialogue_ratio:.1%})")
        elif dialogue_ratio > 0.5:
            details.append(f"对话过多({dialogue_ratio:.1%})")
        else:
            details.append(f"对话过少({dialogue_ratio:.1%})")

        return min(score, 10.0), "; ".join(details)

    def _evaluate_sensory(self, content: str) -> tuple:
        """评测感官描写"""
        sensory_keywords = {
            "视觉": ["看到", "看见", "眼前", "闪过", "光芒", "轮廓", "身影"],
            "听觉": ["听到", "声音", "响声", "低语", "呐喊", "脚步"],
            "触觉": ["感觉到", "触感", "温度", "冰凉", "灼热", "刺痛"],
            "嗅觉": ["闻到", "气味", "香味", "血腥"],
            "情绪": ["心中", "感觉", "涌起", "震撼", "愤怒", "喜悦"],
        }

        scores = {}
        for sense, keywords in sensory_keywords.items():
            count = sum(1 for kw in keywords if kw in content)
            scores[sense] = min(count * 0.5, 2.0)

        total_score = sum(scores.values())
        used_senses = [s for s, sc in scores.items() if sc > 0]

        details = f"涉及的感官: {', '.join(used_senses) if used_senses else '无明显感官描写'}"
        return min(total_score + 3.0, 10.0), details

    def _evaluate_coherence(self, content: str, test_case: Dict) -> tuple:
        """评测情节连贯性"""
        outline = test_case.get("outline", "")
        score = 7.0
        details = []

        outline_keywords = set(outline.replace("，", " ").replace("。", " ").split())
        outline_keywords = {k for k in outline_keywords if len(k) >= 2}

        covered = sum(1 for kw in outline_keywords if kw in content)
        coverage = covered / len(outline_keywords) if outline_keywords else 0

        if coverage >= 0.7:
            score += 1.5
            details.append(f"大纲要点覆盖良好({coverage:.0%})")
        elif coverage >= 0.5:
            score += 0.5
            details.append(f"大纲要点覆盖一般({coverage:.0%})")
        else:
            score -= 1.0
            details.append(f"大纲要点覆盖不足({coverage:.0%})")

        transition_words = ["然而", "但是", "于是", "随后", "接着", "这时", "突然"]
        transitions = sum(1 for tw in transition_words if tw in content)
        if transitions >= 2:
            score += 0.5
            details.append("段落衔接流畅")

        return min(score, 10.0), "; ".join(details) if details else "情节基本连贯"

    def _evaluate_expected_elements(self, content: str, elements: List[str]) -> tuple:
        """评测预期元素"""
        if not elements:
            return 8.0, "无特定元素要求"

        element_checks = {
            "对话": lambda c: len(re.findall(r'[""「」『』]', c)) >= 2,
            "感官描写": lambda c: any(kw in c for kw in ["看到", "听到", "感觉到", "闻到"]),
            "人物互动": lambda c: any(kw in c for kw in ["看着", "对视", "握手", "拥抱", "点头"]),
            "悬念": lambda c: any(kw in c for kw in ["疑惑", "不解", "神秘", "突然", "竟然"]),
            "情绪起伏": lambda c: any(kw in c for kw in ["激动", "愤怒", "悲伤", "喜悦", "震撼"]),
            "战斗描写": lambda c: any(kw in c for kw in ["攻击", "防御", "招式", "剑气", "拳风"]),
            "突破": lambda c: any(kw in c for kw in ["突破", "境界", "提升", "蜕变", "觉醒"]),
            "对话张力": lambda c: "对话" in c and any(kw in c for kw in ["冷笑", "讽刺", "怒道", "厉声"]),
        }

        found = 0
        for element in elements:
            checker = element_checks.get(element)
            if checker and checker(content):
                found += 1

        score = 5.0 + (found / len(elements)) * 5.0
        details = f"覆盖元素: {found}/{len(elements)}"

        return score, details


async def main():
    """运行章节生成评测"""
    evaluator = ChapterGenerationEvaluator()
    report = await evaluator.run_all_tests()

    output_dir = Path(__file__).parent / "results"
    output_path = evaluator.save_results(output_dir)

    print(f"\n评测报告已保存: {output_path}")
    print(f"平均分: {report.average_score:.2f}")
    print(f"通过率: {report.passed_tests}/{report.total_tests}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
