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
				index: 0,
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
		watch: {
			activeId: {
				handler: function(newVal) {
					this.index = this.categories.findIndex(cate => cate.id == newVal)
					this.resetScroll()
				},
				immediate: true,
			}
		},
		methods: {
			changeCategory(e) {
				this.$emit('change', e.target.dataset.id)
			},
			resetScroll() {
				this.$nextTick(() => {
					const query = uni.createSelectorQuery().in(this);
					query
						.selectAll(".scroll-item").boundingClientRect(res => {
							let scrollLeft = 0
							for (let idx = 0; idx < this.index; idx++) {
								scrollLeft += res[idx].width
							}
							this.scrollLeft = scrollLeft - 50
						}).exec()
				})
			}
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