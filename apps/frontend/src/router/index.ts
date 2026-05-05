import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LobbyView from '../views/LobbyView.vue'
import GameView from '../views/GameView.vue'
import ResultsView from '../views/ResultsView.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/lobby/:code', name: 'lobby', component: LobbyView },
    { path: '/game/:code', name: 'game', component: GameView },
    { path: '/results/:code', name: 'results', component: ResultsView },
  ],
})
