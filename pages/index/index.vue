<template>
	<view class="page page-index">
		<view id="search" class="search" :style="background">
			<image :src="mpLogo || logo" class="logo" mode="heightFix"></image>
			<m-search @focus="go2search"></m-search>
			<view class="radius-block"></view>
		</view>
		<view class="category">
			<view class="row">
				<view class="col-3" v-for="cate in parentCategories" :key="'cate-'+cate.id">
					<navigator :url="`/pages/list/list?category_id=${cate.id}`" hover-class="none">
						<image :src="cate.icon || '/static/images/empty-image.png'" class="icon-small icon-circle">
						</image>
						<view class="font-lv4 ellipsis-1row">{{cate.title}}</view>
					</navigator>
				</view>
			</view>
		</view>
		<view class="recommend">
			<view class="m-card">
				<view class="m-card-header">
					<text class="font-lv2">最新推荐</text>
					<text class="font-lv5 float-right text-grey stats">
						<text>{{stats.document_count || '-'}} 文档</text>
						<text>{{stats.user_count || '-'}} 用户</text>
					</text>
				</view>
				<view class="m-card-body">
					<navigator class="row" hover-class="none" v-for="doc in recommendDocuments" :key="'rcm-'+doc.id"
						:url="'/pages/document/document?id='+doc.id">
						<view class="col-9">
							<view class="font-lv3 ellipsis-1row">
								{{doc.title}}
							</view>
						</view>
						<view class="col-3 text-right text-grey">
							<text class="font-lv5 ellipsis-1row">{{ doc.recommend_at}}</text>
						</view>
					</navigator>
				</view>
			</view>
		</view>

		<view class="banner" v-if="banners.length>0">
			<swiper class="swiper" style="height:120px" circular :indicator-dots="indicatorDots" :autoplay="autoplay"
				:interval="interval" :duration="duration">
				<swiper-item v-for="banner in banners" :key="'banner-'+banner.id" @click="go2(banner.url)">
					<view class="swiper-item">
						<image :src="banner.path" mode="scaleToFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="pdl-15 pdr-15" :class="fixedCategory ? 'fixed-category' : '' "
			:style="`top: ${searchHeight - 10}px;transition:top 0.2s`">
			<scroll-view id="scroll-view" class="hor font-lv3" :scroll-left="scrollLeft" scroll-with-animation scroll-x>
				<view v-for="(doc,idx) in documents" :key="'dc-'+doc.category_id" :data-index="idx" :id="'scroll-'+idx"
					:class="['scroll-item', idx == activeIndex ? 'active': '']" @click="changeCate">
					{{doc.category_name}}
				</view>
			</scroll-view>
		</view>
		<view @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove" id="documents" class="documents"
			:class="fixedCategory? 'documents-fixed-padding': ''" v-if="documents.length>0">
			<view>
				<docList :docs="documents[activeIndex].document || []" />
			</view>
		</view>
		<view>&nbsp;</view>
	</view>
</template>

<script>
	import mSearch from '@/compomnents/search.vue'
	import docList from '@/compomnents/docList.vue'
	import {
		listBanner
	} from '@/api/banner.js'
	import {
		listCategory
	} from '@/api/category.js'
	import {
		listDocument,
		listDocumentForHome
	} from '@/api/document.js'
	import {
		getStats
	} from '@/api/config'
	import {
		relativeTime,
		joinImage,
		formatBytes,
		redirectTo,
	} from '@/utils/util.js'
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		mapGetters
	} from 'pinia'
	export default {
		data() {
			return {
				searchHeight: 0,
				fixedCategory: false,
				title: 'Hello',
				autoplay: true,
				indicatorDots: true,
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				bannerWidth: '100%',
				bannerHeight: 'auto',
				showSearch: false, // 内容完全加载完成之后再显示搜索框
				showHeaderSearch: false,
				banners: [],
				times: 100, // 当iOS未允许访问网络的时候，每3秒请求一次数据
				platform: '',
				background: '',
				categories: [],
				parentCategories: [],
				recommendDocuments: [],
				documents: [],
				activeIndex: 0,
				scrollLeft: 0,
				moveData: {
					startX: 0,
					startY: 0,
					moved: false,
				},
				stats: {},
			}
		},
		components: {
			mSearch,
			docList
		},
		computed:{
			...mapGetters(useSettingStore,['system']),
			logo(){
				return this.system.logo ? joinImage(this.system.logo) : '/static/images/logo-transparent.png'
			},
			mpLogo(){
				return this.system.mp_logo ? joinImage(this.system.mp_logo) : ''
			}
		},
		mounted() {
			const query = uni.createSelectorQuery().in(this)
			query.select('#search').boundingClientRect(res => {
				// console.log('search', res)
				this.searchHeight = res.height
			}).exec()
		},
		async onLoad() {
			await Promise.all([
				this.getStats(),
				this.listBanner(),
				this.listCategory(),
				this.getRecommendDocments(),
				this.listDocumentForHome(),
			])
			uni.setNavigationBarTitle({
				title: this.system.sitename
			})
		},
		onPageScroll(e) {
			console.log('onPageScroll', e)
			const query = uni.createSelectorQuery().in(this)
			query.select('#documents').boundingClientRect(res => {
				console.log('documents', res)
				if (res.top <= this.searchHeight + 45) {
					this.fixedCategory = true
				} else {
					this.fixedCategory = false
				}
			}).exec()
		},
		onShareAppMessage() {
			
		},
		onShareTimeline() {
			
		},
		methods: {
			go2search() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			iswitch(url) {
				uni.switchTab({
					url: url
				})
			},
			go2(url){

				// #ifdef MP
					uni.navigateTo({
						url
					})
				// #endif
				
				// APP or H5
				// #ifndef MP
				const lowerUrl = String(url).toLowerCase()
				if (lowerUrl.indexOf("http://") ===0 || lowerUrl.indexOf("https://") === 0) {
					plus.runtime.openURL(url) // 调用外部浏览器打开
					// plus.runtime.openWeb(url) // app 内打开
				} else {
					uni.navigateTo({
						url
					})
				}
				// #endif
			},
			async getStats() {
				const res = await getStats()
				if (res.statusCode === 200) {
					this.stats = res.data || {}
				}
			},
			async listBanner() {
				const res = await listBanner({
					type: 1, // 小程序横幅
					enable: true
				})
				if (res.statusCode === 200) {
					let banners = res.data.banner || []
					banners = banners.map((item) => {
						item.path = joinImage(item.path)
						return item
					})
					this.banners = banners
				}
			},
			async listCategory() {
				const res = await listCategory()
				if (res.statusCode === 200) {
					let categories = res.data.category || []
					this.categories = categories
					let parentCategories = categories.filter(item => !item.parent_id) || []
					parentCategories = parentCategories.map((item) => {
						item.icon =
							joinImage(item.icon || '')
						return item
					})
					this.parentCategories = parentCategories
				}
			},
			async getRecommendDocments() {
				const res = await listDocument({
					field: ['id', 'title', 'recommend_at', 'is_vip'],
					is_recommend: true,
					order: 'recommend_at desc',
					limit: 5
				})
				if (res.statusCode === 200) {
					this.recommendDocuments = (res.data.document || []).map(item => {
						item.recommend_at = relativeTime(item.recommend_at || item.created_at)
						return item
					})
				}
			},
			async listDocumentForHome() {
				const res = await listDocumentForHome({
					limit: 10,
					field: ['id', 'title', 'ext', 'description', 'created_at', 'size', 'is_vip']
				})
				if (res.statusCode === 200) {
					this.documents = res.data.document || []
				}
			},
			changeCate(e) {
				console.log(e)
				this.activeIndex = e.currentTarget.dataset.index
				let scrollLeft = e.currentTarget.offsetLeft - (uni.getSystemInfoSync().screenWidth / 2 - 50)
				this.scrollLeft = scrollLeft
			},
			touchStart(e) {
				if (e.changedTouches.length > 0) {
					this.moveData.startX = e.changedTouches[0].clientX; //手指按下时的X坐标
					this.moveData.startY = e.changedTouches[0].clientY; //手指按下时的Y坐标
				}
			},
			touchMove(e) {
				this.moveData.moved = true
			},
			touchEnd(e) {
				console.log(this.moveData, e)
				if (this.moveData.moved && e.changedTouches.length > 0) {
					const deltaX = e.changedTouches[0].clientX - this.moveData.startX
					const deltaY = Math.abs(e.changedTouches[0].clientY - this.moveData.startY)
					console.log(deltaX, deltaY)
					if (Math.abs(deltaX) > deltaY) { // 移动了
						if (deltaX > 0) {
							if (this.activeIndex > 0) this.activeIndex--
						} else {
							if (this.activeIndex < this.documents.length - 1) this.activeIndex++
						}
						// 滚动
						this.scrollLeft = (this.activeIndex - 1) * 84
					}

				}
				this.moveData.moved = false
				this.moveData.startX = 0
				this.moveData.startY = 0
			},
		}
	}
</script>

<style lang="scss" scoped>
	.stats{
		text{margin-left: 10px;}
	}
	.logo{
		height: 40px;
		position: absolute;
		top: 40px;
		z-index: 99;
	}
	.search {
		background-color: $uni-color-success;
		padding: 100px 10px 0;
		position: fixed;
		top: 0;
		z-index: 9999;
		width: 100%;
		box-sizing: border-box;

		.radius-block {
			margin-top: 20px;
			margin-left: -10px;
			margin-right: -10px;
			height: 15px;
			background-color: $uni-bg-color-grey;
			border-top-left-radius: 20px;
			border-top-right-radius: 20px;
		}
	}

	.category {
		margin-top: 180px;
		text-align: center;
		padding: 0 10px;
		padding-bottom: 0;
		// border-top-left-radius: 20px;
		// border-top-right-radius: 20px;
		// z-index: 99;
		background-color: $uni-bg-color-grey;

		.col-3 {
			margin-bottom: 20px;
		}
	}

	.recommend {
		padding: 0 10px;
		border-radius: 8px;
		line-height: 180%;
	}

	.banner {
		padding: 15px 10px 10px;

		.swiper {
			border-radius: 8px !important;
			overflow: hidden;

			.swiper-item {
				height: 120px;

				image {
					height: 120px;
					width: 100%;
				}
			}
		}
	}

	.hor {
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		/* 这行CSS样式很重要，不然里面的元素会出现换行，没法实现水平滚动 */
		white-space: nowrap;
		width: 100%;
	}

	.scroll-item {
		width: 60px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		display: inline-block;
		padding: 0 12px;
		height: 45px;
		line-height: 45px;

		&.active {
			color: $uni-color-success;
		}
	}

	.fixed-category {
		position: fixed;
		background-color: $uni-bg-color-grey;
		width: 100%;
		box-sizing: border-box;
		z-index: 999;
		height: 35px;
		.scroll-item{
			height: 35px;
			line-height: 35px;
		}
	}

	.documents-fixed-padding {
		padding-top: 60px; // 45 + 15
	}

	.documents {
		padding: 0 10px;
	}
</style>