<template>
	<view class="com-form-password">
		<view class="row">
			<view class="col-3">
				<text>用户名</text>
			</view>
			<view class="col-9">
				<input
					type="text"
					v-model="profile.username"
					:disabled="true"
					class="input disabled"
				/>
			</view>
		</view>
		<view class="row">
			<view class="col-3">
				<text>原密码</text>
			</view>
			<view class="col-9">
				<input
					password
					v-model="profile.old_password"
					class="input"
				/>
			</view>
		</view>
		<view class="row">
			<view class="col-3">
				<text>新密码</text>
			</view>
			<view class="col-9">
				<input
					password
					v-model="profile.new_password"
					class="input"
				/>
			</view>
		</view>
		<view class="row">
			<view class="col-3">
				<text>确认密码</text>
			</view>
			<view class="col-9">
				<input
					password
					v-model="profile.repeat_password"
					:disabled="disabled"
					class="input"
					:class="disabled ? 'disabled' : ''"
				/>
			</view>
		</view>
		<view class="row btn-row" v-if="!disabled">
			<view class="col-12">
				<button type="default" @click="onSubmit">提交修改</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		updateUserPassword
	} from '@/api/user.js'
	import {
		toastError,
		toastSuccess,
	} from '@/utils/util.js'
	export default {
		name: "formPassword",
		props: {
			disabled: {
				type: Boolean,
				default: false,
			},
			user: {
				type: Object,
				default: () => {
					return {};
				},
			},
		},
		watch: {
			user: {
				handler: function (val) {
					this.profile = { ...val };
				},
				immediate: true,
			},
		},
		data() {
			return {
				profile: {
					id: 0,
					username: '',
					old_password: '',
					new_password: '',
					repeat_password:'',
				},
			};
		},
		methods:{
			async onSubmit(){
				if(this.profile.new_password!==this.profile.repeat_password){
					toastError('新密码与确认密码不一致')
					return
				}
				
				const res = await updateUserPassword({
					id: this.profile.id,
					old_password: this.profile.old_password,
					new_password: this.profile.new_password
				})
				
				if(res.statusCode===200){
					toastSuccess('密码修改成功')
					this.profile.old_password=''
					this.profile.new_password=''
					this.profile.repeat_password=''
					return
				}
				toastError(res.data.message || '修改失败')
			}
		}
	};
</script>

<style lang="scss" scoped>
	.com-form-password {
		button[type=default]{
			background-color: $uni-color-success;
			border: 0;
			border-radius: 8px;
			color: #fff;
			font-size: 16px;
		}
		font-size: 14px;
		.row {
			line-height: 50px;
			.col-3 {
				color: #777;
			}
			.input {
				border: 1px solid #eee;
				height: 34px;
				line-height: 34px;
				margin-top: 10px;
				border-radius: 4px;
				padding: 0 10px;
				box-sizing: border-box;
				width: 100%;
				&.disabled {
					background-color: $uni-bg-color-grey;
				}
			}
			textarea.input {
				padding: 10px;
				height: 90px;
				line-height: 22px;
			}
		}
		.btn-row {
			margin: 20px 0 0;
		}
	}
</style>