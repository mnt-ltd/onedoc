<template>
	<scroll-view scroll-x>
		<view class='hor'>
			<block v-for="doc in docs" :key='doc.id'>
				<navigator :url="'/pages/document/document?id='+ doc.id" hover-class="none">
					<image class='doc-cover' :src='doc.cover' />
					<view class='font-lv4 ellipsis-2row'>{{doc.title}}</view>
				</navigator>
			</block>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		name: 'scrollDocument',
		data() {
			return {

			};
		},
		props: {
			docs: {
				type: Array,
				default: function(e) {
					return []
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.hor {
		display: flex;
		flex-direction: row;
	}

	.hor navigator {
		width: 85px;
		margin: 5px 5px;
	}

	.hor navigator:first-of-type {
		margin-left: 3px;
	}

	.hor navigator image {
		width: 85px;
		height: 112px;
		max-width: 100%;
		margin-bottom: 5px;
	}
</style>