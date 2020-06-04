import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import router from '@/router'
// 导入elementUi
import '@/plugins/element.js'
//导入封装的axios
import '@/utils/request.js'


new Vue({
  render: h => h(App),
  router
}).$mount('#app')
