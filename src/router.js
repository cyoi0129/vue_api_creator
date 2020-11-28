import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-180911622-1',
  router,
})
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/master',
    name: 'Master',
    component: () => import('./views/Master.vue')
  },
  {
    path: '/new',
    name: 'New',
    component: () => import('./views/New.vue')
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('./views/Guide.vue'),
    props: true
  },
  {
    path: '/detail/:aid',
    name: 'Detail',
    component: () => import('./views/Detail.vue'),
    props: true
  },
  {
    name: 'notFound',
    path: '*',
    component: () => import('./views/NotFound.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes
})

export default router
