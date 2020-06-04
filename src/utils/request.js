import Vue from 'vue'
import axios from 'axios'
//按需导入token
import {getToken,removeToken} from '@/utils/token.js'
import router from '../router';

// axios的基本路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL
//请求时携带cookie
axios.defaults.withCredentials = true;
// axios全局配置
Vue.prototype.$axios = axios

// 请求拦截器
axios.interceptors.request.use(function (config) {
    // 发送请求就把token带过去
    const token = getToken()
    if (token) {
        config.headers.token = token;
    }

    return config;
   
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

//响应拦截器
axios.interceptors.response.use(function (response) {
    // token过期的话(返回的code就是206)就把token删掉并且回到登录页
     if (response.data.code == 206) {
         removeToken();
         router.push('/login')
         
     }
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
});
  