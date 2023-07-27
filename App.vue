<script>
	import {getSettings} from './api/config.js'
	export default {
		async onLaunch() {
			const res = await getSettings()
			console.log('App Launch', res)
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>
