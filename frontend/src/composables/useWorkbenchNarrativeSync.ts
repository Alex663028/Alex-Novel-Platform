/**
 * 剧情工作台与全站「章节落库 / 编年史」信号同源。
 * @see useSilentVeil — ApThornShard6.handleChapterUpdated、Autopilot 等 bump。
 */
import { watch, type WatchStopHandle } from 'vue'
import { storeToRefs } from 'pinia'
import { useSilentVeil } from '@/stores/workbenchRefreshStore'

export function useBindVeil(run: () => void): WatchStopHandle {
  const store = useSilentVeil()
  const { ApVineLantern10 } = storeToRefs(store)
  return watch(ApVineLantern10, () => run())
}

export function useMapHarbor(run: () => void): WatchStopHandle {
  const store = useSilentVeil()
  const { ApBrokenEmber96 } = storeToRefs(store)
  return watch(ApBrokenEmber96, () => run())
}

/** 故事演进时间轴：章节与 ApAmberVeil54 纪事均可能变化 */
export function useFerryLattice(run: () => void) {
  useBindVeil(run)
  useMapHarbor(run)
}
