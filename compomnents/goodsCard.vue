<template>
	<view class="com-goods-card">
		<template v-if="order.status === 2 && download.free_download_duration > 0">
			<view v-if="document.is_expired" class="tips">
				您当前订单购买的文档于
				<text class="danger">{{
				  formatTime(new Date(document.expired_at))
				}}</text>
				过期，已无法继续免费下载，请重新购买。
			</view>
			<view v-else-if="document.expired_at" class="tips">
				您购买的文档有效期截止
				<text class="danger">{{
				  formatTime(new Date(document.expired_at))
				}}</text>，到期之前您可以免费下载。
			</view>
		</template>
		<view class="row">
			<view class="col-3 item-title">
				文档
			</view>
			<view class="col-9 item-content">
				<navigator :url="`/pages/document/document?id=${document.id}`" hover-class="none" class="primary">
					{{ document.title }}{{ document.ext }}
				</navigator>
				<view>
					<button v-if="order.status === 2 && !document.is_expired" type="default" class="btn-download"
						size="mini" @click="downloadDocument">下载文档</button>
				</view>
			</view>
		</view>
		<view class="row">
			<view class="col-3 item-title">
				评分
			</view>
			<view class="col-9 item-content">
				{{document.score}}
			</view>
		</view>
		<view class="row">
			<view class="col-3 item-title">
				大小
			</view>
			<view class="col-9 item-content">
				{{formatBytes(document.size)}}
			</view>
		</view>
		<view class="row">
			<view class="col-3 item-title">
				页数
			</view>
			<view class="col-9 item-content">
				{{document.pages || '-'}} 页
			</view>
		</view>
		<view class="row">
			<view class="col-3 item-title">
				浏览
			</view>
			<view class="col-9 item-content">
				{{document.view_count || 0}}
			</view>
		</view>
		<view class="row">
			<view class="col-3 item-title">
				收藏
			</view>
			<view class="col-9 item-content">
				{{document.favorite_count || 0}}
			</view>
		</view>
	</view>
</template>

<script>
	import {
		formatBytes,
		formatTime,
		downloadFile,
		toastError,
		toastSuccess,
	} from '@/utils/util.js'
	import {
		getDocument,
		downloadDocument,
	} from '@/api/document.js'
	import {
		useSettingStore
	} from '@/stores/settings.js'
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
				handler: function(val) {
					// 默认
					this.document = {
						title: val.product_name,
					}
					this.getGoods()
				},
				deep: true,
				immediate: true,
			},
		},
		data() {
			return {
				document: {},
				loading: false,
				downloadTask: null,
			}
		},
		computed: {
			...mapGetters(useSettingStore, ['download'])
		},
		onUnload() {
			try{
				this.downloadTask.abort()
			}catch(e){
				//TODO handle the exception
			}
		},
		methods: {
			formatBytes,
			formatTime,
			async getGoods() {
				if (!this.order.product_id) return
				this.getDocument()
			},
			async getDocument() {
				const res = await getDocument({
					id: this.order.product_id
				})
				if (res.statusCode === 200) {
					let document = res.data || {
						score: 0
					}
					document.score = (document.score / 100).toFixed(1)
					if (this.download.free_download_duration > 0) {
						// 免费下载有效期，时间格式转换
						try {
							const expiredAt = new Date(
								new Date(this.order.paid_at).getTime() +
								this.download.free_download_duration *
								24 *
								60 *
								60 *
								1000
							)
							document.expired_at = expiredAt.Format('yyyy-MM-dd hh:mm:ss')
							document.is_expired = expiredAt.getTime() < new Date().getTime()
						} catch (error) {}
					}

					this.document = document
				}
			},
			async downloadDocument() {
				const res = await downloadDocument({
					id: this.document.id
				})

				if (res.statusCode === 200) {
					let url = res.data.url || ''
					if (url.indexOf('//') ===0) {
						url = 'https:' + url
					}
					this.downloadTask = downloadFile(url, this.document.title+this.document.ext)
				} else {
					toastError(res.data.message || '下载失败')
				}
			}
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