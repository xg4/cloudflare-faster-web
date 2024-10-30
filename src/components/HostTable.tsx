import { useQuery } from '@tanstack/react-query'
import { Table, TableColumnsType } from 'antd'
import dayjs from 'dayjs'
import { today } from '../constants'
import { LatencyRecord } from '../types'
import { request } from '../utils/request'

export default function HostTable({ dateRange = today }: { dateRange?: string[] }) {
  const [gt, lt] = dateRange
  const { data, isLoading } = useQuery({
    queryKey: ['data', ...dateRange],
    queryFn: () =>
      request
        .get('data', {
          searchParams: {
            gt,
            lt,
          },
        })
        .json<LatencyRecord[]>(),
  })

  const columns: TableColumnsType<LatencyRecord> = [
    {
      title: '目标服务器',
      dataIndex: 'label',
      filterSearch: true,
      onFilter: (value, record) => record.label.includes(String(value)),
    },
    {
      title: '平均延迟',
      dataIndex: 'average',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => parseFloat(a.average) - parseFloat(b.average),
        multiple: 2,
      },
    },
    {
      title: '标准差 σ',
      dataIndex: 'std',
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => parseFloat(a.std) - parseFloat(b.std),
        multiple: 1,
      },
    },
    {
      title: '延迟',
      dataIndex: 'values',
      render(value: number[]) {
        return value.join(', ')
      },
    },
    {
      title: '丢包率',
      dataIndex: 'packetLossRate',
      render(value: number) {
        return (value * 100).toFixed(1) + '%'
      },
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => a.packetLossRate - b.packetLossRate,
        multiple: 3,
      },
    },
    {
      title: '最后一次请求时间',
      dataIndex: 'createdAt',
      render(value) {
        return dayjs(value).format('YYYY-MM-DD HH:mm:ss')
      },
    },
  ]

  return <Table rowKey="label" loading={isLoading} dataSource={data} columns={columns} />
}
