"""初始化数据库

使用方法：
    python scripts/init_database.py

功能：
1. 读取 schema.sql
2. 创建所有表和索引
3. 验证数据库结构
"""
import sys
import sqlite3
from pathlib import Path

# 添加项目根目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent))


def main():
    """主函数"""
    project_root = Path(__file__).parent.parent
    schema_file = project_root / "infrastructure" / "persistence" / "database" / "schema.sql"
    db_file = project_root / "data" / "novels.db"

    # 确保 data 目录存在
    db_file.parent.mkdir(parents=True, exist_ok=True)

    print(f"📂 Schema 文件: {schema_file}")
    print(f"📂 数据库文件: {db_file}")

    # 读取 schema
    with open(schema_file, 'r', encoding='utf-8') as f:
        schema_sql = f.read()

    # 创建数据库
    conn = sqlite3.connect(str(db_file))
    cursor = conn.cursor()

    print("\n🔨 执行 schema.sql...")
    cursor.executescript(schema_sql)
    conn.commit()

    # 验证表结构
    print("\n✅ 验证表结构:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = cursor.fetchall()
    for table in tables:
        print(f"  - {table[0]}")

    # 验证 novels 表字段
    print("\n✅ 验证 novels 表字段:")
    cursor.execute("PRAGMA table_info(novels)")
    columns = cursor.fetchall()
    for col in columns:
        print(f"  - {col[1]} ({col[2]})")

    conn.close()
    print("\n🎉 数据库初始化完成！")


if __name__ == "__main__":
    main()
