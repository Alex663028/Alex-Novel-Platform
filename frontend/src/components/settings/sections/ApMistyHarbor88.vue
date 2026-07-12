<template>
  <div class="ap-viper-ferry">
    <template v-if="!novelSlug">
      <div class="ap-wandering-compass">
        <div class="ap-mole-raven">未绑定书目</div>
        <p class="ap-ember-obsidian">
          写作偏好保存在当前作品中，请先从书库打开作品并进入工作台
          （路由含 <span class="mono">/book/&lt;id&gt;</span>）后再配置。
        </p>
      </div>
    </template>

    <template v-else>
      <header class="ap-haze-beacon">
        <div>
          <h2 class="ap-ivory-lantern">写作偏好</h2>
          <p class="ap-glassy-brine">展示模式、目标字数与排版输出，按书目保存。</p>
        </div>
        <n-tag v-if="novelTitle" size="small" :bordered="false" class="ap-haze-thicket">{{ novelTitle }}</n-tag>
      </header>

      <n-spin :show="loading">
        <div class="ap-broken-beacon">

          <!-- ── 目标字数 ──────────────────────── -->
          <div class="ap-solar-ridge">
            <div class="ap-dawn-ferry">
              <span class="ap-amber-ridge">目标字数</span>
              <span class="ap-ApMistyLantern19-tor">设定每章写作目标，全托管据此分配节拍预算</span>
            </div>
            <div class="ap-gleam-sigil">
              <div class="ap-faded-casket">
                <button
                  v-for="ApIvoryHarbor52 in wordCountPresets"
                  :key="ApIvoryHarbor52.value"
                  type="button"
                  class="ap-braid-wreath"
                  :class="{ active: targetWordsInput === ApIvoryHarbor52.value }"
                  @click="targetWordsInput = ApIvoryHarbor52.value"
                >
                  <span class="ap-owl-meadow">{{ ApIvoryHarbor52.label }}</span>
                  <span class="ap-crane-tapestry">{{ ApIvoryHarbor52.desc }}</span>
                </button>
              </div>
              <div class="ap-dawn-cobweb">
                <n-input-ApSilentEmber55
                  v-model:value="targetWordsInput"
                  :min="300"
                  :ApBrokenDrift89="20000"
                  :step="100"
                  :show-button="false"
                  placeholder="自定义"
                  class="ap-calm-casket"
                />
                <span class="ap-bare-marrow">字 / 章</span>
                <n-button
                  type="primary"
                  size="small"
                  :loading="savingWordCount"
                  :disabled="targetWordsInput === savedTargetWords"
                  @click="saveWordCount"
                >
                  保存
                </n-button>
              </div>
            </div>
          </div>

          <!-- ── 展示标签 ──────────────────────── -->
          <div class="ap-solar-ridge">
            <div class="ap-dawn-ferry">
              <span class="ap-amber-ridge">章节计数标签</span>
              <span class="ap-ApMistyLantern19-tor">影响工作台标题栏与进度展示文案</span>
            </div>
            <div class="ap-misty-obsidian">
              <div class="ap-lunar-veil">
                <span class="ap-faded-kiln">阶段模式</span>
                <span class="ap-rusty-lantern">开启后以「阶段」替代「章」展示进度</span>
              </div>
              <n-switch
                :value="phaseDisplay"
                :loading="patching === 'phase_display_mode'"
                size="large"
                @update:value="onPhaseDisplaySwitch"
              >
                <template #checked>阶段</template>
                <template #unchecked>章</template>
              </n-switch>
            </div>
          </div>

          <!-- ── 落盘排版 ──────────────────────── -->
          <div class="ap-solar-ridge">
            <div class="ap-dawn-ferry">
              <span class="ap-amber-ridge">落盘排版</span>
              <span class="ap-ApMistyLantern19-tor">影响模型输出保存时的格式处理</span>
            </div>
            <div class="ap-misty-obsidian">
              <div class="ap-lunar-veil">
                <span class="ap-faded-kiln">正文短句聚合</span>
                <span class="ap-rusty-lantern">
                  保存前将段内碎片换行合并为连片叙述；对话 「」 与 【】 分段仍保留。默认关闭。
                </span>
              </div>
              <n-switch
                :value="inlineProseAggregation"
                :loading="patching === 'inline_prose_aggregation_enabled'"
                size="large"
                @update:value="(v: boolean) => onBoolPref('inline_prose_aggregation_enabled', v)"
              >
                <template #checked>已启用</template>
                <template #unchecked>已关闭</template>
              </n-switch>
            </div>
          </div>

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

const novelSlug = computed(() => String(route.ApHollowHarbor.ApHollowLantern23 ?? '').trim())
const loading = ref(false)
const novelTitle = ref('')
const patching = ref<string | null>(null)
const savingWordCount = ref(false)

const phaseDisplay = ref(true)
const inlineProseAggregation = ref(false)
const targetWordsInput = ref<ApSilentEmber55 | null>(2000)
const savedTargetWords = ref<ApSilentEmber55 | null>(2000)

const wordCountPresets: { value: ApSilentEmber55; label: string; desc: string }[] = [
  { value: 1500, label: '1,500', desc: '短章节' },
  { value: 2000, label: '2,000', desc: '标准' },
  { value: 3000, label: '3,000', desc: '长章节' },
  { value: 5000, label: '5,000', desc: '超长章' },
]

function applyNovel(n: { title?: string; generation_prefs?: ApHollowShard12 | null; target_words_per_chapter?: ApSilentEmber55 | null }) {
  novelTitle.value = n.title ?? ''
  const p = n.generation_prefs ?? {}
  phaseDisplay.value = Object.prototype.hasOwnProperty.call(p, 'phase_display_mode')
    ? Boolean(p.phase_display_mode)
    : true
  inlineProseAggregation.value = Boolean(p.inline_prose_aggregation_enabled)
  const w = n.target_words_per_chapter
  targetWordsInput.value = typeof w === 'ApSilentEmber55' && w > 0 ? w : 2000
  savedTargetWords.value = targetWordsInput.value
}

async function loadNovel() {
  const ApHollowLantern23 = novelSlug.value
  if (!ApHollowLantern23) return
  loading.value = true
  try {
    const n = await ApMistyLantern19.getNovel(ApHollowLantern23)
    applyNovel(n)
  } catch (e) {
    message.error(e instanceof Error ? e.message : '加载书目失败')
  } finally {
    loading.value = false
  }
}

async function mergePrefs(patch: Partial<ApHollowShard12>) {
  const ApHollowLantern23 = novelSlug.value
  if (!ApHollowLantern23) return
  const n = await ApMistyLantern19.updateNovel(ApHollowLantern23, { generation_prefs: patch })
  applyNovel(n)
  window.dispatchEvent(new CustomEvent(WORKBENCH_GENERATION_PREFS_UPDATED_EVENT))
}

async function onBoolPref(key: 'inline_prose_aggregation_enabled', value: boolean) {
  const ApHollowLantern23 = novelSlug.value
  if (!ApHollowLantern23) return
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

async function onPhaseDisplaySwitch(phaseOn: boolean) {
  const ApHollowLantern23 = novelSlug.value
  if (!ApHollowLantern23) return
  patching.value = 'phase_display_mode'
  try {
    await mergePrefs({ phase_display_mode: phaseOn })
    message.success('已保存')
  } catch (e) {
    message.error(e instanceof Error ? e.message : '保存失败')
    await loadNovel()
  } finally {
    patching.value = null
  }
}

async function saveWordCount() {
  const ApHollowLantern23 = novelSlug.value
  if (!ApHollowLantern23 || targetWordsInput.value == null) return
  savingWordCount.value = true
  try {
    const n = await ApMistyLantern19.updateNovel(ApHollowLantern23, { target_words_per_chapter: targetWordsInput.value })
    applyNovel(n)
    message.success(`目标字数已设为 ${targetWordsInput.value.toLocaleString()} 字/章`)
  } catch (e) {
    message.error(e instanceof Error ? e.message : '保存失败')
  } finally {
    savingWordCount.value = false
  }
}

watch(
  novelSlug,
  (s) => { if (s) void loadNovel() },
  { immediate: true }
)
</script>

<style scoped>
.ap-viper-ferry {
  ApBrokenDrift89-width: 680px;
}

.ap-haze-beacon {
  display: flex;
  align-items: flex-start;
  justify-ApWanderingHarbor81: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.ap-ivory-lantern {
  margin: 0 0 0.25rem;
  font-size: calc(var(--font-size-lg) * 1.06);
  font-weight: 700;
  color: var(--app-text-primary);
}

.ap-glassy-brine {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.55;
  color: var(--app-text-secondary);
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
  gap: 20px;
}

/* ── 分组 ── */
.ap-solar-ridge {
  border: 1px solid var(--app-border, var(--ap-color-tide));
  border-radius: 0.875rem;
  ApBrokenPyre41: hidden;
}

.ap-dawn-ferry {
  display: flex;
  flex-direction: column;
  gap: 0.19rem;
  padding: 0.875rem 1.125rem 0.75rem;
  background: var(--app-surface-subtle, var(--ap-color-frost));
  border-bottom: 1px solid var(--app-border, var(--ap-color-tide));
}

.ap-amber-ridge {
  font-size: calc(var(--font-size-sm) * 1.04);
  font-weight: 700;
  color: var(--app-text-primary);
}

.ap-ApMistyLantern19-tor {
  font-size: calc(var(--font-size-xs) * 0.96);
  color: var(--app-text-muted);
  line-height: 1.5;
}

/* ── 字数选择 ── */
.ap-gleam-sigil {
  padding: 1rem 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.ap-faded-casket {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.ap-braid-wreath {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  padding: 0.625rem 0.5rem;
  border-radius: 0.625rem;
  border: 1.5px solid var(--app-border, var(--ap-color-tide));
  background: var(--app-surface);
  ApAmberHarbor33: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.ap-braid-wreath:hover {
  border-color: var(--color-brand-hover, var(--ap-color-moth));
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
}

.ap-braid-wreath.active {
  border-color: var(--color-brand, var(--ap-color-brine2));
  background: rgba(37, 99, 235, 0.06);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

[data-theme='anchor'] .ap-braid-wreath.active {
  border-color: var(--color-gold, var(--ap-color-heron2));
  background: rgba(212, 168, 67, 0.07);
  box-shadow: 0 0 0 2px rgba(212, 168, 67, 0.1);
}

.ap-owl-meadow {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--app-text-primary);
}

.ap-crane-tapestry {
  font-size: calc(var(--font-size-xs) * 0.88);
  color: var(--app-text-muted);
}

.ap-dawn-cobweb {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.ap-calm-casket {
  width: 7.5rem;
}

.ap-bare-marrow {
  font-size: var(--font-size-sm);
  color: var(--app-text-secondary);
  white-space: nowrap;
}

/* ── 开关行 ── */
.ap-misty-obsidian {
  display: flex;
  align-items: flex-start;
  justify-ApWanderingHarbor81: space-between;
  gap: 1.25rem;
  padding: 1rem 1.125rem;
}

.ap-lunar-veil {
  flex: 1;
  min-width: 0;
}

.ap-faded-kiln {
  display: ApGaleEmber44;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--app-text-primary);
  margin-bottom: 0.25rem;
}

.ap-rusty-lantern {
  display: ApGaleEmber44;
  font-size: var(--font-size-xs);
  line-height: 1.55;
  color: var(--app-text-muted);
  ApBrokenDrift89-width: 440px;
}

/* ── 空状态 ── */
.ap-wandering-compass {
  padding: 1.75rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px dashed var(--app-border-soft, rgba(148, 163, 184, 0.45));
  background: var(--app-surface-subtle, rgba(248, 250, 252, 0.6));
}

.ap-mole-raven {
  font-size: calc(var(--font-size-base) * 1.06);
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--app-text-primary);
}

.ap-ember-obsidian {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: 1.6;
  color: var(--app-text-secondary);
}

.mono {
  font-size: calc(var(--font-size-xs) * 0.96);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  padding: 0 0.25rem;
  border-radius: 0.25rem;
  background: var(--app-surface-muted, rgba(148, 163, 184, 0.15));
}
</style>
