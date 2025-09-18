<template>
	<view>
		<form :class="isMiniSearch ? 'search mini-search' : 'search'" @click="focusSearch">
			<input v-model='searchWd' :placeholder='placeholder' @input="change" :readonly='readonly' :disabled="readonly"
				@confirm="search" confirm-type="search" name='wd' :auto-focus="autoFocus" />
			<image @click.stop='clear' v-if='showClear' class='clear' src='/static/images/clear.png'></image>
			<image @click.stop='search' src='/static/images/search.png'></image>
		</form>
	</view>
</template>

<script>
	export default {
		name: "search",
		data() {
			return {
				showClear: false,
				searchWd: '',
				clickFocus: false,
			}
		},
		props: {
			focus: {
				type: Boolean,
				default: false,
			},
			wd: {
				type: String,
				default: '',
			},
			target: {
				type: String
			},
			placeholder: {
				type: String,
				default: 'Search...'
			},
			isMiniSearch: {
				type: Boolean,
				default: false
			},
			autoFocus:{
				type: Boolean,
				default: false,
			},
			readonly:{
				type: Boolean,
				default: false,
			}
		},
		created() {
			this.init()
		},
		methods: {
			init() {
				if (this.wd) this.showClear = true
				this.searchWd = this.wd
			},
			clear(e) {
				this.showClear = false
				this.searchWd = ''
				this.$emit('clear')
			},
			change(e) {
				let wd = e.detail.value.trim()
				this.showClear = wd ? true : false
				this.searchWd = wd
			},
			search() {
				if (this.target) {
					uni.navigateTo({
						url: this.target + "?wd=" + this.searchWd
					})
				} else {
					this.$emit('search', {
						wd: this.searchWd
					})
				}
			},
			focusSearch() {
				if (this.autoFocus){
					return
				}
				this.$emit('focus')
			}
		},
		watch: {
			wd: function() {
				this.init()
			}
		}
	}
</script>

<style scoped lang="scss">
	form {
		position: relative;
		display: block;
		background-color: #fff;
		border-radius: 20px;
		padding-right: 70px;
		padding-left: 15px;
		height: 40px;
		box-sizing: border-box;
		line-height: 40px;

		input {
			height: 40px;
			line-height: 40px;
			font-size: 15px;
		}

		image {
			margin: 0;
			position: absolute;
			top: 0;
			right: 0;
			box-sizing: border-box;
			height: 40px;
			width: 40px;
			padding: 8px 8px;
			z-index: 99;

			&.clear {
				right: 35px;
				z-index: 88;
			}
		}
	}

	form.mini-search {
		height: 32px;
		input {
			height: 32px;
			line-height: 32px;
			font-size: 13px;
			line-height: 32px;
		}
		image {
			height: 32px;
			width: 32px;
			padding: 8px 8px;
			z-index: 99;
		
			&.clear {
				right: 25px;
				z-index: 88;
			}
		}
	}
</style>