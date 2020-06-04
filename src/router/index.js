import Vue from 'vue'
//导入路由
import VueRouter from 'vue-router'
//导入组件
import Login from '@/views/login'
import Layout from '@/views/layout'
//按需导入token
import {
    getToken
} from '@/utils/token.js'
//注册路由
Vue.use(VueRouter)
//实例化
const router = new VueRouter({
    routes: [{
            path: '/login',
            component: Login
        },
        {
            path: '/layout',
            component: Layout
        },
        {
            path: '/',
            redirect: '/login'
        }
    ]
})
//导航守卫
router.beforeEach((to, from, next) => {
    // console.log(to);

    if (to.fullPath == '/login') {
        next()
    } else {
        const token = getToken()
        if (token) {
            next() //去到自己想去的地方
        } else {
            next('/login')
        }
    }


})
export default router