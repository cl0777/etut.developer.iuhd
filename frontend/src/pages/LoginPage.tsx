import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/hooks';
import { setCredentials } from '../store/authSlice';

const { Title } = Typography;

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (v: { email: string; password: string }) => {
    try {
      const res = await loginRequest(v.email, v.password);
      dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
      message.success('Welcome back');
      navigate('/');
    } catch {
      message.error('Invalid email or password');
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>
        Log in
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Password required' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log in
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        No account? <Link to="/register">Register</Link>
      </div>
    </Card>
  );
}
