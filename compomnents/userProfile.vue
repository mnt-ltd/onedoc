<template>
	<view class="com-user-profile">
		<view class="userinfo">
			<view class="row">
				<view class="col-5 part-left">
					<image :src="joinImage(profile.avatar) || '/static/images/avatar.png'" class="avatar" @click="changeAvatar">
					</image>
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
				<view class="col-12">
					<view class="tips">点击头像可以上传更换新头像</view>
				</view>
			</view>
		</view>
		<view class="tabs row font-lv3">
			<view class="col-3" @click="changeTab('profile')" :class="itab==='profile' ? 'active': ''">个人资料</view>
			<view class="col-3" @click="changeTab('edit')" :class="itab==='edit' ? 'active': ''">修改资料</view>
			<view class="col-3" @click="changeTab('password')" :class="itab==='password' ? 'active': ''">修改密码</view>
		</view>
		<view class="box">
			<view class="box-content" :class="'box-'+itab">
				<formProfile v-if="itab==='profile'" :user="profile" :disabled="true" />
				<formProfile v-else-if="itab==='edit'" :user="profile"
					@onUpdateProfileSuccess="onUpdateProfileSuccess" />
				<formPassword v-else-if="itab==='password'" :user="profile" />
			</view>
		</view>
	</view>
</template>

<script>
	import formProfile from '@/compomnents/formProfile.vue'
	import formPassword from '@/compomnents/formPassword.vue'
	import {
		formatTime,
		toastSuccess,
		toastError,
		joinImage,
	} from '@/utils/util.js'
	import {
		useUserStore
	} from '@/stores/user.js'
	import {
		mapGetters,
		mapActions,
	} from 'pinia'
	import {
		addr
	} from '@/config.js'
	export default {
		components: {
			formProfile,
			formPassword,
		},
		props: {
			tab: {
				type: String,
				default: 'profile'
			}
		},
		data() {
			return {
				profile: {},
				itab: 'profile'
			}
		},
		watch: {
			tab: {
				handler: function(val) {
					this.itab = val
				},
				immediate: true,
			},
		},
		computed: {
			...mapGetters(useUserStore, ['user', 'token'])
		},
		created() {
			if (!this.user.id) {
				uni.redirectTo({
					url: '/pages/login/login'
				})
				return
			}
			this.igetUser()
		},
		methods: {
			...mapActions(useUserStore, ['getUser']),
			formatTime,
			joinImage,
			changeTab(tab) {
				this.itab = tab
				this.$emit('onTab', tab)
				let title = '个人资料'
				switch (tab) {
					case 'password':
						title = '修改密码'
						break;
					case 'edit':
						title = '修改资料'
						break;
					default:
						break;
				}
				this.$emit('onTitle', title)
			},
			async igetUser() {
				const res = await this.getUser()
				if (res.statusCode === 200) {
					this.profile = res.data || {}
				}
			},
			onUpdateProfileSuccess() {
				this.igetUser()
			},
			changeAvatar() {
				uni.chooseMedia({
					count: 1,
					mediaType: ['image'],
					success: (chooseImageRes) => {
						console.log('chooseMedia success', chooseImageRes)
						const tempFiles = chooseImageRes.tempFiles;
						uni.uploadFile({
							url: `${addr}/api/v1/upload/avatar`, //仅为示例，非真实的接口地址
							filePath: tempFiles[0].tempFilePath,
							header: {
								authorization:'bearer ' + this.token
							},
							name: 'file',
							success: (res) => {
								console.log(res);
								var data = {
									message: '更换失败'
								}
								try {
									data = JSON.parse(res.data)
								} catch (e) {
									//TODO handle the exception
									console.log(e)
								}
								if (res.statusCode === 200) {
									toastSuccess('更换成功')
									this.igetUser()
								} else {
									toastError(data.message || '上传失败')
								}
							},
							fail: (res) => {
								toastError(res.errMsg || '上传失败')
							}
						});
					},
					fail: (res) => {
						console.log('chooseMedia fail', res)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.userinfo {
		padding: 10px;

		.tips {
			border: 1px dashed #ddd;
			font-size: 12px;
			padding: 8px;
			border-radius: 4px;
			margin-top: 10px;
			margin-bottom: -5px;
			color: #999;
		}

		.row {
			background-color: #fff;
			border-radius: 8px;
			padding: 20px 10px;
		}

		.avatar {
			width: 56px;
			height: 56px;
			display: block;
			margin: 0 auto;
			margin-bottom: 10px;
		}

		.part-left {
			text-align: center;
		}

		.part-right {
			line-height: 30px;
			color: #999;

			.item {
				color: $uni-border-color;
				width: 50px;
				display: inline-block;
			}
		}
	}

	.tabs {
		padding: 0 10px;
		line-height: 35px;
		text-align: center;

		.active {
			color: $uni-color-success;
			background-color: #fff;
			border-top-left-radius: 8px;
			border-top-right-radius: 8px;
		}
	}

	.box {
		padding: 0 10px 10px;

		.box-content {
			background-color: #fff;
			padding: 10px;
			padding-bottom: 20px;
			border-radius: 8px;

			&.box-profile {
				border-top-left-radius: 0;
			}
		}
	}
</style>