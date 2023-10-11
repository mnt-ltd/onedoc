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
		}
	},
});