import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import './plugins/element.js'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
import _ from 'lodash'
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.use(VueQuillEditor)
Vue.prototype._ = _

//挂载axios，$http
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
});
Vue.prototype.$http = axios
Vue.config.productionTip = false
// router.beforeEach((to, from, next) => {
//   if (to.meta.title) {
//     document.title = to.meta.title
//   }
//   next()
// })
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$moment = moment