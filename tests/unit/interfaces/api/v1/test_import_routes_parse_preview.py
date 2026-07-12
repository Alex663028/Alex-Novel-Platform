"""parse-preview 拆分端点的回归测试。

覆盖:
- POST /import/parse-preview/text (JSON) 正常解析
- POST /import/parse-preview/file (multipart) 正常解析
- 旧混合端点 /import/parse-preview 应 404 (已移除)
- 空内容返回 400 而非 422
"""
import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

from interfaces.api.v1.import_routes import router

SAMPLE = """# 我的小说
## 基本信息
作者：张三
类型：都市
目标章节：100

## 故事梗概
程序员逆袭的故事。

## 角色
- 李雷
- 韩梅梅

## 世界观设定
现代都市，科技发达。

## 剧情结构
第一卷：开端
  第一章：相遇
"""


@pytest.fixture
def client():
    app = FastAPI()
    app.include_router(router)
    return TestClient(app)


def test_parse_preview_text_ok(client):
    r = client.post("/import/parse-preview/text", json={"content": SAMPLE})
    assert r.status_code == 200
    body = r.json()
    assert body["preview"]["title"] == "我的小说"
    assert body["preview"]["author"] == "张三"
    assert "premise" in body["missing"] or "locations" in body["missing"]


def test_parse_preview_file_ok(client):
    r = client.post(
        "/import/parse-preview/file",
        files={"file": ("t.md", SAMPLE.encode("utf-8"))},
        data={},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["preview"]["title"] == "我的小说"


def test_old_mixed_endpoint_gone(client):
    # 旧 /import/parse-preview 已拆分移除，应 404
    r = client.post("/import/parse-preview", json={"content": SAMPLE})
    assert r.status_code == 404


def test_parse_preview_text_empty_400_not_422(client):
    # 空内容应返回 400，绝不能是 422（422 是之前 bug 的表现）
    r = client.post("/import/parse-preview/text", json={"content": "   "})
    assert r.status_code == 400
    assert r.status_code != 422


def test_parse_preview_file_wrong_ext_400(client):
    r = client.post(
        "/import/parse-preview/file",
        files={"file": ("t.exe", b"garbage")},
        data={},
    )
    assert r.status_code == 400
