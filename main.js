import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import * as Pinia from 'pinia';
import { createUnistorage } from 'pinia-plugin-unistorage'
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	const store = Pinia.createPinia()
	store.use(createUnistorage())
	app.use(store)
	return {
		app
	}
}
// #endif