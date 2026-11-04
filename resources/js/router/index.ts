import { h } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

type RouteModule = {
  default: RouteRecordRaw | RouteRecordRaw[]
}

const routeModules = import.meta.glob<RouteModule>('./routes/**/*.ts', { eager: true })
const featureRoutes = Object.keys(routeModules)
  .sort()
  .flatMap((path) => {
    const routes = routeModules[path].default

    return Array.isArray(routes) ? routes : [routes]
  })

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: {
        render: () => h('section', [
          h('h1', 'FirmLedger'),
          h('p', 'Finance controls are ready for local development.'),
        ]),
      },
    },
    ...featureRoutes,
  ],
})

export default router
