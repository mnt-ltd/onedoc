<template>
	<view class="categories">
		<scroll-view class="scroll-view hor" :scroll-left="scrollLeft" scroll-with-animation scroll-x>
			<view :class="['scroll-item', !activeId ? 'active': '']" :data-id="null" @click="changeCategory">
				{{firstText}}
			</view>
			<view v-for="(cate,idx) in categories" :key="cate.id" :data-id="cate.id" :id="'scroll-'+idx"
				:class="['scroll-item', activeId===cate.id ? 'active': '']" @click="changeCategory">
				{{cate.title}}
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "scrollCategory",
		data() {
			return {
				scrollLeft: 0,
			};
		},
		props: {
			activeId: {
				type: Number || null,
				default: null
			},
			firstText: {
				type: String,
				default: '全部分类'
			},
			categories: {
				type: Array,
				default: () => {
					return []
				}
			}
		},
		methods: {
			changeCategory(e) {
				this.scrollLeft = e.currentTarget.offsetLeft - (uni.getSystemInfoSync().screenWidth / 2 - 50)
				this.$emit('change', e.target.dataset.id)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.hor {
		display: flex;
		flex-direction: row;
		box-sizing: border-box;
		/* 这行CSS样式很重要，不然里面的元素会出现换行，没法实现水平滚动 */
		white-space: nowrap;
		width: 100%;
	}

	.categories {
		padding: 0 10px;
		height: auto;
		overflow: hidden;
		.scroll-item {
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			display: inline-block;
			padding: 0 12px;
			line-height: 40px;

			&.active {
				color: $uni-color-success;
			}
		}
	}
</style>