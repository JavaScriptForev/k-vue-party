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

// Shuffle array in place (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Shuffled buttons with original indices preserved for store logic
const shuffledButtons = computed(() => {
  const orig = currentLevelData.value.buttons
  const indices = orig.map((_, i) => i)
  const shuffled = shuffle(indices)
  return shuffled.map((origIndex) => ({ ...orig[origIndex], originalIndex: origIndex }))
})

// Track which slots have wrong color drop attempts (for shake animation)
const shakeSlots = ref([false, false, false, false, false])

let shakeTimeouts = []

function clearAllShakes() {
  shakeTimeouts.forEach(t => clearTimeout(t))
  shakeTimeouts = []
  shakeSlots.value = [false, false, false, false, false]
}

function handleSlotDrop(slotIndex, buttonIndex) {
  clearAllShakes()

  const result = store.fillSlot(store.currentLevel, buttonIndex, slotIndex)

  if (!result.success) {
    shakeSlots.value[slotIndex] = true
    const t = setTimeout(() => {
      shakeSlots.value[slotIndex] = false
    }, 600)
    shakeTimeouts.push(t)
  }
}

// Show success toast message
const showToast = ref(false)
const toastMessage = ref('')
let toastTimeout = null

watch(
  () => store.lastFilledSlot,
  (newSlot) => {
    if (newSlot >= 0) {
      const level = LEVELS[store.currentLevel]
      toastMessage.value = level.slotMessages[newSlot] || 'Отлично!'
      showToast.value = true

      if (toastTimeout) clearTimeout(toastTimeout)
      toastTimeout = setTimeout(() => {
        showToast.value = false
      }, 350)
    }
  }
)

onBeforeUnmount(() => {
  clearAllShakes()
  if (toastTimeout) clearTimeout(toastTimeout)
})
</script>

<template>
  <div class="level-container">
    <!-- Header -->
    <Header />

    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="success-toast">
        {{ toastMessage }}
      </div>
    </Transition>

    <!-- Slots Row (TOP) -->
    <section class="slots-section">
      <div class="slots-row">
        <Slot
          v-for="(colorKey, slotIndex) in COLOR_KEYS"
          :key="slotIndex"
          :slot-index="slotIndex"
          :color-key="colorKey"
          :filled="store.filledSlots[store.currentLevel][slotIndex] !== null"
          :shake="shakeSlots[slotIndex]"
          @drop="(btnIdx) => handleSlotDrop(slotIndex, btnIdx)"
        />
      </div>
    </section>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Buttons Row (BOTTOM) -->
    <section class="buttons-section">
      <div class="buttons-row">
        <ButtonItem
          v-for="btn in shuffledButtons"
          :key="btn.originalIndex"
          :button-index="btn.originalIndex"
          :color-key="btn.colorKey"
          :label="btn.label"
          :used="store.usedButtons[store.currentLevel].includes(btn.originalIndex)"
        />
      </div>
    </section>

    <!-- Level Transition Overlay -->
    <Transition name="level-transition">
      <div v-if="store.isTransitioning" class="dark-overlay">
        <span class="level-text">
          {{ store.currentLevel === 0 ? '🚂' : store.currentLevel === 1 ? '🎉' : '🚀' }}
        </span>
      </div>
    </Transition>

    <!-- Confetti for final level -->
    <ConfettiCelebration v-if="store.currentLevel === 2 && store.levelComplete" />

    <!-- Final Modal -->
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
}

.slots-section {
  flex: 0 0 auto;
  padding: clamp(12px, 2vh, 24px) clamp(16px, 2vw, 40px);
  height: clamp(100px, 20vh, 240px);
  min-height: 100px;
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
  padding: clamp(12px, 2vh, 24px) clamp(16px, 2vw, 40px);
  min-height: clamp(100px, 30vh, 350px);
  display: flex;
  align-items: center;
}

.buttons-row {
  display: flex;
  gap: clamp(4px, 0.8vw, 12px);
  height: 100%;
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
</style>
