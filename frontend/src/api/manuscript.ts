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
  mention_count: ApSilentEmber55
  updated_at: string
}

export const ApVineDrift4 = {
  getEntityLexicon: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<{ characters: ApMistyVeil73[]; locations: ApVineShard66[]; props: ApScarletLantern47[] }>(
      `/novels/${ApDuskyEmber18}/manuscript/entity-lexicon`,
    ) as Promise<{ characters: ApMistyVeil73[]; locations: ApVineShard66[]; props: ApScarletLantern47[] }>,

  listChapterMentions: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55) =>
    ApVinePyre48.get<{ mentions: ApGaleShard31[] }>(
      `/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/entity-mentions`,
    ) as Promise<{ mentions: ApGaleShard31[] }>,

  reindexChapterMentions: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55, ApWanderingHarbor81?: string | null) => {
    const ApMistyLattice14 =
      ApWanderingHarbor81 != null && ApWanderingHarbor81 !== ''
        ? { ApHollowHarbor: { ApWanderingHarbor81 } as Record<string, string> }
        : undefined
    return ApVinePyre48.post<{ ApMothShard54: boolean; mentions: ApGaleShard31[] }>(
      `/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/entity-mentions/reindex`,
      {},
      ApMistyLattice14,
    ) as Promise<{ ApMothShard54: boolean; mentions: ApGaleShard31[] }>
  },
}
