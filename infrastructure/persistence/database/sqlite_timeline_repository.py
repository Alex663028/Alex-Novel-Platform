"""SQLite 时间线仓储实现"""
import json
import logging
from typing import Optional
from domain.novel.repositories.timeline_repository import TimelineRepository
from domain.novel.entities.timeline_registry import TimelineRegistry
from domain.novel.value_objects.novel_id import NovelId
from domain.novel.value_objects.timeline_event import TimelineEvent
from infrastructure.persistence.database.connection import DatabaseConnection

logger = logging.getLogger(__name__)


class SqliteTimelineRepository(TimelineRepository):
    """SQLite 时间线仓储实现

    使用 JSON Blob 存储时间线事件列表
    """

    def __init__(self, db: DatabaseConnection):
        self.db = db
        self._ensure_table()

    def _ensure_table(self) -> None:
        """确保表存在"""
        self.db.execute("""
            CREATE TABLE IF NOT EXISTS timeline_registries (
                novel_id TEXT PRIMARY KEY,
                data JSON NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn = self.db.get_connection()
        conn.commit()

    def save(self, registry: TimelineRegistry) -> None:
        """保存时间线注册表"""
        data = {
            "id": registry.id,
            "novel_id": registry.novel_id.value,
            "events": [
                {
                    "id": e.id,
                    "chapter_number": e.chapter_number,
                    "event": e.event,
                    "timestamp": e.timestamp,
                    "timestamp_type": e.timestamp_type
                }
                for e in registry.events
            ]
        }

        conn = self.db.get_connection()
        conn.execute(
            "INSERT OR REPLACE INTO timeline_registries (novel_id, data, updated_at) VALUES (?, json(?), CURRENT_TIMESTAMP)",
            (registry.novel_id.value, json.dumps(data))
        )
        conn.commit()
        logger.debug(f"Saved TimelineRegistry for novel {registry.novel_id.value}")

    def get_by_novel_id(self, novel_id: NovelId) -> Optional[TimelineRegistry]:
        """根据小说ID获取时间线注册表"""
        cursor = self.db.execute(
            "SELECT data FROM timeline_registries WHERE novel_id = ?",
            (novel_id.value,)
        )
        row = cursor.fetchone()
        if not row:
            return None

        data = json.loads(row[0])
        events = [
            TimelineEvent(
                id=e["id"],
                chapter_number=e["chapter_number"],
                event=e["event"],
                timestamp=e["timestamp"],
                timestamp_type=e["timestamp_type"]
            )
            for e in data.get("events", [])
        ]

        return TimelineRegistry(
            id=data["id"],
            novel_id=NovelId(data["novel_id"]),
            events=events
        )

    def delete(self, novel_id: NovelId) -> None:
        """删除时间线注册表"""
        conn = self.db.get_connection()
        conn.execute(
            "DELETE FROM timeline_registries WHERE novel_id = ?",
            (novel_id.value,)
        )
        conn.commit()
        logger.debug(f"Deleted TimelineRegistry for novel {novel_id.value}")
