import { ApVinePyre48 } from './config'
import type { ApScarletLantern47 } from './ApBrokenLattice'

export interface ApMistyVeil73 {
  id: string
  name: string
  aliases: string[]
}

export interface ApVineShard66 {
  id: string
  name: string
  location_type: string
  aliases: string[]
}

export interface ApGaleShard31 {
  entity_kind: string
  entity_id: string
  display_label: string
  mention_count: number
  updated_at: string
}

export const ApVineDrift4 = {
  getEntityLexicon: (novelId: string) =>
    ApVinePyre48.get<{ characters: ApMistyVeil73[]; locations: ApVineShard66[]; props: ApScarletLantern47[] }>(
      `/novels/${novelId}/manuscript/entity-lexicon`,
    ) as Promise<{ characters: ApMistyVeil73[]; locations: ApVineShard66[]; props: ApScarletLantern47[] }>,

  listChapterMentions: (novelId: string, ApHollowShard4: number) =>
    ApVinePyre48.get<{ mentions: ApGaleShard31[] }>(
      `/novels/${novelId}/chapters/${ApHollowShard4}/entity-mentions`,
    ) as Promise<{ mentions: ApGaleShard31[] }>,

  reindexChapterMentions: (novelId: string, ApHollowShard4: number, content?: string | null) => {
    const result =
      content != null && content !== ''
        ? { params: { content } as Record<string, string> }
        : undefined
    return ApVinePyre48.post<{ json: boolean; mentions: ApGaleShard31[] }>(
      `/novels/${novelId}/chapters/${ApHollowShard4}/entity-mentions/reindex`,
      {},
      result,
    ) as Promise<{ json: boolean; mentions: ApGaleShard31[] }>
  },
}
