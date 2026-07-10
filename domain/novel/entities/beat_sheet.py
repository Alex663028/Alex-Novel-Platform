"""节拍表实体

节拍表（Beat Sheet）是章节的场景列表，用于指导正文生成
"""

from typing import List
from domain.shared.base_entity import BaseEntity
from domain.novel.value_objects.scene import Scene


class BeatSheet(BaseEntity):
    """节拍表实体

    包含章节的所有场景，按顺序排列
    """

    def __init__(
        self,
        id: str,
        chapter_id: str,
        scenes: List[Scene]
    ):
        super().__init__(id)
        self.chapter_id = chapter_id
        self.scenes = scenes

    def get_scene_count(self) -> int:
        """获取场景数量"""
        return len(self.scenes)

    def get_total_estimated_words(self) -> int:
        """获取预估总字数"""
        return sum(scene.estimated_words for scene in self.scenes)

    def get_scene_by_index(self, index: int) -> Scene:
        """按索引获取场景"""
        if index < 0 or index >= len(self.scenes):
            raise IndexError(f"Scene index {index} out of range")
        return self.scenes[index]

    def validate(self) -> bool:
        """验证节拍表"""
        if not self.scenes:
            raise ValueError("Beat sheet must have at least one scene")

        # 验证场景顺序
        for i, scene in enumerate(self.scenes):
            if scene.order_index != i:
                raise ValueError(f"Scene order mismatch: expected {i}, got {scene.order_index}")

        return True
