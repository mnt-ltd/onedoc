<template>
	<view class="com-dialog" v-if="visible">
		<view class="dialog-box">
			<view class="title">{{title}}</view>
			<view class="dialog-main">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			visible:{
				type: Boolean,
				default: false,
			},
			title:{
				type: String,
				default: '发表评论'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-dialog{
		position: fixed;
		z-index: 9999;
		left: 0;
		right: 0;
		height: 100vh;
		top: 0;
		background-color: rgba(0, 0, 0, 0.2);
		padding: 10px;
		box-sizing: border-box;
		.dialog-box{
			background-color: #fff;
			padding: 10px;
			border-radius: 4px;
			position: absolute;
			left: 10px;
			right: 10px;
			top: 20%;
		}
	}
</style>