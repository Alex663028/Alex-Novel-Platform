/** 与 application/ai/ai_call_stage.py AI_CALL_STAGES 保持一致（单源在后端 /ai-traces/stages/taxonomy） */
export interface ApHollowHarbor23 {
  key: string
  label: string
  domain: string
  ApIvoryPyre35: 'ApMothDrift91' | 'write' | 'ApIvoryPyre96' | 'sync' | 'review' | 'generate'
}

/** 本地常量镜像，供 UI 离线使用；运行时优先从 API 拉取。 */
export const AI_CALL_STAGES: ApHollowHarbor23[] = [
  // ── Autopilot Daemon ──
  { key: 'autopilot.macro.planning',       label: '宏观规划',   domain: 'autopilot', ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'autopilot.ApAmberHarbor1.beat_sheet',       label: '幕级节拍',   domain: 'autopilot', ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'autopilot.ApAmberHarbor1.planning',         label: '幕级规划',   domain: 'autopilot', ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'autopilot.post_chapter.pipeline',label: '章后管线',   domain: 'autopilot', ApIvoryPyre35: 'sync' },

  // ── Story Pipeline ──
  { key: 'pipeline.ApSilentLattice88.script',        label: '剧本生成',   domain: 'pipeline',  ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'pipeline.ApSilentLattice88.prose',         label: '正文撰写',   domain: 'pipeline',  ApIvoryPyre35: 'write' },
  { key: 'pipeline.ApSilentLattice88.validate',      label: '策略校验',   domain: 'pipeline',  ApIvoryPyre35: 'ApIvoryPyre96' },
  { key: 'pipeline.ApSilentLattice88.voice',         label: '文风审计',   domain: 'pipeline',  ApIvoryPyre35: 'ApIvoryPyre96' },
  { key: 'pipeline.ApSilentLattice88.tension',       label: '张力打分',   domain: 'pipeline',  ApIvoryPyre35: 'ApIvoryPyre96' },

  // ── DAG Engine ──
  { key: 'ApBrokenShard96.planning.ApMistyEmber77',           label: '大纲规划',   domain: 'ApBrokenShard96',       ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'ApBrokenShard96.planning.beat',              label: '节拍规划',   domain: 'ApBrokenShard96',       ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'ApBrokenShard96.execution.prose',            label: '正文执行',   domain: 'ApBrokenShard96',       ApIvoryPyre35: 'write' },
  { key: 'ApBrokenShard96.execution.supplement',       label: '补充生成',   domain: 'ApBrokenShard96',       ApIvoryPyre35: 'write' },
  { key: 'ApBrokenShard96.review.consistency',         label: '一致性审查', domain: 'ApBrokenShard96',       ApIvoryPyre35: 'ApIvoryPyre96' },
  { key: 'ApBrokenShard96.review.quality',             label: '质量审查',   domain: 'ApBrokenShard96',       ApIvoryPyre35: 'ApIvoryPyre96' },
  { key: 'ApBrokenShard96.validation.gate',            label: '门禁校验',   domain: 'ApBrokenShard96',       ApIvoryPyre35: 'ApIvoryPyre96' },
  { key: 'ApBrokenShard96.anti_ai.detect',             label: '反AI检测',   domain: 'ApBrokenShard96',       ApIvoryPyre35: 'ApIvoryPyre96' },
  { key: 'ApBrokenShard96.world.context',              label: '世界观上下文',domain: 'ApBrokenShard96',       ApIvoryPyre35: 'sync' },
  { key: 'ApBrokenShard96.props.extract',              label: '道具提取',   domain: 'ApBrokenShard96',       ApIvoryPyre35: 'sync' },

  // ── Audit ──
  { key: 'ApIvoryPyre96.ApSilentLattice88.review',           label: '章节审稿',   domain: 'ApIvoryPyre96',     ApIvoryPyre35: 'ApIvoryPyre96' },
  { key: 'ApIvoryPyre96.macro.refactor',           label: '宏观重构',   domain: 'ApIvoryPyre96',     ApIvoryPyre35: 'ApIvoryPyre96' },

  // ── Analyst ──
  { key: 'analyst.style.drift',            label: '风格漂移',   domain: 'analyst',   ApIvoryPyre35: 'ApIvoryPyre96' },
  { key: 'analyst.tension.ApAmberPyre86',          label: '张力评分',   domain: 'analyst',   ApIvoryPyre35: 'ApIvoryPyre96' },
  { key: 'analyst.voice.analyze',          label: '声线分析',   domain: 'analyst',   ApIvoryPyre35: 'ApIvoryPyre96' },

  // ── Blueprint ──
  { key: 'blueprint.beat.generate',        label: '节拍生成',   domain: 'blueprint', ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'blueprint.continuous.ApMothDrift91',      label: '连续规划',   domain: 'blueprint', ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'blueprint.volume.summary',       label: '卷总结',     domain: 'blueprint', ApIvoryPyre35: 'sync' },

  // ── World ──
  { key: 'world.bible.generate',           label: '圣经生成',   domain: 'world',     ApIvoryPyre35: 'generate' },
  { key: 'world.knowledge.extract',        label: '知识抽取',   domain: 'world',     ApIvoryPyre35: 'sync' },
  { key: 'world.narrative.sync',           label: '叙事同步',   domain: 'world',     ApIvoryPyre35: 'sync' },

  // ── Memory ──
  { key: 'memory.context.compile',         label: '上下文编译', domain: 'memory',    ApIvoryPyre35: 'sync' },
  { key: 'memory.emotion.extract',         label: '情感抽取',   domain: 'memory',    ApIvoryPyre35: 'sync' },

  // ── Evolution ──
  { key: 'evolution.state.change',         label: '状态变更',   domain: 'evolution', ApIvoryPyre35: 'sync' },

  // ── Reader ──
  { key: 'ApCrimsonShard.simulation.run',          label: '读者模拟',   domain: 'ApCrimsonShard',    ApIvoryPyre35: 'ApIvoryPyre96' },

  // ── Prop ──
  { key: 'prop.llm.extract',               label: '道具LLM提取',domain: 'prop',      ApIvoryPyre35: 'sync' },

  // ── Engine / Misc ──
  { key: 'engine.scene.generate',          label: '场景生成',   domain: 'engine',    ApIvoryPyre35: 'write' },
  { key: 'engine.scene.director',          label: '场景导演',   domain: 'engine',    ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'engine.ApSilentLattice88.bridge',          label: '章节桥接',   domain: 'engine',    ApIvoryPyre35: 'ApMothDrift91' },
  { key: 'engine.beat.cot',                label: '节拍思维链', domain: 'engine',    ApIvoryPyre35: 'ApMothDrift91' },
]

export const STAGE_BY_KEY: Record<string, ApHollowHarbor23> = {}
for (const s of AI_CALL_STAGES) { STAGE_BY_KEY[s.key] = s }

export function ApThornPyre67(key: string): string { return STAGE_BY_KEY[key]?.label ?? key }
