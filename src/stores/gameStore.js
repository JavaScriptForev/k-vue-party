import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LEVELS, COLOR_KEYS } from '@/data/levels.js'

function shuffleArray(arr) {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export const useGameStore = defineStore('game', () => {
  const currentLevel = ref(0) // 0, 1, 2
  const filledSlots = ref([
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null]
  ])
  const usedButtons = ref([[], [], []]) // usedButtons[levelIndex] = array of button indices
  const lastFilledSlot = ref(-1)
  const lastFillTime = ref(0)
  const isTransitioning = ref(false)
  const levelComplete = ref(false)
  const showFinalModal = ref(false)

  // Create shuffled slot order for each level
  const slotOrder = computed(() => {
    return COLOR_KEYS.map((_, i) => i)
  })

  function getSlotColor(slotIndex) {
    return COLOR_KEYS[slotIndex]
  }

  function getSlotNumber(slotIndex) {
    return slotIndex + 1
  }

  function fillSlot(levelIndex, buttonIndex, slotIndex) {
    const colorKey = LEVELS[levelIndex].buttons[buttonIndex].colorKey
    const slotColor = getSlotColor(slotIndex)

    // Check if colors match
    if (colorKey !== slotColor) {
      return { success: false, message: 'Не тот цвет! Попробуй ещё!' }
    }

    // Check if button already used
    if (usedButtons.value[levelIndex].includes(buttonIndex)) {
      return { success: false, message: 'Эта кнопка уже была нажата!' }
    }

    // Check if slot already filled
    if (filledSlots.value[levelIndex][slotIndex] !== null) {
      return { success: false, message: 'Слот уже занят!' }
    }

    // Fill the slot
    filledSlots.value[levelIndex][slotIndex] = colorKey
    usedButtons.value[levelIndex].push(buttonIndex)
    lastFilledSlot.value = slotIndex
    lastFillTime.value = Date.now()

    // Check if all 5 slots are filled
    const filledCount = filledSlots.value[levelIndex].filter(s => s !== null).length
    if (filledCount === 5) {
      levelComplete.value = true
      if (levelIndex === 2) {
        // Final level - show confetti and modal
        setTimeout(() => {
          showFinalModal.value = true
        }, 1000)
      } else {
        // Move to next level
        setTimeout(() => {
          isTransitioning.value = true
          setTimeout(() => {
            currentLevel.value = levelIndex + 1
            levelComplete.value = false
            isTransitioning.value = false
          }, 800)
        }, 1500)
      }
    }

    return { success: true }
  }

  function resetLevel(levelIndex) {
    filledSlots.value[levelIndex] = [null, null, null, null, null]
    usedButtons.value[levelIndex] = []
    lastFilledSlot.value = -1
    levelComplete.value = false
  }

  function resetGame() {
    currentLevel.value = 0
    filledSlots.value = [[null,null,null,null,null], [null,null,null,null,null], [null,null,null,null,null]]
    usedButtons.value = [[], [], []]
    lastFilledSlot.value = -1
    levelComplete.value = false
    showFinalModal.value = false
  }

  function goBack() {
    if (currentLevel.value > 0) {
      isTransitioning.value = true
      setTimeout(() => {
        currentLevel.value--
        isTransitioning.value = false
      }, 800)
    }
  }

  return {
    currentLevel,
    filledSlots,
    usedButtons,
    lastFilledSlot,
    lastFillTime,
    isTransitioning,
    levelComplete,
    showFinalModal,
    slotOrder,
    getSlotColor,
    getSlotNumber,
    fillSlot,
    resetLevel,
    resetGame,
    goBack
  }
})
