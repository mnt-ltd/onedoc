import {service} from '@/utils/request'

export const uploadDocument = (data, option) => {
  return fileService({
    url: '/api/v1/upload/document',
    method: 'post',
    data,
    ...option,
  })
}
