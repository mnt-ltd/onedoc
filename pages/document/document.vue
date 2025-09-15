<template>
	<view>
		<mHeader :title="document.title" />
		<view class="font-lv2 doc-title">
			<image :src="`/static/images/${getIcon(document.ext)}_24.png`" class="icon-mini"></image>
			<text>{{document.title}}</text>
			<image src="/static/images/icon-vip-doc.png" v-if="document.is_vip" class="icon-mini icon-vip"
				mode="heightFix"></image>
			<view class="doc-info font-lv4">
				<view>{{formatBytes(document.size)}}</view>
				<!-- <view>
					<image src="/static/images/eye.png"></image> {{formatView(document.view_count)}} 浏览
				</view> -->
				<view>
					<image src="/static/images/document.png"></image> {{ document.pages || '-' }} 页
				</view>
				<view>
					<image src="/static/images/credit.png"></image> {{document.price || '0'}}
					{{system.credit_name || '积分'}}
				</view>
				<!-- 		<view>
					<image src="/static/images/time.png"></image> {{relativeTime(document.created_at)}}
				</view> -->
				<view class="author" v-if="document.user">
					<!-- <navigator hover-class="none" :url="'/pages/user/user?id='+document.user.id"> -->
					<image src="/static/images/user.png"></image>
					<text>{{document.user.username || '-'}}</text>
					<!-- </navigator> -->
				</view>
			</view>
		</view>
		<view class="doc-pages">
			<!-- 预览控制工具栏 -->
			<view class="preview-controls" v-if="pages.length > 0">
				<view class="control-btn" @click="zoomOut">
					<text class="control-icon">－</text>
					<text>缩小</text>
				</view>
				<view class="control-btn" @click="zoomIn">
					<text class="control-icon">＋</text>
					<text>放大</text>
				</view>
				<view class="control-btn" @click="resetZoom">
					<text class="control-icon">○</text>
					<text>重置</text>
				</view>
				<view class="zoom-info">
					<text>{{Math.round(scaleValue * 100)}}%</text>
				</view>
			</view>
			
			<!-- 文档预览区域 -->
			<view class="preview-container">
				<view 
					class="doc-pages-wrapper" 
					:style="`min-width: ${contentWidth*scaleValue}px`">
					<view 
						class="doc-pages-content" 
						ref="docPagesContent"
						:style="`transform: scale(${scaleValue}); transform-origin: center top;`">
						<image 
							class="doc-page" 
							:src="page" 
							v-for="(page, index) in pages" 
							:key="page" 
							lazy-load
							@click="previewImage(page)"
							:style="`width: ${document.width}px;height: ${document.height}px; margin-bottom: 10px;`">
						</image>
					</view>
				</view>
			</view>
			<view v-if="document.preview - pages.length > 0" class="text-muted">
				共 <text>{{ document.pages }}</text> 页，还有 <text>{{ document.preview - pages.length }}</text> 页可预览
			</view>
			<template v-else>
				<view v-if="document.pages != document.preview" class="text-muted">
					- 可预览页数已用完，剩余
					<text>{{ document.pages - document.preview }}</text> 页请下载阅读 -
				</view>
				<view v-else class="text-muted">
					- 文档已阅读完 -
				</view>

			</template>
			<view class="continue-read">
				<button @click="continueRead" :disabled="!(document.preview - pages.length > 0)">继续阅读</button>
			</view>
		</view>
		<!-- 相关文档 -->
		<view class="related-documents">
			<view class="m-card">
				<view class="m-card-header">相关文档</view>
				<view class="m-card-body">
					<!-- <doc-list :docs="relatedDocuments"></doc-list> -->
					<scroll-document :docs="relatedDocuments" />
				</view>
			</view>
		</view>

		<view class="comment-box">
			<view class="m-card">
				<view class="m-card-header">文档点评</view>
				<view class="m-card-body">
					<comment-list ref="commentList" @reply="go2comment" :documentId="document.id" />
				</view>
			</view>
		</view>
		<view>&nbsp;</view>
		<view class="fixed-footer">
			<button class="item item-share" type="default" open-type="share" plain="true">
				<image src="/static/images/share.png"></image>
				<view>分享</view>
			</button>
			<view class="item item-favorite" v-if="favorite.id>0" @click="deleteFavorite">
				<image src="/static/images/favorite-selected.png"></image>
				<view>收藏</view>
			</view>
			<view class="item item-favorite" v-else @click="createFavorite">
				<image src="/static/images/favorite.png"></image>
				<view>收藏</view>
			</view>
			<view class="item item-comment" @click="go2comment">
				<image src="/static/images/comment.png"></image>
				<view>点评</view>
			</view>
			<view class="item item-button">
				<!-- 文档是VIP文档，用户是VIP用户 -->
				<view class="btns" v-if="user.is_vip && document.is_vip">
					<view class="row">
						<view class="col">
							<button type="warning" class="btn-download" @click="vipDownload">VIP下载</button>
						</view>
						<view class="col">
							<button type="default" class="btn-download" @click="buyDocument">普通下载</button>
						</view>
					</view>
				</view>
				<button v-else type="default" class="btn-download" @click="buyDocument">获取文档</button>
			</view>
		</view>
	</view>
</template>

<script>
	let downloadTask = null
	import {
		debug
	} from '@/config.js'
	import mHeader from '@/compomnents/header.vue'
	import docList from '@/compomnents/docList.vue'
	import commentList from '@/compomnents/commentList.vue'
	import scrollDocument from '@/compomnents/scrollDocument.vue'
	import formComment from '@/compomnents/formComment.vue'
	import {
		getDocument,
		getRelatedDocuments,
		downloadDocument,
		downloadVIPDocument,
	} from '@/api/document.js'
	import {
		formatBytes,
		relativeTime,
		formatView,
		joinImage,
		toastError,
		toastSuccess,
		getIcon,
		downloadFile,
		genPreviewPage,
	} from '@/utils/util.js'
	import {
		useSettingStore,
	} from '@/stores/settings.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		createOrder
	} from '@/api/order.js'
	import {
		orderTypeBuyDocument
	} from '@/utils/enum.js'
	import {
		mapGetters,
	} from 'pinia'
	import {
		getFavorite,
		createFavorite,
		deleteFavorite
	} from '@/api/favorite'
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
				favorite: {
					id: 0
				},
				comment: {},
				// 预览相关状态
				scaleValue: 1,
				// 内容区域尺寸
				contentWidth: 0,
				contentHeight: 0,
			}
		},
		components: {
			mHeader,
			docList,
			scrollDocument,
			commentList,
			formComment,
		},
		onLoad(args) {
			if (debug) {
				console.log('onLoad args', args)
			}
			const id = args.id || args.scene
			this.args = {
				...this.args,
				...args,
				id,
			}

			if (!id) {
				toastError('文档ID不能为空')
				return
			}
		},
		onShow() {
			try {
				this.$refs.commentList.getComments()
			} catch (e) {
				//TODO handle the exception
				console.log(e)
			}
			Promise.all([
				this.getDocument(),
				this.getRelatedDocuments(),
				this.getFavorite(),
			])
		},
		onUnload() {
			try {
				// 取消下载
				downloadTask.abort()
			} catch (e) {
				//TODO handle the exception
			}
		},
		onShareAppMessage() {
			return {
				title: this.document.title
			}
		},
		onShareTimeline() {
			return {
				title: this.document.title
			}
		},
		computed: {
			...mapGetters(useSettingStore, ['display', 'system']),
			...mapGetters(useUserStore, ['user'])
		},
		methods: {
			formatBytes,
			relativeTime,
			formatView,
			getIcon,
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
						const src = genPreviewPage(document.attachment.hash, i, document.preview_ext, document
							.enable_gzip)
						pages.push(joinImage(src))
					}
					this.pages = pages
					this.document = document
					// 初始化时获取内容尺寸
					this.getContentDimensions()
				}
			},
			async vipDownload() {
				// VIP用户下载文档
				if (!this.user.is_vip) {
					toastError('您不是VIP用户，无法使用VIP下载')
					return
				}

				uni.showModal({
					title: '温馨提示',
					content: '使用VIP下载将会消耗您的免费下载额度，您确定要使用VIP下载吗？',
					success: async (res) => {
						if (res.confirm) {
							const res = await downloadVIPDocument({
								id: this.args.id
							})
							if (res.statusCode === 200) {
								downloadTask = downloadFile(res.data.url, this.document.title + this
									.document.ext)
							} else {
								toastError(res.data.message || '下载失败')
							}
						}
					}
				})
			},
			go2comment(comment) {
				let args = {
					document_id: this.document.id,
					...comment
				}
				let username = ''
				if (args.user && args.user.username) username = args.user.username
				let commentURL =
					`/pages/comment/comment?document_id=${args.document_id}&comment_id=${args.id || 0}&reply_user=${username}`

				if (!this.user.id) {
					uni.navigateTo({
						url: '/pages/login/login?redirect=' + encodeURIComponent(commentURL)
					})
					return
				}
				uni.navigateTo({
					url: commentURL
				})
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
						item.cover = joinImage(`/view/cover/${item.attachment.hash}`)
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
					const src = genPreviewPage(this.document.attachment.hash, i, this.document.preview_ext, this.document.enable_gzip)
					this.pages.push(joinImage(src))
				}
			},
			previewImage(page) {
				// 已有放大缩小功能，不再提供自带的prevewImage的方式，反而影响体验
				// uni.previewImage({
				// 	urls: this.pages,
				// 	current: page,
				// })
			},
			async deleteFavorite() {
				const res = await deleteFavorite({
					id: this.favorite.id
				})
				if (res.statusCode === 200) {
					toastSuccess('取消收藏成功')
					this.favorite = {
						id: 0
					}
				} else {
					toastError(res.data.message || '取消收藏失败')
				}
			},
			async createFavorite() {
				const documentURL = `/pages/document/document?id=${this.document.id}`
				if (!this.user.id) {
					uni.navigateTo({
						url: '/pages/login/login?redirect=' + encodeURIComponent(documentURL)
					})
					return
				}
				const res = await createFavorite({
					document_id: this.document.id,
				})
				if (res.statusCode === 200) {
					toastSuccess('收藏成功')
					this.favorite = res.data
				} else {
					toastError(res.data.message || '收藏失败')
				}
			},
			async getFavorite() {
				const res = await getFavorite({
					document_id: this.args.id
				})
				if (res.statusCode === 200) {
					this.favorite = res.data || {
						id: 0
					}
				}
			},
			// 购买文档
			// 1. 未登录，跳转到登录
			// 2. 已购买文档，则提示已购买是否直接下载
			// 3. 未购买文档
			// 3.1 VIP用户，弹出VIP额度购买还是直接购买
			// 3.2 普通用户或者直接购买，则创建购买订单
			// 4. 跳转订单页面或直接下载
			async buyDocument() {
				if (!this.user || this.user.id <= 0) {
					// 未登录，跳转登录页面
					let redirect = encodeURIComponent('/pages/document/document?id=' + this.document.id)
					uni.navigateTo({
						url: '/pages/login/login?redirect=' + redirect
					})
					return
				}

				// 创建订单
				const res = await createOrder({
					order_type: orderTypeBuyDocument,
					product_id: this.document.id,
				})
				if (res.statusCode === 200) {
					// 订单状态为待支付，跳转到支付页面
					if (res.data.status === 1) {
						uni.navigateTo({
							url: `/pages/orderdetail/orderdetail?order_no=${res.data.order_no}`
						})
						return
					} else if (res.data.status === 2) {
						toastSuccess('您已购买过该文档，正在为您下载')
						this.execDownload()
					}
				} else {
					console.log(res)
					toastError(res.data.message || '获取文档失败')
				}
			},
			async execDownload() {
				const res = await downloadDocument({
					id: this.document.id
				})
				if (res.statusCode === 200) {
					downloadTask = downloadFile(res.data.url, this.document.title + this.document.ext)
				} else {
					toastError(res.data.message || '下载失败')
				}
			},
			// 获取内容区域的实际尺寸
			getContentDimensions() {
				this.$nextTick(() => {
					try {
						const query = uni.createSelectorQuery().in(this)
						query.select('.doc-pages-content').boundingClientRect((rect) => {
							if (rect) {
								this.contentWidth = rect.width
								this.contentHeight = rect.height
							}
						}).exec()
					} catch (e) {
						console.log('获取内容尺寸失败:', e)
					}
				})
			},
			// 缩放控制方法
			zoomIn() {
				if (this.scaleValue < 3) {
					this.scaleValue = Math.min(3, parseFloat((this.scaleValue + 0.05).toFixed(2)))
				}
			},
			zoomOut() {
				if (this.scaleValue > 0.5) {
					let newScale = Math.max(0.5, this.scaleValue - 0.05)
					newScale = parseFloat(newScale.toFixed(2))
					if (newScale < 1) newScale=1
					this.scaleValue = newScale
				}
			},
			resetZoom() {
				this.scaleValue = 1
			},
		}
	}
</script>

<style scoped lang="scss">
	.doc-title {
		padding: 15px;
		box-sizing: border-box;

		.icon-mini {
			vertical-align: bottom;
			margin-right: 5px;
			height: 20px;
			width: 20px;

			&.icon-vip {
				width: auto;
				margin-left: 5px;
			}
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
		position: relative;

		// 预览控制工具栏样式
		.preview-controls {
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 6px;
			background-color: rgba(255, 255, 255, 0.95);
			border-radius: 6px;
			margin: 8px;
			gap: 8px;
			position: fixed;
			bottom: 80px;
			left: 50%;
			transform: translateX(-50%);
			z-index: 999;
			box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
			border: 1px solid rgba(0, 0, 0, 0.08);

			.control-btn {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 6px;
				background-color: #fff;
				border-radius: 4px;
				box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
				min-width: 36px;
				transition: all 0.2s;

				&:active {
					transform: scale(0.95);
					box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
				}

				.control-icon {
					font-size: 14px;
					font-weight: bold;
					color: #333;
					margin-bottom: 2px;
					line-height: 1;
				}

				text {
					font-size: 10px;
					color: #333;
				}
			}

			.zoom-info {
				padding: 6px 8px;
				background-color: rgba(0, 0, 0, 0.7);
				border-radius: 4px;
				text {
					color: #fff;
					font-size: 10px;
					font-weight: bold;
				}
			}
		}

		// 预览容器样式
		.preview-container {
			position: relative;
			overflow-x: auto;
			overflow-y: auto;

			.doc-pages-wrapper {
				width: 100%;
				padding: 5px;
				display: flex;
				justify-content: center;
				align-items: flex-start;
				box-sizing: border-box;

				.doc-pages-content {
					display: flex;
					flex-direction: column;
					align-items: center;
					transition: transform 0.2s ease;
				}
			}
		}

		.doc-page {
			background-color: #fff;
			border-radius: 8px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
			cursor: pointer;
			transition: all 0.2s;

			&:hover {
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
		margin-top: 10px;
		padding: 0 5px 10px;

		.m-card-body {
			padding: 8px;
		}

		.row {
			border-bottom: 1px solid $uni-bg-color-grey;
			padding-bottom: 15px;
		}
	}

	.comment-box {
		margin-bottom: 50px;
		padding: 0 5px;
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
			border: 0;
		}

		.item-share {
			border: 0;
			background-color: #fff;
			font-size: 12px;
			line-height: 18px;
			padding-left: 0;
			padding-right: 0;

			image {
				padding: 1px;
			}
		}

		.item-favorite {
			image {
				width: 19px;
				height: 19px;
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

			.btns {
				border-radius: 8px;
				overflow: hidden;

				.btn-download {
					border-radius: 0;
					border: 0;

					&[type=warning] {
						background-color: #f60;
					}
				}
			}
		}

	}
</style>