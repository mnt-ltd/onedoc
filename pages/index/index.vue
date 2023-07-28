<template>
	<view class="page page-index">
		<view class="search" :style="background">
			<m-search @focus="go2search"></m-search>
		</view>
		<view class="category">
			<view class="row">
				<view class="col-3" v-for="cate in parentCategories" :key="'cate-'+cate.id">
					<navigator :url="'/pages/category/category'">
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
					<text class="font-lv5 float-right text-grey">
						<text>13123 文档</text>
						<text>123 用户</text>
					</text>
				</view>
				<view class="m-card-body">
					<view class="row" v-for="doc in recommendDocuments" :key="'rcm-'+doc.id">
						<view class="col-9">
							<view class="font-lv3 ellipsis-1row">
								{{doc.title}}
							</view>
						</view>
						<view class="col-3 text-right text-grey">
							<text class="font-lv5 ellipsis-1row">{{ doc.recommend_at}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="banner" v-if="banners.length>0">
			<swiper class="swiper" style="height:120px" circular :indicator-dots="indicatorDots" :autoplay="autoplay"
				:interval="interval" :duration="duration">
				<swiper-item v-for="banner in banners" :key="'banner-'+banner.id">
					<view class="swiper-item">
						<image :src="banner.path" mode="scaleToFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="pdl-15 pdr-15">
			<scroll-view scroll-with-animation class="hor font-lv3" scroll-x>
				<view v-for="(doc,idx) in documents" :key="'dc-'+doc.category_id"
					:class="['scroll-item', idx == activeIndex ? 'active': '']" @click="activeIndex=idx">{{doc.category_name}}</view>
			</scroll-view>
		</view>
		<view class="documents" v-if="documents.length>0">
			<view>
				<view class="row" v-for="doc in (documents[activeIndex].document || [])" :key="'dl-'+doc.id" >
					<view class="col-3">
						<image src="/static/logo.png" style="width: 80%;" mode="widthFix"></image>
					</view>
					<view class="col-9">
						<view>{{doc.title}}</view>
						<view>{{doc.created_at}}</view>
					</view>
				</view>
			</view>
		</view>
		<view>&nbsp;</view>
	</view>
</template>

<script>
	import mSearch from '@/compomnents/search.vue'
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
		relativeTime
	} from '@/utils/util.js'
	export default {
		data() {
			return {
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
			}
		},
		components: {
			mSearch,
		},
		onLoad() {
			this.listBanner()
			this.listCategory()
			this.getRecommendDocments()
			this.listDocumentForHome()
		},
		methods: {
			go2search() {
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			async listBanner() {
				const res = await listBanner({
					type: 1, // 小程序横幅
					enable: true
				})
				if (res.statusCode === 200) {
					this.banners = res.data.banner || []
				} else {
					console.log('listBanner', res)
				}
			},
			async listCategory() {
				const res = await listCategory()
				if (res.statusCode === 200) {
					let categories = res.data.category || []
					this.categories = categories
					this.parentCategories = categories.filter(item => !item.parent_id)
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
				const res = await listDocumentForHome()
				if (res.statusCode === 200) {
					this.documents = res.data.document || []
				}
			},
			changeCate(cate) {
				console.log(cate)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		background-image: url(../../static/images/logo-transparent.png?id=1);
		background-color: $uni-color-success;
		background-size: auto 40px;
		background-repeat: no-repeat;
		background-position: 10px 40px;
		padding: 100px 10px 50px;
	}

	.category {
		text-align: center;
		padding: 20px;
		padding-bottom: 0;
		border-top-left-radius: 20px;
		border-top-right-radius: 20px;
		z-index: 99;
		margin-top: -30px;
		background-color: $uni-bg-color-grey;

		.col-3 {
			margin-bottom: 20px;
		}
	}

	.recommend {
		padding: 0 15px;
		border-radius: 8px;
		line-height: 180%;
	}

	.banner {
		padding: 15px;

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
	}

	.scroll-item {
		max-width: 130px;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
		display: inline;
		padding: 0 12px;
		height: 45px;
		line-height: 45px;
		&.active{
			color: $uni-color-success;
		}
	}
	.documents{
		padding: 0 15px;
		&>view{
			margin-bottom: 20px;
			padding: 15px;
			background-color: #fff;
			border-radius: 8px;
			box-sizing: border-box;
			.row{
				margin-bottom: 15px;
			}
		}
	}
</style>