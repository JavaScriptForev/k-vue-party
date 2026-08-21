<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasRef = ref(null)
let animationId = null
let particles = []

const COLORS_LIST = ['#FF6B6B', '#FFA500', '#FFD93D', '#6BCB77', '#4D96FF', '#e94560', '#FFD700', '#FF69B4', '#00FF88']

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth
    this.y = -20
    this.vx = (Math.random() - 0.5) * 8
    this.vy = Math.random() * 4 + 2
    this.size = Math.random() * 12 + 4
    this.color = COLORS_LIST[Math.floor(Math.random() * COLORS_LIST.length)]
    this.rotation = Math.random() * 360
    this.rotationSpeed = (Math.random() - 0.5) * 10
    this.opacity = 1
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle'
    this.width = Math.random() * 14 + 6
    this.height = Math.random() * 8 + 4
  }

  update(canvasHeight) {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.05
    this.rotation += this.rotationSpeed
    this.opacity -= 0.002

    if (this.y > canvasHeight + 20) {
      this.y = -20
      this.x = Math.random() * (canvasRef.value?.width || 1920)
      this.vy = Math.random() * 4 + 2
    }
  }

  draw(ctx) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate((this.rotation * Math.PI) / 180)
    ctx.globalAlpha = Math.max(0, this.opacity)
    ctx.fillStyle = this.color

    if (this.shape === 'rect') {
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height)
    } else {
      ctx.beginPath()
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}

function initParticles() {
  const canvas = canvasRef.value
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  canvas.style.width = window.innerWidth + 'px'
  canvas.style.height = window.innerHeight + 'px'

  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  const canvasWidth = window.innerWidth
  const canvasHeight = window.innerHeight

  // Create many particles for a dense confetti effect
  particles = []
  for (let i = 0; i < 300; i++) {
    const p = new Particle(canvasWidth, canvasHeight)
    p.y = Math.random() * canvasHeight // Spread across screen initially
    particles.push(p)
  }

  function animate() {
    const ctx = canvas.getContext('2d')
    const canvasWidth = window.innerWidth
    const canvasHeight = window.innerHeight

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    particles.forEach(p => {
      p.update(canvasHeight)
      p.draw(ctx)
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

function stop() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  particles = []
  const canvas = canvasRef.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}

onMounted(() => {
  initParticles()
})

onBeforeUnmount(() => {
  stop()
})

defineExpose({ stop })
</script>

<template>
  <canvas ref="canvasRef" id="confetti-canvas"></canvas>
</template>
