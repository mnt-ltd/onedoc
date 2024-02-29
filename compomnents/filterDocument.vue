<template>
	<view>
		<mHeaderSearch @focus="go2search" />
		<view class="filter font-lv3" id="filter" :style="`top: ${headerHeight}px`">
			<scroll-category :activeId="query.category_id" :categories="categories" @change="changeCategory" />
			<view class="menu" @click="openDrawer">
				<image src="/static/images/menu2.png"></image>
			</view>
		</view>
		<view class="drawer" :class="visibleDrawer?'open':''" id="drawer"
			:style="`top: ${headerHeight}px;height: calc(100vh - ${headerHeight}px)`" @click="closeDrawer">
			<view class="drawer-main" id="drawer-main" :style="`height: calc(100vh - ${headerHeight}px)`">
				<view class="item">
					<view class="item-title">分类</view>
					<view class="item-value">
						<view :class="!query.category_id ? 'active' : ''" @click="changeCategory(null)">
							不限
						</view>
						<view v-for="(cate, idx) in categories" :class="cate.id === query.category_id ? 'active' : ''"
							:key="'cate' + cate.id" @click="changeCategory(cate.id)">
							{{ cate.title }}
						</view>
					</view>
				</view>
				<view class="item">
					<view class="item-title">类型</view>
					<view class="item-value">
						<view v-for="(ext, idx) in extOptions" :class="query.ext === ext.value ? 'active' : ''"
							:key="'ext-' + ext.value" @click="changeExt(ext.value)">
							{{ ext.label }}
						</view>
					</view>
				</view>
				<view class="item">
					<view class="item-title">费用</view>
					<view class="item-value">
						<view v-for="(feeType, idx) in feeTypeOptions"
							:class="query.fee_type === feeType.value ? 'active' : ''" :key="'feeType-' + feeType.value"
							@click="changeFeeType(feeType.value)">
							{{ feeType.label }}
						</view>
					</view>
				</view>
				<view class="item">
					<view class="item-title">排序</view>
					<view class="item-value">
						<view v-for="(sort, idx) in sortOptions" :class="query.sort === sort.value ? 'active' : ''"
							:key="'sort-' + sort.value" @click="changeSort(sort.value)">
							{{ sort.label }}
						</view>
					</view>
				</view>
				<view class="item" v-if="(language || []).length>0">
					<view class="item-title">语言</view>
					<view class="item-value">
						<view :class="!query.language ? 'active' : ''" @click="changeLanguage(null)">
							不限
						</view>
						<view v-for="(lang, idx) in language" :class="query.language === lang.code ? 'active' : ''"
							:key="'lang-' + lang.code" @click="changeLanguage(lang.code)">
							{{ lang.language }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="list" :style="`margin-top: ${filterHeight + 40}px`" @touchstart="touchStart" @touchend="touchEnd"
			@touchmove="touchMove">
			<docList v-if="documents.length > 0" :docs="documents" />
			<mEmpty v-else />
		</view>
		<view>&nbsp;</view>
	</view>
</template>

<script>
	import mHeaderSearch from "@/compomnents/headerSearch.vue";
	import scrollCategory from '@/compomnents/scrollCategory.vue'
	import mEmpty from "@/compomnents/empty.vue";
	import docList from "@/compomnents/docList";
	import {
		listDocument
	} from "@/api/document.js";
	import {
		listCategory
	} from "@/api/category.js";
	import {
		categoryToTree,
		getHeaderHeight
	} from "@/utils/util.js";
	import {
		feeTypeOptions,
		extOptions,
		sortOptions
	} from "@/utils/enum.js";
	import {
		useSettingStore
	} from '@/stores/settings.js';
	import {
		mapGetters
	} from 'pinia'
	export default {
		name: "filterDocument",
		props: {
			args: {
				type: Object,
				default: () => {
					return {};
				},
			},
		},
		data() {
			return {
				feeTypeOptions,
				extOptions,
				sortOptions,
				categories: [],
				documents: [],
				total: 0,
				query: {
					order: "",
					sort: "default",
					ext: "",
					category_id: 0,
					fee_type: "",
					page: 1,
					size: 10,
					language: null,
				},
				headerHeight: getHeaderHeight(),
				filterHeight: 0,
				loading: false,
				visibleDrawer: false,
				moveData: {
					startX: 0,
					startY: 0,
					moved: false,
				},
			};
		},
		computed: {
			...mapGetters(useSettingStore, ['language'])
		},
		components: {
			mHeaderSearch,
			docList,
			mEmpty,
			scrollCategory,
		},
		watch: {
			args: {
				handler: function(val) {
					console.log('filter document args', val)
					this.query = {
						...this.query,
						...val
					}
					this.loadData(val);
				},
				immediate: true,
			},
		},
		methods: {
			loadNext() {
				if (this.query.page > 0) {
					if (this.loading) return;
					this.query.page++;
					this.getDocuments();
				}
			},
			loadData(args) {
				this.query.category_id = parseInt(args.category_id) || null;
				Promise.all([this.getCategories(), this.getDocuments()]);
			},
			go2search() {
				uni.navigateTo({
					url: "/pages/search/search",
				});
			},
			async getCategories() {
				let res = await listCategory();
				if (res.statusCode === 200) {
					let categories = res.data.category || [];
					let tree = categoryToTree(categories) || [];
					this.categories = tree.filter(item => item.enable); // 只显示启用的分类
				}
			},
			changeCategory(categoryId) {
				console.log(categoryId)
				this.query.category_id = categoryId;
				this.query.page = 1;
				this.query.language = null
				this.getDocuments();
			},
			changeLanguage(lang) {
				this.query.page = 1
				this.query.language = lang
				this.getDocuments()
			},
			changeSort(sort) {
				this.query.page = 1;
				this.query.sort = sort;
				this.getDocuments();
			},
			changeFeeType(ft) {
				this.query.page = 1;
				this.query.fee_type = ft;
				this.getDocuments();
			},
			changeExt(ext) {
				this.query.page = 1;
				this.query.ext = ext;
				this.getDocuments();
			},
			closeDrawer(e) {
				if (e.target.id === 'drawer') {
					this.visibleDrawer = false
				}
			},
			openDrawer() {
				this.visibleDrawer = true
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
				if (this.moveData.moved && e.changedTouches.length > 0) {
					const deltaX = e.changedTouches[0].clientX - this.moveData.startX
					const deltaY = Math.abs(e.changedTouches[0].clientY - this.moveData.startY)
					if (Math.abs(deltaX) > deltaY) { // 移动了
						let currentIndex = this.categories.findIndex(cate=>cate.id==this.query.category_id)
						if (deltaX > 0) { // 左
							if (!this.query.category_id) {
								return
							}
							currentIndex--
							if (currentIndex <= -1) {
								this.query.category_id = null
								this.query.language = null
								this.query.page = 1
								this.getDocuments()
								return
							}
							if (this.categories.length > currentIndex) {
								this.query.category_id = this.categories[currentIndex].id
								this.query.language = null
								this.query.page = 1
								this.getDocuments()
								return
							}
						} else { // 右
							currentIndex++
							if (this.categories.length > currentIndex) {
								this.query.category_id = this.categories[currentIndex].id
								this.query.page = 1
								this.query.language = null
								this.getDocuments()
								return
							}
						}
					}
				}
				this.moveData.moved = false
				this.moveData.startX = 0
				this.moveData.startY = 0
			},
			async getDocuments() {
				console.log('getDocuments', this.query)
				this.loading = true;
				let order = "id desc";
				let status = [];
				switch (this.query.sort) {
					case "latest":
						order = "id desc";
						break;
					case "view":
						order = "view_count desc";
						break;
					case "favorite":
						order = "favorite_count desc";
						break;
					case "comment":
						order = "comment_count desc";
						break;
					case "pages":
						order = "pages desc";
						break;
					case "recommend":
						order = "recommend_at desc";
						break;
					case "download":
						order = "download_count desc";
						break;
					default:
						// 已转换完成的文档，基本有封面，展示的时候不会显得空落落的
						status = [2];
						break;
				}
				const res = await listDocument({
					order,
					status,
					page: this.query.page,
					size: this.query.size,
					category_id: this.query.category_id,
					ext: this.query.ext,
					fee_type: this.query.fee_type,
					language: this.query.language,
					field: [
						"id",
						"title",
						"keywords",
						"description",
						"view_count",
						"favorite_count",
						"comment_count",
						"created_at",
						"size",
						"price",
						"pages",
						"ext",
						"score",
						"is_vip",
					],
				});
				if (res.statusCode === 200) {
					this.total = res.data.total;
					let documents = [...this.documents]
					if (this.query.page === 1) {
						documents = [];
						this.documents = [];
					}
					documents.push(
						...(res.data.document || []).map((item) => {
							item.cover = `/view/cover/${item.attachment.hash}`;
							return item;
						})
					);
					this.documents = documents;
					if (this.total === documents.length) {
						this.query.page = 0;
					}
				}
				if (this.query.page === 1 && this.documents.length === 0) {
					this.empty = true;
				}
				this.loading = false;
			},
		},
	};
</script>

<style lang="scss" scoped>
	.filter {
		padding: 0 30px 0 0;
		position: fixed;
		background-color: $uni-bg-color-grey;
		z-index: 99;
		width: 100%;
		box-sizing: border-box;
	}

	.menu {
		position: absolute;
		right: 5px;
		height: 40px;
		width: 30px;
		line-height: 40px;
		text-align: center;
		top: 0;

		image {
			margin-top: 10px;
			width: 20px;
			height: 20px;
		}
	}

	.list {
		padding: 0 10px;
	}

	.drawer {
		position: fixed;
		right: -130%;
		top: 0;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.1);
		z-index: 99;
		transition: right 0.5s;

		&.open {
			right: 0;
		}

		.drawer-main {
			width: 60%;
			background-color: #fff;
			box-sizing: border-box;
			padding: 10px;
			border-top-left-radius: 8px;
			border-bottom-left-radius: 8px;
			box-shadow: -5px 0 5px 0px #eee;
			border-left: 1px solid #eee;
			overflow-y: auto;
			position: absolute;
			right: 0;

			.active {
				color: $uni-color-success;
			}

			.item {
				// display: flex;
				font-size: 14px;
				line-height: 27px;
				margin-bottom: 10px;

				.item-title {
					width: 30px;
					color: $uni-bg-color-mask;
				}

				.item-value {
					flex: 1;

					&>view {
						display: inline-block;
						margin-right: 15px;
					}
				}
			}
		}
	}
</style>