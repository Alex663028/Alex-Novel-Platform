<template>
  <section class="about-brand">
    <div class="brand-panel">
      <div class="brand-mark" aria-hidden="true">A</div>
      <div class="brand-main">
        <div class="brand-kicker">{{ BRAND.descriptor }}</div>
        <h2 class="brand-title">{{ BRAND.displayName }}</h2>
        <p class="brand-line">{{ BRAND.credit }}</p>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-item">
        <span class="info-label">产品定位</span>
        <span class="info-value">{{ BRAND.chineseName }} · {{ BRAND.tagline }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">开发团队</span>
        <span class="info-value">{{ BRAND.team }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { BRAND } from '@/constants/brand'
</script>

<style scoped>
.about-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brand-panel {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;
}

.brand-mark {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.brand-main {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.brand-kicker {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.brand-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

.brand-line {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.info-grid {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.info-label {
  font-size: 0.875rem;
  color: #475569;
  flex-shrink: 0;
}

.info-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 500;
}
</style>
