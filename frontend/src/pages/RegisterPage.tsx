import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../api/hooks';
import { setCredentials } from '../store/authSlice';

const { Title } = Typography;

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (v: { email: string; password: string; name: string }) => {
    try {
      const res = await registerRequest(v.email, v.password, v.name);
      dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
      message.success('Account created');
      navigate('/');
    } catch {
      message.error('Could not register (email may be taken)');
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: '0 auto' }}>
      <Title level={3} style={{ textAlign: 'center' }}>
        Register
      </Title>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" rules={[{ required: true, message: 'Name required' }]}>
          <Input prefix={<UserOutlined />} placeholder="Your name" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, type: 'email', message: 'Valid email required' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, min: 8, message: 'Min 8 characters' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create account
          </Button>
        </Form.Item>
      </Form>
      <div style={{ textAlign: 'center' }}>
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </Card>
  );
}
