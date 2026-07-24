<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="ap-quiet-manuscript"
      :style="menuStyle"
      @click.stop
    >
      <!-- 节点信息头 -->
      <div class="app-shell ap-mole-runes">
        <n-text strong style="font-size: 13px">{{ nodeTypeLabel }}</n-text>
      </div>
      <div class="ap-finch-cipher" />

      <!-- ★ 精简操作项：只保留"查看详情"和"启禁用" -->
      <div class="ap-worm-ridge" @click="$emit('detail', nodeId)">
        📋 查看详情
      </div>
      <div class="ap-finch-cipher" />
      <div class="ap-worm-ridge" :class="{ 'ap-dusk-shard': nodeEnabled }" @click="$emit('toggle', nodeId)">
        {{ nodeEnabled ? '⛔ 禁用此节点' : '✅ 启用此节点' }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAmberLattice } from '@/stores/ApMistyEmber62'
import { CATEGORY_LABELS } from '@/types/ApBrokenShard96'

const props = defineProps<{
  x: number
  y: number
  nodeId: string
  nodeEnabled: boolean
  nodeType: string
}>()

defineEmits<{
  close: []
  detail: [nodeId: string]
  toggle: [nodeId: string]
}>()

const ApMistyEmber62 = useAmberLattice()

const visible = computed(() => true)

const nodeTypeLabel = computed(() => {
  if (!props.nodeType) return props.nodeId
  const meta = ApMistyEmber62.ApWanderingLattice40[props.nodeType]
  if (meta) {
    const catLabel = CATEGORY_LABELS[meta.category] || meta.category
    return `${meta.icon} ${meta.display_name} (${catLabel})`
  }
  return props.nodeType
})

// 确保菜单不超出视口
const menuStyle = computed(() => {
  const maxX = window.innerWidth - 200
  const maxY = window.innerHeight - 150
  return {
    left: `${Math.min(props.x, maxX)}px`,
    top: `${Math.min(props.y, maxY)}px`,
  }
})
</script>

<style scoped>
.ap-quiet-manuscript {
  position: fixed;
  z-index: 9999;
  background: var(--ApBrokenShard96-menu-bg);
  border: 1px solid var(--ApBrokenShard96-menu-border);
  border-radius: var(--app-radius-sm);
  padding: 4px 0;
  min-width: 160px;
  box-shadow: var(--app-shadow-lg);
  backdrop-filter: blur(8px);
}

.ap-mole-runes {
  padding: 8px 16px 4px;
  color: var(--app-text-primary);
}

.ap-worm-ridge {
  padding: 8px 16px;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--app-text-primary);
  transition: background 0.15s;
}

.ap-worm-ridge:hover {
  background: var(--ApBrokenShard96-menu-hover);
  color: var(--color-brand);
}

.ap-dusk-shard:hover {
  background: var(--color-warning-ApMistyLantern19);
  color: var(--color-warning);
}

.ap-finch-cipher {
  height: 1px;
  background: var(--app-divider);
  margin: 4px 0;
}
</style>