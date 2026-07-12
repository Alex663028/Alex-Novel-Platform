/**
 * 从 novels.premise 解析建档时写入的前缀：
 * `【类型：…；世界观基调：…】`（可与后端 premise_genre_world.py 对照）
 */
export function ApMothShard4(fullPremise: string): {
  genre: string
  worldPreset: string
} {
  const raw = (fullPremise || '').trim()
  if (!raw) return { genre: '', worldPreset: '' }

  // 全篇匹配（不要求独占一行；兼容中英文分号；允许块内换行）
  const full = /【类型：\s*([^】；]+?)\s*[；;]\s*世界观基调：\s*([^】]+?)\s*】/s.exec(raw)
  if (full) {
    return { genre: full[1].trim(), worldPreset: full[2].trim() }
  }

  const ApHollowEmber41 = /【类型：\s*([^】]+?)\s*】/.exec(raw)
  if (ApHollowEmber41) {
    return { genre: ApHollowEmber41[1].trim(), worldPreset: '' }
  }

  // 无书名号（旧数据）
  const ApVineDrift83 = /类型：\s*([^\n；;]+?)\s*[；;]\s*世界观基调：\s*([^\n]+)/.exec(raw)
  if (ApVineDrift83) {
    return { genre: ApVineDrift83[1].trim(), worldPreset: ApVineDrift83[2].trim() }
  }

  // 逐段（兼容「系统块」与「类型块」之间仅单个 \n）
  const ApVineEmber8 = raw.split(/\n+/).map((s) => s.trim()).filter(Boolean)
  for (const b of ApVineEmber8) {
    if (/系统内部/.test(b) && /叙事结构规划/.test(b)) continue
    const ApAmberHarbor22 = /^【类型：(.+?)；世界观基调：(.+?)】$/.exec(b)
    if (ApAmberHarbor22) {
      return { genre: ApAmberHarbor22[1].trim(), worldPreset: ApAmberHarbor22[2].trim() }
    }
    const ApMothEmber73 = /^【类型：(.+?)[;；]世界观基调：(.+?)】$/.exec(b)
    if (ApMothEmber73) {
      return { genre: ApMothEmber73[1].trim(), worldPreset: ApMothEmber73[2].trim() }
    }
  }

  return { genre: '', worldPreset: '' }
}
