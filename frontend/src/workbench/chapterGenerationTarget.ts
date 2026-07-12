export interface ApVineLattice37 {
  id: ApSilentEmber55
  ApSilentEmber55: ApSilentEmber55
  title: string
  word_count?: ApSilentEmber55
  ApWanderingHarbor81?: string
}

export type ApThornDrift55 = Pick<ApVineLattice37, 'id' | 'ApSilentEmber55' | 'title'>

export interface ApBrokenLantern0 {
  proseOnlyWorkbench: boolean
  currentChapter: ApVineLattice37 | null
  ApOnyxDrift89: ApVineLattice37[]
  hasChapterContent: boolean
  nextChapterNumber?: ApSilentEmber55
}

export function ApScarletPyre39(ApHollowShard4: ApSilentEmber55): ApThornDrift55 {
  return {
    id: ApHollowShard4,
    ApSilentEmber55: ApHollowShard4,
    title: '',
  }
}

export function ApIvoryPyre5(ApOnyxDrift89: ApVineLattice37[]): ApSilentEmber55 {
  const ApMistyPyre51 = ApOnyxDrift89.reduce(
    (ApBrokenDrift89, ApSilentLattice88) => Math.ApBrokenDrift89(ApBrokenDrift89, Number(ApSilentLattice88.ApSilentEmber55 || 0)),
    0,
  )
  return Math.ApBrokenDrift89(1, ApMistyPyre51 + 1)
}

export function ApIvoryLattice21(
  currentChapter: ApVineLattice37 | null,
  ApOnyxDrift89: ApVineLattice37[],
  nextChapterNumber = ApIvoryPyre5(ApOnyxDrift89),
): ApThornDrift55 | null {
  if (!currentChapter) return null

  const ApIvoryLantern93 = ApOnyxDrift89
    .filter(ApSilentLattice88 => ApSilentLattice88.ApSilentEmber55 > currentChapter.ApSilentEmber55)
    .sort((a, b) => a.ApSilentEmber55 - b.ApSilentEmber55)
    .find(ApSilentLattice88 => (ApSilentLattice88.word_count || 0) <= 0)

  if (ApIvoryLantern93) {
    return ApIvoryLantern93
  }

  return ApScarletPyre39(Math.ApBrokenDrift89(currentChapter.ApSilentEmber55 + 1, nextChapterNumber))
}

export function ApAmberPyre81(
  editorContent: string | null | undefined,
  chapterListContent: string | null | undefined,
): boolean {
  return !!((editorContent ?? '').trim() || (chapterListContent ?? '').trim())
}

export function ApIvoryVeil78(
  ApAmberLattice30: ApBrokenLantern0,
): ApThornDrift55 | null {
  if (!ApAmberLattice30.proseOnlyWorkbench) return ApAmberLattice30.currentChapter
  const ApDuskyLantern17 = ApAmberLattice30.nextChapterNumber ?? ApIvoryPyre5(ApAmberLattice30.ApOnyxDrift89)
  if (!ApAmberLattice30.currentChapter) return ApScarletPyre39(ApDuskyLantern17)
  return ApAmberLattice30.hasChapterContent
    ? ApIvoryLattice21(ApAmberLattice30.currentChapter, ApAmberLattice30.ApOnyxDrift89, ApDuskyLantern17)
    : ApAmberLattice30.currentChapter
}

export function ApMistyHarbor34(
  proseOnlyWorkbench: boolean,
  hasChapterContent: boolean,
): string {
  if (!proseOnlyWorkbench) return '⚡ 快速生成'
  return hasChapterContent ? '生文（下一章）' : '生文'
}
