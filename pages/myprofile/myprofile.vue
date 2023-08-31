<template>
	<view>
		<m-header title="个人资料"></m-header>
		<user-profile :tab="profile"></user-profile>
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
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
