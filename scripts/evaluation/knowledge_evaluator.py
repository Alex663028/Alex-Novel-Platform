"""知识提取评测器 - 使用项目现有服务

评测知识图谱生成服务的质量。
"""

import json
import re
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from .base_evaluator import (
    BaseEvaluator,
    EvaluationResult,
    create_metric,
)


class KnowledgeEvaluator(BaseEvaluator):
    """知识提取评测器"""

    @property
    def name(self) -> str:
        return "knowledge_extraction"

    def get_test_cases(self) -> List[Dict[str, Any]]:
        """获取测试用例"""
        return [
            {
                "name": "玄幻世界观知识",
                "title": "逆天仙途",
                "settings": """
世界观：修仙世界，分为凡人界和灵界。
主角：林尘，18岁，从地球穿越而来，带着一个神秘玉佩。
金手指：玉佩可以分析万物属性和改良方案。
修炼体系：炼气、筑基、金丹、元婴、化神。
主要势力：青云宗、药王谷、天魔教。
""",
                "expected_entities": ["林尘", "玉佩", "青云宗", "药王谷"],
                "expected_facts_count": (5, 10),
            },
            {
                "name": "都市世界观知识",
                "title": "程序员的逆袭",
                "settings": """
世界观：现代都市，互联网行业背景。
主角：张明，35岁程序员，被裁员后获得预测未来的系统。
系统：可预知未来24小时，但消耗体力。
主要场景：科技公司、创业园区。
""",
                "expected_entities": ["张明", "系统", "科技公司"],
                "expected_facts_count": (3, 8),
            },
        ]

    async def run_single_test(self, test_case: Dict[str, Any]) -> EvaluationResult:
        """运行单个测试"""
        import time
        start_time = time.time()

        try:
            # 使用 AutoKnowledgeGenerator
            from application.world.services.auto_knowledge_generator import AutoKnowledgeGenerator
            
            llm = self._get_service("llm")
            generator = AutoKnowledgeGenerator(llm)

            result = await generator.generate_initial_knowledge(
                novel_title=test_case.get("title", ""),
                novel_settings=test_case.get("settings", ""),
            )

            duration = time.time() - start_time

            # 评测各项指标
            metrics = self._evaluate_knowledge(result, test_case)

            success = all(m.passed for m in metrics)

            return EvaluationResult(
                test_name=test_case["name"],
                success=success,
                metrics=metrics,
                input_data={
                    "title": test_case.get("title"),
                },
                output_data={
                    "premise_lock": result.get("premise_lock", "")[:100] if result else "",
                    "facts_count": len(result.get("facts", [])) if result else 0,
                },
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

    def _evaluate_knowledge(self, result: Optional[Dict], test_case: Dict) -> List:
        """评测知识提取"""
        metrics = []

        if not result:
            metrics.append(create_metric("JSON解析", 2.0, details="无法解析结果"))
            return metrics

        # 1. 前提锁定
        premise = result.get("premise_lock", "")
        premise_score = 8.0 if premise and len(premise) >= 20 else 4.0
        metrics.append(create_metric(
            name="前提锁定",
            score=premise_score,
            weight=1.2,
            details=f"长度: {len(premise)}字" if premise else "缺失",
        ))

        # 2. 事实数量
        facts = result.get("facts", [])
        min_facts, max_facts = test_case.get("expected_facts_count", (3, 10))
        facts_count = len(facts)

        if min_facts <= facts_count <= max_facts:
            facts_score = 10.0
        elif facts_count >= min_facts - 1:
            facts_score = 7.0
        else:
            facts_score = 4.0

        metrics.append(create_metric(
            name="事实数量",
            score=facts_score,
            weight=1.0,
            details=f"提取{facts_count}条事实",
        ))

        # 3. 实体覆盖
        expected_entities = set(test_case.get("expected_entities", []))
        found_entities = set()

        for fact in facts:
            subj = fact.get("subject", "")
            obj = fact.get("object", "")
            if subj:
                found_entities.add(subj)
            if obj:
                found_entities.add(obj)

        coverage = len(expected_entities & found_entities) / len(expected_entities) if expected_entities else 0
        entity_score = 5.0 + coverage * 5.0

        metrics.append(create_metric(
            name="实体覆盖",
            score=entity_score,
            weight=1.3,
            details=f"覆盖率: {coverage:.0%}",
        ))

        # 4. 结构规范
        valid_facts = sum(1 for f in facts if all(k in f for k in ["subject", "predicate", "object"]))
        structure_score = (valid_facts / facts_count * 10) if facts_count > 0 else 0

        metrics.append(create_metric(
            name="结构规范",
            score=structure_score,
            weight=1.0,
            details=f"有效结构: {valid_facts}/{facts_count}",
        ))

        return metrics


async def main():
    """运行知识提取评测"""
    evaluator = KnowledgeEvaluator()
    report = await evaluator.run_all_tests()

    output_dir = Path(__file__).parent / "results"
    output_path = evaluator.save_results(output_dir)

    print(f"\n评测报告已保存: {output_path}")
    print(f"平均分: {report.average_score:.2f}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
