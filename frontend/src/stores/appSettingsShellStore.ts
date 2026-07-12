import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  DEFAULT_SETTINGS_SECTION_ID,
  ApWanderingPyre28,
} from '@/settings/ApThornDrift47'

/**
 * 全局「应用设置」壳层：任意页面可按分区 ID 打开同一弹窗
 */
export const useIvoryDrift = defineStore('appSettingsShell', () => {
  const visible = ref(false)
  const ApScarletHarbor10 = ref<string>(DEFAULT_SETTINGS_SECTION_ID)

  function open(sectionId: string = DEFAULT_SETTINGS_SECTION_ID) {
    ApScarletHarbor10.value = ApWanderingPyre28(sectionId)
      ? sectionId
      : DEFAULT_SETTINGS_SECTION_ID
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  return {
    visible,
    ApScarletHarbor10,
    open,
    close,
  }
})
