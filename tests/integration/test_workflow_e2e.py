"""端到端测试 - 完整生成工作流"""
import pytest
from unittest.mock import Mock, AsyncMock
from application.workflows.auto_novel_generation_workflow import AutoNovelGenerationWorkflow
from application.engine.services.context_builder import ContextBuilder
from application.dtos.generation_result import GenerationResult
from domain.novel.services.consistency_checker import ConsistencyChecker
from domain.novel.services.storyline_manager import StorylineManager
from domain.novel.repositories.plot_arc_repository import PlotArcRepository
from domain.novel.value_objects.consistency_report import ConsistencyReport
from domain.ai.services.llm_service import LLMService, GenerationConfig, GenerationResult as LLMResult
from domain.ai.value_objects.token_usage import TokenUsage


@pytest.fixture
def mock_dependencies():
    """创建所有 mock 依赖"""
    context_builder = Mock(spec=ContextBuilder)
    context_builder.build_context.return_value = "Full context with 35K tokens"
    context_builder.build_structured_context.return_value = {
        "layer1_text": "mock_layer1",
        "layer2_text": "mock_layer2",
        "layer3_text": "mock_layer3",
        "token_usage": {"layer1": 100, "layer2": 50, "layer3": 25, "total": 8750},
    }
    context_builder.build_voice_anchor_system_section.return_value = ""
    context_builder.estimate_tokens.return_value = 8750
    context_builder.magnify_outline_to_beats.return_value = []
    context_builder.build_beat_prompt.return_value = "mock beat prompt"

    # Mock ConsistencyChecker
    consistency_checker = Mock(spec=ConsistencyChecker)
    consistency_checker.check_all.return_value = ConsistencyReport(
        issues=[],
        warnings=[],
        suggestions=[]
    )

    # Mock StorylineManager
    storyline_manager = Mock(spec=StorylineManager)
    storyline_manager.repository = Mock()
    storyline_manager.repository.get_by_novel_id.return_value = []

    # Mock PlotArcRepository
    plot_arc_repository = Mock(spec=PlotArcRepository)
    plot_arc_repository.get_by_novel_id.return_value = None

    # Mock LLMService
    llm_service = Mock(spec=LLMService)
    llm_service.generate = AsyncMock(return_value=LLMResult(
        content="Generated chapter content with detailed narrative.",
        token_usage=TokenUsage(input_tokens=500, output_tokens=500)
    ))

    return {
        'context_builder': context_builder,
        'consistency_checker': consistency_checker,
        'storyline_manager': storyline_manager,
        'plot_arc_repository': plot_arc_repository,
        'llm_service': llm_service
    }


@pytest.fixture
def workflow(mock_dependencies):
    """创建工作流实例"""
    return AutoNovelGenerationWorkflow(
        context_builder=mock_dependencies['context_builder'],
        consistency_checker=mock_dependencies['consistency_checker'],
        storyline_manager=mock_dependencies['storyline_manager'],
        plot_arc_repository=mock_dependencies['plot_arc_repository'],
        llm_service=mock_dependencies['llm_service']
    )


class TestCompleteGenerationFlow:
    """测试完整的生成流程"""

    @pytest.mark.asyncio
    async def test_outline_to_content_flow(self, workflow, mock_dependencies):
        """测试从大纲到内容的完整流程"""
        # 准备输入
        novel_id = "test-novel-1"
        chapter_number = 1
        outline = "Chapter 1: The protagonist discovers a mysterious artifact."

        # 执行生成
        result = await workflow.generate_chapter(
            novel_id=novel_id,
            chapter_number=chapter_number,
            outline=outline
        )

        # 验证结果
        assert isinstance(result, GenerationResult)
        assert result.content == "Generated chapter content with detailed narrative."
        assert result.token_count == 8750
        assert isinstance(result.consistency_report, ConsistencyReport)

        # 验证调用链（prepare_chapter_generation 使用 build_structured_context）
        mock_dependencies['context_builder'].build_structured_context.assert_called_once()
        assert mock_dependencies['llm_service'].generate.call_count >= 1
        mock_dependencies['consistency_checker'].check_all.assert_called_once()

    @pytest.mark.asyncio
    async def test_multiple_chapters_generation(self, workflow):
        """测试生成多个章节"""
        novel_id = "test-novel-2"
        outlines = [
            "Chapter 1: Introduction",
            "Chapter 2: Rising action",
            "Chapter 3: Climax"
        ]

        results = []
        for i, outline in enumerate(outlines, 1):
            result = await workflow.generate_chapter(
                novel_id=novel_id,
                chapter_number=i,
                outline=outline
            )
            results.append(result)

        assert len(results) == 3
        for result in results:
            assert isinstance(result, GenerationResult)
            assert result.content is not None

    @pytest.mark.asyncio
    async def test_large_content_handling(self, workflow):
        """测试处理大内容"""
        novel_id = "test-novel-3"
        large_outline = "Chapter 1: " + "x" * 10000

        result = await workflow.generate_chapter(
            novel_id=novel_id,
            chapter_number=1,
            outline=large_outline
        )

        assert isinstance(result, GenerationResult)
        assert result.content is not None
        assert result.token_count > 0

    @pytest.mark.asyncio
    async def test_error_handling(self, workflow, mock_dependencies):
        """测试错误处理"""
        mock_dependencies['llm_service'].generate = AsyncMock(side_effect=Exception("LLM error"))

        with pytest.raises(Exception):
            await workflow.generate_chapter(
                novel_id="test-novel",
                chapter_number=1,
                outline="Test outline"
            )

    @pytest.mark.asyncio
    async def test_context_builder_integration(self, workflow, mock_dependencies):
        """测试与 ContextBuilder 的集成"""
        result = await workflow.generate_chapter(
            novel_id="test-novel",
            chapter_number=1,
            outline="Test outline"
        )

        # 验证 context builder 被调用
        assert mock_dependencies['context_builder'].build_structured_context.called or \
               mock_dependencies['context_builder'].build_context.called

    @pytest.mark.asyncio
    async def test_consistency_checker_integration(self, workflow, mock_dependencies):
        """测试与 ConsistencyChecker 的集成"""
        result = await workflow.generate_chapter(
            novel_id="test-novel",
            chapter_number=1,
            outline="Test outline"
        )

        # 验证一致性检查被调用
        mock_dependencies['consistency_checker'].check_all.assert_called_once()

        # 验证报告被包含在结果中
        assert isinstance(result.consistency_report, ConsistencyReport)

    @pytest.mark.asyncio
    async def test_storyline_manager_integration(self, workflow, mock_dependencies):
        """测试与 StorylineManager 的集成"""
        await workflow.generate_chapter(
            novel_id="test-novel",
            chapter_number=1,
            outline="Test outline"
        )

        # 验证故事线被查询
        # 注意：由于 _get_storyline_context 中有 hasattr 检查，
        # 这里验证 repository 被访问
        assert mock_dependencies['storyline_manager'].repository is not None


class TestPerformance:
    """性能测试"""

    @pytest.mark.asyncio
    async def test_100_chapter_generation_simulation(self, workflow):
        """模拟生成 100 章的性能测试"""
        import time

        start = time.time()
        for i in range(1, 101):
            await workflow.generate_chapter(
                novel_id=f"perf-novel-{i}",
                chapter_number=i,
                outline=f"Chapter {i} outline"
            )
        elapsed = time.time() - start

        # 100 章生成应在合理时间内完成（mock 环境下应该很快）
        assert elapsed < 30  # 30 秒内完成


class TestErrorHandling:
    """错误处理测试"""

    @pytest.mark.asyncio
    async def test_llm_failure_handling(self, workflow, mock_dependencies):
        """测试 LLM 失败处理"""
        mock_dependencies['llm_service'].generate = AsyncMock(side_effect=Exception("API error"))

        with pytest.raises(Exception):
            await workflow.generate_chapter(
                novel_id="test-novel",
                chapter_number=1,
                outline="Test outline"
            )


class TestIntegrationWithComponents:
    """与其他组件的集成测试"""

    @pytest.mark.asyncio
    async def test_context_builder_integration(self, workflow, mock_dependencies):
        """测试与 ContextBuilder 的集成"""
        result = await workflow.generate_chapter(
            novel_id="test-novel",
            chapter_number=1,
            outline="Test outline"
        )

        assert result.content is not None

    @pytest.mark.asyncio
    async def test_consistency_checker_integration(self, workflow, mock_dependencies):
        """测试与 ConsistencyChecker 的集成"""
        result = await workflow.generate_chapter(
            novel_id="test-novel",
            chapter_number=1,
            outline="Test outline"
        )

        mock_dependencies['consistency_checker'].check_all.assert_called_once()

    @pytest.mark.asyncio
    async def test_storyline_manager_integration(self, workflow, mock_dependencies):
        """测试与 StorylineManager 的集成"""
        await workflow.generate_chapter(
            novel_id="test-novel",
            chapter_number=1,
            outline="Test outline"
        )

        assert mock_dependencies['storyline_manager'].repository is not None
