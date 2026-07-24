<template>
  <section class="app-shell ap-quiet-ferry">
    <div class="ap-smoke-sigil">
      <div class="ap-braid-vale" aria-hidden="true">A</div>
      <div class="ap-rusty-cipher">
        <div class="ap-wasp-marrow">{{ ApScarletVeil41.descriptor }}</div>
        <h2 class="ap-gleam-casket">{{ ApScarletVeil41.displayName }}</h2>
        <p class="ap-lark-cairn">{{ ApScarletVeil41.credit }}</p>
      </div>
    </div>

    <div class="ap-coil-harbor">
      <div class="ap-toad-spire">
        <span class="ap-deer-cipher">产品定位</span>
        <span class="ap-soft-pyre">{{ ApScarletVeil41.chineseName }} · {{ ApScarletVeil41.tagline }}</span>
      </div>
      <div class="ap-toad-spire">
        <span class="ap-deer-cipher">开发团队</span>
        <span class="ap-soft-pyre">{{ ApScarletVeil41.team }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ApScarletVeil41 } from '@/constants/brand'
</script>

<style scoped>
.ap-quiet-ferry {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ap-smoke-sigil {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;
}

.ap-braid-vale {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--ap-color-newt) 0%, var(--ap-color-spark) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.ap-rusty-cipher {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ap-wasp-marrow {
  font-size: 0.75rem;
  color: var(--ap-color-hollow);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ap-gleam-casket {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--ap-color-bare2);
}

.ap-lark-cairn {
  margin: 0;
  font-size: 0.875rem;
  color: var(--ap-color-hollow);
}

.ap-coil-harbor {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--ap-color-frost);
  border-radius: 0.5rem;
}

.ap-toad-spire {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.ap-deer-cipher {
  font-size: 0.875rem;
  color: var(--ap-color-heron);
  flex-shrink: 0;
}

.ap-soft-pyre {
  font-size: 0.875rem;
  color: var(--ap-color-bare2);
  font-weight: 500;
}
</style>