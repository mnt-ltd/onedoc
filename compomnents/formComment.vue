<template>
	<view class="form-comment">
		<form @submit="submit" ref="form">
			<textarea name="content" class='font-lv3' :placeholder="placeholder" :auto-focus="autoFocus" />
			<view class="row captcha" v-if="captcha.enable">
				<view class="col-6">
					<input type="text" v-model="icomment.content" placeholder="请输入验证码" name="captcha" />
				</view>
				<view class="col-6">
					<image @click="loadCaptcha" :src="captcha.captcha" mode="heightFix"></image>
				</view>
			</view>
			<view class='submit'>
				<text class='font-lv4 tips' :cursor-spacing="100">文明评论，理性发言.</text>
				<view>
					<button form-type="submit" :loading='loading' type="warn" size='mini' class='pull-right btn-submit'>
						发表点评 </button>
				</view>
			</view>
		</form>
	</view>
</template>

<script>
	import {
		createComment
	} from '@/api/comment.js'
	import {
		getUserCaptcha
	} from '@/api/user.js'
	import {
		toastError,
		toastSuccess,
	} from '@/utils/util.js'

	const defaulPlaceholder = '您的点评能帮助其他小伙伴了解内容哟'
	export default {
		data() {
			return {
				loading: false,
				autoFocus: false,
				placeholder: defaulPlaceholder,
				captcha: {
					enable: false,
				},
				icomment:{ // 用作清空绑定
					content: '',
					captcha: '',
				}
			}
		},
		props: {
			comment: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		watch: {
			comment: {
				handler: function(val) {
					if (val.reply_user) {
						this.placeholder = `回复 @${val.reply_user}`
					} else {
						this.placeholder = defaulPlaceholder
					}
					this.$nextTick(() => {
						this.autoFocus = true
					})
					this.loadCaptcha()
				}
			}
		},
		methods: {
			async submit(e) {
				let comment = {
					document_id: this.comment.document_id,
					parent_id: this.comment.id || 0,
					captcha_id: this.captcha.id,
					...e.detail.value,
				}
				const res = await createComment(comment)
				if (res.statusCode === 200) {
					toastSuccess('发表成功')
					this.$emit('success')
					this.icomment = {
						content: '',
						captcha:'',
					}
				} else {
					toastError(res.data.message || '发表失败')
					this.loadCaptcha()
				}
			},
			async loadCaptcha() {
				const res = await getUserCaptcha({
					type: 'comment',
					t: Date.now()
				})
				if (res.data.enable) {
					this.captcha = res.data
					console.log(this.captcha)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.form-comment {
		button {
			background-color: $uni-color-success;
		}

		textarea {
			border: 1px solid #efefef;
			padding: 10px;
			border-radius: 4px;
			width: 100%;
			box-sizing: border-box;
			margin: 10px auto;
			line-height: 150%;
			color: #666;
		}

		.tips {
			line-height: 33px;
			color: $uni-text-color-grey;
		}

		.submit {
			display: flex;
			justify-content: space-between;

			button {
				display: inline-block;
			}
		}

		.captcha {
			margin-bottom: 20px;

			input {
				border: 1px solid #efefef;
				line-height: 33px;
				height: 33px;
				box-sizing: border-box;
				width: 90%;
				padding: 0 10px;
				border-radius: 4px;
				font-size: 14px;
			}

			image {
				height: 30px;
			}
		}
	}
</style>