"""Mutation Applier Service - 应用 mutations 到事件"""
import logging
from typing import List, Dict, Any, Optional
from domain.novel.repositories.narrative_event_repository import NarrativeEventRepository


logger = logging.getLogger(__name__)


class MutationApplier:
    """Mutation 应用器 - 将 mutations 应用到事件"""

    def __init__(self, event_repository: NarrativeEventRepository):
        self.event_repository = event_repository

    def apply_mutations(
        self,
        novel_id: str,
        event_id: str,
        mutations: List[Dict[str, Any]],
        reason: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        应用 mutations 到事件

        Args:
            novel_id: 小说 ID
            event_id: 事件 ID
            mutations: mutation 列表
            reason: 修改原因（用于审计）

        Returns:
            包含 success, updated_event, applied_mutations 的字典
        """
        # 读取目标事件
        event = self.event_repository.get_event(novel_id, event_id)
        if not event:
            raise ValueError(f"Event not found: {event_id}")

        # 记录审计信息
        if reason:
            logger.info(f"Applying mutations to event {event_id}, reason: {reason}")

        # 应用 mutations
        applied_mutations = []
        for mutation in mutations:
            mutation_type = mutation.get("type")

            if mutation_type == "add_tag":
                tag = mutation.get("tag")
                if tag and tag not in event["tags"]:
                    event["tags"].append(tag)
                    applied_mutations.append(mutation)
                    logger.debug(f"Added tag '{tag}' to event {event_id}")

            elif mutation_type == "remove_tag":
                tag = mutation.get("tag")
                if tag in event["tags"]:
                    event["tags"].remove(tag)
                    applied_mutations.append(mutation)
                    logger.debug(f"Removed tag '{tag}' from event {event_id}")
                else:
                    # 幂等性：标签不存在也算成功
                    applied_mutations.append(mutation)

            elif mutation_type == "replace_summary":
                new_summary = mutation.get("new_summary")
                if new_summary:
                    event["event_summary"] = new_summary
                    applied_mutations.append(mutation)
                    logger.debug(f"Replaced summary for event {event_id}")

            else:
                # 无效的 mutation type，跳过并记录警告
                logger.warning(f"Unknown mutation type '{mutation_type}', skipping")

        # 更新事件到数据库
        self.event_repository.update_event(
            novel_id=novel_id,
            event_id=event_id,
            event_summary=event["event_summary"],
            tags=event["tags"]
        )

        return {
            "success": True,
            "updated_event": event,
            "applied_mutations": applied_mutations
        }
