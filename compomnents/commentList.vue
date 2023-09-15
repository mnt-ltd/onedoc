<template>
	<view class="comment-list">
		<view v-if="comments.length>0">
			<comment-item v-for="comment in comments" :key="'comment-' + comment.id" :comment="comment"
				@reply="reply">
				<comment-item v-for="child in comment.children" :key="'comment-' + child.id" class="comment-child"
					:comment="child" :size="'small'" @reply="reply"></comment-item>
			</comment-item>
		</view>
		<m-empty v-else tips="暂无评论, 期待您的金玉良言" />
	</view>
</template>

<script>
	import {
		listComment
	} from '@/api/comment.js'
	import mEmpty from '@/compomnents/empty.vue'
	import commentItem from '@/compomnents/commentItem.vue'
	export default {
		components: {
			mEmpty,
			commentItem,
		},
		props: {
			documentId: {
				type: Number,
				require: true,
				default: 0
			}
		},
		data() {
			return {
				comments: []
			}
		},
		watch: {
			documentId: {
				handler: function() {
					this.getComments()
				},
				immediate: true,
			}
		},
		methods: {
			async getComments() {
				const res = await listComment({
					document_id: this.documentId,
					order: 'id asc'
				})
				if (res.statusCode === 200) {
					this.comments = this.comments2tree(res.data.comment || [])
					console.log(this.comments)
				}
			},
			reply(comment){
				console.log('commentList reply', comment)
				this.$emit('reply', comment)
			},
			comments2tree(comments) {
				const tree = []
				const map = {}
				comments.forEach((comment) => {
					map[comment.id] = comment
				})
				comments.forEach((comment) => {
					// 寻找最顶层父级
					let parent = map[comment.parent_id]
					let replyUser = ''
					if (comment.parent_id && parent) {
						try {
							replyUser = `@${parent.user.username}`
						} catch (error) {}
					}
					while (parent && parent.parent_id) {
						parent = map[parent.parent_id]
					}
					comment.reply_user = replyUser
					if (parent) {
						;
						(parent.children || (parent.children = [])).push(comment)
					} else {
						tree.push(comment)
					}
				})
				console.log(tree)
				return tree
			},
		}
	}
</script>

<style>
</style>