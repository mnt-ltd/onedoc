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
		onLoad(args) {
			this.args = args
		}
	}
</script>