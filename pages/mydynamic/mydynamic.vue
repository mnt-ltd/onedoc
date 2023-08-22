<template>
	<view>
		我的动态
	</view>
</template>

<script>
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		mapGetters,
		mapActions
	} from 'pinia'
	export default {
		data() {
			return {
				
			}
		},
		computed: {
			...mapGetters(useUserStore, ['user'])
		},
		created() {
			// 未登录，则跳转到登录页
			if(!this.user.id){
				uni.navigateTo({
					url: '/pages/login/login?redirect=/pages/mydynamic/mydynamic'
				})
				return
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
