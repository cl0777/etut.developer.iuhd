import {
  BookOutlined,
  HomeOutlined,
  LoginOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, Space, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import type { RootState } from '../store';

const { Header, Content, Footer } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);

  const selected = (() => {
    const p = location.pathname;
    if (p.startsWith('/admin')) return 'admin';
    if (p.startsWith('/courses')) return 'courses';
    if (p === '/profile') return 'profile';
    return 'home';
  })();

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: '#001529',
        }}
      >
        <Space
          size="large"
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <BookOutlined style={{ color: '#fff', fontSize: 22 }} />
          <Typography.Title level={4} style={{ margin: 0, color: '#fff' }}>
            Bilim Portal
          </Typography.Title>
        </Space>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selected]}
          style={{ flex: 1, minWidth: 0, justifyContent: 'flex-end' }}
          items={[
            {
              key: 'home',
              icon: <HomeOutlined />,
              label: 'Home',
              onClick: () => navigate('/'),
            },
            {
              key: 'courses',
              icon: <BookOutlined />,
              label: 'Courses',
              onClick: () => navigate('/courses'),
            },
            ...(user && (user.role === 'ADMIN' || user.role === 'TEACHER')
              ? [
                  {
                    key: 'admin',
                    icon: <SettingOutlined />,
                    label: 'Manage',
                    onClick: () => navigate('/admin'),
                  },
                ]
              : []),
          ]}
        />
        <Space style={{ marginLeft: 16 }}>
          {user ? (
            <Dropdown
              menu={{
                items: [
                  {
                    key: 'profile',
                    icon: <UserOutlined />,
                    label: 'Profile',
                    onClick: () => navigate('/profile'),
                  },
                  {
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    label: 'Logout',
                    onClick: () => {
                      dispatch(logout());
                      navigate('/');
                    },
                  },
                ],
              }}
            >
              <Space style={{ cursor: 'pointer', color: '#fff' }}>
                <Avatar icon={<UserOutlined />} size="small" />
                <span>{user.name}</span>
              </Space>
            </Dropdown>
          ) : (
            <Button
              type="primary"
              icon={<LoginOutlined />}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          )}
        </Space>
      </Header>
      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Bilim Portal · Educational Portal
      </Footer>
    </Layout>
  );
}
