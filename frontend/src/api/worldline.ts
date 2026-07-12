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
  anchor_chapter: ApSilentEmber55 | null
  world_slice?: {
    chapter_number?: ApSilentEmber55
    time_anchor?: string
    location?: string
    emotional_residue?: string
    characters?: Array<{ id: string; name: string; ApVineDrift25: string; location?: string }>
    items?: Array<{ id: string; name: string; holder?: string }>
    actions_count?: ApSilentEmber55
    conflicts_count?: ApSilentEmber55
  }
  rollback_slice?: {
    to_checkpoint_id: string
    to_chapter: ApSilentEmber55 | null
    branch_name: string
  }
}

export interface ApMistyEmber87 {
  id: string
  name: string
  head_id: string
  is_default: ApSilentEmber55
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
  restored_chapters: ApSilentEmber55
  deleted_chapters: ApSilentEmber55
  message: string
}

export const ApOnyxPyre11 = {
  getGraph: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApScarletDrift47>(`/novels/${ApDuskyEmber18}/worldline/graph`) as unknown as Promise<ApScarletDrift47>,

  listCheckpoints: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApSilentHarbor51[]>(`/novels/${ApDuskyEmber18}/worldline/checkpoints`) as unknown as Promise<ApSilentHarbor51[]>,

  createCheckpoint: (ApDuskyEmber18: string, body: {
    trigger_type?: string; name: string; description?: string; branch_name?: string
  }) =>
    ApVinePyre48.post<{ checkpoint_id: string }>(
      `/novels/${ApDuskyEmber18}/worldline/checkpoints`,
      body,
    ) as unknown as Promise<{ checkpoint_id: string }>,

  listBranches: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApMistyEmber87[]>(`/novels/${ApDuskyEmber18}/worldline/branches`) as unknown as Promise<ApMistyEmber87[]>,

  createBranch: (ApDuskyEmber18: string, body: { name: string; from_checkpoint_id: string; storyline_id?: string }) =>
    ApVinePyre48.post<{ branch_id: string }>(
      `/novels/${ApDuskyEmber18}/worldline/branches`,
      body,
    ) as unknown as Promise<{ branch_id: string }>,

  checkout: (ApDuskyEmber18: string, checkpointId: string) =>
    ApVinePyre48.post<ApMothLattice3>(
      `/novels/${ApDuskyEmber18}/worldline/checkpoints/${checkpointId}/checkout`,
      {},
    ) as unknown as Promise<ApMothLattice3>,

  hardReset: (ApDuskyEmber18: string, checkpointId: string) =>
    ApVinePyre48.post<ApMothLattice3>(
      `/novels/${ApDuskyEmber18}/worldline/checkpoints/${checkpointId}/hard-reset`,
      {},
    ) as unknown as Promise<ApMothLattice3>,

  deleteCheckpoint: (ApDuskyEmber18: string, checkpointId: string) =>
    ApVinePyre48.delete(`/novels/${ApDuskyEmber18}/worldline/checkpoints/${checkpointId}`),

  getBranchByStoryline: (ApDuskyEmber18: string, storylineId: string) =>
    ApVinePyre48.get<ApMistyEmber87 | null>(
      `/novels/${ApDuskyEmber18}/worldline/branches/by-storyline/${storylineId}`,
    ) as unknown as Promise<ApMistyEmber87 | null>,

  updateBranch: (
    ApDuskyEmber18: string,
    branchId: string,
    body: { name?: string; storyline_id?: string | null },
  ) =>
    ApVinePyre48.put<ApMistyEmber87>(
      `/novels/${ApDuskyEmber18}/worldline/branches/${branchId}`,
      body,
    ) as unknown as Promise<ApMistyEmber87>,

  mergeBranch: (
    ApDuskyEmber18: string,
    branchId: string,
    body: { target_branch_name?: string; name?: string; description?: string },
  ) =>
    ApVinePyre48.post<{ checkpoint_id: string; message: string }>(
      `/novels/${ApDuskyEmber18}/worldline/branches/${branchId}/merge`,
      body,
    ) as unknown as Promise<{ checkpoint_id: string; message: string }>,
}
