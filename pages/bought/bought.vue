<template>
	<view>
		<mHeader title="已购文档" />
		<view class="box" style="margin-top:10px">
			<template v-if="orders.length>0">
				<view class="myorder">
					<view v-for="row in orders" :key="'dy-'+row.id">
						<view class="title" @click="go2detail(row)">{{row.product_name}}</view>
						<view class="row body" @click="go2detail(row)">
							<view class="col-4">
								<text class="item">金额({{system.credit_name || '积分'}})</text>
								<text>{{row.price}}</text>
							</view>
							<view class="col-8">
								<text class="item">购买时间</text>
								<text>{{formatTime(new Date(row.paid_at))}}</text>
							</view>
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
		toastError,
		toastSuccess,
	} from '@/utils/util.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		listUserOrder
	} from '@/api/user.js'
	import {
		closeOrder,
		deleteOrder,
	} from '@/api/order.js'
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
					status: 2, // 购买成功
					order_type: 1, // 购买文档
				},
				orders: []
			}
		},
		computed: {
			...mapGetters(useUserStore, ['user']),
			...mapGetters(useSettingStore, ['system'])
		},
		created() {
			if (!this.user.id) {
				uni.navigateTo({
					url: '/pages/login/login?redirect=/pages/bought/bought'
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
					if (this.query.page === 1) {
						this.orders = orders
					} else {
						this.orders.push(...orders)
					}
					if (orders.length === 0) {
						this.query.page = 0
					}
				}
			},
			go2detail(order){
				uni.navigateTo({
					url: '/pages/document/document?id='+order.product_id
				})
			},
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
				color: #aaa;
				margin-right: 10px;
				display: inline-block;
				width: 70px;
			}

			navigator {
				display: inline-block;
				color: $uni-color-primary;
			}
		}

		.body {
			line-height: 24px;
			color: #777
		}
	}

	.btn {
		border: 1px solid #efefef;
		border-radius: 3px;
		padding: 3px 5px;
		font-size: 10px;
	}

	.btn-pay {
		color: $uni-color-error;
	}

	.btn-closed {
		color: $uni-color-subtitle;
	}

	.btn-paid {
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

	.success {
		color: $uni-color-success;
	}

	.primary {
		color: $uni-color-primary;
	}

	.danger {
		color: $uni-color-error;
	}

	.warning {
		color: $uni-color-warning;
	}

	.info {
		color: #888 !important;
	}

	.footer {
		border-top: 1px solid #efefef;
		font-size: 12px;
		margin-top: 10px;
		padding-top: 5px;
		line-height: 30px;
		// text-align: center;
	}

	.no-more {
		text-align: center;
		font-size: 12px;
		color: #888;
		line-height: 30px;
	}
</style>