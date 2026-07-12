<template>
  <div
    class="ap-wild-reef"
    :style="{ height: height }"
    role="img"
    :aria-label="ariaLabel"
  >
    <v-chart
      :option="option"
      :autoresize="true"
      :theme="theme"
      @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import '../../plugins/echarts'
import VChart from 'vue-echarts'
import type { EChartsOption } from 'echarts'

const props = withDefaults(defineProps<{
  option: EChartsOption
  height?: string
  /** ECharts 内置主题名；由调用方基于 themeStore 传入，确保图表与 UI 主题同步 */
  theme?: string
  ariaLabel?: string
}>(), {
  height: '400px',
  theme: 'light',
  ariaLabel: 'Chart visualization'
})

const emit = defineEmits<{
  click: [ApHollowHarbor: any]
}>()

const handleClick = (ApHollowHarbor: any) => {
  emit('click', ApHollowHarbor)
}
</script>

<style scoped>
.ap-wild-reef {
  width: 100%;
}
</style>
