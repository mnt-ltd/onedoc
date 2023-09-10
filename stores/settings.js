// stores/Setting.js
import {
	defineStore
} from 'pinia';
import {
	getSettings
} from '@/api/config.js'
import {
	debug
} from '@/config.js'

export const useSettingStore = defineStore('settings', {
	unistorage: true, // 持久化存储
	state: () => {
		return {
			iSystem: {},
			iFooter:{},
			iSecurity:{},
			iDownload:{},
			iDisplay: {},
			iPayment:{},
			iVip:{
				enable: false
			},
		};
	},
	getters: {
		system(state) {
			return state.iSystem
		},
		footer(state) {
			return state.iFooter
		},
		security(state) {
			return state.iSecurity
		},
		download(state) {
			return state.iDownload
		},
		display(state) {
			return state.iDisplay
		},
		payment(state) {
			return state.iPayment
		},
		vip(state){
			return state.iVip
		}
	},
	actions: {
		async getSettings() {
			// from: 0, Web端；1，小程序/APP端
			const res = await getSettings({from: 1})
			if (debug) {
				console.log('pinia, getSettings', res)
			}
			if (res.statusCode === 200) {
				this.$patch(state => {
					state.iDisplay = res.data.display || {}
					state.iDownload = res.data.download || {}
					state.iFooter = res.data.footer || {}
					state.iPayment = res.data.payment || {}
					state.iSecurity = res.data.security || {}
					state.iVip = res.data.vip || {}
					state.iSystem = res.data.system || {}
				})
			}
			return res
		},
	},
});