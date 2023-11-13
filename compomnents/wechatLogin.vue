<template>
	<view class="com-wechat-login">
		<button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo">微信登录</button>
	</view>
</template>

<script>
	export default {
		name: 'wechatLogin',
		methods:{
			getUserInfo(e){
				console.log('getUserInfo', e)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.com-wechat-login {
		margin-top: 20px;
	}
</style>