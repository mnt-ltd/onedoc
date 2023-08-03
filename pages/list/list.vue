<template>
	<view>
		<mHeaderSearch @focus="go2search"/>
	</view>
</template>

<script>
	import mHeaderSearch from '@/compomnents/headerSearch.vue'
	export default {
		data() {
			return {

			}
		},
		components: {
			mHeaderSearch,
		},
		methods: {
			go2search() {
				console.log('go2search')
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.search {
		padding: 20px;
	}
</style>