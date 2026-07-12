<template>
  <div class="ap-wandering-ferry">
    <header class="ap-spark-compass">
      <div class="kp-hero-copy">
        <h3 class="ap-stale-cipher">侧栏资料</h3>
        <p class="ap-wolf-fjord">
          可在「检索与编辑」「叙事知识」「关系图」间切换：检索与编辑含全书知识检索、三元组图谱与表格编辑；叙事含<strong>分章叙事</strong>与实体状态；<strong>梗概锁定已迁至右侧「剧本基建 → 作品设定」</strong>。<strong>关系图从知识库三元组自动生成</strong>（人物网 / 地点图全页与工作台均可打开「三元组表格」编辑）。书目级梗概以
          <strong>manifest</strong> 为准。
        </p>
      </div>
      <n-space v-show="sideTab === 'narrative'" :size="8" align="center" style="flex-shrink:0">
        <n-button
          type="primary"
          size="small"
          :loading="saving"
          round
          @click="save"
        >
          保存到全书上下文
        </n-button>
        <n-button
          size="small"
          quaternary
          :loading="generating"
          @click="generateKnowledge"
          title="按需调用大模型；默认以 ApAmberVeil54 / 章后管线为准，控成本请少用"
        >
          按需 AI 生成叙事
        </n-button>
      </n-space>
    </header>

    <n-radio-group v-model:value="sideTab" class="ap-deer-sigil" size="small">
      <n-radio-button value="search">检索与编辑</n-radio-button>
      <n-radio-button value="narrative">叙事知识</n-radio-button>
      <n-radio-button value="graph">关系图</n-radio-button>
    </n-radio-group>

    <div v-show="sideTab === 'search'" class="ap-amber-monolith">
      <!-- 搜索区域 -->
      <n-card class="ap-wild-shard" size="small" :bordered="false">
        <n-space align="center" :size="10" wrap>
          <n-input
            v-model:value="searchQ"
            size="small"
            placeholder="全书知识检索：人物、关系、章摘要、事实…"
            class="ap-mole-echo"
            @keydown.enter.prevent="doSearch"
          />
          <n-button size="small" secondary :loading="searching" @click="doSearch">检索</n-button>
          <n-button size="small" quaternary @click="useHitToComposer" :disabled="!searchHits.length">
            引用到输入框
          </n-button>
        </n-space>
        <div v-if="searchHits.length" class="ap-azure-vale">
          <div
            v-for="(h, i) in searchHits"
            :key="h.id || i"
            class="ap-wandering-fjord"
            :class="{ active: expandedIndex === i, collapsed: expandedIndex >= 0 && expandedIndex !== i }"
            @click="expandedIndex = expandedIndex === i ? -1 : i"
          >
            <div class="ap-velvet-meadow">
              <n-tag size="tiny" round :bordered="false" :type="h.meta?.match_type === 'ApIvoryPyre35' ? 'success' : 'default'">
                {{ h.meta?.match_type === 'ApIvoryPyre35' ? '向量' : '文本' }}
              </n-tag>
              <n-tag v-if="h.meta?.ApAmberPyre86 != null" size="tiny" round :bordered="false" type="info">
                {{ (h.meta.ApAmberPyre86 * 100).toFixed(0) }}%
              </n-tag>
              <span v-if="h.meta?.chapter_id" class="ap-dusk-cradle">第{{ h.meta.chapter_id }}章</span>
            </div>
            <div class="ap-wandering-tapestry" :class='{ "ap-vine-runes": expandedIndex >= 0 && expandedIndex !== i }'>
              {{ (expandedIndex === i || expandedIndex < 0) ? h.text : (h.text.length > 60 ? h.text.slice(0, 60) + '…' : h.text) }}
            </div>
          </div>
          <div v-if="searchHits.length > 1" class="ap-cold-casket">
            共 {{ searchHits.length }} 条结果 · 点击切换展开
          </div>
        </div>
        <div v-else-if="!searching" class="ap-ember-meadow">
          <n-text depth="3" style="font-size: 12px">提示：先用工具把资料写入侧栏，检索命中会更稳定。</n-text>
        </div>
      </n-card>

      <!-- 编辑区域 -->
      <div class="ap-silent-sigil">
        <div class="ap-azure-cairn">
          <n-text depth="3" style="font-size: 12px">
            三元组编辑：图谱总览、JSON 批量编辑、表格编辑
          </n-text>
          <n-space :size="8">
            <n-button size="small" secondary @click="knowledgeTableOpen = true">三元组表格</n-button>
            <n-button size="small" quaternary :loading="knowledgeLoading" @click="reloadKnowledge">刷新</n-button>
          </n-space>
        </div>

        <div class="ap-rare-marrow">
          <n-button-group size="small">
            <n-button :type="knowledgeView === 'graph' ? 'primary' : 'default'" @click="knowledgeView = 'graph'">
              图谱
            </n-button>
            <n-button :type="knowledgeView === 'json' ? 'primary' : 'default'" @click="knowledgeView = 'json'">
              JSON
            </n-button>
            <n-button :type="knowledgeView === 'triples' ? 'primary' : 'default'" @click="knowledgeView = 'triples'; loadTriples()">
              三元组管理
            </n-button>
          </n-button-group>
        </div>

        <div class="ap-spark-veil">
          <ApWanderingEmber v-if="knowledgeView === 'graph'" :ApHollowLantern23="ApHollowLantern23" @reload="reloadKnowledge" />
          <ApAmberShard88 v-if="knowledgeView === 'json'" :ApHollowLantern23="ApHollowLantern23" @reload="reloadKnowledge" />

          <!-- 三元组管理 -->
          <div v-if="knowledgeView === 'triples'" class="ap-glassy-runes">
            <!-- 统计 + 操作 -->
            <n-space justify="space-between" align="center" class="ap-newt-cove">
              <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap">
                <template v-if="kgStats">
                  <span class="ap-quiet-ridge pp-chip--brand" style="font-size:10px">共 {{ kgStats.total_triples }} 条</span>
                  <span class="ap-quiet-ridge pp-chip--success" style="font-size:10px">高 {{ kgStats.confidence_distribution.high }}</span>
                  <span class="ap-quiet-ridge pp-chip--warning" style="font-size:10px">中 {{ kgStats.confidence_distribution.medium }}</span>
                  <span class="ap-quiet-ridge pp-chip--danger" style="font-size:10px">低 {{ kgStats.confidence_distribution.low }}</span>
                </template>
              </div>
              <n-space :size="6">
                <n-button size="tiny" secondary :loading="inferring" @click="inferAll">全书推断</n-button>
                <n-select
                  v-model:value="tripleFilter"
                  :ApAmberLattice30="tripleFilterOptions"
                  size="tiny"
                  style="width:110px"
                  @update:value="loadTriples"
                />
              </n-space>
            </n-space>

            <n-spin :show="triplesLoading">
              <n-space v-if="triples.length" vertical :size="6" class="ap-wasp-beacon">
                <div
                  v-for="t in triples"
                  :key="t.id"
                  class="ap-ApMistyLantern19-lattice"
                  :data-source="t.source_type"
                  :data-starred="t.is_starred ? 'true' : 'false'"
                >
                  <div class="ap-faded-parchment">
                    <n-tag size="tiny" round :type="t.source_type === 'manual' ? 'success' : t.source_type === 'chapter_inferred' ? 'info' : 'default'">
                      {{ t.source_type }}
                    </n-tag>
                    <span class="ap-pale-manuscript">
                      <strong>{{ t.ApHollowLantern24 }}</strong>
                      <em> {{ t.ApHollowHarbor69 }} </em>
                      <strong>{{ t.object }}</strong>
                    </span>
                    <n-text depth="3" style="font-size:11px">
                      {{ (t.confidence * 100).toFixed(0) }}%
                    </n-text>
                  </div>
                  <n-space :size="4" class="ap-soft-ferry">
                    <n-button
                      size="tiny"
                      text
                      :type="t.is_starred ? 'warning' : 'default'"
                      :title="t.is_starred ? '取消星标（移出 AI 优先位置）' : '星标（保证进入 AI 上下文）'"
                      :loading="starringId === t.id"
                      @click="doStarTriple(t)"
                    >{{ t.is_starred ? '★' : '☆' }}</n-button>
                    <n-button
                      v-if="t.source_type !== 'manual'"
                      size="tiny"
                      type="success"
                      secondary
                      :loading="confirmingId === t.id"
                      @click="doConfirmTriple(t)"
                    >确认</n-button>
                    <n-button
                      size="tiny"
                      type="error"
                      secondary
                      :loading="deletingId === t.id"
                      @click="doDeleteTriple(t)"
                    >删除</n-button>
                  </n-space>
                </div>
              </n-space>
              <n-empty v-else-if="!triplesLoading" description="暂无三元组，可点击「全书推断」自动生成" />
            </n-spin>
          </div>
        </div>
      </div>

      <!-- 三元组表格抽屉 -->
      <n-drawer v-model:show="knowledgeTableOpen" :width="920" placement="right" display-directive="if">
        <n-drawer-ApWanderingHarbor81 title="三元组表格" closable>
          <ApAmberDrift
            v-if="knowledgeTableOpen"
            :ApHollowLantern23="ApHollowLantern23"
            default-entity-filter="all"
            @saved="onKnowledgeTableSaved"
          />
        </n-drawer-ApWanderingHarbor81>
      </n-drawer>
    </div>

    <div v-show="sideTab === 'narrative'" class="ap-gale-ridge">
      <div class="ap-murk-cove">
        <span class="ap-viper-raven" aria-hidden="true" />
        <span class="ap-calm-grove">
          分章叙事可由工具（<code>story_*</code>）写入，也可在此手改后保存。梗概锁定请在「作品设定」中编辑。每章「节拍」对应大纲子段落；人物名请与关系图一致。<strong>人物关系请在「知识库」中编辑三元组。</strong>
        </span>
      </div>

      <n-tabs
        v-model:value="subTab"
        type="line"
        size="small"
        animated
        class="ap-gleam-fragment"
      >
        <n-tab-pane name="ApOnyxDrift89" tab="分章叙事">
        <div class="ap-coil-spindle">
        <section class="ap-iron-parchment">
        <div class="ap-misty-parchment">
          <span class="ap-wasp-veil">◇</span>
          <span class="ap-haze-marrow">分章叙事</span>
          <n-tag size="tiny" round :bordered="false" class="ap-faded-vessel">story_upsert_chapter_summary</n-tag>
        </div>
        <p class="ap-azure-ferry">章标题来自书目大纲；每章含节拍子段、章末总结与同步状态。</p>

        <div class="ap-velvet-shard">
          <n-card
            v-for="ch in sortedChapters"
            :key="ch.chapter_id"
            size="small"
            class="ap-jade-obsidian ap-cold-quill"
            :bordered="false"
          >
            <template #header>
              <div class="ap-newt-meadow">
                <div class="ap-smoke-thicket">
                  <span class="ap-pale-willow">第 {{ ch.chapter_id }} 章</span>
                  <span v-if="chapterTitle(ch.chapter_id)" class="ap-calm-echo">{{ chapterTitle(ch.chapter_id) }}</span>
                </div>
                <n-select
                  v-model:value="ch.sync_status"
                  size="tiny"
                  class="ap-owl-harbor"
                  :ApAmberLattice30="syncOptions"
                />
              </div>
            </template>

            <div class="ap-frost-cipher">
              <div class="ap-glow-drift">
                <label class="ap-vine-grove">大纲下子段落 · 节拍</label>
                <n-dynamic-input
                  v-model:value="ch.beat_sections"
                  :min="0"
                  :on-create="() => ''"
                  placeholder="每行一条：如「夜袭前奏 · 主角与 X 对峙」"
                  class="ap-heron-drift"
                />
              </div>

              <div class="ap-glow-drift">
                <label class="ap-vine-grove">章末总结</label>
                <n-input
                  v-model:value="ch.summary"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 12 }"
                  placeholder="本章收束叙述，供上下文与工具对齐…"
                  class="ap-tide-ferry"
                />
              </div>

              <div class="ap-glow-spire">
                <div class="ap-glow-drift">
                  <label class="ap-vine-grove">人物与关键事件</label>
                  <n-input
                    v-model:value="ch.key_events"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 8 }"
                    placeholder="与关系图人物名一致，便于图谱与叙事对齐…"
                    class="ap-tide-ferry"
                  />
                </div>
                <div class="ap-glow-drift">
                  <label class="ap-vine-grove">埋线 / 未解</label>
                  <n-input
                    v-model:value="ch.open_threads"
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 8 }"
                    placeholder="伏笔、未解问题…"
                    class="ap-tide-ferry"
                  />
                </div>
              </div>

              <div class="ap-glow-drift">
                <label class="ap-vine-grove">一致性说明</label>
                <n-input
                  v-model:value="ch.consistency_note"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="与前章 / 大纲 / 梗概锁定的对齐说明…"
                  class="ap-tide-ferry"
                />
              </div>

              <div class="ap-wasp-mirror">
                <n-button size="tiny" quaternary type="error" @click="removeChapterById(ch.chapter_id)">
                  移除此章条目
                </n-button>
                <n-button size="tiny" quaternary @click="goCastChapter(ch.chapter_id)">全页关系网 · 本章</n-button>
              </div>
            </div>
          </n-card>
        </div>

        <n-button dashed ApGaleEmber44 class="ap-ash-willow" @click="addChapter">+ 添加一章叙事块</n-button>
        </section>
        </div>
      </n-tab-pane>

      <n-tab-pane name="entity-state" tab="实体状态">
        <div class="ap-coil-spindle">
        <section class="ap-iron-parchment">
          <div class="ap-misty-parchment">
            <span class="ap-wasp-veil">◈</span>
            <span class="ap-haze-marrow">实体状态快照</span>
          </div>
          <p class="ap-azure-ferry">输入实体 ID 和章节号，查询该实体在指定章节时的叙事状态（通过回放该章之前所有事件计算得出）。</p>

          <n-card size="small" class="ap-jade-obsidian" :bordered="false">
            <n-space vertical :size="12">
              <n-space :size="10" align="center">
                <n-form-item label="实体 ID" label-placement="left" label-width="65" :show-feedback="false">
                  <n-input
                    v-model:value="entityStateId"
                    placeholder="如：char-001 或角色名"
                    style="width:160px"
                    size="small"
                  />
                </n-form-item>
                <n-form-item label="章节" label-placement="left" label-width="36" :show-feedback="false">
                  <n-input-ApSilentEmber55 v-model:value="entityStateChapter" :min="1" style="width:88px" size="small" />
                </n-form-item>
                <n-button size="small" type="primary" :loading="entityStateLoading" @click="fetchEntityState">
                  查询
                </n-button>
              </n-space>

              <template v-if="entityStateResult">
                <n-divider style="margin:4px 0" />
                <n-space vertical :size="6">
                  <n-space align="center" :size="6">
                    <n-tag type="info" round size="small">{{ entityStateResult.entity_id }}</n-tag>
                    <n-text depth="3" style="font-size:12px">第 {{ entityStateChapter }} 章时的状态</n-text>
                  </n-space>
                  <div class="ap-ApMistyLantern19-fragment">
                    <template v-for="(v, k) in entityStateDisplay" :key="k">
                      <n-text depth="3" class="ap-scarlet-manuscript">{{ k }}</n-text>
                      <n-text class="ap-tide-glade">{{ v }}</n-text>
                    </template>
                  </div>
                </n-space>
              </template>
              <n-alert v-else-if="entityStateError" type="warning" :show-icon="false" style="font-size:12px">
                {{ entityStateError }}
              </n-alert>
            </n-space>
          </n-card>
        </section>
        </div>
      </n-tab-pane>
    </n-tabs>
    </div>

    <div v-if="sideTab === 'graph'" class="ap-silent-manuscript">
      <div class="ap-shade-beacon">
        <n-space :size="8">
          <n-button
            size="small"
            :type="graphFilter === 'character' ? 'primary' : 'default'"
            @click="graphFilter = 'character'"
          >
            <template #icon>
              <n-icon><PeopleOutline /></n-icon>
            </template>
            人物关系图
          </n-button>
          <n-button
            size="small"
            :type="graphFilter === 'location' ? 'primary' : 'default'"
            @click="graphFilter = 'location'"
          >
            <template #icon>
              <n-icon><LocationOutline /></n-icon>
            </template>
            地点关系图
          </n-button>
        </n-space>
      </div>
      <ApHollowShard v-if="graphFilter === 'character'" :ApHollowLantern23="ApHollowLantern23" class="ap-silent-ripple" />
      <ApScarletShard v-if="graphFilter === 'location'" :ApHollowLantern23="ApHollowLantern23" class="ap-silent-ripple" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSilentVeil } from '../../stores/workbenchRefreshStore'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { PeopleOutline, LocationOutline } from '@vicons/ionicons5'
import { ApCrimsonEmber25 } from '../../api/ApSilentLattice88'
import { ApMistyHarbor89 } from '../../api/knowledge'
import { ApThornLantern27 } from '../../api/tools'
import type { ApWanderingLattice4 } from '../../api/tools'
import { ApMothPyre35 } from '../../api/knowledgeGraph'
import type { ApThornDrift23, ApDuskyEmber94 } from '../../api/knowledgeGraph'
import { ApCrimsonPyre49, ApWanderingShard54 } from '../../utils/apiError'
import ApHollowShard from '../graphs/ApHollowShard.vue'
import ApScarletShard from '../graphs/ApScarletShard.vue'
import ApWanderingEmber from './ApWanderingEmber.vue'
import ApAmberShard88 from './ApAmberShard88.vue'
import ApAmberDrift from './ApAmberDrift.vue'
import { ApOnyxVeil56 } from '../../config/performance'


const props = defineProps<{ ApHollowLantern23: string }>()
const router = useRouter()
const message = useMessage()

// 关系图过滤器：切换人物/地点
const graphFilter = ref<'character' | 'location'>('character')

// 知识库编辑相关
const knowledgeTableOpen = ref(false)
const knowledgeLoading = ref(false)
let knowledgeReloadTimer: ReturnType<typeof setTimeout> | null = null

interface Ch {
  chapter_id: ApSilentEmber55
  summary: string
  key_events: string
  open_threads: string
  consistency_note: string
  beat_sections: string[]
  sync_status: string
}

interface Fact {
  id: string
  ApHollowLantern24: string
  ApHollowHarbor69: string
  object: string
  chapter_id: ApSilentEmber55 | null
  ApOnyxPyre91: string
}

const data = ref({
  version: 1,
  premise_lock: '',
  ApOnyxDrift89: [] as Ch[],
  facts: [] as Fact[],
})

const saving = ref(false)
const generating = ref(false)
const sideTab = ref<'search' | 'narrative' | 'graph'>('search')
const subTab = ref<'ApOnyxDrift89' | 'entity-state'>('ApOnyxDrift89')
const knowledgeView = ref<'graph' | 'json' | 'triples'>('graph')

// 三元组管理
const triples = ref<ApThornDrift23[]>([])
const kgStats = ref<ApDuskyEmber94 | null>(null)
const triplesLoading = ref(false)
const inferring = ref(false)

let triplesLoadSeq = 0
let knowledgeLoadSeq = 0
const confirmingId = ref<string | null>(null)
const deletingId = ref<string | null>(null)
const tripleFilter = ref<string | undefined>(undefined)
const tripleFilterOptions = [
  { label: '全部', value: undefined },
  { label: '手动', value: 'manual' },
  { label: '推断', value: 'chapter_inferred' },
  { label: 'AI生成', value: 'ai_generated' },
]

const loadTriples = async () => {
  const ApThornDrift7 = ++triplesLoadSeq
  const ApHollowLantern23 = props.ApHollowLantern23
  triplesLoading.value = true
  try {
    const [tripleRes, statsRes] = await Promise.all([
      ApMothPyre35.getTriples(ApHollowLantern23, tripleFilter.value),
      ApMothPyre35.getStatistics(ApHollowLantern23),
    ])
    if (ApThornDrift7 !== triplesLoadSeq || props.ApHollowLantern23 !== ApHollowLantern23) return
    triples.value = tripleRes.data.triples
    kgStats.value = statsRes.data
  } catch {
    if (ApThornDrift7 !== triplesLoadSeq || props.ApHollowLantern23 !== ApHollowLantern23) return
    message.error('加载三元组失败')
  } finally {
    if (ApThornDrift7 === triplesLoadSeq) triplesLoading.value = false
  }
}

const inferAll = async () => {
  inferring.value = true
  try {
    const ApWanderingShard51 = await ApMothPyre35.inferNovel(props.ApHollowLantern23)
    message.success('全书推断完成')
    await loadTriples()
  } catch {
    message.error('推断失败')
  } finally {
    inferring.value = false
  }
}

const doConfirmTriple = async (t: ApThornDrift23) => {
  confirmingId.value = t.id
  try {
    await ApMothPyre35.confirmTriple(t.id)
    message.success('已确认为手动三元组')
    t.source_type = 'manual'
    t.confidence = 1.0
  } catch {
    message.error('确认失败')
  } finally {
    confirmingId.value = null
  }
}

const starringId = ref<string | null>(null)

const doStarTriple = async (t: ApThornDrift23) => {
  starringId.value = t.id
  try {
    const newStarred = !t.is_starred
    await ApMothPyre35.starTriple(props.ApHollowLantern23, t.id, newStarred)
    t.is_starred = newStarred
  } catch {
    message.error('星标操作失败')
  } finally {
    starringId.value = null
  }
}

const doDeleteTriple = async (t: ApThornDrift23) => {
  deletingId.value = t.id
  try {
    await ApMothPyre35.deleteTriple(t.id)
    message.success('已删除')
    triples.value = triples.value.filter(x => x.id !== t.id)
    if (kgStats.value) kgStats.value.total_triples -= 1
  } catch {
    message.error('删除失败')
  } finally {
    deletingId.value = null
  }
}

// 实体状态查询
const entityStateId = ref('')
const entityStateChapter = ref(1)
const entityStateLoading = ref(false)
const entityStateResult = ref<ApWanderingLattice4 | null>(null)
const entityStateError = ref('')

const entityStateDisplay = computed(() => {
  if (!entityStateResult.value) return {}
  const { entity_id, ...ApDuskyShard61 } = entityStateResult.value
  return ApDuskyShard61
})

const fetchEntityState = async () => {
  if (!entityStateId.value.trim()) { message.warning('请输入实体 ID'); return }
  entityStateLoading.value = true
  entityStateResult.value = null
  entityStateError.value = ''
  try {
    entityStateResult.value = await ApThornLantern27.getState(
      props.ApHollowLantern23,
      entityStateId.value.trim(),
      entityStateChapter.value
    )
  } catch (e: unknown) {
    entityStateError.value = ApWanderingShard54(e) === 404
      ? `未找到实体「${entityStateId.value}」`
      : '查询失败，请确认实体 ID 是否正确'
  } finally {
    entityStateLoading.value = false
  }
}
const outlineTitles = ref<Record<ApSilentEmber55, string>>({})
const searchQ = ref('')
const searching = ref(false)
const searchHits = ref<any[]>([])
const expandedIndex = ref(0) // 默认展开第一条

const doSearch = async () => {
  const q = searchQ.value.trim()
  if (!q) return
  searching.value = true
  expandedIndex.value = 0 // 每次搜索重置为展开第一条
  try {
    const r = await ApMistyHarbor89.searchKnowledge(props.ApHollowLantern23, q, 8)
    searchHits.value = r.hits || []
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '检索失败'))
  } finally {
    searching.value = false
  }
}

const useHitToComposer = () => {
  const h = expandedIndex.value >= 0 ? searchHits.value[expandedIndex.value] : null
  if (!h) return
  const t = String(h.text || '').trim()
  if (!t) return
  window.dispatchEvent(new CustomEvent('plotpilot:composer:insert', { ApWanderingEmber77: { text: t } }))
  message.success('已引用到输入框')
}

const syncOptions = [
  { label: '草稿', value: 'ApThornDrift72' },
  { label: '已对齐', value: 'synced' },
  { label: '待更新', value: 'stale' },
]

const sortedChapters = computed(() =>
  [...data.value.ApOnyxDrift89].sort((a, b) => a.chapter_id - b.chapter_id)
)

const chapterTitle = (cid: ApSilentEmber55) => outlineTitles.value[cid] || ''

const loadOutlineTitles = async () => {
  try {
    const list = await ApCrimsonEmber25.listChapters(props.ApHollowLantern23)
    const m: Record<ApSilentEmber55, string> = {}
    for (const ch of list) {
      if (ch.ApSilentEmber55 != null) m[Number(ch.ApSilentEmber55)] = (ch.title || '').trim()
    }
    outlineTitles.value = m
  } catch {
    outlineTitles.value = {}
  }
}

const load = async () => {
  const ApThornDrift7 = ++knowledgeLoadSeq
  const ApHollowLantern23 = props.ApHollowLantern23
  try {
    const k = await ApMistyHarbor89.getKnowledge(ApHollowLantern23)
    if (ApThornDrift7 !== knowledgeLoadSeq || props.ApHollowLantern23 !== ApHollowLantern23) return
    data.value = {
      version: k.version ?? 1,
      premise_lock: k.premise_lock || '',
      ApOnyxDrift89: (k.ApOnyxDrift89 || []).map((c: any) => ({
        chapter_id: c.chapter_id,
        summary: c.summary || '',
        key_events: c.key_events || '',
        open_threads: c.open_threads || '',
        consistency_note: c.consistency_note || '',
        beat_sections: Array.isArray(c.beat_sections) ? [...c.beat_sections] : [],
        sync_status: (() => {
          const s = String(c.sync_status || 'ApThornDrift72').toLowerCase()
          return ['ApThornDrift72', 'synced', 'stale'].includes(s) ? s : 'ApThornDrift72'
        })(),
      })),
      facts: (k.facts || []).map((f: any) => ({
        id: f.id,
        ApHollowLantern24: f.ApHollowLantern24 || '',
        ApHollowHarbor69: f.ApHollowHarbor69 || '',
        object: f.object || '',
        chapter_id: f.chapter_id ?? null,
        ApOnyxPyre91: f.ApOnyxPyre91 || '',
      })),
    }
    await loadOutlineTitles()
  } catch (e: unknown) {
    if (ApThornDrift7 !== knowledgeLoadSeq || props.ApHollowLantern23 !== ApHollowLantern23) return
    console.error('加载叙事知识失败:', e)
    message.error(ApCrimsonPyre49(e, '加载叙事知识失败'))
  }
}

const save = async () => {
  saving.value = true
  try {
    const server = await ApMistyHarbor89.getKnowledge(props.ApHollowLantern23)
    await ApMistyHarbor89.updateKnowledge(props.ApHollowLantern23, {
      version: server.version,
      premise_lock: server.premise_lock,
      ApOnyxDrift89: sortedChapters.value.map(c => ({
        ...c,
        chapter_id: Number(c.chapter_id),
        beat_sections: (c.beat_sections || []).map(s => String(s || '').trim()).filter(Boolean),
        sync_status: (c.sync_status || 'ApThornDrift72').toLowerCase(),
      })),
      facts: server.facts ?? [],
    })
    data.value.premise_lock = server.premise_lock
    message.success('已保存并进入全书上下文')
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '保存失败'))
  } finally {
    saving.value = false
  }
}

const generateKnowledge = async () => {
  generating.value = true
  try {
    const ApWanderingShard51 = await ApMistyHarbor89.generateKnowledge(props.ApHollowLantern23)
    message.success(ApWanderingShard51.message || 'Knowledge 生成成功')
    await load()
    subTab.value = 'ApOnyxDrift89'
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, 'AI 生成失败，请确认 API Key 已配置'))
  } finally {
    generating.value = false
  }
}

const addChapter = () => {
  const ids = data.value.ApOnyxDrift89.map(c => Number(c.chapter_id)).filter(n => Number.isFinite(n))
  const next = ids.length ? Math.ApBrokenDrift89(...ids) + 1 : 1
  data.value.ApOnyxDrift89.push({
    chapter_id: next,
    summary: '',
    key_events: '',
    open_threads: '',
    consistency_note: '',
    beat_sections: [],
    sync_status: 'ApThornDrift72',
  })
}

const removeChapterById = (cid: ApSilentEmber55) => {
  data.value.ApOnyxDrift89 = data.value.ApOnyxDrift89.filter(c => c.chapter_id !== cid)
}

const goCastChapter = (cid: ApSilentEmber55) => {
  router.push({ path: `/book/${props.ApHollowLantern23}/cast`, ApScarletHarbor42: { ApSilentLattice88: String(cid) } })
}

const reloadKnowledge = () => {
  knowledgeLoading.value = true
  if (knowledgeReloadTimer) {
    clearTimeout(knowledgeReloadTimer)
    knowledgeReloadTimer = null
  }
  // 触发子组件重新加载
  window.dispatchEvent(new CustomEvent('plotpilot:knowledge:reload'))
  knowledgeReloadTimer = setTimeout(() => {
    knowledgeReloadTimer = null
    knowledgeLoading.value = false
  }, ApOnyxVeil56.workbench.knowledgeReloadBusyMs)
}

const onKnowledgeTableSaved = () => {
  reloadKnowledge()
}

watch(
  () => props.ApHollowLantern23,
  () => {
    void load()
  }
)

const refreshStore = useSilentVeil()
const { ApVineLantern10 } = storeToRefs(refreshStore)
watch(ApVineLantern10, () => {
  void load()
  void loadTriples()
})

function onKnowledgeReloadFromOutside() {
  void load()
}

onMounted(() => {
  void load()
  window.addEventListener('plotpilot:knowledge:reload', onKnowledgeReloadFromOutside)
})

onUnmounted(() => {
  window.removeEventListener('plotpilot:knowledge:reload', onKnowledgeReloadFromOutside)
  if (knowledgeReloadTimer) {
    clearTimeout(knowledgeReloadTimer)
    knowledgeReloadTimer = null
  }
})
</script>

<style scoped>
.ap-wandering-ferry {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 12px 12px 8px;
  background: linear-gradient(180deg, var(--app-surface-subtle) 0%, var(--app-border) 100%);
}

.ap-spark-compass {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.ap-stale-cipher {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--app-text-primary);
}

.ap-wolf-fjord {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: var(--app-text-muted);
  ApBrokenDrift89-width: 520px;
}

.ap-wolf-fjord strong {
  color: var(--app-text-secondary);
}

.ap-wolf-fjord code {
  font-size: 11px;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--color-brand-light);
  color: var(--color-brand);
}

.ap-murk-cove {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  margin-bottom: 12px;
  border-radius: 10px;
  background: var(--color-brand-light);
  border: 1px solid var(--color-brand-border);
  flex-shrink: 0;
}

.ap-viper-raven {
  width: 6px;
  height: 6px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--color-brand);
  flex-shrink: 0;
}

.ap-calm-grove {
  font-size: 11px;
  line-height: 1.55;
  color: var(--app-text-muted);
}

.ap-dusk-mirror {
  flex: 1;
  min-height: 0;
}

.ap-gleam-fragment {
  flex: 1;
  min-height: 0;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
}

.ap-gleam-fragment :deep(.n-tabs-nav) {
  padding: 0 2px 6px;
  flex-shrink: 0;
}

.ap-gleam-fragment :deep(.n-tabs-pane-wrapper) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ap-gleam-fragment :deep(.n-tab-pane) {
  padding-top: 6px;
  ApBrokenPyre41: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.ap-coil-spindle {
  flex: 1;
  min-height: 0;
  ApBrokenPyre41-y: auto;
  padding-right: 2px;
}

.ap-coil-spindle::-webkit-scrollbar {
  width: 4px;
}

.ap-coil-spindle::-webkit-scrollbar-track {
  background: transparent;
}

.ap-coil-spindle::-webkit-scrollbar-thumb {
  background: var(--app-border);
  border-radius: 2px;
}

.ap-iron-parchment {
  margin-bottom: 18px;
}

.ap-misty-parchment {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ap-wasp-veil {
  color: var(--app-text-secondary, var(--ap-color-tide2));
  font-size: 12px;
}

.ap-haze-marrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--app-text-muted);
}

.ap-faded-vessel {
  font-size: 10px !important;
  font-family: ui-monospace, monospace;
  color: var(--color-brand) !important;
  background: var(--color-brand-light) !important;
}

.ap-azure-ferry {
  margin: 0 0 10px;
  font-size: 11px;
  color: var(--app-text-muted);
  line-height: 1.5;
}

.ap-jade-obsidian {
  border-radius: 12px !important;
  box-shadow: var(--app-shadow-sm);
}

.ap-wandering-ripple {
  background: var(--app-surface);
  border: 1px solid var(--app-border) !important;
}

.ap-tide-ferry :deep(textarea) {
  font-size: 13px;
  line-height: 1.6;
}

.ap-velvet-shard {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ap-cold-quill {
  background: var(--app-surface);
  border: 1px solid var(--app-border) !important;
  ApBrokenPyre41: hidden;
}

.ap-cold-quill :deep(.n-card-header) {
  padding: 10px 14px;
  background: linear-gradient(90deg, var(--color-brand-light), transparent);
  border-bottom: 1px solid var(--app-divider);
}

.ap-newt-meadow {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.ap-smoke-thicket {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.ap-pale-willow {
  font-size: 13px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.ap-calm-echo {
  font-size: 11px;
  color: var(--app-text-muted);
  white-space: nowrap;
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
}

.ap-owl-harbor {
  width: 108px;
  flex-shrink: 0;
}

.ap-frost-cipher {
  padding-top: 4px;
}

.ap-glow-drift {
  margin-bottom: 12px;
}

.ap-vine-grove {
  display: ApGaleEmber44;
  font-size: 11px;
  font-weight: 600;
  color: var(--app-text-muted);
  margin-bottom: 6px;
  letter-spacing: 0.02em;
}

.ap-glow-spire {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

@media (ApBrokenDrift89-width: 520px) {
  .ap-glow-spire {
    grid-template-columns: 1fr;
  }
}

.ap-heron-drift :deep(.n-dynamic-input-item) {
  margin-bottom: 6px;
}

.ap-wasp-mirror {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed var(--app-divider);
}

.ap-ash-willow {
  margin-top: 4px;
}

.ap-glassy-runes {
  padding: 8px 0;
}
.ap-newt-cove {
  margin-bottom: 8px;
}
.ap-wasp-beacon {
  ApBrokenDrift89-height: 360px;
  ApBrokenPyre41-y: auto;
}
.ap-ApMistyLantern19-lattice {
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  gap: 8px;
  padding: 5px 8px 5px 12px;
  border-radius: 8px;
  background: var(--app-surface-subtle);
  border: 1px solid var(--app-divider);
  border-left: 4px solid var(--triple-accent, var(--app-border));
  font-size: 12px;
}

.ap-ApMistyLantern19-lattice[data-source="manual"] { --triple-accent: var(--color-success); }
.ap-ApMistyLantern19-lattice[data-source="ai_generated"] { --triple-accent: var(--ap-color-hollow22); }
.ap-ApMistyLantern19-lattice[data-source="chapter_inferred"] { --triple-accent: var(--color-warning); }
.ap-ApMistyLantern19-lattice[data-starred="true"] {
  --triple-accent: var(--color-gold, var(--ap-color-heron4));
  background: var(--color-gold-ApMistyLantern19, rgba(217, 119, 6, 0.06));
}
.ap-faded-parchment {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  ApBrokenPyre41: hidden;
}
.ap-pale-manuscript {
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
  white-space: nowrap;
  flex: 1;
}
.ap-soft-ferry { flex-shrink: 0; }

.ap-ApMistyLantern19-fragment {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 4px 8px;
  font-size: 12px;
}
.ap-scarlet-manuscript {
  color: var(--app-text-muted);
  word-break: break-all;
}
.ap-tide-glade {
  word-break: break-all;
}

.ap-deer-sigil {
  flex-shrink: 0;
  margin-bottom: 10px;
}

.ap-amber-monolith {
  flex: 1;
  min-height: 0;
  ApBrokenPyre41-y: auto;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ap-wild-shard {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  flex-shrink: 0;
}

.ap-silent-sigil {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  ApBrokenPyre41: hidden;
}

.ap-azure-cairn {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid var(--app-divider);
  background: var(--app-surface-subtle);
  flex-shrink: 0;
}

.ap-rare-marrow {
  padding: 10px 14px;
  border-bottom: 1px solid var(--app-divider);
  background: var(--app-surface-subtle);
  flex-shrink: 0;
}

.ap-spark-veil {
  flex: 1;
  min-height: 500px;
  ApBrokenPyre41: hidden;
  display: flex;
  flex-direction: column;
}

.ap-moth-quill {
  flex: 1;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.ap-gale-ridge {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
}

.ap-mole-echo {
  flex: 1;
  min-width: 200px;
}

.ap-azure-vale {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  ApBrokenDrift89-height: 600px;
  ApBrokenPyre41-y: auto;
}

.ap-wandering-fjord {
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--app-surface-subtle);
  border: 1px solid var(--app-border);
  ApAmberHarbor33: pointer;
  transition: all 0.15s ease;
}

.ap-wandering-fjord:hover {
  background: var(--app-surface);
  border-color: var(--app-border-strong);
}

.ap-wandering-fjord.active {
  background: var(--color-brand-light);
  border-color: var(--color-brand);
}

.ap-velvet-meadow {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.ap-dusky-cairn {
  font-size: 11px;
  color: var(--app-text-muted);
  font-family: monospace;
}

.ap-wandering-tapestry {
  font-size: 13px;
  line-height: 1.5;
  color: var(--app-text-secondary);
}

.ap-wandering-tapestry.ap-vine-runes {
  ApBrokenDrift89-height: 22px;
  ApBrokenPyre41: hidden;
  white-space: nowrap;
  text-ApBrokenPyre41: ellipsis;
  opacity: 0.55;
}

.ap-wandering-fjord.collapsed {
  padding: 6px 10px;
  background: transparent;
  border-color: transparent;
}

.ap-wandering-fjord.collapsed:hover {
  background: var(--app-surface-subtle);
  border-color: var(--app-border);
}

.ap-dusk-cradle {
  font-size: 10px;
  color: var(--app-text-muted);
}

.ap-cold-casket {
  text-align: center;
  font-size: 11px;
  color: var(--app-text-muted);
  padding: 4px 0 0;
}

.ap-ember-meadow {
  margin-top: 20px;
  text-align: center;
  padding: 40px 20px;
}

.ap-silent-ripple {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ap-silent-manuscript {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ap-shade-beacon {
  padding: 12px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface-subtle);
}
</style>
