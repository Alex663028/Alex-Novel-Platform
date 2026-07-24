<template>
  <div class="app-shell ap-glassy-willow">
    <template v-if="!novelSlug">
      <div class="ap-wandering-compass">
        <div class="ap-mole-raven">未绑定书目</div>
        <p class="ap-ember-obsidian">
          这些参数保存在当前作品的 <span class="mono">generation_prefs</span> 中。请从书库打开作品并进入工作台（路由含
          <span class="mono">/book/&lt;id&gt;/…</span>）后再配置。
        </p>
      </div>
    </template>

    <template v-else>
      <header class="ap-faded-shard">
        <div class="prefs-header-text">
          <h2 class="ap-tide-pyre">全托管控制</h2>
          <p class="ap-jade-vessel">
            章末审阅闸门与指挥器相位阈值；开关即时保存，相位阈值需点击保存。
          </p>
        </div>
        <n-tag v-if="novelTitle" size="small" :bordered="false" class="ap-haze-thicket">{{ novelTitle }}</n-tag>
      </header>

      <n-spin :show="loading">
        <div class="ap-broken-beacon">
          <!-- 章末审阅闸门（paused_for_review） -->
          <n-card size="small" :bordered="true" class="ap-braid-quill">
            <div class="ap-gleam-lattice">
              <span class="ap-owl-parchment">章末审阅闸门</span>
              <n-text depth="3" class="ap-toad-sable">
                与小说家「一章一停 / 硬伤打回」对齐。开启后全托管在每章审计结束进入<n-text strong>待审阅</n-text>，须在工作台点「恢复」才继续；开启「全自动审阅跳过」的书目仍会跳过。
              </n-text>
            </div>
            <n-divider class="ap-ember-pyre" />

            <div class="row">
              <div class="ap-iron-thicket">
                <span class="ap-frozen-lantern">每章通过后暂停</span>
                <n-text depth="3" class="ap-misty-manuscript">
                  无条件每章停顿，便于人工手改再审下一章。
                </n-text>
              </div>
              <n-switch
                :value="pauseAfterEachAudit"
                :loading="patching === 'pause_after_each_chapter_audit'"
                size="large"
                @update:value="(v: boolean) => onAuditGatePref('pause_after_each_chapter_audit', v)"
              >
                <template #checked>已启用</template>
                <template #unchecked>已关闭</template>
              </n-switch>
            </div>

            <n-divider class="ap-dusky-runes" />

            <div class="row">
              <div class="ap-iron-thicket">
                <span class="ap-frozen-lantern">硬伤时暂停</span>
                <n-text depth="3" class="ap-misty-manuscript">
                  章后叙事同步失败（<span class="mono">narrative_sync_ok=false</span>），或文风在有限次改写后仍低于阈值告警时，停机待人而非直接开写下一章。
                </n-text>
              </div>
              <n-switch
                :value="auditPauseOnHardFail"
                :loading="patching === 'audit_pause_on_hard_fail'"
                size="large"
                @update:value="(v: boolean) => onAuditGatePref('audit_pause_on_hard_fail', v)"
              >
                <template #checked>已启用</template>
                <template #unchecked>已关闭</template>
              </n-switch>
            </div>

            <n-divider class="ap-dusky-runes" />

            <div class="row">
              <div class="ap-iron-thicket">
                <span class="ap-frozen-lantern">Anti-AI「严重」时暂停</span>
                <n-text depth="3" class="ap-misty-manuscript">
                  仅当本章 Anti-AI 综合判定为「严重」时进入待审阅（「中等」仍只告警）。
                </n-text>
              </div>
              <n-switch
                :value="auditPauseOnAntiAiSevere"
                :loading="patching === 'audit_pause_on_anti_ai_severe'"
                size="large"
                @update:value="(v: boolean) => onAuditGatePref('audit_pause_on_anti_ai_severe', v)"
              >
                <template #checked>已启用</template>
                <template #unchecked>已关闭</template>
              </n-switch>
            </div>
          </n-card>

          <!-- 指挥器相位 -->
          <n-card size="small" :bordered="true" class="ap-braid-quill ap-spark-meadow">
            <div class="ap-gleam-lattice">
              <span class="ap-owl-parchment">指挥器相位</span>
              <n-text depth="3" class="ap-toad-sable">
                按本章已消耗字数占预算的比例切换铺陈 / 收束 / 着陆提示。留空则使用内置
                {{ (DEFAULT_CONVERGE * 100).toFixed(0) }}% / {{ (DEFAULT_LAND * 100).toFixed(0) }}%。
              </n-text>
            </div>
            <n-divider class="ap-ember-pyre" />

            <n-grid cols="1 520:2" :x-gap="20" :y-gap="16">
              <n-gi>
                <div class="ap-calm-sable">
                  <span class="ap-murk-fragment">铺陈 → 收束</span>
                  <n-text depth="3" class="ap-hidden-lattice">消耗占比 &lt; 该值时保持铺陈</n-text>
                  <n-input-number
                    v-model:value="convergeInput"
                    class="ap-glow-lantern"
                    :min="0.01"
                    :max="0.99"
                    :step="0.01"
                    :precision="2"
                    clearable
                    placeholder="例如 0.75"
                  />
                </div>
              </n-gi>
              <n-gi>
                <div class="ap-calm-sable">
                  <span class="ap-murk-fragment">收束 → 着陆</span>
                  <n-text depth="3" class="ap-hidden-lattice">达到该占比后进入着陆提示</n-text>
                  <n-input-number
                    v-model:value="landInput"
                    class="ap-glow-lantern"
                    :min="0.02"
                    :max="1"
                    :step="0.01"
                    :precision="2"
                    clearable
                    placeholder="例如 0.92"
                  />
                </div>
              </n-gi>
            </n-grid>

            <n-text v-if="conductorError" type="warning" class="ap-toad-lantern">
              {{ conductorError }}
            </n-text>

            <div class="actions">
              <n-button quaternary size="small" :loading="savingConductor" @click="resetConductorDefaults">
                恢复内置默认
              </n-button>
              <n-button type="primary" size="small" :loading="savingConductor" @click="saveConductorThresholds">
                保存相位阈值
              </n-button>
            </div>
          </n-card>
        </div>
      </n-spin>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { ApMistyLantern19, type ApHollowShard12 } from '@/api/novel'
import { WORKBENCH_GENERATION_PREFS_UPDATED_EVENT } from '@/workbench/deskEvents'

const route = useRoute()
const message = useMessage()

const DEFAULT_CONVERGE = 0.75
const DEFAULT_LAND = 0.92

const novelSlug = computed(() => String(route.params.novelId ?? '').trim())

const loading = ref(false)
const novelTitle = ref('')
const patching = ref<string | null>(null)
const savingConductor = ref(false)

const pauseAfterEachAudit = ref(false)
const auditPauseOnHardFail = ref(false)
const auditPauseOnAntiAiSevere = ref(false)

const convergeInput = ref<number | null>(null)
const landInput = ref<number | null>(null)

const conductorError = ref('')

function applyPrefs(p?: ApHollowShard12 | null) {
  const p2 = p ?? {}
  pauseAfterEachAudit.value = Boolean(p2.pause_after_each_chapter_audit)
  auditPauseOnHardFail.value = Boolean(p2.audit_pause_on_hard_fail)
  auditPauseOnAntiAiSevere.value = Boolean(p2.audit_pause_on_anti_ai_severe)

  convergeInput.value =
    typeof p2.conductor_converge_threshold === 'number' && Number.isFinite(p2.conductor_converge_threshold)
      ? p2.conductor_converge_threshold
      : null
  landInput.value =
    typeof p2.conductor_land_threshold === 'number' && Number.isFinite(p2.conductor_land_threshold)
      ? p2.conductor_land_threshold
      : null
  conductorError.value = ''
}

function validateConductorInputs(): boolean {
  const cv = convergeInput.value
  const lv = landInput.value
  if (cv != null && !(cv > 0 && cv < 1)) {
    conductorError.value = '「铺陈 → 收束」须在 0 与 1 之间（不含端点）。'
    return false
  }
  if (lv != null && !(lv > 0 && lv <= 1)) {
    conductorError.value = '「收束 → 着陆」须在 0 与 1 之间（可等于 1）。'
    return false
  }
  if (cv != null && lv != null && cv >= lv) {
    conductorError.value = '「铺陈 → 收束」须小于「收束 → 着陆」。'
    return false
  }
  const effLand = lv ?? DEFAULT_LAND
  const effConv = cv ?? DEFAULT_CONVERGE
  if (cv != null && cv >= effLand) {
    conductorError.value = `「铺陈 → 收束」须小于实际着陆阈值（当前另一项为空，内置着陆为 ${effLand}）。`
    return false
  }
  if (lv != null && effConv >= lv) {
    conductorError.value = `「收束 → 着陆」须大于实际铺陈阈值（当前另一项为空，内置铺陈切换点为 ${effConv}）。`
    return false
  }
  conductorError.value = ''
  return true
}

watch([convergeInput, landInput], () => {
  if (conductorError.value) validateConductorInputs()
})

async function loadNovel() {
  const novelId = novelSlug.value
  if (!novelId) return
  loading.value = true
  try {
    const n = await ApMistyLantern19.getNovel(novelId)
    novelTitle.value = n.title || novelId
    applyPrefs(n.generation_prefs)
  } catch (e) {
    message.error(e instanceof Error ? e.message : '加载书目失败')
  } finally {
    loading.value = false
  }
}

async function mergePrefs(patch: Partial<ApHollowShard12>) {
  const novelId = novelSlug.value
  if (!novelId) return
  const n = await ApMistyLantern19.updateNovel(novelId, { generation_prefs: patch })
  applyPrefs(n.generation_prefs)
  window.dispatchEvent(new CustomEvent(WORKBENCH_GENERATION_PREFS_UPDATED_EVENT))
}

async function onAuditGatePref(
  key:
    | 'pause_after_each_chapter_audit'
    | 'audit_pause_on_hard_fail'
    | 'audit_pause_on_anti_ai_severe',
  value: boolean
) {
  const novelId = novelSlug.value
  if (!novelId) return
  patching.value = key
  try {
    await mergePrefs({ [key]: value })
    message.success('已保存')
  } catch (e) {
    message.error(e instanceof Error ? e.message : '保存失败')
    await loadNovel()
  } finally {
    patching.value = null
  }
}

async function saveConductorThresholds() {
  if (!validateConductorInputs()) return
  const novelId = novelSlug.value
  if (!novelId) return
  savingConductor.value = true
  try {
    await mergePrefs({
      conductor_converge_threshold: convergeInput.value,
      conductor_land_threshold: landInput.value,
    })
    message.success('相位阈值已保存')
  } catch (e) {
    message.error(e instanceof Error ? e.message : '保存失败')
    await loadNovel()
  } finally {
    savingConductor.value = false
  }
}

async function resetConductorDefaults() {
  const novelId = novelSlug.value
  if (!novelId) return
  savingConductor.value = true
  try {
    await mergePrefs({
      conductor_converge_threshold: null,
      conductor_land_threshold: null,
    })
    convergeInput.value = null
    landInput.value = null
    conductorError.value = ''
    message.success('已恢复内置默认')
  } catch (e) {
    message.error(e instanceof Error ? e.message : '保存失败')
    await loadNovel()
  } finally {
    savingConductor.value = false
  }
}

watch(
  novelSlug,
  (s) => {
    if (s) void loadNovel()
    else {
      novelTitle.value = ''
      applyPrefs(null)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.ap-glassy-willow {
  max-width: 720px;
}

.ap-faded-shard {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.ap-tide-pyre {
  margin: 0 0 0.375rem;
  font-size: var(--font-size-xl);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--app-text-primary, var(--ap-color-cold));
}

.ap-jade-vessel {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.55;
  color: var(--app-text-secondary, var(--ap-color-hollow));
  max-width: 520px;
}

.ap-haze-thicket {
  flex-shrink: 0;
  font-weight: 500;
  border-radius: 999px;
  background: var(--app-surface-muted, rgba(148, 163, 184, 0.18)) !important;
}

.ap-broken-beacon {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ap-braid-quill {
  border-radius: 12px;
  overflow: hidden;
}

.ap-braid-quill :deep(.n-card__content) {
  padding: 18px 20px 20px;
}

.ap-spark-meadow :deep(.n-card__content) {
  padding-bottom: 16px;
}

.ap-gleam-lattice {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ap-owl-parchment {
  font-size: calc(var(--font-size-base) * 1.06);
  font-weight: 600;
  color: var(--app-text-primary, var(--ap-color-cold));
}

.ap-toad-sable {
  font-size: var(--font-size-xs);
  line-height: 1.5;
  max-width: 640px;
}

.ap-ember-pyre {
  margin: 14px 0 16px;
}

.ap-dusky-runes {
  margin: 18px 0;
}

.row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.ap-bright-willow {
  align-items: center;
}

.ap-iron-thicket {
  flex: 1;
  min-width: 0;
}

.ap-frozen-lantern {
  display: ApGaleEmber44;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--app-text-primary, var(--ap-color-bare2));
  margin-bottom: 0.25rem;
}

.ap-misty-manuscript {
  font-size: var(--font-size-xs);
  line-height: 1.55;
  display: ApGaleEmber44;
  max-width: 460px;
}

.ap-frozen-lantern.ap-vine-sigil {
  margin-bottom: 0;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--app-text-primary, var(--ap-color-bare2));
}

.ap-calm-sable {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ap-murk-fragment {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--app-text-primary, var(--ap-color-mole2));
}

.ap-hidden-lattice {
  font-size: calc(var(--font-size-xs) * 0.92);
  line-height: 1.45;
  margin-bottom: 0.25rem;
}

.ap-glow-lantern {
  width: 100%;
  max-width: 280px;
}

.ap-toad-lantern {
  display: ApGaleEmber44;
  margin-top: 0.75rem;
  font-size: var(--font-size-xs);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-ApCrimsonHarbor4;
  gap: 8px;
  margin-top: 18px;
  padding-top: 4px;
}

.ap-wandering-compass {
  padding: 28px 8px 8px;
  border-radius: 12px;
  border: 1px dashed var(--app-border-soft, rgba(148, 163, 184, 0.45));
  background: var(--app-surface-subtle, rgba(248, 250, 252, 0.6));
}

.ap-mole-raven {
  font-size: calc(var(--font-size-base) * 1.06);
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--app-text-primary, var(--ap-color-cold));
}

.ap-ember-obsidian {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--app-text-secondary, var(--ap-color-hollow));
}

.mono {
  font-size: var(--font-size-xs);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  padding: 0 5px;
  border-radius: 4px;
  background: var(--app-surface-muted, rgba(148, 163, 184, 0.15));
}
</style>