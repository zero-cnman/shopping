import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import users from '../components/users.vue'
import roles from '../components/roles.vue'
import categories from '../components/shopping/categories.vue'
import params from '../components/shopping/params.vue'







Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: login
}, {
  path: '/home',
  name: 'home',
  component: home,
  children: [{
    path: '/users',
    name: 'users',
    component: users,
  }, {
    path: '/roles',
    name: 'roles',
    component: roles,
  }, {
    path: '/categories',
    name: 'categories',
    component: categories
  }, {
    path: '/params',
    name: 'params',
    component: params
  }, ]
}, ]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  const seaaions = window.sessionStorage.getItem('token')
  if (to.path === '/login') return next();
  if (!seaaions) return next('/login');
  next()
})
export default router