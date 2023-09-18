<template>
	<view class="page-comment">
		<m-header title="评论"></m-header>
		<view class="comment-box">
			<form-comment :comment="comment" />
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import formComment from '@/compomnents/formComment.vue'
	export default {
		components:{
			mHeader,
			formComment,
		},
		data() {
			return {
				comment:{
					document_id: 0,
					comment_id: 0,
					reply_user: '',
				}
			}
		},
		onLoad(args) {
			console.log('comment.vue args', args)
			this.comment = {
				document_id: parseInt(args.document_id || 0),
				comment_id: parseInt(args.comment_id || 0),
				reply_user: args.reply_user || ''
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.page-comment{
	.comment-box{
		padding: 10px;
		background-color: #fff;
	}
}
</style>
