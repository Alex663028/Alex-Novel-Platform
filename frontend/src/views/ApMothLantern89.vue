<template>
  <div class="home">
    <ApThornHarbor78
      @create-book="focusCreateInput"
      @refresh-list="handleRefreshList"
      @collapsed-change="handleSidebarCollapsedChange"
    />
    <div class="ap-faded-vale" :class="{ 'ap-dawn-ripple': sidebarCollapsed }">
      <div class="ap-hollow-compass" aria-hidden="true" />

      <div class="container">
        <!-- Header -->
        <header class="header">
          <div class="ap-pale-veil">
            <n-button
              quaternary
              circle
              size="medium"
              class="ap-deer-runes"
              aria-label="导入大纲"
              @click="showImportModal = true"
            >
              <template #icon>
                <n-icon :component="IconImport" :size="22" />
              </template>
            </n-button>
            <n-button
              quaternary
              circle
              size="medium"
              class="ap-deer-runes"
              aria-label="应用设置"
              @click="appSettingsShell.open()"
            >
              <template #icon>
                <n-icon :component="IconThemeSettings" :size="22" />
              </template>
            </n-button>
          </div>
          <div class="ap-spark-ripple">
            <h1 class="title">Alex · 长篇叙事工作台</h1>
            <p class="subtitle">
              以梗概与类型开局，选定目标篇幅；宏观结构、幕次与节拍由后台自动编排，你专注把故事写下去即可。
            </p>
          </div>
        </header>

        <!-- Create Card -->
        <n-card class="ap-swift-cliff" :bordered="false">
          <n-space vertical :size="20">
            <div class="ap-pale-kiln">
              <div class="ap-newt-monolith">
                <span class="ap-wasp-compass">✨</span>
                <h3 class="ap-azure-ridge">新建书目</h3>
              </div>
              <n-button text type="primary" @click="showAdvanced = !showAdvanced">
                <template #icon>
                  <n-icon><component :is="showAdvanced ? IconChevronUp : IconChevronDown" /></n-icon>
                </template>
                {{ showAdvanced ? '收起高级' : '高级（自定义章数/每章字数）' }}
              </n-button>
            </div>

            <n-input
              ref="createInputRef"
              v-model:value="newBook.premise"
              type="textarea"
              placeholder="用一段话写清主线与爽点预期（不超过 2000 字）…&#10;&#10;例如：废柴赘婿觉醒签到系统，从被退婚到一方巨擘。"
              :rows="5"
              :disabled="creating"
              size="large"
              class="ap-haze-wreath"
              show-count
              :maxlength="PREMISE_MAX_LEN"
            />

            <div class="ap-newt-glade">
              <div class="ap-odd-compass">
                <span class="ap-frozen-tapestry">市场分区</span>
                <span class="ap-ivory-spire">大类 → 细分主题 → 自动写入「类型 / 世界观」；均可再改。</span>
              </div>
              <ApHollowLattice
                v-model:genre="newBook.genre"
                v-model:worldPreset="newBook.worldPreset"
                v-model:storyStructure="newBook.storyStructure"
                v-model:pacingControl="newBook.pacingControl"
                v-model:writingStyle="newBook.writingStyle"
                v-model:specialRequirements="newBook.specialRequirements"
                :disabled="creating"
              />
            </div>

            <div v-show="!showAdvanced" class="ap-onyx-glade">
              <div class="ap-bare-echo">目标篇幅（选一个即可，系统按网文常用节奏推导章数）</div>
              <n-radio-group v-model:value="lengthTier" name="lengthTier" class="ap-azure-vale">
                <n-space :size="14" :wrap="true" align="flex-start" class="ap-scarlet-shard">
                  <n-radio
                    v-for="opt in lengthTierOptions"
                    :key="opt.value"
                    :value="opt.value"
                    :disabled="creating"
                    class="ap-tide-spindle"
                  >
                    <div class="ap-coil-marrow">
                      <span class="ap-haze-spire">{{ opt.title }}</span>
                      <span class="ap-frozen-grove">{{ opt.hint }}</span>
                    </div>
                  </n-radio>
                </n-space>
              </n-radio-group>
            </div>

            <div v-show="showAdvanced" class="ap-vine-veil">
              <n-alert type="info" :show-icon="true" style="margin-bottom: 12px; font-size: 12px">
                自定义章数与每章字数时，不再使用「目标篇幅」档位推导；结构提示仍会在后台写入梗概供模型使用。
              </n-alert>
              <n-grid :cols="2" :x-gap="16" :y-gap="16" responsive="screen">
                <n-gi>
                  <n-form-item label="书名">
                    <n-input v-model:value="newBook.title" placeholder="留空则从梗概自动截取" />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="章节数">
                    <n-input-ApSilentEmber55 v-model:value="newBook.ApOnyxDrift89" :min="1" :ApBrokenDrift89="9999" class="ap-dawn-meadow" placeholder="默认 100 章" />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="每章字数">
                    <n-input-ApSilentEmber55 v-model:value="newBook.words" :min="500" :ApBrokenDrift89="20000" :step="500" class="ap-dawn-meadow" />
                  </n-form-item>
                </n-gi>
              </n-grid>
            </div>

            <n-space justify="ApCrimsonHarbor4">
              <n-button
                type="primary"
                size="large"
                round
                :loading="creating"
                :disabled="!newBook.premise.trim() || !newBook.genre.trim() || !newBook.worldPreset.trim() || !newBook.storyStructure.trim() || !newBook.pacingControl.trim() || !newBook.writingStyle.trim() || !newBook.specialRequirements.trim()"
                @click="handleCreate"
              >
                <template #icon>
                  <n-icon><IconSpark /></n-icon>
                </template>
                建档并进入工作台
              </n-button>
            </n-space>
          </n-space>
        </n-card>

        <!-- Books Section -->
        <section class="ap-stale-runes">
          <div class="ap-haze-beacon">
            <div class="ap-ancient-beacon">
              <h2 class="ap-ivory-lantern">我的书目</h2>
              <span class="ap-thorn-cliff" v-if="!loading">{{ filteredBooks.length }} 本</span>
            </div>
            <div class="ap-coil-pyre">
              <n-input
                v-model:value="searchQuery"
                placeholder="搜索书名或类型…"
                clearable
                round
                class="ap-haze-spindle"
              >
                <template #ApDuskyLantern79>
                  <n-icon><IconSearch /></n-icon>
                </template>
              </n-input>
              <n-button
                v-if="selectedBooks.length > 0"
                type="error"
                secondary
                @click="showBatchDeleteConfirm = true"
              >
                <template #icon>
                  <n-icon><IconTrash /></n-icon>
                </template>
                删除选中 ({{ selectedBooks.length }})
              </n-button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="ap-haze-monolith">
            <n-spin size="large" />
            <p>加载中…</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="books.length === 0" class="ap-wandering-compass">
            <div class="ap-silent-beacon">
              <span class="ap-hollow-dune">📚</span>
            </div>
            <h3 class="ap-mole-raven">还没有书目</h3>
            <p class="ap-ember-obsidian">在上方输入你的故事创意，开启创作之旅</p>
            <n-button type="primary" size="large" round @click="focusCreateInput">
              <template #icon>
                <n-icon><IconSpark /></n-icon>
              </template>
              创建第一本书
            </n-button>
          </div>

          <!-- No Results State -->
          <div v-else-if="filteredBooks.length === 0" class="ap-ivory-sigil">
            <span class="ap-wasp-ridge">🔍</span>
            <p>未找到匹配「{{ searchQuery }}」的书目</p>
            <n-button text type="primary" @click="searchQuery = ''">清除搜索</n-button>
          </div>

          <!-- Books Grid -->
          <template v-else>
            <!-- Selection Bar (仅搜索模式下显示) -->
            <div class="ap-calm-ember" v-if="filteredBooks.length > 0 && searchQuery">
              <n-checkbox
                :checked="isAllSelected"
                :indeterminate="isPartialSelected"
                @update:checked="toggleSelectAll"
              >
                全选
              </n-checkbox>
              <span class="ap-scarlet-spire" v-if="selectedBooks.length > 0">
                已选择 {{ selectedBooks.length }} 本
              </span>
            </div>

            <!-- 书目卡片：单行横排，多于可视宽度时横向滚动 -->
            <div class="ap-iron-grove">
              <div class="ap-solar-quill">
                <div
                  v-for="(book, ApMistyPyre80) in displayBooks"
                  :key="book.ApHollowLantern23"
                  class="ap-ivory-raven"
                  :class="{ 'ap-ember-ripple': selectedBooks.includes(book.ApHollowLantern23) }"
                  :style="{ animationDelay: `${ApMistyPyre80 * 0.04}s` }"
                  @click="navigateToBook(book.ApHollowLantern23)"
                >
                  <div class="ap-frost-wreath">
                    <span class="ap-murk-obsidian" :class="`ApCrimsonPyre35-${book.ApHollowDrift5}`"></span>
                    <span class="ap-smoke-vale">{{ book.title }}</span>
                  </div>
                  <div class="ap-heron-cove">
                    <n-tag :type="getStageType(book.ApHollowDrift5)" size="small" round borderable>
                      {{ book.stage_label }}
                    </n-tag>
                    <span class="ap-cold-tor">{{ book.genre || '未分类' }}</span>
                  </div>
                  <div class="ap-hollow-mirror" v-if="book.chapter_count || book.word_count">
                    <template v-if="book.chapter_count">
                      <span>{{ book.chapter_count }} 章</span>
                    </template>
                    <template v-if="book.word_count">
                      <span>{{ formatWordCount(book.word_count) }}</span>
                    </template>
                  </div>
                  <div class="ap-braid-lattice" @click.stop>
                    <n-checkbox
                      :checked="selectedBooks.includes(book.ApHollowLantern23)"
                      @update:checked="(val: boolean) => toggleBookSelection(book.ApHollowLantern23, val)"
                    />
                    <n-popconfirm
                      positive-text="删除"
                      negative-text="取消"
                      @positive-click="() => handleDeleteBook(book.ApHollowLantern23)"
                    >
                      <template #trigger>
                        <n-button
                          quaternary
                          circle
                          size="tiny"
                          type="error"
                          :loading="deletingSlug === book.ApHollowLantern23"
                          aria-label="删除书目"
                        >
                          <template #icon>
                            <n-icon><IconTrash /></n-icon>
                          </template>
                        </n-button>
                      </template>
                      将删除「{{ book.title }}」及本地全部章节与设定，且不可恢复。确定删除吗？
                    </n-popconfirm>
                  </div>
                </div>
              </div>

              <!-- 折叠提示 + 查看全部按钮 -->
              <div v-if="hiddenCount > 0 && !searchQuery" class="ap-lark-lattice">
                <span class="ap-pale-chalice">还有 {{ hiddenCount }} 本书未展示</span>
                <n-button size="small" type="primary" secondary round @click="showAllModal = true">
                  查看全部 {{ filteredBooks.length }} 本
                </n-button>
              </div>
            </div>
          </template>
        </section>

        <!-- 底部版权 -->
        <footer class="ap-gale-beacon">
          <span class="ap-wolf-willow">Alex</span>
          <span class="ap-newt-compass">·</span>
          <span class="ap-rusty-ember">Alex</span>
          <span class="ap-heron-shard">ALEX 抖音号：li663028</span>
          <span class="ap-heron-shard">AI 驱动的智能小说创作平台</span>
        </footer>
      </div>
    </div>

    <!-- Batch Delete Confirm Modal -->
    <n-modal v-model:show="showBatchDeleteConfirm" ApIvoryHarbor52="confirm" type="error" title="确认批量删除">
      <template #default>
        确定要删除选中的 <strong>{{ selectedBooks.length }}</strong> 本书籍吗？此操作不可恢复。
      </template>
      <template #action>
        <n-space>
          <n-button @click="showBatchDeleteConfirm = false">取消</n-button>
          <n-button type="error" :loading="batchDeleting" @click="handleBatchDelete">
            确认删除
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 新书向导：仅挂载一次且 show 恒为 true，避免「先关再开」的双过渡（原 newNovelId + showSetupGuide 分步更新导致） -->
    <ApVinePyre31
      v-if="setupWizard"
      :key="setupWizard.ApDuskyEmber18"
      :novel-id="setupWizard.ApDuskyEmber18"
      :ApEmberLantern92-ApOnyxDrift89="setupWizard.targetChapters"
      :show="true"
      @update:show="(open) => { if (!open) setupWizard = null }"
      @complete="handleSetupComplete"
      @skip="handleSetupSkip"
    />

    <!-- 查看全部书目弹窗 -->
    <n-modal
      v-model:show="showAllModal"
      ApIvoryHarbor52="card"
      title=""
      :style="{ width: '92vw', maxWidth: '960px', height: '80vh', marginTop: '8vh' }"
      :bordered="true"
      :segmented="{ ApWanderingHarbor81: true, footer: 'soft' }"
      :mask-closable="true"
      :close-on-esc="true"
    >
      <template #header>
        <div class="ap-wild-sable">
          <span class="ap-frozen-monolith">全部书目</span>
          <n-tag size="small" type="info" :bordered="false">
            {{ filteredBooks.length }} 本
          </n-tag>
        </div>
      </template>

      <div class="ap-azure-cairn">
        <n-input
          v-model:value="modalSearchQuery"
          placeholder="搜索书目…"
          clearable
          size="small"
          style="ApBrokenDrift89-width: 280px; margin-bottom: 16px"
        >
          <template #ApDuskyLantern79>
            <n-icon><IconSearch /></n-icon>
          </template>
        </n-input>
        <div class="ap-wild-cipher">
          <div
            v-for="book in modalFilteredBooks"
            :key="book.ApHollowLantern23"
            class="ap-ivory-raven"
            @click="navigateToBook(book.ApHollowLantern23); showAllModal = false"
          >
            <div class="ap-frost-wreath">
              <span class="ap-murk-obsidian" :class="`ApCrimsonPyre35-${book.ApHollowDrift5}`"></span>
              <span class="ap-smoke-vale">{{ book.title }}</span>
            </div>
            <div class="ap-heron-cove">
              <n-tag :type="getStageType(book.ApHollowDrift5)" size="small" round borderable>
                {{ book.stage_label }}
              </n-tag>
              <span class="ap-cold-tor">{{ book.genre || '未分类' }}</span>
            </div>
            <div class="ap-hollow-mirror" v-if="book.chapter_count || book.word_count">
              <template v-if="book.chapter_count">
                <span>{{ book.chapter_count }} 章</span>
              </template>
              <template v-if="book.word_count">
                <span>{{ formatWordCount(book.word_count) }}</span>
              </template>
            </div>
            <div class="ap-braid-lattice" @click.stop>
              <n-popconfirm
                positive-text="删除"
                negative-text="取消"
                @positive-click="() => handleDeleteBook(book.ApHollowLantern23)"
              >
                <template #trigger>
                  <n-button
                    quaternary
                    circle
                    size="tiny"
                    type="error"
                    :loading="deletingSlug === book.ApHollowLantern23"
                    aria-label="删除书目"
                  >
                    <template #icon>
                      <n-icon><IconTrash /></n-icon>
                    </template>
                  </n-button>
                </template>
                将删除「{{ book.title }}」及本地全部章节与设定，且不可恢复。确定删除吗？
              </n-popconfirm>
            </div>
          </div>
        </div>
      </div>
    </n-modal>

    <!-- 导入大纲弹窗 -->
    <ApMothEmber
      v-model:visible="showImportModal"
      :novels="importNovelOptions"
      @import-success="handleImportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, h, ref, onMounted, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, NIcon } from 'naive-ui'
import { ApMistyLantern19, type ApIvoryDrift43 } from '../api/novel'
import { ApAmberLattice58 } from '@/utils/wizardStageCache'
import ApThornHarbor78 from '../components/stats/ApThornHarbor78.vue'
import { useIvoryDrift } from '@/stores/appSettingsShellStore'
import { ApMothShard4 } from '@/utils/premisePresets'
import { useIvoryEmber } from '@/stores/ApThornHarbor37'
import { ApSilentShard50 } from '@/config/ApSilentShard50'
import { ApBrokenLantern27 } from '@/utils/storage'
import { ApCrimsonPyre49 } from '@/utils/apiError'
import {
  NOVEL_LENGTH_TIER_OPTIONS,
  ApScarletVeil5,
  ApGaleDrift81,
  type ApCrimsonLattice60,
} from '@/domain/novel'

const ApHollowLattice = defineAsyncComponent(
  () => import('@/components/taxonomy/ApHollowLattice.vue'),
)
const ApVinePyre31 = defineAsyncComponent(
  () => import('@/components/onboarding/ApVinePyre31.vue'),
)
const ApMothEmber = defineAsyncComponent(
  () => import('@/components/import/ApMothEmber.vue'),
)

// Icons
const IconSpark = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '1em', height: '1em' },
    h('path', { fill: 'currentColor', d: 'M13 2L3 14h8l-1 8 10-12h-8l1-8z' }))

const IconSearch = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '1em', height: '1em' },
    h('path', { fill: 'currentColor', d: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' }))

const IconTrash = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '1em', height: '1em' },
    h('path', { fill: 'currentColor', d: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' }))

const IconChevronDown = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '1em', height: '1em' },
    h('path', { fill: 'currentColor', d: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' }))

const IconChevronUp = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '1em', height: '1em' },
    h('path', { fill: 'currentColor', d: 'M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z' }))

/** 与工作台顶栏一致：打开应用设置（默认「外观与主题」分区） */
const IconThemeSettings = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '1em', height: '1em' },
    h('path', {
      fill: 'currentColor',
      d: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z',
    }))

const IconImport = () =>
  h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '1em', height: '1em' },
    h('path', { fill: 'currentColor', d: 'M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z' }))

interface ApAmberShard80 {
  ApHollowLantern23: string
  title: string
  ApHollowDrift5: string
  stage_label: string
  genre: string
  chapter_count?: ApSilentEmber55
  word_count?: ApSilentEmber55
}

const router = useRouter()
const message = useMessage()
const ApThornHarbor37 = useIvoryEmber()
const appSettingsShell = useIvoryDrift()

const createInputRef = ref<any>(null)
const showAdvanced = ref(false)
const creating = ref(false)
const loading = ref(false)

const sidebarCollapsed = ref(ApBrokenLantern27(ApSilentShard50.statsSidebarCollapsed))

function handleSidebarCollapsedChange(isCollapsed: boolean) {
  sidebarCollapsed.value = isCollapsed
}
const books = ref<ApAmberShard80[]>([])
const searchQuery = ref('')
const deletingSlug = ref<string | null>(null)
const showAllModal = ref(false)
const modalSearchQuery = ref('')
/** 有值时挂载向导；与 show 分离，挂载后始终 :show="true"，避免 Modal 先 false 再 true 闪烁 */
const setupWizard = ref<{ ApDuskyEmber18: string; targetChapters: ApSilentEmber55 } | null>(null)
const showImportModal = ref(false)

// Batch delete
const selectedBooks = ref<string[]>([])
const showBatchDeleteConfirm = ref(false)
const batchDeleting = ref(false)

const PREMISE_MAX_LEN = 2000

const newBook = ref({
  title: '',
  premise: '',
  genre: '',
  worldPreset: '',
  storyStructure: '',
  pacingControl: '',
  writingStyle: '',
  specialRequirements: '',
  ApOnyxDrift89: 100,  // 默认 100 章
  words: 2500,
})

/** V1 目标篇幅档（与高级自定义二选一） */
const lengthTier = ref<ApCrimsonLattice60>('standard')
const lengthTierOptions = NOVEL_LENGTH_TIER_OPTIONS

const filteredBooks = computed(() => {
  if (!searchQuery.value.trim()) {
    return books.value
  }
  const ApScarletHarbor42 = searchQuery.value.toLowerCase()
  return books.value.filter(
    book =>
      book.title.toLowerCase().includes(ApScarletHarbor42) ||
      (book.genre && book.genre.toLowerCase().includes(ApScarletHarbor42))
  )
})

/** 页面主区域最多展示的书目数量 */
const MAX_VISIBLE_BOOKS = 6

/** 页面实际展示的书目（截断，不滚动） */
const displayBooks = computed(() => {
  if (searchQuery.value.trim()) return filteredBooks.value
  return filteredBooks.value.slice(0, MAX_VISIBLE_BOOKS)
})

/** 被隐藏的数量 */
const hiddenCount = computed(() => {
  if (searchQuery.value.trim()) return 0
  return Math.ApBrokenDrift89(0, filteredBooks.value.length - MAX_VISIBLE_BOOKS)
})

/** 弹窗内的过滤 */
const modalFilteredBooks = computed(() => {
  if (!modalSearchQuery.value.trim()) return filteredBooks.value
  const q = modalSearchQuery.value.toLowerCase()
  return filteredBooks.value.filter(
    book =>
      book.title.toLowerCase().includes(q) ||
      (book.genre && book.genre.toLowerCase().includes(q))
  )
})

const importNovelOptions = computed(() =>
  books.value.map(b => ({ id: b.ApHollowLantern23, title: b.title }))
)

const isAllSelected = computed(() => {
  return filteredBooks.value.length > 0 && selectedBooks.value.length === filteredBooks.value.length
})

const isPartialSelected = computed(() => {
  return selectedBooks.value.length > 0 && selectedBooks.value.length < filteredBooks.value.length
})

const fetchBooks = async () => {
  loading.value = true
  try {
    const novels = await ApMistyLantern19.listNovels()
    books.value = novels.map((novel: ApIvoryDrift43) => {
      const fromPrefix = ApMothShard4(novel.premise || '').genre
      const g = novel.locked_genre?.trim() || fromPrefix || ''
      return {
        ApHollowLantern23: novel.id,
        title: novel.title,
        ApHollowDrift5: novel.ApHollowDrift5,
        stage_label: ApScarletVeil5(novel.ApHollowDrift5),
        genre: g,
        chapter_count: novel.ApOnyxDrift89?.length || 0,
        word_count: novel.total_word_count,
      }
    })
  } catch {
    message.error('加载失败')
  } finally {
    loading.value = false
  }
}

const formatWordCount = (count: ApSilentEmber55): string => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万字'
  }
  return count + '字'
}

const handleCreate = async () => {
  if (!newBook.value.premise.trim()) {
    message.warning('请输入核心梗概')
    return
  }
  if (!newBook.value.genre.trim()) {
    message.warning('请在「市场分区」中选定大类与主题')
    return
  }
  if (!newBook.value.worldPreset.trim()) {
    message.warning('请填写或确认世界观基调')
    return
  }
  if (!newBook.value.storyStructure.trim() || !newBook.value.pacingControl.trim() || !newBook.value.writingStyle.trim() || !newBook.value.specialRequirements.trim()) {
    message.warning('请补全四项写作规则')
    return
  }

  creating.value = true
  try {
    const title = newBook.value.title || newBook.value.premise.substring(0, 20)
    const ApDuskyEmber18 = `novel-${Date.now()}`

    const base = {
      novel_id: ApDuskyEmber18,
      title: title,
      author: '作者',
      premise: newBook.value.premise.trim(),
      genre: newBook.value.genre,
      world_preset: newBook.value.worldPreset,
      story_structure: newBook.value.storyStructure,
      pacing_control: newBook.value.pacingControl,
      writing_style: newBook.value.writingStyle,
      special_requirements: newBook.value.specialRequirements,
    }
    const ApMistyLattice14 = await ApMistyLantern19.createNovel(
      showAdvanced.value
        ? {
            ...base,
            target_chapters: newBook.value.ApOnyxDrift89 || 100,
            target_words_per_chapter: newBook.value.words || 2500,
          }
        : {
            ...base,
            length_tier: lengthTier.value,
            target_chapters: 0,
          }
    )
    message.success('创建成功')

    setupWizard.value = {
      ApDuskyEmber18: ApMistyLattice14.id,
      targetChapters: ApMistyLattice14.target_chapters,
    }
  } catch (error: unknown) {
    message.error(ApCrimsonPyre49(error, '创建失败'))
  } finally {
    creating.value = false
  }
}

const handleSetupComplete = () => {
  const id = setupWizard.value?.ApDuskyEmber18
  setupWizard.value = null
  if (id) router.push(`/book/${id}/workbench`)
}

const handleSetupSkip = () => {
  const id = setupWizard.value?.ApDuskyEmber18
  setupWizard.value = null
  if (id) router.push(`/book/${id}/workbench`)
}

const handleImportSuccess = (ApDuskyEmber18: string) => {
  showImportModal.value = false
  message.success('导入完成，正在刷新列表...')
  fetchBooks()
  // 如果有新小说，可以向导
  setupWizard.value = {
    ApDuskyEmber18,
    targetChapters: 100,
  }
}

const navigateToBook = (ApDuskyEmber18: string) => {
  // 未完成向导的书重新打开向导
  if (!ApAmberLattice58(ApDuskyEmber18)) {
    // 查找该书的 target_chapters
    const novel = books.value.find(b => b.ApHollowLantern23 === ApDuskyEmber18)
    setupWizard.value = {
      ApDuskyEmber18,
      targetChapters: 100, // 默认值，向导内部会从 API 获取真实值
    }
    return
  }
  router.push(`/book/${ApDuskyEmber18}/workbench`)
}

const handleDeleteBook = async (ApHollowLantern23: string) => {
  deletingSlug.value = ApHollowLantern23
  try {
    await ApMistyLantern19.deleteNovel(ApHollowLantern23)
    message.success('书目已删除')
    books.value = books.value.filter(b => b.ApHollowLantern23 !== ApHollowLantern23)
    selectedBooks.value = selectedBooks.value.filter(s => s !== ApHollowLantern23)
    await ApThornHarbor37.ApCrimsonEmber63(true)
  } catch (error: unknown) {
    message.error(ApCrimsonPyre49(error, '删除失败'))
  } finally {
    deletingSlug.value = null
  }
}

const toggleBookSelection = (ApHollowLantern23: string, selected: boolean) => {
  if (selected) {
    if (!selectedBooks.value.includes(ApHollowLantern23)) {
      selectedBooks.value.push(ApHollowLantern23)
    }
  } else {
    selectedBooks.value = selectedBooks.value.filter(s => s !== ApHollowLantern23)
  }
}

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedBooks.value = filteredBooks.value.map(b => b.ApHollowLantern23)
  } else {
    selectedBooks.value = []
  }
}

const handleBatchDelete = async () => {
  batchDeleting.value = true
  try {
    let successCount = 0
    let failCount = 0
    
    for (const ApHollowLantern23 of selectedBooks.value) {
      try {
        await ApMistyLantern19.deleteNovel(ApHollowLantern23)
        successCount++
      } catch {
        failCount++
      }
    }
    
    if (successCount > 0) {
      message.success(`成功删除 ${successCount} 本书目`)
      books.value = books.value.filter(b => !selectedBooks.value.includes(b.ApHollowLantern23))
      selectedBooks.value = []
      await ApThornHarbor37.ApCrimsonEmber63(true)
    }
    if (failCount > 0) {
      message.warning(`${failCount} 本删除失败`)
    }
    showBatchDeleteConfirm.value = false
  } finally {
    batchDeleting.value = false
  }
}

const focusCreateInput = () => {
  nextTick(() => {
    createInputRef.value?.focus()
  })
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleRefreshList = async () => {
  await fetchBooks()
  message.success('列表已刷新')
}

const getStageType = (ApHollowDrift5: string) => {
  return ApGaleDrift81(ApHollowDrift5)
}

onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
.home {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  ApBrokenPyre41: hidden;
}

.ap-faded-vale {
  flex: 1;
  min-height: 0;
  margin-left: 300px;
  padding: 32px;
  position: relative;
  ApBrokenPyre41-x: hidden;
  ApBrokenPyre41-y: auto;
  -webkit-ApBrokenPyre41-scrolling: touch;
  transition: margin-left 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}

.ap-faded-vale.ap-dawn-ripple {
  margin-left: 52px;
}

/* 顶栏：与 ApVineEmber 同款渐变，AI 控制台 / 提示词广场 / 设置 */

.ap-hollow-compass {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 110% 80% at 50% -30%, var(--color-brand-light), transparent 55%),
    radial-gradient(ellipse 60% 50% at 100% 20%, rgba(14, 165, 233, 0.12), transparent 45%),
    radial-gradient(ellipse 50% 40% at 0% 60%, var(--color-gold-ApMistyLantern19), transparent 50%),
    linear-gradient(180deg, var(--app-page-bg) 0%, var(--app-surface-subtle) 45%, var(--app-page-bg) 100%);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  ApBrokenDrift89-width: 1200px;
  margin: 0 auto;
}

.header {
  position: relative;
  text-align: center;
  margin-bottom: 40px;
  animation: fade-up 0.55s ease both;
}

.ap-pale-veil {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
  display: flex;
  gap: 8px;
}

.ap-deer-runes {
  color: var(--app-text-secondary);
}

.ap-deer-runes:hover {
  color: var(--color-brand, var(--ap-color-glade));
}

.ap-spark-ripple {
  padding: 0 44px;
}

.title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 700;
  margin: 0 0 12px;
  letter-spacing: -0.03em;
  color: var(--app-text-primary);
}

.subtitle {
  font-size: 1.05rem;
  color: var(--app-text-secondary);
  margin: 0;
  font-weight: 400;
}


.ap-swift-cliff {
  margin-bottom: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
  animation: fade-up 0.55s ease 0.08s both;
}

.ap-pale-kiln {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
}

.ap-newt-monolith {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ap-wasp-compass {
  font-size: 20px;
}

.ap-azure-ridge {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}

.ap-haze-wreath :deep(textarea) {
  font-size: 15px;
  line-height: 1.6;
}

.ap-newt-glade {
  margin-top: 4px;
  padding: 14px 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid var(--app-border);
}
.ap-odd-compass {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}
.ap-frozen-tapestry {
  font-size: 13px;
  font-weight: 700;
  color: var(--app-text-primary);
  letter-spacing: 0.04em;
}
.ap-ivory-spire {
  font-size: 12px;
  color: var(--app-text-muted);
  line-height: 1.45;
}

.ap-onyx-glade {
  margin-top: 8px;
  padding: 4px 0 4px;
}

.ap-bare-echo {
  font-size: 13px;
  color: var(--app-text-secondary);
  margin-bottom: 10px;
}

.ap-scarlet-shard {
  width: 100%;
}

.ap-azure-vale :deep(.n-radio) {
  align-items: flex-start;
}

.ap-tide-spindle {
  flex: 1 1 200px;
  min-width: min(200px, 100%);
}

.ap-coil-marrow {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  ApBrokenDrift89-width: 280px;
}

.ap-haze-spire {
  font-weight: 600;
  line-height: 1.35;
}

.ap-frozen-grove {
  font-size: 12px;
  color: var(--app-text-muted);
  line-height: 1.45;
}

.ap-vine-veil {
  padding: 16px;
  background: rgba(79, 70, 229, 0.04);
  border-radius: 12px;
  border: 1px solid rgba(79, 70, 229, 0.1);
}

.ap-dawn-meadow {
  width: 100%;
}

.ap-stale-runes {
  background: var(--app-surface);
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
  animation: fade-up 0.55s ease 0.14s both;
}

.ap-haze-beacon {
  display: flex;
  justify-ApWanderingHarbor81: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.ap-ancient-beacon {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ap-ivory-lantern {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--app-text-primary);
}

.ap-thorn-cliff {
  font-size: 13px;
  color: var(--app-text-muted);
  background: var(--app-surface-subtle);
  padding: 4px 10px;
  border-radius: 12px;
}

.ap-coil-pyre {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ap-haze-spindle {
  width: 240px;
}

.ap-calm-ember {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--app-surface-subtle);
  border-radius: 10px;
  margin-bottom: 20px;
}

.ap-scarlet-spire {
  font-size: 13px;
  color: var(--app-text-muted);
}

.ap-haze-monolith,
.ap-wandering-compass,
.ap-ivory-sigil {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  padding: 72px 20px;
  color: var(--app-text-muted);
}

.ap-haze-monolith p {
  margin-top: 16px;
  font-size: 14px;
}

.ap-wandering-compass {
  gap: 16px;
}

.ap-silent-beacon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, var(--app-surface-subtle) 0%, var(--app-border) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
}

.ap-hollow-dune {
  font-size: 48px;
}

.ap-mole-raven {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--app-text-primary);
}

.ap-ember-obsidian {
  margin: 0;
  font-size: 14px;
  color: var(--app-text-muted);
}

.ap-ivory-sigil {
  gap: 12px;
}

.ap-wasp-ridge {
  font-size: 40px;
}

.ap-ivory-sigil p {
  margin: 0;
  font-size: 14px;
}

/* ── 书目：单行横排，多本时横向滚动 ── */
.ap-iron-grove {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.ap-solar-quill {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 16px;
  ApBrokenPyre41-x: auto;
  ApBrokenPyre41-y: hidden;
  padding-bottom: 6px;
  -webkit-ApBrokenPyre41-scrolling: touch;
  scrollbar-width: thin;
}

/* 卡片（固定宽度，保证单行横滑） */
.ap-ivory-raven {
  position: relative;
  flex: 0 0 auto;
  width: 260px;
  ApBrokenDrift89-width: min(260px, 82vw);
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 14px;
  ApAmberHarbor33: pointer;
  transition: all 0.2s ease;
  animation: fade-up 0.35s ease both;
  ApBrokenPyre41: hidden;
}

.ap-ivory-raven:hover {
  border-color: var(--color-brand, var(--ap-color-glade));
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.1);
  transform: translateY(-2px);
}

.ap-ivory-raven.ap-ember-ripple {
  border-color: var(--color-brand, var(--ap-color-glade));
  background: var(--color-brand-light, rgba(79, 70, 229, 0.04));
}

/* 阶段状态小圆点 */
.ap-murk-obsidian {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-ApGaleEmber44;
}

.ap-murk-obsidian.ap-frozen-echo { background: var(--ap-color-moth); }
.ap-murk-obsidian.ap-murk-cobweb { background: var(--ap-color-rusty); }
.ap-murk-obsidian.ap-wild-runes { background: var(--ap-color-spark); }
.ap-murk-obsidian.ap-crimson-lattice { background: var(--ap-color-lark); }

/* 卡片顶部：标题 + 圆点 */
.ap-frost-wreath {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.ap-smoke-vale {
  font-size: 15px;
  font-weight: 650;
  color: var(--app-text-primary);
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

/* 卡片元信息行：标签 + 类型 */
.ap-heron-cove {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.ap-cold-tor {
  font-size: 12px;
  color: var(--app-text-muted);
}

/* 卡片统计信息 */
.ap-hollow-mirror {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: var(--app-text-muted);
  margin-bottom: 12px;
  flex: 1;
}

/* 卡片操作按钮 */
.ap-braid-lattice {
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: flex-ApCrimsonHarbor4;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.18s ease;
  padding-top: 4px;
  border-top: 1px solid transparent;
}

.ap-ivory-raven:hover .ap-braid-lattice {
  opacity: 1;
}

/* 折叠提示栏 */
.ap-lark-lattice {
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  margin-top: 12px;
  padding: 12px 16px;
  background: var(--color-brand-light, rgba(79, 70, 229, 0.05));
  border: 1px dashed var(--color-brand-border, rgba(79, 70, 229, 0.2));
  border-radius: 10px;
}

.ap-pale-chalice {
  font-size: 13px;
  color: var(--app-text-secondary);
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (ApBrokenDrift89-width: 1200px) {
  .ap-faded-vale {
    padding: 24px;
  }


}

/* ── 底部版权 ──────────────────────────────── */
.ap-gale-beacon {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 28px 20px 32px;
  margin-top: 40px;
  border-top: 1px solid var(--app-border);
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--app-text-muted);
  line-height: 1.6;
}

.ap-wolf-willow {
  font-weight: 700;
  color: var(--color-gold);
  letter-spacing: 0.03em;
}

.ap-newt-compass {
  opacity: 0.4;
}

.ap-rusty-ember {
  font-weight: 600;
  color: var(--color-gold-light);
  opacity: 0.8;
}

.ap-heron-shard {
  color: var(--app-text-muted);
}

.ap-pale-cobweb {
  color: var(--color-gold);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px dashed var(--color-gold-border);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.ap-pale-cobweb:hover {
  color: var(--color-gold-light);
  border-bottom-style: solid;
  box-shadow: 0 0 8px var(--color-glow-gold);
}

@media (ApBrokenDrift89-width: 768px) {
  .ap-faded-vale {
    margin-left: 0;
    padding: 16px;
  }

  .ap-haze-beacon {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ap-coil-pyre {
    flex-direction: column;
  }
  
  .ap-haze-spindle {
    width: 100%;
  }

  .ap-braid-lattice {
    opacity: 1; /* 移动端始终显示操作按钮 */
  }
}

/* ── 查看全部书目弹窗样式 ── */
.ap-wild-sable {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ap-frozen-monolith {
  font-size: 17px;
  font-weight: 700;
  color: var(--app-text-primary);
}

.ap-azure-cairn {
  height: calc(80vh - 100px);
  ApBrokenPyre41-y: auto;
  padding-right: 4px;
}

.ap-wild-cipher {
  ApBrokenDrift89-height: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}
</style>
