<template>
	<view class="page page-index">
		<view class="search pd-20" :style="background">
			<m-search @focus="go2search"></m-search>
		</view>
		<view class="uni-bg-green">
			<!-- <swiper style="height:360px" :autoplay="autoplay" :indicator-dots="indicatorDots"
				:interval="interval" :duration="duration">
				<swiper-item v-for="banner in banners" :key="banner.id" class="radius-basic">
					<image @click="bannerClick" :data-url="banner.link" :src="banner.image"
						:style="'height:'+bannerHeight+';width:'+bannerWidth+';min-width:100%;max-width:100%'"></image>
				</swiper-item>
			</swiper> -->
			<swiper class="swiper" style="height:200px" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration">
				<swiper-item>
					<view class="swiper-item uni-bg-red" style="background-color: red;">A</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-green" style="background-color: green;">B</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item uni-bg-blue" style="background-color: blue;">C</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="category pd-20 m-card mgt-15">
			<view class="m-card-body">
				<view class="row">
					<view class="col">1</view>
					<view class="col">2</view>
					<view class="col">3</view>
					<view class="col">4</view>
				</view>
				<view class="row">
					<view class="col">1</view>
					<view class="col">2</view>
					<view class="col">3</view>
					<view class="col">4</view>
				</view>
			</view>
		</view>
		<view class="recommend">
			这里显示推荐的文档，可滚动
		</view>
		<view class="latest">
			这里显示最新的文档列表
		</view>
		<!-- <view class="pd-10">
			<view class="m-card">
				<view class="m-card-body">
					<view class="row">
						<view class="col">asdasd</view>
						<view class="col">asdasd</view>
						<view class="col">asdasd</view>
					</view>
				</view>
			</view>
		</view>
		<view class="m-card">
			<view class="m-card-header">
				热门推荐
			</view>
			<view class="m-card-body">
				asdasd
			</view>
		</view> -->
	</view>
</template>

<script>
	import mSearch from '@/compomnents/search.vue'
	import {
		addr
	} from '../../config.js'
	export default {
		data() {
			return {
				title: 'Hello',
				autoplay: true,
				indicatorDots: true,
				indicatorDots: true,
				autoplay: true,
				interval: 3000,
				duration: 500,
				bannerWidth: '100%',
				bannerHeight: 'auto',
				showSearch: false, // 内容完全加载完成之后再显示搜索框
				showHeaderSearch: false,
				banners: [],
				times: 100, // 当iOS未允许访问网络的时候，每3秒请求一次数据
				platform: '',
				background: '',
			}
		},
		components: {
			mSearch,
		},
		onLoad() {
			console.log(addr)
		},
		methods: {
			go2search(){
				uni.navigateTo({
					url: '/pages/search/search'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.swiper-item{
	height: 200px;
}
.search{
	padding-top: 100px;
	background-image: url(../../static/images/logo-transparent.png?id=1);
	background-color: $uni-color-success;
	background-size: auto 40px;
	background-repeat: no-repeat;
	background-position: 15px 40px;
}
</style>