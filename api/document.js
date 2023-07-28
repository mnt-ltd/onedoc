import {
	service
} from '@/utils/request'

export const createDocument = (data) => {
	return service({
		url: '/api/v1/document',
		method: 'post',
		data,
	})
}

export const updateDocument = (data) => {
	return service({
		url: '/api/v1/document',
		method: 'put',
		data,
	})
}

export const getDocument = (params) => {
	return service({
		url: '/api/v1/document',
		method: 'get',
		params,
	})
}

export const getRelatedDocuments = (params) => {
	return service({
		url: '/api/v1/document/related',
		method: 'get',
		params,
	})
}

export const listDocumentForHome = (params) => {
	return service({
		url: '/api/v1/document/home',
		method: 'get',
		params,
	})
}

export const listDocument = (params) => {
	return service({
		url: '/api/v1/document/list',
		method: 'get',
		params,
	})
}

export const searchDocument = (params) => {
	return service({
		url: '/api/v1/document/search',
		method: 'get',
		params,
	})
}

export const downloadDocument = (params) => {
	return service({
		url: '/api/v1/document/download',
		method: 'get',
		params,
	})
}

export const downloadVIPDocument = (params) => {
	return service({
		url: '/api/v1/document/download/vip',
		method: 'get',
		params,
	})
}


export const getDocumentScore = (params) => {
	return service({
		url: '/api/v1/document/score',
		method: 'get',
		params,
	})
}

export const setDocumentScore = (data) => {
	return service({
		url: '/api/v1/document/score',
		method: 'post',
		data,
	})
}

export const isDocumentExist = (params) => {
	return service({
		url: '/api/v1/document/exist',
		method: 'get',
		params,
	})
}

export const setDocumentsCategory = (data) => {
	return service({
		url: '/api/v1/document/category',
		method: 'put',
		data,
	})
}

export const setDocumentsVIP = (data) => {
	return service({
		url: '/api/v1/document/vip',
		method: 'put',
		data,
	})
}

export default {
	listDocument,
	listDocumentForHome,
}