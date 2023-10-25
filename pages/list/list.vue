<template>
	<view>
		<filterDocument ref="filter" :args="args" />
	</view>
</template>
<script>
	import filterDocument from '@/compomnents/filterDocument.vue'
	export default {
		components: {
			filterDocument
		},
		data() {
			return {
				args: {}
			}
		},
		onReachBottom() {
			try{
				this.$refs.filter.loadNext()
			}catch(e){
				//TODO handle the exception
			}
		},
		onLoad(args) {
			this.args = args
		},
		onShareAppMessage() {
			
		},
		onShareTimeline() {
			
		}
	}
</script>