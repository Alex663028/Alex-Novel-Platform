import sys
from pathlib import Path
sys.path.insert(0, str(Path('.').resolve()))

from fastapi.testclient import TestClient
from interfaces.main import app
from infrastructure.persistence.database.connection import DatabaseConnection
from interfaces.api.dependencies import get_voice_sample_service, get_voice_fingerprint_service
import infrastructure.persistence.database.connection as conn_mod
import interfaces.api.dependencies as deps_mod

SCHEMA_PATH = Path('infrastructure/persistence/database/schema.sql')
db_path = 'F:/小说工具/PlotPilot-Optimized-Source/.pytest_voice_debug.db'
db = DatabaseConnection(db_path)
schema_sql = SCHEMA_PATH.read_text(encoding='utf-8')
db.get_connection().executescript(schema_sql)
db.get_connection().commit()

conn_mod.get_database = lambda: db
deps_mod.get_database = lambda: db

client = TestClient(app)

resp = client.post('/api/v1/novels', json={'novel_id':'debug-voice','title':'Debug','author':'Me','target_chapters':5,'premise':'test'})
print('create:', resp.status_code, resp.json())
novel_id = resp.json()['id']

for i in range(10):
    r = client.post(f'/api/v1/novels/{novel_id}/voice/samples', json={
        'ai_original': f'样本{i+1}AI。', 'author_refined': f'样本{i+1}改稿。', 'chapter_number': i+1, 'scene_type': 'general'
    })
    print(f'sample {i+1}:', r.status_code)

rows = db.fetch_all('SELECT COUNT(*) as c FROM voice_vault WHERE novel_id = ?', (novel_id,))
print('voice_vault count:', rows[0]['c'])

fp_svc = get_voice_fingerprint_service()
print('len samples:', len(fp_svc.sample_repo.get_by_novel(novel_id)))
rows2 = db.fetch_all('SELECT * FROM voice_fingerprint WHERE novel_id = ?', (novel_id,))
print('fingerprint rows:', len(rows2))

resp2 = client.get(f'/api/v1/novels/{novel_id}/voice/fingerprint')
print('fingerprint:', resp2.status_code, resp2.json())
