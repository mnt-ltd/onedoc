import {
	service
} from '@/utils/request'

export const getCategory = (params) => {
	return service({
		url: '/api/v1/category',
		method: 'get',
		params,
	})
}

export const listCategory = (params) => {
	return service({
		url: '/api/v1/category/list',
		method: 'get',
		params,
	})
}


export default {
	getCategory,
	listCategory
}