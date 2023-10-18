<template>
	<view>
		<mHeader title="登录" />
		<view class="login">
			<view class="logo">
				<image src="/static/images/avatar.png"></image>
			</view>
			<template v-if="system.enable_sms">
				<view class="row tabs">
					<view class="col-3" :class="tab==='sms' ? 'active': ''" @click="changeTab('sms')">
						短信登录
					</view>
					<view class="col-3" :class="tab==='password' ? 'active': ''" @click="changeTab('password')">
						密码登录
					</view>
				</view>
				<formLoginPassword v-if="tab==='password'" @success="success"/>
				<formLoginMobile v-if="tab==='sms'" @success="success"/>
			</template>
			<formLoginPassword v-else @success="success"/>
			<navigator hover-class="none" class="font-lv3" url="/pages/register/register">
				<button type="default" class="btn-wechat-login btn-block">注册账号</button>
			</navigator>
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import formLoginPassword from '@/compomnents/formLoginPassword.vue'
	import formLoginMobile from '@/compomnents/formLoginMobile.vue'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		mapActions,
		mapGetters,
	} from 'pinia'
	import {
		getUserCaptcha,
	} from '@/api/user.js'
	import {
		debug
	} from '@/config.js'
	import {
		toastError,
		toastSuccess,
		redirectTo,
	} from '@/utils/util.js'
	import { useSettingStore } from '@/stores/settings'
	export default {
		data() {
			return {
				form: {
					username: '',
					password: '',
					captcha_id: '',
					captcha: '',
				},
				captcha: {
					enable: false
				},
				redirect: '',
				tab: 'sms',
			}
		},
		computed: {
			...mapGetters(useUserStore, ['token', 'user']),
			...mapGetters(useSettingStore, ['system'])
		},
		components: {
			mHeader,
			formLoginPassword,
			formLoginMobile,
		},
		onLoad(args) {
			if (debug) {
				console.log('onLoad', 'args', args, 'token', this.token, 'user', this.user)
			}
			this.redirect = '/pages/me/me'
			if (args.redirect) {
				try {
					this.redirect = decodeURIComponent(args.redirect)
				} catch (e) {
					console.log(e)
					//TODO handle the exception
				}
			}
			if (this.token || this.user.id !== 0) {
				// 用户已登录
				redirectTo(this.redirect)
				return
			}
			this.getUserCaptcha()
		},
		onShareAppMessage() {

		},
		onShareTimeline() {

		},
		methods: {
			...mapActions(useUserStore, ['loginByPassword']),
			changeTab(tab) {
				this.tab = tab
			},
			async getUserCaptcha() {
				const res = await getUserCaptcha({
					type: 'login'
				})
				if (debug) {
					console.log('getUserCaptcha', res)
				}
				if (res.statusCode === 200) {
					this.captcha = {
						enable: false,
						...res.data
					}
				}
			},
			success(){
				setTimeout(() => {
					redirectTo(this.redirect)
				}, 1000)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		padding: 20px;

		.logo {
			width: 80px;
			height: 80px;
			margin: 20px auto;
			border-radius: 50%;
			display: block;
			border: 2px solid #eee;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
				box-sizing: border-box;
			}
		}

		.item {
			display: flex;
			border-bottom: 1px solid #ddd;

			.label {
				width: 70px;
				height: 50px;
				line-height: 50px;
			}

			input {
				height: 50px;
				line-height: 50px;
				font-size: 14px;
				padding-right: 15px;
				box-sizing: border-box;
				border: 0;
				flex: 1;
			}
		}

		.more {
			color: #666;
			margin-top: 10px;
			text-align: right;

			navigator {
				// width: 100px;
				display: inline-block;
			}
		}

		button {
			margin-top: 20px;
		}
	}

	.tabs {
		border-bottom: 1px solid #ddd;
		line-height: 240%;
		margin-top: 10px;
		margin-bottom: 10px;

		.col-3 {
			text-align: center;
			margin-bottom: -1px;
			border: 1px solid transparent;
		
			&.active {
				border: 1px solid #ddd;
				border-bottom: 1px solid $uni-bg-color-grey;
				border-top-left-radius: 4px;
				border-top-right-radius: 4px;
			}
		}
	}
</style>