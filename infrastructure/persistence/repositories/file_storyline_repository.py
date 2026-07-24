"""Compatibility shim: tests expect FileStorylineRepository, implementation is SqliteStorylineRepository.

测试遗留代码用 FileStorage 初始化仓储，但当前实现 SqliteStorylineRepository 需要 DatabaseConnection。
这个 shim 做两件事：
1. 把 FileStorage 适配为 DatabaseConnection（用临时目录下的 .novels.db）
2. 在初始化前设置环境变量，允许测试模式直连 SQLite，绕过持久化队列
"""
from __future__ import annotations

import os
from infrastructure.persistence.database.sqlite_storyline_repository import SqliteStorylineRepository


class FileStorylineRepository(SqliteStorylineRepository):
    """兼容旧测试的 FileStorylineRepository，自动把 FileStorage 适配为 DatabaseConnection。"""

    def __init__(self, storage):
        # 延迟导入避免循环依赖
        from infrastructure.persistence.storage.file_storage import FileStorage
        from infrastructure.persistence.database.connection import DatabaseConnection

        # 测试模式：允许直连 SQLite，绕过持久化队列
        os.environ.setdefault("PLOTPILOT_ALLOW_DIRECT_SQLITE_WRITES", "1")

        if isinstance(storage, FileStorage):
            db_path = str(storage.base_path / ".novels.db")
            db = DatabaseConnection(db_path)
        else:
            db = storage
        super().__init__(db)


__all__ = ["FileStorylineRepository"]
