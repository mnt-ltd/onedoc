<template>
	<view :class="`comment-item comment-item-${size}`">
		<view class="avatar">
			<image :src="joinImage(comment.user.avatar) || '/static/images/avatar.png'"></image>
		</view>
		<view class="main">
			<view class="username">{{comment.user.username}}</view>
			<view class="content">
				<text v-if="comment.replay_user" class="reply-user">{{comment.replay_user}}</text>
				{{comment.content}}
			</view>
			<view class="action">
				<view class="time">
					<image src="/static/images/time.png"></image>
					<text>1个月前</text>
				</view>
				<view class="reply" @click="reply">
					<image src="/static/images/comment.png"></image>
					<text size="mini">回复</text>
				</view>
			</view>
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import {
		joinImage
	} from '@/utils/util.js'
	export default {
		props: {
			size: {
				type: String,
				default: 'default', // default、small
			},
			comment: {
				type: Object,
				default: () => ({
					id: 0,
					parent_id: 0,
					user_id: 0,
					username: '匿名',
					avatar: '',
					group_id: 0,
					verify_status: 0,
					content: '内容加载中...',
					created_at: '0000-00-00',
				}),
			},
		},
		data() {
			return {
				replyComment: false,
			}
		},
		methods: {
			joinImage,
			reply(){
				this.$emit('reply', this.comment)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.comment-item {
		display: flex;
		margin-top: 10px;

		.avatar {
			width: 36px;
			height: 36px;
			border: 1px solid $uni-border-color;
			overflow: hidden;
			border-radius: 50%;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.main {
			flex: 1;
			box-sizing: border-box;
			padding-left: 10px;

			.content {
				margin-top: 10px;
				margin-bottom: 5px;
				background-color: #f5f7f8;
				border-radius: 4px;
				padding: 10px;
				font-size: 14px;
				box-sizing: border-box;
				color: #565656;
			}

			.action {
				display: flex;
				justify-content: space-between;
				font-size: 12px;
				margin-bottom: 20px;
				color: $uni-text-color-disable;
				image{
					width: 14px;
					height: 14px;
					vertical-align: middle;
					margin-right: 3px;
				}
				.time{
					image{
						position: relative;
						top: -1px;
					}
				}
				.reply{
					color: $uni-color-primary;
				}
			}
		}

		&.comment-item-small {
			.avatar {
				width: 32px;
				height: 32px;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}
	}
</style>