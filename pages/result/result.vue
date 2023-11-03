<template>
	<view>
		<mHeader title="搜索" />
		<view class="searchbox">
			<mSearch :wd="query.wd" @search="search" />
		</view>
		<view class="filter" :style="`top: ${headerHeight + 60}px`">
			<view class="row">
				<view class="col filter-cate">
					<picker mode="selector" :range="categories.map(item=>item.title)" :value="filter.cateIndex"
						@change="changeCategory">
						<view>{{categories[filter.cateIndex].title}}</view>
					</picker>
				</view>
				<view class="col filter-ext">
					<picker mode="selector" :range="searchExts.map(item=>item.label)" :value="filter.extIndex"
						@change="changeExt">
						<view>{{searchExts[filter.extIndex].label}}</view>
					</picker>
				</view>
				<view class="col filter-sort">
					<picker mode="selector" :range="searchSorts.map(item=>item.label)" :value="filter.sortIndex"
						@change="changeSort">
						<view>{{searchSorts[filter.sortIndex].label}}</view>
					</picker>
				</view>
				<view class="col filter-duration">
					<picker mode="selector" :range="durationOptions.map(item=>item.label)" :value="filter.durationIndex"
						@change="changeDuration">
						<view>{{durationOptions[filter.durationIndex].label}}</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="result" :style="`top: ${headerHeight + 60 + 40}px`">
			<docList v-if="documents.length>0" :docs="documents" :is-html="true" />
			<view v-if="query.page===0 && documents.length>0" class="no-more">
				-- 这是底线，已无更多数据 --
			</view>
			<m-empty v-if="query.page===0 && documents.length===0" tips="很遗憾, 未能检索到结果"></m-empty>
		</view>
	</view>
</template>

<script>
	const defaultQuery = {
		wd: '',
		page: 1,
		size: 10,
		ext: 'all', // 搜索类型
		sort: 'default', // 排序
		category_id: 0,
		duration: 'all',
	}
	const defaultFilter = {
		extIndex: 0,
		sortIndex: 0,
		durationIndex: 0,
		cateIndex: 0,
	}
	import {
		useSettingStore
	} from '@/stores/settings.js'
	import {
		setLatestSearchKeywords
	} from '@/utils/util.js'
	import {
		listDocument,
		searchDocument
	} from '@/api/document.js'
	import {
		listCategory
	} from '@/api/category.js'
	import {
		mapGetters
	} from 'pinia'
	import {
		getLatestSearchKeywords,
		genTimeDuration,
		getIcon,
		getHeaderHeight,
		joinImage,
	} from '@/utils/util.js'
	import mHeader from "@/compomnents/header.vue"
	import mSearch from '@/compomnents/search.vue'
	import docList from '@/compomnents/docList.vue'
	import mEmpty from '@/compomnents/empty.vue'
	export default {
		components: {
			mHeader,
			mSearch,
			docList,
			mEmpty,
		},
		data() {
			return {
				loading: false,
				query: {
					...defaultQuery,
				},
				categories: [{
					title: '全部分类',
					id: 0
				}],
				keywords: [],
				documents: [], // 搜索结果
				filter: {
					...defaultFilter,
				},
				searchExts: [{
						label: '全部格式',
						value: 'all'
					},
					{
						label: 'PDF',
						value: 'pdf'
					},
					{
						label: 'DOC',
						value: 'doc'
					},
					{
						label: 'PPT',
						value: 'ppt'
					},
					{
						label: 'XLS',
						value: 'xls'
					},
					{
						label: 'TXT',
						value: 'txt'
					},
					{
						label: '其他',
						value: 'other'
					},
				],
				searchSorts: [{
						label: '默认排序',
						value: 'default'
					},
					{
						label: '最新排序',
						value: 'latest'
					},
					{
						label: '页数排序',
						value: 'pages'
					},
					{
						label: '评分排序',
						value: 'score'
					},
					{
						label: '大小排序',
						value: 'size'
					},
					{
						label: '下载排序',
						value: 'download_count'
					},
					{
						label: '浏览排序',
						value: 'view_count'
					},
					{
						label: '收藏排序',
						value: 'favorite_count'
					},
				],
				durationOptions: [{
						label: '全部时间',
						value: 'all'
					},
					{
						label: '最近一天',
						value: 'day'
					},
					{
						label: '最近一周',
						value: 'week'
					},
					{
						label: '最近一个月',
						value: 'month'
					},
					{
						label: '最近三个月',
						value: 'three_month'
					},
					{
						label: '最近半年',
						value: 'half_year'
					},
					{
						label: '最近一年',
						value: 'year'
					},
				],
			}
		},
		computed: {
			...mapGetters(useSettingStore, ['system']),
			headerHeight() {
				return getHeaderHeight()
			}
		},
		created() {
			this.getCategories()
		},
		onShareAppMessage() {

		},
		onShareTimeline() {

		},
		onReachBottom() {
			console.log('onReachBottom', this.query)
			if (this.query.page > 0) {
				this.query.page++
				this.searchDocuments()
			}
		},
		onLoad(args) {
			console.log('result.vue', args)
			if (!args.wd) {
				uni.navigateBack()
				return
			}
			this.query = {
				...defaultQuery,
				wd: args.wd
			}
			this.searchDocuments()
		},
		methods: {
			search(e) {
				if (e.wd) {
					this.query = {
						...defaultQuery,
						wd: e.wd,
						page: 1
					}
					this.filter = {
						...defaultFilter
					}
					this.searchDocuments()
				}
			},
			async getCategories() {
				const res = await listCategory({
					parent_id: 0
				})
				let categories = [{
					id: 0,
					title: '全部分类'
				}]
				if (res.statusCode === 200) {
					categories = [...categories, ...(res.data.category || []).filter(item => item.enable)]
				}
				this.categories = categories
			},
			changeExt(e) {
				this.filter.extIndex = e.detail.value || 0
				this.query.page = 1
				this.query.ext = this.searchExts[this.filter.extIndex].value
				this.searchDocuments()
			},
			changeSort(e) {
				this.filter.sortIndex = e.detail.value || 0
				this.query.page = 1
				this.query.sort = this.searchSorts[this.filter.sortIndex].value
				this.searchDocuments()
			},
			changeCategory(e) {
				this.filter.cateIndex = e.detail.value || 0
				this.query.page = 1
				this.query.category_id = this.categories[this.filter.cateIndex].id
				this.searchDocuments()
			},
			changeDuration(e) {
				this.filter.durationIndex = e.detail.value || 0
				this.query.duration = this.durationOptions[this.filter.durationIndex].value
				this.query.page = 1
				this.searchDocuments()
			},
			async searchDocuments() {
				if (this.query.page === 0) {
					return
				}

				setLatestSearchKeywords(this.query.wd)

				this.loading = true
				const query = {
					...this.query
				}
				if (!query.category_id) {
					delete query.category_id
				}
				query['created_at'] = genTimeDuration(query.duration)
				delete query.duration

				const res = await searchDocument(query)
				if (res.statusCode === 200) {
					this.total = res.data.total
					this.spend = res.data.spend
					const docs = res.data.document || []
					const keywords = []
					let documents = docs.map((doc) => {
						doc.score = doc.score || 300
						doc.score = doc.score / 100
						doc.icon = getIcon(doc.ext)
						try {
							doc.cover = joinImage(`/view/cover/${doc.attachment.hash}`)
						} catch (e) {
							//TODO handle the exception
						}
						try {
							doc.keywords.split(',').map((keyword) => {
								keyword = keyword.trim()
								if (keyword && !keywords.includes(keyword)) {
									keywords.push(keyword)
								}
								return keyword
							})
						} catch (error) {}
						this.keywords = keywords
						return doc
					})

					if (this.query.page > 1) {
						this.documents = [...this.documents, ...documents]
					} else {
						this.documents = documents
						uni.pageScrollTo({
							scrollTop: 0
						})
					}

					if (documents.length === 0) {
						this.query.page = 0
					}
				}
				this.loading = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.searchbox {
		padding: 10px;
		background-color: $uni-color-success;
		position: fixed;
		width: 100%;
		z-index: 99;
		box-sizing: border-box;
	}

	.filter {
		position: fixed;
		z-index: 99;
		background-color: #fff;
		width: 100%;
		padding: 0 10px;
		line-height: 40px;
		height: 40px;
		font-size: 12px;
		border: 1px solid $uni-bg-color-grey;
		box-sizing: border-box;

		picker {
			padding-left: 2.5em;
		}

		.col::before {
			font-size: 12px;
			position: absolute;
			color: $uni-text-color-grey;
		}

		.filter-cate::before {
			content: '分类:';
		}

		.filter-sort::before {
			content: '排序:';
		}

		.filter-ext::before {
			content: '格式:';
		}

		.filter-duration::before {
			content: '时间:';
		}
	}

	.result {
		padding: 10px;
		width: 100%;
		box-sizing: border-box;
		position: absolute;
	}

	.no-more {
		text-align: center;
		font-size: 12px;
		color: #888;
		line-height: 30px;
		margin-top: 10px;
	}
</style>