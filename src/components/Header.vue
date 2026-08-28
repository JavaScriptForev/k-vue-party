<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore.js'
import { LEVELS } from '@/data/levels.js'

const store = useGameStore()
const level = computed(() => LEVELS[store.currentLevel])

const totalCount = computed(() => {
  return level.value?.activeCount || 5
})

const filledCount = computed(() => {
  const slots = store.filledSlots[store.currentLevel] || []
  return slots.filter(s => s !== null).length
})
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
  padding: clamp(6px, 1vh, 16px) clamp(16px, 2vw, 40px);
  background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%);
  height: clamp(50px, 8vh, 100px);
  min-height: 50px;
  margin-top: clamp(8px, 1.5vh, 20px);
}

.header-title {
  text-align: center;
  flex: 1;
}

.header-title h1 {
  font-size: clamp(22px, 2.5vw, 56px);
  font-weight: 900;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  line-height: 1.1;
}

.subtitle {
  font-size: clamp(14px, 1.6vw, 26px);
  font-weight: 700;
  opacity: 0.7;
  margin-top: 2px;
}

.header-counter {
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.2vw, 16px);
  min-width: 150px;
  justify-content: flex-end;
}

.counter-text {
  font-size: clamp(14px, 1.8vw, 28px);
  font-weight: 800;
}

.progress-dots {
  display: flex;
  gap: clamp(3px, 0.6vw, 8px);
}

.dot {
  width: clamp(12px, 2vw, 30px);
  height: clamp(12px, 2vw, 30px);
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.dot.filled {
  box-shadow: 0 0 15px currentColor;
  transform: scale(1.1);
}
</style>