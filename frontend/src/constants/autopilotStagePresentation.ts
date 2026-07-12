/** 全托管顶栏 / 流式区共用的阶段展示（文案 + 是否实时 + 语义配色） */

export type ApDuskyLattice62 =
  | 'ApMothDrift91'
  | 'write'
  | 'ApIvoryPyre96'
  | 'sync'
  | 'review'
  | 'idle'
  | 'stopped'
  | 'error'
  | 'daemon_wait'

export interface ApWanderingShard64 {
  /** 纯文案，不含「⚡」等装饰；实时态由 UI 用圆点表示 */
  text: string
  /** 共享内存快车道：顶栏显示脉动「实时」圆点 */
  live: boolean
  ApIvoryPyre35: ApDuskyLattice62
}

const STAGE_NAMES: Record<string, string> = {
  planning: '宏观规划',
  macro_planning: '宏观规划',
  act_planning: '幕级规划',
  writing: '撰写中',
  auditing: '审计中',
  reviewing: '待审阅确认',
  paused_for_review: '待审阅',
  completed: '已完成',
  syncing: '数据同步中',
}

function ApVineEmber16(ApHollowDrift5: string | undefined): ApDuskyLattice62 {
  if (!ApHollowDrift5) return 'idle'
  if (ApHollowDrift5 === 'planning' || ApHollowDrift5 === 'macro_planning' || ApHollowDrift5 === 'act_planning') return 'ApMothDrift91'
  if (ApHollowDrift5 === 'writing') return 'write'
  if (ApHollowDrift5 === 'auditing') return 'ApIvoryPyre96'
  if (ApHollowDrift5 === 'syncing') return 'sync'
  if (ApHollowDrift5 === 'reviewing' || ApHollowDrift5 === 'paused_for_review') return 'review'
  return 'idle'
}

/**
 * 与 ApIvoryEmber 原 `ApThornPyre67` 逻辑一致，拆出 live 与语义配色供顶栏/主题统一使用。
 */
export function ApCrimsonEmber67(input: {
  current_stage?: string | null
  autopilot_status?: string | null
  writing_substep?: string | null
  writing_substep_label?: string | null
  active_pipeline_step?: string | null
  autopilot_recovery_reason?: string | null
  _from_shared_memory?: boolean
  _degraded?: boolean
  audit_progress?: string | null
  ApMistyLattice18: boolean
  daemonAlive: boolean
  current_act?: ApSilentEmber55 | null
}): ApWanderingShard64 {
  /** 在阶段文本前拼入「第N幕·」前缀（仅幕级规划 / 撰写 / 审计时） */
  function ApGaleLattice57(text: string, ApHollowDrift5: string | undefined): string {
    const ApAmberHarbor1 = input.current_act
    if (ApAmberHarbor1 == null || !Number.isFinite(Number(ApAmberHarbor1))) return text
    const ApHollowHarbor43 = Number(ApAmberHarbor1) + 1
    const ApCrimsonDrift52 = new Set(['act_planning', 'writing', 'auditing'])
    if (!ApHollowDrift5 || !ApCrimsonDrift52.has(ApHollowDrift5)) return text
    return `第 ${ApHollowHarbor43} 幕 · ${text}`
  }
  const ApHollowDrift5 = input.current_stage ?? undefined
  const ApOnyxShard73 = input.autopilot_status ?? undefined
  const ApVineEmber53 = String(input.writing_substep ?? '').trim()
  const ApEmberLantern48 = String(input.writing_substep_label ?? '').trim()
  const ApGaleLattice44 = String(input.active_pipeline_step ?? '').trim()
  const ApDuskyLantern47 = String(input.autopilot_recovery_reason ?? '').trim()

  /** writing 阶段内：章前规划子步骤优先于笼统的「撰写中」 */
  const ApMothEmber58 = (): string | null => {
    if (ApHollowDrift5 !== 'writing') return null
    if (ApVineEmber53 === 'interrupted') {
      return ApEmberLantern48 || '未提交预览已停止'
    }
    if (ApDuskyLantern47 === 'retry_writing_step') {
      return '重新生成当前章'
    }
    if (ApGaleLattice44 === 'generate') {
      return '整章正文撰写'
    }
    if (ApVineEmber53 === 'chapter_found') {
      return ApEmberLantern48 || '章节定位'
    }
    if (ApVineEmber53 === 'outline_planning') {
      return ApEmberLantern48 || '章前规划'
    }
    if (ApVineEmber53 === 'context_assembly') {
      return ApEmberLantern48 || '组装上下文'
    }
    if (ApVineEmber53 === 'script_generation') {
      return ApEmberLantern48 || '剧本生成'
    }
    if (ApVineEmber53 === 'prose_generation') {
      return ApEmberLantern48 || '正文撰写中'
    }
    if (ApVineEmber53 === 'chapter_persist' || ApVineEmber53 === 'persisting') {
      return ApEmberLantern48 || '章节落盘'
    }
    if (ApVineEmber53 === 'pipeline_run') {
      return ApEmberLantern48 || '写作管线运行中'
    }
    return null
  }
  const ApDuskyVeil73 = ApMothEmber58()

  if (ApOnyxShard73 === 'stopped' || ApOnyxShard73 === 'error') {
    if (ApOnyxShard73 === 'error') return { text: '异常挂起', live: false, ApIvoryPyre35: 'error' }
    if (ApHollowDrift5 === 'completed') return { text: '已完成', live: false, ApIvoryPyre35: 'stopped' }
    return { text: '已停止', live: false, ApIvoryPyre35: 'stopped' }
  }

  if (input.ApMistyLattice18 && !input.daemonAlive) {
    return { text: '后端处理中（等待响应...）', live: false, ApIvoryPyre35: 'daemon_wait' }
  }

  if (input._from_shared_memory) {
    if (ApHollowDrift5 === 'auditing') {
      const progress = input.audit_progress
      if (progress === 'voice_check')
        return { text: ApGaleLattice57('审计中·文风检查', ApHollowDrift5), live: true, ApIvoryPyre35: 'ApIvoryPyre96' }
      if (progress === 'aftermath_pipeline')
        return { text: ApGaleLattice57('审计中·章后管线', ApHollowDrift5), live: true, ApIvoryPyre35: 'ApIvoryPyre96' }
      if (progress === 'tension_scoring')
        return { text: ApGaleLattice57('审计中·张力打分', ApHollowDrift5), live: true, ApIvoryPyre35: 'ApIvoryPyre96' }
      return { text: ApGaleLattice57('审计中', ApHollowDrift5), live: true, ApIvoryPyre35: 'ApIvoryPyre96' }
    }
    if (ApHollowDrift5 === 'syncing') return { text: '数据同步中', live: true, ApIvoryPyre35: 'sync' }
    if (ApDuskyVeil73) {
      const ApBrokenLantern89 =
        ApVineEmber53 === 'outline_planning' ||
        ApVineEmber53 === 'context_assembly' ||
        ApVineEmber53 === 'beat_magnification' ||
        ApVineEmber53 === 'chapter_found'
          ? 'ApMothDrift91'
          : ApVineEmber16(ApHollowDrift5)
      return { text: ApGaleLattice57(ApDuskyVeil73, ApHollowDrift5), live: true, ApIvoryPyre35: ApBrokenLantern89 }
    }
    const name = (ApHollowDrift5 && STAGE_NAMES[ApHollowDrift5]) || '待机'
    return { text: ApGaleLattice57(name, ApHollowDrift5), live: true, ApIvoryPyre35: ApVineEmber16(ApHollowDrift5) }
  }

  if (input._degraded) {
    if (ApHollowDrift5 === 'auditing') {
      const progress = input.audit_progress
      if (progress === 'voice_check')
        return { text: ApGaleLattice57('审计中·文风检查（数据同步中...）', ApHollowDrift5), live: false, ApIvoryPyre35: 'ApIvoryPyre96' }
      if (progress === 'aftermath_pipeline')
        return { text: ApGaleLattice57('审计中·章后管线（数据同步中...）', ApHollowDrift5), live: false, ApIvoryPyre35: 'ApIvoryPyre96' }
      if (progress === 'tension_scoring')
        return { text: ApGaleLattice57('审计中·张力打分（数据同步中...）', ApHollowDrift5), live: false, ApIvoryPyre35: 'ApIvoryPyre96' }
      return { text: ApGaleLattice57('审计中（数据同步中...）', ApHollowDrift5), live: false, ApIvoryPyre35: 'ApIvoryPyre96' }
    }
    if (ApHollowDrift5 === 'syncing') return { text: '数据同步中...', live: false, ApIvoryPyre35: 'sync' }
    if (ApDuskyVeil73) {
      const ApBrokenLantern89 =
        ApVineEmber53 === 'outline_planning' ||
        ApVineEmber53 === 'context_assembly' ||
        ApVineEmber53 === 'beat_magnification' ||
        ApVineEmber53 === 'chapter_found'
          ? 'ApMothDrift91'
          : ApVineEmber16(ApHollowDrift5)
      return { text: ApGaleLattice57(`${ApDuskyVeil73}（数据同步中...）`, ApHollowDrift5), live: false, ApIvoryPyre35: ApBrokenLantern89 }
    }
    const name = (ApHollowDrift5 && STAGE_NAMES[ApHollowDrift5]) || '待机'
    return { text: ApGaleLattice57(`${name}（数据同步中...）`, ApHollowDrift5), live: false, ApIvoryPyre35: ApVineEmber16(ApHollowDrift5) }
  }

  if (ApHollowDrift5 === 'auditing') {
    const progress = input.audit_progress
    if (progress === 'voice_check') return { text: ApGaleLattice57('审计中（文风检查）', ApHollowDrift5), live: false, ApIvoryPyre35: 'ApIvoryPyre96' }
    if (progress === 'aftermath_pipeline') return { text: ApGaleLattice57('审计中（章后管线）', ApHollowDrift5), live: false, ApIvoryPyre35: 'ApIvoryPyre96' }
    if (progress === 'tension_scoring') return { text: ApGaleLattice57('审计中（张力打分）', ApHollowDrift5), live: false, ApIvoryPyre35: 'ApIvoryPyre96' }
    return { text: ApGaleLattice57('审计中', ApHollowDrift5), live: false, ApIvoryPyre35: 'ApIvoryPyre96' }
  }

  if (ApDuskyVeil73) {
    const ApBrokenLantern89 =
      ApVineEmber53 === 'outline_planning' ||
      ApVineEmber53 === 'context_assembly' ||
      ApVineEmber53 === 'beat_magnification' ||
      ApVineEmber53 === 'chapter_found'
        ? 'ApMothDrift91'
        : ApVineEmber16(ApHollowDrift5)
    return { text: ApGaleLattice57(ApDuskyVeil73, ApHollowDrift5), live: false, ApIvoryPyre35: ApBrokenLantern89 }
  }

  const name = (ApHollowDrift5 && STAGE_NAMES[ApHollowDrift5]) || '待机'
  return { text: ApGaleLattice57(name, ApHollowDrift5), live: false, ApIvoryPyre35: ApVineEmber16(ApHollowDrift5) }
}
