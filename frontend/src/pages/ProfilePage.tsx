import { BookOutlined } from '@ant-design/icons';
import { Card, Empty, List, Spin, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMyCourses } from '../api/hooks';
import type { RootState } from '../store';

const { Title, Paragraph } = Typography;

export default function ProfilePage() {
  const user = useSelector((s: RootState) => s.auth.user);
  const navigate = useNavigate();
  const { data, isLoading } = useMyCourses();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Title level={2}>Profile</Title>
      <Paragraph>
        <strong>{user.name}</strong> · {user.email}
      </Paragraph>
      <Title level={4}>
        <BookOutlined /> Enrolled courses
      </Title>
      {isLoading && (
        <div style={{ padding: 24, textAlign: 'center' }}>
          <Spin />
        </div>
      )}
      {!isLoading && (!data || data.length === 0) && (
        <Empty description="You are not enrolled in any course yet." />
      )}
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2 }}
        dataSource={data ?? []}
        renderItem={(item) => (
          <List.Item>
            <Card
              hoverable
              title={item.course.title}
              onClick={() => navigate(`/courses/${item.course.id}`)}
            >
              <Paragraph ellipsis={{ rows: 2 }}>{item.course.description}</Paragraph>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
