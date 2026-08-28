<script setup>
import { COLORS } from '@/data/levels.js'

const props = defineProps({
  slotIndex: { type: Number, required: true },
  colorKey: { type: String, required: true },
  filled: { type: Boolean, default: false },
  shake: { type: Boolean, default: false }
})

const color = COLORS[props.colorKey]
const emit = defineEmits(['drop'])

function handleDrop(e) {
  e.preventDefault()
  const buttonIndex = parseInt(e.dataTransfer.getData('text/plain'))

  if (buttonIndex >= 100) {
    emit('drop', buttonIndex)
    return
  }

  if (!isNaN(buttonIndex)) {
    emit('drop', buttonIndex)
  }
}
</script>

<template>
  <div
      class="slot"
      :class="{ filled, shake }"
      :style="{
      borderColor: filled ? color.hex : 'rgba(255,255,255,0.3)',
      borderStyle: 'dashed',
      borderWidth: '3px',
      background: filled
        ? `linear-gradient(135deg, ${color.hex}33, ${color.hex}11)`
        : 'rgba(255,255,255,0.03)',
      boxShadow: filled
        ? `0 0 40px ${color.hex}66, inset 0 0 30px ${color.hex}33`
        : '0 4px 15px rgba(0,0,0,0.3)'
    }"
      @dragover.prevent
      @drop="handleDrop"
  >
    <div class="slot-number" :style="{ color: color.hex }">
      {{ slotIndex + 1 }}
    </div>
    <div
        class="slot-color-dot"
        :style="{
        background: color.hex,
        width: 'clamp(20px, 3vw, 40px)',
        height: 'clamp(20px, 3vw, 40px)'
      }"
    ></div>
    <div v-if="filled" class="slot-check">
      <span>✅</span>
    </div>
    <div v-else class="slot-placeholder">
      <span>➕</span>
    </div>
  </div>
</template>

<style scoped>
.slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 0.8vh, 10px);
  border-radius: var(--slot-radius, 16px);
  padding: clamp(4px, 0.8vh, 10px);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: clamp(60px, 12vh, 140px);
  position: relative;
  overflow: hidden;
}

.slot::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--color-key, transparent);
  border-radius: var(--slot-radius, 16px) var(--slot-radius, 16px) 0 0;
}

.slot:hover:not(.filled) {
  transform: scale(1.03);
  border-color: rgba(255,255,255,0.5) !important;
}

.slot.filled {
  cursor: default;
  border-style: solid !important;
}

.slot-color-dot {
  border-radius: 50%;
  box-shadow: 0 0 20px currentColor;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.slot.filled .slot-color-dot {
  box-shadow: 0 0 30px currentColor;
  transform: scale(1.05);
}

.slot-check,
.slot-placeholder {
  font-size: clamp(20px, 3vw, 32px);
  transition: all 0.3s ease;
}

.slot.shake {
  animation: shake 0.5s ease-in-out;
  border-color: #ff0000 !important;
  background: rgba(255, 0, 0, 0.2) !important;
}

.slot.shake .slot-color-dot {
  animation: shake 0.5s ease-in-out;
  background: #ff0000 !important;
}

.slot-number {
  position: absolute;
  top: 4px;
  left: 8px;
  font-size: clamp(18px, 2.5vw, 32px);
  font-weight: 900;
  line-height: 1;
  z-index: 1;
  text-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  opacity: 0.9;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-8px); }
  80% { transform: translateX(8px); }
}
</style>