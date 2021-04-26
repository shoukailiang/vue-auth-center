import { login, logout, refreshToken } from '@/api/auth'
import { PcCookie, Key } from '@/utils/cookie' // 对cookie操作

const state = {
    userInfo: PcCookie.get(Key.userInfoKey)
        ? JSON.parse(PcCookie.get(Key.userInfoKey)) : null, // 用户信息对象     
    accessToken: PcCookie.get(Key.accessTokenKey), // 访问令牌字符串     
    refreshToken: PcCookie.get(Key.refreshTokenKey), // 刷新令牌字符串,当访问令牌过期，通过刷新令牌获取新令牌
}

// 改变状态值
const mutations = {
    SET_USER_STATE(state, data) {
        console.log('SET_USER_STATE', data)
        const { userInfo, access_token, refresh_token } = data
        state.userInfo = userInfo
        state.accessToken = access_token
        state.refreshToken = refresh_token
        PcCookie.set(Key.userInfoKey, userInfo)
        PcCookie.set(Key.accessTokenKey, access_token)
        PcCookie.set(Key.refreshTokenKey, refresh_token)
    },
    // 重置用户状态,退出和登录失败时用
    RESET_USER_STATE(state) {
        state.userInfo = null
        state.accessToken = null
        state.refreshToken = null
        PcCookie.remove(Key.userInfoKey)
        PcCookie.remove(Key.accessTokenKey)
        PcCookie.remove(Key.refreshTokenKey)
    }
}
// 定义行为
const actions = {
    UserLogin({ commit }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {
            login({ username: username.trim(), password: password }).then(response => {
                const { code, data } = response;
                if (code === 20000) {
                    // 状态赋值 
                    commit('SET_USER_STATE', data)
                }
                resolve(response) // 正常响应钩子      
            }).catch(error => {
                commit('RESET_USER_STATE')
                reject(error);// 异常
            })
        })
    },

    UserLogout({ state, commit }, redirectURL) {
        logout(state.accessToken).then(response => {
            commit('RESET_USER_STATE')
            window.location.href = redirectURL || '/'
        }).catch(error => {
            // 重置状态
            commit('RESET_USER_STATE')
            window.location.href = redirectURL || '/'
        })
    },
    SendRefreshToken({ state, commit }) {
        return new Promise((resolve, reject) => {

            if (!state.refreshToken) {
                commit('RESET_USER_STATE')
                reject('没有刷新令牌')
                return
            }

            refreshToken(state.refreshToken).then(response => {
                console.log('获取到的新认证令牌', response.data)
                // 更新用户状态新数据
                commit('SET_USER_STATE', response.data)
                resolve() // 正常钩子
            }).catch(error => {
                // 重置状态
                commit('RESET_USER_STATE')
                reject(error)
            })

        })
    },

}


export default {
    state, mutations, actions
}
