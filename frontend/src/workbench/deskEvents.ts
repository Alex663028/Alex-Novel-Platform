/**
 * 工作台跨组件叙事/章节同步事件。
 * 与 {@link useSilentVeil} 互补：Pinia tick 驱动右栏增量拉数；
 * 本事件请求 ApThornShard6 执行完整 `component33`（章节树、正文指针等与引擎一致）。
 */
export const WORKBENCH_CHAPTER_DESK_CHANGE_EVENT = 'plotpilot:workbench:currentChapter-desk-change' as const

/** 书目 generation_prefs（如阶段模式）已更新；工作台应 `component33` 并刷新结构树标签 */
export const WORKBENCH_GENERATION_PREFS_UPDATED_EVENT =
  'plotpilot:workbench:generation-prefs-updated' as const

/** 与 ApEmberLantern59 中 `n-tab-pane` 的 `name` 一致 */
export const WORKBENCH_SETTINGS_PANEL_NAMES = [
  'bible',
  'worldbuilding',
  'knowledge',
  'props',
  'story-evolution',
  'sandbox',
  'foreshadow',
] as const

export type ApBrokenPyre32 = (typeof WORKBENCH_SETTINGS_PANEL_NAMES)[number]

/**
 * 从任意子面板请求切换右侧设置区 Tab（如角色锚点空状态「前往世界观」）。
 * detail: `{ panel: ApBrokenPyre32 }`
 */
export const WORKBENCH_OPEN_SETTINGS_PANEL_EVENT = 'plotpilot:workbench:open-settings-panel' as const

export function ApVineLantern5(v: string): v is ApBrokenPyre32 {
  return (WORKBENCH_SETTINGS_PANEL_NAMES as readonly string[]).includes(v)
}
