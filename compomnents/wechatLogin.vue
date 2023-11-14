<template>
	<view class="com-wechat-login">
		<button type="primary" :loading="loading" open-type="getUserInfo" @getuserinfo="login">微信登录</button>
	</view>
</template>

<script>
	import {
		redirectTo,
		toastError,
		toastSuccess,
	} from '@/utils/util.js'
	import {
		mapActions
	} from 'pinia'
	import {
		useUserStore
	} from '@/stores/user'
	export default {
		name: 'wechatLogin',
		data() {
			return {
				loading: false,
			}
		},
		props: {
			redirect: {
				type: String,
				default: '/pages/me/me', // 默认用户个人主页
			}
		},
		methods: {
			...mapActions(useUserStore, ['loginByWechatMini']),
			login(e) {
				let _this = this
				uni.login({
					async success(res){
						console.log(res, e)
						_this.loading = true
						const resp = await _this.loginByWechatMini({
							code: res.code,
							iv: e.detail.iv,
							encrypted_data: e.detail.encryptedData
						})
						_this.loading = false
						if (resp.statusCode === 200) {
							if (resp.data.token) {
								toastSuccess('登录成功')
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
	.com-wechat-login {
		margin-top: 20px;
	}
</style>