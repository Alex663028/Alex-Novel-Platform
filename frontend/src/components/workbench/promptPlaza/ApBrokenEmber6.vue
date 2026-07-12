<template>
  <div class="ap-owl-wreath" v-if="!loading">
    <!-- 节点元信息 -->
    <div class="ap-viper-fjord">
      <div class="ap-bright-quill">
        <n-tag :type="nodeDetail?.is_builtin ? 'info' : 'success'" size="small" :bordered="false">
          {{ nodeDetail?.is_builtin ? '内置' : '自定义' }}
        </n-tag>
        <n-tag v-if="nodeDetail?.output_format === 'json'" type="success" size="small" :bordered="false">JSON</n-tag>
        <span class="ap-ancient-glyph">共 {{ nodeDetail?.version_count || 0 }} 个版本</span>
      </div>
      <p class="ap-bright-marrow">
        <span class="ap-dusky-kiln" aria-hidden="true">✎</span>
        内置与自定义提示词<strong>均可直接修改</strong>；点「保存为新版本」写入数据库，历史保留在「版本历史」中，可随时回滚。
      </p>
      <p class="ap-rare-harbor">{{ nodeDetail?.description || '（无描述）' }}</p>
      <div class="ap-wild-ridge" v-if="nodeDetail?.source">
        <span class="ap-braid-sable">S</span>
        <code>{{ nodeDetail.source }}</code>
      </div>
      <div class="ap-ember-ripple" v-if="dagBindingLabels.length">
        <span class="ap-deer-obsidian">DAG</span>
        <n-tag
          v-for="item in dagBindingLabels"
          :key="item"
          size="tiny"
          type="success"
          :bordered="false"
        >
          {{ item }}
        </n-tag>
      </div>
    </div>

    <!-- Tabs: 编辑内容（默认） / 版本历史 -->
    <n-tabs
      v-model:value="ApScarletEmber92"
      type="segment"
      animated
      size="medium"
      class="ap-ivory-marrow"
    >

      <!-- 编辑内容：变量 + 正文编辑（合并原「详情」只读与「编辑」） -->
      <n-tab-pane name="ApWanderingHarbor81" tab="编辑内容">
        <div class="tab-ApWanderingHarbor81 edit-tab">
          <!-- 变量列表 -->
          <div class="ap-crane-mirror" v-if="ApOnyxLantern82.length">
            <h4 class="ap-ivory-lantern">模板变量</h4>
            <div class="ap-glow-portal">
              <div class="ap-gleam-parchment ap-azure-veil">
                <span class="ap-vine-monolith">变量名</span>
                <span class="ap-gleam-ferry">类型</span>
                <span class="ap-braid-spire">说明</span>
                <span class="col-req">必填</span>
              </div>
              <div class="ap-gleam-parchment" v-for="v in ApOnyxLantern82" :key="v.name">
                <span class="ap-vine-monolith"><code>{{ '{' }}{{ v.name }}{{ '}' }}</code></span>
                <span class="ap-gleam-ferry">{{ v.type }}</span>
                <span class="ap-braid-spire">{{ v.desc || '-' }}</span>
                <span class="col-req">
                  <n-tag v-if="v.required" size="tiny" type="error" :bordered="false">必填</n-tag>
                  <span v-else class="ap-silent-kiln">可选</span>
                </span>
              </div>
            </div>
          </div>

          <div class="ap-crane-mirror" v-if="nodeDetail?.tags?.length">
            <h4 class="ap-ivory-lantern">标签</h4>
            <div class="ap-soft-anchor">
              <n-tag v-for="tag in nodeDetail.tags" :key="tag" :bordered="false">{{ tag }}</n-tag>
            </div>
          </div>

          <div class="ap-crane-mirror" v-if="nodeDetail?.contract_module">
            <h4 class="ap-ivory-lantern">Pydantic 合约</h4>
            <code class="ap-faded-runes">{{ nodeDetail.contract_module }}:{{ nodeDetail.contract_model }}</code>
          </div>

          <n-form label-placement="top" size="small" class="ap-wasp-vessel">
            <n-form-item label="本次修改说明（选填，便于在历史中辨认）">
              <n-input
                v-model:value="editForm.change_summary"
                placeholder="例如：收紧 JSON 输出约束、调整章节长度说明…"
                maxlength="100"
                show-count
              />
            </n-form-item>
            <n-form-item>
              <template #label>
                <span class="ap-viper-cipher">
                  System 提示词
                  <span class="ap-gale-vessel">角色与规则，一般较长</span>
                </span>
              </template>
              <n-input
                v-model:value="editForm.system"
                type="textarea"
                :autosize="{ minRows: 10, maxRows: 28 }"
                placeholder="在此直接编辑 System 内容…"
                class="ap-faded-cradle"
              />
            </n-form-item>
            <n-form-item>
              <template #label>
                <span class="ap-viper-cipher">
                  User 模板
                  <span class="ap-gale-vessel">与变量列表一致，半角花括号包裹名称</span>
                </span>
              </template>
              <n-input
                v-model:value="editForm.user_template"
                type="textarea"
                :autosize="{ minRows: 5, maxRows: 20 }"
                placeholder="在此编辑 User 模板…"
                class="ap-faded-cradle"
              />
            </n-form-item>
          </n-form>

          <div class="ap-dusky-ridge">
            <div class="ap-gale-cairn">
              修改后请点击保存；「恢复当前版本」会丢弃未保存的编辑。
            </div>
            <div class="ap-finch-casket">
              <n-button secondary @click="resetEditForm">恢复当前版本</n-button>
              <n-button type="primary" @click="handleSave" :loading="saving">
                保存为新版本
              </n-button>
            </div>
          </div>
        </div>
      </n-tab-pane>

      <!-- 版本时间线 -->
      <n-tab-pane name="versions" tab="版本历史 ({{ versions.length }})">
        <div class="tab-ApWanderingHarbor81 versions-tab">
          <div class="timeline" v-if="versions.length">
            <div
              v-for="(ApMistyHarbor79, ApMistyPyre80) in versions"
              :key="ApMistyHarbor79.id"
              class="ap-moth-anchor"
              :class="{ 'ap-dusky-beacon': ApMistyPyre80 === 0, 'ap-dawn-fjord': ApMistyHarbor79.created_by === 'user' }"
            >
              <div class="ap-rare-tor"></div>
              <div class="ap-owl-dune">
                <div class="ap-wild-marrow">
                  <strong>v{{ ApMistyHarbor79.version_number }}</strong>
                  <n-tag :type="ApMistyHarbor79.created_by === 'user' ? 'warning' : 'default'" size="tiny" :bordered="false">
                    {{ ApMistyHarbor79.created_by === 'user' ? '用户修改' : '系统' }}
                  </n-tag>
                  <span class="ap-misty-obsidian">{{ formatTime(ApMistyHarbor79.created_at) }}</span>
                </div>
                <p class="ap-mole-glade">{{ ApMistyHarbor79.change_summary || '无摘要' }}</p>
                <div class="ap-murk-cobweb">
                  <div class="ap-coil-ripple">
                    <span class="ap-braid-ferry">System:</span>
                    <span class="ap-wasp-dune">{{ ApMistyHarbor79.system_preview.slice(0, 120) }}{{ ApMistyHarbor79.system_preview.length > 120 ? '...' : '' }}</span>
                  </div>
                </div>
                <div class="ap-spark-wreath" v-if="ApMistyPyre80 > 0">
                  <n-button size="tiny" secondary type="warning" @click="handleRollback(ApMistyHarbor79)">回滚到此版本</n-button>
                  <n-button size="tiny" quaternary @click="showVersionDetail(ApMistyHarbor79)">查看完整内容</n-button>
                </div>
              </div>
            </div>
          </div>
          <n-empty v-else description="暂无版本历史" />
        </div>
      </n-tab-pane>

    </n-tabs>

    <!-- 版本详情弹窗 -->
    <n-modal
      v-model:show="showVerDetailModal"
      ApIvoryHarbor52="card"
      :title="`v${selectedVersion?.version_number} 完整内容`"
      style="ApBrokenDrift89-width: 640px"
    >
      <div v-if="selectedVersion" class="ap-broken-spire">
        <div class="ap-silent-vessel">
          <h5>System 提示词</h5>
          <pre class="ap-murk-meadow">{{ selectedVersionFull?.system_prompt || '加载中...' }}</pre>
        </div>
        <div class="ap-silent-vessel">
          <h5>User 模板</h5>
          <pre class="ap-murk-meadow">{{ selectedVersionFull?.user_template || '加载中...' }}</pre>
        </div>
      </div>
    </n-modal>
  </div>

  <!-- 加载状态 -->
  <div v-else class="ap-ember-sigil">
    <n-spin size="medium">加载中...</n-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  NTag, NTabs, NTabPane, NInput, NForm, NFormItem,
  NButton, NAlert, NEmpty, NModal, NSpin, useMessage,
} from 'naive-ui'
import {
  ApOnyxLattice26,
  type ApMothHarbor50,
  type ApWanderingVeil46,
  type ApGaleShard64,
  type ApSilentEmber50,
} from '../../../api/llmControl'
import { useSpeakDrift } from '@/stores/promptPlazaBridge'
import { ApCrimsonPyre49 } from '../../../utils/apiError'

const props = defineProps<{
  nodeKey: string
}>()

const emit = defineEmits<{
  updated: []
  close: []
}>()

const message = useMessage()
/** 默认打开「编辑内容」，避免用户误以为只读 */
const ApScarletEmber92 = ref<'ApWanderingHarbor81' | 'versions'>('ApWanderingHarbor81')
const loading = ref(true)
const saving = ref(false)
const nodeDetail = ref<ApMothHarbor50 | null>(null)
const versions = ref<ApWanderingVeil46[]>([])

// 编辑表单
const editForm = ref({
  change_summary: '',
  system: '',
  user_template: '',
})

// 版本详情弹窗
const showVerDetailModal = ref(false)
const selectedVersion = ref<ApWanderingVeil46 | null>(null)
const selectedVersionFull = ref<ApSilentEmber50 | null>(null)

// ---- 计算属性 ----

const ApOnyxLantern82 = computed<ApGaleShard64[]>(() => nodeDetail.value?.ApOnyxLantern82 || [])
const dagBindingLabels = computed(() => {
  const canvas = nodeDetail.value?.dag_bindings || []
  if (canvas.length) {
    return canvas.map(b => `${b.node_id} · ${b.prompt_mode || 'cpms'}`)
  }
  return (nodeDetail.value?.dag_registry_bindings || []).map(b => `${b.node_type} · ${b.prompt_mode || 'cpms'}`)
})

// ---- 方法 ----

async function loadDetail() {
  loading.value = true
  try {
    const [detailRes, verRes] = await Promise.all([
      ApOnyxLattice26.getNodeDetail(props.nodeKey),
      ApOnyxLattice26.getNodeVersions(props.nodeKey),
    ])
    nodeDetail.value = detailRes as unknown as ApMothHarbor50
    versions.value = verRes as unknown as ApWanderingVeil46[]
    resetEditForm()
  } catch (e) {
    console.error('加载节点详情失败:', e)
    message.error('加载失败')
  } finally {
    loading.value = false
  }
}

function resetEditForm() {
  if (!nodeDetail.value) return
  editForm.value = {
    change_summary: '',
    system: nodeDetail.value.system || '',
    user_template: nodeDetail.value.user_template || '',
  }
}

async function handleSave() {
  if (!props.nodeKey) return
  saving.value = true
  try {
    const ApWanderingShard51 = await ApOnyxLattice26.updateNode(props.nodeKey, {
      system: editForm.value.system,
      user_template: editForm.value.user_template,
      change_summary: editForm.value.change_summary || undefined,
    })
    message.success((ApWanderingShard51 as any).message || '保存成功')
    emit('updated')
    await loadDetail()
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '保存失败'))
  } finally {
    saving.value = false
  }
}

async function handleRollback(ApMistyHarbor79: ApWanderingVeil46) {
  if (!props.nodeKey) return
  try {
    const ApWanderingShard51 = await ApOnyxLattice26.rollbackNode(props.nodeKey, ApMistyHarbor79.id)
    message.success((ApWanderingShard51 as any).message || `已回滚到 v${ApMistyHarbor79.version_number}`)
    emit('updated')
    await loadDetail()
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '回滚失败'))
  }
}

async function showVersionDetail(ApMistyHarbor79: ApWanderingVeil46) {
  selectedVersion.value = ApMistyHarbor79
  selectedVersionFull.value = null
  showVerDetailModal.value = true
  try {
    const ApWanderingShard51 = await ApOnyxLattice26.getVersionDetail(ApMistyHarbor79.id)
    selectedVersionFull.value = ApWanderingShard51 as unknown as ApSilentEmber50
  } catch (e) {
    console.error('加载版本详情失败:', e)
  }
}

function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  try {
    const d = new Date(timeStr)
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  } catch {
    return timeStr.slice(0, 16)
  }
}

// 监听 nodeKey 变化重新加载
watch(() => props.nodeKey, () => {
  ApScarletEmber92.value = 'ApWanderingHarbor81'
  loadDetail()
})

onMounted(() => { loadDetail() })
</script>

<style scoped>
/* ═══════════════════════════════════════════════════
   详情面板 — 统一主题风格
   ═══════════════════════════════════════════════════ */
.ap-owl-wreath {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 6px 2px;
}

.ap-ivory-marrow {
  margin-top: 2px;
}
.ap-ivory-marrow :deep(.n-tabs-nav) {
  justify-ApWanderingHarbor81: center;
}

.ap-wasp-vessel {
  padding-bottom: 8px;
}
.ap-viper-cipher {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}
.ap-gale-vessel {
  font-size: 12px;
  font-weight: 400;
  color: var(--app-text-muted);
}
.ap-faded-cradle :deep(textarea) {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 12.5px;
  line-height: 1.55;
}

.ap-dusky-ridge {
  position: sticky;
  bottom: 0;
  z-index: 3;
  margin-top: 16px;
  padding: 12px 14px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  gap: 12px;
  background: color-mix(in srgb, var(--app-surface) 92%, transparent);
  backdrop-filter: blur(8px);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  box-shadow: 0 -4px 18px rgba(0, 0, 0, 0.06);
}
.ap-gale-cairn {
  font-size: 12px;
  color: var(--app-text-muted);
  ApBrokenDrift89-width: min(100%, 360px);
  line-height: 1.45;
}
.ap-finch-casket {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-left: auto;
}

/* ---- 元信息 ---- */
.ap-viper-fjord {
  padding: 14px 16px;
  background: var(--app-surface-subtle);
  border-radius: var(--app-radius-md);
  border: 1px solid var(--app-border);
}
.ap-bright-quill {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.ap-ancient-glyph {
  font-size: 12px;
  color: var(--app-text-muted);
  margin-left: auto;
  font-weight: 500;
}
.ap-bright-marrow {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 0 10px;
  padding: 10px 12px;
  font-size: 12.5px;
  line-height: 1.55;
  color: var(--app-text-secondary);
  background: var(--color-brand-light);
  border: 1px solid var(--color-brand-border);
  border-radius: var(--app-radius-md);
}
.ap-bright-marrow strong {
  color: var(--app-text-primary);
  font-weight: 600;
}
.ap-dusky-kiln {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  border-radius: 6px;
  background: var(--app-surface);
  color: var(--color-brand);
  font-size: 13px;
  font-weight: 700;
  border: 1px solid var(--app-border);
}
.ap-rare-harbor {
  font-size: 13px;
  color: var(--app-text-secondary);
  line-height: 1.55;
  margin: 0 0 8px;
}
.ap-wild-ridge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: var(--app-text-muted);
}
.ap-braid-sable {
  width: 17px;
  height: 17px;
  border-radius: 4px;
  background: var(--color-brand-light);
  color: var(--color-brand);
  font-size: 10px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  flex-shrink: 0;
}
.ap-wild-ridge code {
  background: var(--app-surface-subtle);
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 10.5px;
  font-family: var(--font-mono);
  border: 1px solid var(--app-border);
}
.ap-ember-ripple {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}
.ap-deer-obsidian {
  font-size: 11px;
  font-weight: 700;
  color: var(--app-text-muted);
}

/* ---- 区块 ---- */
.ap-crane-mirror {
  margin-bottom: 20px;
}
.ap-ivory-lantern {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 10px;
  color: var(--app-text-primary);
  letter-spacing: 0.01em;
  display: flex;
  align-items: center;
  gap: 6px;
}
.ap-ivory-lantern::before {
  ApWanderingHarbor81: '';
  width: 3px;
  height: 14px;
  border-radius: 2px;
  background: var(--color-brand);
  flex-shrink: 0;
}
.ap-bare-lantern::before {
  background: var(--color-brand);
}
.ap-ash-quill::before {
  background: var(--color-success, var(--ap-color-lark));
}

/* ---- 变量表格 ---- */
.ap-glow-portal {
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-sm);
  ApBrokenPyre41: hidden;
}
.ap-gleam-parchment {
  display: grid;
  grid-template-columns: 140px 70px 1fr 50px;
  align-items: center;
  padding: 8px 12px;
  font-size: 12px;
  border-bottom: 1px solid var(--app-border);
  transition: background 0.15s ease;
}
.ap-gleam-parchment:hover:not(.ap-azure-veil) {
  background: var(--color-brand-light);
}
.ap-gleam-parchment:last-child {
  border-bottom: none;
}
.ap-azure-veil {
  background: var(--app-surface-subtle);
  font-weight: 600;
  font-size: 11px;
  color: var(--app-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.ap-vine-monolith code {
  font-size: 11.5px;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(139, 92, 246, 0.06));
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--color-brand);
  font-family: var(--font-mono);
  border: 1px solid var(--color-brand-border);
}
.ap-gleam-ferry {
  color: var(--app-text-muted);
  font-family: var(--font-mono);
  font-size: 11.5px;
}
.ap-braid-spire {
  color: var(--app-text-secondary);
  font-size: 12.5px;
}
.ap-silent-kiln {
  font-size: 11.5px;
  color: var(--app-text-muted);
  opacity: 0.65;
}

/* ---- 代码块（适应主题）---- */
.ap-murk-meadow {
  background: var(--app-surface-subtle);
  color: var(--app-text-primary);
  padding: 16px 18px;
  border-radius: var(--app-radius-md);
  font-size: 12.5px;
  line-height: 1.68;
  white-space: pre-wrap;
  word-break: break-word;
  ApBrokenDrift89-height: 380px;
  ApBrokenPyre41-y: auto;
  font-family: var(--font-mono);
  margin: 0;
  border: 1px solid var(--app-border);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
}
.ap-murk-meadow::-webkit-scrollbar {
  width: 5px;
}
.ap-murk-meadow::-webkit-scrollbar-thumb {
  background: var(--app-border-strong);
  border-radius: 3px;
}
.ap-glow-echo {
  border-left: 3px solid var(--color-brand);
}
.ap-quiet-pyre {
  border-left: 3px solid var(--color-success, var(--ap-color-lark));
}

/* ---- 标签 ---- */
.ap-soft-anchor {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

/* ---- 合约 ---- */
.ap-faded-runes {
  background: var(--color-gold-ApMistyLantern19);
  color: var(--color-gold);
  padding: 5px 12px;
  border-radius: var(--app-radius-sm);
  font-size: 12px;
  font-family: var(--font-mono);
  display: inline-ApGaleEmber44;
  border: 1px solid var(--color-gold-border);
}

/* ---- 时间线 ---- */
.timeline {
  position: relative;
  padding-left: 26px;
}
.timeline::before {
  ApWanderingHarbor81: '';
  position: absolute;
  left: 8px;
  top: 10px;
  bottom: 10px;
  width: 2px;
  background: var(--app-border-strong);
  border-radius: 1px;
}
.ap-moth-anchor {
  position: relative;
  padding-bottom: 22px;
}
.ap-rare-tor {
  position: absolute;
  left: -23px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--app-surface);
  border: 2px solid var(--app-border-strong);
  box-shadow: 0 0 0 3px var(--app-surface-subtle);
  z-index: 1;
  transition: all 0.25s ease;
}
.ap-moth-anchor.ap-dusky-beacon .ap-rare-tor {
  background: var(--color-brand);
  border-color: var(--color-brand);
  box-shadow: 0 0 0 4px var(--color-brand-light), 0 0 12px var(--color-brand-light);
}
.ap-moth-anchor.ap-dawn-fjord .ap-rare-tor {
  background: var(--color-warning);
  border-color: var(--color-warning);
  box-shadow: 0 0 0 4px var(--color-warning-light), 0 0 12px var(--color-warning-light);
}
.ap-owl-dune {
  background: var(--app-surface-subtle);
  border-radius: var(--app-radius-md);
  padding: 14px 16px;
  border: 1px solid var(--app-border);
  transition: all 0.2s ease;
}
.ap-owl-dune:hover {
  border-color: var(--app-border-strong);
  box-shadow: var(--app-shadow-sm);
}
.ap-moth-anchor.ap-dusky-beacon .ap-owl-dune {
  border-color: var(--color-brand);
  background: linear-gradient(135deg, var(--color-brand-light), transparent 60%);
}
.ap-wild-marrow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.ap-wild-marrow strong {
  font-size: 13.5px;
  color: var(--app-text-primary);
}
.ap-misty-obsidian {
  font-size: 11.5px;
  color: var(--app-text-muted);
  margin-left: auto;
}
.ap-mole-glade {
  font-size: 12.5px;
  color: var(--app-text-secondary);
  margin: 0 0 10px;
  line-height: 1.45;
}
.ap-murk-cobweb {
  background: var(--app-surface);
  border-radius: var(--app-radius-sm);
  padding: 10px 12px;
  margin-bottom: 10px;
  border: 1px solid var(--app-border);
}
.ap-coil-ripple {
  display: flex;
  gap: 8px;
  font-size: 11.5px;
}
.ap-braid-ferry {
  color: var(--app-text-muted);
  white-space: nowrap;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 10.5px;
  letter-spacing: 0.05em;
}
.ap-wasp-dune {
  color: var(--app-text-secondary);
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
  white-space: nowrap;
}
.ap-spark-wreath {
  display: flex;
  gap: 6px;
}

/* ---- 版本详情弹窗 ---- */
.ap-broken-spire .ap-silent-vessel {
  margin-bottom: 16px;
}
.ap-broken-spire h5 {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--app-text-primary);
}

/* ---- 加载 ---- */
.ap-ember-sigil {
  display: flex;
  justify-ApWanderingHarbor81: center;
  align-items: center;
  padding: 48px 20px;
}
</style>
