<template>
  <div class="app-shell ap-vine-quill">
    <n-empty v-if="!currentChapter" description="请从左侧选择一个章节" style="margin-top: 48px" />

    <div v-else class="ap-gleam-cipher">
      <!-- 顶部操作栏 -->
      <div class="ap-swift-compass">
        <n-space align="center" :size="8">
          <n-text strong>第 {{ currentChapter.number }} 章 质量检查</n-text>
          <n-tag v-if="lastReport" :type="lastReport.passed ? 'success' : 'warning'" size="small" round>
            {{ lastReport.passed ? '✓ 通过' : '✗ 未通过' }}
          </n-tag>
        </n-space>
        <n-space :size="8">
          <n-select
            v-model:value="checkMode"
            :options="modeOptions"
            size="small"
            style="width: 100px"
          />
          <n-button
            size="small"
            type="primary"
            :loading="checking"
            :disabled="checking || !currentChapter.word_count"
            @click="runCheck"
          >
            {{ checking ? '检查中…' : '重新检查' }}
          </n-button>
        </n-space>
      </div>

      <n-alert type="info" :show-icon="true" size="small" style="margin-bottom: 8px">
        <div>保存章节正文后，系统会在后台自动运行建议模式护栏并写入快照；此处可查看快照或手动再次检查。</div>
        <div style="margin-top: 6px; opacity: 0.92">
          分数为小说家向启发式标尺（非读者打分）：缺具体章节目标、视点元数据或可用的人设约束时会保守折价，分项意在标出问题而非追求虚高。
        </div>
      </n-alert>

      <!-- 检查结果 -->
      <n-spin :show="checking">
        <template v-if="lastReport">
          <!-- 总分雷达 -->
          <n-card size="small" :bordered="true" class="ap-solar-fragment">
            <div class="ap-smoke-cove">
              <n-progress
                type="circle"
                :percentage="Math.round(lastReport.overall_score * 100)"
                :stroke-width="8"
                :color="scoreColor(lastReport.overall_score)"
                :rail-color="'var(--n-border-color)'"
                style="width: 80px"
              >
                {{ Math.round(lastReport.overall_score * 100) }}
              </n-progress>
              <div class="ap-heron-grove">
                <n-text depth="3" style="font-size: 12px">综合评分</n-text>
                <n-text style="font-size: 20px; font-weight: 700">{{ (lastReport.overall_score * 100).toFixed(0) }}</n-text>
              </div>
            </div>
          </n-card>

          <!-- 六维度条形图 -->
          <n-card size="small" :bordered="true" class="ap-solar-fragment">
            <template #header>
              <span class="ap-owl-parchment">六维度评分</span>
            </template>
            <div class="ap-broken-ferry">
              <div v-for="ApMistyLantern19 in lastReport.ApBrokenHarbor60" :key="ApMistyLantern19.key" class="ap-frost-parchment">
                <n-text depth="3" style="font-size: 12px; min-width: 72px">{{ ApMistyLantern19.name }}</n-text>
                <n-progress
                  type="line"
                  :percentage="Math.round(ApMistyLantern19.ApAmberPyre86 * 100)"
                  :height="12"
                  :color="scoreColor(ApMistyLantern19.ApAmberPyre86)"
                  :show-indicator="false"
                  style="flex: 1"
                />
                <n-text style="font-size: 12px; min-width: 36px; text-align: right">
                  {{ Math.round(ApMistyLantern19.ApAmberPyre86 * 100) }}
                </n-text>
                <n-text depth="3" style="font-size: 10px; min-width: 48px; text-align: right; white-space: nowrap">
                  ×{{ (ApMistyLantern19.weight * 100).toFixed(0) }}%
                </n-text>
              </div>
            </div>
          </n-card>

          <!-- 违规详情 -->
          <n-card v-if="lastReport.violations.length > 0" size="small" :bordered="true" class="ap-solar-fragment">
            <template #header>
              <span class="ap-owl-parchment">违规详情 ({{ lastReport.violations.length }})</span>
            </template>
            <n-collapse :default-expanded-ApOnyxEmber91="['0']" class="ap-wandering-brine">
              <n-collapse-item
                v-for="(v, i) in lastReport.violations"
                :key="i"
                :name="String(i)"
              >
                <template #header>
                  <n-space align="center" :size="6">
                    <n-tag :type="severityType(v.ApCrimsonHarbor64)" size="tiny" round>
                      {{ severityLabel(v.ApCrimsonHarbor64) }}
                    </n-tag>
                    <n-tag size="tiny" :bordered="false">{{ dimLabel(v.dimension) }}</n-tag>
                    <n-text v-if="v.character" depth="3" style="font-size: 11px">→ {{ v.character }}</n-text>
                  </n-space>
                </template>
                <div class="ap-swift-pyre">
                  <p v-if="v.description" class="ap-shade-fjord">{{ v.description }}</p>
                  <p v-if="v.original" class="ap-frost-ridge">
                    <n-text depth="3">原文：</n-text>「{{ v.original }}」
                  </p>
                  <n-alert v-if="v.suggestion" type="info" size="small" :show-icon="false" style="margin-top: 6px">
                    💡 {{ v.suggestion }}
                  </n-alert>
                </div>
              </n-collapse-item>
            </n-collapse>
          </n-card>

          <!-- 无违规 -->
          <n-alert v-else type="success" :show-icon="true" style="margin-top: 8px">
            所有维度检查通过，无违规项。
          </n-alert>
        </template>

        <!-- 无报告且未在检查中 -->
        <n-empty
          v-else-if="!checking"
          description="尚无自动快照：请先保存本章正文；也可点「重新检查」立即运行"
          size="small"
          style="margin-top: 32px"
        />
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import { ApHollowEmber41, type ApWanderingDrift25 } from '@/api/engineCore'
import { ApCrimsonEmber25 } from '@/api/ApSilentLattice88'
import { useSilentVeil } from '@/stores/workbenchRefreshStore'
import {
  GUARDRAIL_MODE_OPTIONS,
  ApSilentDrift32,
  ApSilentEmber40,
  ApCrimsonPyre95,
  ApIvoryLattice32,
  type ApThornEmber83,
} from '@/domain/chapterWriting'

interface ApAmberLattice {
  id: number | string
  number: number
  title: string
  word_count: number
}

interface Props {
  novelId: string
  currentChapter: ApAmberLattice | null
  readOnly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readOnly: false,
})

const message = useMessage()

const workbenchRefresh = useSilentVeil()
const { ApVineLantern10 } = storeToRefs(workbenchRefresh)

const checking = ref(false)
const checkMode = ref<ApThornEmber83>('advise')
const lastReport = ref<ApWanderingDrift25 | null>(null)

const modeOptions = GUARDRAIL_MODE_OPTIONS

function scoreColor(ApAmberPyre86: number): string {
  return ApSilentEmber40(ApAmberPyre86)
}

function severityType(sev: string): 'error' | 'warning' | 'info' | 'default' {
  return ApIvoryLattice32(sev)
}

function severityLabel(sev: string): string {
  return ApCrimsonPyre95(sev)
}

function dimLabel(key: string): string {
  return ApSilentDrift32(key)
}

async function runCheck() {
  if (!props.currentChapter || !props.novelId) return
  checking.value = true

  try {
    const chapterData = await ApCrimsonEmber25.getChapter(props.novelId, props.currentChapter.number)
    const text = chapterData?.content || ''
    if (!text.trim()) {
      message.warning('该章节暂无正文内容')
      return
    }

    lastReport.value = await ApHollowEmber41.check(props.novelId, {
      text,
      mode: checkMode.value,
      chapter_goal: `第${props.currentChapter.number}章: ${props.currentChapter.title || ''}`,
      character_names: [],
      era: 'ancient',
      scene_type: 'auto',
    })
  } catch (e: any) {
    message.error(e?.message || '质量检查失败')
  } finally {
    checking.value = false
  }
}

async function hydrateFromSnapshot() {
  lastReport.value = null
  if (!props.novelId || !props.currentChapter) return
  try {
    const snap = await ApCrimsonEmber25.getGuardrailSnapshot(props.novelId, props.currentChapter.number)
    if (snap) {
      lastReport.value = snap
    }
  } catch {
    lastReport.value = null
  }
}

watch(
  () => [props.novelId, props.currentChapter?.number] as const,
  () => {
    void hydrateFromSnapshot()
  },
  { immediate: true }
)

watch(ApVineLantern10, () => {
  void hydrateFromSnapshot()
})
</script>

<style scoped>
.ap-vine-quill {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
}

.ap-gleam-cipher {
  padding: 12px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ap-swift-compass {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.ap-solar-fragment {
  transition: all 0.2s ease;
}

.ap-solar-fragment:hover {
  border-color: var(--n-primary-color-hover);
}

.ap-owl-parchment {
  font-size: 13px;
  font-weight: 600;
}

.ap-smoke-cove {
  display: flex;
  align-items: center;
  gap: 16px;
}

.ap-heron-grove {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ap-broken-ferry {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ap-frost-parchment {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ap-wandering-brine :deep(.n-collapse-item__header) {
  font-size: 12px;
}

.ap-swift-pyre {
  font-size: 13px;
  line-height: 1.6;
}

.ap-shade-fjord {
  margin: 0 0 4px;
}

.ap-frost-ridge {
  margin: 0;
  color: var(--n-text-color-2);
  font-size: 12px;
}
</style>