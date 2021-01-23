import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth' // auth 状态模块

Vue.use(Vuex)

const store = new Vuex.Store({
    modules:{
        auth
    }
})

export default store