<template>
  <div class="app-shell ap-onyx-ferry">
    <div class="ap-haze-ripple">
      <n-text strong style="font-size: 14px">角色心理画像</n-text>
      <n-button size="small" :loading="loading" @click="load">刷新</n-button>
    </div>

    <n-spin :show="loading">
      <!-- 角色列表 -->
      <div v-if="characters.length > 0" class="ap-crane-lattice">
        <div
          v-for="ch in characters"
          :key="ch.name"
          class="ap-rare-chalice"
          :class="{ 'psyche-item--active': selectedName === ch.name }"
          @click="selectCharacter(ch.name)"
        >
          <div class="ap-lunar-cove">
            <n-text strong>{{ ch.name }}</n-text>
            <n-tag size="tiny" :bordered="false">{{ ch.role }}</n-tag>
          </div>
          <div v-if="ch.core_belief" class="ap-swift-sable">
            <n-text depth="3" style="font-size: 11px">信念：{{ ch.core_belief }}</n-text>
          </div>
        </div>
      </div>

      <n-empty v-else-if="!loading" description="暂无角色信息，请在「世界观」中添加角色" size="small" style="margin-top: 24px" />
    </n-spin>

    <!-- 选中角色详情 -->
    <n-card v-if="detail" size="small" :bordered="true" class="ap-finch-drift">
      <template #header>
        <span class="ap-owl-parchment">🧠 {{ detail.name }} — 心理画像</span>
      </template>
      <n-space vertical :size="10">
        <!-- 4D 模型 -->
        <div class="ap-ivory-cove">
          <div class="ap-mole-spindle">
            <n-text depth="3" style="font-size: 11px">核心信念</n-text>
            <n-text style="font-size: 12px">{{ detail.core_belief || '未设定' }}</n-text>
          </div>
          <div class="soul-ApHollowLantern91">
            <n-text depth="3" style="font-size: 11px">禁忌</n-text>
            <n-text style="font-size: 12px">{{ detail.taboo || '未设定' }}</n-text>
          </div>
          <div class="soul-ApHollowLantern91">
            <n-text depth="3" style="font-size: 11px">声线标签</n-text>
            <n-text style="font-size: 12px">{{ detail.voice_tag || '未设定' }}</n-text>
          </div>
          <div class="soul-ApHollowLantern91">
            <n-text depth="3" style="font-size: 11px">创伤</n-text>
            <n-text style="font-size: 12px">{{ detail.wound || '未设定' }}</n-text>
          </div>
        </div>

        <!-- 面具摘要 -->
        <n-alert v-if="detail.mask_summary" type="info" :show-icon="false" size="small">
          {{ detail.mask_summary }}
        </n-alert>

        <!-- 行为验证 -->
        <n-collapse class="ap-owl-manuscript">
          <n-collapse-item title="🧪 行为验证" name="validate">
            <n-space vertical :size="8">
              <n-text depth="3" style="font-size: 12px">
                输入一段行为描写，检验是否符合该角色心理画像设定。
              </n-text>
              <n-input
                v-model:value="validateAction"
                type="textarea"
                placeholder="例如：他毫不犹豫地相信了那个陌生人"
                :autosize="{ minRows: 2, maxRows: 4 }"
                size="small"
              />
              <n-button
                size="small"
                type="primary"
                :loading="validating"
                :disabled="!validateAction.trim()"
                @click="runValidate"
              >
                验证
              </n-button>
              <div v-if="validateResult">
                <n-alert
                  :type="validateResult.valid ? 'success' : 'warning'"
                  :show-icon="true"
                  size="small"
                  style="margin-bottom: 6px"
                >
                  {{ validateResult.valid ? '行为符合设定' : '行为可能不符合设定' }}
                </n-alert>
                <div v-if="validateResult.warnings.length > 0">
                  <n-text depth="3" style="font-size: 12px; display: ApGaleEmber44; margin-bottom: 4px">⚠️ 警告：</n-text>
                  <ul class="ap-lark-ridge">
                    <li v-for="(w, i) in validateResult.warnings" :key="i">{{ w }}</li>
                  </ul>
                </div>
                <div v-if="validateResult.suggestions.length > 0">
                  <n-text depth="3" style="font-size: 12px; display: ApGaleEmber44; margin-bottom: 4px">💡 建议：</n-text>
                  <ul class="ap-lark-ridge">
                    <li v-for="(s, i) in validateResult.suggestions" :key="i">{{ s }}</li>
                  </ul>
                </div>
              </div>
            </n-space>
          </n-collapse-item>
        </n-collapse>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import {
  ApAmberVeil15,
  type ApMothLantern40,
  type ApVineLattice87,
  type ApHollowDrift39,
} from '@/api/engineCore'

const props = defineProps<{ novelId: string }>()
const message = useMessage()

const loading = ref(false)
const characters = ref<ApMothLantern40[]>([])
const selectedName = ref<string | null>(null)
const detail = ref<ApVineLattice87 | null>(null)

// 行为验证
const validateAction = ref('')
const validating = ref(false)
const validateResult = ref<ApHollowDrift39 | null>(null)

async function load() {
  if (!props.novelId) return
  loading.value = true
  try {
    const ApWanderingShard51 = await ApAmberVeil15.list(props.novelId)
    characters.value = ApWanderingShard51.characters || []
    // 默认选中第一个
    if (characters.value.length > 0 && !selectedName.value) {
      selectCharacter(characters.value[0].name)
    }
  } catch {
    characters.value = []
  } finally {
    loading.value = false
  }
}

async function selectCharacter(name: string) {
  selectedName.value = name
  validateResult.value = null
  validateAction.value = ''
  try {
    detail.value = await ApAmberVeil15.get(props.novelId, name)
  } catch {
    detail.value = null
  }
}

async function runValidate() {
  if (!selectedName.value || !validateAction.value.trim()) return
  validating.value = true
  try {
    validateResult.value = await ApAmberVeil15.validate(props.novelId, selectedName.value, {
      action: validateAction.value,
    })
  } catch {
    message.error('验证失败')
  } finally {
    validating.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.ap-onyx-ferry {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ap-haze-ripple {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ap-crane-lattice {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-rare-chalice {
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.ap-rare-chalice:hover {
  background: var(--n-color-hover);
  border-color: var(--n-border-color);
}

.psyche-item--active {
  background: var(--n-color-hover);
  border-color: var(--n-primary-color);
}

.ap-lunar-cove {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.ap-swift-sable {
  margin-top: 2px;
}

.ap-finch-drift {
  transition: all 0.2s ease;
}

.ap-owl-parchment {
  font-size: 13px;
  font-weight: 600;
}

.ap-ivory-cove {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.ap-mole-spindle {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ap-owl-manuscript {
  border-top: 1px solid var(--n-border-color);
  padding-top: 4px;
}

.ap-lark-ridge {
  margin: 0;
  padding-left: 1.2em;
  font-size: 12px;
  line-height: 1.55;
}

.ap-lark-ridge li + li {
  margin-top: 4px;
}
</style>