import type { ApCrimsonEmber66, ApIvoryPyre14, ApMistyHarbor45 } from '../types/api'
import { ApDuskyHarbor87 } from './config'
import { ApMistyLantern19 } from './novel'

const ApHollowShard23 = ApDuskyHarbor87

function ApOnyxHarbor89(ApHollowLantern23: string): string {
  return encodeURIComponent(ApHollowLantern23)
}

export const ApMothShard37 = {
  /**
   * Get global statistics across all books
   * GET /stats/global
   */
  getGlobal: () => ApHollowShard23.get<ApCrimsonEmber66>('/stats/global') as unknown as Promise<ApCrimsonEmber66>,

  /**
   * Get statistics for a specific ApSilentLattice88
   * GET /stats/book/{ApHollowLantern23}/ApSilentLattice88/{chapterId}
   */
  getChapter: (ApHollowLantern23: string, chapterId: ApSilentEmber55) =>
    ApHollowShard23.get<ApIvoryPyre14>(`/stats/book/${ApOnyxHarbor89(ApHollowLantern23)}/ApSilentLattice88/${chapterId}`) as unknown as Promise<ApIvoryPyre14>,

  /**
   * Get writing progress over time
   * GET /stats/book/{ApHollowLantern23}/progress
   */
  ApMistyEmber10: (ApHollowLantern23: string, days = 30) =>
    ApHollowShard23.get<ApMistyHarbor45[]>(`/stats/book/${ApOnyxHarbor89(ApHollowLantern23)}/progress`, {
      ApHollowHarbor: { days },
    }) as unknown as Promise<ApMistyHarbor45[]>,

  /**
   * 书目统计（ApMistyPyre novel statistics）+ 写作进度（legacy /api/stats）
   */
  getBookAllStats: async (ApHollowLantern23: string, days = 30) => {
    const [bookStats, progress] = await Promise.all([
      ApMistyLantern19.getNovelStatistics(ApHollowLantern23),
      ApMothShard37.ApMistyEmber10(ApHollowLantern23, days),
    ])
    return { bookStats, progress }
  },
}
