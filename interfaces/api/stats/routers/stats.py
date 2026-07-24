"""Statistics API router for tracking writing progress and content analysis."""
import logging
from typing import List

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import PositiveInt

from interfaces.api.urls import stats_api_url

from ..services.stats_service import StatsService
from ..models.responses import SuccessResponse
from ..models.stats_models import GlobalStats, BookStats, ChapterStats, WritingProgress

logger = logging.getLogger("plotpilot.web.routers.stats")


def create_stats_router(stats_service: StatsService) -> APIRouter:
    """Create and configure the statistics API router.

    Args:
        stats_service: StatsService instance for business logic

    Returns:
        Configured FastAPI APIRouter with statistics endpoints
    """
    router = APIRouter()

    @router.get("/global", response_model=SuccessResponse[GlobalStats])
    def get_global_stats() -> SuccessResponse[GlobalStats]:
        """Get global statistics across all books.

        Returns aggregated statistics including:
        - Total books, chapters, words, characters
        - Books categorized by stage

        Returns:
            SuccessResponse containing GlobalStats object
        """
        logger.info("GET %s", stats_api_url("/global"))

        stats = stats_service.get_global_stats()
        return SuccessResponse(data=stats)

    @router.get("/book/{novel_id}", response_model=SuccessResponse[BookStats])
    def get_book_stats(novel_id: str) -> SuccessResponse[BookStats]:
        """Get statistics for a specific book.

        Args:
            novel_id: The book's unique identifier

        Returns:
            SuccessResponse containing BookStats object

        Raises:
            HTTPException: 404 if book not found
        """
        logger.info("GET %s", stats_api_url(f"/book/{novel_id}"))

        stats = stats_service.get_book_stats(novel_id)
        if stats is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book '{novel_id}' not found"
            )

        return SuccessResponse(data=stats)

    @router.get("/book/{novel_id}/chapter/{chapter_id}", response_model=SuccessResponse[ChapterStats])
    def get_chapter_stats(
        novel_id: str,
        chapter_id: PositiveInt
    ) -> SuccessResponse[ChapterStats]:
        """Get statistics for a specific chapter.

        Args:
            novel_id: The book's unique identifier
            chapter_id: The chapter's numeric ID (>= 1)

        Returns:
            SuccessResponse containing ChapterStats object

        Raises:
            HTTPException: 404 if chapter not found
        """
        logger.info("GET %s", stats_api_url(f"/book/{novel_id}/chapter/{chapter_id}"))

        stats = stats_service.get_chapter_stats(novel_id, chapter_id)
        if stats is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Chapter {chapter_id} in book '{novel_id}' not found"
            )

        return SuccessResponse(data=stats)

    @router.get("/book/{novel_id}/progress", response_model=SuccessResponse[List[WritingProgress]])
    def get_writing_progress(
        novel_id: str,
        days: int = Query(default=30, ge=1, le=365, description="Number of days to look back (1-365)")
    ) -> SuccessResponse[List[WritingProgress]]:
        """Get writing progress over time for a specific book.

        Uses repository-provided chapter timestamps to calculate daily word
        counts and completed chapters in the requested lookback window.

        Args:
            novel_id: The book's unique identifier
            days: Number of days to look back (default 30, range 1-365)

        Returns:
            SuccessResponse containing list of WritingProgress objects

        Raises:
            HTTPException: 404 if book not found
        """
        logger.info("GET %s", stats_api_url(f"/book/{novel_id}/progress?days={days}"))

        # Check if book exists before returning progress
        book_stats = stats_service.get_book_stats(novel_id)
        if book_stats is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Book '{novel_id}' not found"
            )

        progress = stats_service.get_writing_progress(novel_id, days)
        return SuccessResponse(data=progress)

    logger.info("Statistics router created with endpoints: /global, /book/{novel_id}, /book/{novel_id}/chapter/{chapter_id}, /book/{novel_id}/progress")
    return router
