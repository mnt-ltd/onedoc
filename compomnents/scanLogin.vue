<template>
	<view class="com-scan-login">
		<view class="info">
			<view class="title">
				欢迎来到 <text>{{system.sitename}}</text>
			</view>
			<view>
				<image v-if="user.id>0" :src="user.avatar || '/static/images/avatar.png'" class="logo" mode="heightFix"></image>
				<image v-else :src="mpLogo || logo" class="logo" mode="heightFix"></image>
			</view>
			<view>{{ user.nickname || system.sitename }}</view>
		</view>
		<view>
			<view class="tips">
				使用当前账号登录 <text>{{ system.sitename }}</text> 网页版
			</view>
			<button type="primary" :loading="loading" open-type="getUserInfo" @getuserinfo="login">授权登录</button>
		</view>
	</view>
</template>

<script>
	import {
		redirectTo,
		toastError,
		toastSuccess,
		joinImage,
	} from '@/utils/util.js'
	import {
		mapActions,
		mapGetters,
	} from 'pinia'
	import {
		useUserStore
	} from '@/stores/user'
	import {
		useSettingStore
	} from '@/stores/settings'
	export default {
		name: 'scanLogin',
		data() {
			return {
				loading: false,
			}
		},
		props: {
			redirect: {
				type: String,
				default: '/pages/me/me', // 默认用户个人主页
			},
			scene: {
				type: String,
				default: ''
			}
		},
		computed: {
			...mapGetters(useUserStore, ['user']),
			...mapGetters(useSettingStore,['system']),
			logo(){
				return this.system.logo ? joinImage(this.system.logo) : '/static/images/logo-transparent.png'
			},
			mpLogo(){
				return this.system.mp_logo ? joinImage(this.system.mp_logo) : ''
			},
		},
		methods: {
			...mapActions(useUserStore, ['loginByWechatMini']),
			login(e) {
				let _this = this
				uni.login({
					async success(res){
						const payload = {
							code: res.code,
							iv: e.detail.iv,
							encrypted_data: e.detail.encryptedData,
							scene: _this.scene,
						}
						_this.loading = true
						const resp = await _this.loginByWechatMini(payload)
						_this.loading = false
						if (resp.statusCode === 200) {
							if (resp.data.token) {
								toastSuccess('授权登录成功')
								redirectTo(_this.redirect)
								return
							}
							// 跳转到绑定页面
							uni.navigateTo({
								url: `/pages/bind/bind?oauth_type=${resp.data.oauth.oauth_type}&openid=${resp.data.oauth.openid}&session=${resp.data.oauth.session}&redirect=${_this.redirect}`,
							})
							return
						} else {
							toastError(resp.data.message || '登录失败')
						}
						console.log(resp)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-scan-login {
		margin-top: 20px;
		text-align: center;
		padding:100px 50px;
		.tips{
			margin-bottom: 20px;
		}
	}
</style>