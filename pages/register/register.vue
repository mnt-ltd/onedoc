<template>
	<view>
		<mHeader title="注册" />
		<view class="register">
			<view class="row tabs" v-if="system.enable_sms">
				<view class="col-3" :class="registerType==='email' ? 'active': ''" @click="changeRegisterType('email')">
					邮箱注册
				</view>
				<view class="col-3" :class="registerType==='mobile' ? 'active': ''" @click="changeRegisterType('mobile')">
					手机注册
				</view>
			</view>
			<formRegisterEmail v-if="registerType==='email'" @success="registerSuccess"/>
			<navigator hover-class="none" class="font-lv3" url="/pages/login/login">
				<button type="default" class="btn-wechat-login btn-block">登录已有账号</button>
			</navigator>
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import formRegisterEmail from '@/compomnents/formRegisterEmail.vue'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		useSettingStore
	} from '@/stores/settings.js'
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
		joinImage,
	} from '@/utils/util.js'
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
				registerType: 'email',
				redirect: ''
			}
		},
		computed: {
			...mapGetters(useUserStore, ['token', 'user']),
			...mapGetters(useSettingStore, ['system']),
		},
		components: {
			mHeader,
			formRegisterEmail,
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
			changeRegisterType(typ){
				this.registerType=typ
			},
			// 注册成功，直接跳转
			registerSuccess(){
				try{
					redirectTo(this.redirect)
				}catch(e){
					//TODO handle the exception
					uni.switchTab({
						url: this.redirect,
					})
				}
			},
			async register() {
				const req = {
					...this.form,
					captcha_id: this.captcha.id
				}
				const res = await this.loginByPassword(req)
				if (debug) {
					console.log('loginByPassword', 'form', this.form, 'req', req, 'res', res, 'redirect', this
						.redirect)
				}
				if (res.statusCode === 200) {
					toastSuccess('登录成功')
					setTimeout(() => {
						redirectTo(this.redirect)
					}, 2000)
				} else {
					toastError(res.data.message || '登录失败' + res.errMsg)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.tabs{
		border-bottom: 1px solid #ddd;
		line-height: 240%;
		.col-3{
			text-align: center;
			margin-bottom: -1px;
			border: 1px solid transparent;
			&.active{
				border: 1px solid #ddd;
				border-bottom: 1px solid $uni-bg-color-grey;
				border-top-left-radius: 4px;
				border-top-right-radius: 4px;
			}
		}
	}
	.register {
		padding: 20px;

		.logo {
			height: 80px;
			margin: 20px auto;
			display: block;
			border: 2px solid #eee;
			overflow: hidden;
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
</style>