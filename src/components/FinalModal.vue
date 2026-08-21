<script setup>
import { useGameStore } from '@/stores/gameStore.js'

const store = useGameStore()

function handleReset() {
  store.resetGame()
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h1>🎉 МОЛОДЦЫ, ДЕТИ! 🏆</h1>
      <p>Вы купили все билеты!<br>Поезд отправляется<br>в страну чудес! 🚂✨</p>
      <button class="modal-button" @click="handleReset">
        🔄 Сыграть ещё раз
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Modal styles are in global.css */
</style>
