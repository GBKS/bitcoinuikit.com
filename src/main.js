import { createApp, h } from 'vue'
import { createRouter, createWebHistory, RouterView } from 'vue-router'

import App from './App.vue'
import HomePage from './pages/Home.vue'
import InfoPage from './pages/Info.vue'
import FoundationPage from './pages/Foundation.vue'
import ScreensPage from './pages/Screens.vue'
import HelperPage from './pages/Helper.vue'

// 2. Define some routes
// Each route should map to a component.
// We'll talk about nested routes later.
// const routes = [
//   { path: '/', component: HomePage },
//   { path: '/info', component: InfoPage },
//   { path: '/foundation', component: FoundationPage },
//   { path: '/screens', component: ScreensPage },
//   { path: '/screens/flow/:flowId', component: ScreensPage },
//   { path: '/screens/flow/:flowId/:screenId', component: ScreensPage },
//   { path: '/screens/screen/:screenId', component: ScreensPage },
//   { path: '/screens/search/:search', component: ScreensPage },
//   { path: '/helper', component: HelperPage }
// ]

const routes = [
  { path: '/', component: HomePage },
  { path: '/info', component: InfoPage },
  { path: '/foundation', component: FoundationPage },
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
