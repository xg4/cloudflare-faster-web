import { useQuery } from '@tanstack/react-query'
import { useLocalStorage } from '@uidotdev/usehooks'
import { Divider } from 'antd'
import { lazy, Suspense } from 'react'
import { LOCAL_API_KEY } from './constants'

const HostTable = lazy(() => import('./components/HostTable'))
const Login = lazy(() => import('./components/Login'))
const TaskList = lazy(() => import('./components/TaskList'))

function App() {
  const [url] = useLocalStorage<string>(LOCAL_API_KEY)

  const { data, isLoading } = useQuery({
    queryKey: ['check', url],
    queryFn: async () => {
      const res = await fetch(new URL('/status', url))
      if (!res.ok) throw new Error('Invalid URL')
      const data = await res.json()
      if (data.status !== 'ok') throw new Error('Invalid URL')
      return data
    },
    enabled: !!url,
  })

  if (isLoading) {
    return null
  }

  return (
    <div className="container mx-auto p-10">
      {!data ? (
        <Suspense>
          <Login />
        </Suspense>
      ) : (
        <Suspense>
          <TaskList />
          <Divider />
          <HostTable />
        </Suspense>
      )}
    </div>
  )
}

export default App
