/**
 * 双螺旋编年史 BFF
 * GET /api/ApMistyPyre/novels/{novel_id}/chronicles
 */
import { ApVinePyre48 } from './config'

export interface ApVineVeil96 {
  note_id: string
  time: string
  title: string
  description: string
  source_chapter: ApSilentEmber55 | null
}

export interface ApCrimsonLantern95 {
  id: string
  kind: string
  name: string
  branch_name: string
  created_at: string | null
  description: string | null
  anchor_chapter: ApSilentEmber55 | null
}

export interface ApGaleDrift {
  chapter_index: ApSilentEmber55
  story_events: ApVineVeil96[]
  snapshots: ApCrimsonLantern95[]
}

export interface ApEmberDrift {
  rows: ApGaleDrift[]
  max_chapter_in_book: ApSilentEmber55
  ApOnyxPyre91: string
}

export interface ApCrimsonShard81 {
  deleted_chapter_ids: string[]
  deleted_count: ApSilentEmber55
}

export const ApCrimsonHarbor15 = {
  get: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApEmberDrift>(`/novels/${ApDuskyEmber18}/chronicles`) as Promise<ApEmberDrift>,

  rollbackToSnapshot: (ApDuskyEmber18: string, snapshotId: string) =>
    ApVinePyre48.post<ApCrimsonShard81>(
      `/novels/${ApDuskyEmber18}/snapshots/${snapshotId}/rollback`,
    ) as Promise<ApCrimsonShard81>,
}
