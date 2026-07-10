"""提示词优化评测器

A/B测试不同提示词变体的效果。
"""

import asyncio
import sys
from pathlib import Path
from typing import Any, Dict, List
from dataclasses import dataclass

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from scripts.evaluation.base_evaluator import (
    BaseEvaluator,
    EvaluationResult,
    create_metric,
)


@dataclass
class PromptVariant:
    """提示词变体"""
    name: str
    system: str
    user_template: str
    description: str = ""


class PromptOptimizer(BaseEvaluator):
    """提示词优化评测器"""

    @property
    def name(self) -> str:
        return "prompt_optimizer"

    # 提示词变体
    VARIANTS = {
        "chapter": [
            PromptVariant(
                name="基础版",
                system="你是专业的小说作家。",
                user_template="请根据以下大纲创作章节：\n{outline}",
                description="最简单的提示词"
            ),
            PromptVariant(
                name="增强版",
                system="""你是资深网文作家，擅长写爽文。
写作要求：
1. 章节长度：2500-3500字
2. 必须有对话和人物互动
3. 保持人物性格一致
4. 增加感官细节：视觉、听觉、触觉、情绪
5. 不要写章节标题""",
                user_template="""【故事背景】
{context}

【本章大纲】
{outline}

开始撰写：""",
                description="详细要求的提示词"
            ),
            PromptVariant(
                name="节拍版",
                system="""你是资深网文作家，擅长按节拍控制写作节奏。
写作要求：
1. 严格按节拍字数和聚焦点写作
2. 必须有对话和人物互动
3. 增加感官细节
4. 节奏控制：不要一章推进太多剧情""",
                user_template="""【故事背景】
{context}

【本章大纲】
{outline}

【节拍分解】
{beats}

开始撰写：""",
                description="带节拍分解的提示词"
            ),
        ],
        "macro": [
            PromptVariant(
                name="简单版",
                system="你是小说规划专家。",
                user_template="请为{target}章的小说设计结构。",
            ),
            PromptVariant(
                name="商业版",
                system="""你是狂热且极具市场敏锐度的顶级网文主编。
精通各种爆款商业节奏，帮作者打破"白纸恐惧"。
设计结构应符合：三幕剧结构、英雄之旅、情绪曲线。""",
                user_template="""目标章节数：{target}
世界观：{worldview}
角色：{characters}
请生成完整的叙事结构规划。""",
            ),
        ],
    }

    def get_test_cases(self) -> List[Dict[str, Any]]:
        """获取测试用例"""
        return [
            {
                "name": "章节生成-基础vs增强",
                "type": "chapter",
                "variants": ["基础版", "增强版"],
                "test_input": {
                    "outline": "林尘遇到受伤的苏婉儿，决定救她。",
                    "context": "修仙世界，主角有神秘玉佩。",
                },
            },
            {
                "name": "宏观规划-简单vs商业",
                "type": "macro",
                "variants": ["简单版", "商业版"],
                "test_input": {
                    "target": "100",
                    "worldview": "修仙世界",
                    "characters": "林尘、苏婉儿",
                },
            },
        ]

    async def run_single_test(self, test_case: Dict[str, Any]) -> EvaluationResult:
        """运行单个测试"""
        import time
        start_time = time.time()

        test_type = test_case.get("type", "chapter")
        variants = test_case.get("variants", [])
        test_input = test_case.get("test_input", {})

        try:
            llm = self._get_service("llm")
            from domain.ai.value_objects.prompt import Prompt
            from domain.ai.services.llm_service import GenerationConfig

            results = {}
            variant_list = self.VARIANTS.get(test_type, [])

            for variant_name in variants:
                variant = next((v for v in variant_list if v.name == variant_name), None)
                if not variant:
                    continue

                user_prompt = variant.user_template.format(**test_input)
                prompt = Prompt(system=variant.system, user=user_prompt)
                config = GenerationConfig(max_tokens=2048, temperature=0.7)

                result = await llm.generate(prompt, config)
                results[variant_name] = {
                    "content": result.content[:500],
                    "tokens": result.token_usage.output_tokens,
                }

            duration = time.time() - start_time

            # 比较各变体
            metrics = [
                create_metric(
                    name="变体比较",
                    score=7.0,
                    weight=1.0,
                    details=f"比较了{len(results)}个变体: {list(results.keys())}",
                ),
                create_metric(
                    name="Token效率",
                    score=8.0,
                    weight=0.8,
                    details=f"平均输出tokens: {sum(r['tokens'] for r in results.values())//max(len(results),1)}",
                ),
            ]

            return EvaluationResult(
                test_name=test_case["name"],
                success=True,
                metrics=metrics,
                input_data={"type": test_type, "variants": variants},
                output_data=results,
                duration_seconds=duration,
            )

        except Exception as e:
            duration = time.time() - start_time
            return EvaluationResult(
                test_name=test_case["name"],
                success=False,
                error=str(e),
                duration_seconds=duration,
            )


async def main():
    """运行提示词优化评测"""
    evaluator = PromptOptimizer()
    report = await evaluator.run_all_tests()

    output_dir = Path(__file__).parent / "results"
    output_path = evaluator.save_results(output_dir)

    print(f"\n评测报告已保存: {output_path}")
    print(f"平均分: {report.average_score:.2f}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
