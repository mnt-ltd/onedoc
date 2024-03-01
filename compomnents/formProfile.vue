<template>
	<view class="com-form-profile">
		<view class="row">
			<view class="col-3">
				<text>用户名</text>
			</view>
			<view class="col-9">
				<input
					type="text"
					v-model="profile.username"
					:disabled="disabled"
					class="input"
					:class="disabled ? 'disabled' : ''"
				/>
			</view>
		</view>
		<view class="row">
			<view class="col-3">
				<text>真实姓名</text>
			</view>
			<view class="col-9">
				<input
					type="text"
					v-model="profile.realname"
					:disabled="disabled"
					class="input"
					:class="disabled ? 'disabled' : ''"
				/>
			</view>
		</view>
		<view class="row">
			<view class="col-3">
				<text>身份证号</text>
			</view>
			<view class="col-9">
				<input
					type="text"
					v-model="profile.identity"
					:disabled="disabled"
					class="input"
					:class="disabled ? 'disabled' : ''"
				/>
			</view>
		</view>
		<view class="row">
			<view class="col-3">
				<text>联系邮箱</text>
			</view>
			<view class="col-9">
				<input
					type="text"
					v-model="profile.email"
					:disabled="disabled || user.email"
					class="input"
					:class="disabled || user.email ? 'disabled' : ''"
				/>
			</view>
		</view>
		<view class="row">
			<view class="col-3">
				<text>联系电话</text>
			</view>
			<view class="col-9">
				<input
					type="text"
					v-model="profile.mobile"
					:disabled="disabled || user.mobile"
					class="input"
					:class="disabled || user.mobile ? 'disabled' : ''"
				/>
			</view>
		</view>
		<view class="row">
			<view class="col-3">
				<text>联系地址</text>
			</view>
			<view class="col-9">
				<textarea
					rows="3"
					v-model="profile.address"
					:disabled="disabled"
					class="input"
					:class="disabled ? 'disabled' : ''"
				></textarea>
			</view>
		</view>
		<view class="row">
			<view class="col-3">
				<text>个性签名</text>
			</view>
			<view class="col-9">
				<textarea
					rows="3"
					v-model="profile.signature"
					:disabled="disabled"
					class="input"
					:class="disabled ? 'disabled' : ''"
				></textarea>
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
		useUserStore
	} from '@/stores/user.js'
	import {
		mapActions,
	} from 'pinia'
	import {
		toastError,
		toastSuccess,
	} from '@/utils/util.js'
	export default {
		name: "formProfile",
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
				profile: {},
			};
		},
		methods:{
			...mapActions(useUserStore, ['updateUserProfile']),
			async onSubmit(){
				const res = await this.updateUserProfile(this.profile)
				if(res.statusCode===200){
					toastSuccess('修改成功')
					this.$emit('onUpdateProfileSuccess')
					return
				}
				toastError(res.data.message || '修改失败')
			}
		}
	};
</script>

<style lang="scss" scoped>
	.com-form-profile {
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
		button[type=default]{
			background-color: $uni-color-success;
			border: 0;
			border-radius: 8px;
			color: #fff;
			font-size: 16px;
		}
	}
</style>