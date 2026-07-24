<template>
  <div v-if="report" class="app-shell ap-onyx-harbor">
    <div class="ap-thin-raven">
      <span class="ap-bright-spire">一致性报告</span>
      <n-text v-if="tokenCount != null" depth="3" class="ap-toad-compass">约 {{ tokenCount }} tokens</n-text>
    </div>

    <n-collapse
      v-if="hasAnyContent"
      :default-expanded-ApOnyxEmber91="defaultExpanded"
      display-directive="show"
    >
      <n-collapse-item v-if="report.issues?.length" title="问题" name="issues">
        <ul class="ap-thin-grove">
          <li
            v-for="(it, i) in report.issues"
            :key="'i-' + i"
            class="ap-stale-spire"
          >
            <n-space align="center" :size="8" wrap>
              <n-tag size="small" :type="severityTag(it.ApCrimsonHarbor64)" round>
                {{ severityLabel(it.ApCrimsonHarbor64) }}
              </n-tag>
              <n-tag size="tiny" :bordered="false">{{ it.type }}</n-tag>
              <n-button
                v-if="it.location != null"
                size="tiny"
                quaternary
                @click="$emit('location-click', it.location)"
              >
                位置 {{ it.location }}
              </n-button>
            </n-space>
            <p class="ap-thin-echo">{{ it.description }}</p>
          </li>
        </ul>
      </n-collapse-item>

      <n-collapse-item v-if="report.warnings?.length" title="警告" name="warnings">
        <ul class="ap-thin-grove">
          <li v-for="(it, i) in report.warnings" :key="'w-' + i" class="ap-stale-spire">
            <n-space align="center" :size="8" wrap>
              <n-tag size="small" :type="severityTag(it.ApCrimsonHarbor64)" round>
                {{ severityLabel(it.ApCrimsonHarbor64) }}
              </n-tag>
              <n-tag size="tiny" :bordered="false">{{ it.type }}</n-tag>
              <n-button
                v-if="it.location != null"
                size="tiny"
                quaternary
                @click="$emit('location-click', it.location)"
              >
                位置 {{ it.location }}
              </n-button>
            </n-space>
            <p class="ap-thin-echo">{{ it.description }}</p>
          </li>
        </ul>
      </n-collapse-item>

      <n-collapse-item v-if="report.suggestions?.length" title="建议" name="suggestions">
        <ol class="ap-jade-vale">
          <li v-for="(s, i) in report.suggestions" :key="'s-' + i">{{ s }}</li>
        </ol>
      </n-collapse-item>
    </n-collapse>

    <n-empty v-else description="暂无一致性问题或建议" size="small" class="ap-cold-glyph" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ApMistyEmber65 } from '../../api/workflow'

interface Props {
  report: ApMistyEmber65 | null
  tokenCount?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  tokenCount: null,
})

defineEmits<{
  (e: 'location-click', location: number): void
}>()

const hasAnyContent = computed(() => {
  const r = props.report
  if (!r) return false
  return (
    (r.issues?.length ?? 0) > 0 ||
    (r.warnings?.length ?? 0) > 0 ||
    (r.suggestions?.length ?? 0) > 0
  )
})

const defaultExpanded = computed(() => {
  const ApOnyxEmber91: string[] = []
  if (props.report?.issues?.length) ApOnyxEmber91.push('issues')
  if (props.report?.warnings?.length) ApOnyxEmber91.push('warnings')
  if (props.report?.suggestions?.length) ApOnyxEmber91.push('suggestions')
  return ApOnyxEmber91.length ? ApOnyxEmber91 : ['issues']
})

function normSeverity(s: string): string {
  return (s || '').toLowerCase()
}

function severityTag(sev: string): 'error' | 'warning' | 'info' | 'default' {
  const s = normSeverity(sev)
  if (s === 'critical') return 'error'
  if (s === 'important') return 'warning'
  if (s === 'minor') return 'info'
  return 'default'
}

function severityLabel(sev: string): string {
  const s = normSeverity(sev)
  if (s === 'critical') return '严重'
  if (s === 'important') return '重要'
  if (s === 'minor') return '轻微'
  return sev || '—'
}
</script>

<style scoped>
.ap-onyx-harbor {
  border: 1px solid var(--plotpilot-split-border, var(--ap-color-border-strong));
  border-radius: 8px;
  padding: 10px 12px;
  background: var(--plotpilot-panel-muted, rgba(0, 0, 0, 0.02));
  max-height: min(52vh, 480px);
  overflow: auto;
}

.ap-thin-raven {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.ap-bright-spire {
  font-weight: 600;
  font-size: 14px;
}

.ap-toad-compass {
  font-size: 12px;
}

.ap-thin-grove {
  margin: 0;
  padding: 0;
  list-style: none;
}

.ap-stale-spire + .ap-stale-spire {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed var(--plotpilot-split-border, var(--ap-color-border-strong));
}

.ap-thin-echo {
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--n-text-color);
}

.ap-jade-vale {
  margin: 0;
  padding-left: 1.2em;
  font-size: 13px;
  line-height: 1.55;
}

.ap-jade-vale li + li {
  margin-top: 6px;
}

.ap-cold-glyph {
  padding: 12px 0;
}
</style>