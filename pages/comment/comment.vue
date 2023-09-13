<template>
	<view>
		<m-header :title="title"/>
	</view>
</template>

<script>
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		mapGetters,
	} from 'pinia'
	import mHeader from '@/compomnents/header.vue'
	export default {
		components:{
			mHeader
		},
		data() {
			return {
				title: '评论',
				document_id: 0,
			}
		},
		computed:{
			...mapGetters(useUserStore, ['user'])
		},
		onLoad(args){
			if(!this.user.id){
				const commentURL = `/pages/comment/comment?document_id=${args.id}&title=${args.title}`
				uni.navigateTo({
					url: '/pages/login/login?redirect='+encodeURIComponent(commentURL)
				})
				return
			}
			this.title = `评论 -《${args.title}》` || '评论'
			this.document_id = parseInt(args.document_id || '0')
			this.getComments()
		},
		methods: {
			async getComments(){

			}
		}
	}
</script>

<style>

</style>
