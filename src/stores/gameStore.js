import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LEVELS, COLOR_KEYS } from '@/data/levels.js'

export const useGameStore = defineStore('game', () => {
  const currentLevel = ref(0)

  function getActiveCount(levelIndex) {
    return LEVELS[levelIndex]?.activeCount || 5
  }

  function initSlotsForLevel(levelIndex) {
    const count = getActiveCount(levelIndex)
    return new Array(count).fill(null)
  }

  const filledSlots = ref(
      LEVELS.map((_, index) => initSlotsForLevel(index))
  )

  const usedButtons = ref(LEVELS.map(() => []))
  const lastFilledSlot = ref(-1)
  const lastFillTime = ref(0)
  const isTransitioning = ref(false)
  const levelComplete = ref(false)
  const showFinalModal = ref(false)

  function getSlotColor(slotIndex) {
    return COLOR_KEYS[slotIndex % COLOR_KEYS.length]
  }

  function getSlotNumber(slotIndex) {
    return slotIndex + 1
  }

  function fillSlot(levelIndex, buttonIndex, slotIndex) {
    if (buttonIndex >= 100) {
      return { success: false, message: 'Эта кнопка не подходит!' }
    }

    const validButtons = LEVELS[levelIndex].validButtons || []

    if (buttonIndex >= validButtons.length) {
      return { success: false, message: 'Эта кнопка не подходит!' }
    }

    const colorKey = validButtons[buttonIndex].colorKey
    const slotColor = getSlotColor(slotIndex)
    const activeCount = getActiveCount(levelIndex)

    if (colorKey !== slotColor) {
      return { success: false, message: 'Не тот цвет! Попробуй ещё!' }
    }

    if (usedButtons.value[levelIndex].includes(buttonIndex)) {
      return { success: false, message: 'Эта кнопка уже была использована!' }
    }

    if (filledSlots.value[levelIndex][slotIndex] !== null) {
      return { success: false, message: 'Слот уже занят!' }
    }

    filledSlots.value[levelIndex][slotIndex] = colorKey
    usedButtons.value[levelIndex].push(buttonIndex)
    lastFilledSlot.value = slotIndex
    lastFillTime.value = Date.now()

    const filledCount = filledSlots.value[levelIndex].filter(s => s !== null).length

    if (filledCount === activeCount) {
      levelComplete.value = true
      if (levelIndex === 4) {
        setTimeout(() => {
          showFinalModal.value = true
        }, 1000)
      } else {
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
    const count = getActiveCount(levelIndex)
    filledSlots.value[levelIndex] = new Array(count).fill(null)
    usedButtons.value[levelIndex] = []
    lastFilledSlot.value = -1
    levelComplete.value = false
  }

  function resetGame() {
    currentLevel.value = 0
    filledSlots.value = LEVELS.map((_, index) => {
      const count = getActiveCount(index)
      return new Array(count).fill(null)
    })
    usedButtons.value = LEVELS.map(() => [])
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
    getSlotColor,
    getSlotNumber,
    getActiveCount,
    fillSlot,
    resetLevel,
    resetGame,
    goBack
  }
})