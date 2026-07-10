"""FileStorage 集成测试"""
import pytest
import tempfile
import shutil
from pathlib import Path
from infrastructure.persistence.storage.file_storage import FileStorage


class TestFileStorage:
    """FileStorage 集成测试"""

    @pytest.fixture
    def temp_dir(self):
        """创建临时目录"""
        temp_path = tempfile.mkdtemp()
        yield Path(temp_path)
        shutil.rmtree(temp_path)

    @pytest.fixture
    def storage(self, temp_dir):
        """创建 FileStorage 实例"""
        return FileStorage(temp_dir)

    def test_read_write_json(self, storage, temp_dir):
        """测试读写 JSON 文件"""
        data = {"name": "test", "value": 123}
        path = "test.json"

        storage.write_json(path, data)
        result = storage.read_json(path)

        assert result == data
        assert (temp_dir / path).exists()

    def test_read_write_text(self, storage, temp_dir):
        """测试读写文本文件"""
        content = "Hello, World!\n测试内容"
        path = "test.txt"

        storage.write_text(path, content)
        result = storage.read_text(path)

        assert result == content
        assert (temp_dir / path).exists()

    def test_exists(self, storage):
        """测试文件存在性检查"""
        path = "test.json"

        assert not storage.exists(path)

        storage.write_json(path, {})
        assert storage.exists(path)

    def test_delete(self, storage, temp_dir):
        """测试删除文件"""
        path = "test.json"
        storage.write_json(path, {})

        assert storage.exists(path)

        storage.delete(path)
        assert not storage.exists(path)
        assert not (temp_dir / path).exists()

    def test_list_files(self, storage):
        """测试列出文件"""
        storage.write_json("file1.json", {})
        storage.write_json("file2.json", {})
        storage.write_text("file3.txt", "")

        files = storage.list_files("*.json")
        assert len(files) == 2
        assert "file1.json" in files
        assert "file2.json" in files

    def test_nested_paths(self, storage, temp_dir):
        """测试嵌套路径"""
        path = "dir1/dir2/test.json"
        data = {"nested": True}

        storage.write_json(path, data)
        result = storage.read_json(path)

        assert result == data
        assert (temp_dir / path).exists()

    def test_read_nonexistent_file(self, storage):
        """测试读取不存在的文件"""
        with pytest.raises(FileNotFoundError):
            storage.read_json("nonexistent.json")

    def test_delete_nonexistent_file(self, storage):
        """测试删除不存在的文件（应该不报错）"""
        storage.delete("nonexistent.json")  # 不应该抛出异常
