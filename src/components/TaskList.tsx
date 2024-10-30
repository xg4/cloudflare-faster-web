import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, List, Progress, Typography } from 'antd'
import { orderBy, sortBy } from 'lodash-es'
import { useCallback, useEffect, useState } from 'react'
import { today, yesterday } from '../constants'
import { LatencyRecord, Task } from '../types'
import { request } from '../utils/request'

function Card({ dateRange, title }: { dateRange: string[]; title: React.ReactNode }) {
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

  const getBestData = useCallback(
    (data?: LatencyRecord[]) => orderBy(data ?? [], ['packetLossRate', 'average', 'std']).slice(0, 10),
    [],
  )
  return (
    <List
      header={title}
      className="flex-1"
      loading={isLoading}
      itemLayout="horizontal"
      dataSource={getBestData(data)}
      renderItem={item => (
        <List.Item>
          <List.Item.Meta
            title={<Typography.Paragraph copyable={{ text: item.label }}>{item.label}</Typography.Paragraph>}
          />
          <ul className="text-xs text-gray-700">
            <li>延迟：{item.average}ms</li>
            <li>丢包：{(item.packetLossRate * 100).toFixed(1)}%</li>
          </ul>
        </List.Item>
      )}
    />
  )
}

export default function TaskList() {
  return (
    <div className="flex space-x-20">
      <Card title={<h3>今日最佳 TOP 10</h3>} dateRange={today} />
      <Card title={<h3>昨日最佳 TOP 10</h3>} dateRange={yesterday} />
      <TaskCard />
    </div>
  )
}

function TaskCard() {
  const { mutate: start, isPending } = useMutation({
    mutationFn: () => request.post('task').text(),
    onSuccess() {
      refetch()
    },
  })

  const { data, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => request.get('task').json<Task[]>(),
    select: data => sortBy(data, item => item.createdAt),
  })

  return (
    <List
      className="flex-1"
      header={
        <Button type="primary" size="small" onClick={() => start()} loading={isPending}>
          测试
        </Button>
      }
      itemLayout="horizontal"
      dataSource={data}
      renderItem={item => <TaskProgress key={item.label} {...item} />}
    />
  )
}

function TaskProgress({ label, value }: Task) {
  const [enabled, setEnabled] = useState(value !== 1)
  const { data } = useQuery({
    queryKey: ['task', label],
    queryFn: () => request.get(`progress/${label}`).json<number>(),
    refetchInterval: 5000,
    enabled,
    initialData: value,
  })

  useEffect(() => {
    if (data === 1) {
      setEnabled(false)
    }
  }, [data])

  const renderContent = useCallback(() => {
    {
      if (data === 0) {
        return <span className="text-xs">等待中</span>
      }
      if (data === 1) {
        return <span className="text-xs text-green-600">已完结</span>
      }

      return <span className="text-xs text-blue-500">执行中</span>
    }
  }, [data])
  return (
    <List.Item>
      <List.Item.Meta title={label} description={renderContent()} />
      <div className="w-40">
        <Progress showInfo={false} percent={data * 100} />
      </div>
    </List.Item>
  )
}
