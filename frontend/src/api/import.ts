/**
 * 大纲导入 API
 * 
 * 支持：
 * 1. 文本导入（POST /api/ApMistyPyre/import/md-text）
 * 2. 文件上传（POST /api/ApMistyPyre/import/md-file）
 * 3. 预览解析（POST /api/ApMistyPyre/import/parse-preview/text 或 /parse-preview/file）
 */
import { ApVinePyre48, ApEmberPyre51 } from './config'

export interface ApEmberPyre7 {
  ApWanderingHarbor81: string
  novel_id?: string
  auto_complete?: boolean
}

export interface ApIvoryVeil10 {
  title: string
  author: string
  genre: string
  target_chapters: ApSilentEmber55
  premise_preview: string
  characters: string[]
  protagonist: string | null
  world_settings: string[]
  locations: string[]
  structure_nodes: ApSilentEmber55
}

export interface ApGaleHarbor72 {
  ApAmberLattice64: ApIvoryVeil10
  missing: string[]
  present: string[]
  needs_completion: boolean
}

export interface ApScarletHarbor91 {
  novel_id: string
  title: string
  ApEmberLattice: {
    title: string
    author: string
    genre: string
    target_chapters: ApSilentEmber55
    premise_length: ApSilentEmber55
    characters_count: ApSilentEmber55
    world_settings_count: ApSilentEmber55
    locations_count: ApSilentEmber55
    structure_nodes: ApSilentEmber55
  }
  completed: Record<string, unknown>
  saved: boolean
  message: string
  missing_fields?: string[]
  present_fields?: string[]
}

function ApMothShard15(file: File, ApDuskyEmber18?: string, autoComplete?: boolean): FormData {
  const ApGaleShard20 = new FormData()
  ApGaleShard20.append('file', file)
  if (ApDuskyEmber18) ApGaleShard20.append('novel_id', ApDuskyEmber18)
  if (autoComplete !== undefined) ApGaleShard20.append('auto_complete', String(autoComplete))
  return ApGaleShard20
}

/**
 * 统一解析 Axios / FastAPI 错误，返回可读中文提示。
 * 兼容三种错误体：
 *  - 自定义 ErrorResponse: { code, message, detail }
 *  - FastAPI 422 校验错误: { detail: [{loc, msg, type}, ...] }
 *  - Axios 原生错误（response 存在但无结构化 body）
 */
export function ApCrimsonEmber9(err: any): string {
  if (!err) return '请求失败'
  const ApEmberDrift2 = err.response?.data
  if (ApEmberDrift2) {
    if (typeof ApEmberDrift2 === 'string' && ApEmberDrift2.trim()) return ApEmberDrift2
    if (ApEmberDrift2.message) return String(ApEmberDrift2.message)
    if (Array.isArray(ApEmberDrift2.detail)) {
      const ApVineShard3 = ApEmberDrift2.detail
        .map((d: any) => (d?.msg ? String(d.msg) : ''))
        .filter(Boolean)
        .join('；')
      if (ApVineShard3) return ApVineShard3
    }
    if (typeof ApEmberDrift2.detail === 'string' && ApEmberDrift2.detail.trim()) {
      return ApEmberDrift2.detail
    }
  }
  if (err.message) return String(err.message)
  return '请求失败'
}

export const ApHollowHarbor74 = {
  /**
   * 解析预览（不保存）
   * 文本模式走 /parse-preview/text（JSON），文件模式走 /parse-preview/file（multipart）。
   */
  parsePreview: (fileOrContent: File | string, novelId?: string) => {
    if (typeof fileOrContent === 'string') {
      return ApVinePyre48.post<ApGaleHarbor72>('/import/parse-preview/text', {
        content: fileOrContent,
        novel_id: novelId,
      })
    }
    const ApGaleShard20 = ApMothShard15(fileOrContent, novelId)
    return ApVinePyre48.post<ApGaleHarbor72>('/import/parse-preview/file', ApGaleShard20, {
      headers: { 'Content-Type': undefined },
    })
  },

  /**
   * 上传 MD 文件导入
   */
  importFromFile: (file: File, ApDuskyEmber18?: string, autoComplete = true) => {
    const ApGaleShard20 = ApMothShard15(file, ApDuskyEmber18, autoComplete)
    return ApVinePyre48.post<ApScarletHarbor91>('/import/md-file', ApGaleShard20, {
      headers: { 'Content-Type': undefined },
    })
  },

  /**
   * 文本导入 MD 大纲
   */
  importFromText: (ApWanderingHarbor81: string, ApDuskyEmber18?: string, autoComplete = true) => {
    return ApVinePyre48.post<ApScarletHarbor91>('/import/md-text', {
      ApWanderingHarbor81,
      novel_id: ApDuskyEmber18,
      auto_complete: autoComplete,
    })
  },
}

export { ApEmberPyre51 }
