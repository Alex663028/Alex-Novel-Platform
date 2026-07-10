"""Unified response models for API responses."""
from typing import TypeVar, Generic, Optional, List, Any
from pydantic import BaseModel, Field, field_validator
import math


T = TypeVar('T')


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success response model.

    Attributes:
        success: Always True for success responses
        data: The response data (can be any type)
        message: Optional success message
    """
    success: bool = Field(default=True, frozen=True)
    data: T
    message: Optional[str] = None


class ErrorResponse(BaseModel):
    """Standard error response model.

    Attributes:
        success: Always False for error responses
        message: Error message describing what went wrong
        code: Error code for programmatic handling
        details: Optional additional error details
    """
    success: bool = Field(default=False, frozen=True)
    message: str
    code: str
    details: Optional[Any] = None


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response model with automatic total_pages calculation.

    Attributes:
        success: Always True for success responses
        data: List of items for current page
        total: Total number of items across all pages
        page: Current page number (1-indexed)
        page_size: Number of items per page
        total_pages: Total number of pages (auto-calculated)
        message: Optional message
    """
    success: bool = Field(default=True, frozen=True)
    data: List[T]
    total: int = Field(ge=0)
    page: int = Field(ge=1)
    page_size: int = Field(ge=1)
    total_pages: int = Field(default=0)
    message: Optional[str] = None

    def __init__(self, **data):
        """Initialize and calculate total_pages."""
        super().__init__(**data)
        # Calculate total_pages after initialization
        if self.total == 0:
            object.__setattr__(self, 'total_pages', 0)
        else:
            object.__setattr__(self, 'total_pages', math.ceil(self.total / self.page_size))
