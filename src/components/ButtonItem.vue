<script setup>
import { computed, ref } from 'vue'
import { COLORS } from '@/data/levels.js'

// Цвета для фейковых кнопок (не совпадают с основными)
const FAKE_COLORS = [
  '#6C3483', // тёмно-фиолетовый
  '#A04000', // тёмно-коричневый
  '#0E6655', // тёмно-бирюзовый
  '#7B2D26', // тёмно-бордовый
  '#1A5276'  // тёмно-синий
]

const props = defineProps({
  buttonIndex: { type: Number, required: true },
  colorKey: { type: String, required: false, default: null },
  label: { type: String, required: true },
  used: { type: Boolean, default: false },
  isFake: { type: Boolean, default: false },
  fakeIndex: { type: Number, default: 0 }
})

const color = props.colorKey ? COLORS[props.colorKey] : null
const fakeColor = FAKE_COLORS[props.fakeIndex % FAKE_COLORS.length]
const isDragging = ref(false)

function handleDragStart(e) {
  if (props.used) {
    e.preventDefault()
    return
  }

  isDragging.value = true
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', String(props.buttonIndex))

  if (props.colorKey) {
    e.dataTransfer.setData('application/x-color', props.colorKey)
  }
}

function handleDragEnd(e) {
  isDragging.value = false
}
</script>

<template>
  <div
      class="button-item"
      :class="{
      used,
      fake: isFake,
      dragging: isDragging
    }"
      :style="{
      borderColor: used ? 'rgba(255,255,255,0.05)' : (isFake ? fakeColor : color.hex),
      borderWidth: '3px',
      borderStyle: 'solid',
      background: used
        ? 'rgba(255,255,255,0.03)'
        : (isFake
          ? `linear-gradient(135deg, ${fakeColor}55, ${fakeColor}33)`
          : `linear-gradient(135deg, ${color.hex}44, ${color.hex}22)`),
      boxShadow: used
        ? 'none'
        : (isFake
          ? `0 6px 25px ${fakeColor}66, inset 0 0 20px ${fakeColor}33`
          : `0 8px 25px ${color.hex}44, inset 0 0 20px ${color.hex}22`)
    }"
      draggable="true"
      @dragstart="handleDragStart"
      @dragend="handleDragEnd"
  >
    <div
        class="button-color"
        :style="{
        background: isFake ? fakeColor : (color ? color.hex : 'rgba(255,255,255,0.1)'),
        boxShadow: isFake || !color ? `0 0 20px ${fakeColor}66` : '0 0 20px currentColor',
        border: isFake ? '2px solid rgba(255,255,255,0.2)' : 'none'
      }"
    ></div>
    <div class="button-label">
      <div class="button-text" :class="{ used, fake }">
        <span v-html="label.replace('\n', '<br>')" />
      </div>
    </div>
    <div v-if="used && !isFake" class="button-used-icon">
      <span>✅</span>
    </div>
  </div>
</template>

<style scoped>
.button-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(3px, 0.5vh, 6px);
  border-radius: var(--button-radius, 12px);
  padding: clamp(3px, 0.5vh, 7px);
  cursor: grab;
  transition: all 0.3s ease;
  min-height: clamp(45px, 9vh, 110px);
  position: relative;
  overflow: hidden;
}

.button-item:hover:not(.used) {
  transform: translateY(-2px) scale(1.02);
  border-color: rgba(255,255,255,0.5) !important;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3) !important;
}

.button-item.fake:hover:not(.used) {
  border-color: rgba(255,255,255,0.5) !important;
  box-shadow: 0 8px 30px rgba(0,0,0,0.3) !important;
}

.button-item:active:not(.used) {
  cursor: grabbing;
  transform: scale(0.97);
}

.button-item.used {
  cursor: default;
  opacity: 0;
  pointer-events: none;
}

.button-item.dragging {
  opacity: 0.3;
  transform: scale(0.95);
}

.button-color {
  width: clamp(16px, 2.5vw, 35px);
  height: clamp(16px, 2.5vw, 35px);
  border-radius: 50%;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.button-item.fake .button-color {
  border: 2px solid rgba(255,255,255,0.2);
}

.button-label {
  text-align: center;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.button-text {
  font-size: clamp(12px, 1.8vw, 28px);
  font-weight: 800;
  line-height: 1.2;
  transition: all 0.3s;
}

.button-text.used {
  opacity: 0;
}

.button-text.fake {
  opacity: 1;
  font-weight: 800;
  color: rgba(255,255,255,0.9);
}

.button-item.fake .button-text {
  color: rgba(255,255,255,0.9);
}

.button-used-icon {
  position: absolute;
  top: clamp(2px, 0.5vh, 6px);
  right: clamp(2px, 0.5vh, 6px);
  font-size: clamp(16px, 2vw, 24px);
}
</style>