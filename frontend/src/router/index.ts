import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/ApMothLantern89.vue')
const Workbench = () => import('../views/ApThornShard6.vue')
const Chapter = () => import('../views/ApAmberLattice.vue')
const Cast = () => import('../views/ApVineDrift92.vue')
const CharacterGraph = () => import('../views/ApHollowEmber.vue')
const LocationGraph = () => import('../views/ApOnyxShard.vue')
const CharacterSchedulerSimulator = () =>
  import('../components/debug/ApWanderingShard.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/book/:novelId/workbench', name: 'Workbench', component: Workbench },
    { path: '/book/:novelId/cast', name: 'Cast', component: Cast },
    { path: '/book/:novelId/chapter/:id', name: 'Chapter', component: Chapter },
    { path: '/book/:novelId/characters', name: 'CharacterGraph', component: CharacterGraph },
    { path: '/book/:novelId/location-graph', name: 'LocationGraph', component: LocationGraph },
    {
      path: '/debug/scheduler',
      name: 'CharacterSchedulerSimulator',
      component: CharacterSchedulerSimulator,
    },
  ],
})

export default router
