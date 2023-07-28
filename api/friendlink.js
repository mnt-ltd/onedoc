import {service} from '@/utils/request'

export const getFriendlink = (params) => {
  return service({
    url: '/api/v1/friendlink',
    method: 'get',
    params,
  })
}

export const listFriendlink = (params) => {
  return service({
    url: '/api/v1/friendlink/list',
    method: 'get',
    params,
  })
}


