<template>
	<view>
		<m-header :title="title"></m-header>
		<user-profile :tab="'profile'" @onTitle="changeTitle"></user-profile>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import userProfile from '@/compomnents/userProfile.vue'
	export default {
		components:{
			userProfile,
			mHeader,
		},
		data() {
			return {
				title: '个人资料'
			}
		},
		methods: {
			changeTitle(title){
				this.title = title
			}
		}
	}
</script>

<style>

</style>
