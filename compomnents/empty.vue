<template>
	<view class="empty">
		<image src="/static/images/empty.svg" mode="widthFix"></image>
		<view class="tips">{{tips}}</view>
	</view>
</template>

<script>
	export default {
		name: 'mEmpty',
		props:{
			tips:{
				type: String,
				default: '暂无数据'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.empty{
		padding: 30px 0;
		background-color: #fff;
		border-radius: 8px;
	}
	image {
		width: 200px;
		max-width: 100%;
		margin: 0 auto;
		display: block;
	}
	.tips{
		font-size: 12px;
		line-height: 200%;
		text-align: center;
		color: #888;
	}
</style>