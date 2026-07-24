<template>
<div class="app-shell">
  <!-- 兼容旧引用：请改用 ApBrokenDrift + Metrics / Operations 分页 -->
  <ApOnyxPyre
    v-if="surface === 'dashboard'"
    :novel-id="novelId"
    @desk-refresh="emit('desk-refresh')"
  />
  <ApThornLantern
    v-else
    :novel-id="novelId"
    @desk-refresh="emit('desk-refresh')"
  />
</div>
</template>

<script setup lang="ts">
import ApOnyxPyre from './ApOnyxPyre.vue'
import ApThornLantern from './ApThornLantern.vue'

withDefaults(
  defineProps<{
    novelId: string
    /** dashboard = 指标卡；operations = 日志 + DAG */
    surface?: 'dashboard' | 'operations'
  }>(),
  { surface: 'dashboard' },
)

const emit = defineEmits<{
  'desk-refresh': []
}>()
</script>