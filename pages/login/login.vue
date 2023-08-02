<template>
	<view>
		<iheader title="登录" />
		<view class="login">
			<view class="logo">
				<image src="/static/logo.png"></image>
			</view>
			<view class="item">
				<view class="label">账号</view>
				<input v-model="form.username" type="text" placeholder="请输入您的用户名、邮箱或手机号码">
			</view>
			<view class="item">
				<view class="label">密码</view>
				<input v-model="form.password" type="password" placeholder="请输入您的登录密码">
			</view>
			<view class="item" v-if="captcha.enable">
				<view class="label">验证码</view>
				<input type="text" placeholder="请输入验证码">
				<image :src="captcha.captcha" @click="getUserCaptcha" style="height: 50px;width: 150px;"></image>
			</view>
			<view class="more">
				<navigator hover-class="none" class="font-lv3" url="/pages/register/register">注册账号</navigator>
				<navigator hover-class="none" class="font-lv3 findpwd" url="/pages/findpwd/findpwd">忘记密码？</navigator>
			</view>
			<button type="warn" class="btn-password-login btn-block">密码登录</button>
			<button type="primary" class="btn-wechat-login btn-block">微信登录</button>
		</view>
	</view>
</template>

<script>
	import iheader from '@/compomnents/header.vue'
	import {
		getUserCaptcha
	} from '@/api/user.js'
	import {
		debug
	} from '@/config.js'
	export default {
		data() {
			return {
				form:{
					username: '',
					password: ''
				},
				captcha:{
					enable: false
				}
			}
		},
		components: {
			iheader
		},
		onLoad(args) {
			if(debug){
				console.log('onLoad', args)
			}
			this.getUserCaptcha()
		},
		methods: {
			async getUserCaptcha() {
				const res = await getUserCaptcha({type: 'login'})
				if(debug){
					console.log('getUserCaptcha', res)
				}
				if(res.statusCode===200){
					this.captcha = {enable: false, ...res.data}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		padding: 20px;
		
		.logo{
			width: 80px;
			height: 80px;
			margin: 20px auto;
			border-radius: 50%;
			display: block;
			border: 2px solid #eee;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				box-sizing: border-box;
			}
		}
		
		.item {
			display: flex;
			border-bottom: 1px solid #ddd;

			.label {
				width: 70px;
				height: 50px;
				line-height: 50px;
			}

			input {
				height: 50px;
				line-height: 50px;
				font-size: 14px;
				padding-right: 15px;
				box-sizing: border-box;
				border: 0;
				flex: 1;
			}
		}
		
		.more{
			color: #666;
			margin-top: 10px;
			justify-content: space-around;
			navigator{
				// width: 100px;
				display: inline-block;
			}
			.findpwd{
				float: right;
			}
		}

		button {
			margin-top: 20px;
		}
	}
</style>