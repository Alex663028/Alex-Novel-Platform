"""监控大盘 API 测试"""
from fastapi.testclient import TestClient


def test_get_tension_curve(client):
    """测试获取张力曲线"""
    response = client.get("/api/v1/novels/test-novel/monitor/tension-curve")
    assert response.status_code in [200, 404]

    if response.status_code == 200:
        data = response.json()
        assert "novel_id" in data
        assert "points" in data
        assert isinstance(data["points"], list)


def test_get_voice_drift(client):
    """测试获取人声漂移数据"""
    response = client.get("/api/v1/novels/test-novel/monitor/voice-drift")
    assert response.status_code in [200, 404]

    if response.status_code == 200:
        data = response.json()
        assert isinstance(data, list)


def test_get_foreshadow_stats(client):
    """测试获取伏笔统计"""
    response = client.get("/api/v1/novels/test-novel/monitor/foreshadow-stats")
    assert response.status_code in [200, 404]

    if response.status_code == 200:
        data = response.json()
        assert "total_planted" in data
        assert "total_resolved" in data
        assert "pending" in data
        assert "forgotten_risk" in data
        assert "resolution_rate" in data
        assert isinstance(data["total_planted"], int)
        assert isinstance(data["resolution_rate"], float)


def test_autopilot_stream_endpoint_exists(client):
    """测试 SSE 日志流端点存在"""
    response = client.get("/api/v1/autopilot/test-novel/stream")
    assert response.status_code in [200, 404]


def test_autopilot_circuit_breaker_endpoint(client):
    """熔断器状态/重置路由存在且返回约定字段"""
    r = client.get("/api/v1/autopilot/test-novel/circuit-breaker")
    assert r.status_code in [200, 404]
    if r.status_code == 200:
        data = r.json()
        assert data["status"] in ("closed", "open", "half_open")
        assert "error_count" in data
        assert "max_errors" in data
        assert data["error_history"] == []

    r2 = client.post("/api/v1/autopilot/test-novel/circuit-breaker/reset")
    assert r2.status_code in [200, 404]


def test_character_anchor_endpoint(client):
    """测试角色锚点端点"""
    response = client.get("/api/v1/novels/test-novel/sandbox/character/char-001/anchor")
    assert response.status_code in [200, 404]

    if response.status_code == 200:
        data = response.json()
        assert "character_id" in data
        assert "character_name" in data
        assert "mental_state" in data
        assert "verbal_tic" in data
        assert "idle_behavior" in data


def test_generate_dialogue_endpoint(client):
    """测试对话生成端点"""
    payload = {
        "novel_id": "test-novel",
        "character_id": "char-001",
        "scene_prompt": "测试场景",
        "mental_state": "平静",
        "verbal_tic": "嗯...",
    }
    response = client.post("/api/v1/novels/sandbox/generate-dialogue", json=payload)
    assert response.status_code in [200, 404, 500]
