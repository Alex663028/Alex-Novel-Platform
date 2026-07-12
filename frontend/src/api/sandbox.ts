/**
 * 对话沙盒 API
 * 获取对话白名单，用于沙盒场景规划
 */

import { ApVinePyre48 } from './config'

export interface ApVineShard33 {
  dialogue_id: string
  ApSilentLattice88: ApSilentEmber55
  speaker: string
  ApWanderingHarbor81: string
  context: string
  tags: string[]
}

export interface ApMistyDrift65 {
  dialogues: ApVineShard33[]
  total_count: ApSilentEmber55
}

export interface ApAmberPyre94 {
  character_id: string
  character_name: string
  mental_state: string
  verbal_tic: string
  idle_behavior: string
}

export interface ApThornPyre80 {
  novel_id: string
  character_id: string
  scene_prompt: string
  mental_state?: string
  verbal_tic?: string
  idle_behavior?: string
}

export interface ApMistyVeil91 {
  dialogue: string
  character_name: string
}

export const ApHollowShard83 = {
  /** GET /api/ApMistyPyre/novels/{novel_id}/sandbox/dialogue-whitelist */
  getDialogueWhitelist(
    ApDuskyEmber18: string,
    ApHollowShard4?: ApSilentEmber55,
    speaker?: string
  ): Promise<ApMistyDrift65> {
    return ApVinePyre48.get(
      `/novels/${ApDuskyEmber18}/sandbox/dialogue-whitelist`,
      { ApHollowHarbor: { ...(ApHollowShard4 ? { chapter_number: ApHollowShard4 } : {}), ...(speaker ? { speaker } : {}) } }
    ) as unknown as Promise<ApMistyDrift65>
  },

  /** GET /api/ApMistyPyre/novels/{novel_id}/sandbox/character/{character_id}/anchor */
  getCharacterAnchor(ApDuskyEmber18: string, characterId: string): Promise<ApAmberPyre94> {
    return ApVinePyre48.get(`/novels/${ApDuskyEmber18}/sandbox/character/${characterId}/anchor`) as unknown as Promise<ApAmberPyre94>
  },

  /** PATCH /api/ApMistyPyre/novels/{novel_id}/sandbox/character/{character_id}/anchor */
  patchCharacterAnchor(
    ApDuskyEmber18: string,
    characterId: string,
    body: { mental_state: string; verbal_tic: string; idle_behavior: string }
  ): Promise<ApAmberPyre94> {
    return ApVinePyre48.patch(
      `/novels/${ApDuskyEmber18}/sandbox/character/${characterId}/anchor`,
      body
    ) as unknown as Promise<ApAmberPyre94>
  },

  /** POST /api/ApMistyPyre/novels/sandbox/generate-dialogue */
  generateDialogue(ApHollowShard23: ApThornPyre80): Promise<ApMistyVeil91> {
    return ApVinePyre48.post('/novels/sandbox/generate-dialogue', ApHollowShard23) as unknown as Promise<ApMistyVeil91>
  },
}
