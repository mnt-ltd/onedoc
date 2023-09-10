<script>
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		mapActions
	} from 'pinia'
	export default {
		async onLaunch() {
			const res = await this.getSettings()
			console.log('App Launch', res)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			...mapActions(useSettingStore,['getSettings'])
		}
	}
</script>

<style lang="scss">
	@import url(static/css/moredoc.css);
	page{
		background-color: $uni-bg-color-grey;
	}
	.m-card{
		background-color: #ffffff;
		border-radius: $uni-border-radius-lg !important;
		box-sizing: border-box;
		overflow: hidden;
		.m-card-header{
			padding: $uni-spacing-col-base;
			font-size: $uni-font-size-base;
			border-bottom: 1px solid $uni-bg-color-hover;
		}
		.m-card-body{
			padding: $uni-spacing-col-base;
		}
	}
	
	// 因此滚动条
	::-webkit-scrollbar{
		display: none !important;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none !important;
		background-color: transparent !important;
	}
</style>

