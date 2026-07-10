"""SQLite-based Cast repository implementation with JSON storage"""
import json
import logging
from typing import Optional
from domain.cast.aggregates.cast_graph import CastGraph
from domain.cast.repositories.cast_repository import CastRepository
from domain.novel.value_objects.novel_id import NovelId
from infrastructure.persistence.mappers.cast_mapper import CastMapper

logger = logging.getLogger(__name__)


class SqliteCastRepository(CastRepository):
    """SQLite-based Cast repository implementation

    Stores cast graphs as JSON blobs in SQLite, combining:
    - Single-file storage (unified with other entities)
    - JSON flexibility (no schema constraints)
    - Transaction support (ACID guarantees)
    """

    def __init__(self, db_connection):
        """Initialize repository

        Args:
            db_connection: DatabaseConnection instance
        """
        self.db = db_connection
        self._ensure_table()

    def _ensure_table(self) -> None:
        """Ensure cast_snapshots table exists"""
        conn = self.db.get_connection()
        conn.execute("""
            CREATE TABLE IF NOT EXISTS cast_snapshots (
                novel_id TEXT PRIMARY KEY,
                data TEXT NOT NULL,
                version INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()

    def save(self, cast_graph: CastGraph) -> None:
        """Save cast graph as JSON blob

        Args:
            cast_graph: Cast graph to save
        """
        novel_id = cast_graph.novel_id.value
        data = CastMapper.to_dict(cast_graph)
        json_data = json.dumps(data, ensure_ascii=False, indent=2)

        conn = self.db.get_connection()
        conn.execute("""
            INSERT INTO cast_snapshots (novel_id, data, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(novel_id) DO UPDATE SET
                data = excluded.data,
                version = version + 1,
                updated_at = CURRENT_TIMESTAMP
        """, (novel_id, json_data))
        conn.commit()

        logger.info(f"Saved cast graph for novel {novel_id}")

    def get_by_novel_id(self, novel_id: NovelId) -> Optional[CastGraph]:
        """Get cast graph by novel ID

        Args:
            novel_id: Novel ID

        Returns:
            Cast graph if found, None otherwise
        """
        cursor = self.db.execute(
            "SELECT data FROM cast_snapshots WHERE novel_id = ?",
            (novel_id.value,)
        )
        row = cursor.fetchone()

        if not row:
            logger.debug(f"Cast graph not found for novel {novel_id.value}")
            return None

        try:
            data = json.loads(row[0])
            cast_graph = CastMapper.from_dict(data, novel_id.value)
            logger.info(f"Loaded cast graph for novel {novel_id.value}")
            return cast_graph
        except Exception as e:
            logger.warning(f"Failed to load cast graph for {novel_id.value}: {str(e)}")
            return None

    def delete(self, novel_id: NovelId) -> None:
        """Delete cast graph by novel ID

        Args:
            novel_id: Novel ID
        """
        conn = self.db.get_connection()
        conn.execute(
            "DELETE FROM cast_snapshots WHERE novel_id = ?",
            (novel_id.value,)
        )
        conn.commit()
        logger.info(f"Deleted cast graph for novel {novel_id.value}")

    def exists(self, novel_id: NovelId) -> bool:
        """Check if cast graph exists for novel

        Args:
            novel_id: Novel ID

        Returns:
            True if exists, False otherwise
        """
        cursor = self.db.execute(
            "SELECT 1 FROM cast_snapshots WHERE novel_id = ? LIMIT 1",
            (novel_id.value,)
        )
        return cursor.fetchone() is not None
