<template>
  <footer class="app-shell ap-hidden-meadow" aria-label="产品与团队信息">
    <span class="brand-footer__name">{{ ApScarletVeil41.productName }}</span>
    <span class="brand-footer__sep">·</span>
    <span class="brand-footer__sub">{{ ApScarletVeil41.chineseName }}</span>
    <span class="brand-footer__text">{{ ApScarletVeil41.credit }}</span>
    <a
      class="brand-footer__link"
      :href="ApScarletVeil41.douyinUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ ApScarletVeil41.douyinLabel }}
    </a>
    <span class="brand-footer__text">{{ ApScarletVeil41.liveSchedule }}</span>
  </footer>
</template>

<script setup lang="ts">
import { ApScarletVeil41 } from '@/constants/brand'
</script>

<style scoped>
.ap-hidden-meadow {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 28px 20px 32px;
  margin-top: 40px;
  border-top: 1px solid var(--app-border);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--app-text-muted);
  line-height: 1.6;
}

.ap-hidden-meadow__name {
  font-weight: 700;
  color: var(--color-gold);
  letter-spacing: 0.03em;
}

.ap-hidden-meadow__sep {
  opacity: 0.4;
}

.ap-hidden-meadow__sub {
  font-weight: 600;
  color: var(--color-gold-light);
  opacity: 0.8;
}

.ap-hidden-meadow__text {
  color: var(--app-text-muted);
}

.ap-hidden-meadow__link {
  color: var(--color-gold);
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px dashed var(--color-gold-border);
  transition: all 0.2s ease;
  white-space: nowrap;
}

.ap-hidden-meadow__link:hover {
  color: var(--color-gold-light);
  border-bottom-style: solid;
  box-shadow: 0 0 8px var(--color-glow-gold);
}
</style>