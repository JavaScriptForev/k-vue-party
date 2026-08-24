<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore.js'
import { LEVELS } from '@/data/levels.js'

const store = useGameStore()
const level = computed(() => LEVELS[store.currentLevel])

const filledCount = computed(() =>
  store.filledSlots[store.currentLevel].filter(s => s !== null).length
)

const totalCount = 5

</script>

<template>
  <header class="header">
    <div class="header-title">
      <h1>🚂 {{ level.title }}</h1>
      <p class="subtitle">{{ level.subtitle }}</p>
    </div>
    <div class="header-counter">
      <span class="counter-text">Осталось: {{ totalCount - filledCount }}</span>
      <div class="progress-dots">
        <span
          v-for="i in totalCount"
          :key="i"
          class="dot"
          :class="{ filled: i <= filledCount }"
          :style="{ background: i <= filledCount ? store.getSlotColor(i - 1) : 'rgba(255,255,255,0.2)' }"
        ></span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(8px, 1.2vh, 20px) clamp(20px, 2vw, 50px);
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%);
  height: clamp(60px, 10vh, 130px);
  min-height: 60px;
  margin-top: 20px;
}

.back-btn {
  font-family: var(--font-family);
  font-size: clamp(18px, 2vw, 32px);
  font-weight: 700;
  padding: 8px 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  background: rgba(255,255,255,0.1);
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.back-btn:hover {
  background: rgba(255,255,255,0.2);
  border-color: rgba(255,255,255,0.5);
}

.header-title {
  text-align: center;
  flex: 1;
}

.header-title h1 {
  font-size: clamp(28px, 4.5vw, 72px);
  font-weight: 900;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  line-height: 1.1;
}

.subtitle {
  font-size: clamp(16px, 2vw, 32px);
  font-weight: 700;
  opacity: 0.7;
  margin-top: 4px;
}

.header-counter {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.5vw, 20px);
  min-width: 200px;
  justify-content: flex-end;
}

.counter-text {
  font-size: clamp(18px, 2.2vw, 36px);
  font-weight: 800;
}

.progress-dots {
  display: flex;
  gap: clamp(4px, 0.8vw, 12px);
}

.dot {
  width: clamp(16px, 2.5vw, 40px);
  height: clamp(16px, 2.5vw, 40px);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.dot.filled {
  box-shadow: 0 0 15px currentColor;
  transform: scale(1.1);
}
</style>
