<template>
	<view>
		<filterDocument v-if="visible" ref="filter" :args="args"/>
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
				args: {},
				visible: false
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
			this.visible=true
		},
		onShareAppMessage() {
			
		},
		onShareTimeline() {
			
		}
	}
</script>