<template>
	<view>
		<m-header :title="title"></m-header>
		<view class="box">
			<view class="card order-info">
				<view class="card-header row">
					<view class="col-5">
						<text>订单信息</text>
					</view>
					<view class="col-7 font-normal">
						<navigator url="/pages/myorder/myorder" hover-class="none">↗ 订单列表</navigator>
						<text v-if="order.status===1" @click="closeOrder" class="close-order">× 关闭订单</text>
					</view>
				</view>
				<view class="card-body">
					<view class="row">
						<view class="col-3 item-title">订单号</view>
						<view class="col-9 item-content">{{order.order_no}}</view>
					</view>
					<view class="row">
						<view class="col-3 item-title">商品名称</view>
						<view class="col-9 item-content">
							<navigator v-if="order.order_type === 1"
								:url="`/pages/document/document?id=${order.product_id}`" hover-class="none" class="primary">
								{{order.product_name}}
							</navigator>
							<template v-else>{{ order.product_name }}</template>
						</view>
					</view>
					<view class="row">
						<view class="col-3 item-title">下单时间</view>
						<view class="col-9 item-content">{{ formatTime(new Date(order.created_at)) }}</view>
					</view>
					<view class="row" v-if="order.paid_at">
						<view class="col-3 item-title">支付时间</view>
						<view class="col-9 item-content">{{ formatTime(new Date(order.paid_at)) }}</view>
					</view>
					<!-- 订单已关闭才会显示 -->
					<view class="row" v-if="order.status === 3 && order.closed_at">
						<view class="col-3 item-title">关闭时间</view>
						<view class="col-9 item-content">{{ formatTime(new Date(order.closed_at)) }}</view>
					</view>
					<view class="row">
						<view class="col-3 item-title">订单状态</view>
						<view class="col-9 item-content">
							<template v-if="order.status === 1">
								<text class="danger">待支付</text>
							</template>
							<template v-else-if="order.status === 2">
								<text class="success">已支付</text>
							</template>
							<template v-else-if="order.status === 3">
								<text class="info">已关闭</text>
							</template>
						</view>
					</view>
					<view class="row">
						<view class="col-3 item-title">购买数量</view>
						<view class="col-9 item-content">{{ order.quantity }}</view>
					</view>
					<view class="row">
						<view class="col-3 item-title">商品单价</view>
						<view class="col-9 item-content">
							{{ order.price || '0' }} {{ system.credit_name
							}}<template v-if="system.show_exchange">（
								<text class="el-link el-link--danger price">{{
							    (
							      (order.price || 0) / (system.credit_exchange || 1)
							    ).toFixed(2)
							  }}</text>
								元）</template>
						</view>
					</view>
					<view class="row">
						<view class="col-3 item-title">实付金额</view>
						<view class="col-9 item-content">
							{{ order.amount || '0' }} {{ system.credit_name
							}}<template v-if="system.show_exchange">（
								<text class="el-link el-link--danger price">{{
							    (
							      (order.amount || 0) / (system.credit_exchange || 1)
							    ).toFixed(2)
							  }}</text>
								元）</template>
							<text class="del small" v-if="order.coupon_amount>0">
								{{ (order.amount || 0) + order.coupon_amount }}
								{{ system.credit_name
							    }}<template v-if="system.show_exchange">（
									<text class="el-link el-link--danger price">{{
							        (
							          ((order.amount || 0) + order.coupon_amount || 0) /
							          (system.credit_exchange || 1)
							        ).toFixed(2)
							      }}</text>
									元）</template>
							</text>
						</view>
					</view>
					<view class="row" v-if="order.payment_type > 0 && order.status === 2">
						<view class="col-3 item-title">支付方式</view>
						<view class="col-9 item-content">
							<span v-if="order.payment_type === 8">
								{{
							    payment.xunhupay_name ||
							    paymentTypeMap[order.payment_type].label ||
							    '-'
							  }}
							</span>
							<span v-else>{{
							  paymentTypeMap[order.payment_type].label || '-'
							}}</span>
						</view>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="card-header">
					商品信息
				</view>
				<view class="card-body">

				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import {
		getOrder,
	} from '@/api/order.js'
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		mapGetters
	} from 'pinia'
	import {
		toastError,
		toastSuccess,
		formatTime
	} from '@/utils/util'
	import {
		paymentTypeOptions,
	} from '@/utils/enum.js'
	export default {
		components: {
			mHeader,
		},
		data() {
			return {
				title: '订单详情',
				orderNO: '',
				order: {},
				paymentType: 5, // 5, 积分支付， 9， 下载码支付，1 微信支付
				paymentTypeOptions,
				paymentTypeMap: {},
				payments: [{
						label: '微信支付',
						value: 1,
						name: 'wechatpay'
					},
					{
						label: '支付宝支付',
						value: 2,
						name: 'alipay'
					},
					{
						label: '虎皮椒支付',
						value: 8,
						name: 'xunhupay'
					},
					{
						label: '下载码支付',
						value: 9,
						name: 'downcode'
					},
				],
			}
		},
		computed: {
			...mapGetters(useSettingStore, ['system', 'payment']),
		},
		created() {
			this.paymentTypeMap = paymentTypeOptions.reduce((obj, item) => {
				obj[item.value] = item
				return obj
			}, {})
		},
		onLoad(args) {
			console.log(args)
			if (!args.order_no) {
				uni.navigateTo({
					url: '/pages/myorder/myorder'
				})
				return
			}
			this.title = `订单: ${args.order_no}`
			this.orderNO = args.order_no
			this.getOrder()
		},
		methods: {
			formatTime,
			async closeOrder() {

			},
			// 获取订单详情
			async getOrder() {
				const res = await getOrder({
					order_no: this.orderNO
				})
				if (res.statusCode === 200) {
					let order = res.data || {}
					this.order = order
					// if (order.status === 1) {
					// 	this.paymentType = order.payment_type || this.paymentType
					// 	// 待支付的订单，根据closed_at字段来计算还有多长时间关闭订单
					// 	this.intervaler = setInterval(async () => {
					// 		let left = countDownTime(order.closed_at)
					// 		if (left.seconds <= 0) {
					// 			clearInterval(this.intervaler)
					// 			await this.closeOrder()
					// 			await this.getOrder()
					// 		} else {
					// 			this.countdown = left.format
					// 		}
					// 	}, 1000)
					// }
				} else {
					toastError(res.data.message || '获取订单详情失败')
					uni.navigateBack()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		padding: 10px;
	}

	.font-normal {
		font-weight: normal !important;
		text-align: right;
		font-size: 14px;
		color: $uni-color-primary;
	}

	.primary{
		color: $uni-color-primary;
	}
	
	.info{
		color: $uni-text-color-grey;
	}
	
	.danger{
		color: $uni-color-error;
	}
	
	.success{
		color: $uni-color-success;
	}

	.order-info {
		.card-header {
			.col-7 {
				navigator {
					display: inline-block;
				}

				text {
					border: 1px solid red;
					margin-left: 10px;
				}
			}
		}
		.card-body{
			.row{
				padding: 5px 0;
			}
		}
	}

	.close-order {
		background-color: #fff;
		color: $uni-color-warning;
		border: 0;
	}

	.card {
		border-radius: 8px;
		background-color: #fff;
		margin-bottom: 10px;

		.card-header {
			border-bottom: 1px solid #efefef;
			font-weight: bold;
			padding: 10px;
			box-sizing: border-box;
		}

		.card-body {
			font-size: 14px;
			padding: 10px;
			box-sizing: border-box;
		}
	}

	.item-title {
		color: $uni-border-color;
	}

	.del {
		text-decoration: line-through;
		font-size: 0.9em;
		color: $uni-text-color-grey;
	}
</style>