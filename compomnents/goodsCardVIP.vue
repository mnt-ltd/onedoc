<template>
	<view class="com-goods-card-vip">
		<view class="row" v-for="(item, idx) in descriptions" :key="'item-'+idx">
			<view class="col-3 item-title">
				{{item.label}}
			</view>
			<view class="col-9 item-content">
				<navigator hover-class="none" class="primary" v-if="item.label==='名称'" url="/pages/vip/vip">{{item.value}}</navigator>
				<template v-else>
					{{item.value}}
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatBytes,
		formatTime,
	} from '@/utils/util.js'
	import {
		getDocument,
		downloadDocument,
	} from '@/api/document.js'
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		getUserVIPOrder,
	} from '@/api/user.js'
	import {
		mapGetters
	} from 'pinia'
	export default {
		name: 'GoodsCard',
		props: {
			order: {
				type: Object,
				default: () => ({}),
			},
		},
		watch: {
			// 监听order变化
			order: {
				async handler(val) {
					console.log(this.vip, val)
					let download = '不限'
					let discount = '不打折'
					let frequency = '不限'
					let startTime = ''
					let endTime = ''
					switch (val.product_id) {
						case 2: // 月卡
							download = this.vip.month_download ?
								this.vip.month_download :
								download
							if (this.vip.month_download)
								download = this.vip.month_download

							discount = this.vip.month_document_discount ?
								(this.vip.month_document_discount / 10).toFixed(1) +
								' 折' :
								discount
							frequency = this.vip.month_times_every_day ?
								`${this.vip.month_times_every_day} 次/天` :
								frequency
							break
						case 1: // 季卡
							download = this.vip.quarter_download ?
								this.vip.quarter_download :
								download
							discount = this.vip.quarter_document_discount ?
								(this.vip.quarter_document_discount / 10).toFixed(1) +
								' 折' :
								discount
							frequency = this.vip.quarter_times_every_day ?
								`${this.vip.quarter_times_every_day} 次/天` :
								frequency
							break
						default: // 0 或其他，默认为年卡
							download = this.vip.year_download ?
								this.vip.year_download :
								download
							discount = this.vip.year_document_discount ?
								(this.vip.year_document_discount / 10).toFixed(1) +
								' 折' :
								discount
							frequency = this.vip.year_times_every_day ?
								`${this.vip.year_times_every_day} 次/天` :
								frequency
					}

					const res = await getUserVIPOrder({
						order_no: val.order_no
					})

					console.log(res)
					if (res.statusCode === 200) {
						if (res.data.times) frequency = `${res.data.times} 次/天`
						if (res.data.download) download = res.data.download
						if (res.data.discount)
							discount = `${(res.data.discount / 10).toFixed(1)} 折`
						if (res.data.joined_at) startTime = formatTime(new Date(res.data.joined_at))
						if (res.data.expired_at) endTime = formatTime(new Date(res.data.expired_at))
					}

					let descriptions = [{
							label: '名称',
							value: val.product_name,
						},
						{
							label: '下载频次',
							value: frequency,
						},
						{
							label: '身份标识',
							value: '√',
						},
						{
							label: '清爽去广告',
							value: '√',
						},
						{
							label: 'VIP专享下载',
							value: `${download} 次`,
						},
						{
							label: 'VIP专享折扣',
							value: `${discount}`,
						},
					]
					if (startTime) {
						descriptions.push({
							label: '开始时间',
							value: startTime,
						})
					}
					if (endTime) {
						descriptions.push({
							label: '结束时间',
							value: endTime,
						})
					}
					this.descriptions = descriptions
				},
				deep: true,
				immediate: true,
			},
		},
		data() {
			return {
				descriptions: [],
			}
		},
		computed: {
			...mapGetters(useSettingStore, ['vip'])
		},
		methods: {
			formatBytes,
			formatTime,
		}
	}
</script>

<style lang="scss" scoped>
	.item-title {
		color: $uni-border-color;
	}

	.primary {
		color: $uni-color-primary;
	}

	.row {
		padding: 5px 0;
	}

	.tips {
		border: 1px dashed #f60;
		padding: 10px;
		border-radius: 8px;
		line-height: 160%;
		color: $uni-text-color-grey;
		margin-bottom: 5px;
	}

	.btn-download {
		background-color: $uni-color-success;
		border: 0;
		border-radius: 5px;
		color: #fff;
		font-size: 14px;
		margin-top: 5px;
	}
</style>