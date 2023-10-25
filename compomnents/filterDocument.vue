<template>
	<view>
		<mHeaderSearch @focus="go2search" />
		<view class="filter font-lv3" id="filter" :style="`top: ${headerHeight}px`">
			<view class="item">
				<view class="item-title">分类</view>
				<view class="item-value">
					<view
						:class="query.category_id > 0 ? '' : 'active'"
						@click="changeCategory(null)"
						>不限</view
					>
					<view
						v-for="cate in categories"
						:key="'cate-' + cate.id"
						@click="changeCategory(cate.id)"
						:class="query.category_id === cate.id ? 'active' : ''"
						>{{ cate.title }}</view
					>
				</view>
			</view>
			<view class="item">
				<view class="item-title">类型</view>
				<view class="item-value">
					<view
						v-for="(ext, idx) in extOptions"
						:class="query.ext === ext.value ? 'active' : ''"
						:key="'ext-' + ext.value"
						@click="changeExt(ext.value)"
					>
						{{ ext.label }}
					</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title">费用</view>
				<view class="item-value">
					<view
						v-for="(feeType, idx) in feeTypeOptions"
						:class="query.fee_type === feeType.value ? 'active' : ''"
						:key="'feeType-' + feeType.value"
						@click="changeFeeType(feeType.value)"
					>
						{{ feeType.label }}
					</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title">排序</view>
				<view class="item-value">
					<view
						v-for="(sort, idx) in sortOptions"
						:class="query.sort === sort.value ? 'active' : ''"
						:key="'sort-' + sort.value"
						@click="changeSort(sort.value)"
					>
						{{ sort.label }}
					</view>
				</view>
			</view>
		</view>
		<view class="list" :style="`margin-top: ${filterHeight + baseHeight}px`">
			<docList v-if="documents.length > 0" :docs="documents" />
			<mEmpty v-else />
		</view>
		<view>&nbsp;</view>
	</view>
</template>

<script>
	import mHeaderSearch from "@/compomnents/headerSearch.vue";
	import mEmpty from "@/compomnents/empty.vue";
	import docList from "@/compomnents/docList";
	import { listDocument } from "@/api/document.js";
	import { listCategory } from "@/api/category.js";
	import { categoryToTree, getHeaderHeight } from "@/utils/util.js";
	import { feeTypeOptions, extOptions, sortOptions } from "@/utils/enum.js";
	export default {
		name: "filterDocument",
		props: {
			args: {
				type: Object,
				default: () => {
					return {};
				},
			},
			baseHeight: {
				type: Number,
				default: 0,
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
					category_id: null,
					fee_type: "",
					page: 1,
					size: 10,
				},
				headerHeight: getHeaderHeight(),
				filterHeight: 0,
				loading: false,
			};
		},
		components: {
			mHeaderSearch,
			docList,
			mEmpty,
		},
		watch: {
			args: {
				handler: function (val) {
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
					this.categories = tree;
					const query = uni.createSelectorQuery().in(this);
					try {
						query
							.select("#filter")
							.boundingClientRect((res) => {
								// console.log('search', res)
								this.filterHeight = res.height;
							})
							.exec();
					} catch (e) {
						//TODO handle the exception
					}
				}
			},
			changeCategory(categoryId) {
				this.query.category_id = categoryId;
				this.query.page = 1;
				this.getDocuments();
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
			async getDocuments() {
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
		padding: 10px 15px 10px;
		position: fixed;
		background-color: $uni-bg-color-grey;
		z-index: 99;
		width: 100%;

		.active {
			color: $uni-color-success;
		}

		.item {
			display: flex;
			font-size: 14px;
			line-height: 30px;

			.item-title {
				width: 30px;
				color: $uni-bg-color-mask;
			}

			.item-value {
				flex: 1;

				& > view {
					display: inline-block;
					margin-left: 15px;
				}
			}
		}
	}

	.list {
		padding: 0 15px;
	}
</style>