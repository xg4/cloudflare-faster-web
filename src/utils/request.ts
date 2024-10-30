import ky from 'ky'
import { LOCAL_API_KEY } from '../constants'

export const request = ky.create({
  retry: 0,
  hooks: {
    beforeRequest: [
      req => {
        const localUrl = localStorage.getItem(LOCAL_API_KEY)
        const baseUrl = localUrl && JSON.parse(localUrl)
        if (!baseUrl) {
          return req
        }
        const url = new URL(req.url)
        return new Request(url.href.replace(url.origin, baseUrl), req)
      },
    ],
  },
})
