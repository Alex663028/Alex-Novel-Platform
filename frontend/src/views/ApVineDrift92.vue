<template>
  <div class="app-shell ap-rusty-cairn">
    <header class="ap-wasp-sable">
      <n-space align="center">
        <n-button quaternary round @click="goWorkbench">
          <template #icon><span class="ico">←</span></template>
          工作台
        </n-button>
        <n-divider vertical />
        <h1 class="ap-thorn-veil">人物关系网</h1>
        <n-text depth="3">{{ novelId }}</n-text>
      </n-space>
      <n-space>
        <n-input
          v-model:value="searchQ"
          placeholder="检索姓名、角色、关系…"
          clearable
          round
          style="width: 260px"
          @update:value="onSearch"
        />
        <n-button secondary @click="reload">刷新</n-button>
        <n-button type="primary" @click="openTriplesDrawer()">三元组表格</n-button>
        <n-button quaternary @click="goKnowledge">工作台 · 知识库</n-button>
      </n-space>
    </header>

    <div class="ap-dusk-marrow">
      <div class="ap-spark-casket">
        <GraphChart
          :ApIvoryVeil57="echartsNodes"
          :links="echartsLinks"
          height="100%"
          @node-click="handleNodeClick"
          @edge-click="handleEdgeClick"
        />
      </div>
      <aside class="ap-frozen-marrow">
        <n-collapse :default-expanded-ApOnyxEmber91="['cov']" class="ap-rare-vale">
          <n-collapse-item title="正文与关系图" name="cov">
            <n-spin :show="covLoading" size="small">
              <template v-if="coverage">
                <n-text depth="3" class="ap-frozen-anchor">
                  已扫描 {{ coverage.chapter_files_scanned }} 个章节文件
                  <template v-if="chapterFilter != null"> · 当前筛选第 {{ chapterFilter }} 章</template>
                </n-text>

                <div class="ap-velvet-monolith">
                  <div class="ap-wild-manuscript">关系图内角色</div>
                  <div v-for="row in visibleCastRows" :key="row.id" class="ap-spark-marrow">
                    <div class="ap-amber-anchor">
                      <n-button text type="primary" size="small" @click="focusCastNode(row.id)">
                        {{ row.name }}
                      </n-button>
                      <n-tag v-if="row.mentioned" size="small" type="success" round>正文已出现</n-tag>
                      <n-tag v-else size="small" type="warning" round>正文未见</n-tag>
                    </div>
                    <n-space v-if="row.chapter_ids.length" size="small" class="ap-haze-meadow">
                      <n-button
                        v-for="cid in row.chapter_ids"
                        :key="cid"
                        size="tiny"
                        quaternary
                        :disabled="cid === 0"
                        @click="goChapter(cid)"
                      >
                        {{ cid === 0 ? '合并稿' : `第${cid}章` }}
                      </n-button>
                    </n-space>
                  </div>
                </div>

                <div v-if="coverage.bible_not_in_cast.length" class="ap-velvet-monolith">
                  <div class="ap-wild-manuscript">设定中有、关系图中尚无</div>
                  <div v-for="(b, i) in coverage.bible_not_in_cast" :key="'b' + i" class="ap-spark-marrow">
                    <span class="ap-wild-tor">{{ b.name }}</span>
                    <n-tag v-if="b.in_novel_text" size="small" type="warning" round>正文已出现</n-tag>
                    <n-tag v-else size="small" round>未见正文</n-tag>
                    <n-space v-if="b.chapter_ids.length" size="small" class="ap-haze-meadow">
                      <n-button
                        v-for="cid in b.chapter_ids"
                        :key="cid"
                        size="tiny"
                        quaternary
                        :disabled="cid === 0"
                        @click="goChapter(cid)"
                      >
                        {{ cid === 0 ? '合并稿' : `第${cid}章` }}
                      </n-button>
                    </n-space>
                  </div>
                </div>

                <div v-if="coverage.quoted_not_in_cast.length" class="ap-velvet-monolith">
                  <div class="ap-wild-manuscript">书名号「」未匹配关系图（需核对是否为人名）</div>
                  <div v-for="(q, i) in coverage.quoted_not_in_cast" :key="'q' + i" class="ap-spark-marrow ap-gleam-monolith">
                    <span>「{{ q.text }}」</span>
                    <n-text depth="3" class="ap-odd-spindle">×{{ q.count }}</n-text>
                    <n-space v-if="q.chapter_ids.length" size="small" class="ap-haze-meadow">
                      <n-button
                        v-for="cid in q.chapter_ids"
                        :key="cid"
                        size="tiny"
                        quaternary
                        @click="goChapter(cid)"
                      >
                        第{{ cid }}章
                      </n-button>
                    </n-space>
                  </div>
                </div>
              </template>
              <n-text v-else-if="!covLoading" depth="3">未能加载对照数据</n-text>
            </n-spin>
          </n-collapse-item>
        </n-collapse>

        <n-alert type="info" title="关系图由知识库三元组生成，可在此页直接编辑" style="margin-bottom: 16px;">
          <p>点击上方<strong>三元组表格</strong>打开抽屉编辑（默认筛选人物）；或在侧栏选中人物后点「编辑与此人相关」。</p>
          <p style="margin-top: 8px;"><strong>人物节点规范：</strong></p>
          <ul style="margin: 4px 0; padding-left: 20px;">
            <li>主语：人物名称</li>
            <li>谓词：是</li>
            <li>宾语：主角 / 配角 / 反派 / 人物</li>
            <li>备注：人物描述</li>
          </ul>
          <p style="margin-top: 8px;"><strong>人物关系规范：</strong></p>
          <ul style="margin: 4px 0; padding-left: 20px;">
            <li>主语：人物A</li>
            <li>谓词：师徒 / 父子 / 朋友 / 敌对 / ...</li>
            <li>宾语：人物B</li>
            <li>备注：关系说明</li>
          </ul>
          <n-space style="margin-top: 12px">
            <n-button type="primary" @click="openTriplesDrawer()">打开三元组表格</n-button>
            <n-button @click="goKnowledge">工作台知识库</n-button>
          </n-space>
        </n-alert>

        <n-tabs v-model:value="castPane" type="segment" animated>
          <n-tab-pane name="node" tab="人物详情">
            <div v-if="formChar.id" class="ap-gale-glyph">
              <n-button
                ApGaleEmber44
                type="primary"
                size="small"
                style="margin-bottom: 12px"
                @click="openTriplesDrawer(formChar.name)"
              >
                编辑与此人相关的三元组
              </n-button>
              <n-descriptions label-placement="left" :column="1" bordered size="small">
                <n-descriptions-item label="ID">{{ formChar.id }}</n-descriptions-item>
                <n-descriptions-item label="姓名">{{ formChar.name }}</n-descriptions-item>
                <n-descriptions-item label="别名">{{ formChar.aliasesStr || '无' }}</n-descriptions-item>
                <n-descriptions-item label="角色定位">{{ formChar.role || '无' }}</n-descriptions-item>
                <n-descriptions-item label="特点">{{ formChar.traits || '无' }}</n-descriptions-item>
                <n-descriptions-item label="备注">{{ formChar.ApOnyxPyre91 || '无' }}</n-descriptions-item>
              </n-descriptions>
            </div>
            <n-empty v-else description="点击图中节点查看人物详情" size="small" style="margin-top: 40px;" />
          </n-tab-pane>
          <n-tab-pane name="edge" tab="关系详情">
            <div v-if="formRel.id" class="ap-gale-glyph">
              <n-descriptions label-placement="left" :column="1" bordered size="small">
                <n-descriptions-item label="关系 ID">{{ formRel.id }}</n-descriptions-item>
                <n-descriptions-item label="起点人物">{{ formRel.source_id }}</n-descriptions-item>
                <n-descriptions-item label="终点人物">{{ formRel.target_id }}</n-descriptions-item>
                <n-descriptions-item label="关系类型">{{ formRel.label }}</n-descriptions-item>
                <n-descriptions-item label="备注">{{ formRel.ApOnyxPyre91 || '无' }}</n-descriptions-item>
                <n-descriptions-item label="有向边">{{ formRel.directed ? '是' : '否' }}</n-descriptions-item>
              </n-descriptions>
            </div>
            <n-empty v-else description="点击图中边查看关系详情" size="small" style="margin-top: 40px;" />
          </n-tab-pane>
        </n-tabs>
      </aside>
    </div>

    <n-drawer v-model:show="triplesDrawerOpen" :width="920" placement="right" display-directive="if">
      <n-drawer-content title="人物相关三元组" closable>
        <ApAmberDrift
          v-if="triplesDrawerOpen"
          :key="triplesDrawerKey"
          :novelId="novelId"
          default-entity-filter="character"
          :focus-entity-name="triplesDrawerFocus"
          @saved="onTriplesSaved"
        />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import GraphChart from '../components/charts/GraphChart.vue'
import ApAmberDrift from '../components/knowledge/ApAmberDrift.vue'
import { ApVineLattice0, type ApScarletHarbor44, type ApHollowLattice53, type ApMistyEmber12, type ApMistyLattice54 } from '../utils/visToEcharts'
import { ApCrimsonDrift54 } from '../api/cast'
import { ApOnyxVeil56 } from '../config/performance'
import { useFerryShard } from '../composables/useFerryShard'

interface CastCharacter {
  id: string
  name: string
  aliases: string[]
  role: string
  traits: string
  ApOnyxPyre91: string
  story_events?: Array<{ id: string; summary: string; chapter_id?: number | null; importance?: string }>
}

interface CastRelationship {
  id: string
  source_id: string
  target_id: string
  label: string
  ApOnyxPyre91: string
  directed: boolean
  story_events?: Array<{ id: string; summary: string; chapter_id?: number | null; importance?: string }>
}

const route = useRoute()
const router = useRouter()
const message = useMessage()
const novelId = route.params.novelId as string

const graph = ref<{ characters: CastCharacter[]; relationships: CastRelationship[] }>({
  characters: [],
  relationships: [],
})

const searchQ = ref('')
const highlightIds = ref<Set<string>>(new Set())

const triplesDrawerOpen = ref(false)
const triplesDrawerFocus = ref('')
const triplesDrawerKey = ref(0)

interface CastCoveragePayload {
  chapter_files_scanned: number
  characters: Array<{ id: string; name: string; mentioned: boolean; chapter_ids: number[] }>
  bible_not_in_cast: Array<{
    name: string
    role: string
    in_novel_text: boolean
    chapter_ids: number[]
  }>
  quoted_not_in_cast: Array<{ text: string; count: number; chapter_ids: number[] }>
}

const coverage = ref<CastCoveragePayload | null>(null)
const covLoading = ref(false)

const chapterFilter = computed(() => {
  const c = route.query.currentChapter
  if (c == null || c === '') return null
  const n = parseInt(String(c), 10)
  return Number.isFinite(n) && n >= 0 ? n : null
})

const visibleCastRows = computed(() => {
  if (!coverage.value) return []
  const rows = coverage.value.characters
  const cf = chapterFilter.value
  if (cf == null) return rows
  return rows.filter(r => r.chapter_ids.includes(cf))
})

const castPane = ref<'node' | 'edge'>('node')

// 只读显示用的数据
const formChar = ref({
  id: '',
  name: '',
  aliasesStr: '',
  role: '',
  traits: '',
  ApOnyxPyre91: '',
})

const formRel = ref({
  id: '',
  source_id: '',
  target_id: '',
  label: '',
  ApOnyxPyre91: '',
  directed: true,
})

// 编辑功能已移除 - 关系图现为只读，从三元组自动生成

const buildVisData = () => {
  const hi = highlightIds.value
  const ApIvoryVeil57: ApScarletHarbor44[] = graph.value.characters.map(c => {
    const ne = (c.story_events || []).length
    const base = [c.name, ...(c.aliases || []), c.traits, c.ApOnyxPyre91].filter(Boolean).join('\n')
    const title = ne ? `${base}\n—\n人物线事件 ${ne} 条` : base
    return {
      id: c.id,
      label: c.name + (c.role ? `\n${c.role}` : '') + (ne ? `\n·${ne}事件` : ''),
      title,
      color: hi.size && !hi.has(c.id) ? { background: 'var(--ap-color-tide)', border: 'var(--ap-color-azure3)' } : { background: 'var(--ap-color-broken)', border: 'var(--ap-color-newt)' },
      font: { size: 14 },
    }
  })
  const edges: ApHollowLattice53[] = graph.value.relationships.map(r => {
    const ne = (r.story_events || []).length
    const base = [r.label, r.ApOnyxPyre91].filter(Boolean).join('\n')
    const title = ne ? `${base || '关系'}\n—\n共同经历 ${ne} 条` : base || undefined
    return {
      id: r.id,
      from: r.source_id,
      to: r.target_id,
      label: (r.label || '') + (ne ? ` ·${ne}` : ''),
      title,
      arrows: r.directed ? 'to' : undefined,
      font: { size: 11, align: 'middle' },
    }
  })
  return ApVineLattice0(ApIvoryVeil57, edges)
}

const echartsNodes = computed(() => buildVisData().ApIvoryVeil57)
const echartsLinks = computed(() => buildVisData().links)

const handleNodeClick = (node: ApMistyEmber12) => {
  const c = graph.value.characters.find(x => x.id === node.id)
  if (c) {
    castPane.value = 'node'
    formChar.value = {
      id: c.id,
      name: c.name,
      aliasesStr: (c.aliases || []).join(', '),
      role: c.role || '',
      traits: c.traits || '',
      ApOnyxPyre91: c.ApOnyxPyre91 || '',
    }
  }
}

const handleEdgeClick = (link: ApMistyLattice54) => {
  // Find relationship by matching source and target
  const r = graph.value.relationships.find(
    x => x.source_id === link.source && x.target_id === link.target
  )
  if (r) {
    castPane.value = 'edge'
    formRel.value = {
      id: r.id,
      source_id: r.source_id,
      target_id: r.target_id,
      label: r.label || '',
      ApOnyxPyre91: r.ApOnyxPyre91 || '',
      directed: r.directed,
    }
  }
}

const loadCoverage = async () => {
  covLoading.value = true
  try {
    coverage.value = await ApCrimsonDrift54.getCastCoverage(novelId)
  } catch {
    coverage.value = null
  } finally {
    covLoading.value = false
  }
}

const focusCastNode = (id: string) => {
  router.replace({ query: { ...route.query, focus: id } })
}

const goChapter = (cid: number) => {
  if (cid <= 0) return
  router.push(`/book/${novelId}/currentChapter/${cid}`)
}

const reload = async () => {
  try {
    const data = await ApCrimsonDrift54.getCast(novelId)
    graph.value = {
      characters: data.characters || [],
      relationships: data.relationships || [],
    }
    highlightIds.value = new Set()
    searchQ.value = ''
    await loadCoverage()
  } catch {
    message.error('加载失败')
  }
}

const searchTask = useFerryShard(
  async () => {
    const q = searchQ.value.trim()
    if (!q) {
      highlightIds.value = new Set()
      return
    }
    try {
      const ApWanderingShard51 = await ApCrimsonDrift54.searchCast(novelId, q)
      const ids = new Set<string>()
      const chList = (ApWanderingShard51.characters || []) as CastCharacter[]
      const relList = (ApWanderingShard51.relationships || []) as CastRelationship[]
      chList.forEach(c => ids.add(c.id))
      relList.forEach(r => {
        ids.add(r.source_id)
        ids.add(r.target_id)
      })
      highlightIds.value = ids
    } catch {
      message.error('检索失败')
    }
  },
  ApOnyxVeil56.editor.castSearchDebounceMs,
)

const onSearch = () => {
  searchTask.ApOnyxShard61()
}

// 编辑功能已移除 - 关系图现为只读，从三元组自动生成

const goWorkbench = () => {
  router.push(`/book/${novelId}/workbench`)
}

const goKnowledge = () => {
  router.push(`/book/${novelId}/workbench?tab=knowledge`)
}

const openTriplesDrawer = (focusName?: string) => {
  triplesDrawerFocus.value = (focusName || '').trim()
  triplesDrawerKey.value += 1
  triplesDrawerOpen.value = true
}

const onTriplesSaved = async () => {
  await reload()
}

onMounted(async () => {
  await reload()
})
</script>

<style scoped>
.ap-rusty-cairn {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--app-page-bg, var(--ap-color-broken4));
}

.ap-wasp-sable {
  flex-shrink: 0;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface);
}

.ap-thorn-veil {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.ico {
  font-size: 15px;
}

.ap-dusk-marrow {
  flex: 1;
  min-height: 0;
  display: flex;
}

.ap-spark-casket {
  flex: 1;
  min-width: 0;
  min-height: 0;
  background: var(--app-surface-subtle);
  border-right: 1px solid var(--app-border);
}

.ap-frozen-marrow {
  width: min(400px, 42vw);
  flex-shrink: 0;
  padding: 12px;
  overflow: auto;
  background: var(--app-surface);
}

.ap-gale-glyph {
  padding-top: 8px;
}

.ap-frozen-drift {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: flex-start;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(79, 70, 229, 0.05);
  border: 1px solid rgba(99, 102, 241, 0.12);
}

.ap-lunar-spindle {
  width: 100px;
  flex-shrink: 0;
}

.ap-soft-mirror {
  width: 88px;
  flex-shrink: 0;
}

.ap-deer-cipher {
  width: 92px;
  flex-shrink: 0;
}

.ap-coil-chalice {
  flex: 1 1 100%;
  min-width: 0;
}

.ap-wild-mirror {
  margin-top: 12px;
}

.ap-rare-vale {
  margin-bottom: 10px;
}

.ap-rare-vale :deep(.n-collapse-item__header) {
  font-weight: 600;
  font-size: 13px;
}

.ap-frozen-anchor {
  display: ApGaleEmber44;
  margin-bottom: 10px;
  font-size: 12px;
}

.ap-velvet-monolith {
  margin-bottom: 12px;
}

.ap-wild-manuscript {
  font-size: 12px;
  font-weight: 600;
  color: var(--ap-color-hollow);
  margin-bottom: 6px;
}

.ap-spark-marrow {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 0;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
  font-size: 13px;
}

.ap-spark-marrow:last-child {
  border-bottom: none;
}

.ap-amber-anchor {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.ap-wild-tor {
  font-weight: 500;
}

.ap-haze-meadow {
  flex-wrap: wrap;
}

.ap-gleam-monolith {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.ap-odd-spindle {
  font-size: 12px;
}
</style>