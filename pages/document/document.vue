<template>
	<view>
		<mHeader :title="document.title" />
		<view class="font-lv2 doc-title">
			<image src="/static/images/pdf_24.png" class="icon-mini"></image>
			<text>{{document.title}}</text>
			<view class="doc-info font-lv4">
				<view>{{formatBytes(document.size)}}</view>
				<view>
					<image src="/static/images/eye.png"></image> {{formatView(document.view_count)}} 浏览
				</view>
				<view>
					<image src="/static/images/credit.png"></image> {{document.price || '0'}} 积分
				</view>
				<!-- 		<view>
					<image src="/static/images/time.png"></image> {{relativeTime(document.created_at)}}
				</view> -->
				<view class="author" v-if="document.user">
					<navigator hover-class="none" :url="'/pages/user/user?id='+document.user.id">
						<image src="/static/images/user.png"></image>
						<text>{{document.user.username || '-'}}</text>
					</navigator>
				</view>
			</view>
		</view>
		<view class="doc-pages">
			<image class="doc-page" :src="page" v-for="page in pages" :key="page" lazy-load
				:style="`width: ${document.width}px;height: ${document.height}px`"></image>
			<view v-if="document.preview - pages.length > 0" class="text-muted">
				还有 <text>{{ document.preview - pages.length }}</text> 页可预览
			</view>
			<template v-else>
				<view v-if="document.pages != document.preview" class="text-muted">
					- 可预览页数已用完，剩余
					<text>{{ document.pages - document.preview }}</text> 页请下载阅读 -
				</view>
			</template>
			<view class="continue-read">
				<button @click="continueRead"
					:disabled="document.pages != document.preview || pages.length===document.pages">继续阅读</button>
			</view>
		</view>
		<!-- 相关文档 -->
		<view class="related-documents">
			<view class="m-card">
				<view class="m-card-header">相关文档</view>
				<view class="m-card-body">
					<doc-list :docs="relatedDocuments"></doc-list>
				</view>
			</view>
		</view>

		<view class="fixed-footer">
			<view class="item item-share">
				<image src="/static/images/share.png"></image>
				<view>分享</view>
			</view>
			<view class="item item-favorite">
				<image src="/static/images/favorite.png"></image>
				<view>收藏</view>
			</view>
			<view class="item item-comment">
				<image src="/static/images/comment.png"></image>
				<view>点评</view>
			</view>
			<!-- <view class="item item-price">
				123 魔豆
			</view> -->
			<view class="item item-button">
				<button type="default" class="btn-download">获取文档</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		debug
	} from '@/config.js'
	import mHeader from '@/compomnents/header.vue'
	import docList from '@/compomnents/docList.vue'
	import {
		getDocument,
		getRelatedDocuments
	} from '@/api/document.js'
	import {
		formatBytes,
		relativeTime,
		formatView,
		joinImage,
	} from '@/utils/util.js'
	import {
		useSettingStore,
	} from '@/stores/settings.js'
	import {
		mapGetters,
	} from 'pinia'
	export default {
		data() {
			return {
				args: {
					id: ''
				},
				document: {
					id: 0
				},
				pages: [],
				relatedDocuments: [],
				pagesPerRead: 5,
			}
		},
		components: {
			mHeader,
			docList,
		},
		onLoad(args) {
			if (debug) {
				console.log('onLoad args', args)
			}
			this.args = {
				...this.args,
				...args
			}
			this.getDocument()
			this.getRelatedDocuments()
		},
		computed: {
			...mapGetters(useSettingStore, ['display'])
		},
		methods: {
			formatBytes,
			relativeTime,
			formatView,
			async getDocument() {
				const res = await getDocument({
					id: this.args.id,
					with_author: true
				})
				if (debug) {
					console.log('getDocument', res, this.args)
				}
				if (res.statusCode === 200) {
					let document = {
						id: 0,
						...res.data
					}

					if (!document.preview || document.preview >= document.pages) {
						document.preview = document.pages
					}

					// 限定每次预览页数
					let preview = 2
					if (document.preview < preview) {
						preview = document.preview
					}

					const sysInfo = uni.getSystemInfoSync()
					const pageWidth = sysInfo.screenWidth - 5 - 5 // 左右5px
					const pageHeight = pageWidth * (document.height || 100) / (document.width || 100)
					document.width = pageWidth
					document.height = pageHeight

					// 限定预览页数，拼装图片链接
					const pages = []
					for (let i = 1; i <= preview; i++) {
						const src = document.enable_gzip ?
							`/view/page/${document.attachment.hash}/${i}.gzip.svg` :
							`/view/page/${document.attachment.hash}/${i}.svg`
						pages.push(joinImage(src))
					}
					this.pages = pages
					this.document = document
				}
			},
			async getRelatedDocuments() {
				const res = await getRelatedDocuments({
					id: this.args.id
				})
				if (debug) {
					console.log('getRelatedDocuments', res)
				}
				if (res.statusCode === 200) {
					this.relatedDocuments = (res.data.document || []).map(item => {
						item.cover = `/view/cover/${item.attachment.hash}`
						return item
					})
				}
			},
			continueRead() {
				let pagesPerRead =
					this.display.pages_per_read || this.pagesPerRead
				let end = this.pages.length + pagesPerRead
				if (end > this.document.preview) {
					end = this.document.preview
				}
				let j = 0
				let startLazyLoad = 2
				for (let i = this.pages.length + 1; i <= end; i++) {
					j += 1
					const src = this.document.enable_gzip ?
						`/view/page/${this.document.attachment.hash}/${i}.gzip.svg` :
						`/view/page/${this.document.attachment.hash}/${i}.svg`
					this.pages.push(joinImage(src))
				}
			},
			previewImage(page) {
				uni.previewImage({
					urls: this.pages,
					current: page,
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	image {
		background-color: #fff;
	}

	.doc-title {
		padding: 15px;
		box-sizing: border-box;

		.icon-mini {
			vertical-align: bottom;
			margin-right: 5px;
			height: 20px;
			width: 20px;
		}

		.doc-info {
			margin-top: 10px;
			color: $uni-bg-color-mask;
			display: flex;

			&>view {
				flex: 2;
			}

			.author {
				flex: 3;
				text-align: right;
			}

			image {
				width: 12px;
				height: 12px;
				position: relative;
				top: 1px;
				margin-right: 1px;
			}
		}
	}

	.doc-pages {
		padding: 5px;

		.doc-page {
			background-color: #fff;
			border-radius: 8px;
			margin-bottom: 5px;

			image {
				width: 100%;
			}
		}

		.text-muted {
			color: $uni-color-subtitle;
			font-size: 13px;
			text-align: center;
			margin-bottom: 10px;

			text {
				color: $uni-color-error;
			}
		}
	}

	.continue-read {
		button {
			line-height: 260%;
			font-size: 15px;
		}
	}

	.related-documents {
		margin-top: 15px;
		padding: 0 5px 15px;

		.m-card-body {
			padding: 0;
		}

		.row {
			border-bottom: 1px solid $uni-bg-color-grey;
			padding-bottom: 15px;
		}
	}

	.m-card {
		margin-bottom: 60px;
	}

	.fixed-footer {
		width: 100%;
		height: 60px;
		display: flex;
		bottom: 0;
		position: fixed;
		background-color: #fff;
		text-align: center;
		font-size: 12px;
		align-items: center;
		border-top: 1px solid #eee;
		box-sizing: border-box;
		font-weight: 500;
		z-index: 99;

		image {
			width: 18px;
			height: 18px;
			box-sizing: border-box;
		}

		.item {
			flex: 1;
		}

		.item-share {
			image {
				padding: 1px;
			}
		}

		.item-button {
			flex: 3;
			padding: 0 15px;

			.btn-download {
				background-color: $uni-color-success;
				border: 0;
				border-radius: 8px;
				color: #fff;
				font-size: 14px;
			}
		}

	}
</style>