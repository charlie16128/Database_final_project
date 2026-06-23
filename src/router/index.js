import { createRouter, createWebHistory } from 'vue-router'

// Lazy-load all views (will be created in Phase 7)
const HomeView       = () => import('../views/HomeView.vue')
const LoginView      = () => import('../views/LoginView.vue')
const RegisterView   = () => import('../views/RegisterView.vue')
const ItemListView   = () => import('../views/ItemListView.vue')
const ItemDetailView = () => import('../views/ItemDetailView.vue')
const ItemCreateView = () => import('../views/ItemCreateView.vue')
const ItemEditView   = () => import('../views/ItemEditView.vue')
const MyItemsView    = () => import('../views/MyItemsView.vue')
const GuideListView  = () => import('../views/GuideListView.vue')
const GuideDetailView = () => import('../views/GuideDetailView.vue')
const GuideEditView  = () => import('../views/GuideEditView.vue')
const MessagesView   = () => import('../views/MessagesView.vue')
const ChatRoomView   = () => import('../views/ChatRoomView.vue')
const AnalyticsView  = () => import('../views/AnalyticsView.vue')

const routes = [
  { path: '/',                  component: HomeView },
  { path: '/login',             component: LoginView },
  { path: '/register',          component: RegisterView },
  { path: '/items',             component: ItemListView },
  { path: '/items/new',         component: ItemCreateView, meta: { requiresAuth: true } },
  { path: '/items/:id',         component: ItemDetailView },
  { path: '/items/:id/edit',    component: ItemEditView,   meta: { requiresAuth: true } },
  { path: '/my-items',          component: MyItemsView,    meta: { requiresAuth: true } },
  { path: '/guides',            component: GuideListView },
  { path: '/guides/create',     component: GuideEditView,  meta: { requiresAuth: true } },
  { path: '/guides/:id',         component: GuideDetailView },
  { path: '/guides/:id/edit',   component: GuideEditView,  meta: { requiresAuth: true } },
  { path: '/messages',          component: MessagesView,   meta: { requiresAuth: true } },
  { path: '/messages/:roomId',  component: ChatRoomView,   meta: { requiresAuth: true } },
  { path: '/analytics',         component: AnalyticsView },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Route guard: redirect to /login if token is missing
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
