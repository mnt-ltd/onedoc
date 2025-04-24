// stores/user.js
import {
	defineStore
} from 'pinia';
import {
	login,
	logout,
	updateUserProfile,
	getUser,
	register,
	registerByMobile,
	loginByMobile,
	loginWechatmp,
	loginWechatmpScan,
} from '@/api/user.js'
import {
	debug
} from '@/config.js'

export const useUserStore = defineStore('user', {
	unistorage: true, // 持久化存储
	state: () => {
		return {
			itoken: '',
			iuser: {
				id: 0
			}
		};
	},
	getters: {
		user(state) {
			return state.iuser
		},
		token(state) {
			return state.itoken
		}
	},
	actions: {
		async loginByPassword(userInfo) {
			const res = await login(userInfo)
			if (debug) {
				console.log('pinia, loginByPassword', res)
			}
			if (res.statusCode === 200) {
				this.$patch(state => {
					state.itoken = res.data.token || ''
					state.iuser = {
						id: 0,
						...res.data.user
					}
				})
			}
			return res
		},
		async loginByMobile(loginInfo) {
			const res = await loginByMobile(loginInfo)
			if (res.statusCode === 200) {
				this.$patch(state => {
					state.itoken = res.data.token || ''
					state.iuser = {
						id: 0,
						...res.data.user
					}
				})
			}
			return res
		},
		async register(registerInfo) {
			const res = await register(registerInfo)
			if (res.statusCode === 200) {
				this.$patch(state => {
					state.itoken = res.data.token || ''
					state.iuser = {
						id: 0,
						...res.data.user
					}
				})
			}
			return res
		},
		async registerByMobile(registerInfo) {
			const res = await registerByMobile(registerInfo)
			if (res.statusCode === 200) {
				this.$patch(state => {
					state.itoken = res.data.token || ''
					state.iuser = {
						id: 0,
						...res.data.user
					}
				})
			}
			return res
		},
		async logout() {
			const res = await logout()
			if (res.statusCode === 200) {
				this.$patch(state => {
					state.itoken = ''
					state.iuser = {
						id: 0
					}
				})
			}
			return res
		},
		async updateUserProfile(profile) {
			const res = await updateUserProfile(profile)
			if (res.statusCode === 200) {
				this.$patch(state => {
					state.iuser = {
						...state.iuser,
						...profile,
					}
				})
			}
			return res
		},
		async getUser() {
			const res = await getUser()
			console.log(res)
			if (res.statusCode === 200) {
				this.$patch(state => {
					state.iuser = res.data
				})
			}
			return res
		},
		async loginByWechatMini(req){
			const res = await loginWechatmp(req)
			console.log(res)
			if(res.statusCode!==200){
				return res
			}
			if(res.data.token && res.data.user){
				 // 如果返回信息中有token和用户信息，则表示登录成功。否则表示需要对用户信息进行绑定
				 this.$patch(state=>{
					 state.itoken = res.data.token
					 state.iuser = {
						 ...state.user,
						 ...res.data.user,
					 }
				 })
			}
			return res
		},
		async loginWechatmpScan(req){
			const res = await loginWechatmpScan(req)
			console.log(res)
			if(res.statusCode!==200){
				return res
			}
			if(res.data.token && res.data.user){
				 // 如果返回信息中有token和用户信息，则表示登录成功。否则表示需要对用户信息进行绑定
				 this.$patch(state=>{
					 state.itoken = res.data.token
					 state.iuser = {
						 ...state.user,
						 ...res.data.user,
					 }
				 })
			}
			return res
		}
	},
});