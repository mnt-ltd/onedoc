<template>
	<view class="com-dialog" v-if="visible" @click.stop="closeDialog">
		<view class="dialog-box" @click.stop="stop">
			<view class="title">
				<view>{{title}}</view>
				<view class="close" @click="closeDialog">
					<image src="/static/images/clear.png"></image>
				</view>
			</view>
			<view class="dialog-main">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			visible: {
				type: Boolean,
				default: false,
			},
			title: {
				type: String,
				default: '发表评论'
			}
		},
		methods: {
			closeDialog(e) {
				console.log('closeDialog', e)
				this.$emit('close', e)
			},
			stop(e) {
				console.log('stop', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-dialog {
		position: fixed;
		z-index: 9999;
		left: 0;
		right: 0;
		height: 100vh;
		top: 0;
		background-color: rgba(0, 0, 0, 0.2);
		padding: 10px;
		box-sizing: border-box;
		.title{
			display: flex;
			justify-content: space-between;
			.close{
				image{
					height: 20px;
					width: 20px;
				}
			}
		}

		.dialog-box {
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