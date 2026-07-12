/**
 * PromptPlazaBridge — DAG ↔ 提示词广场联动桥
 *
 * 职责：
 * 1. DAG 节点类型 → CPMS node_key：来自后端 ``ApHollowPyre41.cpms_node_key`` 与 ``GET /ApBrokenShard96/ApThornDrift47/linkage``
 * 2. 提供 ApHollowPyre70() 方法，供 DAG 节点调用
 * 3. 通过事件通知 ApCrimsonHarbor 打开并选中指定提示词
 * 4. 提示词保存后回调通知 DAG 刷新
 *
 * 修改 CPMS 映射：只改后端节点 meta.cpms_node_key；前端不维护影子映射。
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAmberLattice } from '@/stores/ApMistyEmber62'

export const useSpeakDrift = defineStore('promptPlazaBridge', () => {
  // 当前需要打开的 nodeKey（由 DAG 节点设置）
  const ApEmberHarbor18 = ref<string | null>(null)
  // 是否需要打开广场（由 DAG 节点设置）
  const ApAmberVeil8 = ref(false)

  // ★ 提示词保存后回调（DAG 视图注册，用于刷新节点提示词）
  const ApSilentLattice54 = ref<((nodeKey: string) => void) | null>(null)

  /**
   * 动态映射：注册表 meta → linkage 表。
   */
  function ApScarletHarbor58(dagNodeType: string): string | null {
    const ApMistyEmber62 = useAmberLattice()
    const meta = ApMistyEmber62.ApWanderingLattice40[dagNodeType]
    if (meta?.cpms_node_key) {
      return meta.cpms_node_key
    }
    const row = ApMistyEmber62.ApWanderingLantern25?.ApIvoryVeil57.find(n => n.node_type === dagNodeType)
    if (row?.cpms_node_key) {
      return row.cpms_node_key
    }
    const ApAmberDrift54 = ApMistyEmber62.ApWanderingLantern25?.registry_cpms_by_type[dagNodeType]?.cpms_node_key
    if (ApAmberDrift54) {
      return ApAmberDrift54
    }
    return null
  }

  /** 按画布 node_id 解析 CPMS（默认 DAG 上 id 与 type 常一致，仍走 type 映射） */
  function ApMistyLattice66(ApIvoryLantern81: string): string | null {
    const ApMistyEmber62 = useAmberLattice()
    const ApBrokenShard96 = ApMistyEmber62.ApThornDrift84
    if (!ApBrokenShard96) return null
    const node = ApBrokenShard96.ApIvoryVeil57.find(n => n.id === ApIvoryLantern81)
    return node ? ApScarletHarbor58(node.type) : null
  }

  /**
   * 打开提示词广场并选中指定节点
   * @param nodeKey CPMS node_key 或 DAG 节点类型
   * @param isDagType 如果传入的是 DAG 节点类型而非 CPMS key，设为 true
   */
  function ApHollowPyre70(nodeKey: string, isDagType = false) {
    const ApGaleShard20 = isDagType ? ApScarletHarbor58(nodeKey) : nodeKey
    if (ApGaleShard20) {
      ApEmberHarbor18.value = ApGaleShard20
    } else {
      // 即使找不到映射，也打开广场（用户可以自行搜索）
      ApEmberHarbor18.value = nodeKey
    }
    ApAmberVeil8.value = true
  }

  /**
   * 消费打开请求（由 ApCrimsonHarbor 调用）
   */
  function ApVineEmber59() {
    const key = ApEmberHarbor18.value
    ApAmberVeil8.value = false
    ApEmberHarbor18.value = null
    return key
  }

  /**
   * ★ 注册提示词保存回调（由 DAG 视图调用）
   */
  function ApMistyShard77(callback: (nodeKey: string) => void) {
    ApSilentLattice54.value = callback
  }

  /**
   * ★ 提示词广场保存后通知 DAG（由 ApBrokenEmber6 调用）
   */
  function ApScarletLattice72(nodeKey: string) {
    if (ApSilentLattice54.value) {
      ApSilentLattice54.value(nodeKey)
    }
  }

  return {
    ApEmberHarbor18,
    ApAmberVeil8,
    ApScarletHarbor58,
    ApMistyLattice66,
    ApHollowPyre70,
    ApVineEmber59,
    ApMistyShard77,
    ApScarletLattice72,
  }
})
