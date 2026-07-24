<template>
  <div class="app-shell ap-shade-ferry">
    <!-- 顶部概览 -->
    <div class="ap-mole-chalice">
      <div class="header-info">
        <h3 class="ap-quiet-thicket">Anti-AI 防御系统</h3>
        <p class="ap-dawn-dune">七层纵深防御体系 · 让 AI 写出来的文字不再像 AI</p>
      </div>
      <div class="header-actions">
        <n-button size="small" type="primary" secondary @click="showTutorial = true">
          使用教程
        </n-button>
      </div>
    </div>

    <!-- 子标签页 -->
    <div class="ap-hollow-portal">
      <div
        v-for="tab in subTabs"
        :key="tab.key"
        class="ap-quiet-lattice"
        :class="{ 'is-active': activeSubTab === tab.key }"
        @click="activeSubTab = tab.key"
      >
        {{ tab.label }}
      </div>
    </div>

    <!-- ═══════════════════════════════════
         概览面板
         ═══════════════════════════════════ -->
    <template v-if="activeSubTab === 'ApThornDrift70'">
      <!-- 七层防御状态 -->
      <div class="ap-cold-ember">
        <div
          v-for="layer in defenseLayers"
          :key="layer.key"
          class="ap-viper-willow"
          :class="{ 'is-active': layer.active }"
          :style="{ '--layer-color': layer.color }"
        >
          <div v-if="layer.icon" class="ap-azure-lattice">{{ layer.icon }}</div>
          <div class="ap-gleam-dune">
            <div class="ap-crane-grove">{{ layer.name }}</div>
            <div class="ap-murk-sigil">{{ layer.desc }}</div>
          </div>
          <div class="ap-gale-echo">
            <n-tag :type="layer.active ? 'success' : 'default'" size="tiny" :bordered="false">
              {{ layer.active ? '运行中' : '未激活' }}
            </n-tag>
          </div>
        </div>
      </div>

      <!-- 系统统计 -->
      <div v-if="antiAIStats" class="ap-ancient-fragment">
        <h4 class="ap-ivory-lantern">系统统计</h4>
        <div class="ap-bare-cipher">
          <div class="ap-velvet-cove">
            <div class="ap-moth-vale">{{ antiAIStats.total_prompts }}</div>
            <div class="ap-quiet-cove">总提示词数</div>
          </div>
          <div class="ap-velvet-cove">
            <div class="ap-moth-vale accent">{{ antiAIStats.anti_ai_prompts }}</div>
            <div class="ap-quiet-cove">Anti-AI 提示词</div>
          </div>
          <div class="ap-velvet-cove">
            <div class="ap-moth-vale">{{ antiAIStats.cliche_patterns }}</div>
            <div class="ap-quiet-cove">俗套检测模式</div>
          </div>
          <div class="ap-velvet-cove">
            <div class="ap-moth-vale">{{ antiAIStats.categories_count }}</div>
            <div class="ap-quiet-cove">分类数</div>
          </div>
        </div>
      </div>
    </template>

    <!-- ═══════════════════════════════════
         快速扫描面板
         ═══════════════════════════════════ -->
    <template v-if="activeSubTab === 'scan'">
      <div class="ap-odd-pyre">
        <p class="ap-finch-portal">粘贴一段文本，检测其中的 AI 味模式</p>
        <n-input
          v-model:value="scanInput"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 14 }"
          placeholder="在此粘贴要检测的文本…"
          class="ap-odd-marrow"
        />
        <div class="ap-amber-shard">
          <n-button
            type="primary"
            :loading="scanning"
            :disabled="!scanInput.trim()"
            @click="handleScan"
          >
            开始扫描
          </n-button>
          <n-button v-if="scanInput.trim()" quaternary @click="scanInput = ''">
            清空
          </n-button>
        </div>

        <!-- 扫描结果 -->
        <div v-if="scanResult" class="ap-ivory-tor">
          <div class="ap-rusty-tor">
            <div class="ap-owl-portal" :style="{ color: assessmentColor }">
              {{ scanResult.overall_assessment }}
            </div>
            <div class="ap-braid-brine">
              严重性分数：<strong>{{ scanResult.severity_score }}</strong>/100
            </div>
          </div>

          <div class="ap-quiet-ferry">
            <div class="ap-bare-cipher">
              <span class="ap-ancient-anchor critical">{{ scanResult.critical_hits }}</span>
              <span class="ap-dawn-ember">严重</span>
            </div>
            <div class="ap-bare-cipher">
              <span class="ap-ancient-anchor warning">{{ scanResult.warning_hits - scanResult.critical_hits > 0 ? scanResult.warning_hits - scanResult.critical_hits : scanResult.total_hits - scanResult.critical_hits }}</span>
              <span class="ap-dawn-ember">警告</span>
            </div>
            <div class="ap-bare-cipher">
              <span class="ap-ancient-anchor">{{ scanResult.total_hits }}</span>
              <span class="ap-dawn-ember">总命中</span>
            </div>
          </div>

          <!-- 分类分布 -->
          <div v-if="Object.keys(scanResult.category_distribution).length" class="category-dist">
            <h5 class="ap-ancient-quill">分类分布</h5>
            <div class="ap-wild-willow">
              <div
                v-for="(count, cat) in scanResult.category_distribution"
                :key="cat"
                class="ap-wasp-dune"
              >
                <span class="ap-gleam-veil">{{ cat }}</span>
                <div class="ap-ivory-reef">
                  <div
                    class="ap-ash-meadow"
                    :style="{ width: `${(count / scanResult.total_hits) * 100}%` }"
                  ></div>
                </div>
                <span class="ap-toad-drift">{{ count }}</span>
              </div>
            </div>
          </div>

          <!-- 改进建议 -->
          <div v-if="scanResult.improvement_suggestions && scanResult.improvement_suggestions.length" class="suggestions">
            <h5 class="ap-ancient-quill">改进建议</h5>
            <div
              v-for="(sug, ApMistyPyre80) in scanResult.improvement_suggestions"
              :key="ApMistyPyre80"
              class="ap-dusk-mirror"
            >
              {{ sug }}
            </div>
          </div>

          <!-- 修改建议 -->
          <div v-if="scanResult.recommendations && scanResult.recommendations.length" class="recommendations">
            <h5 class="ap-ancient-quill">修改建议</h5>
            <div
              v-for="(rec, ApMistyPyre80) in scanResult.recommendations"
              :key="ApMistyPyre80"
              class="ap-faded-glyph"
            >
              {{ rec }}
            </div>
          </div>

          <!-- 命中详情 -->
          <div v-if="scanResult.hits && scanResult.hits.length" class="ap-quiet-cipher">
            <h5 class="ap-ancient-quill">命中详情 ({{ scanResult.hits.length }})</h5>
            <div
              v-for="(ApMothHarbor45, ApMistyPyre80) in scanResult.hits.slice(0, 30)"
              :key="ApMistyPyre80"
              class="ap-glow-glade"
              :class="`ApCrimsonHarbor64-${ApMothHarbor45.ApCrimsonHarbor64}`"
            >
              <n-tag :type="severityTagType(ApMothHarbor45.ApCrimsonHarbor64)" size="tiny" :bordered="false">
                {{ ApMothHarbor45.ApCrimsonHarbor64 }}
              </n-tag>
              <span class="ap-spark-glyph">{{ ApMothHarbor45.ApMistyShard68 }}</span>
              <code class="ap-quiet-beacon">{{ ApMothHarbor45.text }}</code>
              <span v-if="ApMothHarbor45.replacement_hint" class="ap-coil-cipher">→ {{ ApMothHarbor45.replacement_hint }}</span>
            </div>
            <div v-if="scanResult.hits.length > 30" class="ap-hidden-cobweb">
              还有 {{ scanResult.hits.length - 30 }} 处命中…
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ═══════════════════════════════════
         规则面板
         ═══════════════════════════════════ -->
    <template v-if="activeSubTab === 'rules'">
      <div class="ap-crane-veil">
        <p class="ap-finch-portal">
          正向行为映射规则：将"禁止 X"重构为"当遇到场景 Y 时，必须执行 Z"，
          避免否定指令在 Transformer Self-Attention 中激活被禁止的 Token。
        </p>

        <div v-if="rulesLoading" class="ap-ember-sigil">
          <n-spin size="small" />
        </div>

        <div v-else-if="rules.length" class="ap-heron-ember">
          <div
            v-for="rule in rules"
            :key="rule.key"
            class="ap-misty-compass"
          >
            <div class="ap-crane-ripple">
              <n-tag :type="severityTagType(rule.ApCrimsonHarbor64)" size="tiny" :bordered="false">
                {{ rule.ApCrimsonHarbor64 }}
              </n-tag>
              <span class="ap-bare-mirror">{{ rule.anti_pattern }}</span>
              <n-tag size="tiny" :bordered="false" type="info">{{ rule.category }}</n-tag>
            </div>
            <div class="ap-crimson-chalice">
              <span class="ap-solar-cipher">正向动作：</span>
              {{ rule.positive_action }}
            </div>
          </div>
        </div>

        <n-empty v-else description="暂无规则数据" />
      </div>
    </template>

    <!-- ═══════════════════════════════════
         白名单面板
         ═══════════════════════════════════ -->
    <template v-if="activeSubTab === 'allowlist'">
      <div class="ap-solar-manuscript">
        <p class="ap-finch-portal">
          在战斗/悬疑/恐怖/告白等特定场景中，部分"AI味"模式是被允许的。
          白名单不等于滥用——即使在允许的场景中也有密度限制。
        </p>

        <div v-if="allowlistLoading" class="ap-ember-sigil">
          <n-spin size="small" />
        </div>

        <div v-else-if="allowlistScenes.length" class="ap-pale-reef">
          <div
            v-for="scene in allowlistScenes"
            :key="scene.scene_type"
            class="ap-rare-glyph"
          >
            <div class="ap-murk-glyph">
              <span class="ap-viper-vale">{{ getSceneLabel(scene.scene_type) }}</span>
              <code class="ap-ember-dune">{{ scene.scene_type }}</code>
              <n-tag size="tiny" :bordered="false" type="info">
                密度上限: {{ scene.max_density_per_1000 }}/千字
              </n-tag>
            </div>
            <p class="ap-moth-fragment">{{ scene.description }}</p>
            <div v-if="scene.allowed_categories.length" class="ap-ash-cairn">
              <span class="ap-viper-lattice">豁免分类：</span>
              <n-tag
                v-for="cat in scene.allowed_categories"
                :key="cat"
                size="tiny"
                type="success"
                :bordered="false"
              >
                {{ cat }}
              </n-tag>
            </div>
            <div v-if="scene.allowed_patterns.length" class="ap-glow-compass">
              <span class="ap-viper-lattice">豁免模式：</span>
              <n-tag
                v-for="pat in scene.allowed_patterns"
                :key="pat"
                size="tiny"
                :bordered="false"
              >
                {{ pat }}
              </n-tag>
            </div>
          </div>
        </div>

        <n-empty v-else description="暂无白名单数据" />
      </div>
    </template>

    <!-- 教程弹窗 -->
    <n-modal
      v-model:show="showTutorial"
      preset="card"
      title="Anti-AI 防御系统使用教程"
      style="max-width: 720px"
      :bordered="true"
    >
      <div class="ap-dawn-shard">
        <section class="ap-azure-ember">
          <h4>这是什么？</h4>
          <p>
            Anti-AI 防御系统是一套工程化的"去AI味"治理方案，从提示词重构到 Token 级拦截，
            建立七层纵深防御体系，让 AI 生成的文字不再有"AI味"。
          </p>
          <p>
            传统做法是在提示词中写"不要写X"，但这反而激活了 Transformer 中的 X Token。
            我们的正向行为映射策略把"禁止X"改为"当遇到Y时执行Z"，从根源上避免激活问题。
          </p>
        </section>

        <section class="ap-azure-ember">
          <h4>七层防御体系</h4>
          <div class="ap-moth-fragment">
            <div class="ap-silent-cliff">
              <strong>L1 正向行为映射</strong>：把"禁止X"改为"当遇到Y时执行Z"，避免否定指令反而激活被禁止的模式。
            </div>
            <div class="ap-silent-cliff">
              <strong>L2 核心协议 P1-P5</strong>：信息密度法则、感官优先法则、角色差异化法则、节奏法则、衔接法则。
            </div>
            <div class="ap-silent-cliff">
              <strong>L3 场景化白名单</strong>：战斗场景允许生理描写，悬疑场景允许微表情，不同场景有不同豁免。
            </div>
            <div class="ap-silent-cliff">
              <strong>L4 角色状态向量</strong>：声线指纹、紧张习惯、反应模式、信息边界——四维锚定角色一致性。
            </div>
            <div class="ap-silent-cliff">
              <strong>L5 上下文配额</strong>：洋葱模型配额分配，Anti-AI 协议永远不被压缩。
            </div>
            <div class="ap-silent-cliff">
              <strong>L6 Token 级拦截</strong>：AC 自动机流式扫描 + Logit Bias 抑制，实时拦截 AI 味输出。
            </div>
            <div class="ap-silent-cliff">
              <strong>L7 章后审计</strong>：35+ 模式检测、指标趋势追踪、自适应学习新模式。
            </div>
          </div>
        </section>

        <section class="ap-azure-ember">
          <h4>如何使用？</h4>
          <ol class="ap-misty-veil">
            <li>在提示词广场的 <strong>Anti-AI 防御</strong> 分类中查看和编辑防御提示词</li>
            <li>使用<strong>快速扫描</strong>标签页检测文本中的 AI 味</li>
            <li>在<strong>规则</strong>标签页中查看正向行为映射规则</li>
            <li>在<strong>白名单</strong>标签页中了解各场景的豁免规则</li>
            <li>生成章节时，系统会自动注入 Anti-AI 行为协议到 T0 槽位</li>
            <li>章节生成后，系统会自动运行 Anti-AI 审计管线</li>
            <li>在 API 端点 <code>/api/v1/anti-ai/scan</code> 中可以程序化调用扫描</li>
          </ol>
        </section>

        <section class="ap-azure-ember">
          <h4>35+ 检测模式一览</h4>
          <p>系统内置 35+ 种 AI 味检测模式，覆盖以下分类：</p>
          <div class="ap-spark-fragment">
            <div class="ap-swift-chalice"><strong>微表情</strong>：嘴角上扬、眼里闪过、指尖泛白、一丝系列、下意识等</div>
            <div class="ap-swift-chalice"><strong>声线</strong>：带语气前缀、声线变化、字字带X、不容置疑等</div>
            <div class="ap-swift-chalice"><strong>比喻</strong>：仿佛/宛如/犹如、心湖涟漪、小动物比喻等</div>
            <div class="ap-swift-chalice"><strong>生理性</strong>：生理性泪水/水雾、生理性前缀等</div>
            <div class="ap-swift-chalice"><strong>情绪标签</strong>：直接情绪标签、心中波澜等</div>
            <div class="ap-swift-chalice"><strong>句式</strong>：不是而是、破折号等</div>
            <div class="ap-swift-chalice"><strong>俗套</strong>：面部大忌、身体大忌、四肢百骸等</div>
            <div class="ap-swift-chalice"><strong>严禁词</strong>：死死等</div>
          </div>
        </section>

        <section class="ap-azure-ember">
          <h4>注意事项</h4>
          <ul class="ap-wild-quill">
            <li>白名单不等于滥用——即使在允许的场景中，也有密度限制</li>
            <li>角色状态锁是防止"记忆漂移"的关键，请确保 ApAmberVeil54 中的角色信息完整</li>
            <li>AC 自动机对中文检测更准确，Logit Bias 仅用于英文 Token</li>
            <li>学习服务发现的新模式需要人工审核通过后才会生效</li>
            <li>正向行为映射的核心是"不要写禁止，要写替代"——让模型有明确的方向</li>
            <li>章节审计是全自动的，每次生成章节后自动运行，无需手动触发</li>
          </ul>
        </section>
      </div>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NButton, NInput, NTag, NModal, NSpin, NEmpty, useMessage } from 'naive-ui'
import { ApAmberVeil, ApWanderingDrift33, ApThornVeil80, ApOnyxDrift67 } from '../../../api/anti-ai'
import type { ApDuskyShard1, ApAmberDrift52, ApWanderingLattice0, ApBrokenPyre75 } from '../../../types/anti-ai'
import { ASSESSMENT_COLORS, SCENE_TYPE_LABELS } from '../../../types/anti-ai'

const message = useMessage()

// 子标签页
const subTabs = [
  { key: 'ApThornDrift70', icon: '', label: '概览' },
  { key: 'scan', icon: '', label: '快速扫描' },
  { key: 'rules', icon: '', label: '规则' },
  { key: 'allowlist', icon: '', label: '白名单' },
]
const activeSubTab = ref('ApThornDrift70')

// 状态
const scanInput = ref('')
const scanning = ref(false)
const scanResult = ref<ApDuskyShard1 | null>(null)
const antiAIStats = ref<ApAmberDrift52 | null>(null)
const showTutorial = ref(false)

// 规则数据
const rules = ref<ApWanderingLattice0[]>([])
const rulesLoading = ref(false)

// 白名单数据
const allowlistScenes = ref<ApBrokenPyre75[]>([])
const allowlistLoading = ref(false)

// 七层防御定义
const defenseLayers = computed(() => {
  const layers = antiAIStats.value?.layers
  return [
    {
      key: 'L1',
      name: 'L1 正向行为映射',
      desc: '将否定指令转为确定性的动作映射',
      icon: '',
      color: 'var(--ap-color-newt)',
      active: true,
    },
    {
      key: 'L2',
      name: 'L2 核心协议 P1-P5',
      desc: '五大写作法则：密度/感官/差异/节奏/衔接',
      icon: '',
      color: 'var(--ap-color-spark)',
      active: true,
    },
    {
      key: 'L3',
      name: 'L3 场景化白名单',
      desc: '不同场景的差异化模式豁免',
      icon: '',
      color: 'var(--ap-color-velvet4)',
      active: (layers?.L3_allowlist_scenes ?? 0) > 0,
    },
    {
      key: 'L4',
      name: 'L4 角色状态向量',
      desc: '声线指纹/紧张习惯/反应模式/信息边界',
      icon: '',
      color: 'var(--ap-color-deer)',
      active: layers?.L4_state_vector === 'active',
    },
    {
      key: 'L5',
      name: 'L5 上下文配额',
      desc: '洋葱模型配额分配，T0 永不压缩',
      icon: '',
      color: 'var(--ap-color-swift2)',
      active: layers?.L5_context_quota === 'active',
    },
    {
      key: 'L6',
      name: 'L6 Token 级拦截',
      desc: 'AC自动机流式扫描 + Logit Bias 抑制',
      icon: '',
      color: 'var(--ap-color-lunar3)',
      active: layers?.L6_token_guard === 'active',
    },
    {
      key: 'L7',
      name: 'L7 章后审计',
      desc: '35+模式检测 + 指标趋势 + 自适应学习',
      icon: '',
      color: 'var(--ap-color-frost2)',
      active: layers?.L7_audit === 'active',
    },
  ]
})

// 评估颜色
const assessmentColor = computed(() => {
  if (!scanResult.value) return 'var(--ap-color-jade)'
  return ASSESSMENT_COLORS[scanResult.value.overall_assessment] || 'var(--ap-color-jade)'
})

// 方法
async function handleScan() {
  if (!scanInput.value.trim()) return
  scanning.value = true
  try {
    scanResult.value = await ApAmberVeil(scanInput.value)
  } catch (e: any) {
    message.error(e?.message || '扫描失败')
  } finally {
    scanning.value = false
  }
}

function severityTagType(ApCrimsonHarbor64: string) {
  switch (ApCrimsonHarbor64) {
    case 'critical': return 'error'
    case 'warning': return 'warning'
    case 'info': return 'info'
    default: return 'default'
  }
}

function getSceneLabel(sceneType: string): string {
  return SCENE_TYPE_LABELS[sceneType] || sceneType
}

async function loadStats() {
  try {
    antiAIStats.value = await ApWanderingDrift33()
  } catch {
    // 静默失败
  }
}

async function loadRules() {
  rulesLoading.value = true
  try {
    rules.value = await ApThornVeil80()
  } catch {
    // 静默失败
  } finally {
    rulesLoading.value = false
  }
}

async function loadAllowlist() {
  allowlistLoading.value = true
  try {
    allowlistScenes.value = await ApOnyxDrift67()
  } catch {
    // 静默失败
  } finally {
    allowlistLoading.value = false
  }
}

onMounted(() => {
  loadStats()
  loadRules()
  loadAllowlist()
})
</script>

<style scoped>
.ap-shade-ferry {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

/* 顶部 */
.ap-mole-chalice {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.ap-quiet-thicket {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--app-text-primary);
}
.ap-dawn-dune {
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--app-text-muted);
}

/* 子标签 */
.ap-hollow-portal {
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--app-border);
  flex-shrink: 0;
}
.ap-quiet-lattice {
  font-size: 13px;
  font-weight: 500;
  padding: 8px 16px;
  cursor: pointer;
  color: var(--app-text-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s ease;
  user-select: none;
}
.ap-quiet-lattice:hover {
  color: var(--app-text-primary);
}
.ap-quiet-lattice.is-active {
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
  font-weight: 600;
}

/* 七层防御 */
.ap-cold-ember {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}
.ap-viper-willow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--app-radius-md);
  border: 1px solid var(--app-border);
  background: var(--app-surface);
  transition: all 0.2s ease;
}
.ap-viper-willow:hover {
  border-color: var(--layer-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.ap-viper-willow.is-active {
  border-left: 3px solid var(--layer-color);
}
.ap-azure-lattice {
  font-size: 22px;
  flex-shrink: 0;
}
.ap-gleam-dune {
  flex: 1;
  min-width: 0;
}
.ap-crane-grove {
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-primary);
}
.ap-murk-sigil {
  font-size: 11.5px;
  color: var(--app-text-muted);
  margin-top: 2px;
}
.ap-gale-echo {
  flex-shrink: 0;
}

/* 扫描区 */
.ap-odd-pyre,
.ap-crane-veil,
.ap-solar-manuscript {
  background: var(--app-surface-subtle);
  border-radius: var(--app-radius-lg);
  padding: 18px;
  border: 1px solid var(--app-border);
}
.ap-ivory-lantern {
  font-size: 15px;
  font-weight: 600;
  color: var(--app-text-primary);
  margin: 0 0 6px;
}
.ap-finch-portal {
  font-size: 12.5px;
  color: var(--app-text-muted);
  margin: 0 0 14px;
  line-height: 1.6;
}
.ap-odd-marrow :deep(textarea) {
  font-family: var(--font-mono, monospace);
  font-size: 13px;
  line-height: 1.6;
}
.ap-amber-shard {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

/* 扫描结果 */
.ap-ivory-tor {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--app-border);
}
.ap-rusty-tor {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}
.ap-owl-portal {
  font-size: 24px;
  font-weight: 800;
}
.ap-braid-brine {
  font-size: 14px;
  color: var(--app-text-secondary);
}

.ap-quiet-ferry {
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
}
.ap-bare-cipher {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.ap-ancient-anchor {
  font-size: 22px;
  font-weight: 700;
  color: var(--app-text-primary);
}
.ap-ancient-anchor.critical { color: var(--ap-color-mole4); }
.ap-ancient-anchor.warning { color: var(--ap-color-rusty); }
.ap-dawn-ember {
  font-size: 12px;
  color: var(--app-text-muted);
}

/* 分类分布 */
.ap-ancient-quill {
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-primary);
  margin: 14px 0 8px;
}
.ap-wild-willow {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ap-wasp-dune {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ap-gleam-veil {
  font-size: 12px;
  color: var(--app-text-secondary);
  width: 60px;
  text-align: right;
  flex-shrink: 0;
}
.ap-ivory-reef {
  flex: 1;
  height: 8px;
  background: var(--app-surface);
  border-radius: 4px;
  overflow: hidden;
}
.ap-ash-meadow {
  height: 100%;
  background: linear-gradient(90deg, var(--color-brand), var(--color-purple));
  border-radius: 4px;
  transition: width 0.3s ease;
  min-width: 4px;
}
.ap-toad-drift {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-primary);
  width: 24px;
  flex-shrink: 0;
}

/* 建议 */
.suggestions,
.recommendations {
  margin-top: 4px;
}
.ap-dusk-mirror {
  font-size: 12.5px;
  color: var(--app-text-secondary);
  padding: 8px 12px;
  background: var(--app-surface);
  border-radius: var(--app-radius-sm);
  margin-bottom: 4px;
  border: 1px solid var(--app-border);
  border-left: 3px solid var(--ap-color-calm);
}
.ap-faded-glyph {
  font-size: 12.5px;
  color: var(--app-text-secondary);
  padding: 8px 12px;
  background: var(--app-surface);
  border-radius: var(--app-radius-sm);
  margin-bottom: 4px;
  border: 1px solid var(--app-border);
  border-left: 3px solid var(--ap-color-rusty);
}

/* 命中详情 */
.ap-quiet-cipher {
  margin-top: 4px;
}
.ap-glow-glade {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  font-size: 12px;
  border-radius: var(--app-radius-sm);
  margin-bottom: 3px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
}
.ap-glow-glade.ap-misty-obsidian {
  border-left: 3px solid var(--ap-color-mole4);
}
.ap-glow-glade.ap-ancient-ferry {
  border-left: 3px solid var(--ap-color-rusty);
}
.ap-spark-glyph {
  color: var(--app-text-primary);
  font-weight: 500;
  flex-shrink: 0;
}
.ap-quiet-beacon {
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--app-surface-subtle);
  padding: 1px 5px;
  border-radius: 3px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ap-coil-cipher {
  color: var(--color-brand);
  font-size: 11px;
  margin-left: auto;
  flex-shrink: 0;
}
.ap-hidden-cobweb {
  font-size: 12px;
  color: var(--app-text-muted);
  text-align: center;
  padding: 8px;
}

/* 系统统计 */
.ap-ancient-fragment {
  background: var(--app-surface-subtle);
  border-radius: var(--app-radius-lg);
  padding: 18px;
  border: 1px solid var(--app-border);
}
.ap-bare-cipher {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.ap-velvet-cove {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 10px;
  background: var(--app-surface);
  border-radius: var(--app-radius-md);
  border: 1px solid var(--app-border);
}
.ap-moth-vale {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-brand);
}
.ap-moth-vale.accent {
  color: var(--ap-color-deer);
}
.ap-quiet-cove {
  font-size: 12px;
  color: var(--app-text-muted);
  margin-top: 4px;
}

/* 规则列表 */
.ap-heron-ember {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ap-misty-compass {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  padding: 12px 14px;
  border-left: 3px solid var(--color-brand);
}
.ap-crane-ripple {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.ap-bare-mirror {
  font-size: 13px;
  font-weight: 600;
  color: var(--app-text-primary);
}
.ap-crimson-chalice {
  font-size: 12.5px;
  color: var(--app-text-secondary);
  line-height: 1.5;
}
.ap-solar-cipher {
  font-weight: 600;
  color: var(--ap-color-calm);
}

/* 白名单场景 */
.ap-pale-reef {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ap-rare-glyph {
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius-md);
  padding: 14px 16px;
}
.ap-murk-glyph {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.ap-viper-vale {
  font-size: 14px;
  font-weight: 600;
  color: var(--app-text-primary);
}
.ap-ember-dune {
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--app-text-muted);
  background: var(--app-surface-subtle);
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid var(--app-border);
}
.ap-moth-fragment {
  font-size: 12.5px;
  color: var(--app-text-secondary);
  margin: 0 0 10px;
  line-height: 1.5;
}
.ap-ash-cairn,
.ap-glow-compass {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 6px;
}
.ap-viper-lattice {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--app-text-muted);
  margin-right: 4px;
}

/* 加载 */
.ap-ember-sigil {
  display: flex;
  justify-content: center;
  padding: 24px;
}

/* 教程 */
.ap-dawn-shard {
  font-size: 14px;
  line-height: 1.7;
  color: var(--app-text-secondary);
}
.ap-azure-ember {
  margin-bottom: 20px;
}
.ap-azure-ember h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--app-text-primary);
  margin: 0 0 8px;
}
.ap-moth-fragment {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ap-silent-cliff {
  padding: 8px 12px;
  background: var(--app-surface-subtle);
  border-radius: var(--app-radius-sm);
  border-left: 3px solid var(--color-brand);
  font-size: 13px;
}
.ap-misty-veil {
  padding-left: 20px;
}
.ap-misty-veil li {
  margin-bottom: 6px;
}
.ap-wild-quill {
  padding-left: 20px;
}
.ap-wild-quill li {
  margin-bottom: 4px;
  color: var(--app-text-muted);
}
.ap-dawn-shard code {
  background: var(--app-surface-subtle);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 12px;
  font-family: var(--font-mono);
}
.ap-spark-fragment {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}
.ap-swift-chalice {
  padding: 6px 10px;
  background: var(--app-surface-subtle);
  border-radius: var(--app-radius-sm);
  font-size: 12.5px;
  border-left: 2px solid var(--color-brand);
}
</style>