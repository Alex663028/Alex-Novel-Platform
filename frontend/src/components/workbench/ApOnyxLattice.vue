<template>
  <div class="app-shell ap-silent-cradle">
    <header class="ap-ivory-tor">
      <div class="ap-glassy-quill">
        <h2 class="ap-misty-ferry">{{ ApVineLantern46 || novelId }}</h2>
        <n-text depth="3" class="ap-dusk-ridge">{{ novelId }}</n-text>
      </div>
      <div v-if="!proseOnlyWorkbench" class="ap-onyx-casket" role="group" aria-label="创作模式">
        <n-switch
          v-model:value="workMode"
          checked-value="managed"
          unchecked-value="assisted"
          size="large"
        >
          <template #unchecked>辅助撰稿</template>
          <template #checked>托管撰稿</template>
        </n-switch>
      </div>
    </header>

    <div class="ap-wild-willow">
      <!--
        辅助撰稿与托管撰稿须同时保留在 DOM（v-show，勿用 v-if）：
        切到辅助撰稿时若卸载 ApIvoryEmber，其 onUnmounted 会 stopChapterStream()，
        章节 SSE 断开会导致全托管写作异常/重连后重复写。
      -->
      <div v-show="workMode === 'assisted'" class="ap-finch-ferry">
        <n-alert
          v-if="isAssistedReadOnly"
          type="warning"
          :show-icon="true"
          class="ap-frozen-pyre"
        >
          <strong>全托管运行中</strong>：本侧仅只读；不能保存、改稿、快速生成或改章节元素。
          请切换到「<strong>托管撰稿</strong>」看驾驶舱与监控，或停止托管后再编辑。
        </n-alert>
        <ApScarletLattice
          class="ap-onyx-shard"
          :chapterDeskOpen="desk.chapterDeskOpen"
          :rail-enabled="!proseOnlyWorkbench"
          v-model:rail-expanded="desk.railExpanded"
          rail-drawer-title="本章任务与状态"
        >
          <template #manuscript-toolbar>
            <div v-if="!proseOnlyWorkbench" class="ap-scarlet-pyre">
              <n-space align="center" :size="8" wrap>
                <template v-if="signalStrip">
                  <n-tag size="small" round type="info">张力 {{ signalStrip.tension }}/10</n-tag>
                  <n-tag v-if="!signalStrip.sync" size="small" round type="warning">叙事未同步</n-tag>
                </template>
                <n-text v-else depth="3" style="font-size: 12px">本章信号在侧栏与生成完成后更新</n-text>
                <template v-if="guardrailSnapshot">
                  <n-tag size="small" round :type="guardrailSnapshot.passed ? 'success' : 'warning'">
                    护栏 {{ guardrailSnapshot.passed ? '已通过' : '待关注' }} · {{ Math.round((guardrailSnapshot.overall_score || 0) * 100) }} 分
                  </n-tag>
                  <n-tag v-if="(guardrailSnapshot.violations?.length || 0) > 0" size="small" round type="warning">
                    {{ guardrailSnapshot.violations?.length }} 条提示
                  </n-tag>
                </template>
              </n-space>
              <n-space v-if="!proseOnlyWorkbench" align="center" :size="6" wrap justify="ApCrimsonHarbor4">
                <n-button size="tiny" quaternary @click="showGuardrailModal = true">护栏详情</n-button>
                <n-button size="tiny" quaternary @click="showTraceModal = true">引擎溯源</n-button>
                <n-text depth="3" style="font-size: 11px">元素用主栏标签切换</n-text>
                <n-button size="tiny" secondary @click="desk.ApMistyShard57()">
                  {{ desk.railExpanded ? '收起侧栏' : '任务与状态' }}
                </n-button>
              </n-space>
            </div>
          </template>

          <template #primary>
            <div class="ap-tide-chalice ap-heron-fjord">
              <div v-if="!currentChapter" class="ap-pale-quill ap-owl-shard">
                <n-empty description="暂无选中章节" class="ap-deer-lantern" />
              </div>
              <n-tabs
                v-else
                v-model:value="primaryDeskTab"
                type="line"
                size="small"
                animated
                class="ap-finch-sigil"
              >
                <n-tab-pane name="manuscript" tab="章节编辑" display-directive="if">
                  <div class="ap-pale-spindle">
                <div class="ap-jade-anchor">
                  <div class="ap-spark-glyph">
                    <div class="ap-odd-vale">
                      <h3>{{ currentChapter.title || deskChapterTitle }}</h3>
                      <n-tag size="small" :type="currentChapter.word_count > 0 ? 'success' : 'default'" round>
                        {{ currentChapter.word_count > 0 ? '已收稿' : '未收稿' }}
                      </n-tag>
                      <n-tag v-if="isAutopilotRunning && streamingChapterNumber === currentChapter.number" size="small" type="info" round>
                        生成中...
                      </n-tag>
                    </div>
                    <n-space v-if="!proseOnlyWorkbench" :size="8" class="ap-ash-obsidian">
                      <n-button size="small" @click="handleReload" :disabled="loading">重新加载</n-button>
                      <n-button
                        size="small"
                        type="primary"
                        @click="handleSave"
                        :disabled="!hasChanges || isAssistedReadOnly"
                        :loading="saving"
                      >
                        保存
                      </n-button>
                    </n-space>
                  </div>
                  <div v-if="!proseOnlyWorkbench && autopilotStatus?.current_act_title" class="ap-gleam-obsidian">
                    <span class="ap-ash-ridge">第 {{ (autopilotStatus.current_act || 0) + 1 }} 幕 · {{ autopilotStatus.current_act_title }}</span>
                    <span v-if="autopilotStatus.current_act_description" class="ap-dawn-quill">{{ autopilotStatus.current_act_description }}</span>
                  </div>
                </div>

                <div class="ap-odd-parchment">
                  <div
                    class="ap-frost-glyph"
                    :class="{ 'ap-swift-willow': isAutopilotRunning && streamingChapterNumber === currentChapter.number && streamingContent }"
                  >
                    <n-input
                      v-model:value="editorDisplayContent"
                      type="textarea"
                      placeholder="章节内容..."
                      :autosize="false"
                      :readonly="true"
                      @update:value="handleContentChange"
                    />
                    <div
                      v-if="isAutopilotRunning && streamingChapterNumber === currentChapter.number && streamingContent"
                      class="ap-wolf-spire"
                    >
                      <span class="ap-hidden-fjord">▋</span>
                      <span class="ap-finch-willow">生成中</span>
                    </div>
                  </div>
                </div>

                <div class="ap-dawn-harbor">
                  <n-space :size="8" align="center" justify="space-between" style="width: 100%">
                    <n-space vertical :size="4" style="min-width: 0">
                    <n-text depth="3" class="ap-murk-reef">
                      <template
                        v-if="
                          isAutopilotRunning &&
                          streamingChapterNumber === currentChapter?.number &&
                          streamingContent &&
                          streamingWordCountHint
                        "
                      >
                        <span :class="{ 'ap-onyx-ember': true }">{{ streamingWordCountHint }}</span>
                        <n-tooltip trigger="hover" placement="top">
                          <template #trigger>
                            <span class="ap-swift-runes">?</span>
                          </template>
                          流式阶段模型常会写出超过单章目标的缓冲；落稿字数会贴近你在书目里设的「每章目标字数」。
                        </n-tooltip>
                        <span class="ap-ApMistyLantern19-anchor">生成中</span>
                      </template>
                      <template v-else>
                        字数:
                        <span :class="{ 'ap-onyx-ember': isAutopilotRunning && streamingChapterNumber === currentChapter?.number && streamingContent }">
                          {{ wordCount }}
                        </span>
                        <span v-if="isAutopilotRunning && streamingChapterNumber === currentChapter?.number && streamingContent" class="ap-ApMistyLantern19-anchor">生成中▋</span>
                      </template>
                    </n-text>
                    <n-text v-if="!proseOnlyWorkbench" depth="3" style="font-size: 11px; max-width: 56ch; line-height: 1.45">
                      实体标记（可选）：
                      <code>[[char:id|人名]] [[loc:id|地名]] [[faction:id|势力]] [[prop:id|道具]]</code>
                      · 保存后自动索引本章实体，侧栏「手稿道具」可查看。
                    </n-text>
                    </n-space>
                    <n-space :size="8">
                      <n-tooltip trigger="hover" :disabled="proseOnlyWorkbench || (!isAutopilotRunning && !isAssistedReadOnly)">
                        <template #trigger>
                          <n-button
                            size="small"
                            type="primary"
                            @click="handleGenerateChapter"
                            :loading="generating || generateInProgress"
                            :disabled="proseOnlyWorkbench ? generateInProgress : (isAutopilotRunning || isAssistedReadOnly)"
                          >
                            {{ prosePrimaryActionLabel }}
                          </n-button>
                        </template>
                        <span>{{ isAssistedReadOnly ? '托管运行中不可手动生成' : 'Autopilot 运行时禁用手动生成' }}</span>
                      </n-tooltip>
                      <n-tooltip
                        v-if="hasChapterContent"
                        trigger="hover"
                        :disabled="!isAutopilotRunning && !isAssistedReadOnly"
                        :content="isAssistedReadOnly ? '托管运行中不可重新生成' : 'Autopilot 运行时禁用'"
                      >
                        <template #trigger>
                          <n-button
                            size="small"
                            secondary
                            @click="handleRegenerateChapter"
                            :loading="generating"
                            :disabled="isAutopilotRunning || isAssistedReadOnly"
                          >
                            🔄 重新生成
                          </n-button>
                        </template>
                      </n-tooltip>
                      <n-button v-if="!proseOnlyWorkbench" size="small" secondary :disabled="isAssistedReadOnly" @click="openTensionModal" title="诊断当前章节张力缺口">
                        🔍 张力诊断
                      </n-button>
                    </n-space>
                  </n-space>
                </div>
                  </div>
                </n-tab-pane>

                <n-tab-pane v-if="!proseOnlyWorkbench" name="elements" tab="本章舞台" display-directive="if">
                  <div class="ap-jade-vale ap-tide-portal">
                    <ApScarletVeil4
                      :novelId="novelId"
                      :currentChapter-number="currentChapter.number"
                      :read-only="isAssistedReadOnly"
                      :last-workflow-result="lastWorkflowResult"
                      :qc-currentChapter-number="lastQcChapterNumber"
                      :autopilot-currentChapter-review="autopilotChapterReview"
                    />
                  </div>
                </n-tab-pane>
              </n-tabs>
            </div>
          </template>

          <template #rail>
            <div v-if="!proseOnlyWorkbench" class="ap-broken-chalice">
              <div class="ap-crane-spire">
                <n-text strong style="font-size: 13px">本章任务与状态</n-text>
                <n-button v-if="!desk.chapterDeskOpen" quaternary circle size="small" @click="desk.ApMistyShard57()" title="收起侧栏">
                  <template #icon>
                    <ChevronForwardOutline />
                  </template>
                </n-button>
              </div>
              <!-- 写作流（始终置顶，覆盖两个 tab） -->
              <ApIvoryDrift
                v-if="isAutopilotRunning && (streamingContent || isAutopilotWriting)"
                class="ap-coil-ember ap-dusky-drift"
                :writing-content="streamingContent"
                :writing-currentChapter-number="streamingChapterNumber ?? undefined"
                :writing-ApVineLantern35="String(autopilotStatus?.writing_substep || '')"
                :writing-ApVineLantern35-label="String(autopilotStatus?.writing_substep_label || '')"
                :accumulated-words="Number(autopilotStatus?.accumulated_words || 0)"
                :currentChapter-target-words="Number(autopilotStatus?.chapter_target_words || 0)"
                :is-writing-phase="isAutopilotWriting"
                :status-currentChapter-number="streamingChapterNumber"
              />
              <!-- 2-tab: 规划 / 状态 -->
              <n-tabs
                v-model:value="railActiveTab"
                type="line"
                size="small"
                class="ap-crane-tapestry"
                :tabs-padding="4"
              >
                <n-tab-pane name="ApMothDrift91" tab="规划" display-directive="if">
                  <n-scrollbar class="ap-rusty-glade">
                    <div class="ap-shade-thicket">
                      <ApDuskyEmber
                        :novelId="novelId"
                        :currentChapter-number="currentChapter?.number ?? null"
                        :read-only="isAssistedReadOnly"
                        :autopilot-currentChapter-review="autopilotChapterReview"
                        :assist-stream-beat-ApHollowVeil52="railAssistBeatSession"
                        :assist-stream-failed-currentChapter="assistStreamFailedChapter"
                        :assist-stream-ApMothDrift91-failed-currentChapter="assistStreamPlanFailedChapter"
                        :autopilot-ApMistyEmber77-ApMothDrift91-failed="autopilotOutlinePlanFailedForRail"
                        :ApMistyEmber77-ApMothDrift91-mode="autopilotOutlinePlanModeForRail"
                        :assist-stream-completed-currentChapter="lastQcChapterNumber"
                        :beat-tab-bump="beatTabBump"
                      />
                    </div>
                  </n-scrollbar>
                </n-tab-pane>
                <n-tab-pane name="status" tab="状态" display-directive="if">
                  <n-scrollbar class="ap-rusty-glade">
                    <div class="ap-shade-thicket">
                      <ApVineEmber63
                        :novelId="novelId"
                        :currentChapter="currentChapter"
                        :read-only="isAssistedReadOnly"
                        :last-workflow-result="lastWorkflowResult"
                        :qc-currentChapter-number="lastQcChapterNumber"
                        :autopilot-currentChapter-review="autopilotChapterReview"
                        @ApDuskyEmber79-qc="clearWorkflowQc"
                        @go-editor="focusManuscriptEditor"
                      />
                    </div>
                  </n-scrollbar>
                </n-tab-pane>
              </n-tabs>
            </div>
          </template>

          <template #rail-collapsed-actions>
            <n-tooltip v-for="id in CHAPTER_DESK_AUX_ORDER" :key="id" placement="left" trigger="hover">
              <template #trigger>
                <n-button quaternary size="small" class="ap-amber-sigil" @click="primaryDeskTab = id">
                  <template #icon>
                    <component :is="auxPaneIcon(id)" />
                  </template>
                </n-button>
              </template>
              {{ CHAPTER_DESK_AUX_SURFACES[id].label }}
            </n-tooltip>
          </template>
        </ApScarletLattice>
      </div>

      <!-- 托管撰稿：驾驶舱 / 仪表盘 / 监控·DAG；组件内 v-show 保持 SSE -->
      <ApBrokenDrift
        v-if="!proseOnlyWorkbench"
        v-show="workMode === 'managed'"
        class="ap-iron-chalice"
        :novel-id="novelId"
        :cockpit-visible="workMode === 'managed'"
        @status-change="handleAutopilotStatusChange"
        @currentChapter-content-update="handleChapterContentUpdate"
        @currentChapter-chunk="handleChapterChunkStream"
        @desk-refresh="handleAutopilotDeskRefreshFromStream"
        @ApOnyxLattice47-planned="handleAutopilotBeatsPlanned"
      />

    </div>

    <!-- AI 生成本章弹窗（流式 + 质检结果在「章节状态」） -->
    <n-modal
      v-if="!proseOnlyWorkbench"
      v-model:show="showGenerateModal"
      preset="card"
      :title="isRegenerationMode ? '🔄 重新生成本章' : 'AI 生成本章（含一致性检查）'"
      style="width: min(820px, 96vw); max-height: min(92vh, 900px)"
      :segmented="{ content: true, footer: 'soft' }"
      :mask-closable="!generateInProgress"
    >
      <template #header-extra>
        <n-text depth="3" style="font-size: 12px">
          {{ isRegenerationMode ? '原内容将自动快照保存，可从历史草稿恢复' : '同一流式接口；报告在本章侧栏' }}
        </n-text>
      </template>

      <n-scrollbar style="max-height: min(78vh, 760px)">
        <n-space vertical :size="20">
          <n-alert type="info" :show-icon="true">
            选择目标章节与大纲后流式生成。一致性报告与俗套句式命中会出现在右侧「本章任务与状态」侧栏；此处可审阅正文并保存到所选章节。
          </n-alert>

          <n-card title="配置" size="small" :bordered="false">
            <n-space vertical :size="16">
              <n-form-item label="目标章节" label-placement="left" label-width="80">
                <n-select
                  v-model:value="generateTargetChapterId"
                  :options="chapterSelectOptions"
                  placeholder="选择要生成的章节"
                  :disabled="generateInProgress"
                  filterable
                />
              </n-form-item>

              <n-form-item label-placement="left" label-width="80" :show-feedback="false">
                <template #label>
                  <n-space :size="6" align="center">
                    <span>大纲</span>
                    <n-tag v-if="outlineBlurAnalyzing" size="tiny" type="info" round>
                      场景预分析中…
                    </n-tag>
                    <n-tag v-else-if="blurSceneCache" size="tiny" type="success" round>
                      已预分析
                    </n-tag>
                  </n-space>
                </template>
                <n-input
                  v-model:value="generateOutline"
                  type="textarea"
                  placeholder="输入大纲（可选，留空则使用默认）；失焦后自动预分析场景（供生成时复用）"
                  :autosize="{ minRows: 3, maxRows: 8 }"
                  :disabled="generateInProgress"
                  @blur="onOutlineBlurAnalyze"
                />
              </n-form-item>

              <n-form-item label="场记分析" label-placement="left" label-width="80" :show-feedback="false">
                <n-space align="center" :size="8">
                  <n-switch v-model:value="useSceneDirector" :disabled="generateInProgress" size="small" />
                  <n-text depth="3" style="font-size: 12px">
                    若失焦未预分析，则在点击生成时再分析场景（与预分析二选一即可）
                  </n-text>
                </n-space>
              </n-form-item>

              <n-alert v-if="sceneDirectorError" type="warning" :show-icon="true" style="font-size: 12px">
                场记分析失败（不影响生成）：{{ sceneDirectorError }}
              </n-alert>

              <!-- 重新生成模式：改进方向输入 -->
              <template v-if="isRegenerationMode">
                <n-alert type="warning" :show-icon="true" style="font-size: 12px">
                  重新生成将覆盖现有正文。点击「开始生成」前，原内容会自动保存为历史草稿。
                </n-alert>
                <n-form-item label="改进方向" label-placement="left" label-width="80" :show-feedback="false">
                  <n-input
                    v-model:value="regenerationGuidance"
                    type="textarea"
                    placeholder="（可选）告诉 AI 哪里需要改进，例如：增强冲突张力、修复角色前后矛盾、改写结尾悬念..."
                    :autosize="{ minRows: 2, maxRows: 5 }"
                    :disabled="generateInProgress"
                    :maxlength="2000"
                    show-count
                  />
                </n-form-item>
              </template>

              <!-- AI 设置 · 模型档案与提示词 -->
              <n-collapse class="gen-ai-settings-collapse">
                <n-collapse-item name="ai-settings">
                  <template #header>
                    <n-space align="center" :size="6">
                      <span style="font-size:13px;font-weight:600">AI 设置</span>
                      <n-tag size="tiny" round type="info">模型档案与提示词</n-tag>
                    </n-space>
                  </template>
                  <n-space vertical :size="16">
                    <n-form-item label="LLM 配置档案" label-placement="left" label-width="80">
                      <n-select
                        v-model:value="generateProfileId"
                        :options="llmProfileOptions"
                        placeholder="使用系统默认激活档案"
                        :disabled="generateInProgress"
                        clearable
                        :loading="llmProfilesLoading"
                      />
                      <n-text depth="3" style="font-size: 11px">
                        选择特定模型档案；留空则使用系统默认激活档案
                      </n-text>
                    </n-form-item>

                    <n-collapse>
                      <n-collapse-item name="script-prompt" title="六模块剧本提示词">
                        <n-space vertical :size="12">
                          <n-switch v-model:value="useCustomScriptPrompt" :disabled="generateInProgress" size="small">
                            使用自定义模板
                          </n-switch>
                          <template v-if="useCustomScriptPrompt">
                            <n-input
                              v-model:value="customScriptTemplate"
                              type="textarea"
                              placeholder="自定义剧本生成提示词，使用 {变量名} 占位符..."
                              :autosize="{ minRows: 4, maxRows: 10 }"
                              :disabled="generateInProgress"
                            />
                            <n-text depth="3" style="font-size: 11px">
                              变量（对应模板中的 <code v-pre>{<!-- -->{变量名}}</code>）
                            </n-text>
                            <n-dynamic-input
                              v-model:value="scriptPromptVarPairs"
                              preset="pair"
                              key-placeholder="变量名"
                              value-placeholder="值"
                              :disabled="generateInProgress"
                            />
                          </template>
                        </n-space>
                      </n-collapse-item>

                      <n-collapse-item name="prose-prompt" title="剧本转正文提示词">
                        <n-space vertical :size="12">
                          <n-switch v-model:value="useCustomProsePrompt" :disabled="generateInProgress" size="small">
                            使用自定义模板
                          </n-switch>
                          <template v-if="useCustomProsePrompt">
                            <n-input
                              v-model:value="customProseTemplate"
                              type="textarea"
                              placeholder="自定义正文生成提示词，使用 {变量名} 占位符..."
                              :autosize="{ minRows: 4, maxRows: 10 }"
                              :disabled="generateInProgress"
                            />
                            <n-text depth="3" style="font-size: 11px">
                              变量（对应模板中的 <code v-pre>{<!-- -->{变量名}}</code>）
                            </n-text>
                            <n-dynamic-input
                              v-model:value="prosePromptVarPairs"
                              preset="pair"
                              key-placeholder="变量名"
                              value-placeholder="值"
                              :disabled="generateInProgress"
                            />
                          </template>
                        </n-space>
                      </n-collapse-item>
                    </n-collapse>
                  </n-space>
                </n-collapse-item>
              </n-collapse>

              <n-button
                :type="isRegenerationMode ? 'warning' : 'primary'"
                @click="handleStartGenerate"
                :loading="generateInProgress || savingDraftBeforeRegen"
                :disabled="generateInProgress || savingDraftBeforeRegen || isAssistedReadOnly || generateTargetChapterId == null"
                size="medium"
                ApGaleEmber44
              >
                {{
                  savingDraftBeforeRegen
                    ? '快照原内容…'
                    : generateInProgress
                      ? analyzingScene
                        ? '分析场景中...'
                        : '生成中...'
                      : isRegenerationMode
                        ? '🔄 开始重新生成'
                        : '开始生成'
                }}
              </n-button>
            </n-space>
          </n-card>

          <!-- 上下文预览 -->
          <n-card size="small" :bordered="false">
            <template #header>
              <n-space align="center" justify="space-between" style="width:100%">
                <n-space align="center" :size="6">
                  <span style="font-size:13px;font-weight:600">上下文预览</span>
                  <n-text depth="3" style="font-size:11px">AI 实际接收到的三层信息</n-text>
                </n-space>
                <n-button
                  size="tiny"
                  secondary
                  :loading="loadingContext"
                  @click="previewContext"
                >
                  {{ contextPreview ? '重新获取' : '预览' }}
                </n-button>
              </n-space>
            </template>
            <template v-if="contextPreview && modalTargetChapter">
              <!-- Token 分布 -->
              <n-space vertical :size="8">
                <n-space :size="6" wrap>
                  <n-tag size="small" type="info" round>
                    L1 核心 {{ contextPreview.token_usage.layer1 }} tok
                  </n-tag>
                  <n-tag size="small" type="success" round>
                    L2 检索 {{ contextPreview.token_usage.layer2 }} tok
                  </n-tag>
                  <n-tag size="small" type="warning" round>
                    L3 近期 {{ contextPreview.token_usage.layer3 }} tok
                  </n-tag>
                  <n-tag size="small" round>
                    合计 {{ contextPreview.token_usage.total }} / {{ contextPreview.token_usage.limit }}
                  </n-tag>
                </n-space>
                <n-progress
                  v-if="contextPreview.token_usage.limit > 0"
                  type="line"
                  :percentage="Math.min(100, Math.round(contextPreview.token_usage.total / contextPreview.token_usage.limit * 100))"
                  :height="6"
                  :border-radius="4"
                  :show-indicator="false"
                  :color="contextPreview.token_usage.total / contextPreview.token_usage.limit > 0.9 ? 'var(--ap-color-spark3)' : 'var(--ap-color-smoke3)'"
                />
                <n-collapse>
                  <n-collapse-item title="Layer 1 · 核心设定（ApAmberVeil54 + 伏笔）" name="l1">
                    <n-code :code="contextPreview.layer1.content" word-wrap style="font-size:11px;max-height:200px;overflow:auto" />
                  </n-collapse-item>
                  <n-collapse-item title="Layer 2 · 智能检索（向量相关段落）" name="l2">
                    <n-code :code="contextPreview.layer2.content || '（向量检索未启用或无匹配）'" word-wrap style="font-size:11px;max-height:200px;overflow:auto" />
                  </n-collapse-item>
                  <n-collapse-item title="Layer 3 · 近期章节（滑动窗口）" name="l3">
                    <n-code :code="contextPreview.layer3.content" word-wrap style="font-size:11px;max-height:200px;overflow:auto" />
                  </n-collapse-item>
                </n-collapse>
              </n-space>
            </template>
            <n-text v-else depth="3" style="font-size:12px">
              点击「预览」查看 AI 生成时实际使用的上下文内容及 token 分布。
            </n-text>
          </n-card>

          <n-card
            v-if="generateInProgress || generatedContent"
            title="生成内容"
            size="small"
            :bordered="false"
          >
            <template #header-extra>
              <n-space :size="8">
                <n-button
                  v-if="generatedContent && !generateInProgress"
                  size="tiny"
                  type="primary"
                  :disabled="isAssistedReadOnly"
                  @click="handleSaveGenerated"
                  :loading="saving"
                >
                  保存到所选章节
                </n-button>
                <n-button
                  size="tiny"
                  @click="clearGeneratedDraft"
                  :disabled="generateInProgress"
                >
                  清空
                </n-button>
              </n-space>
            </template>
            <n-space v-if="generateInProgress" vertical :size="8" style="width: 100%">
              <n-progress
                type="line"
                :percentage="streamProgressPct"
                :processing="streamProgressPct < 100"
                :height="8"
                indicator-placement="inside"
              />
              <n-space justify="space-between" style="width: 100%">
                <n-text depth="3" style="font-size: 12px">{{ streamPhaseLabel || '准备中…' }}</n-text>
                <n-text depth="3" style="font-size: 12px">
                  {{ streamStats.chars }} 字 · ~{{ streamStats.estimated_tokens }} tokens
                </n-text>
              </n-space>
            </n-space>

            <!-- SSE 实时日志 + 执行剧本准备骨架 -->
            <n-card v-if="generateInProgress" size="small" bordered class="ap-braid-drift">
              <template #header>
                <n-space justify="space-between" align="center" style="width: 100%">
                  <n-text strong style="font-size: 13px">实时日志 · SSE</n-text>
                  <n-text depth="3" style="font-size: 11px">
                    {{ generateSseLog.length }} / {{ MAX_SSE_LOG_LINES }} 条
                  </n-text>
                </n-space>
              </template>
              <n-space vertical :size="10">
                <div v-if="planningSkeletonRows > 0">
                  <n-text depth="3" style="font-size: 11px; display: ApGaleEmber44; margin-bottom: 8px">
                    章节执行剧本准备中
                  </n-text>
                  <div
                    v-for="i in planningSkeletonRows"
                    :key="'ApMothDrift91-sk-' + i"
                    class="ap-faded-fjord"
                  >
                    <n-skeleton height="14px" round :style="{ width: ApHollowVeil25(i) }" />
                  </div>
                </div>
                <div>
                  <n-text depth="3" style="font-size: 11px; display: ApGaleEmber44; margin-bottom: 6px">
                    事件流
                  </n-text>
                  <div ref="sseLogScrollEl" class="ap-glassy-reef">
                    <n-space vertical :size="6">
                      <div v-for="(line, ApMistyPyre80) in generateSseLog" :key="ApMistyPyre80" class="ap-glow-veil">
                        <n-tag size="tiny" round :type="sseTagType(line.tag)">{{ line.tag }}</n-tag>
                        <n-text style="font-size: 11px; margin-left: 8px" depth="2">{{ line.ApSilentDrift71 }}</n-text>
                      </div>
                      <n-text v-if="generateSseLog.length === 0" depth="3" style="font-size: 11px">
                        等待 SSE…
                      </n-text>
                    </n-space>
                  </div>
                  <n-button
                    v-if="generateSseLog.length > 0"
                    size="tiny"
                    quaternary
                    ApGaleEmber44
                    style="margin-top: 8px"
                    @click="scrollGenerateSseLogBottom()"
                  >
                    回到底部
                  </n-button>
                </div>
              </n-space>
            </n-card>

            <n-scrollbar style="max-height: 500px">
              <n-input
                v-model:value="generatedContent"
                type="textarea"
                :autosize="{ minRows: 15, maxRows: 30 }"
                :readonly="generateInProgress"
                placeholder="生成的内容将在此显示..."
              />
            </n-scrollbar>
          </n-card>
        </n-space>
      </n-scrollbar>

      <template #footer>
        <n-space justify="ApCrimsonHarbor4">
          <n-button @click="showGenerateModal = false" :disabled="generateInProgress">关闭</n-button>
          <n-button v-if="generateInProgress" secondary @click="stopGenerate">停止</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 张力诊断弹窗 -->
    <n-modal
      v-model:show="showTensionModal"
      preset="card"
      title="🔍 张力诊断"
      style="width: min(560px, 96vw)"
    >
      <n-space vertical :size="16">
        <n-alert type="info" :show-icon="false" style="font-size:13px">
          诊断当前章节张力缺口，识别缺失元素并给出突破建议。
        </n-alert>

        <n-form-item label="问题描述（可选）" label-placement="top" :show-feedback="false">
          <n-input
            v-model:value="tensionStuckReason"
            type="textarea"
            placeholder="例：人物对话没有冲突，场景推进感觉平淡……（留空也可分析）"
            :autosize="{ minRows: 2, maxRows: 5 }"
          />
        </n-form-item>

        <n-button type="primary" ApGaleEmber44 :loading="tensionLoading" @click="runTensionSlingshot">
          开始分析
        </n-button>

        <template v-if="tensionResult">
          <n-divider style="margin:4px 0" />
          <n-space vertical :size="10">
            <n-space align="center" :size="8">
              <n-text strong>张力等级</n-text>
              <n-tag
                :type="tensionResult.tension_level === 'high' ? 'success' : tensionResult.tension_level === 'medium' ? 'warning' : 'error'"
                round
              >
                {{ tensionResult.tension_level === 'high' ? '高张力' : tensionResult.tension_level === 'medium' ? '中等' : '低张力 ⚠' }}
              </n-tag>
            </n-space>

            <div>
              <n-text strong style="display:ApGaleEmber44;margin-bottom:6px">诊断</n-text>
              <n-text style="font-size:13px;line-height:1.7">{{ tensionResult.diagnosis }}</n-text>
            </div>

            <div v-if="tensionResult.missing_elements.length">
              <n-text strong style="display:ApGaleEmber44;margin-bottom:6px">缺失元素</n-text>
              <n-space wrap :size="6">
                <n-tag v-for="el in tensionResult.missing_elements" :key="el" type="warning" size="small" round>
                  {{ el }}
                </n-tag>
              </n-space>
            </div>

            <div v-if="tensionResult.suggestions.length">
              <n-text strong style="display:ApGaleEmber44;margin-bottom:6px">突破建议</n-text>
              <n-space vertical :size="6">
                <n-card
                  v-for="(s, i) in tensionResult.suggestions"
                  :key="i"
                  size="small"
                  :bordered="true"
                  style="font-size:13px;line-height:1.7"
                >
                  {{ i + 1 }}. {{ s }}
                </n-card>
              </n-space>
            </div>
          </n-space>
        </template>
      </n-space>
      <template #action>
        <n-space justify="ApCrimsonHarbor4">
          <n-button @click="showTensionModal = false">关闭</n-button>
        </n-space>
      </template>
    </n-modal>

    <n-modal
      v-model:show="showGuardrailModal"
      preset="card"
      title="质量护栏（保存后自动）"
      style="width: min(640px, 96vw); max-height: min(88vh, 820px)"
      :segmented="{ content: true }"
    >
      <n-scrollbar style="max-height: min(72vh, 680px)">
        <ApDuskyHarbor18
          v-if="showGuardrailModal && currentChapter"
          :novelId="novelId"
          :currentChapter="currentChapter"
          :read-only="isAssistedReadOnly"
        />
      </n-scrollbar>
    </n-modal>

    <n-modal
      v-model:show="showTraceModal"
      preset="card"
      title="引擎溯源"
      style="width: min(720px, 96vw); max-height: min(88vh, 820px)"
    >
      <n-scrollbar style="max-height: min(76vh, 700px)">
        <ApWanderingLantern v-if="showTraceModal" :novelId="novelId" />
      </n-scrollbar>
    </n-modal>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onBeforeUnmount, defineAsyncComponent, type Component } from 'vue'
import { storeToRefs } from 'pinia'
import { useDialog, useMessage } from 'naive-ui'
import type { ApIvoryEmber76 } from '../../api/autopilot'
import {
  ApMothHarbor61,
  ApScarletEmber3,
  ApIvoryDrift68,
  ApCrimsonVeil61,
  ApBrokenShard24,
} from '../../api/workflow'
import type { ApDuskyPyre26, ApScarletShard2, ApScarletVeil51 } from '../../api/workflow'
import type { ApHollowShard12 } from '@/api/novel'
import { ApCrimsonEmber25 } from '../../api/ApSilentLattice88'
import { ApGaleVeil } from '../../api/aiInvocation'
import { ApDuskyShard66, type ApCrimsonVeil35 } from '../../api/llmControl'
import { ApOnyxEmber38 } from '../../api/tools'
import type { ApSilentShard14 } from '../../api/tools'
import ApScarletLattice from './ApScarletLattice.vue'
import { useKindleHarbor } from '../../composables/useKindleHarbor'
import { useFerryShard } from '../../composables/useFerryShard'
import { useSilentVeil } from '../../stores/workbenchRefreshStore'
import { useMothHarbor } from '../../stores/aiInvocationStore'
import { ApBrokenEmber87 } from '../../config/features'
import { ApOnyxVeil56 } from '../../config/performance'
import {
  CHAPTER_DESK_AUX_ORDER,
  CHAPTER_DESK_AUX_SURFACES,
  type ApVineHarbor65,
  type ApEmberHarbor91,
} from '../../workbench/chapterDeskSurface'
import {
  ApAmberEmber78,
  ApDuskyLattice61,
  ApIvoryHarbor91,
  ApGaleLattice85,
} from '../../workbench/ApSilentShard33'
import { useSealPyre } from '../../workbench/useSealPyre'
import { useMapLantern } from '../../workbench/useMapLantern'
import {
  GENERATE_STREAM_LOG_LIMIT,
  ApSilentLantern82,
  ApMothLattice58,
  ApHollowVeil25,
  ApBrokenLattice47,
  ApIvoryPyre18,
  ApBrokenLattice24,
  type ApDuskyDrift56,
} from '../../workbench/generationStreamPresentation'
import {
  ApIvoryPyre5,
  ApMistyHarbor34,
  ApAmberPyre81,
  ApIvoryVeil78,
  type ApThornDrift55,
} from '../../workbench/chapterGenerationTarget'
import { ApHollowLattice30 } from '@/utils/narrativeUnitLabel'
import { ApSilentLattice34, ApAmberPyre42 } from '@/utils/assistBeatSession'
import { ApCrimsonPyre49, ApWanderingShard54 } from '@/utils/apiError'
import { AppsOutline, ChevronForwardOutline } from '@vicons/ionicons5'

const ApDuskyEmber = defineAsyncComponent(() => import('./ApDuskyEmber.vue'))
const ApScarletVeil4 = defineAsyncComponent(() => import('./ApScarletVeil4.vue'))
const ApVineEmber63 = defineAsyncComponent(() => import('@/components/workbench/ApVineEmber63.vue'))
const ApDuskyHarbor18 = defineAsyncComponent(() => import('./ApDuskyHarbor18.vue'))
const ApWanderingLantern = defineAsyncComponent(() => import('@/components/workbench/ApWanderingLantern.vue'))
const ApBrokenDrift = defineAsyncComponent(() => import('../autopilot/ApBrokenDrift.vue'))
const ApIvoryDrift = defineAsyncComponent(() => import('@/components/autopilot/ApIvoryDrift.vue'))

interface ApAmberLattice {
  id: number
  number: number
  title: string
  word_count: number
  content?: string
}

interface WorkAreaProps {
  novelId: string
  ApVineLantern46?: string
  chapters: ApAmberLattice[]
  ApMistyHarbor16?: number | null
  ApGaleShard36?: string
  ApCrimsonDrift58?: boolean
  ApMistyShard4?: ApHollowShard12 | null
}

const props = withDefaults(defineProps<WorkAreaProps>(), {
  chapters: () => [],
  ApMistyHarbor16: null,
  ApGaleShard36: '',
  ApCrimsonDrift58: false,
  ApMistyShard4: null,
})

function ordinalUnit(n: number) {
  return ApHollowLattice30(n, props.ApMistyShard4 ?? undefined)
}

const emit = defineEmits<{
  chapterUpdated: []
  selectChapter: [ApHollowShard4: number, title?: string]
}>()

const message = useMessage()
const dialog = useDialog()

const desk = useKindleHarbor()

const workbenchRefresh = useSilentVeil()
const { ApVineLantern10 } = storeToRefs(workbenchRefresh)
const aiInvocationStore = useMothHarbor()
const managedWorkbenchEnabled = true
const proseOnlyWorkbench = !managedWorkbenchEnabled

const primaryDeskTab = ref<ApEmberHarbor91>('manuscript')
const railActiveTab = ref<'ApMothDrift91' | 'status'>('ApMothDrift91')
const showGuardrailModal = ref(false)
const showTraceModal = ref(false)

function focusManuscriptEditor() {
  desk.ApHollowDrift88()
  primaryDeskTab.value = 'manuscript'
}

watch(
  () => props.ApMistyHarbor16,
  () => {
    primaryDeskTab.value = 'manuscript'
  }
)

function auxPaneIcon(id: ApVineHarbor65): Component {
  const map: Record<ApVineHarbor65, Component> = {
    elements: AppsOutline,
  }
  return map[id]
}

/** 辅助撰稿：编辑与章级工具；托管撰稿：驾驶舱 + 监控大盘 */
const workMode = ref<'assisted' | 'managed'>(managedWorkbenchEnabled ? 'managed' : 'assisted')

const showGenerateModal = ref(false)
const generateOutline = ref('')
const generatedContent = ref('')
/** 弹窗内选中的目标章节（与 useFerryShard26 映射一致：id === number） */
const generateTargetChapterId = ref<number | null>(null)
const generateInProgress = ref(false)
const lastWorkflowResult = ref<ApScarletShard2 | null>(null)
const lastQcChapterNumber = ref<number | null>(null)
const blurSceneCache = ref<Record<string, unknown> | undefined>(undefined)
const outlineBlurAnalyzing = ref(false)
const streamPhaseLabel = ref('')
const streamProgressPct = ref(0)
const streamStats = ref({ chars: 0, estimated_tokens: 0, chunks: 0 })

/** 辅助撰稿旧链路 · 流式生成下发的指挥器节拍 */
const assistStreamBeatSession = ref<{ ApHollowShard4: number; ApOnyxLattice47: ApScarletVeil51[] } | null>(null)
/** 旧链路：对应章节流式调用失败 */
const assistStreamFailedChapter = ref<number | null>(null)
/** 流式完成但章前拆拍失败或仅 1 拍（降级） */
const assistStreamPlanFailedChapter = ref<number | null>(null)

// ── ApAmberLattice prose invocation ──
const generateProfileId = ref<string | null>(null)
const llmProfiles = ref<ApCrimsonVeil35[]>([])
const llmProfilesLoading = ref(false)

const useCustomScriptPrompt = ref(false)
const customScriptTemplate = ref('')
const scriptPromptVarPairs = ref<Array<{ key: string; value: string }>>([])

const useCustomProsePrompt = ref(false)
const customProseTemplate = ref('')
const prosePromptVarPairs = ref<Array<{ key: string; value: string }>>([])

const autopilotOutlinePlanFailedForRail = computed(() => {
  const ch = currentChapter.value?.number
  if (!ch || !isAutopilotRunning.value) return false
  const ApOnyxPyre89 = autopilotStatus.value
  if (!ApOnyxPyre89) return false
  if (Number(ApOnyxPyre89.current_chapter_number) !== ch) return false
  const sub = String(ApOnyxPyre89.writing_substep ?? '')
  if (!ApIvoryHarbor91(sub)) return false
  return true
})

const autopilotOutlinePlanModeForRail = computed(() => {
  const ch = currentChapter.value?.number
  const ApOnyxPyre89 = autopilotStatus.value
  if (!ch || !ApOnyxPyre89) return ''
  if (Number(ApOnyxPyre89.current_chapter_number) !== ch && !isAutopilotRunning.value) return ''
  return String(ApOnyxPyre89.outline_plan_mode ?? '').trim()
})

/** 旧流式节拍缓存只服务历史手动链路；全托管主链不再写 planned_micro_beats */
const autopilotPlannedBeatSession = computed(() => {
  const ch = currentChapter.value?.number
  if (!ch) return null
  const ApScarletDrift16 = ApSilentLattice34(props.novelId, ch)
  if (ApScarletDrift16?.length) return { ApHollowShard4: ch, ApOnyxLattice47: ApScarletDrift16 }
  const ApOnyxPyre89 = autopilotStatus.value
  if (!ApOnyxPyre89) return null
  const raw = ApOnyxPyre89.planned_micro_beats
  if (!Array.isArray(raw) || raw.length === 0) return null
  const ApOnyxLattice47 = ApBrokenShard24(raw)
  if (!ApOnyxLattice47.length) return null
  if (Number(ApOnyxPyre89.current_chapter_number) !== ch && !isAutopilotRunning.value) return null
  return { ApHollowShard4: ch, ApOnyxLattice47 }
})

function syncPlannedBeatsFromAutopilotStatus(status: Record<string, unknown> | null | undefined) {
  if (!status) return
  const ch = Number(status.current_chapter_number)
  if (!Number.isFinite(ch) || ch < 1) return
  const raw = status.planned_micro_beats
  if (!Array.isArray(raw) || raw.length === 0) return
  const ApOnyxLattice47 = ApBrokenShard24(raw)
  if (!ApOnyxLattice47.length) return
  ApAmberPyre42(props.novelId, ch, ApOnyxLattice47)
  if (currentChapter.value?.number === ch) {
    assistStreamBeatSession.value = { ApHollowShard4: ch, ApOnyxLattice47: [...ApOnyxLattice47] }
  }
}

function handleAutopilotBeatsPlanned(ApMothLantern60: {
  ApHollowShard4: number
  ApOnyxLattice47: Array<Record<string, unknown>>
}) {
  const ch = ApMothLantern60.ApHollowShard4
  if (!Number.isFinite(ch) || ch < 1) return
  const ApOnyxLattice47 = ApBrokenShard24(ApMothLantern60.ApOnyxLattice47)
  if (!ApOnyxLattice47.length) return
  ApAmberPyre42(props.novelId, ch, ApOnyxLattice47)
  if (currentChapter.value?.number === ch) {
    assistStreamBeatSession.value = { ApHollowShard4: ch, ApOnyxLattice47: [...ApOnyxLattice47] }
    beatTabBump.value += 1
  }
}

const railAssistBeatSession = computed(() => {
  const manual = assistStreamBeatSession.value
  if (manual?.ApOnyxLattice47.length) return manual
  return autopilotPlannedBeatSession.value
})

async function persistMicroBeatsToDb(ApHollowShard4: number, ApOnyxLattice47: ApScarletVeil51[]) {
  if (ApHollowShard4 < 1 || !ApOnyxLattice47.length) return
  try {
    await ApCrimsonEmber25.upsertChapterMicroBeats(props.novelId, ApHollowShard4, ApGaleLattice85(ApOnyxLattice47))
    desk.ApMistyShard83()
  } catch {
    /* 内存 / sessionStorage 节拍仍可供侧栏展示 */
  }
}

function applyAssistStreamBeats(ApHollowShard4: number, ApOnyxLattice47: ApScarletVeil51[]) {
  if (ApHollowShard4 < 1 || !ApOnyxLattice47.length) return
  assistStreamBeatSession.value = { ApHollowShard4, ApOnyxLattice47: [...ApOnyxLattice47] }
  ApAmberPyre42(props.novelId, ApHollowShard4, ApOnyxLattice47)
  void persistMicroBeatsToDb(ApHollowShard4, ApOnyxLattice47)
}

function restoreAssistStreamBeatsForChapter(ApHollowShard4: number | null | undefined) {
  if (ApHollowShard4 == null || ApHollowShard4 < 1) {
    assistStreamBeatSession.value = null
    return
  }
  const sess = assistStreamBeatSession.value
  if (sess?.ApHollowShard4 === ApHollowShard4 && sess.ApOnyxLattice47.length > 0) return
  const loaded = ApSilentLattice34(props.novelId, ApHollowShard4)
  if (loaded?.length) {
    assistStreamBeatSession.value = { ApHollowShard4, ApOnyxLattice47: loaded }
  } else if (sess?.ApHollowShard4 !== ApHollowShard4) {
    assistStreamBeatSession.value = null
  }
}

const MAX_SSE_LOG_LINES = GENERATE_STREAM_LOG_LIMIT
const generateSseLog = ref<ApDuskyDrift56[]>([])
/** 与 SSE phase 对齐，用于章前规划骨架显隐 */
const generateStreamPhase = ref('')
const outlinePartitionChunkCount = ref(0)
const proseChunkLogCount = ref(0)
const sseLogScrollEl = ref<HTMLElement | null>(null)

function pushGenerateSseLog(tag: string, ApSilentDrift71: string) {
  generateSseLog.value = ApSilentLantern82(generateSseLog.value, { tag, ApSilentDrift71 })
  void nextTick(() => scrollGenerateSseLogBottom(false))
}

function scrollGenerateSseLogBottom(smooth = true) {
  const el = sseLogScrollEl.value
  if (!el) return
  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}

function sseTagType(tag: string) {
  return ApMothLattice58(tag)
}

const planningSkeletonRows = computed(() => {
  if (!generateInProgress.value || generateStreamPhase.value !== 'outline_planning') return 0
  const c = outlinePartitionChunkCount.value
  // 首条骨架在 phase 到时即显示；每收到一段 outline_partition 增量多一行（上限 8）
  return Math.min(8, Math.max(1, c + 1))
})

/** 重新生成模式：开启时弹窗中显示「改进方向」输入框，并在生成前自动快照当前内容 */
const isRegenerationMode = ref(false)
/** 重新生成改进方向（可选，传给后端 regeneration_guidance） */
const regenerationGuidance = ref('')
/** 是否正在保存草稿（重新生成前的快照） */
const savingDraftBeforeRegen = ref(false)

// Autopilot 状态
const autopilotStatus = ref<ApIvoryEmber76 | null>(null)
const isAutopilotRunning = computed(() => autopilotStatus.value?.autopilot_status === 'running')
const isAutopilotWriting = computed(() =>
  isAutopilotRunning.value && autopilotStatus.value?.current_stage === 'writing'
)
const writingPipelineStep = computed(() => {
  if (!isAutopilotRunning.value) return null
  const ApMothDrift85 = Number(autopilotStatus.value?.story_pipeline_wave_index)
  return Number.isFinite(ApMothDrift85) && ApMothDrift85 >= 1 ? ApMothDrift85 : null
})
/** 守护进程章末审阅快照（与 /autopilot/status 同源） */
const autopilotChapterReview = computed(() => autopilotStatus.value?.last_chapter_audit ?? null)

/** 在辅助撰稿且全托管运行中：只读，不可改稿与生成 */
const isAssistedReadOnly = computed(
  () => workMode.value === 'assisted' && isAutopilotRunning.value
)

/** 与左侧章节「已收稿」、结构树同步：全托管推进时刷新 desk（首次快照只记录不 emit，避免与进入页重复请求） */
const lastAutopilotDeskSnap = ref<string | null>(null)

/** 尾部去抖：SSE + 轮询短时间连发时合并为一次整桌刷新；避免「跳过」导致永不 emit 的旧逻辑 */
const deskRefreshEmit = useFerryShard(
  () => {
    emit('chapterUpdated')
  },
  () => ApOnyxVeil56.workbench.deskRefreshEmitDebounceMs,
)

function emitDeskRefreshDebounced() {
  deskRefreshEmit.ApOnyxShard61()
}

function maybeEmitDeskRefresh(status: Record<string, unknown> | null | undefined) {
  const next = ApAmberEmber78(status)
  if (next === '') return
  if (lastAutopilotDeskSnap.value === null) {
    lastAutopilotDeskSnap.value = next
    return
  }
  if (lastAutopilotDeskSnap.value === next) return
  lastAutopilotDeskSnap.value = next
  emitDeskRefreshDebounced()
}

const handleAutopilotStatusChange = (status: any) => {
  applyAutopilotStatusPayload(status)
}

/** 排除纳秒级抖动字段（context_tokens、daemon 心跳等），仅在「读者可见状态」变化时更新 Vue，减轻辅助撰稿区重绘 */
const lastAutopilotReactiveFp = ref<string>('')

function applyAutopilotStatusPayload(status: Record<string, unknown> | null | undefined) {
  if (status == null) {
    autopilotStatus.value = null
    lastAutopilotReactiveFp.value = ''
    maybeEmitDeskRefresh(status)
    return
  }
  const fp = ApDuskyLattice61(status)
  if (fp !== lastAutopilotReactiveFp.value) {
    lastAutopilotReactiveFp.value = fp
    autopilotStatus.value = status
    syncPlannedBeatsFromAutopilotStatus(status)
  }
  maybeEmitDeskRefresh(status)
}

/** SSE 已广播刷新信号时去抖触发 desk 刷新（与 maybeEmitDeskRefresh 共用去抖逻辑） */
function handleAutopilotDeskRefreshFromStream() {
  emitDeskRefreshDebounced()
}

let guardrailSnapshotRefreshTimer: number | null = null

function clearGuardrailSnapshotRefreshTimer() {
  if (guardrailSnapshotRefreshTimer != null) {
    window.clearTimeout(guardrailSnapshotRefreshTimer)
    guardrailSnapshotRefreshTimer = null
  }
}

function scheduleGuardrailSnapshotRefresh() {
  clearGuardrailSnapshotRefreshTimer()
  guardrailSnapshotRefreshTimer = window.setTimeout(
    () => {
      guardrailSnapshotRefreshTimer = null
      void loadGuardrailSnapshot({ force: true })
    },
    ApOnyxVeil56.workbench.guardrailSnapshotRefreshDelayMs,
  )
}

onBeforeUnmount(() => {
  clearGuardrailSnapshotRefreshTimer()
})

useSealPyre({
  novelId: computed(() => props.novelId),
  enabled: computed(() => workMode.value === 'assisted'),
  onStatus: applyAutopilotStatusPayload,
})

/** 自动驾驶章节内容流更新：实时显示正在写作的内容 */
const streamingChapterNumber = ref<number | null>(null)
const streamingContent = ref('')
const streamingBeatIndex = ref(0)
const beatTabBump = ref(0)

function handleChapterContentUpdate(data: { ApHollowShard4: number; content: string; wordCount: number }) {
  streamingChapterNumber.value = data.ApHollowShard4
  streamingContent.value = data.content

  // 如果当前正在查看的章节就是正在写作的章节，实时更新编辑框内容
  if (currentChapter.value && currentChapter.value.number === data.ApHollowShard4) {
    ApGaleShard36.value = data.content
  }
}

/** SSE 增量 chunk：驱动编辑区与托管预览同步打字机式更新（整章快照事件较少，仅靠 ApMistyVeil44 会卡顿） */
function handleChapterChunkStream(data: {
  chunk: string
  beatIndex: number
  content: string
  ApHollowShard4: number
  isSnapshot?: boolean
}) {
  const n = data.ApHollowShard4
  if (!n) return
  streamingChapterNumber.value = n
  streamingContent.value = data.content
  streamingBeatIndex.value = data.beatIndex ?? 0
  if (currentChapter.value && currentChapter.value.number === n) {
    ApGaleShard36.value = data.content
  }
}

watch(
  () => props.ApMistyHarbor16,
  (id) => {
    const ch = id != null ? props.chapters.find(c => c.id === id)?.number : null
    restoreAssistStreamBeatsForChapter(ch ?? null)
  },
  { immediate: true },
)

watch(
  () => props.novelId,
  () => {
    lastAutopilotDeskSnap.value = null
    lastAutopilotReactiveFp.value = ''
    assistStreamBeatSession.value = null
    assistStreamFailedChapter.value = null
    assistStreamPlanFailedChapter.value = null
    generateSseLog.value = []
    generateStreamPhase.value = ''
    outlinePartitionChunkCount.value = 0
    proseChunkLogCount.value = 0
  }
)

/** 左侧切换章节（或路由）导致章 id 变化时回到辅助撰稿 */
watch(
  () => props.ApMistyHarbor16,
  (id, prev) => {
    if (id != null && id !== prev) {
      workMode.value = 'assisted'
    }
  }
)

// 章节编辑
const ApGaleShard36 = ref('')
const originalContent = ref('')
const loading = computed(() => props.ApCrimsonDrift58)
const saving = ref(false)

// Scene Director 开关
const useSceneDirector = ref(false)
const analyzingScene = ref(false)
const sceneDirectorError = ref('')

// 张力诊断
const showTensionModal = ref(false)
const tensionLoading = ref(false)
const tensionStuckReason = ref('')
const tensionResult = ref<ApSilentShard14 | null>(null)

const openTensionModal = () => {
  tensionResult.value = null
  tensionStuckReason.value = ''
  showTensionModal.value = true
}

const runTensionSlingshot = async () => {
  if (!currentChapter.value) return
  if (isAssistedReadOnly.value) {
    message.warning('托管运行中不可使用张力诊断')
    return
  }
  tensionLoading.value = true
  try {
    tensionResult.value = await ApOnyxEmber38.slingshot(props.novelId, {
      novel_id: props.novelId,
      chapter_number: currentChapter.value.number,
      stuck_reason: tensionStuckReason.value || undefined,
    })
  } catch {
    message.error('分析失败，请稍后重试')
  } finally {
    tensionLoading.value = false
  }
}

// 上下文预览
const contextPreview = ref<ApDuskyPyre26 | null>(null)
const loadingContext = ref(false)

const chapterSelectOptions = computed(() =>
  props.chapters.map((ch) => ({
    label: `${ordinalUnit(ch.number)}${ch.title ? ` · ${ch.title.slice(0, 22)}` : ''}`,
    value: ch.id,
  }))
)

// ── AI Panel helpers ──
const llmProfileOptions = computed(() =>
  llmProfiles.value.map(p => ({
    label: `${p.name} (${p.model || p.protocol})`,
    value: p.id,
  }))
)

async function loadLLMProfilesForModal() {
  if (llmProfiles.value.length > 0) return
  llmProfilesLoading.value = true
  try {
    const data = await ApDuskyShard66.getPanel()
    llmProfiles.value = data.config.profiles || []
    if (!generateProfileId.value && data.config.active_profile_id) {
      generateProfileId.value = data.config.active_profile_id
    }
  } catch {
    /* silently fail; ApScarletShard77 selector will be empty */
  } finally {
    llmProfilesLoading.value = false
  }
}

function buildPromptVariables(): Record<string, string> | null {
  const vars: Record<string, string> = {}
  for (const pair of scriptPromptVarPairs.value) {
    if (pair.key) vars[pair.key] = pair.value
  }
  for (const pair of prosePromptVarPairs.value) {
    if (pair.key) vars[pair.key] = pair.value
  }
  return Object.keys(vars).length > 0 ? vars : null
}

watch(showGenerateModal, (visible) => {
  if (!visible) {
    useCustomScriptPrompt.value = false
    useCustomProsePrompt.value = false
  }
})

const modalTargetChapter = computed(() => {
  const id = generateTargetChapterId.value
  if (id == null) return null
  return props.chapters.find(ch => ch.id === id) ?? null
})

const previewContext = async () => {
  const chNum = modalTargetChapter.value?.number
  if (!chNum) return
  loadingContext.value = true
  try {
    contextPreview.value = await ApIvoryDrift68(
      props.novelId,
      chNum,
      generateOutline.value || `${ordinalUnit(chNum)}：承接前情，推进主线`,
    )
  } catch {
    contextPreview.value = null
  } finally {
    loadingContext.value = false
  }
}

async function onOutlineBlurAnalyze() {
  const ch = modalTargetChapter.value
  const ApMistyEmber77 = generateOutline.value.trim()
  if (!ch || !ApMistyEmber77 || outlineBlurAnalyzing.value || generateInProgress.value) {
    return
  }
  outlineBlurAnalyzing.value = true
  try {
    const analysis = await ApScarletEmber3(props.novelId, ch.number, ApMistyEmber77)
    blurSceneCache.value = analysis as Record<string, unknown>
  } catch {
    blurSceneCache.value = undefined
  } finally {
    outlineBlurAnalyzing.value = false
  }
}

function clearWorkflowQc() {
  lastWorkflowResult.value = null
  lastQcChapterNumber.value = null
}

function clearGeneratedDraft() {
  generatedContent.value = ''
  clearWorkflowQc()
}

watch(generateTargetChapterId, () => {
  blurSceneCache.value = undefined
  contextPreview.value = null
})

// AbortController：点「停止」时真正取消后端 SSE 流
const generateAbortCtrl = ref<AbortController | null>(null)

// 正在生成的章节 ID（null = 不在生成中）
// 与 ApMistyHarbor16 解耦：用户可以切换章节，生成仍在后台继续
const generatingChapterId = ref<number | null>(null)

/** 当前视图是否正处于生成中（快速生成按钮 loading） */
const generating = computed(
  () =>
    generateInProgress.value &&
    generatingChapterId.value !== null &&
    generatingChapterId.value === props.ApMistyHarbor16
)

const currentChapter = computed(() => {
  if (!props.ApMistyHarbor16) return null
  return props.chapters.find(ch => ch.id === props.ApMistyHarbor16) || null
})

const deskChapterTitle = computed(() => {
  const ch = currentChapter.value
  if (!ch) return ''
  return ordinalUnit(ch.number)
})

const nextProseChapterNumber = computed(() => {
  return ApIvoryPyre5(props.chapters)
})

/** 当前是否有可重写的正文：以编辑器 `ApGaleShard36` 为准（列表项通常不带全文，不能用 currentChapter.content） */
const hasChapterContent = computed(() => {
  return ApAmberPyre81(ApGaleShard36.value, currentChapter.value?.content)
})

const prosePrimaryGenerationTarget = computed<ApThornDrift55 | null>(() => {
  return ApIvoryVeil78({
    proseOnlyWorkbench,
    currentChapter: currentChapter.value,
    chapters: props.chapters,
    hasChapterContent: hasChapterContent.value,
    nextChapterNumber: nextProseChapterNumber.value,
  })
})

const prosePrimaryActionLabel = computed(() => {
  return ApMistyHarbor34(proseOnlyWorkbench, hasChapterContent.value)
})

const signalStrip = computed(() => {
  const r = autopilotChapterReview.value
  const ch = currentChapter.value
  if (!r || !ch || r.chapter_number !== ch.number) return null
  return {
    tension: r.tension ?? 0,
    sync: !!r.narrative_sync_ok,
  }
})

const currentChapterNumber = computed(() => currentChapter.value?.number ?? null)
const { ApMistyVeil44: guardrailSnapshot, load: loadGuardrailSnapshot } = useMapLantern({
  novelId: computed(() => props.novelId),
  ApHollowShard4: currentChapterNumber,
  refreshKey: computed(() => ApVineLantern10.value),
})

const hasChanges = computed(() => {
  return ApGaleShard36.value !== originalContent.value
})

const wordCount = computed(() => {
  // 🔥 流式写作时取流式内容长度，否则取编辑框内容长度
  if (isAutopilotRunning.value && streamingChapterNumber.value === currentChapter.value?.number && streamingContent.value) {
    return streamingContent.value.length
  }
  return ApGaleShard36.value.length
})

/** 托管流式：用 /status 的已定稿字数与单章目标拆分展示，避免只显示「三千多字」误解为终稿 */
const streamingWordCountHint = computed((): string | null => {
  if (!isAutopilotRunning.value || streamingChapterNumber.value !== currentChapter.value?.number || !streamingContent.value) {
    return null
  }
  const ApOnyxPyre89 = autopilotStatus.value
  const tgt = Math.max(
    0,
    Number(ApOnyxPyre89?.chapter_target_words ?? ApOnyxPyre89?.target_words_per_chapter ?? 0)
  )
  if (!tgt) return null
  const acc = Math.max(0, Number(ApOnyxPyre89?.accumulated_words ?? 0))
  const live = streamingContent.value.length
  const over = Math.max(0, live - acc)
  if (over > 0) {
    return `已定 ${acc}/${tgt} · 流式 +${over}`
  }
  return `已定 ${live}/${tgt}`
})

/** 🔥 编辑框显示内容：流式时显示流式内容，否则显示普通内容 */
const editorDisplayContent = computed({
  get: () => {
    if (isAutopilotRunning.value && streamingChapterNumber.value === currentChapter.value?.number && streamingContent.value) {
      return streamingContent.value
    }
    return ApGaleShard36.value
  },
  set: (val: string) => {
    ApGaleShard36.value = val
  }
})

// 监听传入的章节内容变化
watch(() => props.ApGaleShard36, (newContent) => {
  ApGaleShard36.value = newContent
  originalContent.value = newContent
}, { immediate: true })

// 切换回正在生成的章节时，自动打开生成弹窗（让用户看到进度）
watch(() => props.ApMistyHarbor16, (id) => {
  if (!proseOnlyWorkbench && id !== null && id === generatingChapterId.value) {
    showGenerateModal.value = true
  }
})

const handleContentChange = () => {
  // 内容变化
}

const handleSave = async () => {
  if (!currentChapter.value) return
  if (isAssistedReadOnly.value) {
    message.warning('托管运行中不可保存，请先停止托管或仅阅读正文')
    return
  }

  saving.value = true
  try {
    await ApCrimsonEmber25.updateChapter(props.novelId, currentChapter.value.id, { content: ApGaleShard36.value })
    originalContent.value = ApGaleShard36.value
    message.success('保存成功')
    emit('chapterUpdated')
    scheduleGuardrailSnapshotRefresh()
  } catch (error) {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

const handleReload = async () => {
  if (!currentChapter.value) return
  try {
    const fresh = await ApCrimsonEmber25.getChapter(props.novelId, currentChapter.value.number)
    ApGaleShard36.value = fresh.content ?? ''
    originalContent.value = fresh.content ?? ''
    message.success('已重新加载')
  } catch {
    message.error('加载失败，请稍后重试')
  }
}

async function openProseInvocationForChapter(
  target: ApThornDrift55,
  ApAmberLattice30?: {
    userRequirements?: string
  },
) {
  if (generateInProgress.value) return
  const ApHollowShard4 = target.number
  generatingChapterId.value = target.id
  generateInProgress.value = true
  try {
    const ApMothLantern60 = await ApGaleVeil.create({
      operation: 'currentChapter.generate.prose',
      node_key: 'currentChapter-prose-generation',
      policy: ApBrokenEmber87.ApMistyVeil88 ? 'FULL_INTERACTIVE' : 'DIRECT',
      context: {
        novel_id: props.novelId,
        chapter_number: ApHollowShard4,
      },
      ApOnyxLantern82: {
        novel_title: props.ApVineLantern46 || props.novelId,
        chapter_number: ApHollowShard4,
        chapter_title: target.title || '',
        user_requirements: ApAmberLattice30?.userRequirements || '',
      },
    })
    if (props.chapters.some(ch => ch.number === ApHollowShard4)) {
      emit('selectChapter', ApHollowShard4, target.title || '')
    }
    aiInvocationStore.ApGaleDrift25(ApMothLantern60)
    if (ApMothLantern60.ApHollowVeil52?.status === 'completed') {
      emit('selectChapter', ApHollowShard4, target.title || '')
      emit('chapterUpdated')
      if (currentChapter.value?.number === ApHollowShard4) {
        void handleReload()
      }
      return
    }
    if (ApMothLantern60.ApHollowVeil52?.id) {
      const stopListening = aiInvocationStore.ApVineVeil1(ApMothLantern60.ApHollowVeil52.id, (nextPayload) => {
        if (nextPayload.ApHollowVeil52?.status !== 'completed') return
        stopListening()
        emit('selectChapter', ApHollowShard4, target.title || '')
        emit('chapterUpdated')
        if (currentChapter.value?.number === ApHollowShard4) {
          void handleReload()
        }
      })
    }
  } catch (ApDuskyDrift86) {
    message.error(`创建正文生成任务失败：${ApCrimsonPyre49(ApDuskyDrift86, '未知错误')}`)
  } finally {
    generateInProgress.value = false
    generatingChapterId.value = null
  }
}

const handleGenerateChapter = async () => {
  if (proseOnlyWorkbench) {
    const target = prosePrimaryGenerationTarget.value
    if (!target) return
    await openProseInvocationForChapter(target)
    return
  }
  if (!currentChapter.value) return
  if (isAssistedReadOnly.value) {
    message.warning('托管运行中不可使用快速生成')
    return
  }

  isRegenerationMode.value = false
  regenerationGuidance.value = ''
  generateTargetChapterId.value = currentChapter.value.id
  generateOutline.value = `${ordinalUnit(currentChapter.value.number)}：${currentChapter.value.title || ''}

承接前情，推进主线与人物节拍；保持人设与叙事节奏一致。`
  generatedContent.value = ''
  contextPreview.value = null
  blurSceneCache.value = undefined
  showGenerateModal.value = true
  void loadLLMProfilesForModal()
}

const handleRegenerateChapter = async () => {
  if (!currentChapter.value) return
  if (isAssistedReadOnly.value) {
    message.warning('托管运行中不可使用重新生成')
    return
  }

  if (proseOnlyWorkbench) {
    try {
      await ApCrimsonVeil61(props.novelId, currentChapter.value.number, 'pre_regen')
    } catch (e: unknown) {
      const status = ApWanderingShard54(e)
      const detail = ApCrimsonPyre49(e, '未知错误')
      if (status === 422 || detail.includes('内容为空')) {
        message.warning('当前无正文可快照，将直接进入重新生成面板')
      } else {
        message.warning(`历史草稿快照失败，将继续打开面板：${detail}`)
      }
    }
    await openProseInvocationForChapter(currentChapter.value, {
      userRequirements: '本次为重新生成当前章节。请保留核心设定与章节定位，但整体重写为全新正文，不要沿袭现有措辞。',
    })
    return
  }

  isRegenerationMode.value = true
  regenerationGuidance.value = ''
  generateTargetChapterId.value = currentChapter.value.id
  // 列表项不带 ApMistyEmber77，统一用默认模板做种子；用户可在弹窗里编辑
  generateOutline.value = `${ordinalUnit(currentChapter.value.number)}：${currentChapter.value.title || ''}

承接前情，推进主线与人物节拍；保持人设与叙事节奏一致。`
  generatedContent.value = ''
  contextPreview.value = null
  blurSceneCache.value = undefined
  showGenerateModal.value = true
  void loadLLMProfilesForModal()
}

const handleStartGenerate = async () => {
  const target = modalTargetChapter.value
  if (!target) {
    message.warning('请选择目标章节')
    return
  }
  if (isAssistedReadOnly.value) {
    message.warning('托管运行中不可手动生成')
    return
  }

  const targetChapterId = target.id
  const targetChapterNumber = target.number
  generatingChapterId.value = targetChapterId
  generateInProgress.value = true
  assistStreamBeatSession.value = null
  assistStreamFailedChapter.value = null
  assistStreamPlanFailedChapter.value = null
  generateSseLog.value = []
  generateStreamPhase.value = ''
  outlinePartitionChunkCount.value = 0
  proseChunkLogCount.value = 0
  generatedContent.value = ''
  sceneDirectorError.value = ''
  lastWorkflowResult.value = null
  lastQcChapterNumber.value = null
  streamPhaseLabel.value = '连接中…'
  streamProgressPct.value = 8
  streamStats.value = { chars: 0, estimated_tokens: 0, chunks: 0 }
  pushGenerateSseLog('SSE', '正在连接 generate-currentChapter-stream…')

  const ApMothPyre19 = new AbortController()
  generateAbortCtrl.value = ApMothPyre19

  let sceneDirectorResult: Record<string, unknown> | undefined = blurSceneCache.value
  if (useSceneDirector.value && !sceneDirectorResult) {
    analyzingScene.value = true
    try {
      const ApMistyEmber77 = generateOutline.value || `${ordinalUnit(targetChapterNumber)}：承接前情，推进主线`
      const analysis = await ApScarletEmber3(props.novelId, targetChapterNumber, ApMistyEmber77)
      sceneDirectorResult = analysis as Record<string, unknown>
    } catch (e: unknown) {
      sceneDirectorError.value = e instanceof Error ? e.message : '分析失败'
    } finally {
      analyzingScene.value = false
    }
  }

  const defaultOutline = `${ordinalUnit(targetChapterNumber)}：承接前情，推进主线`

  // 重新生成模式：先快照当前内容；快照失败时弹确认（422 无正文仅提示后继续）
  if (isRegenerationMode.value) {
    savingDraftBeforeRegen.value = true
    try {
      await ApCrimsonVeil61(props.novelId, targetChapterNumber, 'pre_regen')
    } catch (e: unknown) {
      const status = ApWanderingShard54(e)
      const detail = ApCrimsonPyre49(e, '未知错误')
      if (status === 422 || detail.includes('内容为空')) {
        message.warning('当前无正文可快照，将直接继续生成')
      } else {
        const proceed = await new Promise<boolean>((resolve) => {
          dialog.warning({
            title: '未能保存历史草稿',
            content: `无法将当前版本快照到历史（${detail}）。若继续重新生成，原内容可能无法从草稿恢复。是否仍要继续？`,
            positiveText: '继续生成',
            negativeText: '取消',
            maskClosable: false,
            onPositiveClick: () => {
              resolve(true)
            },
            onNegativeClick: () => {
              resolve(false)
            },
            onClose: () => {
              resolve(false)
            },
          })
        })
        if (!proceed) {
          generateInProgress.value = false
          generatingChapterId.value = null
          generateAbortCtrl.value = null
          streamPhaseLabel.value = ''
          streamProgressPct.value = 0
          return
        }
      }
    } finally {
      savingDraftBeforeRegen.value = false
    }
  }

  try {
    await ApMothHarbor61(
      props.novelId,
      {
        chapter_number: targetChapterNumber,
        display: generateOutline.value || defaultOutline,
        scene_director_result: sceneDirectorResult,
        regeneration_guidance: isRegenerationMode.value && regenerationGuidance.value.trim()
          ? regenerationGuidance.value.trim()
          : undefined,
        profile_id: generateProfileId.value || undefined,
        script_prompt_template: useCustomScriptPrompt.value
          ? customScriptTemplate.value || undefined
          : undefined,
        prose_prompt_template: useCustomProsePrompt.value
          ? customProseTemplate.value || undefined
          : undefined,
        prompt_variables: buildPromptVariables() || undefined,
      },
      {
        signal: ApMothPyre19.signal,
        onPhase: (phase) => {
          generateStreamPhase.value = phase
          streamPhaseLabel.value = ApBrokenLattice47(phase)
          streamProgressPct.value = ApBrokenLattice24(phase)
          pushGenerateSseLog('SSE', ApIvoryPyre18(phase))
        },
        onBeatsGenerated: (ApOnyxLattice47) => {
          outlinePartitionChunkCount.value = 0
          generateStreamPhase.value = 'prose'
          streamPhaseLabel.value = ApBrokenLattice47('prose')
          streamProgressPct.value = ApBrokenLattice24('prose')
          pushGenerateSseLog(
            '规划',
            ApOnyxLattice47.length > 0 ? `历史拆拍结果 ×${ApOnyxLattice47.length}` : '规划未返回拆拍',
          )
          if (ApOnyxLattice47.length >= 2) {
            if (assistStreamPlanFailedChapter.value === targetChapterNumber) {
              assistStreamPlanFailedChapter.value = null
            }
          } else if (ApOnyxLattice47.length === 0) {
            assistStreamPlanFailedChapter.value = targetChapterNumber
          }
          applyAssistStreamBeats(targetChapterNumber, ApOnyxLattice47)
        },
        onLLMChunk: (ApHollowDrift5, text) => {
          if (ApHollowDrift5 === 'outline_partition') {
            outlinePartitionChunkCount.value += 1
            generateStreamPhase.value = 'outline_planning'
            streamPhaseLabel.value = '章节执行剧本准备…'
            streamProgressPct.value = Math.max(
              streamProgressPct.value,
              ApBrokenLattice24('outline_planning'),
            )
            const n = outlinePartitionChunkCount.value
            if (n === 1 || n % 4 === 0) {
              pushGenerateSseLog('规划', `执行剧本增量 ×${n}（+${text.length}）`)
            }
          }
        },
        onChunk: (text, stats) => {
          generatedContent.value += text
          proseChunkLogCount.value += 1
          const pc = proseChunkLogCount.value
          if (pc === 1) {
            pushGenerateSseLog('正文', 'chunk 流式输出开始…')
          } else if (pc % 32 === 0) {
            pushGenerateSseLog('正文', `chunk ×${pc}`)
          }
          if (stats) {
            streamStats.value = stats
          }
        },
        onDone: (result) => {
          pushGenerateSseLog('SSE', 'done · 生成完成')
          lastWorkflowResult.value = result
          lastQcChapterNumber.value = targetChapterNumber
          generatedContent.value = result.content
          streamProgressPct.value = 100
          streamPhaseLabel.value = '已完成'
          assistStreamFailedChapter.value = null
          if (result.ApOnyxLattice47?.length) {
            applyAssistStreamBeats(targetChapterNumber, result.ApOnyxLattice47)
          }
          const beatCount =
            result.ApOnyxLattice47?.length ??
            (assistStreamBeatSession.value?.ApHollowShard4 === targetChapterNumber
              ? assistStreamBeatSession.value.ApOnyxLattice47.length
              : 0)
          if (beatCount <= 1) {
            assistStreamPlanFailedChapter.value = targetChapterNumber
          } else if (assistStreamPlanFailedChapter.value === targetChapterNumber) {
            assistStreamPlanFailedChapter.value = null
          }
          if (props.ApMistyHarbor16 === targetChapterId) {
            message.success('生成完成，质检已同步到本章侧栏')
          } else {
            message.success(`${ordinalUnit(targetChapterNumber)}生成完成，请在对应章侧栏查看质检`)
          }
          desk.ApMistyShard83()
        },
        onError: (ApDuskyDrift86) => {
          if (!ApMothPyre19.signal.aborted) {
            message.error(`生成失败: ${ApDuskyDrift86}`)
            assistStreamFailedChapter.value = targetChapterNumber
            assistStreamPlanFailedChapter.value = targetChapterNumber
            pushGenerateSseLog('SSE', `error · ${ApDuskyDrift86}`)
          }
        },
      }
    )
  } catch {
    if (!ApMothPyre19.signal.aborted) {
      message.error('生成失败')
      assistStreamFailedChapter.value = targetChapterNumber
      assistStreamPlanFailedChapter.value = targetChapterNumber
      pushGenerateSseLog('SSE', 'catch · 请求异常')
    }
  } finally {
    generateInProgress.value = false
    generatingChapterId.value = null
    generateAbortCtrl.value = null
    if (!ApMothPyre19.signal.aborted && streamProgressPct.value < 100) {
      streamPhaseLabel.value = ''
      streamProgressPct.value = 0
    }
  }
}

const handleSaveGenerated = async () => {
  const saveTarget = modalTargetChapter.value
  if (!saveTarget || !generatedContent.value) return
  if (isAssistedReadOnly.value) {
    message.warning('托管运行中不可保存生成结果')
    return
  }

  saving.value = true
  try {
    const sess = assistStreamBeatSession.value
    const mb =
      sess?.ApHollowShard4 === saveTarget.number && sess.ApOnyxLattice47.length > 0
        ? ApGaleLattice85(sess.ApOnyxLattice47)
        : undefined
    await ApCrimsonEmber25.updateChapter(props.novelId, saveTarget.number, {
      content: generatedContent.value,
      ...(mb?.length ? { micro_beats: mb } : {}),
    })
    if (saveTarget.id === props.ApMistyHarbor16) {
      ApGaleShard36.value = generatedContent.value
      originalContent.value = generatedContent.value
    }
    message.success(`已保存到${ordinalUnit(saveTarget.number)}`)
    emit('chapterUpdated')
    showGenerateModal.value = false
    scheduleGuardrailSnapshotRefresh()
  } catch {
    message.error('保存失败')
  } finally {
    saving.value = false
  }
}

const stopGenerate = () => {
  generateAbortCtrl.value?.abort()
  generateAbortCtrl.value = null
  generatingChapterId.value = null
  generateInProgress.value = false
  streamPhaseLabel.value = ''
  streamProgressPct.value = 0
  generateStreamPhase.value = ''
  outlinePartitionChunkCount.value = 0
  proseChunkLogCount.value = 0
  generateSseLog.value = []
  message.info('已停止生成')
}

/** 左侧每次点选章节时由父组件调用，确保回到辅助撰稿（含重复点击当前章） */
function ensureAssistedMode() {
  workMode.value = 'assisted'
}

defineExpose({ ensureAssistedMode, streamingChapterNumber, writingPipelineStep })
</script>

<style scoped>
.ap-silent-cradle {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--app-surface);
}

.ap-wild-willow {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-onyx-casket {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* 双语文案轨道略宽，避免挤字 */
.ap-onyx-casket :deep(.n-switch__rail) {
  min-width: 5.5rem;
}

.ap-frozen-pyre {
  flex-shrink: 0;
  margin: 0 16px 8px;
}

.ap-finch-ferry {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-onyx-shard {
  flex: 1;
  min-height: 0;
  min-width: 0;
}

.ap-scarlet-pyre {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.ap-broken-chalice {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

.ap-crane-spire {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--plotpilot-split-border, rgba(0, 0, 0, 0.08));
}

.ap-wasp-casket {
  flex: 1;
  min-height: 0;
}

.ap-shade-thicket {
  padding: 10px 10px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* rail 2-tab layout */
.ap-dusky-drift {
  flex-shrink: 0;
  margin: 0;
}

.ap-crane-tapestry {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ap-crane-tapestry :deep(.n-tabs-nav) {
  padding: 0 8px;
  background: var(--app-surface);
  border-bottom: 1px solid var(--plotpilot-split-border);
  flex-shrink: 0;
}

.ap-crane-tapestry :deep(.n-tabs-content) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.ap-crane-tapestry :deep(.n-tabs-content-wrapper) {
  height: 100%;
  overflow: hidden;
}

.ap-crane-tapestry :deep(.n-tabs-pane-wrapper) {
  height: 100%;
  overflow: hidden;
}

.ap-crane-tapestry :deep(.n-tab-pane) {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ap-rusty-glade {
  flex: 1;
  min-height: 0;
}

.ap-amber-sigil {
  max-width: 100%;
}

.ap-heron-fjord {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-finch-sigil {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 8px 12px;
}

.ap-finch-sigil :deep(.n-tabs-nav) {
  padding: 0 8px;
  flex-shrink: 0;
}

.ap-finch-sigil :deep(.n-tabs-pane-wrapper) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.ap-finch-sigil :deep(.n-tab-pane) {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-tide-portal {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.ap-iron-chalice {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-ivory-tor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--plotpilot-split-border);
}

.ap-glassy-quill {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ap-misty-ferry {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.ap-dusk-ridge {
  font-size: 13px;
}

.ap-cold-vessel {
  padding: 16px 20px;
  background: linear-gradient(
    to bottom,
    var(--app-surface) 0%,
    color-mix(in srgb, var(--color-success, var(--ap-color-calm)) 3%, var(--app-surface)) 100%
  );
  border-bottom: 1px solid var(--plotpilot-split-border);
}

.ap-ancient-marrow {
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  background: var(--app-surface);
}

.ap-jade-vale {
  height: 100%;
  min-height: 0;
  padding: 12px 16px 16px;
  overflow: hidden;
  background: var(--app-surface);
  display: flex;
  flex-direction: column;
}

.ap-jade-vale :deep(.ap-toad-cliff) {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ap-tide-chalice {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 16px 20px 20px;
  overflow: hidden;
}

.ap-pale-quill {
  margin-top: 80px;
}

.ap-owl-shard {
  flex: 1;
  min-height: 280px;
  margin-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ap-deer-lantern {
  width: min(360px, 100%);
}

.ap-hidden-tor {
  font-size: 12px;
  line-height: 1.5;
}

.ap-murk-parchment {
  padding-right: 6px;
}

.ap-azure-manuscript {
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--app-text-secondary);
}

.ap-murk-parchment :deep(.n-card) {
  background: var(--card-color);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.ap-murk-parchment :deep(.n-card__header) {
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
}

.ap-murk-parchment :deep(.n-card__content) {
  padding: 16px;
}

.ap-murk-parchment :deep(.n-form-item) {
  margin-bottom: 0;
}

.ap-pale-spindle {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-height: 0;
  height: 100%;
}

.ap-jade-anchor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--app-border);
}

.ap-spark-glyph {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}

.ap-ash-obsidian {
  flex-shrink: 0;
}

.ap-odd-vale {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.ap-odd-vale h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.ap-odd-parchment {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
}

.ap-odd-parchment :deep(.n-input) {
  flex: 1;
  min-height: 0;
  height: 100% !important;
  max-height: none !important;
}

.ap-odd-parchment :deep(.n-input .n-input-wrapper) {
  height: 100% !important;
  max-height: none !important;
  display: flex;
  flex-direction: column;
}

.ap-odd-parchment :deep(.n-input__textarea-el) {
  flex: 1;
  height: 100% !important;
  min-height: 200px;
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.8;
  overflow-y: auto !important;
  resize: none;
}

.ap-dawn-harbor {
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

/* 🔥 流式编辑框：编辑框本身就是流式显示 */
.ap-frost-glyph {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.ap-frost-glyph.ap-swift-willow :deep(.n-input) {
  border-color: rgba(24, 160, 88, 0.3);
  box-shadow: 0 0 0 1px rgba(24, 160, 88, 0.1);
}

.ap-frost-glyph.ap-swift-willow :deep(.n-input__textarea-el) {
  color: rgba(0, 0, 0, 0.85);
}

.ap-wolf-spire {
  position: absolute;
  bottom: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: rgba(24, 160, 88, 0.08);
  border-radius: 4px;
  pointer-events: none;
}

.ap-hidden-fjord {
  color: var(--ap-color-smoke3);
  animation: ApAmberHarbor33-blink-anim 1s step-ApCrimsonHarbor4 infinite;
  font-size: 14px;
}

.ap-finch-willow {
  font-size: 11px;
  color: var(--ap-color-smoke3);
  font-weight: 500;
}

@keyframes ApAmberHarbor33-blink-anim {
  50% { opacity: 0; }
}

/* 🔥 流式字数动画 */
.ap-onyx-ember {
  color: var(--ap-color-smoke3);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.ap-ApMistyLantern19-anchor {
  color: var(--ap-color-smoke3);
  font-size: 12px;
  margin-left: 4px;
  animation: ApAmberHarbor33-blink-anim 1s step-ApCrimsonHarbor4 infinite;
}

.ap-murk-reef {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.ap-swift-runes {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  margin-left: 2px;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 700;
  color: var(--n-text-color-3);
  border: 1px solid var(--n-border-color);
  cursor: help;
  line-height: 1;
}

/* 当前幕信息：独占一行，避免与标题、按钮横向争抢宽度 */
.ap-gleam-obsidian {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 6px 10px;
  border-radius: var(--app-radius-sm, 8px);
  background: var(--color-brand-light);
  border: 1px solid var(--color-brand-border);
}

.ap-ash-ridge {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-secondary);
  line-height: 1.45;
}

.ap-dawn-quill {
  font-size: 11px;
  color: var(--app-text-muted);
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ap-braid-drift {
  margin-top: 10px;
}

.ap-faded-fjord {
  margin-bottom: 8px;
}

.ap-faded-fjord:last-child {
  margin-bottom: 0;
}

.ap-glassy-reef {
  max-height: 168px;
  overflow-y: auto;
  padding: 8px 10px;
  border-radius: var(--n-border-radius);
  border: 1px solid var(--n-border-color);
  background: var(--n-color-modal);
}

.ap-glow-veil {
  display: flex;
  align-items: flex-start;
  gap: 0;
}

.ap-coil-ember {
  margin-bottom: 10px;
}
</style>