import {
	addr
} from '../config.js'

// 这里的params参数，主要是为了兼容axios中的params，将其合并到data中
export const service = (option) => {
	const {
		api,
		header,
		data,
		method,
		params
	} = {
		api: '',
		header: {},
		data: {},
		method: 'get',
		params: null,
		...option
	}
	const token = uni.getStorageSync('token')
	if (params) data = {
		...data,
		...params
	}
	const url = addr.trim() + api
	if (!header['authorization']) header['authorization'] = 'bearer ' + token
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