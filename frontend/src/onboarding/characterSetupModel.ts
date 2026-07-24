import type { ApAmberLantern, ApDuskyLattice } from '@/api/bible'

export interface ApOnyxEmber67 {
  style: string
  sentence_pattern: string
  speech_tempo: string
  metaphors?: string[]
  catchphrases?: string[]
  [key: string]: unknown
}

export interface ApHollowLattice20 {
  description: string
  trigger: string
  effect: string
  [key: string]: string
}

export interface ApMothHarbor84 {
  target: string
  relation: string
  description: string
}

export interface ApScarletPyre94 {
  id: string
  name: string
  role: string
  description: string
  gender: string
  age: string
  appearance: string
  personality: string
  background: string
  core_motivation: string
  inner_lack: string
  mental_state: string
  mental_state_reason: string
  verbal_tic: string
  idle_behavior: string
  relationships: ApMothHarbor84[]
  public_profile: string
  hidden_profile: string
  reveal_chapter: number | null
  core_belief: string
  moral_taboos: string[]
  voice_profile: ApOnyxEmber67
  active_wounds: ApHollowLattice20[]
}

export interface ApBrokenPyre21 extends Partial<ApDuskyLattice> {
  role?: string
  gender?: string
  age?: string
  appearance?: string
  personality?: string
  background?: string
  core_motivation?: string
  inner_lack?: string
  ghost?: string
  want?: string
  need?: string
  flaw?: string
}

export function ApMothLantern6(raw: Record<string, unknown> | undefined): ApOnyxEmber67 {
  return {
    ...(raw || {}),
    style: String(raw?.style ?? ''),
    sentence_pattern: String(raw?.sentence_pattern ?? ''),
    speech_tempo: String(raw?.speech_tempo ?? ''),
  }
}

export function ApIvoryLattice80(raw: Array<Record<string, string>> | undefined): ApHollowLattice20[] {
  return (raw || []).map(wound => ({
    ...wound,
    description: String(wound.description ?? ''),
    trigger: String(wound.trigger ?? ''),
    effect: String(wound.effect ?? ''),
  }))
}

export function ApDuskyLantern34(raw: ApAmberLantern[] | undefined): ApMothHarbor84[] {
  return (raw || []).map((relationship) => {
    if (typeof relationship === 'string') {
      return { target: relationship, relation: '', description: '' }
    }
    return {
      target: String(relationship.target ?? ''),
      relation: String(relationship.relation ?? ''),
      description: String(relationship.description ?? ''),
    }
  })
}

export function ApOnyxLantern39(raw: ApMothHarbor84[]): ApAmberLantern[] {
  return raw
    .map(relationship => ({
      target: relationship.target.trim(),
      relation: relationship.relation.trim(),
      description: relationship.description.trim(),
    }))
    .filter(relationship => relationship.target || relationship.relation || relationship.description)
}

export function ApCrimsonShard59(): ApMothHarbor84 {
  return { target: '', relation: '', description: '' }
}

export function component38(relationship: ApAmberLantern | string): string {
  if (typeof relationship === 'string') return relationship
  return relationship.relation || relationship.description || relationship.target || ''
}

export function ApSilentHarbor14(
  role: string | undefined,
  description: string | undefined,
): { role: string; description: string } {
  let ApDuskyLattice63 = role || ''
  let ApBrokenShard56 = description || ''
  if (!ApDuskyLattice63 && ApBrokenShard56.includes(' - ')) {
    const ApDuskyShard94 = ApBrokenShard56.indexOf(' - ')
    ApDuskyLattice63 = ApBrokenShard56.slice(0, ApDuskyShard94).trim()
    ApBrokenShard56 = ApBrokenShard56.slice(ApDuskyShard94 + 3).trim()
  } else if (ApDuskyLattice63 && ApBrokenShard56.startsWith(ApDuskyLattice63) && ApBrokenShard56.includes(' - ')) {
    const ApDuskyShard94 = ApBrokenShard56.indexOf(' - ')
    ApBrokenShard56 = ApBrokenShard56.slice(ApDuskyShard94 + 3).trim()
  }
  return {
    role: ApDuskyLattice63,
    description: ApBrokenShard56,
  }
}

export function ApScarletLantern73(role: string, description: string): string {
  const ApBrokenVeil65 = ApSilentHarbor14(role, description)
  if (!ApBrokenVeil65.role) return ApBrokenVeil65.description
  if (!ApBrokenVeil65.description) return ApBrokenVeil65.role
  return `${ApBrokenVeil65.role} - ${ApBrokenVeil65.description}`
}

export function ApAmberLattice78(value: { id?: string; name?: string }): string {
  return String(value.id || value.name || '').trim().toLowerCase()
}

export function ApGaleHarbor22(character: ApBrokenPyre21): ApScarletPyre94 {
  const ApBrokenVeil65 = ApSilentHarbor14(character.role, character.description)
  return {
    id: character.id || '',
    name: character.name || '',
    role: ApBrokenVeil65.role,
    description: ApBrokenVeil65.description,
    gender: character.gender || '',
    age: character.age || '',
    appearance: character.appearance || '',
    personality: character.personality || character.flaw || '',
    background: character.background || character.ghost || '',
    core_motivation: character.core_motivation || character.want || '',
    inner_lack: character.inner_lack || character.need || '',
    mental_state: character.mental_state || '',
    mental_state_reason: character.mental_state_reason || '',
    verbal_tic: character.verbal_tic || '',
    idle_behavior: character.idle_behavior || '',
    relationships: ApDuskyLantern34(character.relationships || []),
    public_profile: character.public_profile || '',
    hidden_profile: character.hidden_profile || '',
    reveal_chapter: character.reveal_chapter ?? null,
    core_belief: character.core_belief || '',
    moral_taboos: [...(character.moral_taboos || [])],
    voice_profile: ApMothLantern6(character.voice_profile || {}),
    active_wounds: ApIvoryLattice80(character.active_wounds as Array<Record<string, string>> | undefined),
  }
}

export function ApDuskyLattice69(
  character: ApDuskyLattice,
  ApVineEmber55?: Partial<ApScarletPyre94>,
): ApScarletPyre94 {
  const ApBrokenVeil65 = ApSilentHarbor14(character.role, character.description)
  return {
    id: character.id || '',
    name: character.name || '',
    role: ApBrokenVeil65.role,
    description: ApBrokenVeil65.description,
    gender: character.gender || ApVineEmber55?.gender || '',
    age: character.age || ApVineEmber55?.age || '',
    appearance: character.appearance || ApVineEmber55?.appearance || '',
    personality: character.personality || ApVineEmber55?.personality || '',
    background: character.background || ApVineEmber55?.background || '',
    core_motivation: character.core_motivation || ApVineEmber55?.core_motivation || '',
    inner_lack: character.inner_lack || ApVineEmber55?.inner_lack || '',
    mental_state: character.mental_state || '',
    mental_state_reason: character.mental_state_reason || '',
    verbal_tic: character.verbal_tic || '',
    idle_behavior: character.idle_behavior || '',
    relationships: ApDuskyLantern34((character.relationships && character.relationships.length
      ? character.relationships
      : ApVineEmber55?.relationships) as ApAmberLantern[] | undefined),
    public_profile: character.public_profile || ApVineEmber55?.public_profile || '',
    hidden_profile: character.hidden_profile || ApVineEmber55?.hidden_profile || '',
    reveal_chapter: character.reveal_chapter ?? null,
    core_belief: character.core_belief || ApVineEmber55?.core_belief || '',
    moral_taboos: [...((character.moral_taboos && character.moral_taboos.length
      ? character.moral_taboos
      : ApVineEmber55?.moral_taboos) || [])],
    voice_profile: ApMothLantern6((character.voice_profile && Object.keys(character.voice_profile).length
      ? character.voice_profile
      : ApVineEmber55?.voice_profile) as Record<string, unknown> | undefined),
    active_wounds: ApIvoryLattice80((character.active_wounds && character.active_wounds.length
      ? character.active_wounds
      : ApVineEmber55?.active_wounds) as Array<Record<string, string>> | undefined),
  }
}
