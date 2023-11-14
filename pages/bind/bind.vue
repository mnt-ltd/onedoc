<template>
	<view class="page-bind" v-if="args.openid">
		<mHeader title="账号绑定"></mHeader>
		<view class="box">
			<template v-if="existAccount">
				<template v-if="system.enable_sms">
					<view class="row tabs">
						<view class="col-5" :class="tab==='sms' ? 'active': ''" @click="changeTab('sms')">
							短信登录并绑定
						</view>
						<view class="col-5" :class="tab==='password' ? 'active': ''" @click="changeTab('password')">
							密码登录并绑定
						</view>
					</view>
					<formLoginPassword :isBind="true" v-if="tab==='password'" @success="bind" />
					<formLoginMobile :isBind="true" v-if="tab==='sms'" @success="bind" />
				</template>
				<formLoginPassword :isBind="true" v-else @success="bind" />
			</template>
			<template v-else>
				<template v-if="system.enable_sms">
					<view class="row tabs">
						<view class="col-5" :class="tab==='sms' ? 'active': ''" @click="changeTab('sms')">
							手机注册并绑定
						</view>
						<view class="col-5" :class="tab==='password' ? 'active': ''" @click="changeTab('password')">
							邮箱注册并绑定
						</view>
					</view>
					<formRegisterEmail :isBind="true" v-if="tab==='password'" @success="bind" />
					<formRegisterMobile :isBind="true" v-if="tab==='sms'" @success="bind" />
				</template>
				<formRegisterEmail :isBind="true" v-else @success="bind" />
			</template>
			<view class="text-center" v-if="existAccount">没有帐号？<text @click="switchBind">注册一个</text>
			</view>
			<view class="text-center" v-else>已有帐号？<text @click="switchBind">点此绑定</text></view>
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import wechatLogin from '@/compomnents/wechatLogin.vue'
	import formLoginPassword from '@/compomnents/formLoginPassword.vue'
	import formLoginMobile from '@/compomnents/formLoginMobile.vue'
	import formRegisterEmail from '@/compomnents/formRegisterEmail.vue'
	import formRegisterMobile from '@/compomnents/formRegisterMobile.vue'
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
		bindOauth,
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
		components: {
			mHeader,
			formLoginPassword,
			formLoginMobile,
			formRegisterEmail,
			formRegisterMobile,
		},
		props: {
			oauth: {
				type: Object,
				default: () => {
					return {
						id: 0,
						oauth_type: 0,
						openid: '',
						session: '',
					}
				}
			},
		},
		data() {
			return {
				args: {},
				existAccount: true,
				tab: 'sms',
				timeouter: null,
			}
		},
		computed: {
			...mapGetters(useSettingStore, ['system'])
		},
		onLoad(args) {
			// args 传 session、oauth_type、openid 过来
			console.log('bind', args)
			if(!args.openid){
				uni.navigateBack()
				return
			}
			this.args = args
		},
		onUnload() {
			clearTimeout(this.timeouter)
		},
		methods: {
			switchBind() {
				this.existAccount = !this.existAccount
			},
			async bind() {
				const res = await bindOauth({
					openid: this.args.openid,
					oauth_type: parseInt(this.args.oauth_type),
					session: this.args.session,
				})
				if (res.statusCode === 200) {
					toastSuccess('绑定成功')
					setTimeout(() => {
						redirectTo(this.args.redirect || '/pages/me/me')
					}, 1000);
					this.timeouter = setTimeout(() => {
						uni.switchTab({
							url: '/pages/me/me'
						})
					}, 2000)

				} else {
					toastError(res.data.message || '绑定失败')
				}
			},
			changeTab(tab) {
				this.tab = tab
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		padding: 10px;

		.tabs {
			border-bottom: 1px solid #ddd;
			line-height: 240%;
			margin-top: 10px;
			margin-bottom: 10px;

			.col-5 {
				text-align: center;
				margin-bottom: -1px;
				border: 1px solid transparent;
				color: $uni-color-subtitle;
				font-size: 14px;

				&.active {
					border: 1px solid #ddd;
					border-bottom: 1px solid $uni-bg-color-grey;
					border-top-left-radius: 4px;
					border-top-right-radius: 4px;
				}
			}
		}

		.text-center {
			margin-top: 20px;
			font-size: 15px;

			text {
				color: $uni-color-primary;
			}
		}
	}
</style>