<template>
	<view :style="customBarStyle">
		<view class="header" :style="customBarStyle">
			<view class="row" :class="currentPagesLength>1?'has-back': ''">
				<view class="col-1" v-if="currentPagesLength>1">
					<view class="header-icon icon-left">
						<block>
							<view class="back" @click="headerBack" :style="iconPadding">
								<image src="/static/images/back-white.png"></image>
							</view>
						</block>
					</view>
				</view>
				<view :class="currentPagesLength>0 ? 'col-7': 'col-8'">
					<mSearch :isMiniSearch="true" @focus="focus" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import util from '@/utils/util.js'
	import config from '@/config.js'
	import mSearch from '@/compomnents/search.vue'
	export default {
		name: 'headerSearch',
		data() {
			return {
				customBarStyle: '',
				iconPadding: 'padding-top:8px;padding-bottom:10px',
				titleBarHeight: 44,
				currentPagesLength: getCurrentPages().length
			};
		},
		components: {
			mSearch
		},
		props: {

		},
		created() {
			let sysInfo = util.getSysInfo()
			let statusBarHeight = sysInfo.statusBarHeight
			let titleBarHeight = sysInfo.titleBarHeight

			this.customBarStyle =
				`height: ${titleBarHeight+statusBarHeight}px;line-height: ${titleBarHeight}px;padding-top: ${(titleBarHeight-32)/2+statusBarHeight}px;box-sizing:border-box;`
			this.titleBarHeight = titleBarHeight

			let top = (titleBarHeight - 16 - 2) / 2
			let bottom = titleBarHeight - 16 - top
		},
		methods: {
			focus() {
				this.$emit('focus')
			},
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
		box-sizing: border-box;

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

		.back {
			padding-left: 15px;
			vertical-align: middle;
		}

		image {
			width: 17px;
			height: 17px;
			display: block;
			background: transparent;
		}

		.row {
			&>view {
				padding: 0 10px;
			}
		}
		.row.has-back {
			&>view {
				padding: 0;
			}
		}
	}
</style>