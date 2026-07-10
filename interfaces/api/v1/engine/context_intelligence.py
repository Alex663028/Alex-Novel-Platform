"""FastAPI 路由 - 场景导演分析"""
import logging

from fastapi import APIRouter, Depends, HTTPException, status

from application.engine.dtos.scene_director_dto import (
    SceneDirectorAnalyzeRequest,
    SceneDirectorAnalyzeResponse,
    SceneDirectorAnalysis,
    ContextRetrieveRequest,
    ContextRetrieveResponse,
)
from application.engine.services.scene_director_service import SceneDirectorService
from application.engine.services.context_builder import ContextBuilder
from interfaces.api.dependencies import get_scene_director_service, get_context_builder

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/novels", tags=["context-intelligence"])


@router.post("/{novel_id}/scene-director/analyze", response_model=SceneDirectorAnalyzeResponse)
async def analyze_scene(
    novel_id: str,
    body: SceneDirectorAnalyzeRequest,
    svc: SceneDirectorService = Depends(get_scene_director_service),
):
    """分析章节大纲，提取场景信息

    Args:
        novel_id: 小说 ID（预留：可按小说过滤词表；Phase 1 仅记录日志）
        body: 分析请求体
        svc: 场景导演服务

    Returns:
        SceneDirectorAnalyzeResponse: 分析结果
    """
    logger.debug("scene-director analyze novel_id=%s chapter=%s", novel_id, body.chapter_number)
    try:
        r = await svc.analyze(body.chapter_number, body.outline)
    except Exception as e:
        logger.exception("scene-director failed for novel_id=%s", novel_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to analyze scene"
        ) from e
    return SceneDirectorAnalyzeResponse(**r.model_dump())


@router.post("/{novel_id}/context/retrieve", response_model=ContextRetrieveResponse)
def retrieve_context(
    novel_id: str,
    body: ContextRetrieveRequest,
    builder: ContextBuilder = Depends(get_context_builder),
):
    """检索分层上下文

    Args:
        novel_id: 小说 ID
        body: 检索请求体
        builder: 上下文构建器

    Returns:
        ContextRetrieveResponse: 分层上下文和 token 使用情况
    """
    logger.debug("context retrieve novel_id=%s chapter=%s", novel_id, body.chapter_number)
    try:
        hint = None
        if body.scene_director_result:
            hint = SceneDirectorAnalysis.model_validate(body.scene_director_result)

        payload = builder.build_structured_context(
            novel_id=novel_id,
            chapter_number=body.chapter_number,
            outline=body.outline,
            max_tokens=body.max_tokens,
            scene_director=hint,
        )
        return ContextRetrieveResponse(
            layer1={"content": payload["layer1_text"]},
            layer2={"content": payload["layer2_text"]},
            layer3={"content": payload["layer3_text"]},
            token_usage=payload["token_usage"],
        )
    except Exception as e:
        logger.exception("context retrieve failed for novel_id=%s", novel_id)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve context"
        ) from e
