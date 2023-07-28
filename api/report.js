import {service} from '@/utils/request'

export const createReport = (data) => {
  return service({
    url: '/api/v1/report',
    method: 'post',
    data,
  })
}

