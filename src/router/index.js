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
            children: [{
                    path: 'welcome',
                    component: Welcome,
                    //借助路由元信息,对这条路径做个具体的描述
                    meta: {
                        roles: ['超级管理员', '管理员', '老师', '学生'],
                        icon: 'el-icon-date',
                        fullPath: '/layout/welcome',
                        title: '个人信息'
                    },
                },
                {
                    path: 'echart',
                    component: Echart,
                    meta: {
                        roles: ['超级管理员', '管理员', '老师'],
                        icon: 'el-icon-pie-chart',
                        fullPath: '/layout/chart',
                        title: '数据预览'
                    },
                },
                {
                    path: 'user',
                    component: User,
                    meta: {
                        roles: ['超级管理员', '管理员', '老师'],
                        icon: 'el-icon-user',
                        fullPath: '/layout/user',
                        title: '用户列表'
                    },

                },
                {
                    path: 'question',
                    component: Question,
                    meta: {
                        roles: ['超级管理员', '管理员', '老师', '学生'],
                        icon: 'el-icon-edit-outline',
                        fullPath: '/layout/question',
                        title: '题库列表'
                    },

                },
                {
                    path: 'enterprise',
                    component: Enterprise,
                    meta: {
                        roles: ['超级管理员', '管理员', '老师'],
                        icon: 'el-icon-office-building',
                        fullPath: '/layout/enterprise',
                        title: '企业列表'
                    },
                },
                {
                    path: 'subject',
                    component: Subject,
                    meta: {
                        roles: ['超级管理员', '管理员', '老师'],
                        icon: 'el-icon-notebook-2',
                        fullPath: '/layout/subject',
                        title: '学科列表'

                    },
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