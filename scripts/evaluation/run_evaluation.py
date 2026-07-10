"""AI功能评测主入口

运行所有评测器，生成综合报告。
"""

import asyncio
import sys
from datetime import datetime
from pathlib import Path

project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from scripts.evaluation.base_evaluator import EvaluationReport
from scripts.evaluation.chapter_generation_evaluator import ChapterGenerationEvaluator
from scripts.evaluation.macro_planning_evaluator import MacroPlanningEvaluator
from scripts.evaluation.beat_sheet_evaluator import BeatSheetEvaluator
from scripts.evaluation.knowledge_evaluator import KnowledgeEvaluator
from scripts.evaluation.consistency_evaluator import ConsistencyEvaluator


async def run_all_evaluations():
    """运行所有评测"""
    print(f"\n{'='*70}")
    print(f"AI 功能评测开始 - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*70}\n")

    evaluators = [
        MacroPlanningEvaluator(),
        KnowledgeEvaluator(),
        ConsistencyEvaluator(),
        BeatSheetEvaluator(),
        ChapterGenerationEvaluator(),
    ]

    reports = []
    output_dir = Path(__file__).parent / "results"

    for evaluator in evaluators:
        try:
            print(f"\n>>> 运行评测器: {evaluator.name}")
            report = await evaluator.run_all_tests()
            path = evaluator.save_results(output_dir)
            reports.append((evaluator.name, report, path))
            print(f"<<< 完成: {evaluator.name}, 平均分: {report.average_score:.2f}")
        except Exception as e:
            print(f"!!! 错误: {evaluator.name} - {e}")
            import traceback
            traceback.print_exc()

    # 生成综合报告
    print(f"\n{'='*70}")
    print("综合评测结果")
    print(f"{'='*70}")

    total_passed = sum(r.passed_tests for _, r, _ in reports)
    total_tests = sum(r.total_tests for _, r, _ in reports)
    avg_scores = [r.average_score for _, r, _ in reports]
    overall_avg = sum(avg_scores) / len(avg_scores) if avg_scores else 0

    print(f"\n总通过率: {total_passed}/{total_tests} ({total_passed/max(total_tests,1)*100:.1f}%)")
    print(f"总体平均分: {overall_avg:.2f}/10")
    print(f"\n各评测器得分:")
    for name, report, path in reports:
        print(f"  - {name}: {report.average_score:.2f} ({report.passed_tests}/{report.total_tests})")
        print(f"    报告: {path}")

    # 保存综合报告
    summary_path = output_dir / f"summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    summary = {
        "timestamp": datetime.now().isoformat(),
        "total_passed": total_passed,
        "total_tests": total_tests,
        "overall_average_score": overall_avg,
        "evaluators": [
            {
                "name": name,
                "average_score": report.average_score,
                "passed_tests": report.passed_tests,
                "total_tests": report.total_tests,
            }
            for name, report, _ in reports
        ]
    }

    import json
    with open(summary_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)

    print(f"\n综合报告: {summary_path}")
    return reports


if __name__ == "__main__":
    asyncio.run(run_all_evaluations())
