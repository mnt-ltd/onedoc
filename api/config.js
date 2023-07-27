import {
	service
} from '../utils/request'

console.log('service', service)

export const getSettings = () => {
	return service({
		api: '/api/v1/settings'
	})
}


export default {
	getSettings,
}