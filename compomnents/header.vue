<template>
	<view :style="customBarStyle">
		<view :class="['header', showBorder ? 'header-border' : '' ]" :style="customBarStyle">
			<view class="row">
				<view class="col-3">
					<view v-if="showIcon" class="header-icon icon-left">
						<block v-if="currentPagesLength>1">
							<view class="back" @click="headerBack" :style="iconPadding">
								<image src="/static/images/back-white.png"></image>
							</view>
							<view class="line" :style="lineMargin"></view>
						</block>
						<view class="home" @click="headerHome" :style="iconPadding">
							<image src="/static/images/home-white.png"></image>
						</view>
					</view>
				</view>
				<view class="col-6">
					<view class="header-title">{{title}}</view>
				</view>
				<view class="col-3">
					<view class="header-icon icon-right">
						<!-- #ifdef APP-PLUS -->
						<!-- <view v-if="showShare" :style="iconPadding" @click="share">
							<image src="/static/images/share.png"></image>
						</view>
						<view v-if="showSearch" @click="headerSearch" :style="iconPadding" class="search">
							<image src="/static/images/search-black.png"></image>
						</view>
						<view v-if="showSign" class="sign" :style="iconPadding">
							<image src="/static/images/sign.png"></image>
						</view> -->
						<!-- #endif -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	import config from '@/config.js'
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		mapGetters
	} from 'pinia'
	export default {
		data() {
			return {
				currentPagesLength: 0,
				customBarStyle: '',
				iconPadding: 'padding-top:16px;padding-bottom:16px',
				lineMargin: 'margin-top: 16px;',
				titleBarHeight: 44,
			};
		},
		props: {
			title: {
				type: String,
				default: 'loading...'
			},
			showIcon: {
				type: Boolean,
				default: true,
			},
			showBorder: {
				type: Boolean,
				default: false,
			},
			showSearch: {
				type: Boolean,
				default: false,
			},
			showSign: {
				type: Boolean,
				default: false,
			},
			showRank: {
				type: Boolean,
				default: false,
			},
			showScan: {
				type: Boolean,
				default: false,
			}
		},
		created() {
			let sysInfo = util.getSysInfo()
			console.log(sysInfo)
			let that = this
			let statusBarHeight = sysInfo.statusBarHeight
			let titleBarHeight = sysInfo.titleBarHeight

			that.currentPagesLength = getCurrentPages().length
			that.customBarStyle =
				`height: ${titleBarHeight}px;line-height: ${titleBarHeight}px;padding-top: ${statusBarHeight}px`
			that.titleBarHeight = titleBarHeight
			let top = (titleBarHeight - 16 - 2) / 2
			let bottom = titleBarHeight - 16 - top
			that.iconPadding = `padding-top: ${top}px;padding-bottom: ${bottom}px;`
			that.lineMargin = `margin-top: ${top}px`
		},
		watch:{
			title: {
				handler: function(val){
					uni.setNavigationBarTitle({
						title: val
					})
				},
				immediate: true,
				deep: true,
			}
		},
		computed:{
			...mapGetters(useSettingStore, ['security'])
		},
		onShow() {
			console.log('header onshow')
		},
		methods: {
			headerBack() {
				uni.navigateBack({
					delta: 1,
					fail(e) {
						wx.switchTab({
							url: '/pages/index/index'
						})
					}
				})
			},
			headerHome() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			headerSearch() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			share() {
				// #ifdef APP-PLUS
				plus.share.sendWithSystem({
					content: config.shareContent,
					href: config.shareLink,
				})
				// #endif
			}
		}
	}
</script>

<style scoped lang="scss">
	.header {
		top: 0;
		position: fixed;
		width: 100%;
		background-color: $uni-color-success;
		z-index: 9999;
		vertical-align: center;

		.header-icon {
			display: flex;
		}

		.icon-right {
			flex-direction: row-reverse;
			padding-right: 15px;
		}

		.header-icon>view {
			height: 16px;
			padding: 0 8px;
		}

		.header-icon .line {
			border: 0;
			width: 1px;
			background-color: #fff;
			height: 16px;
			padding: 0;
			margin: 0 3px 0 0;
		}

		.back {
			padding-left: 15px;
		}

		image {
			width: 16px;
			height: 16px;
			display: block;
			background: transparent;
		}
		
		.home{
			image{
				width: 20px;
				height: 20px;
				position: relative;
				top: -2px;
			}
		}

		.header-title {
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			font-size: 16px;
			color: #fff;
			text-align: center;
		}
	}
</style>