<template>
	<view>
		<filterDocument :args="args" :base-height="30" />
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
	}
</script>