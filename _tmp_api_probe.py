import tempfile, os
from pathlib import Path
from fastapi.testclient import TestClient
from interfaces.main import app
from infrastructure.persistence.database.connection import DatabaseConnection

SCHEMA = Path('infrastructure/persistence/database/schema.sql').read_text(encoding='utf-8')
fd, db_path = tempfile.mkstemp(suffix='.db')
os.close(fd)
db = DatabaseConnection(db_path)
db.get_connection().executescript(SCHEMA)
db.get_connection().commit()

import infrastructure.persistence.database.connection as conn_mod
conn_mod._db_instance = None
conn_mod._db_instances_by_path.clear()

from unittest.mock import patch
with patch('infrastructure.persistence.database.connection.get_database', return_value=db), \
     patch('interfaces.api.dependencies.get_database', return_value=db):
    client = TestClient(app)
    r = client.post('/api/v1/novels/', json={'novel_id':'test-novel-5','title':'T5','author':'A5','target_chapters':3})
    print('create novel', r.status_code, r.text[:200])
    r2 = client.post('/api/v1/novels/test-novel-5/chapters', json={'chapter_id':'chapter-1','number':1,'title':'第一章','content':'第一章内容'})
    print('create chapter', r2.status_code, r2.text[:400])
    r3 = client.get('/api/v1/novels/test-novel-5/chapters/1')
    print('get chapter', r3.status_code, r3.text[:400])

    r = client.post('/api/v1/novels/', json={'novel_id':'test-novel-6','title':'T6','author':'A6','target_chapters':5})
    print('create novel2', r.status_code, r.text[:200])
    r4 = client.post('/api/v1/bible/novels/test-novel-6/world-settings', json={'setting_id':'world-1','name':'世界观','description':'测试世界观','setting_type':'world'})
    print('create world', r4.status_code, r4.text[:400])

try:
    db.close()
except Exception:
    pass
try:
    os.unlink(db_path)
except OSError:
    pass
