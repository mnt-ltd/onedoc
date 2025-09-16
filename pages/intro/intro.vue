<template>
	<view>
		{{args}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				args:{}
			}
		},
		onLoad(args) {
			this.args = args
			uni.redirectTo({
				url: '/pages/scan/scan?scene='+args.scene
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
