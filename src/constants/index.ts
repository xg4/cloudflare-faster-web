import dayjs from 'dayjs'

export const today = [dayjs().startOf('d').toISOString(), dayjs().endOf('d').toISOString()]

export const yesterday = [
  dayjs().subtract(1, 'd').startOf('d').toISOString(),
  dayjs().subtract(1, 'd').endOf('d').toISOString(),
]

export const LOCAL_API_KEY = 'API_BASE_URL'

export const BASE_URL = 'http://127.0.0.1:8970'
