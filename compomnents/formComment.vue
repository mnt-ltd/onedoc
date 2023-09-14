<template>
	<view class="form-comment">
		<form @submit="submit">
			<textarea name="content" class='font-lv3' :placeholder="placeholder" auto-focus />
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
	const defaulPlaceholder='您的点评能帮助其他小伙伴了解内容哟'
	export default {
		data() {
			return {
				loading: false,
				placeholder: defaulPlaceholder
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
					if (val.user && val.user.username) {
						this.placeholder = `回复 @${val.user.username}`
					}else{
						this.placeholder=defaulPlaceholder
					}
				}
			}
		},
		methods: {
			submit(e) {
				console.log(e)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.form-comment {
		button {
			background-color: $uni-color-success;
		}
		
		textarea{
			border: 1px solid #efefef;
			padding: 10px;
			border-radius: 4px;
			width: 100%;
			box-sizing: border-box;
			margin: 10px auto;
			line-height: 150%;
			color: #666;
		}
		
		.tips{
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
	}
</style>