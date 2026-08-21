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
      borderColor: filled ? color.hex : 'rgba(255,255,255,0.15)',
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
    <div class="slot-number">{{ slotIndex + 1 }}</div>
    <div class="slot-color-dot" :style="{ background: color.hex }"></div>
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
  gap: clamp(6px, 1vh, 12px);
  border-radius: var(--slot-radius);
  border: 4px solid rgba(255,255,255,0.15);
  padding: clamp(6px, 1vh, 14px);
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: clamp(80px, 14vh, 170px);
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
  border-radius: var(--slot-radius) var(--slot-radius) 0 0;
}

.slot:hover:not(.filled) {
  transform: scale(1.03);
  border-color: rgba(255,255,255,0.4);
}

.slot.filled {
  cursor: default;
}

.slot-color-dot {
  width: clamp(32px, 5vw, 70px);
  height: clamp(32px, 5vw, 70px);
  border-radius: 50%;
  box-shadow: 0 0 25px currentColor;
  transition: all 0.3s ease;
}

.slot.filled .slot-color-dot {
  box-shadow: 0 0 40px currentColor;
  transform: scale(1.1);
}

.slot-check,
.slot-placeholder {
  font-size: clamp(32px, 5vw, 64px);
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
  top: 6px;
  left: 10px;
  font-size: clamp(14px, 2vw, 22px);
  font-weight: 800;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1;
  z-index: 1;
}
</style>
