import {service} from '@/utils/request'

export const getBanner = (params) => {
  return service({
    url: '/api/v1/banner',
    method: 'get',
    params,
  })
}

export const listBanner = (params) => {
  return service({
    url: '/api/v1/banner/list',
    method: 'get',
    params,
  })
}


