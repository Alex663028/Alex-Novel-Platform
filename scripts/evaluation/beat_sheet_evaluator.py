"""节拍表生成评测器 - 使用项目现有服务

评测 BeatSheetService 的节拍表生成质量。
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


class BeatSheetEvaluator(BaseEvaluator):
    """节拍表生成评测器 - 使用 BeatSheetService"""

    @property
    def name(self) -> str:
        return "beat_sheet"

    def get_test_cases(self) -> List[Dict[str, Any]]:
        """获取测试用例"""
        return [
            {
                "name": "玄幻对决章节",
                "outline": "林尘与陈傲天在宗门大比中相遇，两人展开激烈对决。林尘在劣势中突破，以一招险胜。",
                "characters": ["林尘", "陈傲天", "苏婉儿"],
                "expected_scenes": 4,
                "expected_total_words": 3000,
            },
            {
                "name": "都市言情章节",
                "outline": "张明和李薇在公司加班时意外独处，两人聊起各自的人生经历，产生了微妙的情愫。",
                "characters": ["张明", "李薇"],
                "expected_scenes": 3,
                "expected_total_words": 2500,
            },
            {
                "name": "悬疑推理章节",
                "outline": "陆远在调查现场发现了关键线索，同时意识到自己被监视。他决定设下一个陷阱来引出幕后黑手。",
                "characters": ["陆远", "白霜"],
                "expected_scenes": 4,
                "expected_total_words": 2800,
            },
        ]

    async def run_single_test(self, test_case: Dict[str, Any]) -> EvaluationResult:
        """运行单个测试"""
        import time
        start_time = time.time()

        try:
            # 创建测试章节
            chapter_id = await self._ensure_test_chapter(test_case)

            # 使用 BeatSheetService
            beat_service = self._get_service("beat_sheet")

            result = await beat_service.generate_beat_sheet(
                chapter_id=chapter_id,
                outline=test_case.get("outline", ""),
            )

            duration = time.time() - start_time

            # 评测各项指标
            metrics = self._evaluate_beat_sheet(result, test_case)

            success = all(m.passed for m in metrics)

            return EvaluationResult(
                test_name=test_case["name"],
                success=success,
                metrics=metrics,
                input_data={
                    "outline": test_case.get("outline", "")[:100],
                },
                output_data={
                    "scenes_count": len(result.scenes) if hasattr(result, 'scenes') else 0,
                    "scenes": [
                        {"title": s.title, "goal": s.goal, "estimated_words": s.estimated_words}
                        for s in (result.scenes if hasattr(result, 'scenes') else [])
                    ][:5],
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

    async def _ensure_test_chapter(self, test_case: Dict) -> str:
        """确保存在测试章节"""
        from domain.novel.entities.novel import Novel
        from domain.novel.value_objects.novel_id import NovelId
        from domain.novel.entities.chapter import Chapter
        from domain.novel.value_objects.chapter_id import ChapterId
        import uuid

        novel_repo = self._get_service("novel_repository")
        chapter_repo = self._get_service("chapter_repository")

        # 创建测试小说
        novel_id = NovelId(f"eval_beat_{uuid.uuid4().hex[:8]}")
        novel = Novel(
            novel_id=novel_id,
            title=f"评测_{test_case.get('name', 'test')}",
            target_chapters=10,
        )
        novel_repo.save(novel)

        # 创建测试章节
        chapter_id = ChapterId(f"ch_{uuid.uuid4().hex[:8]}")
        chapter = Chapter(
            id=chapter_id.value,
            novel_id=novel_id.value,
            number=1,
            title="测试章节",
            content="",
        )
        chapter_repo.save(chapter)

        return chapter_id.value

    def _evaluate_beat_sheet(self, result, test_case: Dict) -> List:
        """评测节拍表"""
        metrics = []

        scenes = result.scenes if hasattr(result, 'scenes') else []

        # 1. 场景数量
        expected_scenes = test_case.get("expected_scenes", 4)
        scene_count = len(scenes)

        if scene_count == expected_scenes:
            scene_score = 10.0
        elif abs(scene_count - expected_scenes) == 1:
            scene_score = 8.0
        elif 2 <= scene_count <= 6:
            scene_score = 6.0
        else:
            scene_score = 3.0

        metrics.append(create_metric(
            name="场景数量",
            score=scene_score,
            weight=1.0,
            details=f"生成{scene_count}个场景，预期{expected_scenes}个",
        ))

        # 2. 场景目标明确性
        goal_score, goal_details = self._evaluate_scene_goals(scenes)
        metrics.append(create_metric(
            name="场景目标",
            score=goal_score,
            weight=1.3,
            details=goal_details,
        ))

        # 3. POV 角色选择
        pov_score, pov_details = self._evaluate_pov(scenes, test_case.get("characters", []))
        metrics.append(create_metric(
            name="POV选择",
            score=pov_score,
            weight=1.0,
            details=pov_details,
        ))

        # 4. 情绪基调
        tone_score, tone_details = self._evaluate_tone(scenes)
        metrics.append(create_metric(
            name="情绪基调",
            score=tone_score,
            weight=1.0,
            details=tone_details,
        ))

        # 5. 字数预估
        word_score, word_details = self._evaluate_word_estimation(scenes, test_case.get("expected_total_words", 3000))
        metrics.append(create_metric(
            name="字数预估",
            score=word_score,
            weight=0.8,
            details=word_details,
        ))

        return metrics

    def _evaluate_scene_goals(self, scenes: List) -> tuple:
        """评测场景目标"""
        if not scenes:
            return 3.0, "无场景"

        scores = []
        details = []

        for i, scene in enumerate(scenes[:3], 1):
            goal = scene.goal if hasattr(scene, 'goal') else ""
            if goal and len(goal) >= 10:
                scores.append(10)
                details.append(f"场景{i}目标明确")
            else:
                scores.append(5)
                details.append(f"场景{i}目标不明确")

        avg_score = sum(scores) / len(scores) if scores else 0
        return avg_score, "; ".join(details)

    def _evaluate_pov(self, scenes: List, characters: List[str]) -> tuple:
        """评测POV选择"""
        if not scenes:
            return 3.0, "无场景"

        pov_scores = []
        details = []

        for i, scene in enumerate(scenes[:3], 1):
            pov = scene.pov_character if hasattr(scene, 'pov_character') else ""
            if not pov:
                pov_scores.append(4)
                details.append(f"场景{i}未指定POV")
            elif characters and pov in characters:
                pov_scores.append(10)
                details.append(f"场景{i} POV有效")
            else:
                pov_scores.append(7)

        avg_score = sum(pov_scores) / len(pov_scores) if pov_scores else 0
        return avg_score, "; ".join(details)

    def _evaluate_tone(self, scenes: List) -> tuple:
        """评测情绪基调"""
        tones = [s.tone for s in scenes if hasattr(s, 'tone') and s.tone]

        if not tones:
            return 5.0, "未指定情绪基调"

        score = 6.0
        details = [f"指定了{len(tones)}个情绪基调"]

        positive_tones = ["温馨", "喜悦", "轻松", "振奋"]
        negative_tones = ["紧张", "悲伤", "压抑", "恐惧"]

        has_positive = any(any(pt in t for pt in positive_tones) for t in tones)
        has_negative = any(any(nt in t for nt in negative_tones) for t in tones)

        if has_positive and has_negative:
            score += 3.0
            details.append("情绪有起伏变化")

        return min(score, 10.0), "; ".join(details)

    def _evaluate_word_estimation(self, scenes: List, expected_total: int) -> tuple:
        """评测字数预估"""
        total = sum(s.estimated_words for s in scenes if hasattr(s, 'estimated_words') and s.estimated_words)

        if total == 0:
            return 5.0, "未预估字数"

        diff_ratio = abs(total - expected_total) / expected_total

        if diff_ratio <= 0.1:
            return 10.0, f"预估准确(总计{total}字)"
        elif diff_ratio <= 0.2:
            return 8.0, f"预估较准确(总计{total}字)"
        else:
            return 6.0, f"预估偏差较大(总计{total}字，预期{expected_total})"


async def main():
    """运行节拍表评测"""
    evaluator = BeatSheetEvaluator()
    report = await evaluator.run_all_tests()

    output_dir = Path(__file__).parent / "results"
    output_path = evaluator.save_results(output_dir)

    print(f"\n评测报告已保存: {output_path}")
    print(f"平均分: {report.average_score:.2f}")


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
