"""
宏观规划合并引擎（Macro Merge Engine）

外科手术级的结构覆写机制：
- 保留有肉的骨头（已写正文的节点）
- 切除多余的空骨头（僵尸节点）
- 嫁接新的骨头（新增节点）
"""

from typing import List, Dict, Set, Optional
from dataclasses import dataclass


@dataclass
class MergePlan:
    """合并计划"""
    creates: List[Dict]  # 需要创建的节点
    updates: List[Dict]  # 需要更新的节点
    deletes: List[str]   # 需要删除的节点 ID
    conflicts: List[Dict]  # 冲突列表
    has_fatal_conflict: bool  # 是否有致命冲突
    summary: Dict  # 合并摘要（用于前端渐进式提示）


class MergeConflictException(Exception):
    """合并冲突异常"""
    def __init__(self, message: str, conflicts: List[Dict]):
        super().__init__(message)
        self.conflicts = conflicts


class MacroMergeEngine:
    """宏观规划合并引擎

    核心算法：
    1. 自底向上标记承载者（Bottom-Up Contagion）
    2. 三路比对（create/update/delete）
    3. 冲突检测（红色阻断）
    4. 生成渐进式提示（绿/黄/红）
    """

    def __init__(self, old_nodes: List[Dict], new_nodes: List[Dict]):
        """初始化合并引擎

        Args:
            old_nodes: 旧结构节点列表（从数据库读取，已标准化为 Dict）
            new_nodes: 新结构节点列表（从前端传入，已标准化为 Dict）
        """
        # 将列表转化为哈希表，实现 O(1) 匹配
        self.old_map = {node['id']: node for node in old_nodes}
        self.new_map = {node['id']: node for node in new_nodes}

        self.to_create: List[Dict] = []
        self.to_update: List[Dict] = []
        self.to_delete: List[str] = []
        self.conflicts: List[Dict] = []

    def _mark_carriers_bottom_up(self) -> Set[str]:
        """自底向上标记承载者（Bottom-Up Contagion）

        核心逻辑：
        - 找到所有 CHAPTER 节点（正文节点）
        - 回溯其所有祖先（Act → Volume → Part）
        - 将祖先节点标记为 carrier（承载者）

        Returns:
            所有 carrier_id 的集合（免死金牌）
        """
        carrier_ids = set()

        # 找到所有正文节点（Chapter）
        chapter_nodes = [n for n in self.old_map.values() if n['node_type'] == 'CHAPTER']

        for chapter in chapter_nodes:
            # Chapter 本身有内容，回溯其所有祖先
            current_id = chapter.get('parent_id')
            while current_id and current_id in self.old_map:
                carrier_ids.add(current_id)
                current_id = self.old_map[current_id].get('parent_id')

        return carrier_ids

    def execute_diff(self) -> MergePlan:
        """执行比对逻辑（三路比对）

        Returns:
            合并计划（MergePlan）
        """
        carriers = self._mark_carriers_bottom_up()

        # 1. 遍历旧结构（寻找需要更新、删除或引发冲突的节点）
        for old_id, old_node in self.old_map.items():
            # 跳过 Chapter 节点（我们只 merge 宏观框架）
            if old_node['node_type'] == 'CHAPTER':
                continue

            if old_id in self.new_map:
                # 场景 C：新旧都有 -> 安全合并（换皮不换骨）
                new_node = self.new_map[old_id]
                updated_node = {
                    'id': old_id,
                    'title': new_node['title'],
                    'description': new_node.get('description', ''),
                    'order_index': new_node['order_index']
                }
                self.to_update.append(updated_node)
            else:
                # 场景 A/B：旧的有，新的没有 -> 判断是否可以删除
                if old_id in carriers:
                    # 致命冲突：新大纲试图删除一个里面有正文的卷/幕！
                    self.conflicts.append({
                        "node_id": old_id,
                        "title": old_node['title'],
                        "node_type": old_node['node_type'],
                        "reason": f"新结构删除了包含已有正文章节的节点 [{old_node['title']}]"
                    })
                else:
                    # 纯空壳，安全删除
                    self.to_delete.append(old_id)

        # 2. 遍历新结构（寻找需要新建的节点）
        for new_id, new_node in self.new_map.items():
            if new_id not in self.old_map:
                self.to_create.append(new_node)

        # 3. 构造合并计划返回
        return MergePlan(
            creates=self.to_create,
            updates=self.to_update,
            deletes=self.to_delete,
            conflicts=self.conflicts,
            has_fatal_conflict=len(self.conflicts) > 0,
            summary=self._generate_summary()
        )

    def _generate_summary(self) -> Dict:
        """生成给前端的渐进式提示状态

        Returns:
            summary 字典，包含 status（GREEN/YELLOW/RED）和 message
        """
        # 检查是否是纯空结构（没有任何 Chapter 节点）
        is_pure_empty = all(n['node_type'] != 'CHAPTER' for n in self.old_map.values())

        if len(self.conflicts) > 0:
            # 红色阻断：发现数据冲突
            return {
                "status": "RED",
                "message": "发现数据冲突，重构被阻断。",
                "conflicts": self.conflicts
            }
        elif is_pure_empty:
            # 绿色通路：覆盖空框架
            return {
                "status": "GREEN",
                "message": f"覆盖空框架。新增 {len(self.to_create)} 个节点，删除 {len(self.to_delete)} 个空节点。",
                "creates": len(self.to_create),
                "updates": len(self.to_update),
                "deletes": len(self.to_delete)
            }
        else:
            # 黄色通路：安全合并
            return {
                "status": "YELLOW",
                "message": f"安全合并。保留已有正文，更新 {len(self.to_update)} 个节点信息，修剪 {len(self.to_delete)} 个多余空节点。",
                "creates": len(self.to_create),
                "updates": len(self.to_update),
                "deletes": len(self.to_delete)
            }
