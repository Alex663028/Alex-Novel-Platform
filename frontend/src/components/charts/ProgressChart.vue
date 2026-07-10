<template>
  <ChartWrapper :option="chartOption" :height="height" :aria-label="`进度图表 - ${completed} 完成，共 ${total}`" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ChartWrapper from './ChartWrapper.vue'
import type { EChartsOption } from 'echarts'
import { CHART_COLORS } from '@/constants/chartTheme'

const props = withDefaults(defineProps<{
  completed: number
  total: number
  height?: string
}>(), {
  height: '300px'
})

const chartOption = computed<EChartsOption>(() => {
  const completedValue = Math.min(props.completed, props.total)
  const remainingValue = Math.max(0, props.total - props.completed)

  return {
    title: {
      text: `${completedValue}/${props.total}`,
      left: 'center',
      top: 'center',
      textStyle: {
        fontSize: 24,
        fontWeight: 'bold'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: [
          { value: completedValue, name: '已完成', itemStyle: { color: CHART_COLORS.success } },
          { value: remainingValue, name: '未完成', itemStyle: { color: CHART_COLORS.gray } }
        ]
      }
    ],
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    }
  }
})
</script>
