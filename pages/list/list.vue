<template>
	<view>
		<mHeaderSearch @focus="go2search" />
		<view class="filter font-lv3">
			<view class="item">
				<view class="item-title">分类</view>
				<view class="item-value">
					<view class="active">不限</view>
					<view v-for="cate in categories" :key="'cate-'+cate.id">{{cate.title}}</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title">类型</view>
				<view class="item-value">
					<view v-for="(ext, idx) in extOptions" :class="idx===0?'active': ''" :key="'ext-'+ext.value">
						{{ext.label}}
					</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title">费用</view>
				<view class="item-value">
					<view v-for="(feeType, idx) in feeTypeOptions" :class="idx===0 ? 'active': ''"
						:key="'feeType-'+feeType.value">{{feeType.label}}</view>
				</view>
			</view>
			<view class="item">
				<view class="item-title">排序</view>
				<view class="item-value">
					<view v-for="(sort,idx) in sortOptions" :class="idx===0 ? 'active': ''" :key="'sort-'+sort.value">
						{{sort.label}}</view>
				</view>
			</view>
		</view>
		<view class="list">
			文档
			文档
			文档
			文档
			文档
			文档
		</view>

	</view>
</template>

<script>
	import mHeaderSearch from '@/compomnents/headerSearch.vue'
	import {
		listCategory
	} from '@/api/category.js'
	import {
		categoryToTree,
		tree2MultiPickerOptions,
		getTreeNodeByIndexes
	} from '@/utils/util.js'
	import {
		feeTypeOptions,
		extOptions,
		sortOptions,
	} from '@/utils/enum.js'
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
			}
		},
		components: {
			mHeaderSearch,
		},
		computed: {

		},
		onLoad() {
			this.getCategories()
		},
		methods: {
			go2search() {
				console.log('go2search')
				uni.navigateTo({
					url: '/pages/search/search'
				})
			},
			async getCategories() {
				let res = await listCategory()
				if (res.statusCode === 200) {
					let categories = res.data.category || []
					let tree = categoryToTree(categories) || []
					this.categories = tree
				}
			},
			feeTypePickerChange(e) {
				this.feeTypeIndex = e.detail.value
			},
			sortPickerChange(e) {
				this.sortIndex = e.detail.value
			},
			extPickerChange(e) {
				this.extIndex = e.detail.value
			},
			catePickerChange(e) {
				this.cateIndex = e.detail.value
			}
		},
	}
</script>

<style lang="scss" scoped>
	.filter {
		padding: 15px 10px;
		.active{
			color: $uni-color-success;
		}
		.item {
			display: flex;
			font-size: 14px;
			line-height: 35px;

			.item-title {
				width: 30px;
				color: $uni-bg-color-mask;
			}

			.item-value {
				flex: 1;

				&>view {
					display: inline-block;
					margin-left: 15px;
				}
			}
		}
	}
</style>