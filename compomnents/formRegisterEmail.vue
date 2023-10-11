<template>
	<view>
		<view class="row">
			<view class="col-3">邮箱</view>
			<view class="col-9">
				<input type="text" v-model="form.email" placeholder="请输入您的邮箱">
			</view>
		</view>
		<view class="row">
			<view class="col-3">用户名</view>
			<view class="col-9">
				<input type="text" v-model="form.username" placeholder="请输入用户名">
			</view>
		</view>
		<view class="row">
			<view class="col-3">登录密码</view>
			<view class="col-9">
				<input type="text" password v-model="form.password" placeholder="请输入您的登录密码">
			</view>
		</view>
		<view class="row">
			<view class="col-3">确认密码</view>
			<view class="col-9">
				<input type="text" password v-model="form.repeat_password" placeholder="请再次输入您的登录密码">
			</view>
		</view>
		<view class="row" v-if="captcha.enable">
			<view class="col-3">
				验证码
			</view>
			<view class="col-9">
				<image :src="captcha.captcha" class="captcha" @click="getUserCaptcha" style="height: 35px;" mode="heightFix"></image>
			</view>
			<view class="col-3 no-required"></view>
			<view class="col-9">
				<input type="text" v-model="form.captcha" placeholder="请输入验证码">
			</view>
		</view>
		<button type="warn" class="btn-block" @click="registerByEmail">注册账号</button>
	</view>
</template>


<script>
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
					repeat_password: '',
					captcha_id: '',
					captcha: '',
				},
				captcha: {
					enable: false
				},
			}
		},
		computed: {
			...mapGetters(useUserStore, ['token', 'user']),
			...mapGetters(useSettingStore, ['system', 'security']),
		},
		created() {
			this.getUserCaptcha()
		},
		methods: {
			...mapActions(useUserStore, ['register']),
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
			async registerByEmail() {
				const req = {
					...this.form,
					captcha_id: this.captcha.id
				}
				if(req.password!=req.repeat_password){
					toastError('两次输入的密码不一致，请重新输入')
					return
				}
				
				delete req.repeat_password
				const res = await this.register(req)
				if (res.statusCode === 200) {
					toastSuccess('注册成功')
					this.$emit('success', res)
				} else {
					toastError(res.data.message || '登录失败' + res.errMsg)
				}
			},
			async getUserCaptcha() {
				const res = await getUserCaptcha({
					type: 'register'
				})
				if (res.statusCode === 200) {
					this.captcha = {
						enable: false,
						...res.data
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.row {
		line-height: 50px;
		font-size: 14px;
		border-bottom: 1px solid #ddd;

		input {
			height: 50px;
			padding: 0 10px;
			line-height: 50px;
			box-sizing: border-box;
		}

		.col-3 {
			color: #666;

			&::before {
				content: "*";
				color: red;
			}

			&.no-required::before {
				display: none;
			}
		}
	}
	.captcha{
		margin-top: 10px;
		margin-bottom: -20px;
	}
	button{
		margin-top: 20px;
	}
</style>