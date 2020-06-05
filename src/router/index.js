import Vue from 'vue'
//导入路由
import VueRouter from 'vue-router'
//导入组件
import Login from '@/views/login'
import Layout from '@/views/layout'
import Welcome from '@/views/layout/welcome'
import Echart from '@/views/layout/echart'
import User from '@/views/layout/user'
import Question from '@/views/layout/question'
import Enterprise from '@/views/layout/enterprise'
import Subject from '@/views/layout/subject'
//按需导入token
import {
    getToken
} from '@/utils/token.js'
//注册路由
Vue.use(VueRouter)

// 解决 相同路由相同参数跳转 请求组件,浏览器觉得是同一个没必要重新请求报错(百度找)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

//实例化
const router = new VueRouter({
    routes: [{
            path: '/login',
            component: Login
        },
        {
            path: '/layout',
            component: Layout,
            children: [
                {
                    path: 'welcome',
                    component: Welcome
                },
                {
                    path: 'echart',
                    component: Echart
                },
                {
                    path: 'user',
                    component: User
                },
                {
                    path: 'question',
                    component: Question
                },
                {
                    path: 'enterprise',
                    component: Enterprise
                },
                {
                    path: 'subject',
                    component: Subject
                },
            ]
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