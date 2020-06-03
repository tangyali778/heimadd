import Vue from 'vue'
//导入路由
import VueRouter from 'vue-router'
//导入组件
import Login from '@/views/login'
import Layout from '@/views/layout'
//注册路由
Vue.use(VueRouter)
//实例化
const router = new VueRouter({
    routes: [
        {path:'/login',component:Login},
        {path:'/layout',component:Layout},
        {path:'/',redirect:'/login'}
    ]
})
export default router