"""SQLite Entity Base Repository 实现"""
import json
import logging
from typing import Optional
from uuid import uuid4
from domain.novel.repositories.entity_base_repository import EntityBaseRepository
from infrastructure.persistence.database.connection import DatabaseConnection

logger = logging.getLogger(__name__)


class SqliteEntityBaseRepository(EntityBaseRepository):
    """SQLite Entity Base Repository 实现"""

    def __init__(self, db: DatabaseConnection):
        self.db = db

    def get_by_id(self, entity_id: str) -> Optional[dict]:
        """根据 ID 获取实体基座

        Args:
            entity_id: 实体 ID

        Returns:
            实体字典，如果不存在返回 None
        """
        sql = "SELECT * FROM entity_base WHERE id = ?"
        row = self.db.fetch_one(sql, (entity_id,))

        if not row:
            return None

        entity = dict(row)
        # 反序列化 core_attributes JSON
        entity["core_attributes"] = json.loads(entity["core_attributes"])
        return entity

    def create(
        self,
        novel_id: str,
        entity_type: str,
        name: str,
        core_attributes: dict
    ) -> str:
        """创建新实体基座

        Args:
            novel_id: 小说 ID
            entity_type: 实体类型
            name: 实体名称
            core_attributes: 核心属性字典

        Returns:
            新创建的实体 ID
        """
        entity_id = str(uuid4())
        core_attributes_json = json.dumps(core_attributes, ensure_ascii=False)

        sql = """
            INSERT INTO entity_base (id, novel_id, entity_type, name, core_attributes)
            VALUES (?, ?, ?, ?, ?)
        """
        self.db.execute(sql, (entity_id, novel_id, entity_type, name, core_attributes_json))
        self.db.get_connection().commit()

        logger.info(f"Created entity {entity_id} ({entity_type}: {name}) for novel {novel_id}")
        return entity_id
