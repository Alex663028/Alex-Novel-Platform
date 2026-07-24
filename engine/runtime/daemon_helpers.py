"""Daemon host helper functions — shared heartbeat, persistence, and CQRS utilities.

Extracted from DaemonHostMixin to keep the mixin focused on orchestration logic
while these standalone helpers can be reused across runtime modules.
"""
from __future__ import annotations

import logging
import time
from typing import Any, Dict

logger = logging.getLogger(__name__)


def coerce_word_count_to_int(wc: Any) -> int:
    """Chapter word_count may be int or WordCount value object."""
    if wc is None:
        return 0
    if hasattr(wc, "value"):
        return wc.value
    return int(wc)


def write_daemon_heartbeat() -> None:
    """Write daemon heartbeat to shared memory so the frontend can detect liveness."""
    now = time.time()
    try:
        import sys
        shared = sys.modules.get("__shared_state")
        if shared is not None:
            shared["_daemon_heartbeat"] = now
            for key in list(shared.keys()):
                if key.startswith("novel:") and isinstance(shared[key], dict):
                    shared[key]["_updated_at"] = now
            return
    except Exception:
        pass
    try:
        import multiprocessing
        if multiprocessing.current_process().daemon:
            return
    except Exception:
        pass
    try:
        from interfaces.runtime_state import _get_shared_state
        state = _get_shared_state()
        state["_daemon_heartbeat"] = now
    except Exception:
        pass


def init_daemon_dependencies(
    host: Any,
    *,
    novel_repository,
    llm_service,
    context_builder,
    background_task_service,
    planning_service,
    story_node_repo,
    chapter_repository,
    poll_interval: int = 5,
    voice_drift_service=None,
    circuit_breaker=None,
    chapter_workflow=None,
    aftermath_pipeline=None,
    volume_summary_service=None,
    foreshadowing_repository=None,
    knowledge_service=None,
    use_story_pipeline_for_writing: bool | None = None,
) -> None:
    """注入守护进程依赖 — AutopilotDaemon / StoryPipelineRunner 共用（Phase 8）"""
    if use_story_pipeline_for_writing is None:
        from engine.runtime.writing_delegate import is_story_pipeline_writing_enabled

        use_story_pipeline_for_writing = is_story_pipeline_writing_enabled()
    host.novel_repository = novel_repository
    host.llm_service = llm_service
    host.context_builder = context_builder
    host.background_task_service = background_task_service
    host.planning_service = planning_service
    host.story_node_repo = story_node_repo
    host.chapter_repository = chapter_repository
    host.poll_interval = poll_interval
    host.voice_drift_service = voice_drift_service
    host.circuit_breaker = circuit_breaker
    host.chapter_workflow = chapter_workflow
    host.aftermath_pipeline = aftermath_pipeline
    host.volume_summary_service = volume_summary_service
    host.foreshadowing_repository = foreshadowing_repository
    host.knowledge_service = knowledge_service
    host.use_story_pipeline_for_writing = use_story_pipeline_for_writing

    host._beat_exhausted_rewrite_count = {}
    host._pending_chapter_micro_beats = {}
    host._pending_story_pipeline_aftermath = {}

    if not host.volume_summary_service and llm_service and story_node_repo:
        try:
            from application.blueprint.services.volume_summary_service import VolumeSummaryService

            host.volume_summary_service = VolumeSummaryService(
                llm_service=llm_service,
                story_node_repository=story_node_repo,
                chapter_repository=chapter_repository,
                foreshadowing_repository=foreshadowing_repository,
            )
        except ImportError:
            host.volume_summary_service = None
