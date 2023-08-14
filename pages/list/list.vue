<template>
	<view>
		<mHeaderSearch @focus="go2search" />
		<view class="filter font-lv3" id="filter" :style="`top: ${headerHeight}px`">
			<view class="item">
				<view class="item-title">分类</view>
				<view class="item-value">
					<view class="active">不限</view>
					<view v-for="cate in categories" :key="'cate-' + cate.id">{{
						cate.title
					}}</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title">类型</view>
				<view class="item-value">
					<view
						v-for="(ext, idx) in extOptions"
						:class="idx === 0 ? 'active' : ''"
						:key="'ext-' + ext.value"
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
						:class="idx === 0 ? 'active' : ''"
						:key="'feeType-' + feeType.value"
						>{{ feeType.label }}</view
					>
				</view>
			</view>
			<view class="item">
				<view class="item-title">排序</view>
				<view class="item-value">
					<view
						v-for="(sort, idx) in sortOptions"
						:class="idx === 0 ? 'active' : ''"
						:key="'sort-' + sort.value"
					>
						{{ sort.label }}</view
					>
				</view>
			</view>
		</view>
		<view class="list" :style="`margin-top: ${filterHeight + 30}px`">
			<docList :docs="documents" />
		</view>
	</view>
</template>

<script>
	import mHeaderSearch from "@/compomnents/headerSearch.vue";
	import docList from "@/compomnents/docList";
	import { listDocument } from "@/api/document.js";
	import { listCategory } from "@/api/category.js";
	import { categoryToTree, getHeaderHeight } from "@/utils/util.js";
	import { feeTypeOptions, extOptions, sortOptions } from "@/utils/enum.js";
	export default {
		data() {
			return {
				feeTypeOptions,
				extOptions,
				sortOptions,
				categories: [],
				feeTypeIndex: 0,
				sortIndex: 0,
				extIndex: 0,
				cateIndex: 0,
				documents: [],
				total: 0,
				query: {
					order: "",
					sort: "",
					ext: "",
					category_id: 0,
					status: 2,
					page: 1,
					size: 10,
				},
				headerHeight: getHeaderHeight(),
				filterHeight: 0,
			};
		},
		components: {
			mHeaderSearch,
			docList,
		},
		computed: {},
		onLoad() {
			this.getCategories();
			this.getDocuments();
		},
		methods: {
			go2search() {
				console.log("go2search");
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
					query
						.select("#filter")
						.boundingClientRect((res) => {
							// console.log('search', res)
							this.filterHeight = res.height;
						})
						.exec();
				}
			},
			async getDocuments() {
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
					category_id: this.query.categoryId,
					ext: this.query.ext,
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
					fee_type: this.query.feeType,
				});
				console.log(res);
				if (res.statusCode === 200) {
					this.total = res.data.total;
					this.documents = (res.data.document || []).map((item) => {
						item.cover = `/view/cover/${item.attachment.hash}`;
						return item;
					});
				}
				console.log(this.documents);
				if (this.query.page === 1 && this.documents.length === 0) {
					this.empty = true;
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	.filter {
		padding: 10px 15px 10px;
		position: fixed;
		background-color: $uni-bg-color-grey;
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