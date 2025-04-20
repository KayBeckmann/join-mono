import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '../views/DashboardView.vue'; // Pfad anpassen

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // Oder '/dashboard'
      name: 'dashboard',
      component: DashboardView
    },
    // ... andere Routen (z.B. /board, /login, etc.)
    {
       path: '/board',
       name: 'board',
       // Lazy-loaded component
       component: () => import('../views/BoardView.vue') // Beispiel für BoardView
     },
  ]
});

export default router;