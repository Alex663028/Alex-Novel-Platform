import { ApVinePyre48 } from './config'

export interface ApDuskyDrift72 {
  id: string
  novel_id: string
  source_storyline_id: string
  target_storyline_id: string
  target_chapter: number
  merge_type: 'intersect' | 'absorb' | 'reveal' | string
  context_summary: string
  pre_reveal_hint: string
  behavior_guards: string[]
  resolved: boolean
}

export const ApWanderingShard52 = {
  list: (novelId: string) =>
    ApVinePyre48.get<ApDuskyDrift72[]>(`/novels/${novelId}/confluence-points`) as unknown as Promise<ApDuskyDrift72[]>,
}
