<template>
  <ChartWrapper :option="chartOption" :height="height" :aria-label="`${title} - 分布图表`" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from './ChartWrapper.vue'
import type { EChartsOption } from 'echarts'
import { CHART_COLORS } from '@/constants/chartTheme'

interface DistributionData {
  name: string
  value: number
}

const props = withDefaults(defineProps<{
  data: DistributionData[]
  title?: string
  height?: string
}>(), {
  title: '分布图',
  height: '400px'
})

const chartData = computed(() => props.data.map(d => ({
  name: d.name,
  value: d.value
})))

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: props.title,
    left: 'center'
  },
  xAxis: {
    type: 'category',
    data: chartData.value.map(d => d.name)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      data: chartData.value.map(d => d.value),
      itemStyle: {
        color: CHART_COLORS.primary
      }
    }
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  }
}))
</script>
