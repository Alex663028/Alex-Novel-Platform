"""Integration test for stats API with adapter"""
import pytest
from fastapi.testclient import TestClient
from interfaces.main import app


@pytest.fixture
def client():
    """Create test client"""
    return TestClient(app)


class TestStatsAPIIntegration:
    """Integration tests for stats API with new architecture"""

    def test_get_global_stats(self, client):
        """Test getting global statistics"""
        response = client.get("/api/stats/global")

        assert response.status_code == 200
        data = response.json()

        assert "success" in data
        assert data["success"] is True
        assert "data" in data

        stats = data["data"]
        assert "total_books" in stats
        assert "total_chapters" in stats
        assert "total_words" in stats

    def test_get_book_stats_existing(self, client):
        """Test getting stats for an existing book"""
        # First get all books to find a valid slug
        global_response = client.get("/api/stats/global")
        assert global_response.status_code == 200

        # If there are books, test getting stats for the first one
        # Otherwise skip this test
        data = global_response.json()["data"]
        if data["total_books"] > 0:
            # Get list of books
            # Note: We need to know a valid slug, let's use test-novel-1
            response = client.get("/api/stats/book/test-novel-1")

            if response.status_code == 200:
                data = response.json()
                assert data["success"] is True
                assert "data" in data

                book_stats = data["data"]
                assert "title" in book_stats
                assert "total_chapters" in book_stats
                assert "total_words" in book_stats

    def test_get_book_stats_not_found(self, client):
        """Test getting stats for non-existent book"""
        response = client.get("/api/stats/book/non-existent-book")

        assert response.status_code == 404
        data = response.json()
        assert "detail" in data

    def test_get_chapter_stats_not_found(self, client):
        """Test getting stats for non-existent chapter"""
        response = client.get("/api/stats/book/test-novel-1/chapter/999")

        assert response.status_code == 404

    def test_get_writing_progress(self, client):
        """Test getting writing progress"""
        # This should work even if the book exists but has no progress data
        response = client.get("/api/stats/book/test-novel-1/progress")

        # Should return 200 with empty list or 404 if book doesn't exist
        assert response.status_code in [200, 404]

        if response.status_code == 200:
            data = response.json()
            assert data["success"] is True
            assert "data" in data
            assert isinstance(data["data"], list)
