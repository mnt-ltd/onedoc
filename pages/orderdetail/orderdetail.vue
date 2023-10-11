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
								:url="`/pages/document/document?id=${order.product_id}`" hover-class="none"
								class="primary">
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
			<view class="card goods-info">
				<view class="card-header">
					商品信息
				</view>
				<view class="card-body">
					<!-- 商品卡片 -->
					<goodsCard :order="order" v-if="order.order_type === 1" />
					<!-- VIP卡片 -->
					<goodsCardVIP :order="order" v-else-if="order.order_type === 2" />
				</view>
			</view>
			<!-- 待支付 -->
			<view class="card payment-type" v-if="order.status === 1">
				<view class="card-header">
					支付方式
				</view>
				<view class="card-body">
					<view class="item" :class="paymentType===5 ? 'active':''" @click="changePayment(5)">
						<view>
							<view>积分支付</view>
							<text class="small">剩余 {{ user.credit_count || 0 }}
								{{ system.credit_name }}</text>
						</view>
					</view>
					<view class="item" :class="paymentType===1 ? 'active':''" @click="changePayment(1)">
						<view>
							<view>微信支付</view>
							<image src="/static/images/pay-wechatpay.png"></image>
						</view>
					</view>
					<view class="item" v-if="download.enable_code_download" :class="paymentType===9 ? 'active':''"
						@click="changePayment(9)">
						<view>
							<view>下载码支付</view>
							<image src="/static/images/pay-downcode.png"></image>
						</view>
					</view>
					<template v-if="paymentType === 9">
						<view class="downcode-tips">
							<view v-html="download.code_tip"></view>
						</view>
						<view class="row downcode">
							<view class="col-3">
								下载码
							</view>
							<view class="col-9">
								<input v-model="downcode" placeholder="请输入下载码"  />
							</view>
						</view>
					</template>
					<view class="row row-pay">
						<view class="col-7">
							<view class="price">
								{{ order.amount || '0' }} {{ system.credit_name
							          }}
								<template v-if="system.show_exchange">（
									<text class="danger">{{
							                (
							                  (order.amount || 0) / (system.credit_exchange || 1)
							                ).toFixed(2)
							              }}
										元</text>）</template>
							</view>
						</view>
						<view class="col-5">
							<button type="warn" @click="payOrder">支付订单</button>
						</view>
					</view>
				</view>
			</view>


			<!-- <el-card shadow="never" class="mgt-20px" v-if="order.status === 1">
			      <div slot="header">支付方式</div>
			      <div class="payment-type">
			        <el-radio
			          v-model="paymentType"
			          class="payment-type-radio"
			          :label="5"
			          :disabled="order.amount > user.credit_count"
			          v-if="order.order_type != 2 || settings.vip.enable_credit_pay"
			          border
			        >
			          积分支付
			          <small class="el-link el-link--info"
			            >剩余 {{ user.credit_count || 0 }}
			            {{ settings.system.credit_name }}</small
			          > </el-radio
			        ><el-radio
			          v-model="paymentType"
			          class="payment-type-radio"
			          v-for="item in payments"
			          :key="'pt-' + item.value"
			          :label="item.value"
			          :disabled="
			            !order.amount ||
			            (item.name === 'downcode' &&
			              settings.download.enable_code_download &&
			              settings.download.max_price > 0 &&
			              order.amount > settings.download.max_price)
			          "
			          v-show="
			            settings.payment['enable_' + item.name] ||
			            (item.name === 'downcode' &&
			              settings.download.enable_code_download &&
			              order.order_type === 1)
			          "
			          border
			        >
			          <span v-if="item.name === 'xunhupay'">
			            {{ settings.payment.xunhupay_name || item.label }}
			          </span>
			          <span v-else>{{ item.label }}</span>
			          <img :src="`/static/images/pay-${item.name}.png`" :alt="item.label" />
			        </el-radio>
			      </div>
			      下载码下载
			      <div v-if="paymentType === 9">
			        <div class="downcode-tips">
			          <div v-html="settings.download.code_tip"></div>
			        </div>
			      </div>
			      <div class="text-right">
			        输入下载码
			        <el-input
			          v-model="downcode"
			          v-if="paymentType === 9"
			          placeholder="请输入下载码"
			          class="downcode"
			        ></el-input>
			        <el-button type="text" class="btn-disabled" :disabled="true">
			          {{ order.amount || '0' }} {{ settings.system.credit_name
			          }}<template v-if="settings.system.show_exchange"
			            >（
			            <span class="el-link el-link--danger price"
			              >{{
			                (
			                  (order.amount || 0) / (settings.system.credit_exchange || 1)
			                ).toFixed(2)
			              }}
			              元</span
			            >）</template
			          ></el-button
			        >
			        <el-button
			          type="danger"
			          :disabled="paymentType === 5 && user.credit_count < order.amount"
			          @click="payOrder"
			          :loading="paying"
			          icon="el-icon-position"
			          >支付订单</el-button
			        >
			      </div>
			    </el-card> -->


		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import goodsCard from '@/compomnents/goodsCard.vue'
	import goodsCardVIP from '@/compomnents/goodsCardVIP.vue'
	import {
		getOrder,
		closeOrder,
		payOrder,
	} from '@/api/order.js'
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		useUserStore,
	} from '@/stores/user.js'
	import {
		mapGetters,
		mapActions,
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
			goodsCard,
			goodsCardVIP,
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
			...mapGetters(useSettingStore, ['system', 'payment', 'download']),
			...mapGetters(useUserStore, ['user'])
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
			Promise.all([this.getUser(), this.getOrder()])
		},
		methods: {
			formatTime,
			...mapActions(useUserStore, ['getUser']),
			async closeOrder() {
				const res = await closeOrder({
					order_no: this.orderNO
				})
				if (res.statusCode === 200) {
					toastSuccess('关闭订单成功')
					this.getOrder()
				} else {
					toastError(res.data.message || '关闭订单失败')
				}
			},
			changePayment(paymentType) {
				this.paymentType = paymentType
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
			async payOrder() {
				const params = {
					order_no: this.orderNO,
					payment_type: this.paymentType,
					downcode: this.downcode,
				}
				const res = await payOrder(params)
				if(res.statusCode===200){
					this.getOrder()
					toastSuccess('支付成功')
				}else{
					console.log(res)
					toastError(res.data.message || '支付失败')
				}
			}
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

	.primary {
		color: $uni-color-primary;
	}

	.info {
		color: $uni-text-color-grey;
	}

	.danger {
		color: $uni-color-error;
	}

	.success {
		color: $uni-color-success;
	}

	.order-info {
		.card-header {
			.col-7 {
				navigator {
					display: inline-block;
				}

				text {
					margin-left: 10px;
				}
			}
		}

		.card-body {
			.row {
				padding: 5px 0;
			}
		}
	}

	.downcode-tips {
		border: 1px dashed #f60;
		padding: 10px;
		border-radius: 8px;
		margin-bottom: 10px;
		color: $uni-text-color-grey;
	}
	
	.downcode{
		line-height: 35px;
		input{
			border: 1px solid #efefef;
			border-radius: 5px;
			padding: 0 10px;
			line-height: 35px;
			height: 35px;
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

	.payment-type {
		.item {
			box-sizing: border-box;
			font-size: 16px;
			line-height: 25px;
			margin-bottom: 10px;

			// &:last-of-type{
			// 	padding-bottom: 0;
			// }
			&>view {
				padding: 10px;
				padding-left: 30px;
				border: 1px solid #efefef;
				display: flex;
				border-radius: 5px;
				font-weight: 400;
				position: relative;

				image {
					width: 25px;
					height: 25px;
				}

				view {
					flex: 1;
				}

				text {
					font-size: 13px;
					font-weight: normal;
				}

				&::before {
					content: "✔";
					position: absolute;
					left: 10px;
					color: $uni-text-color-disable;
				}
			}

			&.active {
				&>view {
					border: 1px solid $uni-color-success;

					&::before {
						color: $uni-color-success;
					}
				}
			}
		}
	}

	.row-pay {
		padding: 10px 0 0;

		.price {
			line-height: 35px;
			color: $uni-text-color-disable;

			.danger {
				color: $uni-color-error;
			}
		}

		button {
			font-size: 15px;
		}
	}
</style>