<template>
	<view :style="customBarStyle">
		<view class="header" :style="customBarStyle">
			<view class="row">
				<view class="col-8">
					<mSearch :isMiniSearch="true"  @focus="focus"/>
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
				iconPadding: 'padding-top:16px;padding-bottom:16px',
				lineMargin: 'margin-top: 16px;',
				titleBarHeight: 44,
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
		},
		methods: {
			focus(){
				this.$emit('focus')
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
		box-sizing: border-box;
		.row{
			&>view{
				padding: 0 10px;
			}
		}
	}
</style>