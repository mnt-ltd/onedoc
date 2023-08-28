<template>
	<view>
		<mHeader title="我的VIP" />
		<template v-if="vips.length>0">
			<view class="myvip">
				<view v-for="row in vips" :key="'dy-'+row.id">
					<view class="title">月卡VIP</view>
					<view class="row">
						<view class="col-6">
							<text class="item">专享下载</text>
							<text>{{row.download || '不限'}}</text>
						</view>
						<view class="col-6">
							<text class="item">已用专享</text>
							<text>{{row.download_used || 0}}</text>
						</view>
						<view class="col-6">
							<text class="item">下载频次</text>
							<text>{{row.times || '不限'}} 次/天</text>
						</view>
						<view class="col-6">
							<text class="item">文档折扣</text>
							<text>{{((row.discount || 100)/10).toFixed(1)}} 折</text>
						</view>
						<view class="col-12">
							<text class="item">开始日期</text>
							<text>
								{{formatTime(new Date(row.joined_at))}}
							</text>
						</view>
						<view class="col-12">
							<text class="item">截止日期</text>
							<text>
								{{formatTime(new Date(row.expired_at))}}
							</text>
						</view>
						<view class="col-12">
							<text class="item">关联订单</text>
							<navigator :url="`/pages/orderdetail/orderdetail?order_no=${row.order_no}`" hover-class="none">
								{{row.order_no}}
							</navigator>
						</view>
					</view>
				</view>
			</view>
		</template>
		<mEmpty v-else />
		<view class="no-more" v-if="query.page===0 && vips.length>0">
			已无更多动态数据...
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import mEmpty from '@/compomnents/empty.vue'
	import {
		getHeaderHeight,
		relativeTime,
		formatTime,
	} from '@/utils/util.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		listUserVIP
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
				vips: []
			}
		},
		computed: {
			...mapGetters(useUserStore, ['user'])
		},
		created() {
			// 未登录，则跳转到登录页
			if (!this.user.id) {
				uni.navigateTo({
					url: '/pages/login/login?redirect=/pages/myvip/myvip'
				})
				return
			}
			this.loadVIP()
		},
		onReachBottom() {
			if (this.query.page > 0) {
				this.query.page++
				this.loadVIP()
			}
		},
		methods: {
			relativeTime,
			formatTime,
			async loadVIP() {
				const res = await listUserVIP(this.query)
				if (res.statusCode === 200) {
					const vips = res.data.user_vip || []
					if (vips.length === 0) {
						this.query.page = 0
					}
					this.vips.push(...vips)
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.myvip {
		padding: 10px;
		font-size: 14px;
		line-height: 24px;

		&>view {
			background-color: #fff;
			border-radius: 8px;
			padding: 10px;
			margin-bottom: 10px;
		}
	}
	
	.title{
		font-weight: bold;
		font-size: 16px;
		border-bottom: 1px solid #efefef;
		padding-bottom: 10px;
	}
	
	.row{
		padding: 10px 0 0;
		line-height: 30px;
		.item{
			color: #888;
			margin-right: 10px;
		}
		navigator{
			display: inline-block;
			color: $uni-color-primary;
		}
	}

	.no-more {
		text-align: center;
		font-size: 12px;
		color: #888;
		line-height: 30px;
	}
</style>