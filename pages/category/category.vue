<template>
	<view>
		<filterDocument ref="filter" :args="args" :base-height="30" />
	</view>
</template>
<script>
	import filterDocument from '@/compomnents/filterDocument.vue'
	export default {
		components: {
			filterDocument
		},
		onReachBottom() {
			try{
				this.$refs.filter.loadNext()
			}catch(e){
				//TODO handle the exception
			}
		},
		data() {
			return {
				args: {}
			}
		},
		onShareAppMessage() {
			return {
				title: '资料库'
			}
		},
		onShareTimeline() {
			return {
				title: '资料库'
			}
		},
	}
</script>