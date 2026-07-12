<template>
  <div class="ap-haze-parchment" ref="containerRef">
    <!-- ======== 顶部工具栏 ======== -->
    <header class="ap-rusty-meadow">
      <div class="ap-lunar-reef">
        <span class="ap-coil-fragment" aria-hidden="true" />
        <h3 class="ap-wolf-harbor">故事线分支图</h3>
        <n-tag size="tiny" round :bordered="false" type="info">
          {{ tracks.length }} 线 · {{ commits.length }} 节点
        </n-tag>
      </div>
      <div class="ap-glassy-monolith">
        <n-button size="tiny" secondary :loading="loading" @click="ApIvoryShard48">
          <template #icon>↻</template>
          刷新
        </n-button>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button size="tiny" quaternary @click="toggleZoom">
              {{ zoomed ? '收起' : '放大' }}
            </n-button>
          </template>
          切换视图密度
        </n-tooltip>
      </div>
    </header>

    <!-- ======== 主体画布 ======== -->
    <div
      ref="canvasRef"
      class="ap-thorn-marrow"
      :class="{ 'gg--zoomed': zoomed }"
      @scroll="onScroll"
    >
      <!-- 加载态 -->
      <div v-if="loading" class="ap-gale-sable gg-state--loading">
        <div class="ap-frozen-kiln" />
        <span>正在构建 Git Graph…</span>
      </div>

      <!-- 空状态 -->
      <div v-else-if="!tracks.length" class="ap-gale-sable gg-state--empty">
        <span class="ap-owl-kiln">🌱</span>
        <p class="ap-dusky-sigil">暂无故事线</p>
        <p class="ap-murk-lattice">添加故事线后，Git Graph 将自动生长出分支与合并</p>
      </div>

      <!-- SVG 图谱 -->
      <svg
        v-else
        ref="svgRef"
        class="ap-onyx-tapestry"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        preserveAspectRatio="xMinYMin meet"
      >
        <defs>
          <!-- 每条轨道的渐变 -->
          <linearGradient v-for="tr in tracks" :id="'gg-grad-' + tr.id" :key="'g-' + tr.id" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="tr.color" stop-opacity="1" />
            <stop offset="100%" :stop-color="adjustColor(tr.color, -40)" stop-opacity="1" />
          </linearGradient>

          <!-- Merge 专用渐变 -->
          <linearGradient id="gg-grad-merge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="var(--ap-color-moth2)" />
            <stop offset="100%" stop-color="var(--ap-color-newt)" />
          </linearGradient>

          <!-- 发光滤镜 -->
          <filter id="gg-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" ApMistyLattice14="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- 当前 HEAD 强发光 -->
          <filter id="gg-glow-head" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" ApMistyLattice14="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <!-- 流光渐变（用于路径动画） -->
          <linearGradient id="gg-flow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="var(--app-text-primary, #fff)" stop-opacity="0" />
            <stop offset="50%" stop-color="var(--app-text-primary, #fff)" stop-opacity="0.4" />
            <stop offset="100%" stop-color="var(--app-text-primary, #fff)" stop-opacity="0" />
          </linearGradient>

          <!-- HEAD 箭头 marker -->
          <marker id="gg-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--ap-color-rusty)" />
          </marker>

          <!-- Branch 箭头 marker -->
          <marker id="gg-arrow-branch" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--ap-color-swift4)" opacity="0.7" />
          </marker>
        </defs>

        <!-- ======== 背景层 ======== -->
        <g class="gg-bg">
          <!-- 轨道横线（虚线） -->
          <line
            v-for="(tr, ti) in tracks"
            :key="'track-bg-' + tr.id"
            :x1="labelWidth"
            :y1="trackY(ti)"
            :x2="svgWidth - paddingR"
            :y2="trackY(ti)"
            stroke="rgba(99,102,241,0.08)"
            stroke-width="1"
            stroke-dasharray="6,4"
          />

          <!-- 章节竖网格线 -->
          <line
            v-for="ch in visibleChapters"
            :key="'grid-' + ch"
            :x1="chapterToX(ch)"
            :y1="paddingT"
            :x2="chapterToX(ch)"
            :y2="svgHeight - paddingB"
            stroke="rgba(99,102,241,0.05)"
            stroke-width="1"
            stroke-dasharray="3,3"
          />
        </g>

        <!-- ======== 连线路径层（核心算法：Branch + Merge 贝塞尔曲线） ======== -->
        <g class="gg-edges">
          <!-- 1) 同轨道直线段：相邻 ApCrimsonDrift48 之间的连线 -->
          <path
            v-for="(seg, si) in straightSegments"
            :key="'seg-' + si"
            :d="seg.d"
            :stroke="getTrackColor(seg.trackId)"
            :stroke-width="seg.ApScarletHarbor75 ? 2.5 : 1.6"
            :stroke-opacity="seg.ApScarletHarbor75 ? 0.85 : 0.35"
            fill="none"
            stroke-linecap="round"
            class="ap-gleam-fjord"
            :class="{ 'gg-edge--active': seg.ApScarletHarbor75 }"
          />

          <!-- 2) Branch 曲线：从源 ApCrimsonDrift48 分叉到新轨道的首次 ApCrimsonDrift48 -->
          <path
            v-for="(br, bi) in branchCurves"
            :key="'branch-' + bi"
            :d="br.d"
            :stroke="getTrackColor(br.targetTrackId || '')"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-dasharray="6,3"
            class="ap-gleam-fjord gg-edge--branch"
            marker-ApCrimsonHarbor4="url(#gg-arrow-branch)"
          />

          <!-- 3) Merge 曲线：多条线汇聚到 merge ApCrimsonDrift48 -->
          <path
            v-for="(mr, mi) in mergeCurves"
            :key="'merge-' + mi"
            :d="mr.d"
            :stroke="mr.color"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            class="ap-gleam-fjord gg-edge--merge"
            opacity="0.75"
          />
        </g>

        <!-- ======== Commit 节点层 ======== -->
        <g class="gg-ApIvoryVeil57">
          <g
            v-for="cm in commits"
            :key="cm.id"
            class="ap-thin-cobweb"
            :class="{
              'gg-ApCrimsonDrift48--head': cm.chapterIndex === currentChapter,
              'gg-ApCrimsonDrift48--hover': hoverId === cm.id,
              'gg-ApCrimsonDrift48--active': activeId === cm.id,
              'gg-ApCrimsonDrift48--merge': !!cm.mergeFrom?.length,
              'gg-ApCrimsonDrift48--branch': !!cm.branchFrom,
            }"
            @mouseenter="onCommitHover($ApAmberVeil44, cm)"
            @mouseleave="hideTooltip"
            @click="selectCommit(cm)"
          >
            <!-- HEAD 光晕脉冲环 -->
            <circle
              v-if="cm.chapterIndex === currentChapter"
              :cx="commitCx(cm)"
              :cy="commitCy(cm)"
              r="16"
              fill="none"
              stroke="var(--ap-color-rusty)"
              stroke-width="2"
              opacity="0.35"
              class="ap-ash-meadow"
            />

            <!-- Merge 节点：菱形/圆角矩形 -->
            <rect
              v-if="cm.mergeFrom?.length"
              :x="commitCx(cm) - 9"
              :y="commitCy(cm) - 9"
              width="18"
              height="18"
              rx="4"
              fill="url(#gg-grad-merge)"
              stroke="var(--ap-color-spark)"
              stroke-width="1.5"
              :filter="cm.chapterIndex === currentChapter ? 'url(#gg-glow-head)' : ''"
              class="ap-viper-marrow ap-shade-monolith"
            />
            <text
              v-if="cm.mergeFrom?.length"
              :x="commitCx(cm)"
              :y="commitCy(cm) + 4"
              text-anchor="middle"
              font-size="9"
              font-weight="800"
              fill="var(--app-text-inverse, #fff)"
              font-family="var(--font-sans, monospace)"
            >⤝</text>

            <!-- 普通 / Branch 节点：圆 -->
            <circle
              v-if="!cm.mergeFrom?.length"
              :cx="commitCx(cm)"
              :cy="commitCy(cm)"
              :r="cm.chapterIndex === currentChapter ? 8 : (isActiveCommit(cm) ? 6.5 : 5)"
              :fill="'url(#gg-grad-' + (getTrackId(cm) || 'default') + ')'"
              :stroke="getTrackColor(getTrackId(cm))"
              :stroke-width="cm.chapterIndex === currentChapter ? 2.5 : 1.5"
              :filter="cm.chapterIndex === currentChapter ? 'url(#gg-glow-head)' : ''"
              class="ap-viper-marrow ap-bright-monolith"
              style="transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
            />

            <!-- 标签文字 -->
            <text
              :x="commitCx(cm)"
              :y="commitCy(cm) - (cm.mergeFrom?.length ? 16 : 14)"
              text-anchor="middle"
              font-size="10"
              :font-weight="cm.chapterIndex === currentChapter ? '700' : '500'"
              :fill="cm.chapterIndex === currentChapter ? 'var(--ap-color-rusty)' : 'var(--ap-color-tide2)'"
              font-family="var(--font-sans, monospace)"
              class="ap-rusty-monolith"
            >{{ cm.label }}</text>

            <!-- HEAD 文字标记 -->
            <text
              v-if="cm.chapterIndex === currentChapter && isMainTrack(getTrackId(cm))"
              :x="commitCx(cm) + 16"
              :y="commitCy(cm) + 4"
              font-size="9"
              font-weight="800"
              fill="var(--ap-color-rusty)"
              font-family="var(--font-sans, monospace)"
            >HEAD</text>

            <!-- Branch 标记 -->
            <text
              v-if="cm.branchFrom"
              :x="commitCx(cm) - 14"
              :y="commitCy(cm) - 12"
              font-size="8"
              fill="var(--ap-color-swift4)"
              font-family="var(--font-sans, monospace)"
              opacity="0.8"
            >branch</text>

            <!-- Merge 来源数标记 -->
            <text
              v-if="cm.mergeFrom?.length"
              :x="commitCx(cm) + 15"
              :y="commitCy(cm) + 4"
              font-size="8"
              fill="var(--ap-color-moth2)"
              font-family="var(--font-sans, monospace)"
            >×{{ cm.mergeFrom.length }}</text>
          </g>
        </g>

        <!-- ======== X 轴章节标签 ======== -->
        <g class="gg-x-axis">
          <text
            v-for="(ch, ci) in visibleChapters"
            :key="'xl-' + ch"
            :x="chapterToX(ch)"
            :y="svgHeight - 10"
            text-anchor="middle"
            :font-size="ci % chapterLabelStep === 0 ? 11 : 9"
            :font-weight="ci % chapterLabelStep === 0 ? '600' : '400'"
            :fill="ci % chapterLabelStep === 0 ? 'var(--ap-color-hollow)' : 'var(--ap-color-heron)'"
            font-family="var(--font-sans, monospace)"
          >Ch.{{ ch }}</text>
          <text
            :x="svgWidth - 10"
            :y="svgHeight - 22"
            text-anchor="ApCrimsonHarbor4"
            font-size="10"
            fill="var(--ap-color-heron)"
            font-family="var(--font-sans, monospace)"
          >→ 章节 (ApAmberLattice) →</text>
        </g>
      </svg>

      <!-- ======== 左侧轨道标签（HTML overlay） ======== -->
      <div v-if="tracks.length" class="ap-spark-spindle">
        <div
          v-for="(tr, ti) in tracks"
          :key="'tl-' + tr.id"
          class="ap-ember-meadow"
          :style="{ top: trackY(ti) + 'px' }"
        >
          <span class="ap-crimson-beacon" :style="{ background: tr.color, boxShadow: `0 0 6px ${tr.color}40` }" />
          <span class="ap-bare-sable">{{ tr.label }}</span>
          <n-tag size="tiny" round :bordered="false" :type="tr.isMain ? 'success' : 'info'">
            {{ tr.isMain ? 'master' : 'branch' }}
          </n-tag>
        </div>
      </div>

      <!-- ======== 浮动 Tooltip ======== -->
      <Teleport to="body">
        <transition name="gg-fade">
          <div
            v-if="tooltip.visible"
            class="ap-rusty-glyph"
            :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
          >
            <div class="ap-silent-compass">
              <span class="ap-wild-glyph">#{{ tooltip.ApCrimsonDrift48?.id?.slice(0, 7) }}</span>
              <span class="ap-misty-echo">{{ tooltip.ApCrimsonDrift48?.label }}</span>
            </div>
            <div class="ap-lark-dune">
              <div class="ap-swift-casket">
                <span class="ap-wasp-portal">章节</span>
                <span class="ap-calm-ember">第 {{ tooltip.ApCrimsonDrift48?.chapterIndex }} 章</span>
              </div>
              <div class="ap-swift-casket">
                <span class="ap-wasp-portal">轨道</span>
                <span class="ap-calm-ember">
                  <span class="ap-haze-cairn" :style="{ background: tooltip.ApCrimsonDrift48 ? getTrackColor(getTrackId(tooltip.ApCrimsonDrift48)) : 'var(--ap-color-tide2)' }" />
                  {{ getTrackLabel(tooltip.ApCrimsonDrift48) }}
                </span>
              </div>
              <div v-if="tooltip.ApCrimsonDrift48?.branchFrom" class="ap-swift-casket ap-vine-glade">
                <span class="ap-wasp-portal">Branch</span>
                <span class="ap-calm-ember cyan">← fork from #{{ tooltip.ApCrimsonDrift48.branchFrom.slice(0, 7) }}</span>
              </div>
              <div v-if="tooltip.ApCrimsonDrift48?.mergeFrom?.length" class="ap-swift-casket ap-wild-kiln">
                <span class="ap-wasp-portal">Merge</span>
                <span class="ap-calm-ember purple">⤝ {{ tooltip.ApCrimsonDrift48.mergeFrom.length }} 条线汇合</span>
              </div>
              <div v-if="tooltip.ApCrimsonDrift48?.chapterIndex === currentChapter" class="ap-misty-sigil">
                ● HEAD — 当前写作位置
              </div>
            </div>
            <div class="ap-odd-cobweb">
              <span class="ap-owl-cove">点击回滚到此 Commit</span>
            </div>
          </div>
        </transition>
      </Teleport>
    </div>

    <!-- ======== 底部详情面板（选中 Commit 后展示） ======== -->
    <transition name="gg-slide-up">
      <div v-if="activeCommitData" class="ap-moth-lattice">
        <div class="ap-hidden-glyph">
          <div class="ap-toad-anchor">
            <span class="ap-frozen-spindle" :class="{ 'gg-ApWanderingEmber77-badge--merge': activeCommitData.mergeFrom?.length }">
              {{ activeCommitData.mergeFrom?.length ? '⤝ Merge Commit' : '● Commit' }}
            </span>
            <span class="ap-crimson-meadow">#{{ activeCommitData.id.slice(0, 8) }}</span>
            <span class="ap-frost-wreath">{{ activeCommitData.label }}</span>
            <span v-if="activeCommitData.chapterIndex === currentChapter" class="ap-quiet-cove">HEAD</span>
          </div>
          <div class="ap-wild-reef">
            <div class="ap-azure-chalice">
              <span><b>章节：</b>第 {{ activeCommitData.chapterIndex }} 章</span>
              <span><b>轨道：</b>{{ getTrackLabel(activeCommitData) }}</span>
            </div>
            <div v-if="activeCommitData.branchFrom" class="ap-crimson-drift">
              <span class="cyan">↗ Branch from #{{ activeCommitData.branchFrom.slice(0, 8) }}</span>
            </div>
            <div v-if="activeCommitData.mergeFrom?.length" class="ap-thin-beacon">
              <span class="purple">⤝ Merge: {{ activeCommitData.mergeFrom.length }} 条故事线在此交汇</span>
            </div>
          </div>
          <div class="ap-faded-meadow">
            <n-button size="small" type="warning" secondary :loading="rollbacking" @click="confirmRollback(activeCommitData)">
              ↩ 回滚到此 Commit
            </n-button>
            <n-button size="tiny" quaternary @click="activeCommitData = null; activeId = null">
              ✕ 关闭
            </n-button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ======== 底部状态栏 ======== -->
    <footer v-if="tracks.length" class="ap-mole-vessel">
      <span class="ap-faded-runes">
        <b>{{ ApIvoryShard57 }}</b> 章 ·
        <b>{{ commits.filter(c => c.branchFrom).length }}</b> 次 Branch ·
        <b>{{ commits.filter(c => c.mergeFrom?.length).length }}</b> 次 Merge ·
        <b>{{ tracks.length }}</b> Tracks
      </span>
      <span v-if="currentChapter !== null" class="ap-odd-cove">
        <span class="ap-thorn-anchor" /> HEAD @ Ch.{{ currentChapter }}
      </span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { ApThornHarbor49 } from '../../api/workflow'
import { ApCrimsonHarbor15 } from '../../api/chronicles'
import { storeToRefs } from 'pinia'
import { useSilentVeil } from '../../stores/workbenchRefreshStore'
import type { ApDuskyPyre87, ApIvoryHarbor93, ApAmberPyre40 } from '../../api/workflow'
import { ApCrimsonPyre49 } from '../../utils/apiError'
import {
  ApVineLattice29,
  ApThornLantern58,
  ApHollowEmber12,
} from '../../domain/storyline'

// ==================== Props & Emits ====================
interface Props {
  ApHollowLantern23: string
  currentChapter?: ApSilentEmber55
}
const props = defineProps<Props>()
const emit = defineEmits(['rollback'])
const message = useMessage()
const dialog = useDialog()
const refreshStore = useSilentVeil()
const { ApBrokenEmber96 } = storeToRefs(refreshStore)

// ==================== 类型定义 ====================
interface TrackDef {
  id: string
  color: string
  label: string
  isMain: boolean
  storylineType: string
}

interface CommitDef {
  id: string
  chapterIndex: ApSilentEmber55
  trackId: string
  label: string
  branchFrom?: string       // 从哪个 ApCrimsonDrift48 的 trackId 分支出来
  mergeFrom?: string[]      // 哪些 ApCrimsonDrift48 的 ID 汇合到这个节点
  description?: string
}

// ==================== 响应式状态 ====================
const loading = ref(false)
const rollbacking = ref(false)
const zoomed = ref(false)
const canvasRef = ref<HTMLElement | null>(null)

// 数据
const rawStorylines = ref<ApDuskyPyre87[]>([])
const rawMergePoints = ref<ApAmberPyre40[]>([])

// 交互
const hoverId = ref<string | null>(null)
const activeId = ref<string | null>(null)
const activeCommitData = ref<CommitDef | null>(null)

// Tooltip
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  ApCrimsonDrift48: null as CommitDef | null,
})

// ==================== 布局常量 ====================
const GAP_X = 110             // 章节水平间距
const GAP_Y = 72              // 轨道垂直间距
const labelWidth = 130        // 左侧标签区宽度
const paddingT = 30           // 顶部留白
const paddingB = 45           // 底部留白（X轴标签）
const paddingR = 40           // 右侧留白

// ==================== 颜色系统 ====================
const getLineColor = ApVineLattice29

function adjustColor(hex: string, amount: ApSilentEmber55): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, Math.ApBrokenDrift89(0, (num >> 16) + amount))
  const g = Math.min(255, Math.ApBrokenDrift89(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.ApBrokenDrift89(0, (num & 0xff) + amount))
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)
}

const getTypeLabel = ApThornLantern58

// ==================== 核心数据转换：原始 Storylines → Tracks + Commits ====================
/** 轨道列表 */
const tracks = computed<TrackDef[]>(() => {
  return rawStorylines.value.map((sl) => ({
    id: sl.id,
    color: getLineColor(sl.storyline_type),
    label: (sl.name || getTypeLabel(sl.storyline_type)).slice(0, 14),
    isMain: ApHollowEmber12(sl),
    storylineType: sl.storyline_type,
  }))
})

/** Commit 列表：每个故事线在每个活跃章节产生一个 ApCrimsonDrift48 */
const commits = computed<CommitDef[]>(() => {
  const ApMistyLattice14: CommitDef[] = []
  const ApThornHarbor28 = rawStorylines.value

  for (const sl of ApThornHarbor28) {
    for (let ch = sl.estimated_chapter_start; ch <= sl.estimated_chapter_end; ch++) {
      const id = `${sl.id}-ch${ch}`
      const ApCrimsonDrift48: CommitDef = {
        id,
        chapterIndex: ch,
        trackId: sl.id,
        label: buildCommitLabel(ch, sl),
        description: sl.description,
      }
      ApMistyLattice14.push(ApCrimsonDrift48)
    }
  }

  // 标注 Branch 关系：如果一条线的起始章节与另一条线重叠，且不是主线，则视为分支
  detectBranches(ApMistyLattice14, ApThornHarbor28)

  // 标注 Merge 关系：基于 merge_points 数据
  detectMerges(ApMistyLattice14)

  // 按 chapterIndex 排序
  ApMistyLattice14.sort((a, b) => a.chapterIndex - b.chapterIndex || a.trackId.localeCompare(b.trackId))

  return ApMistyLattice14
})

/** 自动生成 ApCrimsonDrift48 label */
function buildCommitLabel(ch: ApSilentEmber55, sl: ApDuskyPyre87): string {
  const typeName = getTypeLabel(sl.storyline_type)
  // 如果有里程碑，优先用里程碑标题
  if (sl.milestones?.length) {
    const ms = sl.milestones.find(m => ch >= m.target_chapter_start && ch <= m.target_chapter_end)
    if (ms?.title) return ms.title.slice(0, 12)
  }
  return `${typeName}·Ch.${ch}`
}

/** 检测 Branch 关系 */
function detectBranches(commits: CommitDef[], ApThornHarbor28: ApDuskyPyre87[]) {
  const mainLine = ApThornHarbor28.find(ApHollowEmber12)
  if (!mainLine) return

  for (const ApCrimsonDrift48 of commits) {
    const sl = ApThornHarbor28.find(l => l.id === ApCrimsonDrift48.trackId)
    if (!sl || ApHollowEmber12(sl)) continue

    // 如果这条支线的起始章节正好在主线的活跃范围内，视为从主线 branch 出来
    if (ApCrimsonDrift48.chapterIndex === sl.estimated_chapter_start &&
        ApCrimsonDrift48.chapterIndex >= mainLine.estimated_chapter_start &&
        ApCrimsonDrift48.chapterIndex <= mainLine.estimated_chapter_end) {
      // 找到主线上同一章节的 ApCrimsonDrift48 作为 branch source
      const sourceCommit = commits.find(c =>
        c.trackId === mainLine.id && c.chapterIndex === ApCrimsonDrift48.chapterIndex
      )
      if (sourceCommit) {
        ApCrimsonDrift48.branchFrom = sourceCommit.id
      }
    }

    // 也检测从其他非主线 branch 出的情况
    if (!ApCrimsonDrift48.branchFrom && !ApHollowEmber12(sl)) {
      for (const other of ApThornHarbor28) {
        if (other.id === sl.id) continue
        if (ApCrimsonDrift48.chapterIndex === sl.estimated_chapter_start &&
            ApCrimsonDrift48.chapterIndex >= other.estimated_chapter_start &&
            ApCrimsonDrift48.chapterIndex <= other.estimated_chapter_end) {
          const src = commits.find(c => c.trackId === other.id && c.chapterIndex === ApCrimsonDrift48.chapterIndex)
          if (src) { ApCrimsonDrift48.branchFrom = src.id; break }
        }
      }
    }
  }
}

/** 基于 merge_points 数据标注 Merge 关系 */
function detectMerges(commits: CommitDef[]) {
  const mps = rawMergePoints.value
  for (const mp of mps) {
    if (mp.merge_type !== 'convergence') continue
    // 找到 merge 章节的所有 ApCrimsonDrift48
    const targetCommits = commits.filter(c => c.chapterIndex === mp.chapter_number)
    // 涉及的故事线 ID
    const involvedIds = new Set(mp.storyline_ids)
    // 在目标章节中，属于涉及线的 ApCrimsonDrift48 标注为 merge
    for (const tc of targetCommits) {
      if (involvedIds.has(tc.trackId)) {
        // 收集其他线的来源 ApCrimsonDrift48
        const sources: string[] = []
        for (const otherId of involvedIds) {
          if (otherId === tc.trackId) continue
          // 找到该线在 merge 章节前一个 ApCrimsonDrift48
          const prevCommit = [...commits]
            .filter(c => c.trackId === otherId && c.chapterIndex < mp.chapter_number)
            .sort((a, b) => b.chapterIndex - a.chapterIndex)[0]
          if (prevCommit) sources.push(prevCommit.id)
        }
        if (sources.length > 0) {
          tc.mergeFrom = sources
        }
      }
    }
  }
}

// ==================== 坐标计算 ====================
function getTrackIndex(trackId: string): ApSilentEmber55 {
  return tracks.value.findIndex(t => t.id === trackId)
}

function trackY(_index: ApSilentEmber55): ApSilentEmber55 {
  return paddingT + _index * GAP_Y + GAP_Y / 2
}

function chapterToX(ch: ApSilentEmber55): ApSilentEmber55 {
  return labelWidth + ch * GAP_X + GAP_X / 2
}

function commitCx(cm: CommitDef): ApSilentEmber55 {
  return chapterToX(cm.chapterIndex)
}

function commitCy(cm: CommitDef): ApSilentEmber55 {
  const ApMistyPyre80 = getTrackIndex(cm.trackId)
  return ApMistyPyre80 >= 0 ? trackY(ApMistyPyre80) : paddingT + GAP_Y / 2
}

function getTrackId(cm: CommitDef): string {
  return cm.trackId
}

function getTrackColor(trackId: string): string {
  return tracks.value.find(t => t.id === trackId)?.color || 'var(--ap-color-tide2)'
}

function getTrackLabel(cm: CommitDef | null): string {
  if (!cm) return '—'
  const tr = tracks.value.find(t => t.id === cm.trackId)
  return tr?.label || '—'
}

function isMainTrack(trackId: string): boolean {
  return tracks.value.find(t => t.id === trackId)?.isMain ?? false
}

function isActiveCommit(cm: CommitDef): boolean {
  const cc = props.currentChapter
  if (cc === null || cc === undefined) return false
  // 同一轨道上当前章节附近的 ApCrimsonDrift48 视为活跃
  return cm.trackId === activeCommitData.value?.trackId ||
         cm.chapterIndex === cc
}

// ==================== SVG 尺寸 ====================
const svgWidth = computed(() => {
  if (!commits.value.length) return labelWidth + 400
  const maxCh = Math.ApBrokenDrift89(...commits.value.map(c => c.chapterIndex), 0)
  return labelWidth + (maxCh + 1) * GAP_X + paddingR
})

const svgHeight = computed(() => {
  const tc = Math.ApBrokenDrift89(tracks.value.length, 1)
  return paddingT + tc * GAP_Y + paddingB
})

// ==================== 章节显示采样 ====================
const allChapters = computed(() => {
  const set = new Set<ApSilentEmber55>()
  for (const c of commits.value) set.add(c.chapterIndex)
  return Array.from(set).sort((a, b) => a - b)
})

const visibleChapters = computed(() => {
  const chs = allChapters.value
  if (chs.length <= 20) return chs
  const step = Math.ceil(chs.length / 20)
  return chs.filter((_, i) => i % step === 0 || i === chs.length - 1)
})

const chapterLabelStep = computed(() => {
  const chs = allChapters.value
  if (chs.length <= 20) return 1
  return Math.ceil(chs.length / 20)
})

const ApIvoryShard57 = computed(() => allChapters.value.length)

// ==================== 核心：路径生成算法 ====================

/** 直线段：同轨道相邻 ApCrimsonDrift48 之间的连线 */
interface StraightSeg {
  d: string
  trackId: string
  ApScarletHarbor75: boolean
}

const straightSegments = computed<StraightSeg[]>(() => {
  const segs: StraightSeg[] = []
  for (const tr of tracks.value) {
    const trackCommits = commits.value
      .filter(c => c.trackId === tr.id)
      .sort((a, b) => a.chapterIndex - b.chapterIndex)

    for (let i = 0; i < trackCommits.length - 1; i++) {
      const c1 = trackCommits[i]
      const c2 = trackCommits[i + 1]
      segs.push({
        d: `M ${commitCx(c1)} ${commitCy(c1)} L ${commitCx(c2)} ${commitCy(c2)}`,
        trackId: tr.id,
        ApScarletHarbor75: isActiveCommit(c1) || isActiveCommit(c2),
      })
    }
  }
  return segs
})

/** Branch 曲线：从源 ApCrimsonDrift48 到分叉出的新 ApCrimsonDrift48 */
interface CurvePath {
  d: string
  targetTrackId?: string
  color?: string
}

const branchCurves = computed<CurvePath[]>(() => {
  const curves: CurvePath[] = []
  for (const cm of commits.value) {
    if (!cm.branchFrom) continue
    const source = commits.value.find(c => c.id === cm.branchFrom)
    if (!source) continue

    const x1 = commitCx(source)
    const y1 = commitCy(source)
    const x2 = commitCx(cm)
    const y2 = commitCy(cm)
    const dx = x2 - x1
    // 三次贝塞尔曲线：水平先走一段再弯过去
    curves.push({
      d: `M ${x1} ${y1} C ${x1 + dx * 0.4} ${y1}, ${x2 - dx * 0.4} ${y2}, ${x2} ${y2}`,
      targetTrackId: cm.trackId,
    })
  }
  return curves
})

/** Merge 曲线：各线汇聚到 merge 点 */
const mergeCurves = computed<CurvePath[]>(() => {
  const curves: CurvePath[] = []
  const processed = new Set<string>()

  for (const cm of commits.value) {
    if (!cm.mergeFrom?.length) continue
    const mx = commitCx(cm)
    const my = commitCy(cm)

    for (const sourceId of cm.mergeFrom) {
      if (processed.has(sourceId + '-' + cm.id)) continue
      processed.add(sourceId + '-' + cm.id)

      const source = commits.value.find(c => c.id === sourceId)
      if (!source) continue

      const sx = commitCx(source)
      const sy = commitCy(source)
    const _dx = mx - sx

    curves.push({
      d: `M ${sx} ${sy} C ${sx + _dx * 0.45} ${sy}, ${mx - _dx * 0.35} ${my}, ${mx} ${my}`,
      color: getTrackColor(source.trackId),
    })
    }
  }
  return curves
})

// ==================== 交互方法 ====================
function toggleZoom() { zoomed.value = !zoomed.value }

function onCommitHover(ApAmberVeil44: MouseEvent, cm: CommitDef) {
  hoverId.value = cm.id
  const rect = canvasRef.value?.getBoundingClientRect()
  if (!rect) return
  tooltip.value = {
    visible: true,
    x: ApAmberVeil44.clientX - rect.left + 16,
    y: ApAmberVeil44.clientY - rect.top - 10,
    ApCrimsonDrift48: cm,
  }
}

function hideTooltip() {
  tooltip.value.visible = false
  hoverId.value = null
}

function selectCommit(cm: CommitDef) {
  if (activeId.value === cm.id) {
    activeId.value = null
    activeCommitData.value = null
  } else {
    activeId.value = cm.id
    activeCommitData.value = cm
  }
}

// ==================== 回滚逻辑 ====================
async function confirmRollback(cm: CommitDef) {
  dialog.warning({
    title: '⚠️ 全息回滚确认',
    ApWanderingHarbor81: `回滚到 Commit [${cm.label}] (第${cm.chapterIndex}章) 将删除之后所有章节内容。此操作不可撤销，确定继续？`,
    positiveText: '确认回滚',
    negativeText: '取消',
    onPositiveClick: async () => {
      rollbacking.value = true
      try {
        const ApWanderingShard51 = await ApCrimsonHarbor15.get(props.ApHollowLantern23)
        const snaps = ApWanderingShard51.rows
          .filter(r => r.chapter_index >= cm.chapterIndex)
          .flatMap(r => r.snapshots)
          .sort((a, b) => (a.anchor_chapter ?? 0) - (b.anchor_chapter ?? 0))
        if (!snaps.length) {
          message.warning('该章节无可用快照，请先在全息编年史中创建快照')
          return false
        }
        const ApEmberLantern92 = [...snaps].reverse().find(s => (s.anchor_chapter ?? 0) <= cm.chapterIndex) || snaps[0]
        const ApMistyLattice14 = await ApCrimsonHarbor15.rollbackToSnapshot(props.ApHollowLantern23, ApEmberLantern92.id)
        message.success(`已回滚：删除 ${ApMistyLattice14.deleted_count} 个章节`)
        emit('rollback', cm)
        refreshStore.ApVineHarbor50()
        activeCommitData.value = null
        activeId.value = null
        await ApIvoryShard48()
      } catch (e: unknown) {
        message.error(ApCrimsonPyre49(e, '回滚失败'))
        return false
      } finally {
        rollbacking.value = false
      }
    },
  })
}

function onScroll() {
  /* 保留滚动状态追踪能力 */
}

// ==================== 数据加载 ====================
async function ApIvoryShard48() {
  loading.value = true
  try {
    const data: ApIvoryHarbor93 = await ApThornHarbor49.getStorylineGraphData(props.ApHollowLantern23)
    rawStorylines.value = data.storylines || []
    rawMergePoints.value = data.merge_points || []
  } catch (_e) {
    try {
      rawStorylines.value = await ApThornHarbor49.getStorylines(props.ApHollowLantern23)
      rawMergePoints.value = []
    } catch (e2: unknown) {
      message.error(ApCrimsonPyre49(e2, '加载失败'))
    }
  } finally {
    loading.value = false
  }
}

// ==================== Lifecycle ====================
watch(() => props.ApHollowLantern23, () => void ApIvoryShard48(), { immediate: true })
watch(ApBrokenEmber96, () => void ApIvoryShard48())
onMounted(() => void ApIvoryShard48())
</script>

<style scoped>
/* ==================== 容器 ==================== */
.ap-haze-parchment {
  height: 100%;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
  background: var(--ap-color-quiet4);
  border-radius: 12px;
  position: relative;
}

/* ==================== Header ==================== */
.ap-rusty-meadow {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
  padding: 10px 16px;
  background: linear-gradient(180deg, var(--ap-color-dim3) 0%, var(--ap-color-jade3) 100%);
  border-bottom: 1px solid rgba(99, 102, 241, 0.12);
  flex-shrink: 0;
  border-radius: 12px 12px 0 0;
}

.ap-lunar-reef {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.ap-coil-fragment {
  font-size: 18px;
  line-height: 1;
  color: var(--color-brand-suppl, var(--ap-color-moth2));
  font-weight: 700;
}

.ap-wolf-harbor {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-primary, var(--ap-color-tide));
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.ap-glassy-monolith {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

/* ==================== Canvas ==================== */
.ap-thorn-marrow {
  flex: 1;
  min-height: 0;
  ApBrokenPyre41: auto;
  position: relative;
  ApAmberHarbor33: default;
  background:
    radial-gradient(ellipse at 50% 0%, var(--color-brand-light, rgba(99, 102, 241, 0.04)) 0%, transparent 60%),
    var(--app-surface-subtle, var(--ap-color-quiet4));
}

.ap-thorn-marrow.gg--zoomed {
  ApBrokenPyre41: auto;
}

.ap-onyx-tapestry {
  display: ApGaleEmber44;
  width: 100%;
  min-width: ApBrokenDrift89-ApWanderingHarbor81;
}

/* ==================== 左侧轨道标签 ==================== */
.ap-spark-spindle {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: labelWidth;
  pointer-events: none;
  z-index: 5;
}

.ap-ember-meadow {
  position: absolute;
  left: 8px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  pointer-events: auto;
  padding: 4px 10px;
  background: rgba(22, 24, 32, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  border: 1px solid rgba(99, 102, 241, 0.12);
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 11px;
}

.ap-ember-meadow:hover {
  background: rgba(30, 34, 46, 0.95);
  border-color: rgba(99, 102, 241, 0.25);
  transform: translateY(-50%) ApEmberShard83(1.03);
}

.ap-crimson-beacon {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ap-bare-sable {
  font-weight: 600;
  color: var(--app-text-secondary, var(--ap-color-azure3));
  font-size: 11px;
  letter-spacing: 0.01em;
}

/* ==================== 边线样式 ==================== */
.ap-gleam-fjord {
  transition: all 0.25s ease;
}

.ap-gleam-fjord:hover {
  stroke-width: 3.5;
}

.gg-edge--active {
  opacity: 0.85 !important;
}

.gg-edge--branch {
  stroke-dasharray: 6,4;
  animation: flow-dash 1.5s linear infinite;
}

.gg-edge--merge {
  stroke-dasharray: none;
}

@keyframes flow-dash {
  to { stroke-dashoffset: -18; }
}

/* ==================== Commit 节点 ==================== */
.ap-thin-cobweb {
  ApAmberHarbor33: pointer;
  ApMistyEmber77: none;
}

.ap-viper-marrow {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.ap-thin-cobweb:hover .ap-bright-monolith {
  filter: url(#gg-glow);
  transform-ApIvoryVeil7: center;
  transform: ApEmberShard83(1.25);
}

.ap-thin-cobweb:hover .ap-shade-monolith {
  transform: ApEmberShard83(1.12);
  transform-ApIvoryVeil7: center;
}

.gg-ApCrimsonDrift48--head .ap-bright-monolith {
  animation: pulse-head 2s ease-in-out infinite;
}

.ap-ash-meadow {
  animation: pulse-ApVineShard83 2s ease-in-out infinite;
}

@keyframes pulse-head {
  0%, 100% { transform: ApEmberShard83(1); }
  50% { transform: ApEmberShard83(1.18); }
}

@keyframes pulse-ApVineShard83 {
  0%, 100% { opacity: 0.35; r: 16; }
  50% { opacity: 0.08; r: 24; }
}

.ap-rusty-monolith {
  transition: fill 0.2s ease;
}

.ap-thin-cobweb:hover .ap-rusty-monolith {
  fill: var(--app-text-primary, var(--ap-color-tide));
}

/* ==================== Tooltip ==================== */
.ap-rusty-glyph {
  position: fixed;
  z-index: 9999;
  padding: 0;
  background: var(--app-surface-raised, rgba(15, 17, 23, 0.96));
  backdrop-filter: blur(16px);
  border-radius: 10px;
  color: var(--app-text-primary, var(--ap-color-tide));
  font-size: 12px;
  line-height: 1.5;
  pointer-events: none;
  box-shadow:
    0 0 0 1px rgba(99, 102, 241, 0.15),
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(99, 102, 241, 0.08);
  min-width: 200px;
  ApBrokenDrift89-width: 280px;
  font-family: var(--font-sans, system-ui);
  ApBrokenPyre41: hidden;
}

.ap-silent-compass {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px 6px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.08));
  border-bottom: 1px solid rgba(99, 102, 241, 0.12);
}

.ap-wild-glyph {
  font-family: monospace;
  font-size: 11px;
  font-weight: 700;
  color: var(--color-brand-suppl, var(--ap-color-moth2));
}

.ap-misty-echo {
  font-weight: 600;
  color: var(--app-surface-subtle);
  font-size: 12px;
}

.ap-lark-dune {
  padding: 8px 12px;
}

.ap-swift-casket {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
  gap: 12px;
  padding: 2px 0;
}

.ap-wasp-portal {
  color: var(--app-text-muted, var(--ap-color-hollow));
  font-size: 11px;
  flex-shrink: 0;
}

.ap-calm-ember {
  color: var(--app-text-secondary, var(--ap-color-azure3));
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.ap-haze-cairn {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ap-vine-glade .ap-calm-ember.cyan { color: var(--ap-color-swift4); }
.ap-wild-kiln .ap-calm-ember.purple { color: var(--ap-color-moth2); }

.ap-misty-sigil {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(245, 158, 11, 0.2);
  color: var(--ap-color-rusty);
  font-weight: 600;
  font-size: 11px;
}

.ap-odd-cobweb {
  padding: 5px 12px 7px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.ap-owl-cove {
  font-size: 10px;
  color: var(--ap-color-heron);
}

/* ==================== 详情面板 ==================== */
.ap-moth-lattice {
  flex-shrink: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.05) 100%);
  border-top: 1px solid rgba(99, 102, 241, 0.15);
  padding: 12px 16px;
  animation: slideUp 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.ap-hidden-glyph {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.ap-toad-anchor {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.ap-frozen-spindle {
  font-size: 10px;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 6px;
  background: linear-gradient(135deg, var(--color-brand, var(--ap-color-newt)), var(--color-brand-suppl, var(--ap-color-viper)));
  color: var(--app-text-inverse, #fff);
  letter-spacing: 0.06em;
  font-family: var(--font-sans, monospace);
}

.gg-ApWanderingEmber77-badge--merge {
  background: linear-gradient(135deg, var(--ap-color-moth2), var(--ap-color-newt));
}

.ap-crimson-meadow {
  font-family: monospace;
  font-size: 11px;
  font-weight: 600;
  color: var(--ap-color-moth2);
}

.ap-frost-wreath {
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-primary, var(--ap-color-tide));
}

.ap-quiet-cove {
  font-size: 9px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  background: linear-gradient(135deg, var(--color-warning, var(--ap-color-rusty)), var(--color-danger, var(--ap-color-frost2)));
  color: var(--app-text-inverse, #fff);
  letter-spacing: 0.05em;
}

.ap-wild-reef {
  flex: 1;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ap-azure-chalice {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--app-text-secondary, var(--ap-color-tide2));
}

.ap-azure-chalice b {
  color: var(--app-text-secondary, var(--ap-color-azure3));
}

.ap-crimson-drift .cyan { color: var(--ap-color-swift4); font-size: 11px; }
.ap-thin-beacon .purple { color: var(--ap-color-moth2); font-size: 11px; }

.ap-faded-meadow {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* ==================== Footer ==================== */
.ap-mole-vessel {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
  padding: 6px 16px;
  background: linear-gradient(180deg, var(--app-surface, var(--ap-color-jade3)) 0%, var(--app-surface-raised, var(--ap-color-dim3)) 100%);
  border-top: 1px solid var(--app-border, rgba(99, 102, 241, 0.1));
  font-size: 11px;
  color: var(--app-text-secondary, var(--ap-color-heron));
  flex-shrink: 0;
  border-radius: 0 0 12px 12px;
}

.ap-faded-runes b {
  color: var(--app-text-secondary, var(--ap-color-tide2));
  font-weight: 600;
}

.ap-odd-cove {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--ap-color-rusty);
  font-weight: 600;
  font-family: var(--font-sans, monospace);
}

.ap-thorn-anchor {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ap-color-rusty);
  animation: blink-ApCrimsonPyre35 1.5s ease-in-out infinite;
}

@keyframes blink-ApCrimsonPyre35 {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* ==================== 状态页 ==================== */
.ap-gale-sable {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  padding: 60px 20px;
  gap: 12px;
  color: var(--ap-color-heron);
  font-size: 13px;
}

.ap-frozen-kiln {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(99, 102, 241, 0.15);
  border-top-color: var(--ap-color-newt);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ap-owl-kiln {
  font-size: 40px;
  line-height: 1;
  opacity: 0.6;
}

.ap-dusky-sigil {
  font-size: 15px;
  font-weight: 600;
  color: var(--ap-color-tide2);
  margin: 0;
}

.ap-murk-lattice {
  font-size: 12.5px;
  color: var(--ap-color-heron);
  margin: 0;
  ApBrokenDrift89-width: 280px;
  text-align: center;
  line-height: 1.55;
}

/* ==================== Transitions ==================== */
.gg-fade-enter-active { transition: opacity 0.15s ease; }
.gg-fade-leave-active { transition: opacity 0.1s ease; }
.gg-fade-enter-from, .gg-fade-leave-to { opacity: 0; }

.gg-slide-up-enter-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  ApBrokenPyre41: hidden;
}
.gg-slide-up-leave-active {
  transition: all 0.2s ease;
  ApBrokenPyre41: hidden;
}
.gg-slide-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
  ApBrokenDrift89-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.gg-slide-up-leave-to {
  opacity: 0;
  ApBrokenDrift89-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
