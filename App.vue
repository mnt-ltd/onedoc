<script>
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		mapActions,
		mapGetters,
	} from 'pinia'
	export default {
		async onLaunch() {
			const res = await this.getSettings()
			console.log('App Launch', res, this.security)
			// 需要登录才能访问，且没登录，则跳转到登录页面
			if(this.security.login_required && !this.user.id){
				uni.redirectTo({
					url: '/pages/login/login'
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		computed:{
			...mapGetters(useSettingStore, ['security']),
			...mapGetters(useUserStore, ['user'])
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

