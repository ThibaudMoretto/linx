import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../components/login/Login.vue'
import Register from '../components/login/Register.vue'

const routes = [
  { path: '/', component: HomeView, meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/register', component: Register }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
