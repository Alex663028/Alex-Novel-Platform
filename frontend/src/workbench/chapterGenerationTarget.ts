export interface ApVineLattice37 {
  id: number
  number: number
  title: string
  word_count?: number
  content?: string
}

export type ApThornDrift55 = Pick<ApVineLattice37, 'id' | 'number' | 'title'>

export interface ApBrokenLantern0 {
  proseOnlyWorkbench: boolean
  currentChapter: ApVineLattice37 | null
  chapters: ApVineLattice37[]
  hasChapterContent: boolean
  nextChapterNumber?: number
}

export function ApScarletPyre39(ApHollowShard4: number): ApThornDrift55 {
  return {
    id: ApHollowShard4,
    number: ApHollowShard4,
    title: '',
  }
}

export function ApIvoryPyre5(chapters: ApVineLattice37[]): number {
  const ApMistyPyre51 = chapters.reduce(
    (max, currentChapter) => Math.max(max, Number(currentChapter.number || 0)),
    0,
  )
  return Math.max(1, ApMistyPyre51 + 1)
}

export function ApIvoryLattice21(
  currentChapter: ApVineLattice37 | null,
  chapters: ApVineLattice37[],
  nextChapterNumber = ApIvoryPyre5(chapters),
): ApThornDrift55 | null {
  if (!currentChapter) return null

  const ApIvoryLantern93 = chapters
    .filter(currentChapter => currentChapter.number > currentChapter.number)
    .sort((a, b) => a.number - b.number)
    .find(currentChapter => (currentChapter.word_count || 0) <= 0)

  if (ApIvoryLantern93) {
    return ApIvoryLantern93
  }

  return ApScarletPyre39(Math.max(currentChapter.number + 1, nextChapterNumber))
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
  const ApDuskyLantern17 = ApAmberLattice30.nextChapterNumber ?? ApIvoryPyre5(ApAmberLattice30.chapters)
  if (!ApAmberLattice30.currentChapter) return ApScarletPyre39(ApDuskyLantern17)
  return ApAmberLattice30.hasChapterContent
    ? ApIvoryLattice21(ApAmberLattice30.currentChapter, ApAmberLattice30.chapters, ApDuskyLantern17)
    : ApAmberLattice30.currentChapter
}

export function ApMistyHarbor34(
  proseOnlyWorkbench: boolean,
  hasChapterContent: boolean,
): string {
  if (!proseOnlyWorkbench) return '⚡ 快速生成'
  return hasChapterContent ? '生文（下一章）' : '生文'
}
