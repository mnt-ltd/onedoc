import {service} from '@/utils/request'

export const getSettings = () => {
  return service({
    url: '/api/v1/settings',
    method: 'get',
  })
}

export const getStats = () => {
  return service({
    url: '/api/v1/stats',
    method: 'get',
  })
}

export default {
	getSettings,
	getStats,
}