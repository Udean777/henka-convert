import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import ConverterView from '../views/ConverterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/app',
      name: 'app',
      component: ConverterView,
    },
    {
      path: '/convert',
      redirect: '/app',
    },
  ],
})

export default router
