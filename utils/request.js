import {
	addr
} from '../config.js'
import qs from 'qs'
import {
	useUserStore
} from '@/stores/user.js'

// 序列化Get请求数据，以处理query中带数组的情况
uni.addInterceptor('request', {
	invoke(args) {
		const {
			data,
			method
		} = args
		if (String(method) === 'get') {
			args.url = args.url + "?" + qs.stringify(data, {
				arrayFormat: 'repeat',
				skipNulls: true
			})
			delete args.data
		}
	}
})

// 这里的params参数，主要是为了兼容axios中的params，将其合并到data中
export const service = (option) => {
	let {
		header,
		data,
		method,
		params,
		url
	} = {
		header: {},
		data: {},
		method: 'get',
		params: null,
		url: '',
		...option
	}
	
	const store = useUserStore()
	if (params) data = {
		...data,
		...params
	}

	url = addr.trim() + url
	if (!header['authorization']) header['authorization'] = 'bearer ' + store.token

	return new Promise((resolve, reject) => {
		uni.request({
			...option,
			url,
			method,
			header,
			data,
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			}
		})
	})
}

export default {
	service,
}