import { useLocalStorage } from '@uidotdev/usehooks'
import { Button, Form, Input, message } from 'antd'
import { LOCAL_API_KEY } from '../constants'

export default function Login() {
  const [, set] = useLocalStorage(LOCAL_API_KEY)
  const onFinish = async (values: { url: string }) => {
    try {
      const u = new URL(values.url)
      set(u.origin)
    } catch {
      message.error('Invalid URL')
    }
  }
  return (
    <Form onFinish={onFinish} autoComplete="off">
      <Form.Item label="API Base URL" name="url" rules={[{ required: true, message: 'Invalid URL' }]}>
        <Input placeholder="http://127.0.0.1:8970" />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
