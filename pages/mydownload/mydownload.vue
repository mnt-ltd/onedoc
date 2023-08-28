<template>
	<view>
		<mHeader title="我的下载" />
		<view class="box">
			<template v-if="data.length>0">
				<doc-simple-list :docs="data"></doc-simple-list>
			</template>
			<mEmpty v-else />
		</view>
		<view class="no-more" v-if="query.page===0 && data.length>0">
			已无更多动态数据...
		</view>
	</view>
</template>

<script>
	import mHeader from '@/compomnents/header.vue'
	import mEmpty from '@/compomnents/empty.vue'
	import docSimpleList from '@/compomnents/docSimpleList.vue'
	import {
		getHeaderHeight,
		relativeTime,
		formatTime,
		formatBytes
	} from '@/utils/util.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		getUserDownloads
	} from '@/api/user.js'
	import {
		mapGetters,
		mapActions
	} from 'pinia'
	export default {
		components: {
			mHeader,
			mEmpty,
			docSimpleList,
		},
		data() {
			return {
				headerHeight: getHeaderHeight(),
				query: {
					page: 1,
					size: 10,
					user_id: 0
				},
				data: []
			}
		},
		computed: {
			...mapGetters(useUserStore, ['user'])
		},
		created() {
			if (!this.user.id) {
				uni.navigateTo({
					url: '/pages/login/login?redirect=/pages/myorder/myorder?'
				})
				return
			}
			this.loadData()
		},
		onReachBottom() {
			if (this.query.page > 0) {
				this.query.page++
				this.loadData()
			}
		},
		methods: {
			relativeTime,
			formatTime,
			formatBytes,
			async loadData() {
				const query = {
					...this.query,
					user_id: this.user.id || 0
				}
				const res = await getUserDownloads(query)
				if (res.statusCode === 200) {
					const data = res.data.download || []
					if (this.query.page === 1) {
						this.data = data
					} else {
						this.data.push(...data)
					}
					if (data.length === 0) {
						this.query.page = 0
					}
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.box {
		padding: 10px;
	}

	.data {
		padding: 10px;
		margin-bottom: 10px;
		border-radius: 8px;
		background-color: #fff;

		.title {
			color: #000;
			font-weight: 400;
			font-size: 16px;
			border-bottom: 1px solid #efefef;
			padding-bottom: 10px;
			margin-bottom: 5px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		text {
			color: $uni-border-color;
		}

		.description {
			color: #888;
			font-size: 13px;
			line-height: 20px;
		}
	}

	.no-more {
		text-align: center;
		font-size: 12px;
		color: #888;
		line-height: 30px;
	}

</style>