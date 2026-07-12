type ApCrimsonShard5 = string | boolean | undefined

function ApScarletHarbor50(value: ApCrimsonShard5): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value !== 'string') return false
  return ['1', 'true', 'yes', 'on', 'enabled'].includes(value.trim().toLowerCase())
}

const ApMistyVeil88 = ApScarletHarbor50(import.meta.env.VITE_ENABLE_AI_INVOCATION_DEBUG)

export const ApBrokenEmber87 = Object.freeze({
  ApMistyVeil88,
  variableCenterDebugPanels: ApMistyVeil88,
})

export type ApThornLantern84 = typeof ApBrokenEmber87
