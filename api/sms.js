import {service} from '@/utils/request'

export const sendSMS = (data) => {
	return service({
		url: '/api/v1/sms',
		method: 'post',
		data,
	})
}