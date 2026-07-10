"""冲突检测服务 - 检测大纲与设定库的冲突"""
import logging
from typing import List, Dict, Optional
from application.audit.dtos.ghost_annotation import GhostAnnotation
from application.engine.dtos.scene_director_dto import SceneDirectorAnalysis

logger = logging.getLogger(__name__)


class ConflictDetectionService:
    """冲突检测服务

    检测章节大纲与设定库（Bible）之间的冲突：
    - 设定冲突：大纲中的行为与实体当前状态矛盾
    - 角色不一致：角色行为与性格设定不符
    - 时间线错误：事件顺序或时间不合理

    核心理念：大纲绝对意志 + 异步后置审查
    - 不阻断生成流程
    - 只在生成后提供非侵入式批注
    - 把最终决策权留给作者
    """

    def detect(
        self,
        outline: str,
        entity_states: Dict[str, Dict],
        name_to_entity_id: Dict[str, str],
        scene_director: Optional[SceneDirectorAnalysis] = None
    ) -> List[GhostAnnotation]:
        """检测冲突并返回批注列表

        Args:
            outline: 章节大纲
            entity_states: 实体当前状态字典 {entity_id: {attribute: value}}
            name_to_entity_id: 实体名称到 ID 的映射 {name: entity_id}
            scene_director: 场记分析结果（可选，用于提取实体和行为）

        Returns:
            GhostAnnotation 列表
        """
        annotations = []

        try:
            # 如果没有实体状态，无法检测冲突
            if not entity_states:
                logger.debug("No entity states provided, skipping conflict detection")
                return annotations

            # 从大纲中提取实体和行为
            entity_actions = self._extract_entity_actions(outline, name_to_entity_id, scene_director)

            # 检测每个实体的行为是否与状态冲突
            for entity_name, actions in entity_actions.items():
                entity_id = name_to_entity_id.get(entity_name)
                if not entity_id:
                    continue

                current_state = entity_states.get(entity_id, {})
                if not current_state:
                    continue

                # 检测设定冲突
                conflicts = self._check_setting_conflicts(
                    entity_name, entity_id, actions, current_state
                )
                annotations.extend(conflicts)

            logger.info(f"Conflict detection completed: {len(annotations)} annotations")
            return annotations

        except Exception as e:
            logger.error(f"Conflict detection failed: {e}", exc_info=True)
            return annotations

    def _extract_entity_actions(
        self,
        outline: str,
        name_to_entity_id: Dict[str, str],
        scene_director: Optional[SceneDirectorAnalysis] = None
    ) -> Dict[str, List[str]]:
        """从大纲中提取实体和行为

        Args:
            outline: 章节大纲
            name_to_entity_id: 实体名称到 ID 的映射
            scene_director: 场记分析结果（可选）

        Returns:
            {entity_name: [action1, action2, ...]}
        """
        entity_actions = {}

        # 简单的关键词匹配（MVP 版本）
        # 未来可以用 LLM 进行更精确的提取
        outline_lower = outline.lower()

        for entity_name in name_to_entity_id.keys():
            if entity_name.lower() not in outline_lower:
                continue

            actions = []

            # 检测魔法/能力相关行为
            magic_keywords = [
                ("火球", "fire_magic"),
                ("火系", "fire_magic"),
                ("火焰", "fire_magic"),
                ("水球", "water_magic"),
                ("水系", "water_magic"),
                ("冰系", "ice_magic"),
                ("雷电", "lightning_magic"),
                ("风系", "wind_magic"),
            ]

            for keyword, action_type in magic_keywords:
                if keyword in outline:
                    actions.append(action_type)

            # 检测武器相关行为
            weapon_keywords = [
                ("拔剑", "use_sword"),
                ("挥剑", "use_sword"),
                ("射箭", "use_bow"),
                ("开枪", "use_gun"),
            ]

            for keyword, action_type in weapon_keywords:
                if keyword in outline:
                    actions.append(action_type)

            if actions:
                entity_actions[entity_name] = actions

        return entity_actions

    def _check_setting_conflicts(
        self,
        entity_name: str,
        entity_id: str,
        actions: List[str],
        current_state: Dict
    ) -> List[GhostAnnotation]:
        """检查设定冲突

        Args:
            entity_name: 实体名称
            entity_id: 实体 ID
            actions: 实体在大纲中的行为列表
            current_state: 实体当前状态

        Returns:
            GhostAnnotation 列表
        """
        annotations = []

        # 检测魔法系统冲突
        magic_type = current_state.get("magic_type") or current_state.get("魔法")
        if magic_type:
            for action in actions:
                if action.endswith("_magic"):
                    action_magic = action.replace("_magic", "")
                    # 简单映射
                    magic_map = {
                        "fire": "火系",
                        "water": "水系",
                        "ice": "冰系",
                        "lightning": "雷系",
                        "wind": "风系",
                    }
                    action_magic_cn = magic_map.get(action_magic, action_magic)

                    if isinstance(magic_type, str):
                        if action_magic_cn not in magic_type and magic_type not in action_magic_cn:
                            annotations.append(GhostAnnotation(
                                type="setting_conflict",
                                severity="warning",
                                message=f"设定库中 {entity_name} 为 [{magic_type}]，此处使用了 [{action_magic_cn}]",
                                entity_id=entity_id,
                                entity_name=entity_name,
                                expected=magic_type,
                                actual=action_magic_cn,
                            ))

        # 检测武器冲突
        weapon = current_state.get("weapon") or current_state.get("武器")
        if weapon:
            for action in actions:
                if action.startswith("use_"):
                    action_weapon = action.replace("use_", "")
                    weapon_map = {
                        "sword": "剑",
                        "bow": "弓",
                        "gun": "枪",
                    }
                    action_weapon_cn = weapon_map.get(action_weapon, action_weapon)

                    if isinstance(weapon, str):
                        if action_weapon_cn not in weapon and weapon not in action_weapon_cn:
                            annotations.append(GhostAnnotation(
                                type="setting_conflict",
                                severity="warning",
                                message=f"设定库中 {entity_name} 的武器为 [{weapon}]，此处使用了 [{action_weapon_cn}]",
                                entity_id=entity_id,
                                entity_name=entity_name,
                                expected=weapon,
                                actual=action_weapon_cn,
                            ))

        return annotations
