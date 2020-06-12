import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import './plugins/element.js'
import moment from 'moment'



//挂载axios，$http
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
});
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

Vue.prototype.$moment = moment