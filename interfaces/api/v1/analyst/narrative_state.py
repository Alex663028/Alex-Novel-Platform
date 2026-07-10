"""Narrative state API endpoints."""

import logging
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from application.analyst.services.narrative_entity_state_service import NarrativeEntityStateService
from interfaces.api.dependencies import get_narrative_entity_state_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/novels", tags=["narrative-state"])


@router.get("/{novel_id}/entities/{entity_id}/state")
async def get_entity_state(
    novel_id: str,
    entity_id: str,
    chapter: int = Query(..., ge=1, description="Chapter number (must be >= 1)"),
    service: NarrativeEntityStateService = Depends(get_narrative_entity_state_service)
) -> Dict[str, Any]:
    """
    Get entity state at a specific chapter.

    This endpoint retrieves the computed state of an entity at a given chapter
    by replaying all narrative events up to that point.

    Args:
        novel_id: The novel ID (used for routing context)
        entity_id: The entity ID to query
        chapter: The chapter number (must be >= 1)
        service: Injected narrative entity state service

    Returns:
        Dictionary containing the entity state at the specified chapter

    Raises:
        HTTPException: 404 if entity not found, 422 if validation fails
    """
    try:
        state = service.get_state(entity_id, chapter)

        if state is None:
            logger.warning(f"Entity not found: {entity_id}")
            raise HTTPException(status_code=404, detail="Entity not found")

        # Add entity_id to response for convenience
        response = {"entity_id": entity_id, **state}
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving entity state: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
