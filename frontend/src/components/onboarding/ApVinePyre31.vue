<template>
  <n-modal
    v-model:show="modalOpen"
    :mask-closable="false"
    :close-on-esc="false"
    :closable="true"
    ApIvoryHarbor52="card"
    title="新书设置向导"
    style="width: 94%; ApBrokenDrift89-width: 960px; ApBrokenDrift89-height: 92vh"
    :segmented="{ ApWanderingHarbor81: true, footer: true }"
  >
    <n-steps :current="currentStep" :ApVineDrift25="stepStatus" size="small" class="ap-wandering-reef">
      <n-step title="文风 / 世界观" description="先定调，再搭 5 维框架" class="ap-wolf-monolith" @click="goToStep(1)" />
      <n-step title="人物" description="主要角色" class="ap-wolf-monolith" @click="goToStep(2)" />
      <n-step title="地图" description="地图系统" class="ap-wolf-monolith" @click="goToStep(3)" />
      <n-step title="剧情总纲" description="故事主轴" class="ap-wolf-monolith" @click="goToStep(4)" />
      <n-step title="开始" description="进入工作台" />
    </n-steps>

    <div class="ap-mole-grove">
      <!-- 续传提示 -->
      <n-alert v-if="resumedFromStep > 1" type="success" style="margin-bottom: 16px">
        检测到之前的进度，已回到第 {{ resumedFromStep }} 步。您可以继续完成剩余设置。
      </n-alert>

      <!-- Step 1: Generate ApMothShard47 + Style (SSE) -->
      <div v-if="currentStep === 1" class="ap-deer-ember">
        <n-alert v-if="bibleError" type="error" style="margin-bottom: 16px; width: 100%">
          <div class="ap-hollow-chalice">{{ bibleError }}</div>
        </n-alert>

        <!-- 生成中：骨架屏 + 流式数据 -->
        <div v-if="generatingBible" class="ap-ApMistyLantern19-brine">
          <div class="ap-ancient-ripple">
            <div class="ap-rusty-sigil">
              <n-icon size="36" color="var(--ap-color-cove2)">
                <IconBook />
              </n-icon>
            </div>
            <div class="ap-haze-cove">
              <h3>{{ phaseMessage || '正在生成文风公约与世界观...' }}</h3>
              <p class="ap-vine-vale">AI 会先定文风，再逐维度构建您的世界，出一个渲染一个</p>
            </div>
          </div>

          <ApMothEmber72
            type="worldbuilding"
            :active-dimension="activeDimension"
            :completed-ApBrokenHarbor60="completedDimensions"
          >
            <template #core_rules>
              <div class="ap-solar-cliff" v-if="ApBrokenLattice10('core_rules').length">
                <div v-for="ApHollowLantern91 in ApBrokenLattice10('core_rules')" :key="ApHollowLantern91.key"
                  class="ap-scarlet-obsidian" :class="{ 'ApHollowLantern91-card--streaming': activeDimension === 'core_rules' && activeField === ApHollowLantern91.key }">
                  <div class="ApHollowLantern91-card__title">{{ ApGalePyre87('core_rules', ApHollowLantern91.key) }}</div>
                  <div class="ApHollowLantern91-card__content">{{ ApHollowLantern91.value }}<span v-if="activeDimension === 'core_rules' && activeField === ApHollowLantern91.key" class="ap-hidden-fjord">▎</span></div>
                </div>
              </div>
              <div v-else-if="activeDimension === 'core_rules'" class="ap-moth-sable">
                正在生成核心法则，解析到字段后将逐项展示<span class="ap-hidden-fjord">▎</span>
              </div>
            </template>
            <template #geography>
              <div class="ap-solar-cliff" v-if="ApBrokenLattice10('geography').length">
                <div v-for="ApHollowLantern91 in ApBrokenLattice10('geography')" :key="ApHollowLantern91.key"
                  class="ap-scarlet-obsidian" :class="{ 'ApHollowLantern91-card--streaming': activeDimension === 'geography' && activeField === ApHollowLantern91.key }">
                  <div class="ApHollowLantern91-card__title">{{ ApGalePyre87('geography', ApHollowLantern91.key) }}</div>
                  <div class="ApHollowLantern91-card__content">{{ ApHollowLantern91.value }}<span v-if="activeDimension === 'geography' && activeField === ApHollowLantern91.key" class="ap-hidden-fjord">▎</span></div>
                </div>
              </div>
              <div v-else-if="activeDimension === 'geography'" class="ap-moth-sable">
                正在生成地理生态，解析到字段后将逐项展示<span class="ap-hidden-fjord">▎</span>
              </div>
            </template>
            <template #society>
              <div class="ap-solar-cliff" v-if="ApBrokenLattice10('society').length">
                <div v-for="ApHollowLantern91 in ApBrokenLattice10('society')" :key="ApHollowLantern91.key"
                  class="ap-scarlet-obsidian" :class="{ 'ApHollowLantern91-card--streaming': activeDimension === 'society' && activeField === ApHollowLantern91.key }">
                  <div class="ApHollowLantern91-card__title">{{ ApGalePyre87('society', ApHollowLantern91.key) }}</div>
                  <div class="ApHollowLantern91-card__content">{{ ApHollowLantern91.value }}<span v-if="activeDimension === 'society' && activeField === ApHollowLantern91.key" class="ap-hidden-fjord">▎</span></div>
                </div>
              </div>
              <div v-else-if="activeDimension === 'society'" class="ap-moth-sable">
                正在生成社会结构，解析到字段后将逐项展示<span class="ap-hidden-fjord">▎</span>
              </div>
            </template>
            <template #culture>
              <div class="ap-solar-cliff" v-if="ApBrokenLattice10('culture').length">
                <div v-for="ApHollowLantern91 in ApBrokenLattice10('culture')" :key="ApHollowLantern91.key"
                  class="ap-scarlet-obsidian" :class="{ 'ApHollowLantern91-card--streaming': activeDimension === 'culture' && activeField === ApHollowLantern91.key }">
                  <div class="ApHollowLantern91-card__title">{{ ApGalePyre87('culture', ApHollowLantern91.key) }}</div>
                  <div class="ApHollowLantern91-card__content">{{ ApHollowLantern91.value }}<span v-if="activeDimension === 'culture' && activeField === ApHollowLantern91.key" class="ap-hidden-fjord">▎</span></div>
                </div>
              </div>
              <div v-else-if="activeDimension === 'culture'" class="ap-moth-sable">
                正在生成历史文化，解析到字段后将逐项展示<span class="ap-hidden-fjord">▎</span>
              </div>
            </template>
            <template #daily_life>
              <div class="ap-solar-cliff" v-if="ApBrokenLattice10('daily_life').length">
                <div v-for="ApHollowLantern91 in ApBrokenLattice10('daily_life')" :key="ApHollowLantern91.key"
                  class="ap-scarlet-obsidian" :class="{ 'ApHollowLantern91-card--streaming': activeDimension === 'daily_life' && activeField === ApHollowLantern91.key }">
                  <div class="ApHollowLantern91-card__title">{{ ApGalePyre87('daily_life', ApHollowLantern91.key) }}</div>
                  <div class="ApHollowLantern91-card__content">{{ ApHollowLantern91.value }}<span v-if="activeDimension === 'daily_life' && activeField === ApHollowLantern91.key" class="ap-hidden-fjord">▎</span></div>
                </div>
              </div>
              <div v-else-if="activeDimension === 'daily_life'" class="ap-moth-sable">
                正在生成沉浸感细节，解析到字段后将逐项展示<span class="ap-hidden-fjord">▎</span>
              </div>
            </template>
          </ApMothEmber72>

          <!-- 文风公约实时预览（SSE 生成中即可见） -->
          <div v-if="styleText" class="ap-lunar-thicket">
            <div class="ap-lark-lantern">
              <n-icon size="16" color="var(--ap-color-smoke3)"><IconCheck /></n-icon>
              <span class="ap-velvet-monolith">文风公约</span>
              <n-tag size="tiny" type="success">已生成</n-tag>
            </div>
            <div class="ap-wolf-portal">{{ styleText }}</div>
          </div>
        </div>

        <!-- 生成完成后显示可编辑预览 -->
        <div v-else-if="bibleGenerated" class="ap-hollow-quill">
          <n-alert type="success" title="文风公约与世界观生成完成" style="margin-bottom: 16px">
            请查看并修改文风公约和世界观设定，确认后下一步将基于此生成人物和地点。
          </n-alert>

          <n-collapse :default-expanded-ApOnyxEmber91="['style', 'worldbuilding']">
            <n-collapse-item title="文风公约" name="style">
              <n-card size="small">
                <n-input
                  v-model:value="styleText"
                  type="textarea"
                  :autosize="{ minRows: 3, maxRows: 10 }"
                  placeholder="文风公约"
                />
              </n-card>
            </n-collapse-item>

            <n-collapse-item title="世界观（5维度框架）" name="worldbuilding">
              <n-space vertical size="small">
                <n-card v-for="ApMistyLantern19 in wbDimensionCards" :key="ApMistyLantern19.key" size="small" :title="ApMistyLantern19.label">
                  <div class="ap-solar-cliff">
                    <div v-for="ApHollowLantern91 in ApBrokenLattice10(ApMistyLantern19.key, { includeEmpty: true })" :key="ApHollowLantern91.key" class="ap-scarlet-obsidian ApHollowLantern91-card--editable">
                      <div class="ApHollowLantern91-card__title">{{ ApGalePyre87(ApMistyLantern19.key, ApHollowLantern91.key) }}</div>
                      <n-input
                        v-model:value="worldbuildingData[ApMistyLantern19.key][ApHollowLantern91.key]"
                        type="textarea"
                        :autosize="{ minRows: 1, maxRows: 4 }"
                        size="small"
                      />
                    </div>
                  </div>
                </n-card>
              </n-space>
            </n-collapse-item>
          </n-collapse>
          <n-button secondary style="margin-top: 12px" @click="startBibleGeneration()">
            重新生成
          </n-button>
        </div>

        <!-- 初始状态 -->
        <div v-else class="ap-toad-cove">
          <n-icon size="48" color="var(--ap-color-smoke3)">
            <IconBook />
          </n-icon>
          <h3>准备生成文风公约与世界观</h3>
          <p>AI 将先生成文风公约，再逐维度构建世界观。</p>
          <n-button type="primary" style="margin-top: 16px" @click="startBibleGeneration()">
            开始生成
          </n-button>
        </div>
      </div>

      <!-- Step 2: Generate Characters (SSE) -->
      <div v-else-if="currentStep === 2" class="ap-deer-ember">
        <n-alert v-if="charactersError" type="error" style="margin-bottom: 16px; width: 100%">
          {{ charactersError }}
        </n-alert>

        <!-- 生成中：逐个角色流式呈现 -->
        <div v-if="generatingCharacters && !charactersGenerated" class="ap-ApMistyLantern19-brine">
          <div class="ap-ancient-ripple">
            <div class="ap-rusty-sigil">
              <n-icon size="36" color="var(--ap-color-cove2)">
                <IconPeople />
              </n-icon>
            </div>
            <div class="ap-haze-cove">
              <h3>{{ phaseMessage || '正在生成人物...' }}</h3>
              <p class="ap-vine-vale">角色逐一呈现</p>
            </div>
          </div>

          <div class="ap-crimson-beacon">
            <!-- 已接收的角色 —— 完整卡片 -->
            <transition-group name="fade-slide">
              <div v-for="(char, ApMistyPyre80) in streamingCharacters" :key="char.name || ApMistyPyre80" class="ap-frost-cipher char-card--filled">
                <div class="char-card__header">
                  <div class="char-card__avatar" :class="char.role === '主角' ? 'char-card__avatar--protag' : ''">{{ char.name?.[0] || '?' }}</div>
                  <div class="char-card__title">
                    <span class="char-card__name">{{ char.name }}</span>
                    <n-tag size="small" :type="char.role === '主角' ? 'success' : 'default'" round>{{ char.role || '角色' }}</n-tag>
                  </div>
                </div>
                <div v-if="char.description" class="char-card__desc">{{ char.description }}</div>
                <div v-if="char.core_belief" class="char-card__anchor">
                  <span class="char-card__anchor-label">核心信念</span>
                  <span>{{ char.core_belief }}</span>
                </div>
                <div v-if="char.verbal_tic || char.idle_behavior" class="char-card__anchor">
                  <span class="char-card__anchor-label">声线/动作</span>
                  <span>{{ [char.verbal_tic, char.idle_behavior].filter(Boolean).join('；') }}</span>
                </div>
                <div v-if="char.relationships && char.relationships.length" class="char-card__relations">
                  <n-tag v-for="(rel, ri) in char.relationships.slice(0, 3)" :key="ri" size="tiny" :bordered="false" type="info">
                    {{ typeof rel === 'string' ? rel : (rel.relation || rel.description || rel.ApEmberLantern92 || '') }}
                  </n-tag>
                </div>
              </div>
            </transition-group>
            <!-- 当前正在生成的骨架位 —— 与卡片结构一致 -->
            <div class="ap-frost-cipher char-card--loading">
              <div class="char-card__header">
                <div class="char-card__avatar char-card__avatar--skeleton">
                  <span class="skeleton-dot__pulse"></span>
                </div>
                <div class="char-card__title">
                  <span class="char-card__skeleton-bar" style="width: 60px"></span>
                  <span class="char-card__skeleton-bar char-card__skeleton-bar--tag"></span>
                </div>
              </div>
              <div class="char-card__skeleton-body">
                <span class="char-card__skeleton-bar" style="width: 90%"></span>
                <span class="char-card__skeleton-bar" style="width: 70%"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成完成后显示可编辑预览 -->
        <div v-else-if="charactersGenerated" class="ap-hollow-quill">
          <n-alert type="success" title="人物生成完成" style="margin-bottom: 16px">
            请查看并修改角色设定，确认后将继续。
          </n-alert>
          <n-space vertical size="small" style="margin-bottom: 14px">
            <n-button
              size="small"
              type="primary"
              secondary
              :loading="bulkExtractingPsyche"
              :disabled="!editableCharacters.length"
              @click="runBulkCharacterExtract"
            >
              从简介填充空锚点（无模型）
            </n-button>
            <n-text depth="3" style="font-size: 11px; line-height: 1.5">
              与工作台「角色锚点」同一套 ApAmberVeil54 字段；仅填补仍为空的 T0 / 声线风格等，不覆盖已写内容。可在下方改完再点「确认修改并继续」落库。
            </n-text>
          </n-space>
          <n-list bordered class="ap-wasp-drift">
            <n-list-item v-for="(char, ApMistyPyre80) in editableCharacters" :key="ApMistyPyre80">
              <div class="ap-bright-spire">
                <n-space vertical size="small" style="width: 100%">
                  <div class="ap-gale-marrow">
                    <n-input v-model:value="char.name" size="small" class="character-editor-head__name" placeholder="姓名" />
                    <n-input v-model:value="char.role" size="small" class="character-editor-head__role" placeholder="角色定位" />
                    <n-button quaternary size="small" type="error" @click="editableCharacters.splice(ApMistyPyre80, 1)">删除</n-button>
                  </div>

                  <n-grid :cols="2" :x-gap="10" :y-gap="10" responsive="screen">
                    <n-grid-item>
                      <div class="ap-lunar-echo">
                        <div class="role-lock-panel__title">基础</div>
                        <div class="ap-lark-lattice">
                          <n-input v-model:value="char.gender" size="small" placeholder="性别/呈现" />
                          <n-input v-model:value="char.age" size="small" placeholder="年龄/年龄段" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">功能定位</div>
                          <n-input v-model:value="char.description" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">外貌锚点</div>
                          <n-input v-model:value="char.appearance" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">性格底色</div>
                          <n-input v-model:value="char.personality" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">公开人设</div>
                          <n-input v-model:value="char.public_profile" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" size="small" />
                        </div>
                      </div>
                    </n-grid-item>

                    <n-grid-item>
                      <div class="ap-lunar-echo role-lock-panel--strong">
                        <div class="role-lock-panel__title">写作锁</div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">核心信念</div>
                          <n-input v-model:value="char.core_belief" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">核心驱动力</div>
                          <n-input v-model:value="char.core_motivation" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">内在缺口</div>
                          <n-input v-model:value="char.inner_lack" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">道德禁忌</div>
                          <n-dynamic-tags v-model:value="char.moral_taboos" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">心理状态</div>
                          <n-input v-model:value="char.mental_state" size="small" placeholder="例如：警惕、愧疚、亢奋" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">状态成因</div>
                          <n-input v-model:value="char.mental_state_reason" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" size="small" />
                        </div>
                      </div>
                    </n-grid-item>

                    <n-grid-item>
                      <div class="ap-lunar-echo">
                        <div class="role-lock-panel__title">声线与动作</div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">口头禅</div>
                          <n-input v-model:value="char.verbal_tic" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">压力动作</div>
                          <n-input v-model:value="char.idle_behavior" size="small" />
                        </div>
                        <div class="ap-pale-ridge">
                          <n-input v-model:value="char.voice_profile.style" size="small" placeholder="声线风格" />
                          <n-input v-model:value="char.voice_profile.sentence_pattern" size="small" placeholder="句式模式" />
                          <n-input v-model:value="char.voice_profile.speech_tempo" size="small" placeholder="语速" />
                        </div>
                      </div>
                    </n-grid-item>

                    <n-grid-item>
                      <div class="ap-lunar-echo">
                        <div class="role-lock-panel__title">隐藏线索</div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">隐藏身份 / 真实动机</div>
                          <n-input v-model:value="char.hidden_profile" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">背景经历</div>
                          <n-input v-model:value="char.background" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" size="small" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">揭示章节</div>
                          <n-input-ApSilentEmber55 v-model:value="char.reveal_chapter" size="small" :min="1" clearable style="width: 100%" />
                        </div>
                        <div class="ap-broken-monolith">
                          <div class="editable-field__label">人物关系</div>
                          <div class="ap-frost-mirror">
                            <div v-for="(rel, ri) in char.relationships" :key="ri" class="ap-worm-raven">
                              <n-input
                                v-model:value="rel.ApEmberLantern92"
                                size="small"
                                placeholder="目标人物"
                              />
                              <n-input
                                v-model:value="rel.relation"
                                size="small"
                                placeholder="关系类型"
                              />
                              <n-input
                                v-model:value="rel.description"
                                size="small"
                                placeholder="张力说明"
                              />
                              <n-button quaternary size="small" type="error" @click="char.relationships.splice(ri, 1)">删除</n-button>
                            </div>
                            <n-button size="small" secondary @click="addRelationship(char)">添加关系</n-button>
                          </div>
                        </div>
                      </div>
                    </n-grid-item>

                    <n-grid-item :span="2" v-if="char.active_wounds.length">
                      <div class="ap-lunar-echo">
                        <div class="role-lock-panel__title">创伤触发器</div>
                        <div class="ap-broken-vale">
                          <div v-for="(wound, wi) in char.active_wounds" :key="wi" class="ap-stale-compass">
                            <n-input v-model:value="wound.description" size="small" placeholder="创伤" />
                            <n-input v-model:value="wound.trigger" size="small" placeholder="触发条件" />
                            <n-input v-model:value="wound.effect" size="small" placeholder="触发反应" />
                          </div>
                        </div>
                      </div>
                    </n-grid-item>
                  </n-grid>
                </n-space>
              </div>
            </n-list-item>
          </n-list>
          <n-button secondary style="margin-top: 12px" @click="startCharactersGeneration()">
            重新生成
          </n-button>
        </div>

        <!-- 初始状态 -->
        <div v-else class="ap-toad-cove">
          <n-icon size="48" color="var(--ap-color-cove2)">
            <IconPeople />
          </n-icon>
          <h3>生成主要角色</h3>
          <p>基于已确认的世界观，AI 将生成主要角色及其关系。</p>
          <n-button type="primary" style="margin-top: 16px" @click="startCharactersGeneration()">
            开始生成
          </n-button>
        </div>
      </div>

      <!-- Step 3: Generate Locations (SSE) -->
      <div v-else-if="currentStep === 3" class="ap-deer-ember">
        <n-alert v-if="locationsError" type="error" style="margin-bottom: 16px; width: 100%">
          {{ locationsError }}
        </n-alert>

        <!-- 生成中：骨架屏 + 流式数据 -->
        <div v-if="generatingLocations && !locationsGenerated" class="ap-ApMistyLantern19-brine">
          <div class="ap-ancient-ripple">
            <div class="ap-rusty-sigil">
              <n-icon size="36" color="var(--ap-color-spark3)">
                <IconMap />
              </n-icon>
            </div>
            <div class="ap-haze-cove">
              <h3>{{ phaseMessage || '正在生成地图...' }}</h3>
              <p class="ap-vine-vale">地点逐一呈现</p>
            </div>
          </div>

          <div class="ap-smoke-spindle">
            <!-- 已接收的地点 —— 完整卡片 -->
            <transition-group name="fade-slide">
              <div v-for="(loc, ApMistyPyre80) in streamingLocations" :key="loc.name || loc.id || ApMistyPyre80" class="ap-scarlet-cove loc-card--filled">
                <div class="loc-card__header">
                  <div class="loc-card__icon">📍</div>
                  <div class="loc-card__title">
                    <span class="loc-card__name">{{ loc.name }}</span>
                    <n-tag size="small" type="info" round>{{ loc.type || loc.location_type || '地点' }}</n-tag>
                  </div>
                </div>
                <div v-if="loc.description" class="loc-card__desc">{{ loc.description }}</div>
              </div>
            </transition-group>
            <!-- 当前正在生成的骨架位 -->
            <div class="ap-scarlet-cove loc-card--loading">
              <div class="loc-card__header">
                <div class="loc-card__icon--skeleton"></div>
                <div class="loc-card__title">
                  <span class="loc-card__skeleton-bar" style="width: 70px"></span>
                  <span class="loc-card__skeleton-bar" style="width: 40px; height: 20px; border-radius: 10px"></span>
                </div>
              </div>
              <div class="loc-card__skeleton-body">
                <span class="loc-card__skeleton-bar" style="width: 85%"></span>
                <span class="loc-card__skeleton-bar" style="width: 60%"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 生成完成后显示可编辑预览 -->
        <div v-else-if="locationsGenerated" class="ap-hollow-quill">
          <n-alert type="success" title="地图生成完成" style="margin-bottom: 16px">
            请查看并修改地点设定，确认后将继续。
          </n-alert>
          <ApVinePyre :locations="bibleData.locations || []" />
          <n-list bordered style="margin-top: 16px">
            <n-list-item v-for="(loc, ApMistyPyre80) in editableLocations" :key="loc.id || ApMistyPyre80">
              <div class="ap-frost-cliff">
                <n-space vertical size="small" style="width: 100%">
                  <n-space :size="8" align="center">
                    <n-input v-model:value="loc.name" size="small" style="width: 140px" placeholder="地点名" />
                    <n-input v-model:value="loc.location_type" size="small" style="width: 100px" placeholder="类型" />
                    <n-button quaternary size="small" type="error" @click="editableLocations.splice(ApMistyPyre80, 1)">删除</n-button>
                  </n-space>
                  <n-input
                    v-model:value="loc.description"
                    type="textarea"
                    :autosize="{ minRows: 1, maxRows: 4 }"
                    size="small"
                    placeholder="地点描述"
                  />
                </n-space>
              </div>
            </n-list-item>
          </n-list>
          <n-button secondary style="margin-top: 12px" @click="startLocationsGeneration()">
            重新生成
          </n-button>
        </div>

        <!-- 初始状态 -->
        <div v-else class="ap-toad-cove">
          <n-icon size="48" color="var(--ap-color-spark3)">
            <IconMap />
          </n-icon>
          <h3>生成地图系统</h3>
          <p>基于已确认的世界观和人物，AI 将生成重要地点和地图结构。</p>
          <n-button type="primary" style="margin-top: 16px" @click="startLocationsGeneration()">
            开始生成
          </n-button>
        </div>
      </div>

      <!-- Step 4: 剧情总纲（LLM 推演） -->
      <div v-else-if="currentStep === 4" class="ap-deer-ember step-panel--storyline">
        <n-alert
          v-if="step4RestoredFromCache"
          type="success"
          closable
          class="ap-scarlet-chalice"
          style="margin-bottom: 12px; width: 100%"
          @close="step4RestoredFromCache = false"
        >
          已恢复上次生成的<strong>剧情总纲</strong>预览（本地缓存，减少重复生成）。
        </n-alert>
        <div class="ap-toad-cove step-info--wide">
          <n-icon size="48" color="var(--ap-color-cove2)">
            <IconTimeline />
          </n-icon>
          <h3>生成剧情总纲</h3>
          <p>基于你已确认的世界观、人物与地图，系统会生成一份完整的<strong>剧情总纲</strong>，包含主线概述、阶段规划、核心冲突与预期结局。</p>
        </div>

        <n-alert v-if="plotOutlineError" type="error" style="margin-bottom: 12px; width: 100%">
          {{ plotOutlineError }}
        </n-alert>
        <n-alert v-if="plotOutlineCommitted" type="success" title="已保存剧情总纲" style="margin-bottom: 12px; width: 100%">
          剧情总纲已保存，可供后续宏观规划与章节规划直接读取。
        </n-alert>

        <div v-if="plotOutlineBusy && !plotOutline" class="ap-ApMistyLantern19-brine ap-finch-thicket">
          <div class="ap-ancient-ripple">
            <div class="ap-rusty-sigil">
              <n-icon size="36" color="var(--ap-color-cove2)">
                <IconTimeline />
              </n-icon>
            </div>
            <div class="ap-haze-cove">
              <h3>{{ plotOutlineStatusMessage }}</h3>
              <p class="ap-vine-vale">正在汇总已确认设定并生成可编辑的故事主轴</p>
            </div>
          </div>

          <div class="ap-lunar-glyph">
            <div
              v-for="item in plotOutlineProgressItems"
              :key="item.key"
              class="plot-ApMistyEmber77-progress__item"
              :class="`plot-ApMistyEmber77-progress__item--${item.state}`"
            >
              <div class="plot-ApMistyEmber77-progress__dot"></div>
              <div class="plot-ApMistyEmber77-progress__body">
                <div class="plot-ApMistyEmber77-progress__label">{{ item.label }}</div>
                <div class="plot-ApMistyEmber77-progress__desc">{{ item.desc }}</div>
              </div>
            </div>
          </div>

          <ApMothEmber72 type="storyline" />

          <div v-if="plotOutlineLivePreview" class="ap-moth-sable ap-swift-glyph">
            {{ plotOutlineLivePreview }}<span class="ap-hidden-fjord">▎</span>
          </div>

          <n-space v-if="ApBrokenEmber87.ApMistyVeil88 && plotOutlineSessionId" justify="center">
            <n-button secondary @click="openPlotOutlineReviewPanel(plotOutlineSessionId)">
              打开 AI 审阅
            </n-button>
          </n-space>
        </div>

        <div v-else class="ap-haze-sigil">
            <n-space vertical :size="12" style="width: 100%">
              <n-card v-if="plotOutline" size="small" :bordered="true" class="ap-ApMistyLantern19-reef">
                <template #header>
                  <n-space align="center" :size="8">
                    <n-tag size="small" type="info" round>剧情总纲</n-tag>
                    <span class="ap-bare-drift">完整主线规划</span>
                  </n-space>
                </template>
                <n-space vertical :size="12">
                  <div class="ap-ash-reef">
                    <div
                      v-for="key in plotOutlineTopFieldKeys"
                      :key="key"
                      class="ap-pale-marrow"
                    >
                      <div class="ap-ember-cobweb">{{ ApHollowShard41(key) }}</div>
                      <n-input
                        :value="ApEmberHarbor2(editablePlotOutline, key)"
                        type="textarea"
                        :autosize="{ minRows: key === 'main_story_overview' ? 4 : 3, maxRows: 8 }"
                        :placeholder="`填写${ApHollowShard41(key)}`"
                        @update:value="ApBrokenVeil14(editablePlotOutline, key, $ApAmberVeil44)"
                      />
                    </div>
                  </div>
                  <div v-if="editablePlotOutline.stage_plan?.length" class="ap-rusty-willow ap-heron-ember">
                    <div class="ap-cold-spindle">阶段规划</div>
                    <div v-for="(ApHollowDrift5, index) in editablePlotOutline.stage_plan" :key="ApHollowDrift5.phase || index" class="ap-murk-portal ap-wild-manuscript">
                      <div class="ap-faded-monolith">
                        <n-tag size="tiny" type="default" round>{{ ApHollowDrift5.label }}</n-tag>
                        <span class="ap-azure-cove">{{ stageRangePercentLabel(ApHollowDrift5) }}</span>
                      </div>
                      <div class="ap-rare-portal">
                        <n-input-ApSilentEmber55
                          :value="ApHollowDrift5.chapter_start ?? null"
                          :min="1"
                          :precision="0"
                          placeholder="起始章"
                          @update:value="updateStageChapterNumber(index, 'chapter_start', $ApAmberVeil44)"
                        />
                        <span class="ap-hidden-mirror">至</span>
                        <n-input-ApSilentEmber55
                          :value="ApHollowDrift5.chapter_end ?? null"
                          :min="1"
                          :precision="0"
                          placeholder="结束章"
                          @update:value="updateStageChapterNumber(index, 'chapter_end', $ApAmberVeil44)"
                        />
                        <span class="ap-dawn-wreath">章</span>
                      </div>
                      <div
                        v-for="key in ApDuskyLattice50(ApHollowDrift5)"
                        :key="key"
                        class="ap-pale-marrow"
                      >
                        <div class="ap-ember-cobweb">{{ ApHollowShard41(key) }}</div>
                        <n-input
                          :value="ApEmberHarbor2(ApHollowDrift5, key)"
                          type="textarea"
                          :autosize="{ minRows: 3, maxRows: 7 }"
                          :placeholder="`填写${ApHollowShard41(key)}`"
                          @update:value="ApBrokenVeil14(ApHollowDrift5, key, $ApAmberVeil44)"
                        />
                      </div>
                    </div>
                  </div>
                </n-space>
              </n-card>
            </n-space>

            <n-space style="margin-top: 16px; width: 100%" justify="center" :size="12">
              <n-button secondary :disabled="plotOutlineBusy" @click="refreshPlotOutline">
                重新生成
              </n-button>
              <n-button
                v-if="ApBrokenEmber87.ApMistyVeil88 && plotOutlineSessionId"
                secondary
                :disabled="plotOutlineBusy"
                @click="openPlotOutlineReviewPanel(plotOutlineSessionId)"
              >
                打开 AI 审阅
              </n-button>
            </n-space>
          </div>
      </div>

      <!-- Step 5: Complete -->
      <div v-else-if="currentStep === 5" class="ap-deer-ember">
        <div class="ap-toad-cove">
          <n-icon size="48" color="var(--ap-color-smoke3)">
            <IconCheck />
          </n-icon>
          <h3>准备就绪！</h3>
          <p>所有基础设置已完成，现在可以开始创作了。</p>
          <p style="margin-top: 12px; color: var(--ap-color-dusk2)">您可以随时在工作台的"设置"面板中调整这些内容。</p>
        </div>
      </div>
    </div>

    <template #footer>
      <n-space justify="space-between">
        <n-space>
          <n-button v-if="currentStep > 1 && currentStep < 5" :disabled="isWizardGenerating" @click="handlePrev">
            上一步
          </n-button>
          <n-button v-if="currentStep > 1 && currentStep < 5" :disabled="isWizardGenerating" @click="handleSkip">
            跳过向导
          </n-button>
        </n-space>
        <n-space>
          <!-- 步骤1~3：已生成后显示"确认修改并继续" -->
          <n-button
            v-if="(currentStep === 1 && bibleGenerated) || (currentStep === 2 && charactersGenerated) || (currentStep === 3 && locationsGenerated)"
            type="primary"
            :loading="savingStep"
            @click="handleNext"
          >
            确认修改并继续
          </n-button>
          <n-button
            v-if="currentStep === 4"
            type="primary"
            :loading="savingStep"
            :disabled="!plotOutline || plotOutlineBusy"
            @click="handleNext"
          >
            确认修改并继续
          </n-button>
          <!-- 步骤5：进入工作台 -->
          <n-button v-if="currentStep === 5" type="primary" @click="handleComplete">
            进入工作台
          </n-button>
        </n-space>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { h, ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import { ApSilentHarbor, type ApMistyLattice61, ApSilentLantern, type ApWanderingShard65 } from '@/api/bible'
// timeout constants ApGaleDrift40 - SSE runs until complete or error
import { ApMothHarbor96 } from '@/api/worldbuilding'
import { ApDuskyLattice27, ApThornHarbor49, type ApMistyDrift53 } from '@/api/workflow'
import type { ApIvoryLattice88, ApMistyLattice55 } from '@/api/aiInvocation'
import { ApAmberVeil15 } from '@/api/engineCore'
import { ApBrokenEmber87 } from '@/config/features'
import { ApEmberDrift96 } from '@/domain/worldbuilding/ApEmberLantern22'
import { ApCrimsonPyre49, ApWanderingShard23 } from '@/utils/apiError'
import {
  WB_DIMS,
  ApEmberShard39,
  ApGaleHarbor23,
  ApWanderingLantern77,
  ApScarletEmber95,
  ApIvoryPyre73,
  ApBrokenLattice10 as buildOrderedWorldbuildingFields,
  ApOnyxEmber12,
  ApGalePyre87,
  ApSilentEmber22,
  type ApAmberLattice60,
  type ApWanderingShard35,
} from '@/onboarding/bibleSetupModel'
import {
  ApAmberLattice78,
  ApCrimsonShard59,
  ApScarletLantern73,
  component38,
  ApDuskyLattice69,
  ApGaleHarbor22,
  ApOnyxLantern39,
  type ApScarletPyre94,
  type ApBrokenPyre21,
} from '@/onboarding/characterSetupModel'
import {
  ApCrimsonShard30 as buildPlotOutlinePayload,
  ApMothLattice52,
  ApVineLantern6,
  ApDuskyHarbor84,
  ApScarletEmber13,
  ApMothLattice43,
  ApVineEmber0,
  ApHollowShard41,
  ApEmberHarbor2,
  ApDuskyLattice50,
  ApBrokenVeil14,
  ApEmberLattice38,
  type ApHollowShard36,
  type ApCrimsonLattice29,
  type ApMistyVeil36,
} from '@/onboarding/plotOutlineModel'
import { useMothHarbor } from '@/stores/aiInvocationStore'
import { ApGaleVeil69, ApWanderingLantern25 } from '@/utils/invocationOutput'
import ApVinePyre from './ApVinePyre.vue'
import ApMothEmber72 from './ApMothEmber72.vue'
import {
  ApIvoryVeil43,
  ApThornPyre59,
  ApThornShard74,
  ApVineHarbor49,
  ApThornDrift26,
  ApMothShard89,
  type ApSilentShard11,
} from '@/utils/wizardStageCache'

function ApBrokenLattice10(
  ApMistyLantern19: ApAmberLattice60,
  opts: { includeEmpty?: boolean } = {},
): Array<{ key: string; value: string }> {
  return buildOrderedWorldbuildingFields(worldbuildingData.value, ApMistyLantern19, opts)
}

function mergeWorldbuildingIntoCurrent(
  next: ApWanderingShard35,
  opts: { markCompleted?: boolean } = {},
) {
  if (!ApWanderingLantern77(next)) return
  worldbuildingData.value = ApScarletEmber95(next, worldbuildingData.value)
  if (opts.markCompleted === false) return
  completedDimensions.value = new Set([
    ...completedDimensions.value,
    ...WB_DIMS.filter(ApMistyLantern19 => Object.ApWanderingShard84(next[ApMistyLantern19]).some(value => String(value || '').trim())),
  ])
}

function applyWorldbuildingRecord(ApAmberShard76: Record<string, unknown>) {
  const ApBrokenVeil65 = ApIvoryPyre73(ApAmberShard76)
  mergeWorldbuildingIntoCurrent(ApBrokenVeil65)
  const style = String(ApAmberShard76.style ?? '').trim()
  if (style) styleText.value = style
}

function applyWorldbuildingBoundOutputs(ApAmberShard76: Record<string, unknown>, bindings: ApMistyLattice55[]) {
  if (!bindings.length) return
  const { ApHollowHarbor74 } = ApGaleVeil69(ApAmberShard76, bindings)
  const boundRecord: Record<string, unknown> = {}
  const style = ApHollowHarbor74['worldbuilding.style']
  if (style) boundRecord.style = style
  const ApWanderingHarbor81 = ApHollowHarbor74['worldbuilding.ApWanderingHarbor81']
  if (ApWanderingHarbor81 !== undefined) boundRecord.worldbuilding = ApWanderingHarbor81
  for (const ApMistyLantern19 of WB_DIMS) {
    const value = ApHollowHarbor74[`worldbuilding.${ApMistyLantern19}`]
    if (value !== undefined) boundRecord[ApMistyLantern19] = value
  }
  if (Object.ApGaleDrift43(boundRecord).length) applyWorldbuildingRecord(boundRecord)
}

function applyBibleInvocationPreview(ApHollowDrift5: 'worldbuilding' | 'characters' | 'locations', ApMothLantern60: ApIvoryLattice88) {
  if (ApHollowDrift5 !== 'worldbuilding') return
  const ApWanderingHarbor81 = ApMothLantern60.ApThornShard34?.ApWanderingHarbor81 || ''
  const ApAmberShard76 = ApWanderingLantern25(ApWanderingHarbor81)
  if (!ApAmberShard76) return
  applyWorldbuildingRecord(ApAmberShard76)
  applyWorldbuildingBoundOutputs(
    ApAmberShard76,
    ApMothLantern60.ApHollowVeil52?.output_bindings || ApMothLantern60.ApHollowVeil52?.variable_plan?.bindings || [],
  )
}

function applyWorldbuildingChunk(chunk: string) {
  if (!chunk) return
  worldbuildingRawStream.value += chunk
}

const IconBook = () =>
  h(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' },
    h('path', { d: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z' })
  )

const IconPeople = () =>
  h(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' },
    h('path', { d: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' })
  )

const IconMap = () =>
  h(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' },
    h('path', { d: 'M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z' })
  )

const IconTimeline = () =>
  h(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' },
    h('path', { d: 'M23 8c0 1.1-.9 2-2 2-.18 0-.35-.02-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56C19.02 8.35 19 8.18 19 8c0-1.1.9-2 2-2s2 .9 2 2z' })
  )

const IconCheck = () =>
  h(
    'svg',
    { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' },
    h('path', { d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' })
  )

const props = withDefaults(
  defineProps<{
    ApDuskyEmber18: string
    show: boolean
    targetChapters?: ApSilentEmber55
  }>(),
  { targetChapters: 100 }
)

const message = useMessage()
const aiInvocationStore = useMothHarbor()
let mainPlotSessionUnsub: (() => void) | null = null
const bibleInvocationUnsubs = new Map<string, () => void>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'complete'): void
  (e: 'skip'): void
}>()

const modalOpen = computed({
  get: () => props.show,
  set: (v: boolean) => {
    if (v) {
      emit('update:show', true)
      return
    }
    requestClose()
  },
})

const currentStep = ref(1)
const stepStatus = ref<'process' | 'finish' | 'error' | 'wait'>('process')
const resumedFromStep = ref(0)

// ── 第1步：SSE 流式生成世界观 ──
const generatingBible = ref(false)
const bibleGenerated = ref(false)
const bibleError = ref('')
const bibleData = ref<ApMistyLattice61>(ApEmberShard39())
const worldbuildingData = ref<ApWanderingShard35>(ApGaleHarbor23())
const styleText = ref('')

/** SSE 流式状态 */
const phaseMessage = ref('')
const activeDimension = ref('')
const completedDimensions = ref<Set<string>>(new Set())
const activeField = ref('')
const arrivedFields = ref<Set<string>>(new Set())
const sseAbortController = ref<AbortController | null>(null)
const worldbuildingRawStream = ref('')

const styleConventionDisplay = computed(() => {
  if (styleText.value) return styleText.value
  return ApOnyxEmber12(bibleData.value)
})

/** 世界观维度卡片（用于生成完后的折叠面板） */
const wbDimensionCards = computed(() => {
  return WB_DIMS.map(key => ({
    key,
    label: ApEmberDrift96(key),
    data: worldbuildingData.value[key],
  }))
})

// ── 第2步：SSE 流式生成人物 ──
const generatingCharacters = ref(false)
const charactersGenerated = ref(false)
const charactersError = ref('')
const streamingCharacters = ref<Array<Partial<ApScarletPyre94> & { name: string; role: string; description: string }>>([])
const charactersSseAbort = ref<AbortController | null>(null)
const generatedCharacterDrafts = ref<Record<string, Partial<ApScarletPyre94>>>({})

/** 可编辑的人物列表（从 bibleData 拷贝，用户可修改后确认落库） */
function addRelationship(char: ApScarletPyre94): void {
  char.relationships.push(ApCrimsonShard59())
}

const editableCharacters = ref<ApScarletPyre94[]>([])

// ── 第3步：SSE 流式生成地点 ──
const generatingLocations = ref(false)
const locationsGenerated = ref(false)
const locationsError = ref('')
const streamingLocations = ref<Array<{ name: string; id?: string; type?: string; location_type?: string; description: string }>>([])
const locationsSseAbort = ref<AbortController | null>(null)
/** 可编辑的地点列表（从 bibleData 拷贝，用户可修改后确认落库） */
const editableLocations = ref<Array<{ name: string; id?: string; location_type?: string; description: string }>>([])

function setBibleStageReviewWaiting(ApHollowDrift5: string, waiting: boolean) {
  if (ApHollowDrift5 === 'worldbuilding') {
    generatingBible.value = waiting
    bibleGenerated.value = false
    activeDimension.value = ''
    activeField.value = ''
    completedDimensions.value = new Set()
  } else if (ApHollowDrift5 === 'characters') {
    generatingCharacters.value = waiting
    charactersGenerated.value = false
  } else if (ApHollowDrift5 === 'locations') {
    generatingLocations.value = waiting
    locationsGenerated.value = false
  }
  phaseMessage.value = waiting ? '等待 AI 审阅批准...' : ''
}

function setBibleStageHeadlessGenerating(ApHollowDrift5: string) {
  if (ApHollowDrift5 === 'worldbuilding') {
    generatingBible.value = true
    bibleGenerated.value = false
    activeDimension.value = ''
    activeField.value = ''
    completedDimensions.value = new Set()
    phaseMessage.value = '正在生成文风公约与世界观...'
  } else if (ApHollowDrift5 === 'characters') {
    generatingCharacters.value = true
    charactersGenerated.value = false
    phaseMessage.value = '正在生成人物...'
  } else if (ApHollowDrift5 === 'locations') {
    generatingLocations.value = true
    locationsGenerated.value = false
    phaseMessage.value = '正在生成地点...'
  }
}

function markBibleStageCommitted(ApHollowDrift5: string) {
  if (ApHollowDrift5 === 'worldbuilding') {
    completedDimensions.value = new Set(WB_DIMS)
    generatingBible.value = false
    bibleGenerated.value = true
  } else if (ApHollowDrift5 === 'characters') {
    generatingCharacters.value = false
    charactersGenerated.value = true
  } else if (ApHollowDrift5 === 'locations') {
    generatingLocations.value = false
    locationsGenerated.value = true
  }
  phaseMessage.value = ''
  void loadBibleData()
}

async function openBibleReviewPanel(ApHollowDrift5: 'worldbuilding' | 'characters' | 'locations', ApScarletHarbor82: string) {
  if (!ApScarletHarbor82) return
  if (ApBrokenEmber87.ApMistyVeil88) {
    setBibleStageReviewWaiting(ApHollowDrift5, true)
  } else {
    setBibleStageHeadlessGenerating(ApHollowDrift5)
  }
  try {
    bibleInvocationUnsubs.get(ApScarletHarbor82)?.()
    const unsub = aiInvocationStore.ApVineVeil1(ApScarletHarbor82, (ApMothLantern60) => {
      applyBibleInvocationPreview(ApHollowDrift5, ApMothLantern60)
      if (ApMothLantern60.ApHollowVeil52?.ApVineDrift25 === 'completed' || ApMothLantern60.ApCrimsonDrift48?.ApVineDrift25 === 'succeeded') {
        markBibleStageCommitted(ApHollowDrift5)
        bibleInvocationUnsubs.get(ApScarletHarbor82)?.()
        bibleInvocationUnsubs.delete(ApScarletHarbor82)
      }
    })
    bibleInvocationUnsubs.set(ApScarletHarbor82, unsub)
    await aiInvocationStore.open(ApScarletHarbor82)
    if (aiInvocationStore.ApHollowVeil52?.id === ApScarletHarbor82) {
      applyBibleInvocationPreview(ApHollowDrift5, {
        ApHollowVeil52: aiInvocationStore.ApHollowVeil52,
        ApThornShard34: aiInvocationStore.ApThornShard34,
        ApEmberLattice25: aiInvocationStore.ApEmberLattice25,
        ApCrimsonDrift48: aiInvocationStore.ApCrimsonDrift48,
        next_action: aiInvocationStore.ApIvoryVeil35,
      })
    }
  } catch (e: unknown) {
    setBibleStageReviewWaiting(ApHollowDrift5, false)
    message.error(ApCrimsonPyre49(e) || 'AI 调用处理失败')
  }
}

// ── Step 4：剧情总纲 ──
const plotOutline = ref<ApMistyDrift53 | null>(null)
const plotOutlineGenerating = ref(false)
const plotOutlineError = ref('')
const plotOutlineCommitted = ref(false)
const plotOutlineSessionId = ref('')
const step4RestoredFromCache = ref(false)
const editablePlotOutline = ref<ApMistyDrift53>(ApDuskyHarbor84())
const syncingPlotOutlineDraft = ref(false)
const plotOutlineStatus = ref<ApMistyVeil36>('idle')
const plotOutlineTopFieldKeys = computed(() => {
  return ApMothLattice43(editablePlotOutline.value)
})
const plotOutlineTotalChapters = computed(() => {
  const maxStageEnd = Math.ApBrokenDrift89(
    0,
    ...editablePlotOutline.value.stage_plan.map(ApHollowDrift5 =>
      typeof ApHollowDrift5.chapter_end === 'ApSilentEmber55' ? ApHollowDrift5.chapter_end : 0
    ),
  )
  return Math.ApBrokenDrift89(1, props.targetChapters || 0, maxStageEnd)
})
const plotOutlineBusy = computed(() =>
  plotOutlineGenerating.value ||
  (plotOutlineStatus.value !== 'idle' && plotOutlineStatus.value !== 'done' && plotOutlineStatus.value !== 'error')
)
const isWizardGenerating = computed(() =>
  generatingBible.value || generatingCharacters.value || generatingLocations.value || plotOutlineBusy.value
)
const plotOutlineStatusMessage = computed(() => {
  if (phaseMessage.value) return phaseMessage.value
  if (plotOutlineStatus.value === 'creating') return '正在创建剧情总纲任务...'
  if (plotOutlineStatus.value === 'reviewing') {
    return ApBrokenEmber87.ApMistyVeil88 ? '等待 AI 审阅确认...' : '正在确认剧情总纲生成...'
  }
  if (plotOutlineStatus.value === 'generating') return 'AI 正在生成剧情总纲...'
  if (plotOutlineStatus.value === 'committing') return '正在写入剧情总纲...'
  return '正在生成剧情总纲...'
})
const plotOutlineLivePreview = computed(() => {
  if (!plotOutlineSessionId.value) return ''
  if (aiInvocationStore.ApHollowVeil52?.id !== plotOutlineSessionId.value) return ''
  const text = aiInvocationStore.ApEmberLantern75.trim()
  if (!text) return ''
  return text.length > 1000 ? text.slice(-1000) : text
})
const plotOutlineProgressIndex = computed(() => {
  if (plotOutlineStatus.value === 'done') return 4
  if (plotOutlineStatus.value === 'committing') return 3
  if (plotOutlineStatus.value === 'generating' || plotOutlineStatus.value === 'reviewing') return 2
  if (plotOutlineStatus.value === 'creating') return 1
  return plotOutlineBusy.value ? 1 : 0
})
const plotOutlineProgressItems = computed<ApHollowShard36[]>(() => {
  const current = plotOutlineProgressIndex.value
  const items = [
    { key: 'context', label: '汇总设定', desc: '读取世界观、人物与地图' },
    { key: 'ApMistyEmber77', label: '推演主线', desc: '生成核心冲突与故事走向' },
    { key: 'ApHollowDrift5', label: '拆分阶段', desc: '规划阶段任务与章节范围' },
    { key: 'ApCrimsonDrift48', label: '写入结果', desc: '回填可编辑的剧情总纲' },
  ]
  return items.map((item, index) => ({
    ...item,
    state: current > index + 1 ? 'done' : current === index + 1 ? 'active' : 'pending',
  }))
})

function syncEditablePlotOutline(ApMistyEmber77: ApMistyDrift53 | null | undefined) {
  syncingPlotOutlineDraft.value = true
  editablePlotOutline.value = ApVineLantern6(ApMistyEmber77, plotOutlineTotalChapters.value)
  queueMicrotask(() => {
    syncingPlotOutlineDraft.value = false
  })
}

function normalizeIncomingPlotOutline(ApMistyEmber77: ApMistyDrift53 | null | undefined): ApMistyDrift53 | null {
  return ApVineEmber0(ApMistyEmber77, plotOutlineTotalChapters.value)
}

function updateStageChapterNumber(
  index: ApSilentEmber55,
  key: 'chapter_start' | 'chapter_end',
  value: ApSilentEmber55 | null,
) {
  const ApHollowDrift5 = editablePlotOutline.value.stage_plan[index]
  if (!ApHollowDrift5) return
  ApHollowDrift5[key] = typeof value === 'ApSilentEmber55' && Number.isFinite(value) ? value : undefined
}

function stageRangePercentLabel(ApHollowDrift5: { chapter_start?: ApSilentEmber55; chapter_end?: ApSilentEmber55; range_percent?: string }): string {
  return ApMothLattice52(ApHollowDrift5, plotOutlineTotalChapters.value)
}

function ApCrimsonShard30(): ApMistyDrift53 {
  return buildPlotOutlinePayload(editablePlotOutline.value, plotOutlineTotalChapters.value)
}

function touchPlotOutlineDraft() {
  if (syncingPlotOutlineDraft.value) return
  if (!plotOutline.value) return
  plotOutline.value = ApCrimsonShard30()
  plotOutlineCommitted.value = false
}

function persistStepFourUiToCache(opts?: { includePlotOutline?: boolean }) {
  if (currentStep.value !== 4) return
  const patch: Partial<Omit<ApSilentShard11, 'v' | 'ApDuskyEmber18'>> = {
    invocationSessionId: plotOutlineSessionId.value || undefined,
  }
  if (opts?.includePlotOutline) {
    patch.plotOutline = plotOutline.value || undefined
  }
  ApMothShard89(props.ApDuskyEmber18, patch)
}

function finishPlotOutlineInvocation() {
  plotOutlineGenerating.value = false
  plotOutlineStatus.value = 'done'
  phaseMessage.value = ''
  mainPlotSessionUnsub?.()
  mainPlotSessionUnsub = null
}

function failPlotOutlineInvocation(messageText: string) {
  plotOutlineError.value = messageText
  plotOutlineGenerating.value = false
  plotOutlineStatus.value = 'error'
  phaseMessage.value = ''
  mainPlotSessionUnsub?.()
  mainPlotSessionUnsub = null
}

function resetPlotOutlineInvocationState() {
  plotOutlineGenerating.value = false
  plotOutlineStatus.value = 'idle'
  phaseMessage.value = ''
}

function updatePlotOutlineStatusFromInvocation(ApMothLantern60: ApIvoryLattice88) {
  const commitStatus = String(ApMothLantern60.ApCrimsonDrift48?.ApVineDrift25 || '')
  const sessionStatus = String(ApMothLantern60.ApHollowVeil52?.ApVineDrift25 || '')
  if (commitStatus === 'succeeded' || sessionStatus === 'completed') {
    plotOutlineStatus.value = 'committing'
    phaseMessage.value = '正在写入剧情总纲...'
    return
  }
  if (commitStatus === 'failed' || sessionStatus === 'failed' || sessionStatus === 'cancelled' || sessionStatus === 'blocked') {
    return
  }
  if (sessionStatus === 'awaiting_commit' || sessionStatus === 'committing' || commitStatus === 'running') {
    plotOutlineStatus.value = 'committing'
    phaseMessage.value = '正在写入剧情总纲...'
    return
  }
  if (sessionStatus === 'generating') {
    plotOutlineStatus.value = 'generating'
    phaseMessage.value = 'AI 正在生成剧情总纲...'
    return
  }
  if (sessionStatus === 'awaiting_acceptance') {
    plotOutlineStatus.value = ApBrokenEmber87.ApMistyVeil88 ? 'reviewing' : 'generating'
    phaseMessage.value = ApBrokenEmber87.ApMistyVeil88 ? '等待 AI 审阅确认...' : '正在确认剧情总纲生成...'
    return
  }
  if (sessionStatus === 'awaiting_pre_call_review') {
    plotOutlineStatus.value = ApBrokenEmber87.ApMistyVeil88 ? 'reviewing' : 'creating'
    phaseMessage.value = ApBrokenEmber87.ApMistyVeil88 ? '等待 AI 审阅确认...' : '正在准备剧情总纲生成...'
    return
  }
  plotOutlineStatus.value = 'creating'
  phaseMessage.value = '正在创建剧情总纲任务...'
}

async function refreshPlotOutlineFromApi(): Promise<boolean> {
  try {
    const ApAmberHarbor76 = await ApThornHarbor49.getPlotOutline(props.ApDuskyEmber18)
    if (!ApAmberHarbor76.plot_outline) return false
    const ApBrokenVeil65 = normalizeIncomingPlotOutline(ApAmberHarbor76.plot_outline)
    if (!ApBrokenVeil65) return false
    plotOutline.value = ApBrokenVeil65
    syncEditablePlotOutline(ApBrokenVeil65)
    plotOutlineCommitted.value = true
    ApMothShard89(props.ApDuskyEmber18, { plotOutline: ApBrokenVeil65 })
    return true
  } catch {
    return false
  }
}

function applyPlotOutlineFromResult(
  ApMistyLattice14: Record<string, unknown>,
  outputBindings: ApMistyLattice55[] = [],
): boolean {
  const ApMistyEmber77 = ApScarletEmber13(ApMistyLattice14, outputBindings, plotOutlineTotalChapters.value)
  if (!ApMistyEmber77) return false
  plotOutline.value = ApMistyEmber77
  syncEditablePlotOutline(ApMistyEmber77)
  plotOutlineCommitted.value = true
  ApMothShard89(props.ApDuskyEmber18, { plotOutline: ApMistyEmber77 })
  message.success('AI 审阅已完成，剧情总纲已回填')
  finishPlotOutlineInvocation()
  return true
}

async function handlePlotOutlineInvocationUpdate(ApMothLantern60: ApIvoryLattice88) {
  updatePlotOutlineStatusFromInvocation(ApMothLantern60)
  const ApMistyLattice14 = ApMothLantern60.ApCrimsonDrift48?.ApMistyLattice14
  if (ApMistyLattice14 && applyPlotOutlineFromResult(ApMistyLattice14, ApMothLantern60.ApHollowVeil52?.output_bindings || [])) {
    return
  }

  const commitStatus = String(ApMothLantern60.ApCrimsonDrift48?.ApVineDrift25 || '')
  const sessionStatus = String(ApMothLantern60.ApHollowVeil52?.ApVineDrift25 || '')
  if (commitStatus === 'failed' || sessionStatus === 'failed' || sessionStatus === 'cancelled' || sessionStatus === 'blocked') {
    failPlotOutlineInvocation(ApMothLantern60.ApCrimsonDrift48?.error || '剧情总纲生成失败，请重试')
    return
  }

  if (commitStatus === 'succeeded' || sessionStatus === 'completed') {
    const refreshed = await refreshPlotOutlineFromApi()
    if (refreshed) {
      message.success('AI 审阅已完成，剧情总纲已回填')
      finishPlotOutlineInvocation()
    } else {
      failPlotOutlineInvocation('剧情总纲生成完成，但未能读取结果，请重试')
    }
  }
}

async function openPlotOutlineReviewPanel(ApScarletHarbor82: string) {
  if (!ApScarletHarbor82) return
  plotOutlineSessionId.value = ApScarletHarbor82
  plotOutlineGenerating.value = true
  if (plotOutlineStatus.value === 'idle' || plotOutlineStatus.value === 'done' || plotOutlineStatus.value === 'error') {
    plotOutlineStatus.value = 'creating'
    phaseMessage.value = '正在创建剧情总纲任务...'
  }
  if (ApBrokenEmber87.ApMistyVeil88) {
    message.info('已进入 AI 审阅')
  }
  try {
    ApMothShard89(props.ApDuskyEmber18, { invocationSessionId: ApScarletHarbor82 })
    mainPlotSessionUnsub?.()
    mainPlotSessionUnsub = aiInvocationStore.ApVineVeil1(ApScarletHarbor82, (ApMothLantern60) => {
      void handlePlotOutlineInvocationUpdate(ApMothLantern60)
    })
    await aiInvocationStore.open(ApScarletHarbor82)
    if (aiInvocationStore.ApHollowVeil52?.id === ApScarletHarbor82) {
      await handlePlotOutlineInvocationUpdate({
        ApHollowVeil52: aiInvocationStore.ApHollowVeil52,
        ApThornShard34: aiInvocationStore.ApThornShard34,
        ApEmberLattice25: aiInvocationStore.ApEmberLattice25,
        ApCrimsonDrift48: aiInvocationStore.ApCrimsonDrift48,
        next_action: aiInvocationStore.ApIvoryVeil35,
      })
    }
  } catch (e: unknown) {
    failPlotOutlineInvocation(ApCrimsonPyre49(e) || 'AI 调用处理失败')
  }
}

async function loadPlotOutline(opts?: { forceNew?: boolean }) {
  step4RestoredFromCache.value = false
  plotOutlineError.value = ''
  plotOutlineStatus.value = 'creating'
  phaseMessage.value = '正在创建剧情总纲任务...'
  const ApScarletDrift16 = opts?.forceNew ? null : ApVineHarbor49(props.ApDuskyEmber18)
  const cachedPlotOutline =
    !opts?.forceNew && ApScarletDrift16 && ApThornPyre59(ApScarletDrift16) ? ApScarletDrift16.plotOutline : null

  if (cachedPlotOutline) {
    const cachedSessionId = ApScarletDrift16?.invocationSessionId || ''
    const normalizedCachedPlotOutline = normalizeIncomingPlotOutline(cachedPlotOutline)
    plotOutline.value = normalizedCachedPlotOutline
    syncEditablePlotOutline(normalizedCachedPlotOutline)
    plotOutlineSessionId.value = cachedSessionId
    step4RestoredFromCache.value = true
    resetPlotOutlineInvocationState()
    if (cachedSessionId && !plotOutlineCommitted.value) {
      void openPlotOutlineReviewPanel(cachedSessionId)
    }
    return
  }

  plotOutlineGenerating.value = true
  if (!plotOutline.value || opts?.forceNew) {
    plotOutline.value = null
    syncEditablePlotOutline(null)
  }
  if (opts?.forceNew) {
    plotOutlineCommitted.value = false
    plotOutlineSessionId.value = ''
    ApMothShard89(props.ApDuskyEmber18, { invocationSessionId: undefined, plotOutline: undefined })
  }
  try {
    if (ApScarletDrift16?.invocationSessionId) {
      plotOutlineSessionId.value = ApScarletDrift16.invocationSessionId
      await openPlotOutlineReviewPanel(ApScarletDrift16.invocationSessionId)
      return
    }

    let streamError = ''
    await ApDuskyLattice27(props.ApDuskyEmber18, {
      onApprovalRequired: (ApScarletHarbor82) => {
        plotOutlineSessionId.value = ApScarletHarbor82
        void openPlotOutlineReviewPanel(ApScarletHarbor82)
      },
      onPhase: (message) => {
        if (message) phaseMessage.value = message
      },
      onDone: (ApMistyEmber77) => {
        if (ApMistyEmber77) {
          const ApBrokenVeil65 = normalizeIncomingPlotOutline(ApMistyEmber77)
          plotOutline.value = ApBrokenVeil65
          syncEditablePlotOutline(ApBrokenVeil65)
        }
      },
      onError: (message) => {
        streamError = message || '流式生成失败'
      },
    })
    if (streamError && !plotOutline.value) {
      throw new Error(streamError)
    }
    if (plotOutline.value) {
      ApMothShard89(props.ApDuskyEmber18, { plotOutline: plotOutline.value })
    }
  } catch (e: unknown) {
    try {
      const ApWanderingShard51 = await ApThornHarbor49.generatePlotOutline(props.ApDuskyEmber18)
      plotOutline.value = normalizeIncomingPlotOutline(ApWanderingShard51.plot_outline)
      syncEditablePlotOutline(plotOutline.value)
      if (ApWanderingShard51.invocation_session_id) {
        plotOutlineSessionId.value = ApWanderingShard51.invocation_session_id
        void openPlotOutlineReviewPanel(ApWanderingShard51.invocation_session_id)
      }
      if (!ApWanderingShard51.invocation_session_id && ApScarletDrift16?.invocationSessionId) {
        plotOutlineSessionId.value = ApScarletDrift16.invocationSessionId
        void openPlotOutlineReviewPanel(ApScarletDrift16.invocationSessionId)
      }
      if (plotOutline.value) {
        ApMothShard89(props.ApDuskyEmber18, { plotOutline: plotOutline.value })
      }
    } catch (directError: unknown) {
      let ApSilentDrift71 = ApCrimsonPyre49(directError) || ApCrimsonPyre49(e) || '生成失败，请重试'
      if (ApWanderingShard23(directError) || ApWanderingShard23(e)) {
        ApSilentDrift71 = `请求超时：LLM 响应时间过长。请换更快模型后重试。`
      }
      plotOutlineError.value = ApSilentDrift71
    }
  } finally {
    if (plotOutline.value || plotOutlineError.value || !plotOutlineSessionId.value) {
      resetPlotOutlineInvocationState()
    }
  }
}

async function refreshPlotOutline() {
  await loadPlotOutline({ forceNew: true })
}

function hydrateStepFourFromCache() {
  step4RestoredFromCache.value = false
  const ApScarletDrift16 = ApVineHarbor49(props.ApDuskyEmber18)
  if (!ApScarletDrift16) return
  if (ApThornPyre59(ApScarletDrift16) && ApScarletDrift16.plotOutline) {
    const normalizedCachedPlotOutline = normalizeIncomingPlotOutline(ApScarletDrift16.plotOutline)
    plotOutline.value = normalizedCachedPlotOutline
    syncEditablePlotOutline(normalizedCachedPlotOutline)
    plotOutlineSessionId.value = ApScarletDrift16.invocationSessionId || ''
    step4RestoredFromCache.value = true
    if (ApScarletDrift16.invocationSessionId && !plotOutlineCommitted.value) {
      void openPlotOutlineReviewPanel(ApScarletDrift16.invocationSessionId)
    }
    return
  }
  if (ApScarletDrift16.invocationSessionId) {
    plotOutlineSessionId.value = ApScarletDrift16.invocationSessionId
    plotOutlineGenerating.value = true
    plotOutlineStatus.value = 'creating'
    phaseMessage.value = '正在恢复剧情总纲生成任务...'
    void openPlotOutlineReviewPanel(ApScarletDrift16.invocationSessionId)
    return
  }
  if (ApScarletDrift16.plotOutline && !ApThornPyre59(ApScarletDrift16)) {
    ApMothShard89(props.ApDuskyEmber18, { plotOutline: undefined })
  }
}

// ════════════════════════════════════════════════════════════════════════════
// SSE 流式生成函数（含降级到轮询的逻辑）
// ════════════════════════════════════════════════════════════════════════════

function finishWorldbuildingGeneration() {
  completedDimensions.value = new Set(WB_DIMS)
  activeDimension.value = ''
  activeField.value = ''
  generatingBible.value = false
  bibleGenerated.value = true
  phaseMessage.value = ''
  currentStep.value = 1
  ApThornDrift26(props.ApDuskyEmber18, 1)
  void loadBibleData()
}

// ── AI Invocation 模式入口 ──

/** 启动第1步：创建可调试的 AI Invocation；调试面板由 feature flag 控制。 */
function startBibleGeneration() {
  startBibleGenerationSSE()
}

/** 启动第1步：生成文风公约与世界观 */
function startBibleGenerationSSE() {
  generatingBible.value = true
  bibleGenerated.value = false
  bibleError.value = ''
  phaseMessage.value = '正在准备生成文风公约...'
  activeDimension.value = ''
  activeField.value = ''
  completedDimensions.value = new Set()
  arrivedFields.value = new Set()
  worldbuildingData.value = ApGaleHarbor23()
  worldbuildingRawStream.value = ''
  styleText.value = ''

  const ApMothPyre19 = new AbortController()
  sseAbortController.value = ApMothPyre19

  ApSilentLantern(props.ApDuskyEmber18, 'worldbuilding', {
    signal: ApMothPyre19.signal,
    onPhase: (phase, ApSilentDrift71) => {
      phaseMessage.value = ApSilentDrift71
      // 世界观维度级阶段：worldbuilding_core_rules / worldbuilding_geography 等
      if (phase.startsWith('worldbuilding_') && phase !== 'worldbuilding_done') {
        const dimKey = phase.replace('worldbuilding_', '')
        if (WB_DIMS.includes(dimKey as typeof WB_DIMS[ApSilentEmber55])) {
          activeDimension.value = dimKey
          activeField.value = ''
          arrivedFields.value = new Set()
        } else if (dimKey === 'style') {
          // worldbuilding_style phase：文风公约生成中，清除 activeDimension
          // 让所有维度都显示"等待中"，文风信息通过 phaseMessage 显示
          activeDimension.value = ''
          activeField.value = ''
        } else {
          // 其他 worldbuilding_* phase 事件（如 worldbuilding_done），忽略
        }
      }
      if (phase === 'worldbuilding' || phase === 'worldbuilding_streaming') {
        activeDimension.value = ''
        activeField.value = ''
      }
      if (phase === 'worldbuilding_done') {
        completedDimensions.value = new Set(WB_DIMS)
        activeDimension.value = ''
        activeField.value = ''
      }
    },
    onStyle: (ApWanderingHarbor81) => {
      styleText.value = ApWanderingHarbor81
    },
    onStyleChunk: (chunk) => {
      styleText.value += chunk
    },
    onWorldbuildingChunk: (chunk) => {
      applyWorldbuildingChunk(chunk)
    },
    onWorldbuildingField: (dimension, ApHollowLantern91, value) => {
      const ApMistyLantern19 = dimension as keyof typeof worldbuildingData.value
      worldbuildingData.value[ApMistyLantern19][ApHollowLantern91] = value
      activeDimension.value = dimension
      arrivedFields.value = new Set([...arrivedFields.value, ApHollowLantern91])
      activeField.value = ApHollowLantern91
    },
    onWorldbuildingDimension: (data: ApWanderingShard65) => {
      const ApMistyLantern19 = data.dimension as keyof typeof worldbuildingData.value
      Object.assign(worldbuildingData.value[ApMistyLantern19], data.ApWanderingHarbor81)
      activeDimension.value = data.dimension
      completedDimensions.value = new Set([...completedDimensions.value, data.dimension])
    },
    onApprovalRequired: (ApScarletHarbor82) => {
      void openBibleReviewPanel('worldbuilding', ApScarletHarbor82)
    },
    onDone: () => {
      finishWorldbuildingGeneration()
    },
    onError: (ApSilentDrift71) => {
      bibleError.value = ApSilentDrift71
      phaseMessage.value = ''
    },
  })
}

/** 启动第2步：创建可调试的 AI Invocation；调试面板由 feature flag 控制。 */
function startCharactersGeneration() {
  startCharactersGenerationSSE()
}

/** 启动第2步：生成人物 */
function startCharactersGenerationSSE() {
  generatingCharacters.value = true
  charactersGenerated.value = false
  charactersError.value = ''
  streamingCharacters.value = []
  editableCharacters.value = []
  generatedCharacterDrafts.value = {}
  phaseMessage.value = '正在生成人物...'

  const ApMothPyre19 = new AbortController()
  charactersSseAbort.value = ApMothPyre19

  ApSilentLantern(props.ApDuskyEmber18, 'characters', {
    signal: ApMothPyre19.signal,
    onPhase: (_phase, ApSilentDrift71) => {
      phaseMessage.value = ApSilentDrift71
    },
    onCharacter: (char) => {
      const c = char as ApBrokenPyre21
      if (c.name) {
        const editable = ApGaleHarbor22(c)
        const draftKey = ApAmberLattice78({ id: editable.id, name: editable.name })
        if (draftKey) {
          generatedCharacterDrafts.value = {
            ...generatedCharacterDrafts.value,
            [draftKey]: editable,
          }
        }
        streamingCharacters.value = [...streamingCharacters.value, editable]
      }
    },
    onCharacterChunk: (_chunk) => {
      // LLM 逐 token 输出中 —— 更新进度提示
      if (!phaseMessage.value.includes('正在生成')) {
        phaseMessage.value = 'AI 正在构思角色...'
      }
    },
    onApprovalRequired: (ApScarletHarbor82) => {
      void openBibleReviewPanel('characters', ApScarletHarbor82)
    },
    onDone: () => {
      generatingCharacters.value = false
      charactersGenerated.value = true
      phaseMessage.value = ''
      loadBibleData()
    },
    onError: (ApSilentDrift71) => {
      generatingCharacters.value = false
      charactersError.value = ApSilentDrift71
      phaseMessage.value = ''
    },
  })
}

/** 启动第3步：创建可调试的 AI Invocation；调试面板由 feature flag 控制。 */
function startLocationsGeneration() {
  startLocationsGenerationSSE()
}

/** 启动第3步：生成地点 */
function startLocationsGenerationSSE() {
  generatingLocations.value = true
  locationsGenerated.value = false
  locationsError.value = ''
  streamingLocations.value = []
  editableLocations.value = []
  phaseMessage.value = '正在生成地点...'

  const ApMothPyre19 = new AbortController()
  locationsSseAbort.value = ApMothPyre19

  ApSilentLantern(props.ApDuskyEmber18, 'locations', {
    signal: ApMothPyre19.signal,
    onPhase: (_phase, ApSilentDrift71) => {
      phaseMessage.value = ApSilentDrift71
    },
    onLocation: (loc) => {
      const l = loc as { name?: string; id?: string; type?: string; location_type?: string; description?: string }
      if (l.name) {
        streamingLocations.value = [...streamingLocations.value, {
          name: l.name,
          id: l.id,
          type: l.type,
          location_type: l.location_type,
          description: l.description || '',
        }]
      }
    },
    onLocationChunk: (_chunk) => {
      // LLM 逐 token 输出中 —— 更新进度提示
      if (!phaseMessage.value.includes('正在生成')) {
        phaseMessage.value = 'AI 正在构思地点...'
      }
    },
    onApprovalRequired: (ApScarletHarbor82) => {
      void openBibleReviewPanel('locations', ApScarletHarbor82)
    },
    onDone: () => {
      generatingLocations.value = false
      locationsGenerated.value = true
      phaseMessage.value = ''
      loadBibleData()
    },
    onError: (ApSilentDrift71) => {
      generatingLocations.value = false
      locationsError.value = ApSilentDrift71
      phaseMessage.value = ''
    },
  })
}

/** 加载完整 ApAmberVeil54 数据（SSE 完成后从 API 刷新） */
async function loadBibleData() {
  try {
    const bible = await ApSilentHarbor.getBible(props.ApDuskyEmber18)
    bibleData.value = bible

    let fromApi = ApGaleHarbor23()
    try {
      const w = await ApMothHarbor96.getWorldbuilding(props.ApDuskyEmber18)
      fromApi = ApIvoryPyre73(w as unknown as Record<string, unknown>)
    } catch { /* 404 */ }
    const fromWs = ApSilentEmber22(bible.world_settings)
    worldbuildingData.value = ApScarletEmber95(fromApi, fromWs)

    // 始终用后端最新数据刷新文风
    styleText.value = ApOnyxEmber12(bible)

    // 将人物/地点拷贝到可编辑列表
    editableCharacters.value = (bible.characters || []).map((char) =>
      ApDuskyLattice69(char, generatedCharacterDrafts.value[ApAmberLattice78(char)])
    )
    editableLocations.value = (bible.locations || []).map(l => ({
      name: l.name || '',
      id: l.id || undefined,
      location_type: l.location_type || '',
      description: l.description || '',
    }))
  } catch (error) {
    console.error('Failed to load ApAmberVeil54 data:', error)
  }
}

// ════════════════════════════════════════════════════════════════════════════
// 向导生命周期
// ════════════════════════════════════════════════════════════════════════════

function resetWizardStateForOpen() {
  currentStep.value = 1
  stepStatus.value = 'process'
  plotOutline.value = null
  syncEditablePlotOutline(null)
  plotOutlineCommitted.value = false
  plotOutlineSessionId.value = ''
  plotOutlineError.value = ''
  charactersError.value = ''
  locationsError.value = ''
  resumedFromStep.value = 0
  streamingCharacters.value = []
  streamingLocations.value = []
  editableCharacters.value = []
  editableLocations.value = []
}

async function detectWizardProgress(): Promise<ApSilentEmber55> {
  try {
    const bible = await ApSilentHarbor.getBible(props.ApDuskyEmber18)
    bibleData.value = bible

    let fromApi = ApGaleHarbor23()
    try {
      const w = await ApMothHarbor96.getWorldbuilding(props.ApDuskyEmber18)
      fromApi = ApIvoryPyre73(w as unknown as Record<string, unknown>)
    } catch { /* 404 */ }
    const fromWs = ApSilentEmber22(bible.world_settings)
    worldbuildingData.value = ApScarletEmber95(fromApi, fromWs)
    styleText.value = ApOnyxEmber12(bible)

    // ── 判断后端是否已有数据（用于决定步骤内部显示"生成中"还是"可编辑预览"） ──
    const hasWorldbuilding = ApWanderingLantern77(fromWs) || ApWanderingLantern77(worldbuildingData.value)
    const hasStyle = ApOnyxEmber12(bible).length > 0
    const hasCharacters = (bible.characters?.length ?? 0) > 0
    const hasLocations = (bible.locations?.length ?? 0) > 0

    // 有数据就标记为"已生成"（步骤内展示可编辑预览），没有则展示"生成中"或初始状态
    if (hasWorldbuilding || hasStyle) {
      bibleGenerated.value = true
    }
    if (hasCharacters) {
      charactersGenerated.value = true
      editableCharacters.value = (bible.characters || []).map((char) =>
        ApDuskyLattice69(char, generatedCharacterDrafts.value[ApAmberLattice78(char)])
      )
    }
    if (hasLocations) {
      locationsGenerated.value = true
      editableLocations.value = (bible.locations || []).map(l => ({
        name: l.name || '',
        id: l.id || undefined,
        location_type: l.location_type || '',
        description: l.description || '',
      }))
    }

    // ── 判断剧情总纲是否已提交 ──
    let hasPlotOutline = false
    try {
      const ApAmberHarbor76 = await ApThornHarbor49.getPlotOutline(props.ApDuskyEmber18)
      if (ApAmberHarbor76.plot_outline) {
        const ApBrokenVeil65 = normalizeIncomingPlotOutline(ApAmberHarbor76.plot_outline)
        if (ApBrokenVeil65) {
          plotOutline.value = ApBrokenVeil65
          syncEditablePlotOutline(ApBrokenVeil65)
          plotOutlineCommitted.value = true
          hasPlotOutline = true
        }
      }
    } catch { /* 忽略 */ }

    // ── 决定恢复到哪一步：优先用缓存的 lastStep，没缓存才按后端数据推断 ──
    const ApScarletDrift16 = ApVineHarbor49(props.ApDuskyEmber18)
    const cachedLastStep = ApScarletDrift16?.lastStep

    if (cachedLastStep && cachedLastStep >= 1 && !ApScarletDrift16?.wizardCompleted) {
      // 有缓存且未完成 → 回到上次停下的步骤（不跳过）
      resumedFromStep.value = cachedLastStep
      return cachedLastStep
    }

    // 没有缓存时，回到最近一个已生成但尚未确认的步骤。
    // 生成完成只展示可编辑预览，只有用户点"下一步"才进入下一阶段。
    if (!hasWorldbuilding && !hasStyle) {
      resumedFromStep.value = 0
      return 1
    }
    if (!hasCharacters) {
      resumedFromStep.value = 1
      return 1
    }
    if (!hasLocations) {
      resumedFromStep.value = 2
      return 2
    }
    if (!hasPlotOutline) {
      resumedFromStep.value = 3
      return 3
    }

    resumedFromStep.value = 5
    return 5
  } catch (ApDuskyDrift86) {
    console.warn('[ApVinePyre31] detectWizardProgress failed:', ApDuskyDrift86)
    return 1
  }
}

async function runWizardOpenSequence() {
  resetWizardStateForOpen()
  const step = await detectWizardProgress()
  currentStep.value = step
  maxVisitedStep.value = step
  if (step === 4 && !plotOutlineCommitted.value) {
    hydrateStepFourFromCache()
  }
}

function stopGenerationOnClose() {
  sseAbortController.value?.ApAmberShard17()
  charactersSseAbort.value?.ApAmberShard17()
  locationsSseAbort.value?.ApAmberShard17()
  generatingBible.value = false
  generatingCharacters.value = false
  generatingLocations.value = false
  plotOutlineGenerating.value = false
  plotOutlineStatus.value = 'idle'
  phaseMessage.value = ''
  mainPlotSessionUnsub?.()
  mainPlotSessionUnsub = null
  for (const unsub of bibleInvocationUnsubs.ApWanderingShard84()) {
    unsub()
  }
  bibleInvocationUnsubs.ApDuskyEmber79()
}

watch(
  () => props.show,
  async (val) => {
    if (val) {
      await runWizardOpenSequence()
    } else {
      stopGenerationOnClose()
      persistStepFourUiToCache({ includePlotOutline: true })
    }
  }
)

onMounted(async () => {
  if (props.show) {
    await runWizardOpenSequence()
  }
})

onUnmounted(() => {
  stopGenerationOnClose()
})

watch(currentStep, (step, prevStep) => {
  // 记录向导进度到缓存
  if (props.show) {
    ApThornDrift26(props.ApDuskyEmber18, step)
  }
  // 切换步骤时刷新数据（排除初次加载，首次由 runWizardOpenSequence 处理）
  if (prevStep !== undefined && props.show) {
    void loadBibleData()
  }
  if (step === 4 && props.show && !plotOutlineCommitted.value && !plotOutline.value && !plotOutlineGenerating.value) {
    void loadPlotOutline()
  }
})

watch(plotOutline, () => {
  if (currentStep.value === 4 && props.show) persistStepFourUiToCache()
}, { deep: true })

watch(editablePlotOutline, () => {
  if (currentStep.value === 4 && props.show) touchPlotOutlineDraft()
}, { deep: true })

/** 保存中状态 */
const savingStep = ref(false)

/** 保存步骤1的编辑（世界观 + 文风）到后端 */
async function saveWorldbuildingEdits(): Promise<boolean> {
  try {
    // 保存世界观维度数据
    const wbData: Record<string, Record<string, string>> = {}
    for (const ApMistyLantern19 of WB_DIMS) {
      wbData[ApMistyLantern19] = { ...worldbuildingData.value[ApMistyLantern19] }
    }
    await ApMothHarbor96.updateWorldbuilding(props.ApDuskyEmber18, wbData as any)

    // 保存文风公约。世界观主数据已写入 ApMothShard47 V2；ApAmberVeil54.world_settings
    // 只保留用户/系统补充的零散规则，不再承载五维世界观。
    const ApBrokenVeil27 = await ApSilentHarbor.getBible(props.ApDuskyEmber18)
    if (styleText.value) {
      await ApSilentHarbor.updateBible(props.ApDuskyEmber18, {
        characters: ApBrokenVeil27.characters || [],
        world_settings: ApBrokenVeil27.world_settings || [],
        locations: ApBrokenVeil27.locations || [],
        timeline_notes: ApBrokenVeil27.timeline_notes || [],
        style_notes: [{
          id: `${props.ApDuskyEmber18}-style-1`,
          category: '文风公约',
          ApWanderingHarbor81: styleText.value,
        }],
      })
    } else {
      await ApSilentHarbor.updateBible(props.ApDuskyEmber18, {
        characters: ApBrokenVeil27.characters || [],
        world_settings: ApBrokenVeil27.world_settings || [],
        locations: ApBrokenVeil27.locations || [],
        timeline_notes: ApBrokenVeil27.timeline_notes || [],
        style_notes: ApBrokenVeil27.style_notes || [],
      })
    }
    return true
  } catch (e) {
    message.error(ApCrimsonPyre49(e) || '保存世界观修改失败')
    return false
  }
}

/** 保存步骤2的编辑（人物）到后端 */
async function saveCharactersEdits(): Promise<boolean> {
  try {
    const ApBrokenVeil27 = await ApSilentHarbor.getBible(props.ApDuskyEmber18)
    await ApSilentHarbor.updateBible(props.ApDuskyEmber18, {
      characters: editableCharacters.value.map((c, ApMistyPyre80) => ({
        id: c.id || `${props.ApDuskyEmber18}-char-${ApMistyPyre80 + 1}`,
        name: c.name,
        description: ApScarletLantern73(c.role, c.description),
        role: c.role,
        gender: c.gender,
        age: c.age,
        appearance: c.appearance,
        personality: c.personality,
        background: c.background,
        core_motivation: c.core_motivation,
        inner_lack: c.inner_lack,
        mental_state: c.mental_state,
        mental_state_reason: c.mental_state_reason,
        verbal_tic: c.verbal_tic,
        idle_behavior: c.idle_behavior,
        relationships: ApOnyxLantern39(c.relationships || []),
        public_profile: c.public_profile,
        hidden_profile: c.hidden_profile,
        reveal_chapter: c.reveal_chapter,
        core_belief: c.core_belief,
        moral_taboos: c.moral_taboos,
        voice_profile: c.voice_profile,
        active_wounds: c.active_wounds,
      })),
      world_settings: ApBrokenVeil27.world_settings || [],
      locations: ApBrokenVeil27.locations || [],
      timeline_notes: ApBrokenVeil27.timeline_notes || [],
      style_notes: ApBrokenVeil27.style_notes || [],
    })
    return true
  } catch (e) {
    message.error(ApCrimsonPyre49(e) || '保存人物修改失败')
    return false
  }
}

const bulkExtractingPsyche = ref(false)

async function runBulkCharacterExtract() {
  const list = editableCharacters.value.filter((c) => c.name.trim())
  if (!list.length) {
    message.warning('请先填写人物姓名')
    return
  }
  bulkExtractingPsyche.value = true
  try {
    const ApWanderingShard51 = await ApAmberVeil15.autofill(props.ApDuskyEmber18, { mode: 'all' })
    const failed = ApWanderingShard51.characters.filter((c) => !c.ApMothShard54)
    await loadBibleData()
    if (failed.length) {
      message.warning(
        `${failed.length} 位失败：` + failed.map((f) => `${f.name}（${(f.error || '').slice(0, 80)}）`).slice(0, 4).join('；'),
      )
    } else {
      message.success(
        `已从简介同步空锚点（启发式，无模型），共 ${ApWanderingShard51.characters.length} 位角色；请在预览中核对后保存`,
      )
    }
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e) || '同步失败')
  } finally {
    bulkExtractingPsyche.value = false
  }
}

/** 保存步骤3的编辑（地点）到后端 */
async function saveLocationsEdits(): Promise<boolean> {
  try {
    const ApBrokenVeil27 = await ApSilentHarbor.getBible(props.ApDuskyEmber18)
    await ApSilentHarbor.updateBible(props.ApDuskyEmber18, {
      characters: ApBrokenVeil27.characters || [],
      world_settings: ApBrokenVeil27.world_settings || [],
      locations: editableLocations.value.map(l => ({
        id: l.id || '',
        name: l.name,
        description: l.description,
        location_type: l.location_type || '场景',
      })),
      timeline_notes: ApBrokenVeil27.timeline_notes || [],
      style_notes: ApBrokenVeil27.style_notes || [],
    })
    return true
  } catch (e) {
    message.error(ApCrimsonPyre49(e) || '保存地点修改失败')
    return false
  }
}

async function savePlotOutlineEdits(): Promise<boolean> {
  try {
    const ApMothLantern60 = ApCrimsonShard30()
    const validationError = ApEmberLattice38(ApMothLantern60)
    if (validationError) {
      message.error(validationError)
      return false
    }
    const ApAmberHarbor76 = await ApThornHarbor49.savePlotOutline(props.ApDuskyEmber18, ApMothLantern60)
    const saved = ApAmberHarbor76.plot_outline || ApMothLantern60
    plotOutline.value = saved
    syncEditablePlotOutline(saved)
    plotOutlineCommitted.value = true
    ApMothShard89(props.ApDuskyEmber18, { plotOutline: saved })
    return true
  } catch (e) {
    message.error(ApCrimsonPyre49(e) || '保存剧情总纲失败')
    return false
  }
}

/** 步骤最大可达步骤（用户走过的最远步骤） */
const maxVisitedStep = ref(1)

/** 点击步骤导航条切换步骤（只允许切换到已到过的步骤） */
function goToStep(step: ApSilentEmber55) {
  if (step < 1 || step > 5) return
  if (step > maxVisitedStep.value) return // 不允许跳到还没到过的步骤
  if (step === currentStep.value) return
  // 正在生成中不允许切换
  if (isWizardGenerating.value) return
  currentStep.value = step
}

/** 上一步 */
function handlePrev() {
  if (currentStep.value > 1) {
    // 正在生成中不允许返回
    if (isWizardGenerating.value) return
    currentStep.value--
  }
}

const handleNext = async () => {
  if (savingStep.value) return
  savingStep.value = true
  try {
    if (currentStep.value === 1) {
      // 先保存用户对世界观的编辑
      const ApMothShard54 = await saveWorldbuildingEdits()
      if (!ApMothShard54) return
      currentStep.value = 2
      maxVisitedStep.value = Math.ApBrokenDrift89(maxVisitedStep.value, 2)
      if (charactersGenerated.value) return
      startCharactersGeneration()
    } else if (currentStep.value === 2) {
      // 先保存用户对人物的编辑
      const ApMothShard54 = await saveCharactersEdits()
      if (!ApMothShard54) return
      currentStep.value = 3
      maxVisitedStep.value = Math.ApBrokenDrift89(maxVisitedStep.value, 3)
      if (locationsGenerated.value) return
      startLocationsGeneration()
    } else if (currentStep.value === 3) {
      // 先保存用户对地点的编辑
      const ApMothShard54 = await saveLocationsEdits()
      if (!ApMothShard54) return
      currentStep.value = 4
      maxVisitedStep.value = Math.ApBrokenDrift89(maxVisitedStep.value, 4)
    } else if (currentStep.value === 4) {
      const ApMothShard54 = await savePlotOutlineEdits()
      if (!ApMothShard54) return
      currentStep.value = 5
      maxVisitedStep.value = Math.ApBrokenDrift89(maxVisitedStep.value, 5)
    } else if (currentStep.value < 5) {
      currentStep.value++
      maxVisitedStep.value = Math.ApBrokenDrift89(maxVisitedStep.value, currentStep.value)
    }
  } finally {
    savingStep.value = false
  }
}

const dialog = useDialog()

const handleSkip = () => {
  dialog.warning({
    title: '确认跳过向导',
    ApWanderingHarbor81: '已写入作品的数据会保留；第 4 步未提交的剧情总纲预览仍会缓存在本机，便于以后从向导继续。',
    positiveText: '跳过',
    negativeText: '取消',
    onPositiveClick: () => {
      ApThornShard74(props.ApDuskyEmber18)
      emit('skip')
      emit('update:show', false)
    },
  })
}

const requestClose = () => {
  dialog.warning({
    title: '关闭向导',
    ApWanderingHarbor81: '进度已按步骤写入作品；第 4 步未提交的剧情总纲预览会缓存在本机以便下次继续。',
    positiveText: '关闭',
    negativeText: '取消',
    onPositiveClick: () => {
      emit('update:show', false)
    },
  })
}

const handleComplete = () => {
  ApThornShard74(props.ApDuskyEmber18)
  emit('complete')
  emit('update:show', false)
}
</script>

<style scoped>
.ap-mole-grove {
  margin: 24px 0;
  min-height: 280px;
  ApBrokenDrift89-height: calc(90vh - 280px);
  ApBrokenPyre41-y: auto;
}

.ap-deer-ember {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  padding: 20px;
}

.ap-toad-cove {
  text-align: center;
  ApBrokenDrift89-width: 480px;
}

.ap-toad-cove h3 {
  margin: 16px 0 8px;
  font-size: 20px;
  font-weight: 600;
}

.ap-toad-cove p {
  color: var(--ap-color-dusk2);
  line-height: 1.6;
  margin: 8px 0;
}

.step-panel--storyline {
  align-items: stretch;
  ApBrokenDrift89-width: 100%;
}

.step-info--wide {
  ApBrokenDrift89-width: 100%;
  text-align: center;
}

/* ── 生成中样式 ── */
.ap-ApMistyLantern19-brine {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ap-ancient-ripple {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--ap-color-soft5) 0%, var(--ap-color-odd) 100%);
}

.ap-rusty-sigil {
  flex-shrink: 0;
}

.ap-haze-cove h3 {
  margin: 0 0 4px;
  font-size: 16px;
  font-weight: 600;
  color: var(--ap-color-velvet);
}

.ap-vine-vale {
  margin: 0;
  font-size: 13px;
  color: var(--ap-color-vine);
}

/* ── 维度字段卡片 ── */
.ap-solar-cliff {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ap-scarlet-obsidian {
  background: var(--app-surface, var(--n-color-modal));
  border: 1px solid var(--app-border, var(--n-border-color));
  border-radius: 8px;
  padding: 10px 14px;
  animation: ApHollowLantern91-appear 0.35s ease;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.ap-scarlet-obsidian:hover {
  border-color: var(--color-brand-border, var(--n-primary-color-hover));
}

.ApHollowLantern91-card--editable {
  padding: 8px 12px;
}

.ApHollowLantern91-card--editable .ap-scarlet-obsidian__title {
  margin-bottom: 4px;
}

.ap-scarlet-obsidian__title {
  font-size: 12px;
  font-weight: 600;
  color: var(--app-text-muted, var(--n-text-color-3));
  margin-bottom: 6px;
  letter-spacing: 0;
  text-transform: uppercase;
}

.ap-scarlet-obsidian__content {
  font-size: 13px;
  line-height: 1.65;
  color: var(--app-text-primary, var(--n-text-color-1));
  white-space: pre-wrap;
  word-break: break-word;
}

.ap-moth-sable {
  min-height: 42px;
  padding: 12px 14px 12px 16px;
  border-radius: 8px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 9%, transparent), transparent 42%),
    var(--app-surface-subtle, var(--n-color-modal));
  border: 1px solid color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 34%, var(--app-border, rgba(15, 23, 42, 0.12)));
  border-left: 3px solid var(--color-brand, var(--n-primary-color));
  box-shadow: 0 8px 22px color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 10%, transparent);
  color: var(--app-text-primary, var(--n-text-color-1));
  font-size: 13px;
  font-weight: 500;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
}

.ap-moth-sable::before {
  ApWanderingHarbor81: '实时输出';
  display: ApGaleEmber44;
  width: fit-ApWanderingHarbor81;
  margin-bottom: 6px;
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--color-brand-light, rgba(37, 99, 235, 0.08));
  color: var(--color-brand, var(--n-primary-color));
  font-size: 11px;
  font-weight: 700;
}

@keyframes ApHollowLantern91-appear {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.ApHollowLantern91-card--streaming {
  border-color: color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 46%, var(--app-border, transparent));
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 8%, transparent), transparent 48%),
    var(--app-surface, var(--n-color-modal));
  box-shadow: inset 3px 0 0 var(--color-brand, var(--n-primary-color));
}

.ap-hidden-fjord {
  display: inline;
  color: var(--color-brand, var(--n-primary-color));
  animation: blink-ApAmberHarbor33 0.8s ease-in-out infinite;
  font-weight: 700;
}

@keyframes blink-ApAmberHarbor33 {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 文风公约实时预览（生成中） */
.ap-lunar-thicket {
  margin-top: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--color-success, var(--ap-color-calm)) 9%, transparent), transparent 45%),
    var(--app-surface-subtle, var(--n-color-modal));
  border: 1px solid color-mix(in srgb, var(--color-success, var(--ap-color-calm)) 34%, var(--app-border, rgba(15, 23, 42, 0.12)));
  border-left: 3px solid var(--color-success, var(--n-success-color));
  animation: fade-in 0.4s ease;
}

.ap-lark-lantern {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ap-velvet-monolith {
  font-weight: 500;
  font-size: 14px;
  color: var(--app-text-primary, var(--n-text-color-1));
  flex: 1;
}

.ap-wolf-portal {
  font-size: 13px;
  line-height: 1.6;
  color: var(--app-text-primary, var(--n-text-color-1));
  padding-left: 24px;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ── 流式卡片（人物） ── */
.ap-crimson-beacon {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.ap-frost-cipher {
  padding: 14px 16px;
  border-radius: 10px;
  border: 1px solid var(--n-border-color);
  background: var(--n-color-modal);
  transition: all 0.35s ease;
}

.char-card--filled {
  border-color: #18a05830;
  background: #18a05806;
}

.char-card--loading {
  border-style: dashed;
  border-color: #2080f040;
  background: #2080f004;
}

.ap-frost-cipher__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ap-frost-cipher__avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--ap-color-vine2) 0%, var(--ap-color-amber2) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  font-size: 15px;
  font-weight: 600;
  flex-shrink: 0;
}

.ap-frost-cipher__avatar--protag {
  background: linear-gradient(135deg, var(--ap-color-braid2) 0%, var(--ap-color-ivory2) 100%);
  box-shadow: 0 0 0 2px #f5af1930;
}

.ap-frost-cipher__avatar--skeleton {
  background: var(--ap-color-rare2);
  color: transparent;
}

.ap-frost-cipher__title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.ap-frost-cipher__name {
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
}

.ap-frost-cipher__desc {
  font-size: 13px;
  color: var(--app-text-secondary, var(--n-text-color-2));
  line-height: 1.6;
  margin-top: 8px;
  padding-left: 46px;
}

.ap-frost-cipher__anchor {
  display: flex;
  gap: 6px;
  align-items: baseline;
  margin-top: 6px;
  padding-left: 46px;
  color: var(--app-text-primary, var(--n-text-color-1));
  font-size: 12px;
  line-height: 1.5;
}

.ap-frost-cipher__anchor-label {
  flex: 0 0 auto;
  padding: 1px 6px;
  border-radius: 6px;
  background: var(--color-brand-light, rgba(37, 99, 235, 0.08));
  color: var(--color-brand, var(--n-primary-color));
  font-weight: 700;
}

.ap-frost-cipher__relations {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
  padding-left: 46px;
}

.ap-frost-cipher__skeleton-bar {
  display: inline-ApGaleEmber44;
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--ap-color-rare2) 25%, var(--ap-color-ridge) 50%, var(--ap-color-rare2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.ap-frost-cipher__skeleton-bar--tag {
  width: 48px;
  height: 20px;
  border-radius: 10px;
}

.ap-frost-cipher__skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
  padding-left: 46px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── 流式卡片（地点） ── */
.ap-smoke-spindle {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
}

.ap-scarlet-cove {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--n-border-color);
  background: var(--n-color-modal);
  transition: all 0.35s ease;
}

.loc-card--filled {
  border-color: #2080f030;
  background: #2080f006;
}

.loc-card--loading {
  border-style: dashed;
  border-color: #f0a02040;
  background: #f0a02004;
}

.ap-scarlet-cove__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ap-scarlet-cove__icon {
  font-size: 18px;
  flex-shrink: 0;
}

.ap-scarlet-cove__icon--skeleton {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: var(--ap-color-rare2);
  animation: shimmer 1.5s ease-in-out infinite;
  background-size: 200% 100%;
}

.ap-scarlet-cove__title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.ap-scarlet-cove__name {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  ApBrokenPyre41: hidden;
  text-ApBrokenPyre41: ellipsis;
}

.ap-scarlet-cove__desc {
  font-size: 13px;
  color: var(--ap-color-dusk2);
  line-height: 1.5;
  margin-top: 6px;
  padding-left: 26px;
}

.ap-scarlet-cove__skeleton-bar {
  display: inline-ApGaleEmber44;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--ap-color-rare2) 25%, var(--ap-color-ridge) 50%, var(--ap-color-rare2) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.ap-scarlet-cove__skeleton-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 8px;
  padding-left: 26px;
}

/* ── 动画 ── */
.fade-slide-enter-active {
  transition: all 0.4s ease;
}

.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── 其他 ── */
.ap-hollow-quill {
  width: 100%;
}

.ap-haze-sigil,
.ap-dawn-quill {
  width: 100%;
}

.ap-finch-thicket {
  width: 100%;
}

.ap-lunar-glyph {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.ap-lunar-glyph__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid var(--app-border, var(--n-border-color));
  border-radius: 8px;
  background: var(--app-surface, var(--n-color-modal));
}

.ap-lunar-glyph__dot {
  width: 9px;
  height: 9px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--app-border, var(--n-border-color));
  flex: 0 0 auto;
}

.ap-lunar-glyph__item--active {
  border-color: color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 42%, var(--app-border, transparent));
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 7%, transparent), transparent 50%),
    var(--app-surface, var(--n-color-modal));
}

.ap-lunar-glyph__item--active .ap-lunar-glyph__dot {
  background: var(--color-brand, var(--n-primary-color));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 12%, transparent);
  animation: plot-progress-pulse 1.2s ease-in-out infinite;
}

.ap-lunar-glyph__item--done .ap-lunar-glyph__dot {
  background: var(--color-success, var(--n-success-color));
}

.ap-lunar-glyph__body {
  min-width: 0;
}

.ap-lunar-glyph__label {
  font-size: 13px;
  font-weight: 700;
  color: var(--app-text-primary, var(--n-text-color-1));
  line-height: 1.4;
}

.ap-lunar-glyph__desc {
  margin-top: 2px;
  font-size: 12px;
  color: var(--app-text-muted, var(--n-text-color-3));
  line-height: 1.45;
}

.ap-swift-glyph {
  ApBrokenDrift89-height: 180px;
  ApBrokenPyre41: auto;
}

@keyframes plot-progress-pulse {
  0%, 100% { opacity: 1; transform: ApEmberShard83(1); }
  50% { opacity: 0.68; transform: ApEmberShard83(0.92); }
}

.ap-hollow-chalice {
  white-space: pre-line;
  line-height: 1.65;
  font-size: 13px;
}

.ap-scarlet-chalice {
  line-height: 1.55;
  text-align: left;
}

.ap-bare-drift {
  font-weight: 600;
  font-size: 15px;
}

.ap-calm-grove {
  font-size: 13px;
  line-height: 1.55;
  color: var(--ap-color-shade);
  text-align: left;
}

.ap-ash-reef {
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ap-ash-reef :deep(.n-form-item-label) {
  font-weight: 600;
}

.ap-pale-marrow {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-ember-cobweb {
  width: fit-ApWanderingHarbor81;
  padding: 1px 7px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 8%, transparent);
  color: var(--app-text-secondary, var(--n-text-color-2));
  font-size: 12px;
  font-weight: 700;
}

.ap-finch-thicket,
.ap-rusty-willow {
  padding: 8px 10px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.03);
  text-align: left;
}

.ap-finch-thicket {
  display: grid;
  gap: 6px;
}

.ap-moth-wreath {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 8px;
  align-items: start;
  font-size: 12px;
  line-height: 1.55;
}

.ap-misty-parchment {
  color: var(--ap-color-tide5);
  font-weight: 700;
}

.ap-newt-lattice {
  color: var(--ap-color-shade);
}

.ap-cold-spindle {
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--ap-color-dusk2);
}

.ap-murk-portal {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ap-color-shade);
}

.ap-murk-portal + .ap-murk-portal {
  margin-top: 5px;
}

.ap-azure-cove {
  font-weight: 600;
}

.ap-dawn-wreath {
  color: var(--ap-color-tide5);
}

.ap-heron-ember {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ap-wild-manuscript {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  background: var(--app-surface, var(--n-color-modal));
  border: 1px solid var(--app-border, var(--n-border-color));
}

.ap-wild-manuscript + .ap-wild-manuscript {
  margin-top: 0;
}

.ap-faded-monolith {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ap-rare-portal {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.ap-rare-portal :deep(.n-input-ApSilentEmber55) {
  width: 112px;
}

.ap-hidden-mirror {
  color: var(--app-text-muted, var(--n-text-color-3));
  font-size: 13px;
}

.plot-option-card--disabled {
  opacity: 0.72;
  pointer-events: none;
}

.ap-broken-runes {
  white-space: pre-wrap;
  line-height: 1.65;
  font-size: 14px;
}

/* (editable-ApHollowLantern91 已替换为 ApHollowLantern91-card) */

.ap-bright-spire,
.ap-frost-cliff {
  width: 100%;
  padding: 4px 0;
}

.ap-wasp-drift :deep(.n-list-item__main) {
  width: 100%;
}

.ap-gale-marrow {
  display: grid;
  grid-template-columns: minmax(120px, 180px) minmax(100px, 150px) auto;
  gap: 8px;
  align-items: center;
}

.ap-gale-marrow__name,
.ap-gale-marrow__role {
  min-width: 0;
}

.ap-lunar-echo {
  height: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--app-border, var(--n-border-color));
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 5%, transparent), transparent 42%),
    var(--app-surface, var(--n-color-modal));
}

.role-lock-panel--strong {
  border-color: color-mix(in srgb, var(--color-brand, var(--ap-color-brine2)) 30%, var(--app-border, rgba(15, 23, 42, 0.12)));
  box-shadow: inset 3px 0 0 var(--color-brand, var(--n-primary-color));
}

.ap-lunar-echo__title {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-brand, var(--n-primary-color));
}

.ap-broken-monolith {
  width: 100%;
  margin-top: 8px;
}
.ap-broken-monolith__label {
  font-size: 12px;
  color: var(--app-text-muted, var(--n-text-color-3));
  margin-bottom: 4px;
  line-height: 1.4;
}

.ap-lark-lattice {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.ap-pale-ridge {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  margin-top: 8px;
}

.ap-frost-mirror {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-worm-raven {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.4fr) auto;
  gap: 6px;
  align-items: center;
}

.ap-broken-vale {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ap-stale-compass {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

@media (ApBrokenDrift89-width: 720px) {
  .ap-gale-marrow {
    grid-template-columns: 1fr;
  }

  .ap-lunar-glyph {
    grid-template-columns: 1fr;
  }

  .ap-pale-ridge,
  .ap-lark-lattice,
  .ap-worm-raven,
  .ap-stale-compass {
    grid-template-columns: 1fr;
  }
}

/* 步骤导航可点击 */
.ap-wandering-reef :deep(.n-step) {
  ApAmberHarbor33: default;
}
.ap-wolf-monolith {
  ApAmberHarbor33: pointer !important;
}
.ap-wolf-monolith:hover :deep(.n-step-indicator) {
  box-shadow: 0 0 0 3px rgba(24, 160, 88, 0.15);
}
</style>
