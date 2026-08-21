<script setup>
import { computed, ref } from 'vue'
import { COLORS } from '@/data/levels.js'

const props = defineProps({
  buttonIndex: { type: Number, required: true },
  colorKey: { type: String, required: true },
  label: { type: String, required: true },
  used: { type: Boolean, default: false }
})

const color = COLORS[props.colorKey]
const isDragging = ref(false)

function handleDragStart(e) {
  if (props.used) {
    e.preventDefault()
    return
  }
  isDragging.value = true
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/plain', String(props.buttonIndex))
  e.dataTransfer.setData('application/x-color', props.colorKey)
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
      dragging: isDragging
    }"
    :style="{
      borderColor: used ? 'rgba(255,255,255,0.1)' : color.hex,
      background: used
        ? 'rgba(255,255,255,0.03)'
        : `linear-gradient(135deg, ${color.hex}44, ${color.hex}22)`,
      boxShadow: used
        ? 'none'
        : `0 8px 25px ${color.hex}44, inset 0 0 20px ${color.hex}22`
    }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <div class="button-color" :style="{ background: color.hex }"></div>
    <div class="button-label">
      <div class="button-text" :class="{ used }">
        <span v-html="label.replace('\n', '<br>')" />
      </div>
    </div>
    <div v-if="used" class="button-used-icon">
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
  gap: clamp(6px, 1vh, 12px);
  border-radius: var(--button-radius);
  border: 4px solid rgba(255,255,255,0.15);
  padding: clamp(6px, 1vh, 14px);
  cursor: grab;
  transition: all 0.3s ease;
  min-height: clamp(90px, 18vh, 220px);
  position: relative;
  overflow: hidden;
}

.button-item:hover:not(.used) {
  transform: translateY(-4px) scale(1.02);
  border-color: rgba(255,255,255,0.4);
}

.button-item:active:not(.used) {
  cursor: grabbing;
  transform: scale(0.97);
}

.button-item.used {
  cursor: default;
  opacity: 0.5;
}

.button-item.dragging {
  opacity: 0.4;
  transform: scale(0.95);
}

.button-color {
  width: clamp(32px, 5vw, 70px);
  height: clamp(32px, 5vw, 70px);
  border-radius: 50%;
  box-shadow: 0 0 20px currentColor;
  transition: all 0.3s ease;
}

.button-item.used .button-color {
  opacity: 0.3;
  box-shadow: none;
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
  font-size: clamp(18px, 2.5vw, 40px);
  font-weight: 800;
  line-height: 1.2;
  transition: all 0.3s;
}

.button-text.used {
  opacity: 0.4;
  text-decoration: line-through;
}

.button-used-icon {
  position: absolute;
  top: clamp(4px, 0.8vh, 10px);
  right: clamp(4px, 0.8vh, 10px);
  font-size: clamp(20px, 3vw, 36px);
}
</style>
