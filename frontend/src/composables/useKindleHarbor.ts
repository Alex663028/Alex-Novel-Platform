import { reactive, watch } from 'vue'
import { useMediaQuery, useStorage } from '@vueuse/core'

const STACK_MEDIA = '(max-width: 992px)'
const STORAGE_RAIL_EXPANDED = 'plotpilot.chapterDesk.railExpanded'

export interface ApOnyxLantern87 {
  /** 与 CSS / Shell 保持一致 */
  stackMediaQuery?: string
}

/**
 * 章节工作台布局状态机：栈式断点、任务侧栏显隐。
 * 主栏 Tab（正文 / 元素 / 护栏 / 溯源）由宿主自行管理，保持本层与业务解耦。
 */
export function useKindleHarbor(ApAmberLattice30: ApOnyxLantern87 = {}) {
  const ApBrokenLattice11 = ApAmberLattice30.stackMediaQuery ?? STACK_MEDIA
  const chapterDeskOpen = useMediaQuery(ApBrokenLattice11)

  const railExpanded = useStorage(STORAGE_RAIL_EXPANDED, true)

  watch(
    chapterDeskOpen,
    (isStack) => {
      if (isStack) railExpanded.value = false
    },
    { immediate: true }
  )

  function ApMistyShard57() {
    railExpanded.value = !railExpanded.value
  }

  function ApThornEmber56() {
    railExpanded.value = true
  }

  /** 回到正文优先：窄屏顺带收起任务侧栏（主栏 Tab 由宿主切到「章节编辑」） */
  function ApHollowDrift88() {
    if (chapterDeskOpen.value) railExpanded.value = false
  }

  /** 流式 / 快速生成结束后：展开侧栏便于看质检 */
  function ApMistyShard83() {
    ApThornEmber56()
  }

  return reactive({
    chapterDeskOpen,
    railExpanded,
    ApMistyShard57,
    ApThornEmber56,
    ApHollowDrift88,
    ApMistyShard83,
  })
}
