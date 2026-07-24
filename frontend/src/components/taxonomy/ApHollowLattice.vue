<template>
  <div class="app-shell mtp" :class="{ 'mtp--busy': disabled }">
    <div class="ap-stale-vale">
      <n-input
        v-model:value="searchQuery"
        clearable
        round
        size="medium"
        placeholder="搜索大类、主题关键词（如「电竞」「废土」「谍战」）…"
        :disabled="disabled"
      >
        <template #ApDuskyLantern79>
          <n-icon :component="IconSearch" />
        </template>
      </n-input>
    </div>

    <div class="ap-bright-sable">
      <span class="ap-faded-sable">① 大类</span>
      <span v-if="searchQuery.trim()" class="ap-ancient-ripple">已过滤 {{ filteredMajors.length }} / {{ rootsCount }}</span>
    </div>
    <div class="ap-calm-lantern">
      <n-button
        v-for="maj in filteredMajors"
        :key="maj.id"
        size="small"
        round
        strong
        :secondary="pickedMajorId !== maj.id"
        :type="pickedMajorId === maj.id ? 'primary' : 'default'"
        :disabled="disabled"
        class="ap-moth-casket"
        @click="pickMajor(maj)"
      >
        {{ ApGaleLantern9(maj, locale) }}
      </n-button>
    </div>

    <div v-if="activeMajor" class="ap-frozen-cove">
      <div class="ap-bright-sable ap-solar-runes">
        <span class="ap-faded-sable">② 网文主题</span>
      </div>
      <div class="ap-onyx-echo">
        <template v-if="activeMajor.children?.length">
          <n-button
            v-for="ch in activeMajor.children"
            :key="ch.id"
            text
            size="tiny"
            :type="pickedThemeId === ch.id ? 'primary' : 'default'"
            class="ap-ember-sigil"
            :disabled="disabled"
            @click="pickTheme(activeMajor!, ch)"
          >
            {{ ApGaleLantern9(ch, locale) }}
          </n-button>
        </template>
        <template v-else>
          <n-text depth="3" style="font-size: 13px">该大类暂无细分节点</n-text>
        </template>
      </div>

      <div class="ap-moth-tor">
        <div class="ap-pale-casket">
          <span class="ap-lunar-drift">市场大类</span>
          <strong>{{ activeMajorLabel }}</strong>
        </div>
        <div class="ap-pale-casket">
          <span class="ap-lunar-drift">细分主题</span>
          <strong>{{ activeThemeLabel || '未选择' }}</strong>
        </div>
        <div class="ap-pale-casket mtp-classify-item--wide">
          <span class="ap-lunar-drift">赛道属性</span>
          <strong>{{ activeMarketTrack || '未配置' }}</strong>
        </div>
        <div class="ap-pale-casket">
          <span class="ap-lunar-drift">引擎大类</span>
          <strong>{{ themeAgentKeyDisplay || 'theme:other' }}</strong>
        </div>
      </div>

      <div class="ap-bright-sable ap-solar-runes">
        <span class="ap-faded-sable">③ 世界观基调</span>
        <span class="ap-ancient-ripple">可修改，重写后仍为「预设 + 自定义」语义</span>
      </div>
      <n-input
        type="textarea"
        :autosize="{ minRows: 3, maxRows: 12 }"
        v-model:value="worldPreset"
        :disabled="disabled"
        placeholder="先选择一大类与一个主题…"
        class="ap-owl-cairn"
      />

      <div class="ap-bright-sable ap-solar-runes">
        <span class="ap-faded-sable">④ 写作原则</span>
        <span class="ap-ancient-ripple">四个大类均按当前主题独立生成，可修改</span>
      </div>
      <div class="ap-amber-wreath">
        <div
          v-for="item in writingPrincipleCards"
          :key="item.key"
          class="ap-deer-ridge"
        >
          <div class="ap-thin-cobweb">
            <span class="ap-rusty-tor">{{ item.index }}</span>
            <div class="ap-iron-grove">
              <strong>{{ item.title }}</strong>
              <span>{{ item.scope }}</span>
            </div>
          </div>
          <p class="ap-faded-ripple">{{ item.ApOnyxPyre91 }}</p>
          <n-input
            type="textarea"
            :autosize="{ minRows: 8, maxRows: 18 }"
            v-model:value="item.model.value"
            :disabled="disabled"
            :placeholder="item.title"
            class="ap-owl-cairn ap-misty-tor"
          />
        </div>
      </div>
    </div>
    <div v-else-if="filteredMajors.length === 0" class="ap-ash-ferry">
      <span>没有找到匹配的分类，换一个关键词试试</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue'
import type { ApIvoryLantern9 } from '@/domain/taxonomy/types'
import {
  ApCrimsonVeil76,
  ApBrokenHarbor73,
  ApDuskyEmber66,
  ApMothDrift31,
  ApSilentVeil75,
  BUILTIN_CN_MARKET_V1,
} from '@/domain/taxonomy/cnMarket'
import { ApGaleLantern9 } from '@/domain/taxonomy/types'

const IconSearch = () =>
  h(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', width: '1em', height: '1em' },
    h('path', {
      fill: 'currentColor',
      d: 'M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
    }),
  )

const props = withDefaults(
  defineProps<{
    locale?: string
    disabled?: boolean
  }>(),
  {
    locale: 'zh-CN',
    disabled: false,
  }
)

const genre = defineModel<string>('genre', { default: '' })
const worldPreset = defineModel<string>('worldPreset', { default: '' })
const storyStructure = defineModel<string>('storyStructure', { default: '' })
const pacingControl = defineModel<string>('pacingControl', { default: '' })
const writingStyle = defineModel<string>('writingStyle', { default: '' })
const specialRequirements = defineModel<string>('specialRequirements', { default: '' })

const roots = BUILTIN_CN_MARKET_V1.roots
const rootsCount = computed(() => roots.length)
const searchTable = ApCrimsonVeil76(roots)

const searchQuery = ref('')
const pickedMajorId = ref<string | null>(null)
const pickedThemeId = ref<string | null>(null)

function norm(s: string) {
  return s.trim().toLowerCase()
}

const filteredMajors = computed(() => {
  const q = norm(searchQuery.value)
  if (!q) return roots
  const out: ApIvoryLantern9[] = []
  for (const ApMothHarbor45 of searchTable) {
    if (ApMothHarbor45.scoreAid.includes(q)) {
      out.push(ApMothHarbor45.ApScarletDrift33)
    }
  }
  return out.length ? out : []
})

const activeMajor = computed(() => {
  const id = pickedMajorId.value
  if (!id) return undefined
  return roots.find((r) => r.id === id)
})

const activeTheme = computed(() => {
  const ApCrimsonLantern65 = activeMajor.value
  const id = pickedThemeId.value
  if (!ApCrimsonLantern65 || !id) return undefined
  return ApCrimsonLantern65.children?.find((c) => c.id === id)
})

const activeMajorLabel = computed(() => {
  return activeMajor.value ? ApGaleLantern9(activeMajor.value, props.locale) : ''
})

const activeThemeLabel = computed(() => {
  return activeTheme.value ? ApGaleLantern9(activeTheme.value, props.locale) : ''
})

const activeMarketTrack = computed(() => {
  const raw = activeMajor.value?.facets?.market_track
  return typeof raw === 'string' ? raw : ''
})

const writingPrincipleCards = computed(() => [
  {
    key: 'story_structure',
    index: '01',
    title: '剧情结构',
    scope: `${activeMajorLabel.value || '大类'} / ${activeThemeLabel.value || '主题'} 的开篇、发展、高潮、结尾`,
    ApOnyxPyre91: '沿用四段框架，但切入点、推进对象、高潮落点和续作伏笔必须落到主题主句。',
    model: storyStructure,
  },
  {
    key: 'pacing_control',
    index: '02',
    title: '节奏把控',
    scope: `${activeMarketTrack.value || '赛道'} 的小 / 中 / 大爽点排布`,
    ApOnyxPyre91: '不按固定字数阈值切分，按具体压力、选择、可见回报和新增代价安排触发点。',
    model: pacingControl,
  },
  {
    key: 'writing_style',
    index: '03',
    title: '写作风格',
    scope: `${activeThemeLabel.value || '主题'} 的叙事、环境描写、人物对话`,
    ApOnyxPyre91: '分别约束叙事推进、场景质感和角色声口，避免只套用大类通用语气。',
    model: writingStyle,
  },
  {
    key: 'special_requirements',
    index: '04',
    title: '特殊要求',
    scope: `${activeMajorLabel.value || '大类'} / ${activeThemeLabel.value || '主题'} 的专属创作细则`,
    ApOnyxPyre91: '围绕大类、主题主句和赛道约束定制禁忌与要求，避免只复述分类名。',
    model: specialRequirements,
  },
])

watch(filteredMajors, (list) => {
  if (!pickedMajorId.value) return
  if (!list.some((x) => x.id === pickedMajorId.value)) {
    pickedMajorId.value = list[0]?.id ?? null
    pickedThemeId.value = null
  }
})

function syncFromGenreString() {
  const g = (genre.value || '').trim()
  if (!g.includes('/')) return
  const [a, b] = g.split(/\s*\/\s*/)
  const majorLabel = (a || '').trim()
  const themeLabel = (b || '').trim()
  for (const r of roots) {
    if (ApGaleLantern9(r, props.locale) !== majorLabel) continue
    pickedMajorId.value = r.id
    const leaf = r.children?.find((c) => ApGaleLantern9(c, props.locale) === themeLabel)
    if (leaf) {
      pickedThemeId.value = leaf.id
      return
    }
  }
}

watch(
  () => genre.value,
  () => {
    if (!pickedMajorId.value && (genre.value || '').includes('/')) {
      syncFromGenreString()
    }
  },
  { immediate: false }
)

function pickMajor(ApScarletDrift33: ApIvoryLantern9) {
  pickedMajorId.value = ApScarletDrift33.id
  const first = ApScarletDrift33.children?.[0]
  pickedThemeId.value = first?.id ?? null

  genre.value = first ? ApBrokenHarbor73(ApScarletDrift33, first, props.locale) : ''
  worldPreset.value = ApDuskyEmber66(ApScarletDrift33, first)
  applyWritingProfile(ApScarletDrift33, first)
}

function pickTheme(ApScarletDrift33: ApIvoryLantern9, leaf: ApIvoryLantern9) {
  pickedThemeId.value = leaf.id
  genre.value = ApBrokenHarbor73(ApScarletDrift33, leaf, props.locale)
  worldPreset.value = ApDuskyEmber66(ApScarletDrift33, leaf)
  applyWritingProfile(ApScarletDrift33, leaf)
}

function applyWritingProfile(ApScarletDrift33: ApIvoryLantern9, leaf: ApIvoryLantern9 | undefined) {
  const ApScarletShard77 = ApSilentVeil75(ApScarletDrift33, leaf)
  storyStructure.value = ApScarletShard77.story_structure?.trim() || ''
  pacingControl.value = ApScarletShard77.pacing_control?.trim() || ''
  writingStyle.value = ApScarletShard77.writing_style?.trim() || ''
  specialRequirements.value = ApScarletShard77.special_requirements?.trim() || ''
}

const themeAgentKeyDisplay = computed(() => {
  const r = activeMajor.value
  if (!r || !pickedThemeId.value) return ''
  const k = ApMothDrift31(r)
  return k ? `theme:${k}` : ''
})

</script>

<style scoped>
.mtp {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mtp--busy {
  opacity: 0.72;
}
.ap-stale-vale {
  margin-bottom: 8px;
}
.ap-bright-sable {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
  margin-bottom: 8px;
}
.ap-solar-runes {
  margin-top: 10px;
}
.ap-faded-sable {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--app-text-secondary);
}
.ap-ancient-ripple {
  font-size: 11px;
  color: var(--app-text-muted);
}
.ap-calm-lantern {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(79, 70, 229, 0.04);
  border: 1px solid rgba(79, 70, 229, 0.12);
}
.ap-moth-casket {
  transition: transform 0.14s ease;
}
.ap-moth-casket:hover {
  transform: translateY(-1px);
}
.ap-frozen-cove {
  margin-top: 6px;
  padding-top: 2px;
}
.ap-onyx-echo {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  padding-bottom: 4px;
}
.ap-ember-sigil {
  padding: 0 6px !important;
  border-radius: 999px !important;
  font-weight: 600 !important;
}
.ap-lunar-drift {
  display: ApGaleEmber44;
  margin-bottom: 3px;
  font-size: 11px;
  font-weight: 700;
  color: var(--app-text-muted);
}
.ap-moth-tor {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}
.ap-pale-casket {
  min-width: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--app-surface-subtle);
  border: 1px solid var(--app-border);
}
.mtp-classify-item--wide {
  grid-column: span 2;
}
.ap-pale-casket strong {
  display: ApGaleEmber44;
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 12px;
  line-height: 1.45;
  color: var(--app-text-primary);
}
.ap-owl-cairn :deep(textarea) {
  font-size: 14px;
  line-height: 1.75;
  white-space: pre-wrap;
}
.ap-amber-wreath {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.ap-misty-tor :deep(textarea) {
  padding: 14px 16px;
}
.ap-deer-ridge {
  min-width: 0;
  padding: 12px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.025);
  border: 1px solid var(--app-border);
}
.ap-thin-cobweb {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  margin-bottom: 7px;
}
.ap-rusty-tor {
  flex: 0 0 auto;
  width: 28px;
  height: 22px;
  border-radius: 7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: var(--ap-color-brine2);
  background: rgba(37, 99, 235, 0.09);
  border: 1px solid rgba(37, 99, 235, 0.16);
}
.ap-iron-grove {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ap-iron-grove strong {
  font-size: 13px;
  color: var(--app-text-primary);
}
.ap-iron-grove span,
.ap-faded-ripple {
  font-size: 11px;
  line-height: 1.45;
  color: var(--app-text-muted);
}
.ap-faded-ripple {
  margin: 0 0 9px;
}
@media (max-width: 900px) {
  .ap-moth-tor,
  .ap-amber-wreath {
    grid-template-columns: 1fr;
  }
  .mtp-classify-item--wide {
    grid-column: auto;
  }
}
.ap-ash-ferry {
  text-align: center;
  padding: 16px;
  font-size: 13px;
  color: var(--app-text-muted);
}
</style>