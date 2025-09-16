<template>
	<view class="page-scan">
		<mHeader title="授权登录" />
		<scan-login v-if="scene" :scene="scene"/>
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
			const scene = args.scene || 'fda6c193e67554ff'
			console.log('scene', scene, 'fda6c193e67554ff')
			this.scene = scene
			if (!scene){
				uni.showToast({
					title: '请扫描网站小程序登录码',
					icon: 'none',
					duration: 3000
				})
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/index/index',
					})
				}, 3000)
				return
			}
			
			// 解析scene参数，检查是否为登录相关
			// try {
			// 	const sceneData = JSON.parse(decodeURIComponent(scene))
			// 	if (sceneData.action !== 'login') {
			// 		uni.showToast({
			// 			title: '无效的登录二维码',
			// 			icon: 'none',
			// 			duration: 3000
			// 		})
			// 		setTimeout(() => {
			// 			uni.switchTab({
			// 				url: '/pages/index/index',
			// 			})
			// 		}, 3000)
			// 		return
			// 	}
			// } catch (error) {
			// 	console.error('解析scene参数失败:', error)
			// }
		},
	}
</script>

<style>

</style>
