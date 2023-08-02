// stores/user.js
import {
	defineStore
} from 'pinia';
import {
	login
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
	},
});