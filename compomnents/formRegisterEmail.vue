<template>
	<view>
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
			<view class="col-4">
				<input type="text" v-model="form.captcha" placeholder="请输入验证码">
			</view>
			<view class="col-5">
				<image :src="captcha.captcha" class="captcha" @click="getUserCaptcha"
					mode="heightFix"></image>
			</view>
			<!-- <view class="col-3 no-required"></view>
			<view class="col-4">
				<input type="text" v-model="form.captcha" placeholder="请输入验证码">
			</view> -->
		</view>
		<view class="row">
			<view class="col-3">电子邮箱</view>
			<view class="col-9">
				<input type="text" v-model="form.email" placeholder="请输入您的邮箱">
			</view>
		</view>
		<view class="row" v-if="security.enable_verify_register_email">
			<view class="col-3">邮箱验证码</view>
			<view class="col-5">
				<input type="text" v-model="form.code" placeholder="请输入邮箱验证码">
			</view>
			<view class="col-4" v-if="security.enable_verify_register_email">
				<button size="mini" class="btn-send-email-code" :disabled="leftSeconds>0" @click="sendEmailCode"
					type="default">
					<text v-if="leftSeconds>0">剩余{{leftSeconds}}秒</text>
					<text v-else>获取验证码</text>
				</button>
			</view>
		</view>
		<button type="warn" class="btn-block" @click="registerByEmail">
			<text v-if="isBind">注册并绑定</text>
			<text v-else>注册账号</text>
		</button>
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
		sendEmailCode,
	} from '@/api/user.js'
	import {
		toastError,
		toastSuccess,
		redirectTo,
		joinImage,
	} from '@/utils/util.js'
	export default {
		props:{
			isBind:{
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {
				form: {
					username: '',
					password: '',
					repeat_password: '',
					captcha_id: '',
					captcha: '',
					code: ''
				},
				leftSeconds: 0,
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
				if (req.password != req.repeat_password) {
					toastError('两次输入的密码不一致，请重新输入')
					return
				}

				delete req.repeat_password
				const res = await this.register(req)
				if (res.statusCode === 200) {
					if(!this.isBind){
						toastSuccess('注册成功')
					}
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
			async sendEmailCode() {
				const req = {
					captcha: this.form.captcha,
					captcha_id: this.captcha.id,
					email: this.form.email,
				}
				if(req.captcha=="" || req.email==""){
					toastError('请输入邮箱或上方验证码')
					return
				}
				
				const res = await sendEmailCode(req)
				if (res.statusCode === 200) {
					toastSuccess('验证码发送成功')
					this.leftSeconds = 60
					const timer = setInterval(() => {
						this.leftSeconds--
						if (this.leftSeconds <= 0) {
							clearInterval(timer)
						}
					}, 1000)
				} else {
					toastError(res.data.massage || '获取验证码失败')
				}
			}
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

	.captcha {
		margin: 0;
		height: 40px;
		margin-bottom: -15px;
	}

	button {
		margin-top: 20px;

		&.btn-send-email-code {
			margin-top: 0;
			position: relative;
			top: 10px;
		}
	}
</style>