<template>
	<view class="com-doc-list">
		<navigator
			v-for="doc in documents"
			:key="'dl-' + doc.id"
			:url="'/pages/document/document?id=' + doc.id"
			hover-class="none"
			class="row"
		>
			<view class="col-3">
				<image class="doc-cover" :src="doc.cover"></image>
			</view>
			<view class="col-9">
				<view class="doc-title font-lv3 font-w400 ellipsis-1row">{{
					doc.title
				}}</view>
				<view class="doc-desc font-lv5 ellipsis-1row text-grey">
					<text>{{ doc.created_at }}</text> &nbsp;&nbsp;
					<text>{{ doc.size }}</text>
				</view>
				<view class="doc-desc font-lv4 ellipsis-2row text-grey">{{
					doc.description
				}}</view>
			</view>
		</navigator>
	</view>
</template>

<script>
	import { relativeTime, joinImage, formatBytes } from "@/utils/util.js";
	export default {
		name: "DocList",
		props: {
			docs: {
				type: Array,
				default: () => [],
			},
		},
		watch: {
			docs: {
				handler: function (val) {
					this.documents = (val || []).map((doc) => {
						doc.cover = joinImage(doc.cover);
						doc.created_at = relativeTime(doc.created_at);
						doc.size = formatBytes(doc.size);
						return doc;
					});
				},
				immediate: true,
			},
		},
		data() {
			return { documents: [] };
		},
	};
</script>

<style lang="scss" scoped>
	.com-doc-list {
		padding: 15px;
		background-color: #fff;
		margin-bottom: -5px;
		border-radius: 8px;
		box-sizing: border-box;

		.row {
			margin-bottom: 15px;
			border-bottom: 1px solid #efefef;
			padding-bottom: 13px;

			// .doc-title {
			// 	margin-top: 5px;
			// }

			.doc-desc {
				line-height: 180%;
				margin-top: 5px;
			}

			&:last-of-type {
				margin-bottom: 0;
				padding-bottom: 0;
				border-bottom: 0;
			}
		}
	}
</style>