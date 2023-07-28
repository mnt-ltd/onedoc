import {
	service
} from '@/utils/request'

export const getArticle = (params) => {
	return service({
		url: '/api/v1/article',
		method: 'get',
		params,
	})
}

export const listArticle = (params) => {
	return service({
		url: '/api/v1/article/list',
		method: 'get',
		params,
	})
}