"""SQLite 仓储统一基类。

提供连接持有、JSON 序列化、事务上下文管理、通用 upsert/fetch helper，
供各领域仓储复用，降低重复样板代码。
"""
import json
import sqlite3
from contextlib import contextmanager
from typing import Any, Dict, List, Optional, Tuple


def _serialize(value: Any) -> Any:
    """把需要 JSON 存储的字段序列化；基本类型原样返回。"""
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    return json.dumps(value, ensure_ascii=False)


def _deserialize(value: Any) -> Any:
    """把 JSON 字符串还原为 Python 对象；失败则返回原值。"""
    if isinstance(value, str):
        try:
            return json.loads(value)
        except (json.JSONDecodeError, TypeError):
            return value
    return value


class BaseSqliteRepository:
    """SQLite 仓储基类。

    子类只需设置 ``table`` 与 ``columns``（列名元组），
    即可获得 ``fetch_by_id`` / ``fetch_all`` / ``upsert`` 等通用能力。
    """

    table: str = ""
    columns: Tuple[str, ...] = ()

    def __init__(self, db_path: str):
        self._db_path = db_path

    @contextmanager
    def _connect(self):
        conn = sqlite3.connect(self._db_path)
        conn.row_factory = sqlite3.Row
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    @contextmanager
    def transaction(self):
        """事务上下文：在连接上开启 deferred 事务，异常自动回滚。"""
        conn = sqlite3.connect(self._db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("BEGIN")
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()

    def fetch_by_id(self, row_id: str, id_column: str = "id") -> Optional[Dict[str, Any]]:
        if not self.table:
            raise NotImplementedError("子类必须声明 table")
        with self._connect() as conn:
            cur = conn.execute(
                f"SELECT * FROM {self.table} WHERE {id_column} = ?", (row_id,)
            )
            row = cur.fetchone()
            if row is None:
                return None
            return {k: _deserialize(v) for k, v in dict(row).items()}

    def fetch_all(self, where: Optional[str] = None, params: Tuple = ()) -> List[Dict[str, Any]]:
        if not self.table:
            raise NotImplementedError("子类必须声明 table")
        sql = f"SELECT * FROM {self.table}"
        if where:
            sql += f" WHERE {where}"
        with self._connect() as conn:
            rows = conn.execute(sql, params).fetchall()
            return [{k: _deserialize(v) for k, v in dict(r).items()} for r in rows]

    def upsert(self, row_id: str, values: Dict[str, Any], id_column: str = "id") -> None:
        """按 id 存在性插入或更新（SQLite upsert）。"""
        if not self.table:
            raise NotImplementedError("子类必须声明 table")
        merged = dict(values)
        merged[id_column] = row_id
        cols = list(merged.keys())
        placeholders = ", ".join("?" for _ in cols)
        col_sql = ", ".join(cols)
        update_sql = ", ".join(f"{c} = excluded.{c}" for c in cols if c != id_column)
        sql = (
            f"INSERT INTO {self.table} ({col_sql}) VALUES ({placeholders}) "
            f"ON CONFLICT({id_column}) DO UPDATE SET {update_sql}"
        )
        args = [_serialize(merged[c]) for c in cols]
        with self._connect() as conn:
            conn.execute(sql, args)

    def exists(self, row_id: str, id_column: str = "id") -> bool:
        if not self.table:
            raise NotImplementedError("子类必须声明 table")
        with self._connect() as conn:
            cur = conn.execute(
                f"SELECT 1 FROM {self.table} WHERE {id_column} = ? LIMIT 1", (row_id,)
            )
            return cur.fetchone() is not None

    def delete(self, row_id: str, id_column: str = "id") -> None:
        if not self.table:
            raise NotImplementedError("子类必须声明 table")
        with self._connect() as conn:
            conn.execute(f"DELETE FROM {self.table} WHERE {id_column} = ?", (row_id,))
