import request from '@/utils/request'
// 数据格式
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
}

// 请求头添加 Authorization: Basic client_id:client_secret

const auth = {
    username: 'shoukailiang',// client_id    
    password: '123456' // client_secret
}
// 登录，获取 token 接口
export function login(data) {
    // Promise
    return request({
        headers,
        auth: auth,
        url: `/auth/login`,
        method: 'post',
        params: data
    })
}

// 查询用户名是否被注册
export function getUserByUsername(username) {
    return request({
        url: `/system/api/user/username/${username}`,
        method: 'get'
    })
}


// 提交注册信息
export function register(data) {
    return request({
        url: `/system/api/user/register`,
        method: 'post',
        data: data
    })
}

export function getXieyi() {
    return request({
        url: `${window.location.href}/xieyi.html`, // 访问到的是 public/xieyi.html     
        method: 'get'
    })
}

export function logout(accessToken) {// accessToken 访问令牌，知道是哪个用户
    return request({
        url: `/auth/logout`,
        method: 'get',
        params: {
            accessToken
        }
    })
}


// 刷新令牌获取新的认证信息
export function refreshToken(refreshToken) {
    return request({
        headers,
        auth,
        url: '/auth/user/refreshToken',
        method: 'get',
        params: {
            refreshToken
        }
    })
}