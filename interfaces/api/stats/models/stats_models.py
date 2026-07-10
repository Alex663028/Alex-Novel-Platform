"""Statistics data models for tracking writing progress and content analysis."""
from typing import Dict
from datetime import datetime
from pydantic import BaseModel, Field, model_validator


class GlobalStats(BaseModel):
    """Global statistics across all books.

    Attributes:
        total_books: Total number of books in the system
        total_chapters: Total number of chapters across all books
        total_words: Total word count across all books
        total_characters: Total character count across all books
        books_by_stage: Dictionary mapping stage names to book counts
    """
    total_books: int = Field(ge=0)
    total_chapters: int = Field(ge=0)
    total_words: int = Field(ge=0)
    total_characters: int = Field(ge=0)
    books_by_stage: Dict[str, int] = Field(default_factory=dict)


class BookStats(BaseModel):
    """Statistics for a specific book.

    Attributes:
        slug: Unique identifier for the book
        title: Book title
        total_chapters: Total number of chapters in the book
        completed_chapters: Number of completed chapters
        total_words: Total word count for the book
        avg_chapter_words: Average words per chapter
        completion_rate: Fraction of book completed (0.0 to 1.0)
        last_updated: When statistics were last calculated
    """
    slug: str
    title: str
    total_chapters: int = Field(ge=0)
    completed_chapters: int = Field(ge=0)
    total_words: int = Field(ge=0)
    avg_chapter_words: int = Field(ge=0)
    completion_rate: float = Field(ge=0.0, le=1.0)
    last_updated: datetime

    @model_validator(mode='after')
    def validate_chapter_counts(self) -> 'BookStats':
        """Ensure completed_chapters does not exceed total_chapters."""
        if self.completed_chapters > self.total_chapters:
            raise ValueError(f"completed_chapters ({self.completed_chapters}) cannot exceed total_chapters ({self.total_chapters})")
        return self


class ChapterStats(BaseModel):
    """Statistics for a specific chapter.

    Attributes:
        chapter_id: Unique identifier for the chapter (>= 1)
        title: Chapter title
        word_count: Number of words in the chapter
        character_count: Number of characters in the chapter
        paragraph_count: Number of paragraphs in the chapter
        has_content: Whether the chapter has any content
    """
    chapter_id: int = Field(ge=1)
    title: str
    word_count: int = Field(ge=0)
    character_count: int = Field(ge=0)
    paragraph_count: int = Field(ge=0)
    has_content: bool

    @model_validator(mode='after')
    def validate_content_counts(self) -> 'ChapterStats':
        """Ensure if has_content is False, all content counts are 0."""
        if not self.has_content:
            if self.word_count != 0:
                raise ValueError(f"word_count must be 0 when has_content is False, got {self.word_count}")
            if self.character_count != 0:
                raise ValueError(f"character_count must be 0 when has_content is False, got {self.character_count}")
            if self.paragraph_count != 0:
                raise ValueError(f"paragraph_count must be 0 when has_content is False, got {self.paragraph_count}")
        return self


class WritingProgress(BaseModel):
    """Daily writing progress tracking.

    Attributes:
        date: Date of the progress record
        words_written: Number of words written on this date
        chapters_completed: Number of chapters completed on this date
    """
    date: datetime
    words_written: int = Field(ge=0)
    chapters_completed: int = Field(ge=0)


class ContentAnalysis(BaseModel):
    """Analysis of chapter content characteristics.

    Attributes:
        character_mentions: Dictionary mapping character names to mention counts
        dialogue_ratio: Fraction of content that is dialogue (0.0 to 1.0)
        scene_count: Number of scenes in the content
        avg_paragraph_length: Average length of paragraphs in words
    """
    character_mentions: Dict[str, int] = Field(default_factory=dict)
    dialogue_ratio: float = Field(ge=0.0, le=1.0)
    scene_count: int = Field(ge=0)
    avg_paragraph_length: int = Field(ge=0)