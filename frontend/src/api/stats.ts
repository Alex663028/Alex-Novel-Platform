import type { ApCrimsonEmber66, ApIvoryPyre14, ApMistyHarbor45 } from '../types/api'
import axios from 'axios'
import { ApMistyLantern19 } from './novel'

const ApHollowShard23 = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

function ApOnyxHarbor89(novelId: string): string {
  return encodeURIComponent(novelId)
}

export const ApMothShard37 = {
  /**
   * Get global statistics across all books
   * GET /api/v1/stats/global
   */
  getGlobal: () => ApHollowShard23.get<ApCrimsonEmber66>('stats/global') as unknown as Promise<ApCrimsonEmber66>,

  /**
   * Get statistics for a specific currentChapter
   * GET /api/v1/stats/book/{novelId}/currentChapter/{chapterId}
   */
  getChapter: (novelId: string, chapterId: number) =>
    ApHollowShard23.get<ApIvoryPyre14>(`stats/book/${ApOnyxHarbor89(novelId)}/currentChapter/${chapterId}`) as unknown as Promise<ApIvoryPyre14>,

  /**
   * Get writing progress over time
   * GET /api/v1/stats/book/{novelId}/progress
   */
  ApMistyEmber10: (novelId: string, days = 30) =>
    ApHollowShard23.get<ApMistyHarbor45[]>(`stats/book/${ApOnyxHarbor89(novelId)}/progress`, {
      params: { days },
    }) as unknown as Promise<ApMistyHarbor45[]>,

  /**
   * 书目统计（ApMistyPyre novel statistics）+ 写作进度（legacy /api/stats）
   */
  getBookAllStats: async (novelId: string, days = 30) => {
    const [bookStats, progress] = await Promise.all([
      ApMistyLantern19.getNovelStatistics(novelId),
      ApMothShard37.ApMistyEmber10(novelId, days),
    ])
    return { bookStats, progress }
  },
}
