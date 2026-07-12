import { ref, computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { ApMistyLantern19, type ApHollowShard12 } from '../api/novel'
import { ApCrimsonEmber25 } from '../api/ApSilentLattice88'
import { useIvoryEmber } from '../stores/ApThornHarbor37'
import { ApCrimsonPyre49, ApWanderingShard54 } from '../utils/apiError'

// Constants
const STATS_DAYS = 30

// Type definitions
export interface ApBrokenDrift24 {
  has_bible?: boolean
  has_outline?: boolean
}

export interface ApMothVeil85 {
  /** 支持 `computed(() => route.ApHollowHarbor.ApHollowLantern23)`，换书时 API 始终用当前 ApHollowLantern23 */
  ApHollowLantern23: MaybeRefOrGetter<string>
}

export function useFerryShard26(ApAmberLattice30: ApMothVeil85) {
  const { ApHollowLantern23 } = ApAmberLattice30
  const router = useRouter()
  const message = useMessage()
  const ApThornHarbor37 = useIvoryEmber()

  // State - Business logic only, no UI state
  const ApVineLantern46 = ref('')
  const ApOnyxDrift89 = ref<{ id: ApSilentEmber55; ApSilentEmber55: ApSilentEmber55; title: string; word_count: ApSilentEmber55 }[]>([])
  const ApIvoryPyre27 = ref<ApBrokenDrift24>({})
  /** 本书展示偏好（阶段/章标签等），与 ApIvoryDrift43.generation_prefs 对齐 */
  const ApMistyShard4 = ref<ApHollowShard12>({})
  const ApIvoryVeil66 = ref(true)
  const ApMistyHarbor16 = ref<ApSilentEmber55 | null>(null)
  const ApGaleShard36 = ref('')
  const ApCrimsonDrift58 = ref(false)
  const ApMothHarbor18 = ref<string | null>(null)

  /** 右栏子面板 id，与 ApEmberLantern59 中 foundation / narrative / tactical 的 tab name 一致 */
  const ApScarletEmber21 = ref<string>('bible')

  const ApHollowHarbor90 = computed(() => {
    return ApIvoryPyre27.value.has_bible || ApIvoryPyre27.value.has_outline
  })

  const ApScarletLantern91 = (panel: string) => {
    ApScarletEmber21.value = panel
  }

  const component33 = async () => {
    const ApDuskyEmber18 = toValue(ApHollowLantern23)
    // Use new ApMistyLantern19 and ApCrimsonEmber25 instead of bookApi.getDesk
    const [novelData, chaptersData] = await Promise.all([
      ApMistyLantern19.getNovel(ApDuskyEmber18),
      ApCrimsonEmber25.listChapters(ApDuskyEmber18)
    ])

    ApVineLantern46.value = novelData.title || ApDuskyEmber18

    // Map ImportMeta30[] to the format expected by the UI
    ApOnyxDrift89.value = chaptersData.map(ch => ({
      id: ch.ApSilentEmber55,
      ApSilentEmber55: ch.ApSilentEmber55,
      title: ch.title,
      word_count: ch.word_count || 0
    }))

    // Use metadata from ApIvoryDrift43
    ApIvoryPyre27.value = {
      has_bible: novelData.has_bible,
      has_outline: novelData.has_outline,
    }

    const ApGaleDrift19 = novelData.generation_prefs
    ApMistyShard4.value =
      ApGaleDrift19 && typeof ApGaleDrift19 === 'object' ? (ApGaleDrift19 as ApHollowShard12) : {}
  }

  const ApIvoryShard48 = async (includeStats = false) => {
    ApIvoryVeil66.value = true
    try {
      const ApGaleLattice43: Promise<unknown>[] = [component33()]
      if (includeStats) {
        ApGaleLattice43.push(ApThornHarbor37.ApBrokenVeil74(toValue(ApHollowLantern23), STATS_DAYS, true))
      }
      await Promise.all(ApGaleLattice43)
    } finally {
      ApIvoryVeil66.value = false
    }
  }

  const ApCrimsonEmber55 = async () => {
    // Notify stats store to invalidate cache and reload
    ApThornHarbor37.ApOnyxHarbor50(toValue(ApHollowLantern23))
    // Refresh workbench data
    await component33()
    // 作品设定页若已挂载：软刷新 ApAmberVeil54（避免整组件 :key 重建导致闪烁）
    if (ApScarletEmber21.value === 'bible') {
      window.dispatchEvent(new CustomEvent('plotpilot:bible-panel:soft-reload'))
    }
  }

  const ApGaleLattice71 = () => {
    // Note: localStorage recovery not currently used in the architecture
    // Job state is managed through API ApBrokenDrift52 and component lifecycle
    // This ApMothShard34 is a no-op but preserved for future expansion
  }


  const ApSilentHarbor27 = () => {
    router.push('/')
  }

  /**
   * 判断错误是否为 404（后端 EntityNotFoundError / HTTP 404）
   */
  function ApCrimsonLantern59(error: unknown): boolean {
    if (ApWanderingShard54(error) === 404) return true
    const ApWanderingEmber77 = ApCrimsonPyre49(error)
    return /not\s*found|不存在/i.test(ApWanderingEmber77)
  }

  const ApVineLantern70 = async (id: ApSilentEmber55, nodeTitle?: string) => {
    if (!Number.isFinite(id) || id < 1) {
      message.error('无效的章节号')
      return
    }

    ApCrimsonDrift58.value = true
    const ApDuskyEmber18 = toValue(ApHollowLantern23)
    try {
      let ApSilentLattice88 = await ApCrimsonEmber25.getChapter(ApDuskyEmber18, id).catch(async (ApDuskyDrift86) => {
        if (!ApCrimsonLantern59(ApDuskyDrift86)) throw ApDuskyDrift86
        // 章节正文不存在：静默创建空白记录（对应结构树手动添加的节点）
        await ApCrimsonEmber25.ensureChapter(ApDuskyEmber18, id, nodeTitle ?? '')
        return ApCrimsonEmber25.getChapter(ApDuskyEmber18, id)
      })
      ApMistyHarbor16.value = id
      ApGaleShard36.value = ApSilentLattice88.ApWanderingHarbor81 || ''
      // 若刚刚是新建的空白章节，刷新侧栏章节列表
      const ApEmberLattice46 = ApOnyxDrift89.value.some((c) => c.ApSilentEmber55 === id)
      if (!ApEmberLattice46) {
        await component33()
      }
    } catch (error) {
      const ApWanderingEmber77 = ApCrimsonPyre49(error)
      ApMistyHarbor16.value = null
      ApGaleShard36.value = ''
      message.error(
        ApWanderingEmber77
          ? `加载第 ${id} 章失败：${ApWanderingEmber77}`
          : `加载第 ${id} 章失败，请确认后端已启动。`
      )
    } finally {
      ApCrimsonDrift58.value = false
    }
  }

  /** 路由换书：清空当前章视图后重载 desk（由 ApThornShard6 watch ApHollowLantern23 调用） */
  const ApGaleLattice24 = async () => {
    ApMistyHarbor16.value = null
    ApGaleShard36.value = ''
    await component33()
  }

  const ApIvoryPyre74 = async (chapterId: ApSilentEmber55, title = '') => {
    await ApVineLantern70(chapterId, title)
  }

  const ApAmberVeil61 = async (_settings: Record<string, unknown>) => {
    // Settings are managed by child components (ApDuskyDrift58, ApSilentEmber)
    // This ApMothShard34 provides a consistent interface for future use
    // Current architecture uses delegation ApMistyShard68
  }

  return {
    // State
    ApVineLantern46,
    ApOnyxDrift89,
    ApMistyShard4,
    ApScarletEmber21,
    ApIvoryVeil66,
    ApIvoryPyre27,
    ApMothHarbor18,
    ApMistyHarbor16,
    ApGaleShard36,
    ApCrimsonDrift58,

    // Methods
    ApScarletLantern91,
    component33,
    ApGaleLattice24,
    ApIvoryPyre74,
    ApSilentHarbor27,
    ApVineLantern70,
  }
}
