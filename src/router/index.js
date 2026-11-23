import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/pages/Home.vue') },
  { path: '/research', name: 'research', component: () => import('@/pages/Research.vue') },
  { path: '/research/:slug', name: 'work-package', component: () => import('@/pages/WorkPackage.vue') },
  { path: '/team', name: 'team', component: () => import('@/pages/Team.vue') },
  { path: '/team/:slug', name: 'profile', component: () => import('@/pages/Profile.vue') },
  { path: '/news', name: 'news', component: () => import('@/pages/News.vue') },
  { path: '/news/:slug', name: 'article', component: () => import('@/pages/Article.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/pages/Contact.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFound.vue') },
]

const PAGE_LEAVE_MS = 280 // keep in sync with .page-leave-active in main.css

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Same page, only the query changed (e.g. a filter): don't jump.
    if (to.path === from.path && !to.hash && to.query !== from.query) return false
    const wait = to.path === from.path ? 0 : PAGE_LEAVE_MS
    return new Promise((resolve) =>
      setTimeout(() => {
        if (savedPosition) resolve(savedPosition)
        else if (to.hash) resolve({ el: to.hash, behavior: 'smooth' })
        else resolve({ top: 0 })
      }, wait),
    )
  },
})
