"""测试依赖注入配置"""
import os
import pytest
from unittest.mock import patch, MagicMock
import interfaces.api.dependencies as dependencies


class TestGetVectorStore:
    """测试 get_vector_store 依赖注入函数"""

    def setup_method(self):
        dependencies._vector_store_singleton = None
        dependencies._vector_store_init_failed = False
        try:
            from interfaces.api.container import get_container
            container = get_container()
            container._vector_store = None
            container._vector_store_init_failed = False
        except Exception:
            pass

    def test_get_vector_store_returns_instance_from_container(self):
        """未禁用时返回容器中的向量存储实例。"""
        with patch.dict(os.environ, {"VECTOR_STORE_ENABLED": "true"}, clear=True):
            with patch("interfaces.api.deps.services.get_container") as mock_get_container:
                mock_instance = MagicMock()
                mock_container = MagicMock()
                mock_container.get_vector_store.return_value = mock_instance
                mock_get_container.return_value = mock_container

                result = dependencies.get_vector_store()

                assert result is mock_instance
                mock_container.get_vector_store.assert_called_once()

    def test_get_vector_store_returns_none_when_disabled(self):
        """VECTOR_STORE_ENABLED 为 false 时返回 None。"""
        with patch.dict(os.environ, {"VECTOR_STORE_ENABLED": "false"}, clear=True):
            with patch("interfaces.api.deps.services.get_container") as mock_get_container:
                mock_instance = MagicMock()
                mock_container = MagicMock()
                mock_container.get_vector_store.return_value = None
                mock_get_container.return_value = mock_container

                result = dependencies.get_vector_store()

                assert result is None

    def test_get_vector_store_returns_qdrant_when_legacy_env_set(self):
        """兼容旧版 QDRANT_ENABLED=true 配置。"""
        with patch.dict(os.environ, {
            "QDRANT_ENABLED": "true",
            "QDRANT_HOST": "localhost",
            "QDRANT_PORT": "6333"
        }, clear=True):
            with patch("interfaces.api.deps.services.get_container") as mock_get_container:
                mock_instance = MagicMock()
                mock_container = MagicMock()
                mock_container.get_vector_store.return_value = mock_instance
                mock_get_container.return_value = mock_container

                result = dependencies.get_vector_store()

                assert result is mock_instance

    def test_get_vector_store_returns_qdrant_when_store_type_set(self):
        """显式设置 VECTOR_STORE_TYPE=qdrant 时返回 QdrantVectorStore 实例。"""
        with patch.dict(os.environ, {
            "VECTOR_STORE_TYPE": "qdrant",
            "QDRANT_HOST": "localhost",
            "QDRANT_PORT": "6333"
        }, clear=True):
            with patch("interfaces.api.deps.services.get_container") as mock_get_container:
                mock_instance = MagicMock()
                mock_container = MagicMock()
                mock_container.get_vector_store.return_value = mock_instance
                mock_get_container.return_value = mock_container

                result = dependencies.get_vector_store()

                assert result is mock_instance

    def test_get_vector_store_with_custom_host_port(self):
        """使用自定义 host 和 port"""
        with patch.dict(os.environ, {
            "VECTOR_STORE_TYPE": "qdrant",
            "QDRANT_HOST": "qdrant.example.com",
            "QDRANT_PORT": "6334"
        }, clear=True):
            with patch("interfaces.api.deps.services.get_container") as mock_get_container:
                mock_instance = MagicMock()
                mock_container = MagicMock()
                mock_container.get_vector_store.return_value = mock_instance
                mock_get_container.return_value = mock_container

                result = dependencies.get_vector_store()

                assert result is mock_instance

    def test_get_vector_store_with_api_key(self):
        """使用 API key"""
        with patch.dict(os.environ, {
            "VECTOR_STORE_TYPE": "qdrant",
            "QDRANT_HOST": "localhost",
            "QDRANT_PORT": "6333",
            "QDRANT_API_KEY": "test-api-key"
        }, clear=True):
            with patch("interfaces.api.deps.services.get_container") as mock_get_container:
                mock_instance = MagicMock()
                mock_container = MagicMock()
                mock_container.get_vector_store.return_value = mock_instance
                mock_get_container.return_value = mock_container

                result = dependencies.get_vector_store()

                assert result is mock_instance

    def test_get_vector_store_uses_qdrant_default_values(self):
        """只设置 qdrant 类型时使用默认 host/port。"""
        with patch.dict(os.environ, {
            "VECTOR_STORE_TYPE": "qdrant"
        }, clear=True):
            with patch("interfaces.api.deps.services.get_container") as mock_get_container:
                mock_instance = MagicMock()
                mock_container = MagicMock()
                mock_container.get_vector_store.return_value = mock_instance
                mock_get_container.return_value = mock_container

                result = dependencies.get_vector_store()

                assert result is mock_instance

    def test_get_vector_store_returns_chromadb_by_default(self):
        """未指定类型时默认使用 ChromaDB。"""
        with patch.dict(os.environ, {}, clear=True):
            with patch("interfaces.api.deps.services.get_container") as mock_get_container:
                mock_instance = MagicMock()
                mock_container = MagicMock()
                mock_container.get_vector_store.return_value = mock_instance
                mock_get_container.return_value = mock_container

                result = dependencies.get_vector_store()

                assert result is mock_instance
