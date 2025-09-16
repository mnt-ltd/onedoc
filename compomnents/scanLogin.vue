<template>
	<view class="com-scan-login">
		<view v-if="user.id>0">
			登录中...
		</view>
		<view v-else>
			<view class="tips">
				点击授权登录，即可登录网站
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
	} from '@/utils/util.js'
	import {
		mapActions,
		mapGetters,
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
				default: ''
			}
		},
		computed: {
			...mapGetters(useUserStore, ['user']),
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