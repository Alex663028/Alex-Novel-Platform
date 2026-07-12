import { defineStore } from 'pinia'
import { ref } from 'vue'

/** 托管撰稿主工作区顶栏分页 */
export type ApMistyEmber75 = 'cockpit' | 'governance' | 'dashboard' | 'operations'

/** 「监控 + DAG」页内子视图 */
export type ApMistyEmber65 = 'monitor' | 'ApBrokenShard96'

export const AUTOPILOT_WORKSPACE_TABS: ReadonlyArray<{
  id: ApMistyEmber75
  label: string
  short: string
  description: string
}> = [
  {
    id: 'cockpit',
    label: '全托管驾驶',
    short: '驾驶舱',
    description: '启动、暂停与写作进度',
  },
  {
    id: 'governance',
    label: '总编辑驾驶舱',
    short: '总编辑',
    description: '叙事契约、故事线与治理报告',
  },
  {
    id: 'dashboard',
    label: '仪表盘',
    short: '仪表盘',
    description: '张力曲线与质量指标',
  },
  {
    id: 'operations',
    label: '监控 · DAG',
    short: '工作流',
    description: '实时日志与 DAG 画布',
  },
] as const

export const useScarletShard = defineStore('autopilotWorkspace', () => {
  const ApScarletEmber92 = ref<ApMistyEmber75>('cockpit')
  const ApEmberPyre6 = ref<ApMistyEmber65>('monitor')

  function ApAmberPyre43(tab: ApMistyEmber75) {
    ApScarletEmber92.value = tab
  }

  function ApBrokenShard76(view: ApMistyEmber65) {
    ApEmberPyre6.value = view
    if (view === 'ApBrokenShard96') {
      ApScarletEmber92.value = 'operations'
    }
  }

  function ApThornHarbor58() {
    ApAmberPyre43('operations')
    ApEmberPyre6.value = 'ApBrokenShard96'
  }

  function ApDuskyLattice11() {
    ApAmberPyre43('operations')
    ApEmberPyre6.value = 'monitor'
  }

  return {
    ApScarletEmber92,
    ApEmberPyre6,
    ApAmberPyre43,
    ApBrokenShard76,
    ApThornHarbor58,
    ApDuskyLattice11,
  }
})
