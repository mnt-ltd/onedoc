<template>
	<view>
		<view class="item">
			<view class="label">账号</view>
			<input v-model="form.username" type="text" placeholder="请输入您的用户名、邮箱或手机号码">
		</view>
		<view class="item">
			<view class="label">密码</view>
			<input v-model="form.password" type="password" placeholder="请输入您的登录密码">
		</view>
		<view class="item" v-if="captcha.enable">
			<view class="label">验证码</view>
			<input type="text" v-model="form.captcha" placeholder="请输入验证码">
			<image :src="captcha.captcha" @click="getUserCaptcha" style="height: 50px;width: 150px;"></image>
		</view>
		<button type="warn" class="btn-password-login btn-block" @click="login">
			<text v-if="isBind">登录并绑定</text>
			<text v-else>登录账号</text>
		</button>
	</view>
</template>

<script>
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
		props:{
			isBind: {
				type: Boolean,
				default: false,
			}
		},
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
				tab: 'password',
			}
		},
		computed: {
			...mapGetters(useUserStore, ['token', 'user'])
		},
		created() {
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
					if(!this.isBind){
						toastSuccess('登录成功')
					}
					this.$emit('success', res)
				} else {
					toastError(res.data.message || '登录失败' + res.errMsg)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
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

	button {
		margin-top: 20px;
	}
</style>