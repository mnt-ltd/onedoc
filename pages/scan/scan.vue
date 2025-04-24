<template>
	<view class="page-scan">
		<mHeader title="授权登录" />
		<scan-login :scene="scene"/>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import scanLogin from '@/compomnents/scanLogin.vue'
	export default {
		data() {
			return {
				scene: '',
			}
		},
		components:{
			scanLogin,
			mHeader
		},
		onLoad(args) {
			const scene = args.scene || ''
			if (!scene){
				uni.showToast({
					title: '请扫描网站小程序登录码',
					icon: 'none',
					duration: 3000
				})
				uni.switchTab({
					url: '/pages/index/index',
				})
			}
		},
	}
</script>

<style>

</style>
