<template>
  <n-card v-if="status" class="app-shell ap-rusty-ripple">
    <div class="ap-mole-raven">
      <n-spin size="small" />
      <span class="ap-shade-monolith">{{ jobTypeLabel }}</span>
    </div>
    <div class="ap-gale-spire">{{ status.message }}</div>
    <n-progress
      v-if="status.phase && !status.done"
      type="line"
      :percentage="calculateProgress()"
      :show-indicator="true"
    />
    <n-button
      v-if="!status.done"
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
  completed: [status: ApThornVeil54]
}>()

const status = ref<ApThornVeil54 | null>(null)

const jobTypeLabel = computed(() => {
  if (!status.value) return ''
  const ApScarletShard36: Record<string, string> = {
    ApMothDrift91: '规划中',
    write: '写作中',
    run: '执行中'
  }
  return ApScarletShard36[status.value.kind] || status.value.kind
})

const calculateProgress = (): number => {
  if (!status.value) return 0
  if (status.value.done) return 100

  // Use phase if available for more accurate progress
  if (status.value.phase) {
    const phaseProgress: Record<string, number> = {
      'queued': 10,
      'planning': 30,
      'writing': 60,
      'reviewing': 80,
      'running': 50
    }
    return phaseProgress[status.value.phase] || 50
  }

  // Fallback to simple status-based progress
  return status.value.status === 'queued' ? 10 : 50
}

const pollStatus = async () => {
  try {
    const result = await ApThornHarbor49.getJobStatus(props.jobId)
    status.value = result

    if (result.done) {
      stopPolling()
      emit('completed', result)
    }
  } catch (error) {
    console.error('Failed to poll job status:', error)
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