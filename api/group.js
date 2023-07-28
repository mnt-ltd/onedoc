import {service} from '@/utils/request'

export const getGroup = (params) => {
  return service({
    url: '/api/v1/group',
    method: 'get',
    params,
  })
}

export const listGroup = (params) => {
  return service({
    url: '/api/v1/group/list',
    method: 'get',
    params,
  })
}
