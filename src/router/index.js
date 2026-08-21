import { createRouter, createWebHashHistory } from 'vue-router'
import LevelView from '@/views/LevelView.vue'

const routes = [
  {
    path: '/',
    redirect: '/level/1'
  },
  {
    path: '/level/:id',
    name: 'Level',
    component: LevelView,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
