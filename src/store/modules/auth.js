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
    // 赋值用户状态
    SET_USER_STATE(state, data) {
        console.log('SET_USER_STATE', data)
        // 状态赋值
        const { userInfo, access_token, refresh_token } = data
        state.userInfo = userInfo
        state.accessToken = access_token
        state.refreshToken = refresh_token
        // 保存到cookie中
        PcCookie.set(Key.userInfoKey, userInfo)
        PcCookie.set(Key.accessTokenKey, access_token)
        PcCookie.set(Key.refreshTokenKey, refresh_token)
    },
    // 重置用户状态,退出和登录失败时用
    RESET_USER_STATE(state) {
        // 状态置空
        state.userInfo = null
        state.accessToken = null
        state.refreshToken = null
        // 移除cookie
        PcCookie.remove(Key.userInfoKey)
        PcCookie.remove(Key.accessTokenKey)
        PcCookie.remove(Key.refreshTokenKey)
    }
}
// 定义行为
const actions = {
    // 登录操作     
    UserLogin({ commit }, userInfo) {
        const { username, password } = userInfo;
        return new Promise((resolve, reject) => {
            // 调用登录接口 /api/auth.js#login
            login({ username: username.trim(), password: password }).then(response => {
                // 获取响应值 
                const { code, data } = response;
                if (code === 20000) {
                    // 状态赋值 
                    commit('SET_USER_STATE', data)
                }
                resolve(response) // 不要少了 ，正常响应钩子      
            }).catch(error => {
                // 重置状态
                commit('RESET_USER_STATE')
                reject(error);// 异常
            })
        })
    },

    // 退出
    UserLogout({ state, commit }, redirectURL) {
        // 调用退出接口, 上面不要忘记导入 logout 方法
        logout(state.accessToken).then(response => {
            // 重置状态
            commit('RESET_USER_STATE')
            // 重写向回来源地址，如果没有传重定向地址则回到到登录页
            window.location.href = redirectURL || '/'
        }).catch(error => {
            // 重置状态
            commit('RESET_USER_STATE')
            window.location.href = redirectURL || '/'
        })
    },
    // 发送刷新令牌
    SendRefreshToken({ state, commit }) {
        return new Promise((resolve, reject) => {

            // 判断是否有刷新令牌
            if (!state.refreshToken) {
                commit('RESET_USER_STATE')
                reject('没有刷新令牌')
                return
            }

            // 发送请求
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
