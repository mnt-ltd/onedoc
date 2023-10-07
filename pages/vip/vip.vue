<template>
	<view class="page-vip">
		<mHeader title="加入VIP" />
		<view class="box">
			<view class="card" :class="vipType==='year' ? 'active': ''" @click="selectVIP('year')">
				<view class="card-header">年卡VIP</view>
				<view class="card-body">
					<view class="price">
						<view>
							<text class="small">¥</text>
							<text>{{ ((vip.year_price || 0) / 100).toFixed(2) }}</text>
							<text class="small">元</text>
						</view>
						<view class="del">¥
							{{
						((vip.year_original_price || 0) / 100).toFixed(2)
					  }}
						</view>
					</view>
					<view class="diff">
						<view>
							<i class="el-icon-caret-right"></i> 文档购买折扣：<span>{{
						((vip.year_document_discount || 0) / 10).toFixed(1)
					  }}</span>
							折
						</view>
						<view>
							<i class="el-icon-caret-right"></i> VIP专享免费下载：
							<span>{{ vip.year_download || 0 }}</span>
							次
						</view>
						<view>
							<i class="el-icon-caret-right"></i> 整站文档下载频次：
							<span>{{ vip.year_times_every_day || '不限' }}</span>
							次/天
						</view>
					</view>
				</view>
			</view>
			<view class="card" :class="vipType==='quarter' ? 'active': ''" @click="selectVIP('quarter')">
				<view class="card-header">季卡VIP</view>
				<view class="card-body">
					<view class="price">
						<view>
							<text class="small">¥</text>
							<text> {{ ((vip.quarter_price || 0) / 100).toFixed(2) }}
							</text>
							<text class="small">元</text>
						</view>
						<view class="del">¥
							{{
						((vip.quarter_original_price || 0) / 100).toFixed(2)
					  }}
						</view>
					</view>
					<view class="diff">
						<view>
							<i class="el-icon-caret-right"></i> 文档购买折扣：<span>{{
						((vip.quarter_document_discount || 0) / 10).toFixed(1)
					  }}</span>
							折
						</view>
						<view>
							<i class="el-icon-caret-right"></i> VIP专享免费下载：
							<span>{{ vip.quarter_download || 0 }}</span>
							次
						</view>
						<view>
							<i class="el-icon-caret-right"></i> 整站文档下载频次：
							<span>{{ vip.quarter_times_every_day || '不限' }}</span>
							次/天
						</view>
					</view>
				</view>
			</view>
			<view class="card" :class="vipType==='month' ? 'active': ''" @click="selectVIP('month')">
				<view class="card-header">月卡VIP</view>
				<view class="card-body">
					<view class="price">
						<view>
							<text class="small">¥</text>
							<text> {{ ((vip.month_price || 0) / 100).toFixed(2) }}
							</text>
							<text class="small">元</text>
						</view>
						<view class="del">¥
							{{
						((vip.month_original_price || 0) / 100).toFixed(2)
					  }}
						</view>
					</view>
					<view class="diff">
						<view>
							<i class="el-icon-caret-right"></i> 文档购买折扣：<span>{{
						((vip.month_document_discount || 0) / 10).toFixed(1)
					  }}</span>
							折
						</view>
						<view>
							<i class="el-icon-caret-right"></i> VIP专享免费下载：
							<span>{{ vip.month_download || 0 }}</span>
							次
						</view>
						<view>
							<i class="el-icon-caret-right"></i> 整站文档下载频次：
							<span>{{ vip.month_times_every_day || '不限' }}</span>
							次/天
						</view>
					</view>
				</view>
			</view>
			<view class="card vip-rights">
				<view class="card-header">
					权益
				</view>
				<view class="card-body">
					<view class="row">
						<view class="col-6">
							<image src="/static/images/icon/vip-rights-download.png"></image>
							<view>
								<view>
									VIP文档
								</view>
								<text>专享免费下载</text>
							</view>
						</view>
						<view class="col-6">
							<image src="/static/images/icon/vip-rights-identify.png"></image>
							<view>
								<view>
									身份标识
								</view>
								<text>头像标记，彰显尊贵</text>
							</view>
						</view>
						<view class="col-6">
							<image src="/static/images/icon/vip-rights-discount.png"></image>
							<view>
								<view>
									文档折扣
								</view>
								<text>非VIP文档，享折扣优惠</text>
							</view>
						</view>
						<view class="col-6">
							<image src="/static/images/icon/vip-rights-ad.png"></image>
							<view>
								<view>
									去广告
								</view>
								<text>清爽体验，不受广告干扰
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="buy row">
			<view class="col-6">
				<text>{{((vipPrice||0)/100).toFixed(2)}} 元</text>
			</view>
			<view class="col-6">
				<button type="default" @click="buyVIP">立即购买</button>
			</view>
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		createOrder
	} from '@/api/order.js'
	import {
		orderTypeBuyVIP
	} from '@/utils/enum.js'
	import {
		mapGetters
	} from 'pinia'
	export default {
		components: {
			mHeader
		},
		data() {
			return {
				vipType: 'year',
				vipPrice: 0,
				loading: false,
			}
		},
		computed: {
			...mapGetters(useSettingStore, ['vip']),
			...mapGetters(useUserStore,['user'])
		},
		created() {
			// 未启用VIP
			if (!this.vip || !this.vip.enable) {
				uni.switchTab({
					url: '/pages/me/me'
				})
				return
			}
			this.vipPrice = this.vip.year_price
		},
		methods: {
			selectVIP(vipType) {
				this.vipType = vipType
				switch (vipType) {
					case 'year':
						this.vipPrice = this.vip.year_price
						break;
					case 'quarter':
						this.vipPrice = this.vip.quarter_price
						break;
					case 'month':
						this.vipPrice = this.vip.month_price
						break;
					default:
						this.vipPrice = this.vip.year_price
						break;
				}
			},
			// 购买VIP
			async buyVIP() {
				// 未登录，跳转登录
				if(!this.user || this.user.id<=0){
					let redirect= encodeURIComponent('/pages/vip/vip?')
					uni.navigateTo({
						url: '/pages/login/login?redirect='+redirect
					})
					return
				}
				this.loading = true
				let productId = 0 // 0 年卡，1 季卡，2 月卡
				switch (this.vipType) {
					case 'year':
						this.productId = 0
						break;
					case 'quarter':
						this.productId = 1
						break;
					case 'month':
						this.productId = 2
						break;
					default:
						this.productId = 0
						break;
				}
				// 创建购买VIP订单
				const res = await createOrder({
					order_type: orderTypeBuyVIP,
					product_id: productId,
				})
				console.log(res)
				if (res.statusCode === 200) {
					// 订单状态为待支付，跳转到支付页面
					if (res.data.status === 1) {
						uni.navigateTo({
							url: '/pages/orderdetail/orderdetail?order_no=' + res.data.order_no,
						})
						return
					}
				} else {
					this.$message.error(res.data.message)
				}
				this.loading = false
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-vip {
		background-image: linear-gradient(183deg, #fff9e8 3%, #f5f5f5);
		padding-bottom: 210px;
	}

	.box {
		padding: 10px;

		.card {
			background-color: #fff;
			border-radius: 8px;
			margin-bottom: 10px;
			overflow: hidden;

			.card-header {
				padding: 10px;
				border-bottom: 1px solid #efefef;
				font-weight: bold;


			}

			&.active {
				box-shadow: 0 2px 12px 0 rgba(247, 164, 109, .7607843137);

				.card-header {
					background-color: #f60;
					color: #fff;
					position: relative;

					&::after {
						content: " ";
						filter: brightness(0) invert(1);
						background-image: url("/static/images/checked.png");
						display: inline-block;
						width: 35px;
						height: 35px;
						background-size: contain;
						vertical-align: middle;
						position: absolute;
						right: 10px;
						top: 3px;
					}
				}
			}

			.card-body {
				padding: 10px;
				font-size: 13px;

				.del {
					text-decoration: line-through;
				}

				line-height: 200%;

				.price {
					font-size: 26px;
					font-weight: bold;
					text-align: center;

					.small {
						font-size: 14px;
						margin: 0 5px;
					}

					.del {
						font-size: 18px;
						color: #bbb;
						font-weight: 200;
					}
				}

				.diff {
					text-align: left;
					border-top: 1px solid #f1f2f3;
					margin-top: 10px;
					padding-top: 10px;
					font-size: 14px;

					span {
						font-size: 1.3em;
					}

				}
			}
		}
	}

	.vip-rights {
		border-top: 1px solid #efefef;
		border-radius: 0 !important;
		padding: 0;
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 40px;
		box-shadow: 0 -6px 6px 0 #efefef;

		.col-6 {
			display: flex;
			margin: 5px 0;

			image {
				width: 36px;
				height: 36px;
				border-radius: 50%;
				overflow: hidden;
			}

			&>view {
				padding-left: 10px;
				box-sizing: border-box;
				flex: 1;

				view {
					font-size: 16px;
					font-weight: bold;
					line-height: 1;
				}

				text {
					font-size: 12px;
					color: #bbb;
				}
			}
		}

	}

	.buy {
		position: fixed;
		height: 50px;
		line-height: 50px;
		width: 100%;
		bottom: 0;
		background-color: #fff;
		border-top: 1px solid #efefef;

		.col-6 {
			padding: 0 10px;
			box-sizing: border-box;
			text-align: right;
			color: #f60;
		}

		button {
			background-color: $uni-color-error;
			border: 0;
			border-radius: 4px;
			color: #fff;
			font-size: 14px;
			margin-top: 8px;
		}
	}
</style>