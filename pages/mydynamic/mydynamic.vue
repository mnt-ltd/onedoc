<template>
	<view>
		<mHeader title="我的动态" />
		<view class="dynamic">
			<view :style="`min-height: calc(100vh - 60px - ${headerHeight}px)`">
				<template v-if="dynamics.length>0">
					<view class="row" v-for="row in dynamics" :key="'dy-'+row.id">
						<view class="col-3">{{relativeTime(row.created_at)}}</view>
						<view class="col-9" v-html="row.content"></view>
					</view>
				</template>
				<mEmpty v-else/>
			</view>
		</view>
		<view class="no-more" v-if="query.page===0">
			已无更多动态数据...
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import mEmpty from '@/compomnents/empty.vue'
	import {
		getHeaderHeight,
		relativeTime
	} from '@/utils/util.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		getDynamics
	} from '@/api/user.js'
	import {
		mapGetters,
		mapActions
	} from 'pinia'
	export default {
		components: {
			mHeader,
			mEmpty
		},
		data() {
			return {
				headerHeight: getHeaderHeight(),
				query: {
					page: 1,
					size: 20
				},
				dynamics: []
			}
		},
		computed: {
			...mapGetters(useUserStore, ['user'])
		},
		created() {
			// 未登录，则跳转到登录页
			if (!this.user.id) {
				uni.navigateTo({
					url: '/pages/login/login?redirect=/pages/mydynamic/mydynamic'
				})
				return
			}
			this.loadDynamic()
		},
		onReachBottom() {
			if(this.query.page>0){
				this.query.page++
				this.loadDynamic()
			}
		},
		methods: {
			relativeTime,
			async loadDynamic() {
				const res = await getDynamics(this.query)
				if (res.statusCode === 200) {
					const dynamics = res.data.dynamic || []
					if(dynamics.length===0){
						this.query.page=0
					}
					this.dynamics.push(...dynamics)
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.dynamic {
		padding: 10px;
		font-size: 14px;
		line-height: 24px;

		&>view {
			background-color: #fff;
			min-height: 500px;
			border-radius: 8px;
			padding: 10px 0;
		}
		
		.col-9{
			word-break: break-all;
			padding: 5px 10px 5px 10px;
			box-sizing: border-box;
		}
		.col-3{
			color: #888;
			padding: 5px 10px 5px 10px;
			box-sizing: border-box;
		}
	}

	.no-more {
		text-align: center;
		font-size: 12px;
		color: #888;
		line-height: 30px;
	}
</style>