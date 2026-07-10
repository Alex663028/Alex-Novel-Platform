"""一致性检测评测器 - 使用项目现有服务

评测章节一致性检测能力。
"""

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


class ConsistencyEvaluator(BaseEvaluator):
    """一致性检测评测器"""

    @property
    def name(self) -> str:
        return "consistency_check"

    def get_test_cases(self) -> List[Dict[str, Any]]:
        """获取测试用例"""
        return [
            {
                "name": "人物一致性检测",
                "content": """
林尘站在演武台上，冷静地分析着陈傲天的攻击模式。
"哼，区区筑基期，也敢与我一战？"陈傲天狂笑道。
听到嘲讽，林尘顿时怒火中烧，不顾一切地冲了上去。
"我要杀了你！"他咆哮着，完全忘记了之前的计划。
""",
                "character_setting": "林尘：性格冷静理智，从不冲动行事",
                "expected_issues": 1,
            },
            {
                "name": "设定一致性检测",
                "content": """
林尘虽然只是筑基初期，但他御剑飞行，在天空中自由翱翔。
突然，一个元婴期的高手拦住了他的去路。林尘毫不犹豫，一剑将其斩杀。
""",
                "world_setting": "筑基期无法飞行，境界差距巨大，低两个境界不可能战胜高境界",
                "expected_issues": 2,
            },
            {
                "name": "正常文本检测",
                "content": """
林尘站在演武台上，冷静地分析着陈傲天的攻击模式。
虽然对方实力远超自己，但他并不慌乱。
苏婉儿在台下紧张地握紧了双手，眼中满是担忧。
""",
                "character_setting": "林尘：性格冷静理智；苏婉儿：性格善良温柔",
                "expected_issues": 0,
            },
        ]

    async def run_single_test(self, test_case: Dict[str, Any]) -> EvaluationResult:
        """运行单个测试"""
        import time
        start_time = time.time()

        try:
            # 使用 LLM 进行一致性检查
            llm = self._get_service("llm")
            from domain.ai.value_objects.prompt import Prompt
            from domain.ai.services.llm_service import GenerationConfig

            system_prompt = """你是专业的小说一致性检查助手。检查文本中的问题。

需要检查：
1. 人物一致性：行为是否符合性格设定
2. 设定一致性：是否违反世界观规则
3. 时间线一致性：时间描述是否合理

输出 JSON 格式：
{
  "issues": [
    {"type": "问题类型", "description": "问题描述"}
  ],
  "is_consistent": true/false
}"""

            user_prompt = f"""设定：
{test_case.get('character_setting', '')}
{test_case.get('world_setting', '')}

待检查文本：
{test_case.get('content', '')}

请检查一致性问题："""

            prompt = Prompt(system=system_prompt, user=user_prompt)
            config = GenerationConfig(max_tokens=1024, temperature=0.3)

            result = await llm.generate(prompt, config)
            content = result.content

            duration = time.time() - start_time

            # 解析结果
            import json
            import re
            json_match = re.search(r'\{[\s\S]*\}', content)
            parsed = json.loads(json_match.group(0)) if json_match else {"issues": []}

            # 评测
            found_issues = len(parsed.get("issues", []))
            expected_issues = test_case.get("expected_issues", 0)

            if expected_issues == 0:
                accuracy = 10.0 if found_issues == 0 else max(0, 10 - found_issues * 3)
            else:
                accuracy = 10.0 if found_issues >= expected_issues else max(4, found_issues / expected_issues * 10)

            metrics = [
                create_metric(
                    name="检测准确性",
                    score=accuracy,
                    weight=1.5,
                    details=f"检测到{found_issues}个问题，预期{expected_issues}个",
                ),
                create_metric(
                    name="响应质量",
                    score=8.0 if parsed.get("issues") else 5.0,
                    weight=1.0,
                    details="有结构化输出" if parsed.get("issues") else "输出格式可能有问题",
                ),
            ]

            success = accuracy >= 6.0

            return EvaluationResult(
                test_name=test_case["name"],
                success=success,
                metrics=metrics,
                input_data={"expected_issues": expected_issues},
                output_data={"found_issues": found_issues, "details": parsed.get("issues", [])},
                duration_seconds=duration,
                token_usage={"input": result.token_usage.input_tokens, "output": result.token_usage.output_tokens},
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
    """运行一致性评测"""
    evaluator = ConsistencyEvaluator()
    report = await evaluator.run_all_tests()

    output_dir = Path(__file__).parent / "results"
    output_path = evaluator.save_results(output_dir)

    print(f"\n评测报告已保存: {output_path}")
    print(f"平均分: {report.average_score:.2f}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
