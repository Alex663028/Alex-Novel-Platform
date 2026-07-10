"""SQLite 章节文风评分仓储"""
from typing import List, Optional
from uuid import uuid4


class SqliteChapterStyleScoreRepository:
    """读写 chapter_style_scores 表。"""

    def __init__(self, db_connection):
        self.db = db_connection

    def upsert(
        self,
        novel_id: str,
        chapter_number: int,
        adjective_density: float,
        avg_sentence_length: float,
        sentence_count: int,
        similarity_score: Optional[float],  # None 表示无指纹基准
    ) -> str:
        existing = self.get_by_chapter(novel_id, chapter_number)
        if existing:
            self.db.execute(
                """
                UPDATE chapter_style_scores
                SET adjective_density = ?,
                    avg_sentence_length = ?,
                    sentence_count = ?,
                    similarity_score = ?,
                    computed_at = CURRENT_TIMESTAMP
                WHERE novel_id = ? AND chapter_number = ?
                """,
                (
                    adjective_density,
                    avg_sentence_length,
                    sentence_count,
                    similarity_score,
                    novel_id,
                    chapter_number,
                ),
            )
            return existing["score_id"]

        score_id = str(uuid4())
        self.db.execute(
            """
            INSERT INTO chapter_style_scores
            (score_id, novel_id, chapter_number, adjective_density,
             avg_sentence_length, sentence_count, similarity_score)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                score_id,
                novel_id,
                chapter_number,
                adjective_density,
                avg_sentence_length,
                sentence_count,
                similarity_score,
            ),
        )
        return score_id

    def get_by_chapter(
        self, novel_id: str, chapter_number: int
    ) -> Optional[dict]:
        row = self.db.fetch_one(
            """
            SELECT score_id, novel_id, chapter_number, adjective_density,
                   avg_sentence_length, sentence_count, similarity_score, computed_at
            FROM chapter_style_scores
            WHERE novel_id = ? AND chapter_number = ?
            """,
            (novel_id, chapter_number),
        )
        return dict(row) if row else None

    def list_by_novel(
        self, novel_id: str, limit: int = 50
    ) -> List[dict]:
        rows = self.db.fetch_all(
            """
            SELECT score_id, novel_id, chapter_number, adjective_density,
                   avg_sentence_length, sentence_count, similarity_score, computed_at
            FROM chapter_style_scores
            WHERE novel_id = ?
            ORDER BY chapter_number ASC
            LIMIT ?
            """,
            (novel_id, limit),
        )
        return [dict(r) for r in rows]
