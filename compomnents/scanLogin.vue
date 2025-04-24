<template>
	<view class="com-scan-login">
		<view class="tips">
			点击授权登录，即可登录网站
		</view>
		<button type="primary" :loading="loading" open-type="getUserInfo" @getuserinfo="login">授权登录</button>
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
				// default: ''
				default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDU1MTQ5MDgsImp0aSI6ImQwM2I1NWZiZmVmNWIxMjEifQ.nKlKMUb9XLWcdwxOdkdHH1KG3XEclJJtIaxFEMuR6rU'
			}
		},
		methods: {
			...mapActions(useUserStore, ['loginWechatmpScan']),
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
						console.log(res, e,payload)
						_this.loading = true
						const resp = await _this.loginWechatmpScan(payload)
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