<template>
	<view class="com-user-profile">
		<view class="userinfo">
			<view class="row">
				<view class="col-5 part-left">
					<image :src="profile.avatar || '/static/images/avatar.png'" class="avatar"></image>
					<text>用户名</text>
				</view>
				<view class="col-7 part-right font-lv4">
					<view>
						<text class="item">注册</text>
						<text>{{formatTime(new Date(profile.created_at))}}</text>
					</view>
					<view>
						<text class="item">登录</text>
						<text>{{formatTime(new Date(profile.updated_at))}}</text>
					</view>
					<view>
						<text class="item">登录IP</text>
						<text>{{profile.last_login_ip || '-'}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="tabs row font-lv3">
			<view class="col-3" @click="changeTab('profile')" :class="tab==='profile' ? 'active': ''">个人资料</view>
			<view class="col-3" @click="changeTab('edit')" :class="tab==='edit' ? 'active': ''">修改资料</view>
			<view class="col-3" @click="changeTab('password')"  :class="tab==='password' ? 'active': ''">修改密码</view>
		</view>
		<view class="box">
			<view class="box-content" :class="'box-'+tab">
				<formProfile v-if="tab==='profile'" :user="profile" :disabled="true"/>
				<formProfile v-else-if="tab==='edit'" :user="profile" @onUpdateProfileSuccess="onUpdateProfileSuccess"/>
				<formPassword v-else-if="tab==='password'" :user="profile"/>
			</view>
		</view>
	</view>
</template>

<script>
	import formProfile from '@/compomnents/formProfile.vue'
	import formPassword from '@/compomnents/formPassword.vue'
	import {
		formatTime,
	} from '@/utils/util.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		getUser,
	} from '@/api/user.js'
	import {
		mapGetters,
	} from 'pinia'
	export default{
		components:{
			formProfile,
			formPassword,
		},
		props:{
			tab:{
				type: String,
				default: 'profile'
			}
		},
		data(){
			return{
				tab: 'profile',
				profile: {},
			}
		},
		computed: {
			...mapGetters(useUserStore, ['user'])
		},
		created() {
			if(!this.user.id){
				uni.redirectTo({
					url: '/pages/login/login'
				})
				return
			}
			this.getUser()
		},
		methods:{
			formatTime,
			changeTab(tab){
				this.tab = tab
			},
			async getUser(){
				const res = await getUser()
				if(res.statusCode === 200){
					this.profile = res.data || {}
				}
			},
			onUpdateProfileSuccess(){
				this.getUser()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userinfo{
		padding: 10px;
		.row{
			background-color: #fff;
			border-radius: 8px;
			padding: 20px 10px;
		}
		.avatar{
			width: 56px;
			height: 56px;
			display: block;
			margin: 0 auto;
			margin-bottom: 10px;
		}
		.part-left{
			text-align: center;
		}
		.part-right{
			line-height: 30px;
			color: #999;
			.item{
				color: $uni-border-color;
				width: 50px;
				display: inline-block;
			}
		}
	}
	.tabs{
		padding: 0 10px;
		line-height: 35px;
		text-align: center;
		.active{
			color: $uni-color-success;
			background-color: #fff;
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
		}
	}
	.box{
		padding: 0 10px 10px;
		.box-content{
			background-color: #fff;
			padding: 10px;
			padding-bottom: 20px;
			border-radius: 8px;
			&.box-profile{
				border-top-left-radius: 0;
			}
		}
	}
</style>