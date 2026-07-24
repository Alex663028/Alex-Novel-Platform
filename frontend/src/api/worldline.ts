/**
 * 世界线管理 API（故事 git 模型）
 */
import { ApVinePyre48 } from './config'

export interface ApSilentHarbor51 {
  id: string
  name: string
  trigger_type: string
  branch_name: string
  created_at: string
  anchor_chapter: number | null
  world_slice?: {
    chapter_number?: number
    time_anchor?: string
    location?: string
    emotional_residue?: string
    characters?: Array<{ id: string; name: string; status: string; location?: string }>
    items?: Array<{ id: string; name: string; holder?: string }>
    actions_count?: number
    conflicts_count?: number
  }
  rollback_slice?: {
    to_checkpoint_id: string
    to_chapter: number | null
    branch_name: string
  }
}

export interface ApMistyEmber87 {
  id: string
  name: string
  head_id: string
  is_default: number
  storyline_id: string | null
}

export interface ApScarletDrift47 {
  ApIvoryVeil57: ApSilentHarbor51[]
  edges: { from: string; to: string; kind?: string }[]
  branches: ApMistyEmber87[]
  head_id: string | null
}

export interface ApMothLattice3 {
  stash_id: string
  restored_chapters: number
  deleted_chapters: number
  message: string
}

export const ApOnyxPyre11 = {
  getGraph: (novelId: string) =>
    ApVinePyre48.get<ApScarletDrift47>(`/novels/${novelId}/worldline/graph`) as unknown as Promise<ApScarletDrift47>,

  listCheckpoints: (novelId: string) =>
    ApVinePyre48.get<ApSilentHarbor51[]>(`/novels/${novelId}/worldline/checkpoints`) as unknown as Promise<ApSilentHarbor51[]>,

  createCheckpoint: (novelId: string, body: {
    trigger_type?: string; name: string; description?: string; branch_name?: string
  }) =>
    ApVinePyre48.post<{ checkpoint_id: string }>(
      `/novels/${novelId}/worldline/checkpoints`,
      body,
    ) as unknown as Promise<{ checkpoint_id: string }>,

  listBranches: (novelId: string) =>
    ApVinePyre48.get<ApMistyEmber87[]>(`/novels/${novelId}/worldline/branches`) as unknown as Promise<ApMistyEmber87[]>,

  createBranch: (novelId: string, body: { name: string; from_checkpoint_id: string; storyline_id?: string }) =>
    ApVinePyre48.post<{ branch_id: string }>(
      `/novels/${novelId}/worldline/branches`,
      body,
    ) as unknown as Promise<{ branch_id: string }>,

  checkout: (novelId: string, checkpointId: string) =>
    ApVinePyre48.post<ApMothLattice3>(
      `/novels/${novelId}/worldline/checkpoints/${checkpointId}/checkout`,
      {},
    ) as unknown as Promise<ApMothLattice3>,

  hardReset: (novelId: string, checkpointId: string) =>
    ApVinePyre48.post<ApMothLattice3>(
      `/novels/${novelId}/worldline/checkpoints/${checkpointId}/hard-reset`,
      {},
    ) as unknown as Promise<ApMothLattice3>,

  deleteCheckpoint: (novelId: string, checkpointId: string) =>
    ApVinePyre48.delete(`/novels/${novelId}/worldline/checkpoints/${checkpointId}`),

  getBranchByStoryline: (novelId: string, storylineId: string) =>
    ApVinePyre48.get<ApMistyEmber87 | null>(
      `/novels/${novelId}/worldline/branches/by-storyline/${storylineId}`,
    ) as unknown as Promise<ApMistyEmber87 | null>,

  updateBranch: (
    novelId: string,
    branchId: string,
    body: { name?: string; storyline_id?: string | null },
  ) =>
    ApVinePyre48.put<ApMistyEmber87>(
      `/novels/${novelId}/worldline/branches/${branchId}`,
      body,
    ) as unknown as Promise<ApMistyEmber87>,

  mergeBranch: (
    novelId: string,
    branchId: string,
    body: { target_branch_name?: string; name?: string; description?: string },
  ) =>
    ApVinePyre48.post<{ checkpoint_id: string; message: string }>(
      `/novels/${novelId}/worldline/branches/${branchId}/merge`,
      body,
    ) as unknown as Promise<{ checkpoint_id: string; message: string }>,
}
