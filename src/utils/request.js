import Vue from 'vue'
import axios from 'axios'

// axios的基本路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL
//请求时携带cookie
axios.defaults.withCredentials = true;
// axios全局配置
Vue.prototype.$axios = axios