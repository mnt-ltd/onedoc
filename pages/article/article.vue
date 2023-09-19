<template>
	<view>
		<mHeader :title="article.title" />
		<view class="box">
			<!-- <view class="title">{{article.title}}</view> -->
			<view class="info">
				<text>浏览：{{article.view_count}}</text>
				<text>更新：{{formatTime(new Date(article.updated_at))}}</text>
			</view>
			<view class="content markdown-body" v-if="article.content" v-html="article.content"></view>
			<empty v-else></empty>
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import mEmpty from '@/compomnents/empty.vue'
	import {
		getArticle
	} from '@/api/article.js'
	import {
		formatTime
	} from '@/utils/util.js'
	export default {
		components: {
			mHeader,
			mEmpty,
		},
		data() {
			return {
				article: {
					title: '文章'
				}
			}
		},
		onLoad(args) {
			this.loadArticle(args.identifier)
		},
		onShareAppMessage() {
			return {
				title: this.article.title,
			}
		},
		onShareTimeline() {
			return {
				title: this.article.title
			}
		},
		methods: {
			formatTime,
			async loadArticle(identifier) {
				const res = await getArticle({
					identifier,
					from: 'mp'
				})
				if (res.statusCode === 200) {
					this.article = {
						title: '文章',
						...res.data
					}
				}
			}
		}
	}
</script>
<style>
	@import url('../../static/css/article.css');
</style>
<style lang="scss" scoped>
	.title {
		padding: 0 10px 10px;
		text-align: center;
		line-height: 160%;
		font-size: 20px;
	}

	.info {
		font-size: 12px;
		text-align: center;
		padding-bottom: 10px;
		text {
			margin: 0 10px;
			color: $uni-border-color;
		}
	}

	.box {
		padding: 10px;

		.content {
			padding: 10px;
			border-radius: 8px;
			background-color: #fff;
		}
	}
</style>