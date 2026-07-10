#!/usr/bin/env python3
"""
运行数据库迁移脚本
解决日志中的数据库错误：
1. no such table: macro_diagnosis_results
2. no such column: key_events
"""

import sys
import sqlite3
from pathlib import Path

# 添加项目路径以便导入模块
sys.path.insert(0, str(Path(__file__).parent.parent))

from infrastructure.persistence.database.connection import _apply_migration_files

def run_migrations():
    """执行数据库迁移"""
    print("=" * 60)
    print("开始运行数据库迁移")
    print("解决以下错误：")
    print("1. no such table: macro_diagnosis_results")
    print("2. no such column: key_events")
    print("=" * 60)
    
    # 获取数据库路径
    from application.paths import get_db_path
    db_path = get_db_path()
    
    print(f"数据库路径: {db_path}")
    
    if not Path(db_path).exists():
        print(f"✗ 数据库文件不存在: {db_path}")
        sys.exit(1)
    
    try:
        # 连接数据库并应用迁移
        conn = sqlite3.connect(str(db_path))
        conn.row_factory = sqlite3.Row
        
        print("\n应用迁移文件...")
        _apply_migration_files(conn)
        
        # 验证迁移结果
        print("\n验证迁移结果...")
        
        # 检查 macro_diagnosis_results 表
        cur = conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='macro_diagnosis_results'"
        )
        if cur.fetchone():
            print("✓ macro_diagnosis_results 表已创建")
        else:
            print("✗ macro_diagnosis_results 表未找到")
        
        # 检查 chapter_summaries 表的 key_events 列
        cur = conn.execute("PRAGMA table_info(chapter_summaries)")
        columns = {row[1] for row in cur.fetchall()}
        
        required_columns = ['key_events', 'open_threads', 'consistency_note', 'beat_sections', 'micro_beats', 'sync_status']
        for col in required_columns:
            if col in columns:
                print(f"✓ chapter_summaries 表的 {col} 列已存在")
            else:
                print(f"✗ chapter_summaries 表的 {col} 列缺失")
        
        conn.close()
        
        print("\n" + "=" * 60)
        print("✅ 数据库迁移完成！")
        print("现在应该可以解决日志中的数据库错误。")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n✗ 迁移失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    run_migrations()