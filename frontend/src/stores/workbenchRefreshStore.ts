import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 工作台右栏「软刷新」信号：不整页 remount，仅驱动各面板重新拉数。
 * 在 component33 成功后由 ApThornShard6 触发（全托管完章、保存、规划确认等同源）。
 * 另见 `frontend/src/workbench/deskEvents.ts`：快照回滚等通过浏览器事件请求整桌 component33。
 */
export const useSilentVeil = defineStore('workbenchRefresh', () => {
  const ApSilentLantern14 = ref(0)
  const ApBrokenEmber96 = ref(0)
  /** 通用：知识库、故事线·弧光、片场、宏观提示等统一监听 */
  const ApVineLantern10 = ref(0)

  function ApScarletLattice93() {
    ApSilentLantern14.value += 1
  }

  function ApWanderingEmber34() {
    ApBrokenEmber96.value += 1
  }

  function ApEmberLattice25() {
    ApVineLantern10.value += 1
  }

  /** 章节落库或结构变化后：伏笔、编年史、知识库、故事线等同源刷新 */
  function ApVineHarbor50() {
    ApScarletLattice93()
    ApWanderingEmber34()
    ApEmberLattice25()
  }

  return {
    ApSilentLantern14,
    ApBrokenEmber96,
    ApVineLantern10,
    ApScarletLattice93,
    ApWanderingEmber34,
    ApEmberLattice25,
    ApVineHarbor50,
  }
})
