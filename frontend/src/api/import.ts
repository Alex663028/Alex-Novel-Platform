/**
 * 大纲导入 API
 * 
 * 支持：
 * 1. 文本导入（POST /api/v1/import/md-text）
 * 2. 文件上传（POST /api/v1/import/md-file）
 * 3. 预览解析结果（POST /api/v1/import/parse-preview）
 */
import { apiClient, resolveHttpUrl } from './config'

export interface ImportNovelRequest {
  content: string
  novel_id?: string
  auto_complete?: boolean
}

export interface ImportPreview {
  title: string
  author: string
  genre: string
  target_chapters: number
  premise_preview: string
  characters: string[]
  protagonist: string | null
  world_settings: string[]
  locations: string[]
  structure_nodes: number
}

export interface ImportPreviewResponse {
  preview: ImportPreview
  missing: string[]
  present: string[]
  needs_completion: boolean
}

export interface ImportResult {
  novel_id: string
  title: string
  parsed: {
    title: string
    author: string
    genre: string
    target_chapters: number
    premise_length: number
    characters_count: number
    world_settings_count: number
    locations_count: number
    structure_nodes: number
  }
  completed: Record<string, unknown>
  saved: boolean
  message: string
  missing_fields?: string[]
  present_fields?: string[]
}

function makeFormData(file: File, novelId?: string, autoComplete?: boolean): FormData {
  const fd = new FormData()
  fd.append('file', file)
  if (novelId) fd.append('novel_id', novelId)
  if (autoComplete !== undefined) fd.append('auto_complete', String(autoComplete))
  return fd
}

export const importApi = {
  /**
   * 解析预览（不保存）
   */
  parsePreview: (file: File) => {
    const fd = makeFormData(file)
    return apiClient.post<ImportPreviewResponse>('/import/parse-preview', fd, {
      headers: { 'Content-Type': undefined },
    })
  },

  /**
   * 上传 MD 文件导入
   */
  importFromFile: (file: File, novelId?: string, autoComplete = true) => {
    const fd = makeFormData(file, novelId, autoComplete)
    return apiClient.post<ImportResult>('/import/md-file', fd, {
      headers: { 'Content-Type': undefined },
    })
  },

  /**
   * 文本导入 MD 大纲
   */
  importFromText: (content: string, novelId?: string, autoComplete = true) => {
    return apiClient.post<ImportResult>('/import/md-text', {
      content,
      novel_id: novelId,
      auto_complete: autoComplete,
    })
  },
}

export { resolveHttpUrl }
