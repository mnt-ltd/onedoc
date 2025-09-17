<template>
	<view class="com-scan-login">
		<view class="info">
			<!-- <view class="title">
				欢迎来到 <text>{{system.sitename}}</text>
			</view>
			<view class="font-lv2">{{ system.description }}</view> -->
			<view>
				<image :src="user.avatar || '/static/images/avatar.png'"></image>
			</view>
			<view>{{ user.nickname || user.username || '游客' }}</view>
		</view>
		<view>
			<view class="tips" v-if="isBindScene">
				一键授权绑定 <text>{{ system.sitename }}</text> 网页端已登录用户
			</view>
			<view class="tips" v-else>
				一键授权登录 <text>{{ system.sitename }}</text> 网页版
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
			isBindScene(){
				// 判断是否是绑定登录场景
				return this.scene && this.scene.endsWith('.1')
			}
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
		padding: 60px 40px 80px;
		// min-height: calc(100vh - 40px);
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: #f7f8f9;
		
		.info {
			margin-bottom: 60px;
			
			.title {
				font-size: 24px;
				font-weight: 500;
				margin-bottom: 10px;
				line-height: 1.4;
				color: #888888;
				
				text {
					color: #191f25;
					font-weight: 600;
				}
			}
			
			image {
				width: 80px;
				height: 80px;
				border-radius: 50%;
				margin: 30px 0 0;
				border: 1px solid #e7e7e7;
			}
			
			> view:last-child {
				font-size: 16px;
				color: #576b95;
				font-weight: 400;
				margin-top: 15px;
			}
		}
		
		.tips {
			margin-bottom: 30px;
			font-size: 15px;
			color: #888888;
			line-height: 1.5;
			
			text {
				color: #07c160;
				font-weight: 500;
			}
		}
		
		button[type="primary"] {
			background-color: #07c160;
			border: none;
			border-radius: 6px;
			padding: 4px 50px;
			font-size: 17px;
			font-weight: 500;
			color: #ffffff;
			box-shadow: none;
			transition: all 0.2s ease;
			position: relative;
			
			&:active {
				background-color: #06ad56;
				transform: scale(0.98);
			}
			
			&[loading] {
				background-color: #c0c4cc;
				color: #ffffff;
			}
			
			&[disabled] {
				background-color: #c0c4cc;
				color: #ffffff;
			}
		}
	}
</style>