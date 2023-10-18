<template>
	<view>
		<filterDocument :args="args" />
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