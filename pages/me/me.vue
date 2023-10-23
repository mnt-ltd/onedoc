<template>
	<view class="page-me">
		<mHeader title="" :show-icon="false" />
		<view class="user"
			:style="titleBarHeight>0 && statusBarHeight>0 ? `top: ${titleBarHeight + statusBarHeight}px` : ''">
			<view @click="login">
				<view class="avatar" :class="user.is_vip ? 'vip-icon': ''">
					<image :src="joinImage(user.avatar) || '/static/images/avatar.png'"></image>
				</view>
				<view class="userinfo">
					<view class="username font-lv1 ellipsis-1row">
						<view>{{user.username || '游客，请登录'}}</view>
						<button v-if="user.id>0" size="mini" :class="sign.id>0 ? 'signed': ''" :disabled="sign.id>0"
							@click="signToday">
							<image v-if="sign.id>0" src="/static/images/signed.png"></image>
							<image v-else src="/static/images/sign.png"></image>
							<text v-if="sign.id>0">已签到</text>
							<text v-else>签到</text>
						</button>
					</view>
					<view class="signature font-lv3 ellipsis-1row">{{user.signature || '暂无个性签名...'}}</view>
				</view>
			</view>
			<view class="stat font-lv2">
				<view>
					<text>{{user.credit_count || 0}}</text>
					<view class="font-lv5">积分</view>
				</view>
				<view>
					<text>{{user.doc_count || 0}}</text>
					<view class="font-lv5">文档</view>
				</view>
				<view>
					<text>{{user.favorite_count || 0}}</text>
					<view class="font-lv5">收藏</view>
				</view>
			</view>
		</view>
		<view class="myvip" v-if="vip.enable">
			<view class="card" @click="go2vip">
				<view class="card-header">
					<template v-if="user.is_vip">
						<view>我的VIP权益</view>
					</template>
					<template v-else>
						<view>加入VIP会员</view>
					</template>
				</view>
				<view class="card-body">
					<view class="row">
						<template v-if="user.is_vip && activeVIP.id>0">
							<view class="col">
								<view>{{((activeVIP.discount ||0)/10).toFixed(1)}} 折</view>
								<text>文档折扣</text>
							</view>
							<view class="col">
								<view>{{activeVIP.times || '不限'}} 次/天</view>
								<text>下载频次</text>
							</view>
							<view class="col">
								<view>{{activeVIP.download || '不限'}}</view>
								<text>专享免费下载</text>
							</view>
						</template>
						<template v-else>
							<view class="col-6">
								<image src="/static/images/icon/vip-rights-download.png"></image>
								<view>
									<view>VIP文档</view>
									<text>专享免费下载</text>
								</view>
							</view>
							<view class="col-6">
								<image src="/static/images/icon/vip-rights-identify.png"></image>
								<view>
									<view>身份标识</view>
									<text>彰显尊贵特权</text>
								</view>
							</view>
							<view class="col-6">
								<image src="/static/images/icon/vip-rights-discount.png"></image>
								<view>
									<view>专享折扣</view>
									<text>非VIP文档优惠下</text>
								</view>
							</view>
							<view class="col-6">
								<image src="/static/images/icon/vip-rights-ad.png"></image>
								<view>
									<view>
										去广告
									</view>
									<text>清爽体验无干扰</text>
								</view>
							</view>
						</template>
					</view>
				</view>
			</view>
		</view>
		
		<view class="functions">
			<view class="box row">
				<navigator class="col-4" hover-class="none" :url="!user.id ? loginPage : '/pages/mydynamic/mydynamic'">
					<image src="/static/images/icon/dynamic.png"></image><text>我的动态</text>
				</navigator>
				<navigator  class="col-4" hover-class="none" :url="!user.id ? loginPage : '/pages/myorder/myorder'">
					<image src="/static/images/icon/order.png"></image><text>我的订单</text>
				</navigator>
				<navigator  class="col-4" hover-class="none" :url="!user.id ? loginPage : '/pages/bought/bought'">
					<image src="/static/images/icon/bought.png"></image><text>已购文档</text>
				</navigator>
				<navigator  class="col-4" hover-class="none" :url="!user.id ? loginPage : '/pages/mydoc/mydoc'">
					<image src="/static/images/icon/document.png"></image><text>我的上传</text>
				</navigator>
				<navigator  class="col-4" hover-class="none" :url="!user.id ? loginPage : '/pages/myfavorite/myfavorite'">
					<image src="/static/images/icon/favorite.png"></image><text>我的收藏</text>
				</navigator>
				<navigator  class="col-4" hover-class="none" :url="!user.id ? loginPage : '/pages/mydownload/mydownload'">
					<image src="/static/images/icon/download.png"></image><text>我的下载</text>
				</navigator>
				<navigator  class="col-4" hover-class="none" :url="!user.id ? loginPage : '/pages/myprofile/myprofile'">
					<image src="/static/images/user.png"></image>
					<text>个人资料</text>
				</navigator>
				<navigator  class="col-4" hover-class="none" :url="!user.id ? loginPage : '/pages/editprofile/editprofile'">
					<image src="/static/images/icon/setting.png"></image>
					<text>修改资料</text>
				</navigator>
				<navigator  class="col-4" hover-class="none" :url="!user.id ? loginPage : '/pages/editpassword/editpassword'">
					<image src="/static/images/icon/password.png"></image>
					<text>修改密码</text>
				</navigator>
				<navigator  class="col-4"  hover-class="none" url="/pages/article/article?identifier=agreement">
					<image src="/static/images/icon/agreement.png"></image><text>文库协议</text>
				</navigator>
				<navigator  class="col-4"  hover-class="none" url="/pages/article/article?identifier=about">
					<image src="/static/images/icon/info.png"></image><text>关于我们</text>
				</navigator>
				<view  class="col-4" @click="execLogout" v-if="user.id">
					<image src="/static/images/icon/logout.png"></image><text>退出登录</text>
				</view>
			</view>
		</view>
		<!-- <view class="logout" v-if="user.id">
			<view class="row">
				<view  class="col-12"  @click="execLogout">
					<text>退出登录</text>
					<image src="/static/images/icon/logout.png"></image>
				</view>
			</view>
		</view> -->
		<view>&nbsp;</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import {
		getSysInfo,
		toastSuccess,
		toastError,
		joinImage,
	} from '@/utils/util.js'
	import {
		signToday,
		getSignedToday,
		getActiveUserVIP,
	} from '@/api/user.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		mapGetters,
		mapActions
	} from 'pinia'
	export default {
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
				loginPage: '/pages/login/login',
				sign: {
					id: 0
				},
				activeVIP: {},
			}
		},
		components: {
			mHeader
		},
		computed: {
			...mapGetters(useUserStore, ['user']),
			...mapGetters(useSettingStore, ['system','vip'])
		},
		// created() {
		// 	this.loadData()
		// },
		onShow() {
			// 每次显示时，都要重新加载用户VIP数据和签到数据
			this.loadData()
		},
		onLoad() {
			console.log('用户信息', this.user)
			const sysInfo = getSysInfo()
			this.statusBarHeight = sysInfo.statusBarHeight
			this.titleBarHeight = sysInfo.titleBarHeight
		},
		methods: {
			...mapActions(useUserStore, ['logout', 'getUser']),
			joinImage,
			login() {
				if (this.user.id) {
					return
				}
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			loadData(){
				Promise.all([
					this.getSignedToday(),
					this.getActiveUserVIP()
				])
			},
			async execLogout() {
				const res = await this.logout()
				if (res.statusCode === 200) {
					toastSuccess('退出登录成功')
				} else {
					console.log(res)
					toastError(res.data.message || '退出登录失败')
				}
			},
			async getSignedToday() {
				if (!this.user.id) {
					return
				}

				const res = await getSignedToday()
				console.log('getSignedToday', res)
				if (res.statusCode === 200) {
					this.sign = res.data || {
						id: 0
					}
				} else {
					this.sign = {
						id: 0
					}
				}
			},
			async signToday() {
				console.log('signToday', this.user, this.sign)
				if (!this.user.id || this.sign.id > 0) {
					return
				}

				const res = await signToday()
				if (res.statusCode === 200) {
					const sign = res.data || {
						id: 1
					}
					this.sign = sign
					this.getUser()
					toastSuccess(`签到成功`)
					//toastSuccess(`签到成功，获得 ${sign.award || 0} ${
					//		this.system.credit_name || '魔豆'
					//}奖励`)
				} else {
					toastError(res.message || res.data.message)
				}
			},
			async getActiveUserVIP() {
				const res = await getActiveUserVIP()
				if (res.statusCode === 200) {
					this.activeVIP = res.data || {}
				}
			},
			go2vip() {
				if (this.user.is_vip) {
					uni.navigateTo({
						url: '/pages/myvip/myvip'
					})
				} else {
					uni.navigateTo({
						url: '/pages/vip/vip'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-me {
		padding-top: 130px;
	}

	.user {
		background-color: $uni-color-success;
		color: #fff;
		padding: 0 20px 20px;
		position: fixed;
		top: 64px;
		width: 100%;
		z-index: 99;

		&>view {
			display: flex;
		}

		.avatar {
			width: 80px;
			height: 60px;
			position: relative;
			&.vip-icon::after{
				content: ' ';
				display: inline-block;
				width: 16px;
				height: 16px;
				box-sizing: border-box;
				position: absolute;
				bottom: 0;
				left: 40px;
				border-radius: 50%;
				background-color: #fff;
				background: url(/static/images/icon-vip.png) no-repeat center center;
				background-size: cover;
			}
			image {
				width: 60px;
				height: 60px;
				border-radius: 50%;
				box-sizing: border-box;
				border: 2px solid #fff;
			}
		}

		.username {
			font-size: 22px !important;
			font-weight: bold;
			display: flex;
			justify-content: space-between;

			button {
				width: 95px;
				border: 0;
				font-weight: normal;
				font-size: 13px;
				display: flex;
				align-items: center;

				&.signed {
					color: #ccc;
				}

				image {
					width: 15px;
					height: 15px;
					margin-right: 5px;
				}
			}
		}

		.signature {
			color: $uni-bg-color-grey;
			margin-top: 5px;
		}

		.stat {
			display: flex;
			text-align: center;
			margin-top: 10px;

			&>view {
				flex: 1;

				&:nth-of-type(2) {
					border-left: 1px solid #ccc;
					border-right: 1px solid #ccc;
				}
			}
		}

		.userinfo {
			flex: 1;
		}
	}

	.functions{
		padding: 10px;
		.row{
			box-shadow: 0 2px 10px 0 #efefef;
			background-color: #fff;
			border-radius: 5px;
			overflow: hidden;
			.col-4{
				padding: 5px 0;
				image{
					display: block;
				}
			}
		}
	}

	.box {
		background-color: #fff;
		font-size: 14px;
		line-height: 40px;
		color: $uni-color-subtitle;

		&>view,
		&>navigator {
			border-bottom: 1px solid $uni-bg-color-hover;
			border-right: 1px solid $uni-bg-color-hover;
			box-sizing: border-box;
			display: block;
			text-align: center;
			image {
				width: 35px;
				height: 35px;
				vertical-align: middle;
				line-height: 50px;
				margin: 0 auto;
				margin-top: 15px;
			}
		}
	}

	.myvip {
		padding: 10px;
		margin-top: 7px;

		.card {
			border-radius: 5px;
			overflow: hidden;
			box-shadow: 0 2px 10px 0 #efefef;
			.card-header {
				padding: 10px;
				background-color: #f7a46d;
				color: #fff;
			}

			.card-body {
				padding: 10px;
				padding-bottom: 0;
				background-color: #fff;
				
				.col{
					text-align: center;
					margin-bottom: 10px;
					color: #f60;
					&:nth-of-type(2){
						border-left: 1px solid #f1f2f3;
						border-right: 1px solid #f1f2f3;
					}
				}

				.col-6 {
					display: flex;
					margin-bottom: 10px;
					padding: 5px 0;

					image {
						width: 36px;
						height: 36px;
						border-radius: 50%;
					}

					view {
						flex: 1;
						padding-left: 3px;
						font-size: 15px;
					}
				}

				text {
					font-size: 11px;
					color: #999;
				}
			}
		}
	}
	.logout{
		padding: 10px;
		font-size: 15px;
		.row{
			background-color: #fff;
			padding: 10px;
			border-radius: 5px;
			overflow: hidden;
			box-shadow: 0 2px 10px 0 #efefef;
			color: #666;
			image{
				height: 20px;
				width: 20px;
				vertical-align: middle;
				float: right;
			}
		}
	}
	
</style>