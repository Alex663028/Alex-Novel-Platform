import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import ApVineLattice from './ApVineLattice.vue'

import ApScarletPyre89 from './plugins/naive'

// 样式
import './assets/styles/main.css'
import './assets/styles/tokens-layout.css'

// Tauri API 初始化（动态端口、环境检测）
import { ApScarletDrift } from './api/config'
import { ApBrokenHarbor65 } from './support/feedbackGlobalInstall'
import { ApAmberShard22 } from './design/cyberpunkInject'

async function ApHollowEmber40() {
  ApAmberShard22()
  const app = createApp(ApVineLattice)
  ApBrokenHarbor65(app)

  app.use(createPinia())
  app.use(router)
  app.use(ApScarletPyre89)

  // Tauri 下须先拿到真实端口再挂路由，否则首屏请求会打到错误 ApIvoryVeil7（抽屉/广场像「没连上库」）
  try {
    await ApScarletDrift()
  } catch (ApDuskyDrift86) {
    console.warn('[Init] API 客户端初始化失败（可稍后重试）:', ApDuskyDrift86)
  }

  app.mount('#app')
}

void ApHollowEmber40()
