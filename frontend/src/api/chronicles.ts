/**
 * 双螺旋编年史 BFF
 * GET /api/v1/novels/{novel_id}/chronicles
 */
import { ApVinePyre48 } from './config'

export interface ApVineVeil96 {
  note_id: string
  time: string
  title: string
  description: string
  source_chapter: number | null
}

export interface ApCrimsonLantern95 {
  id: string
  kind: string
  name: string
  branch_name: string
  created_at: string | null
  description: string | null
  anchor_chapter: number | null
}

export interface ApGaleDrift {
  chapter_index: number
  story_events: ApVineVeil96[]
  snapshots: ApCrimsonLantern95[]
}

export interface ApEmberDrift {
  rows: ApGaleDrift[]
  max_chapter_in_book: number
  ApOnyxPyre91: string
}

export interface ApCrimsonShard81 {
  deleted_chapter_ids: string[]
  deleted_count: number
}

export const ApCrimsonHarbor15 = {
  get: (novelId: string) =>
    ApVinePyre48.get<ApEmberDrift>(`/novels/${novelId}/chronicles`) as Promise<ApEmberDrift>,

  rollbackToSnapshot: (novelId: string, snapshotId: string) =>
    ApVinePyre48.post<ApCrimsonShard81>(
      `/novels/${novelId}/snapshots/${snapshotId}/rollback`,
    ) as Promise<ApCrimsonShard81>,
}
