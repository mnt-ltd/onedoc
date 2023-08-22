<template>
	<view>
		<mHeader title="搜索" />
		<view class="searchbox">
			<mSearch />
		</view>
		<view class="searchwords">
			<view>
				<view class="bold">最近搜索</view>
				<navigator url="/pages/result/result?wd=JavaScript" hover-class="none">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
			</view>
			<view>
				<view class="bold">大家在搜</view>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
				<navigator url="/pages/result/result?wd=JavaScript">JavaScript</navigator>
			</view>
		</view>
		<view class="rank">
			<scroll-view class="scroll-view_H" scroll-x="true">
				<view class="scroll-view-item_H">
					<view class="bold rank-title">
						<image src="../../static/images/icon/recommend.png" class="rank-icon"></image>
						<text>推荐文档</text>
					</view>
					<navigator url="/" v-for="i in 10" :key="i"><text :class="'order'+i">{{i}}</text> 推荐文档 asdasd</navigator>
				</view>
				<view class="scroll-view-item_H">
					<view class="bold rank-title">
						<image src="../../static/images/icon/fire.png" class="rank-icon rank-icon-fire"></image>
						<text>热门下载</text>
					</view>
					<navigator url="/" v-for="j in 10" :key="j"><text :class="'order'+j">{{j}}</text> 热门下载 asdasd</navigator>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import mHeader from "@/compomnents/header.vue";
	import mSearch from '@/compomnents/search.vue';
	export default {
		components: {
			mHeader,
			mSearch
		},
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.bold {
		font-weight: bold;
		font-size: 14px;
	}
	
	.searchbox {
		padding: 10px;
		background-color: $uni-color-success;
	}

	.searchwords {
		padding: 15px 10px 0 10px;

		&>view {
			margin-bottom: 15px;



			navigator {
				display: inline-block;
				margin-top: 10px;
				margin-right: 10px;
				background-color: #fff;
				padding: 5px 10px;
				border-radius: 4px;
				font-size: 12px;
			}
		}
	}

	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
		padding-left: 10px;
		margin-top: 10px;
	}

	.scroll-view-item_H {
		display: inline-block;
		width: 65%;
		border-right: 1px solid #fff;
		padding: 15px;
		padding-bottom: 10px;
		background-color: #fff;
		margin-right: 10px;
		box-sizing: border-box;
		border-radius: 8px;
		.rank-icon{
			width: 20px;
			height: 20px;
			margin-right: 5px;
			vertical-align: bottom;
		}
		.rank-icon-fire{
			width: 16px;
			height: 16px;
			top: -3px;
			position: relative;
		}
		.rank-title{
			margin-bottom: 10px;
		}
		navigator{
			font-size: 13px;
			line-height: 30px;
			text{
				color: #666;
				display: inline-block;
				width: 15px;
				height: 15px;
				background-color: #ededed;
				vertical-align: middle;
				font-size: 10px;
				line-height: 15px;
				text-align: center;
				margin-right: 5px;
				position: relative;
				top: -1px;
				border-radius: 3px;
			}
			.order1{
				color: #fff;
				background-color: #bf2c24;
			}
			.order2{
				color: #fff;
				background-color: #f60;
			}
			.order3{
				color: #fff;
				background-color: #e6bf25;
			}
		}
	}
</style>