<template>
	<view class="com-doc-simple-list">
		<view v-for="doc in documents" :key="'dl-' + doc.id" class="row">
			<navigator class="col-12" hover-class="none" :url="'/pages/document/document?id=' + doc.id">
				<view class="doc-title font-lv3 font-w400 ellipsis-1row">
					<image :src="`/static/images/${getIcon(doc.ext)}_24.png`" class="icon-mini" /> {{
					doc.title
				}}
				</view>
				<view class="doc-desc font-lv5 ellipsis-1row text-grey">
					<text>{{ relativeTime(new Date(doc.created_at)) }}</text> &nbsp;&nbsp;
					<text>{{ formatBytes(doc.size) }}</text>
				</view>
				<view class="doc-desc font-lv4 ellipsis-2row text-grey">{{
					doc.description
				}}</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import {
		relativeTime,
		joinImage,
		formatBytes,
		getIcon
	} from "@/utils/util.js";
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
				handler: function(val) {
					this.documents = (val || []).map((doc) => {
						doc.cover = joinImage(doc.cover);
						return doc;
					});
				},
				immediate: true,
			},
		},
		data() {
			return {
				documents: []
			};
		},
		methods:{
			relativeTime,
			formatBytes,
			getIcon,
		}
	};
</script>

<style lang="scss" scoped>
	.com-doc-simple-list {
		padding: 15px;
		padding-bottom: 5px;
		background-color: #fff;
		margin-bottom: -5px;
		border-radius: 8px;
		box-sizing: border-box;
		
		.icon-mini{
			width: 15px;
			height: 15px;
			position: relative;
			top: 2px;
		}

		.row {
			margin-bottom: 15px;
			border-bottom: 1px solid #efefef;
			padding-bottom: 13px;

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