import { createApp, h } from 'vue'
import { createRouter, createWebHistory, RouterView } from 'vue-router'

import App from './App.vue'
import HomePage from './pages/Home.vue'
import InfoPage from './pages/Info.vue'
import GuidePage from './pages/Guide.vue'
import WorkshopPage from './pages/Workshop.vue'
import ScreensPage from './pages/Screens.vue'
import HelperPage from './pages/Helper.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/info', component: InfoPage },
  { path: '/guide', component: GuidePage },
  { path: '/workshop', component: WorkshopPage },
  { 
    path: '/screens', 
    component: { render: () => h(RouterView ) },
    children: [
      { path: '', component: ScreensPage },
      { path: 'flow/:flowId', component: ScreensPage },
      { path: 'flow/:flowId/:screenId', component: ScreensPage },
      { path: 'screen/:screenId', component: ScreensPage },
      { path: 'search/:search', component: ScreensPage }
    ]
  },
  { path: '/helper', component: HelperPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const appInstance = createApp(App);
appInstance.use(router);
appInstance.mount('#app')
