import {service} from '@/utils/request'

export const getPunishment = (params) => {
  return service({
    url: '/api/v1/punishment',
    method: 'get',
    params,
  })
}

export const listPunishment = (params) => {
  return service({
    url: '/api/v1/punishment/list',
    method: 'get',
    params,
  })
}