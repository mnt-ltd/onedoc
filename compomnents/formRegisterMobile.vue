<template>
	<view>
		<view class="row">
			<view class="col-12 item-title">手机号码</view>
			<view class="col-12">
				<input type="text" v-model="form.mobile" placeholder="请输入您的手机号码">
			</view>
		</view>
		<view class="row" v-if="captcha.enable">
			<view class="col-12  item-title">
				验证码
			</view>
			<view class="col-6">
				<input type="text" v-model="form.captcha" placeholder="请输入右侧验证码">
			</view>
			<view class="col-6">
				<image :src="captcha.captcha" class="captcha" @click="getUserCaptcha" mode="heightFix"></image>
			</view>
		</view>
		<view class="row">
			<view class="col-12 item-title">短信验证码</view>
			<view class="col-6">
				<input type="text" v-model="form.code" placeholder="请输入短信验证码">
			</view>
			<view class="col-6">
				<button size="mini" class="send-sms" @click="sendSMS" :loading="sendSMSLoading">
					<text v-if="leftSeconds > 0">{{ leftSeconds }} 秒</text>
					<text v-else>获取短信验证码</text>
				</button>
			</view>
		</view>
		<view class="row" v-if="customPassword">
			<view class="col-12 item-title">登录密码</view>
			<view class="col-12">
				<input type="text" v-model="form.password" placeholder="请输入登录密码">
			</view>
		</view>
		<view class="tips">
			<text>初始密码默认为您当前注册的短信验证码，您可在个人中心进行修改，或直接</text>
			<checkbox-group @change="changeCustomPassword">
				<label>
					<checkbox value="custom_password" :checked="customPassword" /><text>设置密码</text>
				</label>
			</checkbox-group>
		</view>
		<button type="warn" class="btn-block" @click="register" :loading="loading">
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
		sendSMS,
	} from '@/api/sms.js'
	import {
		getUserCaptcha,
	} from '@/api/user.js'
	import {
		toastError,
		toastSuccess,
		redirectTo,
		joinImage,
		isValidMobile,
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
					mobile: '',
					password: '',
					code: '',
					captcha_id: '',
					captcha: '',
				},
				captcha: {
					enable: false,
					captcha_id: '',
				},
				customPassword: false,
				leftSeconds: 0,
				sendSMSLoading: false,
				loading: false,
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
			...mapActions(useUserStore, ['registerByMobile']),
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
			changeCustomPassword(e) {
				this.customPassword = e.detail.value.length > 0
			},
			async register() {
				this.loading = true
				if (!this.customPassword) this.form.password = ''
				const res = await this.registerByMobile({
					code: this.form.code,
					mobile: this.form.mobile,
					password: this.form.password,
				})
				if (res.statusCode === 200) {
					if(!this.isBind){
						toastSuccess('注册成功')
					}
					this.$emit('success', res)
				} else {
					toastError(res.data.message || '注册失败')
				}
				this.loading = false
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
			async sendSMS() {
				if (this.leftSeconds > 0 || this.sendSMSLoading) {
					return
				}

				// 验证手机号码格式是否正确
				if (!isValidMobile(this.form.mobile)) {
					toastError('请输入正确的手机号码')
					return
				}

				if (this.captcha.enable && !this.form.captcha) {
					toastError('请输入上述图片或音频验证码')
					return
				}

				// 发送短信验证码
				const res = await sendSMS({
					mobile: this.form.mobile,
					captcha_id: this.captcha.id,
					captcha: this.form.captcha,
					type: 0, // 发送短信验证码
				})

				if (res.statusCode !== 200) {
					this.getUserCaptcha()
					toastError(res.data.message || '短信验证码发送失败')
					return
				}

				this.leftSeconds = 60
				setInterval(() => {
					this.leftSeconds--
				}, 1000)
				toastSuccess('短信验证码已发送，请注意查收')
			},
		}
	}
</script>

<style lang="scss" scoped>
	.row {
		margin-bottom: 20px;
		font-size: 14px;
		line-height: 35px;

		input {
			height: 35px;
			padding: 0 10px;
			box-sizing: border-box;
			border: 1px solid #ddd;
			border-radius: 4px;
		}

		.item-title {
			color: #666;

			&::before {
				content: "*";
				color: red;
			}

			&.no-required::before {
				display: none;
			}
		}

		.send-sms {
			height: 35px;
			line-height: 35px;
			margin-left: 20px;
			margin-bottom: -10px;
		}
	}

	.tips {
		border: 1px dashed #f60;
		border-radius: 5px;
		padding: 10px;
		font-size: 14px;
		line-height: 180%;
		color: #666;
		margin-bottom: 20px;

		label {
			color: $uni-color-primary;
			margin-left: 10px;
			display: inline-block;
		}
	}

	checkbox-group {
		display: inline-block;
	}

	.captcha {
		height: 35px;
		margin-left: 20px;
		margin-bottom: -10px;
	}
</style>