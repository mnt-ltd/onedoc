<template>
	<view class="page-me">
		<iheader title="" :show-icon="false" />
		<view class="user" :style="titleBarHeight>0 && statusBarHeight>0 ? `top: ${titleBarHeight + statusBarHeight}px` : ''">
			<view>
				<view class="avatar">
					<image :src="user.avatar || '/static/images/avatar.png'"></image>
				</view>
				<view class="userinfo">
					<view class="username font-lv1 ellipsis-1row">{{user.username || '游客，请登录'}}</view>
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

		<view class="box">
			<view>
				<image src=""></image><text>我的动态</text>
				<image src="/static/images/next.png"></image>
			</view>
			<view>
				<image src=""></image><text>我的VIP</text>
				<image src="/static/images/next.png"></image>
			</view>
			<view>
				<image src=""></image><text>我的订单</text>
				<image src="/static/images/next.png"></image>
			</view>
		</view>
		<view class="box">
			<view>
				<image src="/static/images/document.png"></image><text>我的文档</text>
				<image src="/static/images/next.png"></image>
			</view>
			<view>
				<image src="/static/images/favorite.png"></image><text>我的收藏</text>
				<image src="/static/images/next.png"></image>
			</view>
			<view>
				<image src="/static/images/download.png"></image><text>我的下载</text>
				<image src="/static/images/next.png"></image>
			</view>
		</view>
		<view class="box">
			<view>
				<image src="/static/images/"></image>
				<text>个人资料</text>
				<image src="/static/images/next.png"></image>
			</view>
			<view>
				<image src="/static/images/"></image>
				<text>修改资料</text>
				<image src="/static/images/next.png"></image>
			</view>
			<view>
				<image src="/static/images/"></image>
				<text>修改密码</text>
				<image src="/static/images/next.png"></image>
			</view>
			<view>
				<image src="/static/images/login.png"></image><text>退出登录</text>
				<image src="/static/images/next.png"></image>
			</view>
		</view>
		<view class="box">
			<view>
				<image src="/static/images/about-us.png"></image><text>关于我们</text>
				<image src="/static/images/next.png"></image>
			</view>
		</view>
		<view>&nbsp;</view>
	</view>
</template>

<script>
	import iheader from '@/compomnents/header.vue'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		getSysInfo
	} from '@/utils/util.js'
	import {
		mapGetters,
		mapActions
	} from 'pinia'
	export default {
		data() {
			return {
				statusBarHeight: 0,
				titleBarHeight: 0,
			}
		},
		components: {
			iheader
		},
		computed: {
			...mapGetters(useUserStore, ['user'])
		},
		created(){
			const sysInfo = getSysInfo()
			this.statusBarHeight = sysInfo.statusBarHeight
			this.titleBarHeight=sysInfo.titleBarHeight
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.page-me{
		padding-top: 125px;
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

			image {
				width: 60px;
				height: 60px;
				border: 3px solid #fff;
				border-radius: 50%;
				box-sizing: border-box;
				padding: 5px;
			}
		}

		.username {
			font-size: 22px !important;
			font-weight: bold;
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

	.box {
		margin-top: 10px;
		background-color: #fff;
		padding: 0 0 0 15px;
		font-size: 15px;
		line-height: 50px;

		&>view {
			border-bottom: 1px solid $uni-bg-color-hover;

			image {
				width: 20px;
				height: 20px;
				vertical-align: middle;
				margin-right: 5px;
			}

			&:last-of-type {
				border-bottom: 0;
			}
		}
		&:last-of-type{
			margin-bottom: 0;
		}
	}
</style>