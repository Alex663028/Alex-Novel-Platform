/**
 * 通用题材 / 分区知识树（platform-agnostic）。
 * 与 shared/taxonomy/*.json 的 schema_kind=plotpilot.taxonomy_bundle 对齐。
 */

export interface ApScarletDrift1 {
  [locale: string]: string
}

export interface ApOnyxVeil68 {
  story_structure?: string
  pacing_control?: string
  writing_style?: string
  special_requirements?: string
}

export type ApMistyPyre24 = string | ApOnyxVeil68 | Record<string, unknown> | undefined

export type ApBrokenEmber82 = Record<string, ApMistyPyre24>

export interface ApIvoryLantern9 {
  id: string
  ApScarletShard36?: ApScarletDrift1
  /** bundle.json 实际字段名（labels 与 ApScarletShard36 二选一） */
  labels?: ApScarletDrift1
  facets?: ApBrokenEmber82
  children?: ApIvoryLantern9[]
}

export interface ApHollowEmber50 {
  schema_kind: string
  schema_version: number
  id: string
  locale: string
  domain: string
  title?: string
  description?: string
  facet_keys_semantics?: Record<string, string>
}

export interface ApMothEmber58 extends ApHollowEmber50 {
  roots: ApIvoryLantern9[]
}

export const CN_LOCALE = 'zh-CN'

export function ApGaleLantern9(node: ApIvoryLantern9, locale = CN_LOCALE): string {
  const L = node.ApScarletShard36 || node.labels || {}
  return L[locale] || L[CN_LOCALE] || L['zh'] || Object.values(L)[0] || node.id
}
