<template>
	<view class="com-doc-list">
		<navigator v-for="doc in documents" :key="'dl-' + doc.id" :url="'/pages/document/document?id=' + doc.id"
			hover-class="none" class="row">
			<view class="col-3">
				<image class="doc-cover" :class="doc.is_vip ? 'doc-cover-vip': ''" :src="doc.cover"></image>
			</view>
			<view class="col-9">
				<view class="doc-title font-lv3 font-w400 ellipsis-1row">
					<image :src="`/static/images/${getIcon(doc.ext)}_24.png`" class="icon-mini" />
					<template v-if="isHtml">
						<template v-html="doc.title">
						</template>
					</template>
					<template v-else>{{doc.title}}</template>
				</view>
				<view class="doc-desc font-lv5 ellipsis-1row text-grey">
					<text>{{ doc.pages || '-' }} 页 &nbsp;&nbsp; </text>
					<text>{{ relativeTime(new Date(doc.created_at)) }} &nbsp;&nbsp; </text>
					<text>{{ formatBytes(doc.size) }}</text>
				</view>
				<view class="doc-desc font-lv4 ellipsis-2row text-grey">
					<template v-if="isHtml">
						<template v-html="doc.description">
						</template>
					</template>
					<template v-else>{{doc.description}}</template>
				</view>
			</view>
		</navigator>
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
			isHtml: {
				type: Boolean,
				default: false,
			}
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
		methods: {
			relativeTime,
			formatBytes,
			getIcon,
		}
	};
</script>

<style lang="scss" scoped>
	.com-doc-list {
		padding: 15px;
		background-color: #fff;
		margin-bottom: -5px;
		border-radius: 8px;
		box-sizing: border-box;

		.icon-mini {
			width: 15px;
			height: 15px;
			top: 2px;
		}

		.row {
			margin-bottom: 15px;
			border-bottom: 1px solid #efefef;
			padding-bottom: 13px;

			.doc-title {
				position: relative;
				padding-left: 18px;
				image{
					position: absolute;
					left: 0;
				}
			}

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