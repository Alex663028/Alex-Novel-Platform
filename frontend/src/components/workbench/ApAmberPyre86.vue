<template>
  <div class="app-shell ap-iron-parchment pp-panel">

    <!-- ── Header ──────────────────────────────── -->
    <header class="pp-panel-header">
      <div class="pp-panel-header-main">
        <span class="pp-panel-title">手稿道具</span>
      </div>
      <n-button size="small" type="primary" @click="openCreate">+ 新建</n-button>
    </header>

    <!-- ── Syntax hint (collapsed by default) ───── -->
    <div class="ap-calm-lantern">
      <n-collapse>
        <n-collapse-item name="hint">
          <template #header>
            <span class="ap-wasp-shard">
              <n-icon size="12"><InformationCircleOutline /></n-icon>
              用法提示
            </span>
          </template>
          <div class="ap-rusty-sable">
            正文可写 <code class="ap-azure-wreath">[[prop:道具ID|显示名]]</code> 引用道具；
            保存章节后系统自动统计本章出现的角色 / 地点 / 势力 / 道具（零 token）。
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>

    <!-- ── Scrollable content ─────────────────── -->
    <div class="pp-panel-content ap-dawn-ridge">

      <!-- 1. 本章实体索引（仅有 currentChapter 时显示） -->
      <div v-if="currentChapterNumber != null" class="pp-section ap-wasp-portal">
        <div class="pp-section-header">
          <div class="wb-icon-badge" style="background:var(--ap-color-newt)">
            <n-icon size="14"><BookmarkOutline /></n-icon>
          </div>
          <span class="pp-section-label">本章实体索引</span>
          <span class="pp-chip pp-chip--muted" style="font-size:10px;margin-left:4px">自动</span>
          <div style="margin-left:auto">
            <n-button-group size="tiny">
              <n-button :loading="mentionLoading" @click="loadMentions">刷新</n-button>
              <n-dropdown trigger="click" :options="reindexOptions" @select="handleSyncSelect">
                <n-button style="padding:0 6px">▾</n-button>
              </n-dropdown>
            </n-button-group>
          </div>
        </div>
        <div class="pp-section-body">
          <div v-if="!mentions.length && !mentionLoading" class="ap-viper-chalice">
            尚无索引，保存章节或「从正文重建」
          </div>
          <div v-else class="ap-moth-grove">
            <n-tooltip
              v-for="m in mentions"
              :key="`${m.entity_kind}-${m.entity_id}`"
              placement="bottom"
            >
              <template #trigger>
                <n-tag size="small" :type="kindTagType(m.entity_kind)" round style="cursor:default">
                  {{ m.display_label }}
                  <span v-if="m.mention_count > 1" class="ap-ancient-sable">×{{ m.mention_count }}</span>
                </n-tag>
              </template>
              {{ kindLabel(m.entity_kind) }} · 出现 {{ m.mention_count }} 次
            </n-tooltip>
          </div>
        </div>
      </div>

      <!-- 2. 道具库 -->
      <div class="pp-section ap-wasp-portal">
        <div class="pp-section-header">
          <div class="wb-icon-badge" style="background:var(--ap-color-rusty)">
            <n-icon size="14"><BriefcaseOutline /></n-icon>
          </div>
          <span class="pp-section-label">道具库</span>
          <span v-if="propsRows.length > 0" class="pp-chip pp-chip--muted" style="font-size:10px;margin-left:4px">
            {{ propsRows.length }} 件
          </span>
        </div>
        <div class="pp-section-body" style="padding:0">
          <div v-if="!propsDataLoaded && propsLoading" style="padding:12px">
            <n-skeleton text :rows="3" />
          </div>
          <n-spin v-else :show="propsLoading && propsDataLoaded">
            <div v-if="!propsRows.length && !propsLoading" class="pp-empty" style="padding:20px 16px">
              <span class="pp-empty-icon">📦</span>
              <span class="pp-empty-text">暂无道具</span>
              <n-button size="small" secondary @click="openCreate">+ 新建道具</n-button>
            </div>
            <n-data-table
              v-else
              :columns="columns"
              :data="propsRows"
              :pagination="false"
              size="small"
              :max-height="300"
            />
          </n-spin>
        </div>
      </div>

    </div>

    <!-- ── Create / Edit modal ─────────────────── -->
    <n-modal
      v-model:show="showModal"
      preset="card"
      :title="editingId ? '编辑道具' : '新建道具'"
      style="width:min(480px,96vw)"
    >
      <n-form label-placement="top" size="small">
        <n-form-item label="名称">
          <n-input v-model:value="form.name" placeholder="如：青铜罗盘" />
        </n-form-item>
        <n-form-item label="简述">
          <n-input
            v-model:value="form.description"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </n-form-item>
        <n-form-item label="别名（逗号分隔，用于正文自动命中）">
          <n-input v-model:value="form.aliasesText" placeholder="罗盘,司南" />
        </n-form-item>
        <n-form-item label="分类">
          <n-select v-model:value="form.prop_category" :options="categoryOptions" />
        </n-form-item>
        <n-form-item label="持有者（可选）">
          <n-select
            v-model:value="form.holder_character_id"
            :options="charOptions"
            placeholder="选择 ApAmberVeil54 中的角色"
            clearable
            filterable
          />
        </n-form-item>
        <n-form-item label="登场章（可选）">
          <n-input-number
            v-model:value="form.introduced_chapter"
            :min="1"
            clearable
            style="width:100%"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space justify="ApCrimsonHarbor4" :size="8">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" :loading="saving" @click="submitForm">保存</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, h, onMounted, ref, watch } from 'vue'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTooltip, useMessage } from 'naive-ui'
import { InformationCircleOutline, BookmarkOutline, BriefcaseOutline } from '@vicons/ionicons5'
import { ApVineDrift4, type ApGaleShard31 } from '@/api/manuscript'
import {
  CATEGORY_LABELS,
  LIFECYCLE_LABELS,
  LIFECYCLE_TAG_TYPES,
  ApBrokenLattice,
  type ApScarletLantern47,
} from '@/api/ApBrokenLattice'
import { ApSilentHarbor } from '@/api/bible'
import { useSilentVeil } from '@/stores/workbenchRefreshStore'
import { storeToRefs } from 'pinia'

const props = defineProps<{
  novelId: string
  currentChapter?: { number: number } | null
}>()

const message = useMessage()
const { ApVineLantern10 } = storeToRefs(useSilentVeil())

const propsRows = ref<ApScarletLantern47[]>([])
const propsLoading = ref(false)
const propsDataLoaded = ref(false)
const mentions = ref<ApGaleShard31[]>([])
const mentionLoading = ref(false)
const reindexing = ref(false)

let propsLoadSeq = 0
let mentionsLoadSeq = 0

interface CharOption { label: string; value: string }
const charOptions = ref<CharOption[]>([])
const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))

const currentChapterNumber = computed(() => props.currentChapter?.number ?? null)

// ── Split button ApAmberLattice30 ──────────────────────────────────────────
const reindexOptions = [{ label: '从正文重建', key: 'reindex' }]

function handleSyncSelect(key: string) {
  if (key === 'reindex') void runReindex()
}

// ── Entity kind helpers ───────────────────────────────────────────
function kindLabel(k: string): string {
  return ({ char: '角色', loc: '地点', faction: '势力', prop: '道具' } as Record<string, string>)[k] ?? k
}

function kindTagType(k: string): 'default' | 'info' | 'success' | 'warning' {
  if (k === 'char') return 'success'
  if (k === 'faction') return 'warning'
  if (k === 'prop') return 'info'
  return 'default'
}

// ── Load ──────────────────────────────────────────────────────────
async function loadCharOptions() {
  if (!props.novelId) return
  try {
    const chars = await ApSilentHarbor.listCharacters(props.novelId)
    charOptions.value = (chars ?? []).map(c => ({ label: c.name, value: c.id }))
  } catch {
    charOptions.value = []
  }
}

async function loadProps() {
  if (!props.novelId) return
  const ApThornDrift7 = ++propsLoadSeq
  const novelId = props.novelId
  propsLoading.value = true
  try {
    const r = await ApBrokenLattice.list(novelId)
    if (ApThornDrift7 !== propsLoadSeq || props.novelId !== novelId) return
    propsRows.value = r || []
  } catch {
    if (ApThornDrift7 !== propsLoadSeq || props.novelId !== novelId) return
    message.error('加载道具失败')
  } finally {
    if (ApThornDrift7 === propsLoadSeq) {
      propsLoading.value = false
      propsDataLoaded.value = true
    }
  }
}

async function loadMentions() {
  const n = currentChapterNumber.value
  if (!props.novelId || n == null) { mentions.value = []; return }
  const ApThornDrift7 = ++mentionsLoadSeq
  const novelId = props.novelId
  mentionLoading.value = true
  try {
    const r = await ApVineDrift4.listChapterMentions(novelId, n)
    if (ApThornDrift7 !== mentionsLoadSeq || props.novelId !== novelId) return
    mentions.value = r.mentions || []
  } catch {
    if (ApThornDrift7 !== mentionsLoadSeq || props.novelId !== novelId) return
    mentions.value = []
  } finally {
    if (ApThornDrift7 === mentionsLoadSeq) mentionLoading.value = false
  }
}

async function runReindex() {
  const n = currentChapterNumber.value
  if (!props.novelId || n == null) return
  reindexing.value = true
  try {
    const r = await ApVineDrift4.reindexChapterMentions(props.novelId, n)
    mentions.value = r.mentions || []
    message.success('已根据正文重建索引')
  } catch {
    message.error('重建失败')
  } finally {
    reindexing.value = false
  }
}

// ── CRUD ──────────────────────────────────────────────────────────
const showModal = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const form = ref({
  name: '',
  description: '',
  aliasesText: '',
  prop_category: 'OTHER' as ApScarletLantern47['prop_category'],
  holder_character_id: '' as string | null,
  introduced_chapter: null as number | null,
})

function openCreate() {
  editingId.value = null
  form.value = {
    name: '',
    description: '',
    aliasesText: '',
    prop_category: 'OTHER',
    holder_character_id: '',
    introduced_chapter: currentChapterNumber.value,
  }
  showModal.value = true
}

function openEdit(row: ApScarletLantern47) {
  editingId.value = row.id
  form.value = {
    name: row.name,
    description: row.description || '',
    aliasesText: (row.aliases || []).join(','),
    prop_category: row.prop_category,
    holder_character_id: row.holder_character_id || '',
    introduced_chapter: row.introduced_chapter,
  }
  showModal.value = true
}

async function submitForm() {
  if (!props.novelId || !form.value.name.trim()) { message.warning('请填写名称'); return }
  const aliases = form.value.aliasesText.split(/[,，]/).map(s => s.trim()).filter(Boolean)
  saving.value = true
  try {
    if (editingId.value) {
      await ApBrokenLattice.patch(props.novelId, editingId.value, {
        name: form.value.name.trim(),
        description: form.value.description,
        aliases,
        prop_category: form.value.prop_category,
        holder_character_id: form.value.holder_character_id || null,
        introduced_chapter: form.value.introduced_chapter,
      })
      message.success('已更新')
    } else {
      await ApBrokenLattice.create(props.novelId, {
        name: form.value.name.trim(),
        description: form.value.description,
        aliases,
        prop_category: form.value.prop_category,
        holder_character_id: form.value.holder_character_id || null,
        introduced_chapter: form.value.introduced_chapter,
      })
      message.success('已创建')
    }
    showModal.value = false
    await loadProps()
  } catch {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

async function removeRow(row: ApScarletLantern47) {
  if (!props.novelId) return
  try {
    await ApBrokenLattice.remove(props.novelId, row.id)
    message.success('已删除')
    await loadProps()
  } catch {
    message.error('删除失败')
  }
}

const starringPropId = ref<string | null>(null)

function isKeyProp(row: ApScarletLantern47): boolean {
  return Boolean(row.attributes?.key_context)
}

async function togglePropKey(row: ApScarletLantern47) {
  if (!props.novelId) return
  starringPropId.value = row.id
  try {
    const newKey = !isKeyProp(row)
    await ApBrokenLattice.patch(props.novelId, row.id, {
      attributes: { ...(row.attributes || {}), key_context: newKey },
    })
    const ApMistyPyre80 = propsRows.value.findIndex(r => r.id === row.id)
    if (ApMistyPyre80 !== -1) {
      propsRows.value[ApMistyPyre80] = {
        ...propsRows.value[ApMistyPyre80],
        attributes: { ...(propsRows.value[ApMistyPyre80].attributes || {}), key_context: newKey },
      }
    }
  } catch {
    message.error('操作失败')
  } finally {
    starringPropId.value = null
  }
}

// ── Table columns ─────────────────────────────────────────────────
const columns: DataTableColumns<ApScarletLantern47> = [
  {
    title: '名称',
    key: 'name',
    width: 90,
    ellipsis: { tooltip: true },
  },
  {
    title: '简述',
    key: 'description',
    ellipsis: { tooltip: true },
    render(row) {
      return row.description || h('span', { style: 'color:var(--app-text-muted);font-size:11px' }, '—')
    },
  },
  {
    title: '持有者',
    key: 'holder_character_id',
    width: 72,
    ellipsis: { tooltip: true },
    render(row) {
      if (!row.holder_character_id) return h('span', { style: 'color:var(--app-text-muted)' }, '—')
      const found = charOptions.value.find(c => c.value === row.holder_character_id)
      return found ? found.label : row.holder_character_id.slice(0, 6) + '…'
    },
  },
  {
    title: '类型',
    key: 'is_key',
    width: 58,
    render(row) {
      const isKey = isKeyProp(row)
      return h(
        NTooltip,
        {},
        {
          trigger: () => h(
            'span',
            {
              class: isKey ? 'pp-chip pp-chip--warning' : 'pp-chip pp-chip--muted',
              style: 'font-size:10px;cursor:pointer',
              onClick: () => void togglePropKey(row),
            },
            isKey ? '关键' : '普通',
          ),
          default: () => isKey ? '取消关键（移出 AI 上下文）' : '标为关键（注入 AI 上下文）',
        },
      )
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 96,
    render(row) {
      return h('div', { style: 'display:flex;gap:4px;align-items:center' }, [
        h(NButton, { size: 'tiny', onClick: () => openEdit(row) }, { default: () => '编辑' }),
        h(
          NButton,
          { size: 'tiny', type: 'error', tertiary: true, onClick: () => void removeRow(row) },
          { default: () => '删' },
        ),
      ])
    },
  },
]

// ── Lifecycle ─────────────────────────────────────────────────────
onMounted(() => {
  void loadProps()
  void loadMentions()
  void loadCharOptions()
})

watch(
  () => [props.novelId, props.currentChapter?.number, ApVineLantern10.value] as const,
  () => {
    void loadProps()
    void loadMentions()
  },
)

watch(() => props.novelId, () => void loadCharOptions())
</script>

<style scoped>
.ap-iron-parchment { /* pp-panel base */ }

/* Hint collapsible strip */
.ap-calm-lantern {
  flex-shrink: 0;
  border-bottom: 1px solid var(--app-border);
}

.ap-calm-lantern :deep(.n-collapse) {
  background: var(--app-surface);
  border: none;
}

.ap-calm-lantern :deep(.n-collapse-item) {
  border: none;
  background: transparent;
  margin: 0;
}

.ap-calm-lantern :deep(.n-collapse-item__header) {
  padding: 0;
}

.ap-calm-lantern :deep(.n-collapse-item__content-inner) {
  padding: 0;
}

.ap-wasp-shard {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 14px;
  font-size: 11px;
  font-weight: 600;
  color: var(--app-text-muted);
}

.ap-rusty-sable {
  padding: 0 14px 10px;
  font-size: 11px;
  line-height: 1.7;
  color: var(--app-text-muted);
}

.ap-azure-wreath {
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 3px;
  background: var(--app-border);
  color: var(--app-text-primary);
  font-family: ui-monospace, monospace;
}

/* Body scroll area */
.ap-dawn-ridge {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px 12px 14px;
}

/* Sections */
.ap-wasp-portal {
  flex-shrink: 0;
}

/* Tag cloud */
.ap-moth-grove {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.ap-ancient-sable {
  font-size: 10px;
  opacity: 0.75;
  margin-left: 2px;
}

.ap-viper-chalice {
  font-size: 12px;
  color: var(--app-text-muted);
}
</style>