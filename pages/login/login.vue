<template>
	<view>
		<mHeader title="登录" />
		<view class="login">
			<view class="logo">
				<image src="/static/images/avatar.png"></image>
			</view>
			<view class="item">
				<view class="label">账号</view>
				<input v-model="form.username" type="text" placeholder="请输入您的用户名、邮箱或手机号码">
			</view>
			<view class="item">
				<view class="label">密码</view>
				<input v-model="form.password" type="password" placeholder="请输入您的登录密码">
			</view>
			<!-- TODO: 实现音视频验证码 -->
			<view class="item" v-if="captcha.enable">
				<view class="label">验证码</view>
				<input type="text" v-model="form.captcha" placeholder="请输入验证码">
				<image :src="captcha.captcha" @click="getUserCaptcha" style="height: 50px;width: 150px;"></image>
			</view>
			<view class="more">
				<navigator hover-class="none" class="font-lv3" url="/pages/register/register">注册账号</navigator>
				<navigator hover-class="none" class="font-lv3 findpwd" url="/pages/findpwd/findpwd">忘记密码？</navigator>
			</view>
			<button type="warn" class="btn-password-login btn-block" @click="login">密码登录</button>
			<button type="primary" class="btn-wechat-login btn-block" @click="loginByWechat">微信登录</button>
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
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
				redirect: ''
			}
		},
		computed: {
			...mapGetters(useUserStore, ['token', 'user'])
		},
		components: {
			mHeader
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
			async login() {
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
			async loginByWechat() {

			}
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
			justify-content: space-around;

			navigator {
				// width: 100px;
				display: inline-block;
			}

			.findpwd {
				float: right;
			}
		}

		button {
			margin-top: 20px;
		}
	}
</style>