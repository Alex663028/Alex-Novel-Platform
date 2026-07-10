"""Macro Refactor API 集成测试"""
import pytest
from fastapi.testclient import TestClient
from interfaces.main import app


class TestMacroRefactorAPI:
    """Macro Refactor API 集成测试套件"""

    @pytest.fixture
    def client(self):
        """创建测试客户端"""
        return TestClient(app)

    @pytest.fixture
    def setup_test_data(self):
        """设置测试数据"""
        from infrastructure.persistence.database.connection import get_database
        from infrastructure.persistence.database.sqlite_narrative_event_repository import SqliteNarrativeEventRepository

        db = get_database()
        repo = SqliteNarrativeEventRepository(db)

        # 创建测试小说和事件
        novel_id = "test-novel-macro-refactor"

        # 清理旧数据
        db.execute("DELETE FROM narrative_events WHERE novel_id = ?", (novel_id,))
        db.execute("DELETE FROM novels WHERE id = ?", (novel_id,))
        db.get_connection().commit()

        # 创建测试小说
        db.execute(
            "INSERT INTO novels (id, title, slug, target_chapters) VALUES (?, ?, ?, ?)",
            (novel_id, "Test Novel", "test-novel-macro-refactor", 10)
        )
        db.get_connection().commit()

        # 添加测试事件
        repo.append_event(
            novel_id=novel_id,
            chapter_number=1,
            event_summary="主角冲动行事",
            mutations=[],
            tags=["动机:冲动", "情绪:激动"]
        )
        repo.append_event(
            novel_id=novel_id,
            chapter_number=2,
            event_summary="主角愤怒爆发",
            mutations=[],
            tags=["情绪:愤怒", "行为:鲁莽"]
        )
        repo.append_event(
            novel_id=novel_id,
            chapter_number=3,
            event_summary="主角冷静分析",
            mutations=[],
            tags=["动机:理性", "情绪:冷静"]
        )

        yield novel_id

        # 清理测试数据
        db.execute("DELETE FROM narrative_events WHERE novel_id = ?", (novel_id,))
        db.execute("DELETE FROM novels WHERE id = ?", (novel_id,))
        db.get_connection().commit()

    def test_scan_breakpoints_finds_conflicts(self, client, setup_test_data):
        """测试：扫描找到冲突断点"""
        novel_id = setup_test_data

        # 发送请求
        response = client.get(
            f"/api/v1/novels/{novel_id}/macro-refactor/breakpoints",
            params={"trait": "冷酷"}
        )

        # 验证响应
        assert response.status_code == 200
        breakpoints = response.json()

        # 应该找到 2 个冲突（章节 1 和 2）
        assert len(breakpoints) == 2
        assert breakpoints[0]["chapter"] == 1
        assert breakpoints[1]["chapter"] == 2
        assert "冷酷" in breakpoints[0]["reason"]
        assert len(breakpoints[0]["tags"]) > 0

    def test_scan_breakpoints_validation(self, client):
        """测试：验证 trait 参数必需"""
        # 不提供 trait 参数
        response = client.get("/api/v1/novels/test-novel/macro-refactor/breakpoints")

        # 应该返回 422 验证错误
        assert response.status_code == 422

    def test_scan_breakpoints_with_custom_tags(self, client, setup_test_data):
        """测试：使用自定义冲突标签"""
        novel_id = setup_test_data

        # 使用自定义冲突标签
        response = client.get(
            f"/api/v1/novels/{novel_id}/macro-refactor/breakpoints",
            params={
                "trait": "理性",
                "conflict_tags": "动机:冲动,情绪:激动"
            }
        )

        # 验证响应
        assert response.status_code == 200
        breakpoints = response.json()

        # 应该只找到章节 1（包含 "动机:冲动" 或 "情绪:激动"）
        assert len(breakpoints) == 1
        assert breakpoints[0]["chapter"] == 1

    def test_scan_breakpoints_no_conflicts(self, client, setup_test_data):
        """测试：无冲突时返回空列表"""
        novel_id = setup_test_data

        # 使用不会冲突的自定义标签
        response = client.get(
            f"/api/v1/novels/{novel_id}/macro-refactor/breakpoints",
            params={
                "trait": "测试",
                "conflict_tags": "不存在的标签"
            }
        )

        # 验证响应
        assert response.status_code == 200
        breakpoints = response.json()
        assert len(breakpoints) == 0

    @pytest.mark.asyncio
    async def test_generate_proposal(self, client, setup_test_data):
        """测试：生成重构提案"""
        novel_id = setup_test_data

        # 构建请求
        request_data = {
            "event_id": "evt_001",
            "author_intent": "让角色表现得更冷酷",
            "current_event_summary": "角色冲动地救了一个陌生人",
            "current_tags": ["动机:冲动", "情感:同情"]
        }

        # 发送请求
        response = client.post(
            f"/api/v1/novels/{novel_id}/macro-refactor/proposals",
            json=request_data
        )

        # 验证响应
        assert response.status_code == 200
        proposal = response.json()

        # 验证提案结构
        assert "natural_language_suggestion" in proposal
        assert "suggested_mutations" in proposal
        assert "suggested_tags" in proposal
        assert "reasoning" in proposal

        # 验证提案内容不为空
        assert len(proposal["natural_language_suggestion"]) > 0
        assert isinstance(proposal["suggested_mutations"], list)
        assert isinstance(proposal["suggested_tags"], list)
        assert len(proposal["reasoning"]) > 0

    def test_generate_proposal_validation(self, client):
        """测试：验证提案请求参数"""
        novel_id = "test-novel"

        # 缺少必需字段
        invalid_request = {
            "event_id": "evt_001"
            # 缺少其他必需字段
        }

        # 发送请求
        response = client.post(
            f"/api/v1/novels/{novel_id}/macro-refactor/proposals",
            json=invalid_request
        )

        # 应该返回 422 验证错误
        assert response.status_code == 422

    def test_apply_mutations(self, client, setup_test_data):
        """测试：应用 mutations 到事件"""
        novel_id = setup_test_data

        # 获取第一个事件
        from infrastructure.persistence.database.connection import get_database
        from infrastructure.persistence.database.sqlite_narrative_event_repository import SqliteNarrativeEventRepository

        db = get_database()
        repo = SqliteNarrativeEventRepository(db)
        events = repo.list_up_to_chapter(novel_id, 1)
        assert len(events) > 0
        event_id = events[0]["event_id"]

        # 构建 mutations 请求
        request_data = {
            "event_id": event_id,
            "mutations": [
                {"type": "add_tag", "tag": "性格:冷酷"},
                {"type": "remove_tag", "tag": "动机:冲动"},
                {"type": "replace_summary", "new_summary": "主角冷静地拒绝帮助"}
            ],
            "reason": "修正人设冲突"
        }

        # 发送请求
        response = client.post(
            f"/api/v1/novels/{novel_id}/macro-refactor/apply",
            json=request_data
        )

        # 验证响应
        assert response.status_code == 200
        result = response.json()

        # 验证响应结构
        assert result["success"] is True
        assert "updated_event" in result
        assert "applied_mutations" in result

        # 验证更新后的事件
        updated_event = result["updated_event"]
        assert updated_event["event_summary"] == "主角冷静地拒绝帮助"
        assert "性格:冷酷" in updated_event["tags"]
        assert "动机:冲动" not in updated_event["tags"]

        # 验证应用的 mutations
        assert len(result["applied_mutations"]) == 3

        # 验证数据库中的事件已更新
        updated_from_db = repo.get_event(novel_id, event_id)
        assert updated_from_db["event_summary"] == "主角冷静地拒绝帮助"
        assert "性格:冷酷" in updated_from_db["tags"]

    def test_apply_mutations_validation(self, client):
        """测试：验证 mutations 请求参数"""
        novel_id = "test-novel"

        # 缺少必需字段
        invalid_request = {
            "event_id": "evt_001"
            # 缺少 mutations 字段
        }

        # 发送请求
        response = client.post(
            f"/api/v1/novels/{novel_id}/macro-refactor/apply",
            json=invalid_request
        )

        # 应该返回 422 验证错误
        assert response.status_code == 422

    def test_apply_mutations_event_not_found(self, client, setup_test_data):
        """测试：事件不存在时返回 400"""
        novel_id = setup_test_data

        # 使用不存在的 event_id
        request_data = {
            "event_id": "nonexistent-event-id",
            "mutations": [{"type": "add_tag", "tag": "测试"}]
        }

        # 发送请求
        response = client.post(
            f"/api/v1/novels/{novel_id}/macro-refactor/apply",
            json=request_data
        )

        # 应该返回 400 错误
        assert response.status_code == 400

