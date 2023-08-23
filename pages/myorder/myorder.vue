<template>
	<view>
		<mHeader title="我的订单" />
		<view class="row tabs">
			<view class="col" :class="query.status===0 ? 'active' : ''" @click="changeStatus(0)">全部订单</view>
			<view class="col" :class="query.status===1 ? 'active' : ''" @click="changeStatus(1)">待支付</view>
			<view class="col" :class="query.status===2 ? 'active' : ''" @click="changeStatus(2)">已支付</view>
			<view class="col" :class="query.status===3 ? 'active' : ''" @click="changeStatus(3)">已关闭</view>
		</view>
		<view class="box" style="margin-top:45px">
			<template v-if="orders.length>0">
				<view class="myorder">
					<view v-for="row in orders" :key="'dy-'+row.id">
						<view class="title">{{row.product_name}}</view>
						<view class="row body">
							<view class="col-6">
								<text class="item">支付状态</text>
								<text v-if="row.status===1" class="btn btn-pay">待支付</text>
								<text v-if="row.status===2" class="btn btn-paid">已支付</text>
								<text v-if="row.status===3" class="btn btn-closed">已关闭</text>
							</view>
							<view class="col-6">
								<text class="item">金额(魔豆)</text>
								<text>{{row.price}}</text>
							</view>
							<view class="col-12">
								<text class="item">下单时间</text>
								<text>{{formatTime(new Date(row.created_at))}}</text>
							</view>
							<view class="col-12">
								<text class="item">订单号</text>
								<text>{{row.order_no}}</text>
							</view>
						</view>
						<view class="row footer">
							<view class="col-3 primary">支付</view>
							<view class="col-3 info">查看</view>
							<view class="col-3 danger">删除</view>
						</view>
					</view>
				</view>
			</template>
			<mEmpty v-else />
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
		listUserOrder
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
					size: 20,
					status: 0,
				},
				orders: []
			}
		},
		computed: {
			...mapGetters(useUserStore, ['user'])
		},
		created() {
			if (!this.user.id) {
				uni.navigateTo({
					url: '/pages/login/login?redirect=/pages/myorder/myorder'
				})
				return
			}
			this.loadOrders()
		},
		onReachBottom() {
			if (this.query.page > 0) {
				this.query.page++
				this.loadOrders()
			}
		},
		methods: {
			relativeTime,
			formatTime,
			changeStatus(status) {
				this.query.status = status
				this.query.page = 1
				this.loadOrders()
			},
			async loadOrders() {
				const res = await listUserOrder(this.query)
				if (res.statusCode === 200) {
					const orders = res.data.order || []
					if(this.query.page===1){
						this.orders = orders
					}else{
						this.orders.push(...orders)
					}
					if (orders.length === 0) {
						this.query.page = 0
					}
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.tabs {
		padding: 0 15px;
		font-size: 14px;
		position: fixed;
		width: 100%;
		z-index: 999;
		background-color: $uni-bg-color-grey;
		
		.col {
			padding: 10px 0;
			color: $uni-color-paragraph;
		}

		.active {
			color: $uni-color-success;
		}
	}

	.box {
		padding: 0 10px;
	}

	.myorder {
		font-size: 14px;
		line-height: 24px;

		&>view {
			background-color: #fff;
			border-radius: 8px;
			padding: 10px;
			margin-bottom: 10px;
			padding-bottom: 5px;
		}

		.row {
			padding: 10px 0 0;
			line-height: 30px;

			.item {
				color: #888;
				margin-right: 10px;
				display: inline-block;
				width: 70px;
			}

			navigator {
				display: inline-block;
				color: $uni-color-primary;
			}
		}
		
		.body{
			line-height: 40px;
		}
	}
	
	.btn{
		border: 1px solid #efefef;
		border-radius: 3px;
		padding: 3px 5px;
		font-size: 10px;
	}
	.btn-pay{
		color: $uni-color-error;
	}
	.btn-closed{
		color: $uni-color-subtitle;
	}
	.btn-paid{
		color: $uni-color-success;
	}

	.title {
		color: #000;
		font-weight: 400;
		font-size: 16px;
		border-bottom: 1px solid #efefef;
		padding-bottom: 10px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.success{
		color: $uni-color-success;
	}
	
	.primary{
		color: $uni-color-primary;
	}
	
	.danger{
		color: $uni-color-error;
	}
	
	.info{
		color: #888;
	}
	
	.footer{
		border-top: 1px solid #efefef;
		font-size: 12px;
		margin-top: 10px;
		padding-top: 5px;
		line-height: 30px;
		text-align: center;
	}

	.no-more {
		text-align: center;
		font-size: 12px;
		color: #888;
		line-height: 30px;
	}
</style>