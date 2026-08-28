<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useGameStore } from '@/stores/gameStore.js'
import { LEVELS, COLOR_KEYS } from '@/data/levels.js'
import Header from '@/components/Header.vue'
import Slot from '@/components/Slot.vue'
import ButtonItem from '@/components/ButtonItem.vue'
import ConfettiCelebration from '@/components/ConfettiCelebration.vue'
import FinalModal from '@/components/FinalModal.vue'

const store = useGameStore()

const currentLevelData = computed(() => LEVELS[store.currentLevel])

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const activeCount = computed(() => {
  return currentLevelData.value?.activeCount || 5
})

const shuffledValidButtons = computed(() => {
  const orig = currentLevelData.value.validButtons || []
  const indices = orig.map((_, i) => i)
  const shuffled = shuffle(indices)
  return shuffled.map((origIndex) => ({ ...orig[origIndex], originalIndex: origIndex }))
})

const fakeButtons = computed(() => {
  return currentLevelData.value.fakeButtons || []
})

const slotKeys = computed(() => {
  const count = activeCount.value
  const keys = []
  for (let i = 0; i < count; i++) {
    keys.push(COLOR_KEYS[i % COLOR_KEYS.length])
  }
  return keys
})

const shakeSlots = ref([])
let shakeTimeouts = []

function initShakeSlots() {
  shakeSlots.value = new Array(activeCount.value).fill(false)
}

function clearAllShakes() {
  shakeTimeouts.forEach(t => clearTimeout(t))
  shakeTimeouts = []
  shakeSlots.value = new Array(activeCount.value).fill(false)
}

function handleSlotDrop(slotIndex, buttonIndex) {
  clearAllShakes()

  if (buttonIndex >= 100) {
    shakeSlots.value[slotIndex] = true
    const t = setTimeout(() => {
      shakeSlots.value[slotIndex] = false
    }, 600)
    shakeTimeouts.push(t)
    return
  }

  const result = store.fillSlot(store.currentLevel, buttonIndex, slotIndex)

  if (!result.success) {
    shakeSlots.value[slotIndex] = true
    const t = setTimeout(() => {
      shakeSlots.value[slotIndex] = false
    }, 600)
    shakeTimeouts.push(t)
  }
}

const showToast = ref(false)
const toastMessage = ref('')
let toastTimeout = null
let lastToastTime = 0

watch(
    () => store.lastFilledSlot,
    (newSlot) => {
      if (newSlot === -1) return

      const now = Date.now()
      if (now - lastToastTime < 500) return
      lastToastTime = now

      const level = LEVELS[store.currentLevel]
      toastMessage.value = level.slotMessages[newSlot] || 'Отлично!'
      showToast.value = true

      if (toastTimeout) clearTimeout(toastTimeout)
      toastTimeout = setTimeout(() => {
        showToast.value = false
      }, 350)
    }
)

watch(
    () => store.currentLevel,
    () => {
      initShakeSlots()
    },
    { immediate: true }
)

onBeforeUnmount(() => {
  clearAllShakes()
  if (toastTimeout) clearTimeout(toastTimeout)
})
</script>

<template>
  <div class="level-container">
    <Header />

    <Transition name="toast">
      <div v-if="showToast" class="success-toast">
        {{ toastMessage }}
      </div>
    </Transition>

    <section class="slots-section">
      <div class="slots-row">
        <Slot
            v-for="(colorKey, slotIndex) in slotKeys"
            :key="slotIndex"
            :slot-index="slotIndex"
            :color-key="colorKey"
            :filled="store.filledSlots[store.currentLevel]?.[slotIndex] !== null"
            :shake="shakeSlots[slotIndex] || false"
            @drop="(btnIdx) => handleSlotDrop(slotIndex, btnIdx)"
        />
      </div>
    </section>

    <div class="divider"></div>

    <section class="buttons-section">
      <div class="buttons-row valid-row">
        <ButtonItem
            v-for="btn in shuffledValidButtons"
            :key="'valid-' + btn.originalIndex"
            :button-index="btn.originalIndex"
            :color-key="btn.colorKey"
            :label="btn.label"
            :used="store.usedButtons[store.currentLevel].includes(btn.originalIndex)"
            :is-fake="false"
            :fake-index="0"
        />
      </div>

      <div class="buttons-row fake-row">
        <ButtonItem
            v-for="(btn, index) in fakeButtons"
            :key="'fake-' + index"
            :button-index="index + 100"
            :color-key="null"
            :label="btn.label"
            :used="false"
            :is-fake="true"
            :fake-index="index"
        />
      </div>
    </section>

    <Transition name="level-transition">
      <div v-if="store.isTransitioning" class="dark-overlay">
        <span class="level-text">
          {{ store.currentLevel === 0 ? '🚂' : store.currentLevel === 1 ? '🎉' : '🚀' }}
        </span>
      </div>
    </Transition>

    <ConfettiCelebration v-if="store.currentLevel === 4 && store.levelComplete" />

    <FinalModal v-if="store.showFinalModal" />
  </div>
</template>

<style scoped>
.level-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: linear-gradient(180deg, var(--color-bg-dark) 0%, var(--color-bg-mid) 50%, var(--color-bg-dark) 100%);
  padding-bottom: clamp(8px, 1.5vh, 20px);
}

.slots-section {
  flex: 0 0 auto;
  padding: clamp(8px, 1.5vh, 16px) clamp(16px, 2vw, 40px);
  height: clamp(80px, 15vh, 180px);
  min-height: 80px;
}

.slots-row {
  display: flex;
  gap: clamp(4px, 0.8vw, 12px);
  height: 100%;
}

.slots-row :deep(.slot) {
  flex: 1;
  height: 100%;
}

.divider {
  height: clamp(2px, 0.4vh, 4px);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  flex-shrink: 0;
}

.buttons-section {
  flex: 1 1 auto;
  padding: clamp(4px, 0.8vh, 10px) clamp(16px, 2vw, 40px);
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 0.5vh, 8px);
  min-height: clamp(120px, 25vh, 280px);
  justify-content: center;
}

.buttons-row {
  display: flex;
  gap: clamp(3px, 0.5vw, 8px);
  height: 50%;
  width: 100%;
}

.buttons-row :deep(.button-item) {
  flex: 1;
  height: 100%;
}

/* Toast transitions */
.toast-enter-active {
  animation: toastSlideIn 0.4s ease-out;
}

.toast-leave-active {
  animation: toastSlideOut 0.4s ease-in;
}

@keyframes toastSlideIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes toastSlideOut {
  from { opacity: 1; }
  to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
}

/* Level transition */
.level-transition-enter-active {
  animation: levelFadeIn 0.8s ease-out;
}

.level-transition-leave-active {
  animation: levelFadeOut 0.7s ease-in;
}

@keyframes levelFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes levelFadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

/* Success toast */
.success-toast {
  position: fixed;
  top: clamp(60px, 10vh, 120px);
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, rgba(255,215,0,0.95), rgba(255,165,0,0.95));
  color: #1a1a2e;
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 900;
  padding: clamp(12px, 2vh, 24px) clamp(24px, 4vw, 48px);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(255,215,0,0.5);
  z-index: 100;
  text-align: center;
  border: 2px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(4px);
  white-space: nowrap;
}

/* Dark overlay for transitions */
.dark-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.level-text {
  font-size: clamp(80px, 15vw, 200px);
  animation: pulse 0.8s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { transform: scale(0.8); opacity: 0.5; }
  to { transform: scale(1.2); opacity: 1; }
}
</style>