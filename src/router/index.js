import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import users from '../components/users.vue'
import roles from '../components/roles.vue'
import categories from '../components/shopping/categories.vue'
import params from '../components/shopping/params.vue'
import goods from '../components/shopping/goods.vue'
import orders from '../components/shopping/orders.vue'
import reports from '../components/shopping/reports.vue'
import rights from '../components/rights.vue'









Vue.use(VueRouter)

const routes = [{
  path: '/login',
  name: 'login',
  component: login,
  meta: {
    title: '后台管理系统',
  }
}, {

  path: '/home',
  name: 'home',
  component: home,
  meta: {
    title: '后台管理系统',
  },
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
  }, {
    path: '/goods',
    name: 'goods',
    component: goods
  }, {
    path: '/orders',
    name: 'orders',
    component: orders
  }, {
    path: '/reports',
    name: 'reports',
    component: reports
  }, {
    path: '/rights',
    name: 'rights',
    component: rights
  }, ]
}, ]

const router = new VueRouter({
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

router.beforeEach((to, from, next) => {
  const seaaions = window.sessionStorage.getItem('token')
  if (to.path == '/login') return [document.title = to.meta.title,
    next()
  ]


  if (!seaaions) return next('/login');
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default router