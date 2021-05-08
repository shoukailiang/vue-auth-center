import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: () => import('@/components/layout'),
			children: [
				{
					path: '',
					component: () => import('@/views/auth/login')
				}
			]
		},
		{
			path: '/refresh',
			component: () => import('@/components/layout'),
			children: [
				{
					path: '',
					component: () => import('@/views/auth/refresh')
				}
			]
		}
	]
})

import store from '@/store'

// 路由拦截器，每次路由跳转都会经过这个拦截器
router.beforeEach((to, from, next) => {
	if (to.path === '/logout') {
		store.dispatch('UserLogout', to.query.redirectURL)
	} else {
		next();// 放行
	}
})


export default router
