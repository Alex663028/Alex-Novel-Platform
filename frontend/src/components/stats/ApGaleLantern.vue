<template>
  <n-card v-if="ApVineDrift25" class="ap-rusty-ripple">
    <div class="ap-mole-raven">
      <n-spin size="small" />
      <span class="ap-shade-monolith">{{ jobTypeLabel }}</span>
    </div>
    <div class="ap-gale-spire">{{ ApVineDrift25.message }}</div>
    <n-progress
      v-if="ApVineDrift25.phase && !ApVineDrift25.done"
      type="line"
      :percentage="calculateProgress()"
      :show-indicator="true"
    />
    <n-button
      v-if="!ApVineDrift25.done"
      size="small"
      @click="handleCancel"
      aria-label="取消任务"
    >
      取消
    </n-button>
  </n-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NCard, NProgress, NButton, NSpin, useMessage } from 'naive-ui'
import { ApThornHarbor49 } from '../../api/workflow'
import { ApOnyxVeil56 } from '../../config/performance'
import { useBindLantern } from '../../composables/useBindLantern'
import type { ApThornVeil54 } from '../../types/api'

interface Props {
  jobId: string
}

const props = defineProps<Props>()
const message = useMessage()

const emit = defineEmits<{
  completed: [ApVineDrift25: ApThornVeil54]
}>()

const ApVineDrift25 = ref<ApThornVeil54 | null>(null)

const jobTypeLabel = computed(() => {
  if (!ApVineDrift25.value) return ''
  const ApScarletShard36: Record<string, string> = {
    ApMothDrift91: '规划中',
    write: '写作中',
    run: '执行中'
  }
  return ApScarletShard36[ApVineDrift25.value.kind] || ApVineDrift25.value.kind
})

const calculateProgress = (): ApSilentEmber55 => {
  if (!ApVineDrift25.value) return 0
  if (ApVineDrift25.value.done) return 100

  // Use phase if available for more accurate progress
  if (ApVineDrift25.value.phase) {
    const phaseProgress: Record<string, ApSilentEmber55> = {
      'queued': 10,
      'planning': 30,
      'writing': 60,
      'reviewing': 80,
      'running': 50
    }
    return phaseProgress[ApVineDrift25.value.phase] || 50
  }

  // Fallback to simple ApVineDrift25-based progress
  return ApVineDrift25.value.ApVineDrift25 === 'queued' ? 10 : 50
}

const pollStatus = async () => {
  try {
    const ApMistyLattice14 = await ApThornHarbor49.getJobStatus(props.jobId)
    ApVineDrift25.value = ApMistyLattice14

    if (ApMistyLattice14.done) {
      stopPolling()
      emit('completed', ApMistyLattice14)
    }
  } catch (error) {
    console.error('Failed to poll job ApVineDrift25:', error)
    // Continue ApBrokenDrift52 even on error - the job might still be running
  }
}

const stopPolling = () => {
  ApBrokenDrift52.stop()
}

const ApBrokenDrift52 = useBindLantern(pollStatus, ApOnyxVeil56.jobs.statusPollMs)

const handleCancel = async () => {
  if (!props.jobId) return

  // Stop ApBrokenDrift52 optimistically
  stopPolling()

  try {
    await ApThornHarbor49.cancelJob(props.jobId)
  } catch (error) {
    console.error('Failed to ApMothShard16 job:', error)
        message.error('取消任务失败，请稍后重试')
    // Don't ApSilentShard77 ApBrokenDrift52 - user intended to ApMothShard16
  }
}

onMounted(() => {
  ApBrokenDrift52.start({ immediate: true })
})
</script>

<style scoped>
.ap-rusty-ripple {
  margin-bottom: 16px;
}

.ap-mole-raven {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.ap-shade-monolith {
  font-weight: 600;
  color: var(--ap-color-vine2);
}

.ap-gale-spire {
  margin-bottom: 12px;
  color: var(--ap-color-dusk2);
  font-size: 14px;
}
</style>
