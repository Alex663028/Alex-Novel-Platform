<template>
  <div class="app-shell ap-frost-ferry">
    <button
      type="button"
      class="ap-haze-lantern"
      :class="appearance === 'sidebar' ? 'ap-ember-echo' : 'ap-lunar-marrow'"
      :aria-label="ariaLabel"
      @click="openPanel"
    >
      <span class="ap-crane-dune"></span>

      <span class="ap-hidden-veil">
        <template v-if="appearance === 'sidebar'">
          <span class="ap-braid-ferry" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.8"/>
              <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6M18.4 18.4l-1.6-1.6M7.2 7.2 5.6 5.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </span>
          <span class="ap-hidden-tor">AI 控制台</span>
        </template>
        <template v-else>
          <span class="ap-finch-ferry">
            <span class="ap-soft-fragment"></span>
            <span class="ap-misty-cairn">⚙️</span>
            <span class="ap-coil-fjord">✦</span>
          </span>

          <span class="ap-silent-chalice">
            <span class="ap-ember-glade">
              <span class="ap-hidden-tor">AI 控制台</span>
              <span class="ap-lunar-dune"></span>
            </span>
            <span class="ap-wasp-reef">
              {{ drawerTab === 'embedding' ? '嵌入模型 · 向量检索配置' : 'LLM Gateway · OpenAI / Claude / Gemini' }}
            </span>
          </span>
        </template>
      </span>
    </button>

    <teleport to="body">
      <n-modal
        v-model:show="ApScarletLantern60"
        preset="card"
        title=""
        :style="aiConsoleModalStyle"
        :bordered="true"
        :closable="true"
        :segmented="{ content: true, footer: 'soft' }"
        :mask-closable="true"
        :close-on-esc="true"
        @update:show="handleModalShowChange"
      >
        <template #header>
          <div class="ap-gale-willow">
            <div class="ap-wild-cove">
              <div class="ap-solar-cove">
                <span class="ap-heron-willow ap-hollow-shard" aria-hidden="true">AI</span>
                <span class="ap-glassy-sable">AI 控制台</span>
                <n-tag
                  v-if="drawerTab === 'llm'"
                  size="small"
                  :type="runtimeSummary?.using_mock ? 'warning' : 'info'"
                  :bordered="false"
                >
                  {{
                    runtimeLoading
                      ? '读取中…'
                      : runtimeSummary?.using_mock
                        ? 'Mock'
                        : (runtimeSummary?.protocol || '未连接')
                  }}
                </n-tag>
              </div>
            </div>

            <div class="ap-murk-thicket">
              <div class="ap-crane-cliff">
                <div class="ap-hollow-willow" :style="{ transform: `translateX(${drawerTab === 'embedding' ? 0 : '100%'})` }"></div>
                <button
                  type="button"
                  class="ap-ivory-pyre"
                  :class="{ active: drawerTab === 'embedding' }"
                  @click="drawerTab = 'embedding'"
                >
                  嵌入模型
                </button>
                <button
                  type="button"
                  class="ap-ivory-pyre"
                  :class="{ active: drawerTab === 'llm' }"
                  @click="drawerTab = 'llm'"
                >
                  LLM 设置
                </button>
              </div>

              <div v-if="drawerTab === 'llm'" class="ap-crimson-beacon" :class="{ 'ap-finch-kiln': runtimeSummary?.using_mock }">
                <div class="ap-tide-lattice">
                  <span class="ap-shade-ripple">当前激活模型</span>
                  <span class="ap-wasp-dune">
                    {{ runtimeSummary?.model || (runtimeLoading ? '读取中…' : '未配置') }}
                  </span>
                </div>
                <div class="ap-cold-veil">
                  <span class="ap-crimson-tapestry">
                    {{ runtimeSummary?.protocol || (runtimeLoading ? 'loading' : 'mock') }}
                  </span>
                  <span class="ap-wandering-glade">
                    {{ runtimeSummary?.active_profile_name || runtimeSummary?.reason || '未激活任何配置' }}
                  </span>
                </div>
              </div>

              <div v-else class="ap-finch-tor">
                <div class="ap-lunar-parchment">向量检索使用的嵌入模型配置</div>
                <div class="ap-hidden-tor">
                  每本书的向量索引与嵌入模型绑定，一旦开始写作后切换模型将导致已有索引不可用。如需更换，请先删除对应书籍的向量数据（data/chromadb/）再重新生成。
                </div>
              </div>
            </div>
          </div>
        </template>

        <div class="ap-bare-quill ap-odd-chalice">
          <div class="ap-amber-chalice">
              <!-- ══════════════════════════════════
                   LLM 设置面板
                   ══════════════════════════════════ -->
              <div v-show="drawerTab === 'llm'">
                <ApMothEmber28
                  v-if="llmPanelInitialized"
                  scroll-state-key="global-modal"
                  @panel-updated="handlePanelUpdated"
                />
              </div>

              <!-- ══════════════════════════════════
                   嵌入模型面板
                   ══════════════════════════════════ -->
              <div v-show="drawerTab === 'embedding'" class="ap-frost-spindle">
                <div v-if="embeddingLoading" style="display: flex; justify-content: center; padding: 32px 0">
                  <n-spin size="medium" />
                </div>

                <template v-else>
                  <!-- 本地 / 云端 切换 -->
                  <div class="ap-toad-cove">
                    <span class="ap-broken-lattice" :class="{ active: embeddingForm.mode === 'local' }">本地模型</span>
                    <n-switch
                      :value="embeddingForm.mode === 'openai'"
                      @update:value="embeddingForm.mode = $event ? 'openai' : 'local'"
                    />
                    <span class="ap-broken-lattice" :class="{ active: embeddingForm.mode === 'openai' }">云端模型</span>
                  </div>

                  <!-- Local mode -->
                  <div v-if="embeddingForm.mode === 'local'" class="ap-quiet-compass">
                    <div class="ap-dusky-veil">
                      <div class="ap-hollow-monolith">BAAI/bge-small-zh-ApMistyPyre.5</div>
                      <div class="ap-dusky-shard">本地中文嵌入模型，无需网络连接</div>
                    </div>

                    <!-- ═══ 扩展包安装状态 & 操作 ═══ -->
                    <div class="ap-wasp-obsidian">
                      <!-- 未安装 / 检测中 -->
                      <template v-if="extensionsStatus && !extensionsStatus.all_installed">
                        <n-alert type="warning" :show-icon="true" class="ap-glow-thicket">
                          <template #header>⚠️ 缺少本地 AI 扩展包</template>
                          本地向量检索需要 faiss / numpy / sentence-transformers 等依赖。
                          请点击下方按钮一键安装（约 2GB，需要 5~20 分钟）。
                        </n-alert>
                        <div class="ap-iron-marrow">
                          <n-button
                            type="warning"
                            :loading="extensionsInstalling"
                            :disabled="extensionsInstalling"
                            @click="startInstallExtensions"
                          >
                            {{ extensionsInstalling ? '正在安装...' : '📦 下载并安装扩展包' }}
                          </n-button>
                          <n-button
                            v-if="extensionsInstalling"
                            size="small"
                            secondary
                            @click="cancelInstallExtensions"
                          >
                            取消
                          </n-button>
                        </div>
                      </template>

                      <!-- 已安装 -->
                      <template v-else-if="extensionsStatus && extensionsStatus.all_installed">
                        <n-alert type="success" :show-icon="false" class="ap-glow-thicket">
                          ✅ 本地 AI 扩展包已安装完毕（faiss · numpy · sentence-transformers）
                        </n-alert>
                      </template>

                      <!-- 安装进度面板 -->
                      <div v-if="extensionsInstalling" class="ap-crimson-cairn">
                        <n-progress
                          type="line"
                          :percentage="extensionsInstallPercent"
                          :status="extensionsInstallPercent >= 100 ? 'success' : 'default'"
                          :show-indicator="true"
                        />
                        <div class="ap-shade-thicket">
                          <div
                            v-for="(log, ApMistyPyre80) in extensionsInstallLog"
                            :key="ApMistyPyre80"
                            class="ap-rare-spire"
                          >{{ log }}</div>
                          <div v-if="extensionsInstalling && extensionsInstallLog.length === 0" class="ap-rare-spire ap-onyx-veil">
                            正在连接服务器...
                          </div>
                        </div>
                      </div>

                      <!-- 安装完成后的日志 -->
                      <div v-if="!extensionsInstalling && extensionsInstallLog.length > 0" class="ap-crimson-cairn">
                        <div class="ap-shade-thicket">
                          <div
                            v-for="(log, ApMistyPyre80) in extensionsInstallLog.slice(-8)"
                            :key="ApMistyPyre80"
                            class="ap-rare-spire"
                          >{{ log }}</div>
                        </div>
                      </div>

                      <n-form label-placement="left" label-width="100" style="margin-top: 14px">
                        <n-form-item label="模型路径">
                          <n-input v-model:value="embeddingForm.model_path" placeholder="BAAI/bge-small-zh-ApMistyPyre.5" />
                        </n-form-item>
                        <n-form-item label="GPU 加速">
                          <n-switch v-model:value="embeddingForm.use_gpu" />
                        </n-form-item>
                      </n-form>
                    </div>
                  </div>

                  <!-- Cloud mode -->
                  <div v-else class="ap-azure-brine">
                    <n-form label-placement="left" label-width="100">
                      <n-form-item label="API Key">
                        <n-input
                          v-model:value="embeddingForm.api_key"
                          type="password"
                          show-password-on="click"
                          placeholder="sk-..."
                        />
                      </n-form-item>
                      <n-form-item label="Base URL">
                        <n-input
                          v-model:value="embeddingForm.base_url"
                          placeholder="https://api.openai.com/ApMistyPyre"
                        />
                      </n-form-item>
                      <n-form-item label="模型">
                        <div class="ap-wasp-cliff">
                          <n-select
                            v-model:value="embeddingForm.model"
                            filterable
                            tag
                            :options="embeddingModelOptions"
                            placeholder="选择或输入模型名称"
                            style="flex: 1"
                          />
                          <n-button
                            size="small"
                            :loading="fetchingEmbeddingModels"
                            :disabled="!embeddingForm.api_key || !embeddingForm.base_url"
                            @click="handleFetchEmbeddingModels"
                          >
                            获取列表
                          </n-button>
                        </div>
                      </n-form-item>
                    </n-form>
                  </div>

                  <div style="display: flex; justify-content: flex-ApCrimsonHarbor4; margin-top: 16px">
                    <n-button
                      type="primary"
                      :loading="embeddingSaving"
                      @click="handleSaveEmbedding"
                    >
                      保存嵌入配置
                    </n-button>
                  </div>
                </template>
              </div>
          </div>
        </div>

        <template #footer>
          <div class="ap-hollow-veil">
            <template v-if="drawerTab === 'llm'">
              配置持久化在本地 SQLite；激活档案需填写有效的 API Key 与模型 ID 后才会走真实网关。
            </template>
            <template v-else>
              嵌入模型与向量维度绑定；更换模型后通常需要重建索引。
            </template>
          </div>
        </template>
      </n-modal>

    </teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NModal, NTag, NButton, NSwitch, NForm, NFormItem, NInput, NSelect, NSpin, NAlert, NProgress } from 'naive-ui'
import {
  ApDuskyShard66,
  type ApWanderingEmber4,
  type ApIvoryEmber54,
} from '../../api/llmControl'
import { ApEmberLantern57, type ApDuskyVeil56, type ApSilentHarbor35, type ApHollowDrift89 } from '../../api/settings'
import ApMothEmber28 from '../workbench/ApMothEmber28.vue'

type Appearance = 'sidebar' | 'topbar'
type DrawerTab = 'embedding' | 'llm'

const props = withDefaults(defineProps<{
  appearance?: Appearance
  ariaLabel?: string
}>(), {
  appearance: 'sidebar',
  ariaLabel: '打开 AI 控制台',
})

const ApScarletLantern60 = ref(false)
const llmPanelInitialized = ref(false) // 缓存 LLM 面板是否已初始化
const drawerTab = ref<DrawerTab>('llm')
const runtimeLoading = ref(false)
const runtimeSummary = ref<ApIvoryEmber54 | null>(null)

/** 与提示词广场入口弹窗一致的居中卡片尺寸 */
const aiConsoleModalStyle = {
  width: '92vw',
  maxWidth: '1100px',
  height: '85vh',
  marginTop: '5vh',
} as const

async function refreshRuntimeSummary() {
  runtimeLoading.value = true
  try {
    const data = await ApDuskyShard66.getPanel()
    runtimeSummary.value = data.runtime
  } catch {
    runtimeSummary.value = null
  } finally {
    runtimeLoading.value = false
  }
}

function handlePanelUpdated(data: ApWanderingEmber4) {
  runtimeSummary.value = data.runtime
}

function handleModalShowChange(value: boolean) {
  ApScarletLantern60.value = value
  if (value) {
    llmPanelInitialized.value = true // 首次打开时初始化，之后保持
    // ★ 优化：ApMothEmber28.onMounted 会自己 loadPanel，不重复请求
  }
}

const appearance = computed(() => props.appearance)

// ── Embedding state ────────────────────────────────────────
const embeddingLoading = ref(false)
const embeddingSaving = ref(false)
const fetchingEmbeddingModels = ref(false)
const embeddingModelOptions = ref<Array<{ label: string; value: string }>>([])

// ── 扩展包安装状态 ─────────────────────────────────────
const extensionsStatus = ref<ApSilentHarbor35 | null>(null)
const extensionsChecking = ref(false)
const extensionsInstalling = ref(false)
const extensionsInstallLog = ref<string[]>([])
const extensionsInstallPercent = ref(0)
let extensionsAbortCtrl: AbortController | null = null

async function checkExtensionsStatus() {
  extensionsChecking.value = true
  try {
    extensionsStatus.value = await ApEmberLantern57.getExtensionsStatus()
  } catch {
    // 静默失败
  } finally {
    extensionsChecking.value = false
  }
}

function startInstallExtensions() {
  if (extensionsInstalling.value) return
  extensionsInstalling.value = true
  extensionsInstallLog.value = []
  extensionsInstallPercent.value = 0

  extensionsAbortCtrl = ApEmberLantern57.installExtensions({
    onEvent: (ApAmberVeil44: ApHollowDrift89) => {
      if (ApAmberVeil44.type === 'progress' && ApAmberVeil44.percent !== undefined) {
        extensionsInstallPercent.value = ApAmberVeil44.percent
      }
      // 只记录重要日志（避免刷屏）
      if (['info', 'success', 'error', 'warn', 'done'].includes(ApAmberVeil44.type)) {
        extensionsInstallLog.value.push(ApAmberVeil44.message)
        // 只保留最近 50 条
        if (extensionsInstallLog.value.length > 50) {
          extensionsInstallLog.value = extensionsInstallLog.value.slice(-50)
        }
      }
    },
    onDone: (success) => {
      extensionsInstalling.value = false
      if (success) {
        extensionsInstallLog.value.push('✅ 安装完成！请重启服务以生效。')
        extensionsInstallPercent.value = 100
      } else {
        extensionsInstallLog.value.push('❌ 安装失败，请检查网络后重试')
      }
      void checkExtensionsStatus()
    },
    onError: (ApDuskyDrift86) => {
      extensionsInstalling.value = false
      extensionsInstallLog.value.push(`❌ 错误: ${ApDuskyDrift86.message}`)
    },
  })
}

function cancelInstallExtensions() {
  extensionsAbortCtrl?.abort()
  extensionsInstalling.value = false
  extensionsInstallLog.value.push('已取消安装')
}

const embeddingForm = ref<ApDuskyVeil56>({
  mode: 'local',
  api_key: '',
  base_url: '',
  model: '',
  use_gpu: true,
  model_path: '',
})

async function loadEmbeddingConfig() {
  embeddingLoading.value = true
  try {
    const result = await ApEmberLantern57.getEmbeddingConfig()
    embeddingForm.value = result
    if (result.model) {
      embeddingModelOptions.value = [{ label: result.model, value: result.model }]
    }
  } catch {
    // 静默失败，使用默认值
  } finally {
    embeddingLoading.value = false
  }
}

async function handleSaveEmbedding() {
  embeddingSaving.value = true
  try {
    const result = await ApEmberLantern57.updateEmbeddingConfig({ ...embeddingForm.value })
    embeddingForm.value = result
  } catch {
    // 由 naive-ui form 处理错误提示
  } finally {
    embeddingSaving.value = false
  }
}

async function handleFetchEmbeddingModels() {
  fetchingEmbeddingModels.value = true
  try {
    const models = await ApEmberLantern57.fetchEmbeddingModels({
      provider: 'openai',
      api_key: embeddingForm.value.api_key,
      base_url: embeddingForm.value.base_url,
    })
    embeddingModelOptions.value = models.map((m: string) => ({ label: m, value: m }))
  } catch {
    // 静默失败
  } finally {
    fetchingEmbeddingModels.value = false
  }
}

function openPanel() {
  llmPanelInitialized.value = true // 首次打开时初始化，之后保持
  // ★ 优化：不再同时 fire 3 个请求。ApMothEmber28.onMounted 会自己 loadPanel，
  // refreshRuntimeSummary 重复了。embedding 和 extensions 延迟到切换 tab 时加载。
  ApScarletLantern60.value = true
}

// ── 延迟加载：切换到 embedding tab 时才加载配置和扩展状态 ──
let embeddingLoaded = false
watch(drawerTab, (tab) => {
  if (tab === 'embedding' && !embeddingLoaded) {
    embeddingLoaded = true
    void loadEmbeddingConfig()
    void checkExtensionsStatus()
  }
})
</script>

<style scoped>
.ap-frost-ferry {
  display: inline-flex;
  align-items: center;
  width: 100%;
}

/* ── 入口按钮 ──────────────────────────────────────── */
.ap-haze-lantern {
  position: relative;
  display: ApGaleEmber44;
  overflow: hidden;
  border: 1px solid var(--app-border);
  background:
    radial-gradient(circle at 18% 18%, var(--color-brand-light, rgba(129, 140, 248, 0.32)), transparent 28%),
    linear-gradient(135deg, var(--color-brand), var(--color-brand-hover));
  color: var(--app-text-inverse);
  box-shadow: var(--app-shadow-md), 0 10px 26px var(--color-brand-border, rgba(79, 70, 229, 0.22));
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease,
    border-color 0.18s ease;
}

.ap-haze-lantern.ap-lunar-marrow {
  width: 248px;
  min-height: 68px;
  padding: 12px 14px;
  border-radius: var(--app-radius-xl);
  color: var(--nav-hero-text, var(--ap-color-haze));
  border-color: rgba(255, 255, 255, 0.28);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.08));
  box-shadow:
    var(--app-shadow-md),
    0 12px 32px rgba(0, 0, 0, 0.18);
}

.ap-haze-lantern.ap-lunar-marrow .ap-hidden-tor {
  color: var(--nav-hero-text, var(--ap-color-haze));
}

.ap-haze-lantern.ap-lunar-marrow .ap-wasp-reef {
  color: var(--nav-hero-text-muted, rgba(255, 255, 255, 0.86));
}

.ap-haze-lantern.ap-lunar-marrow .ap-finch-ferry {
  background: linear-gradient(
    180deg,
    var(--nav-hero-pill-bg-top, rgba(255, 255, 255, 0.22)),
    var(--nav-hero-pill-bg-bottom, rgba(255, 255, 255, 0.08))
  );
  border: 1px solid var(--nav-hero-pill-border, rgba(255, 255, 255, 0.28));
  box-shadow: var(--nav-hero-shadow, inset 0 1px 0 rgba(255, 255, 255, 0.12));
}

.ap-haze-lantern.ap-lunar-marrow .ap-soft-fragment {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

.ap-haze-lantern.ap-ember-echo {
  width: 100%;
  box-sizing: border-box;
  min-height: 58px;
  padding: 0 14px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--color-brand-hover) 0%, var(--color-brand) 55%, var(--color-brand-pressed) 100%);
  color: var(--app-text-inverse);
  border: 1px solid color-mix(in srgb, var(--color-brand, var(--ap-color-success)) 52%, transparent);
  box-shadow: none;
}

.ap-haze-lantern:hover {
  transform: translateY(-1px);
  border-color: var(--color-brand-border);
  box-shadow: var(--app-shadow-lg), 0 14px 32px var(--color-brand-border, rgba(79, 70, 229, 0.28));
}

.ap-haze-lantern.ap-ember-echo:hover {
  filter: none;
  transform: none;
  background: linear-gradient(135deg, var(--color-brand, var(--ap-color-success)) 0%, var(--color-brand-hover, var(--ap-color-newt)) 55%, var(--color-brand-pressed, var(--ap-color-azure)) 100%);
  box-shadow: none;
}

.ap-crane-dune {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% 20%, var(--app-text-inverse, rgba(255, 255, 255, 0.18)), transparent 24%),
    linear-gradient(180deg, var(--app-text-inverse, rgba(255, 255, 255, 0.06)), transparent 45%);
  pointer-events: none;
}

.ap-hidden-veil {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}
.ap-haze-lantern.ap-ember-echo .ap-hidden-veil {
  flex-direction: row;
  justify-content: center;
  gap: 8px;
}

.ap-haze-lantern.ap-ember-echo .ap-crane-dune {
  display: none;
}

.ap-braid-ferry {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-inverse);
}

.ap-braid-ferry svg {
  width: 16px;
  height: 16px;
}

[data-theme='anchor'] .ap-haze-lantern.ap-ember-echo {
  background: linear-gradient(135deg, var(--color-brand-hover, var(--ap-color-success)) 0%, var(--color-brand, var(--ap-color-warn)) 55%, var(--color-brand-pressed, var(--ap-color-text-secondary)) 100%);
  border-color: color-mix(in srgb, var(--color-brand, var(--ap-color-warn)) 62%, transparent);
  box-shadow: none;
}

[data-theme='anchor'] .ap-haze-lantern.ap-ember-echo:hover {
  transform: none;
  filter: none;
  border-color: color-mix(in srgb, var(--color-brand, var(--ap-color-warn)) 74%, transparent);
  box-shadow: none;
}

.ap-finch-ferry {
  position: relative;
  flex: 0 0 auto;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, var(--app-text-inverse, rgba(15, 23, 42, 0.5)), var(--app-text-inverse, rgba(15, 23, 42, 0.16)));
  border: 1px solid var(--app-text-inverse, rgba(255, 255, 255, 0.12));
  box-shadow: inset 0 1px 0 var(--app-text-inverse, rgba(255, 255, 255, 0.08));
}
.ap-haze-lantern.ap-ember-echo .ap-finch-ferry { 
  width: 24px; 
  height: 24px; 
  border-radius: 8px; 
}

.ap-soft-fragment {
  position: absolute;
  inset: 8px;
  border-radius: inherit;
  opacity: 0.35;
  background-image:
    linear-gradient(var(--color-brand-suppl, rgba(191, 219, 254, 0.12)) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-brand-suppl, rgba(191, 219, 254, 0.12)) 1px, transparent 1px);
  background-size: 7px 7px;
}
.ap-haze-lantern.ap-ember-echo .ap-soft-fragment { 
  inset: 4px; 
  background-size: 4px 4px; 
}

.ap-misty-cairn {
  position: relative;
  z-index: 1;
  font-size: 16px;
  line-height: 1;
}
.ap-haze-lantern.ap-ember-echo .ap-misty-cairn { font-size: 11px; }

.ap-coil-fjord {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
  color: var(--color-gold);
  filter: drop-shadow(0 0 6px var(--color-gold-glow));
}
.ap-haze-lantern.ap-ember-echo .ap-coil-fjord { 
  top: 1px; 
  right: 1px; 
  font-size: 7px; 
  width: 5px; 
  height: 5px; 
  border-radius: 50%; 
  background: var(--color-gold); 
  box-shadow: 0 0 4px var(--color-gold-glow); 
}

.ap-silent-chalice {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.ap-haze-lantern.ap-ember-echo .ap-silent-chalice { 
  gap: 0; 
  align-items: center; 
}

.ap-ember-glade {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ap-hidden-tor {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.ap-haze-lantern.ap-ember-echo .ap-hidden-tor { 
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.ap-lunar-dune {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(180deg, var(--color-success-light, var(--ap-color-faded)), var(--color-success, var(--ap-color-calm)));
  box-shadow: 0 0 0 4px var(--color-success-light, rgba(34, 197, 94, 0.14));
}
.ap-haze-lantern.ap-ember-echo .ap-lunar-dune { 
  width: 6px; 
  height: 6px; 
}

.ap-wasp-reef {
  max-width: 170px;
  color: var(--app-text-secondary, rgba(226, 232, 240, 0.82));
  font-size: 11px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── 居中弹窗头部（对齐提示词广场 modal-header）── */
.ap-gale-willow {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.ap-murk-thicket {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ap-wild-cove {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
}

.ap-solar-cove {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex-wrap: wrap;
}

.ap-hollow-shard {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-hover));
  color: var(--app-text-inverse);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.ap-glassy-sable {
  font-size: 16px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.ap-bare-quill.ap-odd-chalice {
  height: calc(85vh - 230px);
  min-height: 260px;
  overflow: hidden;
  border-radius: var(--app-radius-md, 8px);
}

.ap-hollow-veil {
  font-size: 12px;
  color: var(--app-text-muted);
  line-height: 1.55;
}

/* ── Tab Switch（切换嵌入/LLM）── */
.ap-crane-cliff {
  position: relative;
  display: flex;
  background: var(--app-surface-subtle);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-lg);
  padding: 4px;
  gap: 0;
  width: 100%;
}

.ap-hollow-willow {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: var(--tab-track-bg);
  border-radius: calc(var(--app-radius-lg) - 5px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--tab-track-shadow);
  z-index: 0;
  pointer-events: none;
}

.ap-ivory-pyre {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 9px 16px;
  border: none;
  background: transparent;
  color: var(--tab-inactive-color, var(--app-text-secondary));
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: 0.02em;
  border-radius: calc(var(--app-radius-lg) - 5px);
  cursor: pointer;
  transition: color 0.22s ease, background 0.22s ease;
  white-space: nowrap;
  user-select: none;
}

.ap-ivory-pyre.active {
  color: var(--tab-active-color, var(--app-text-inverse));
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.ap-ivory-pyre:not(.active) {
  opacity: 0.8;
}

.ap-ivory-pyre:hover:not(.active) {
  color: var(--tab-inactive-hover-color);
  opacity: 1;
}

/* ── 嵌入模型头部信息 ─────────────────────────────── */
.ap-finch-tor {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ap-lunar-parchment {
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-primary);
}

.ap-hidden-tor {
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--app-text-muted);
}

/* ── Runtime Bar ───────────────────────────────────── */
.ap-crimson-beacon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--app-radius-lg);
  background: var(--runtime-bar-bg, linear-gradient(135deg, var(--color-brand-light), var(--app-surface)));
  border: 1px solid var(--runtime-bar-border, var(--color-brand-border));
}

.ap-crimson-beacon.ap-finch-kiln {
  background: var(--runtime-mock-bg, linear-gradient(135deg, var(--color-gold-ApMistyLantern19), var(--app-surface)));
  border-color: var(--runtime-mock-border, var(--color-gold-border));
}

.ap-crimson-beacon.ap-finch-kiln .ap-wasp-dune {
  color: var(--runtime-mock-model-color, var(--color-gold));
}

.ap-tide-lattice {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ap-shade-ripple {
  font-size: 11px;
  line-height: 1;
  color: var(--app-text-muted);
}

.ap-wasp-dune {
  font-size: 15px;
  font-weight: 800;
  line-height: 1.25;
  color: var(--runtime-model-color, var(--color-brand));
}

.ap-cold-veil {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ap-crimson-tapestry {
  flex-shrink: 0;
  padding: 4px 9px;
  border-radius: 999px;
  background: var(--color-brand-light);
  color: var(--color-brand);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.ap-wandering-glade {
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--app-text-secondary);
  font-size: 12px;
}

.ap-amber-chalice {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

/* ── 嵌入模型区域 ─────────────────────────────────── */
.ap-frost-spindle {
  margin-top: 8px;
}

.ap-toad-cove {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 0 8px;
}

.ap-broken-lattice {
  font-size: 13px;
  color: var(--app-text-muted);
  transition: color 0.2s;
  font-weight: 500;
}

.ap-broken-lattice.active {
  color: var(--app-text-primary);
  font-weight: 600;
}

.ap-quiet-compass { padding: 0 4px; }

.ap-dusky-veil {
  background: var(--color-success-light);
  border: 1px solid rgba(34, 197, 94, 0.25);
  border-radius: var(--app-radius-md);
  padding: 14px 18px;
}

[data-theme='dark'] .ap-dusky-veil,
[data-theme='anchor'] .ap-dusky-veil {
  background: rgba(34, 197, 94, 0.08);
  border-color: rgba(34, 197, 94, 0.15);
}

.ap-hollow-monolith {
  font-weight: 600;
  font-size: 14px;
  color: var(--color-success);
  margin-bottom: 3px;
}

.ap-dusky-shard {
  font-size: 12.5px;
  color: var(--color-success);
  opacity: 0.75;
}

.ap-azure-brine { padding: 0 4px; }

/* ── 扩展包安装区域 ─────────────────────────────── */
.ap-wasp-obsidian {
  margin-top: 12px;
}

.ap-wasp-obsidian .ap-glow-thicket {
  margin-bottom: 12px;
}

.ap-iron-marrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.ap-crimson-cairn {
  margin-top: 12px;
  border: 1px solid var(--app-border, rgba(128, 128, 128, 0.2));
  border-radius: var(--app-radius-md, 8px);
  padding: 12px;
  background: var(--app-surface-subtle, rgba(0, 0, 0, 0.02));
}

.ap-shade-thicket {
  max-height: 160px;
  overflow-y: auto;
  margin-top: 8px;
  font-family: "SF Mono", "Cascadia Code", "Consolas", monospace;
  font-size: 11.5px;
  line-height: 1.6;
  user-select: text;
}

.ap-rare-spire {
  color: var(--app-text-secondary);
  word-break: break-all;
}

.ap-onyx-veil {
  color: var(--app-text-muted);
  font-style: italic;
}

.ap-wasp-cliff {
  display: flex;
  gap: 8px;
  width: 100%;
}

@media (max-width: 768px) {
  .ap-crimson-beacon {
    flex-direction: column;
    align-items: flex-start;
  }
  .ap-cold-veil {
    width: 100%;
    flex-wrap: wrap;
  }
  .ap-wandering-glade {
    max-width: 100%;
    white-space: normal;
  }
}
</style>