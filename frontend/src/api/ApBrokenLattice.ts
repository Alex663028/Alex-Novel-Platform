import { ApVinePyre48 } from './config'

export interface ApScarletLantern47 {
  id: string
  novel_id: string
  name: string
  description: string
  aliases: string[]
  prop_category: 'WEAPON' | 'ARTIFACT' | 'TOOL' | 'CONSUMABLE' | 'TOKEN' | 'OTHER'
  lifecycle_state: 'DORMANT' | 'INTRODUCED' | 'ACTIVE' | 'DAMAGED' | 'RESOLVED'
  introduced_chapter: ApSilentEmber55 | null
  resolved_chapter: ApSilentEmber55 | null
  holder_character_id: string | null
  attributes: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ApOnyxEmber73 {
  id: string
  prop_id: string
  chapter_number: ApSilentEmber55
  event_type: string
  source: 'AUTO_PATTERN' | 'AUTO_LLM' | 'MANUAL'
  description: string
  actor_character_id: string | null
  from_holder_id: string | null
  to_holder_id: string | null
  created_at: string
}

export const LIFECYCLE_LABELS: Record<ApScarletLantern47['lifecycle_state'], string> = {
  DORMANT:    '未登场',
  INTRODUCED: '已登场',
  ACTIVE:     '使用中',
  DAMAGED:    '损毁',
  RESOLVED:   '已结局',
}

export const LIFECYCLE_TAG_TYPES: Record<ApScarletLantern47['lifecycle_state'], 'default' | 'info' | 'success' | 'warning' | 'error'> = {
  DORMANT:    'default',
  INTRODUCED: 'info',
  ACTIVE:     'success',
  DAMAGED:    'error',
  RESOLVED:   'default',
}

export const CATEGORY_LABELS: Record<ApScarletLantern47['prop_category'], string> = {
  WEAPON:     '武器',
  ARTIFACT:   '法器',
  TOOL:       '工具',
  CONSUMABLE: '消耗品',
  TOKEN:      '信物',
  OTHER:      '其他',
}

export const CATEGORY_ICONS: Record<ApScarletLantern47['prop_category'], string> = {
  WEAPON:     '🗡',
  ARTIFACT:   '🔮',
  TOOL:       '🔧',
  CONSUMABLE: '💊',
  TOKEN:      '📜',
  OTHER:      '📦',
}

export const ApBrokenLattice = {
  list: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApScarletLantern47[]>(`/novels/${ApDuskyEmber18}/props`) as unknown as Promise<ApScarletLantern47[]>,

  create: (ApDuskyEmber18: string, body: Partial<ApScarletLantern47> & { name: string }) =>
    ApVinePyre48.post<ApScarletLantern47>(`/novels/${ApDuskyEmber18}/props`, body) as unknown as Promise<ApScarletLantern47>,

  get: (ApDuskyEmber18: string, propId: string) =>
    ApVinePyre48.get<ApScarletLantern47>(`/novels/${ApDuskyEmber18}/props/${propId}`) as unknown as Promise<ApScarletLantern47>,

  patch: (ApDuskyEmber18: string, propId: string, body: Partial<ApScarletLantern47>) =>
    ApVinePyre48.patch<ApScarletLantern47>(`/novels/${ApDuskyEmber18}/props/${propId}`, body) as unknown as Promise<ApScarletLantern47>,

  remove: (ApDuskyEmber18: string, propId: string) =>
    ApVinePyre48.delete(`/novels/${ApDuskyEmber18}/props/${propId}`),

  listEvents: (ApDuskyEmber18: string, propId: string) =>
    ApVinePyre48.get<ApOnyxEmber73[]>(`/novels/${ApDuskyEmber18}/props/${propId}/events`) as unknown as Promise<ApOnyxEmber73[]>,

  createEvent: (ApDuskyEmber18: string, propId: string, body: { chapter_number: ApSilentEmber55; event_type: string; description?: string; actor_character_id?: string | null; from_holder_id?: string | null; to_holder_id?: string | null }) =>
    ApVinePyre48.post<ApOnyxEmber73>(`/novels/${ApDuskyEmber18}/props/${propId}/events`, body) as unknown as Promise<ApOnyxEmber73>,
}
