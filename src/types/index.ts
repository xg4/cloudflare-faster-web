export type LatencyRecord = {
  label: string
  values: number[]
  average: string
  std: string
  packetLossRate: number
  createdAt: string
}

export type Task = {
  label: string
  value: number
  createdAt: string
}
