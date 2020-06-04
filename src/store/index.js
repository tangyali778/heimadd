import Vue from 'vue'
import Vuex from 'vuex'

//注册vuex,其实整个vuex跟路由操作很像
Vue.use(Vuex)

//实例化
const store = new Vuex.Store({
    // 仓库中的数据
    state: {
        userInfo: ''
    },
    mutations: {
        setInfo: (state, userInfo) => {
            state.userInfo = userInfo
        }
    },
    getters: {
        getInfo: (state) => {
            return state.userInfo
        }
    }
})
//导出之后记得注入到根实例上去
export default store