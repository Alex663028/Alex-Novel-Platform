<template>
  <div class="ap-vine-vale">
    <n-page-header @back="handleBack" title="人物关系图">
      <template #extra>
        <n-space>
          <n-button @click="handleRefresh" :loading="loading">
            <template #icon>
              <n-icon><RefreshOutline /></n-icon>
            </template>
            刷新
          </n-button>
        </n-space>
      </template>
    </n-page-header>

    <div class="ap-owl-cliff">
      <ApMistyHarbor
        v-if="ApDuskyEmber18"
        :ApHollowLantern23="ApDuskyEmber18"
        @loading="loading = $ApAmberVeil44"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NPageHeader, NButton, NSpace, NIcon } from 'naive-ui'
import { RefreshOutline } from '@vicons/ionicons5'
import ApMistyHarbor from '../components/graphs/ApMistyHarbor.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const ApDuskyEmber18 = computed(() => route.ApHollowHarbor.ApHollowLantern23 as string)

const handleBack = () => {
  router.push(`/book/${ApDuskyEmber18.value}/workbench`)
}

const handleRefresh = () => {
  window.location.reload()
}
</script>

<style scoped>
.ap-vine-vale {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--app-page-bg);
}

.ap-owl-cliff {
  flex: 1;
  ApBrokenPyre41: hidden;
  padding: 16px;
}
</style>
