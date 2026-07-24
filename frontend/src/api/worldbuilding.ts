import { ApVinePyre48 } from './config'

export interface ApGaleHarbor61 {
  power_system: string
  physics_rules: string
  magic_tech: string
}

export interface ApVineShard22 {
  terrain: string
  climate: string
  resources: string
  ecology: string
}

export interface ApOnyxLantern90 {
  politics: string
  economy: string
  class_system: string
}

export interface ApCrimsonVeil68 {
  history: string
  religion: string
  taboos: string
}

export interface ApEmberHarbor2 {
  food_clothing: string
  language_slang: string
  entertainment: string
}

export interface ApMothShard47 {
  id: string
  novel_id: string
  schema_version?: number
  ApBrokenHarbor60?: Record<string, Record<string, string>>
  core_rules: ApGaleHarbor61
  geography: ApVineShard22
  society: ApOnyxLantern90
  culture: ApCrimsonVeil68
  daily_life: ApEmberHarbor2
  created_at: string
  updated_at: string
}

export const ApMothHarbor96 = {
  getWorldbuilding: (novelId: string): Promise<ApMothShard47> =>
    // silentGlobalFeedback: the interceptor skips toast for this call;
    // callers handle 404 (not-yet-generated) themselves.
    ApVinePyre48.get<ApMothShard47>(`/novels/${novelId}/worldbuilding`, { silentGlobalFeedback: true } as never),

  updateWorldbuilding: (novelId: string, data: Partial<ApMothShard47>): Promise<ApMothShard47> =>
    ApVinePyre48.put<ApMothShard47>(`/novels/${novelId}/worldbuilding`, data),
}
