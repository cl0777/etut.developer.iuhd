import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, List, Space, Spin, Tag, Typography, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useCourse,
  useCourseLessons,
  useEnroll,
  useMyCourses,
  useUnenroll,
} from '../api/hooks';
import type { RootState } from '../store';

const { Title, Paragraph } = Typography;

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSelector((s: RootState) => s.auth.user);
  const { data: course, isLoading, error } = useCourse(id);
  const { data: lessons } = useCourseLessons(id);
  const { data: myCourses } = useMyCourses(Boolean(user));
  const enroll = useEnroll();
  const unenroll = useUnenroll();
  const isEnrolled = Boolean(
    id && myCourses?.some((item) => item.course.id === id),
  );

  const handleEnrollToggle = async () => {
    if (!id || !user) {
      message.info('Please log in to enroll.');
      navigate('/login');
      return;
    }
    try {
      if (isEnrolled) {
        await unenroll.mutateAsync(id);
        message.success('Unenrolled successfully');
      } else {
        await enroll.mutateAsync(id);
        message.success('Enrolled successfully');
      }
    } catch {
      message.error('Could not update enrollment');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }
  if (error || !course) {
    return <Paragraph type="danger">Course not found.</Paragraph>;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/courses')}>
        Back to catalog
      </Button>
      <Card>
        <Title level={2}>{course.title}</Title>
        <Space wrap style={{ marginBottom: 16 }}>
          {course.category && <Tag>{course.category}</Tag>}
          {course.tags.map((t) => (
            <Tag key={t} color="blue">
              {t}
            </Tag>
          ))}
        </Space>
        <Paragraph>{course.description}</Paragraph>
        {user && (
          <Button
            type={isEnrolled ? 'default' : 'primary'}
            danger={isEnrolled}
            onClick={handleEnrollToggle}
            loading={enroll.isPending || unenroll.isPending}
          >
            {isEnrolled ? 'Unenroll from this course' : 'Enroll in this course'}
          </Button>
        )}
      </Card>
      <Card title="Lessons">
        <List
          dataSource={lessons ?? []}
          locale={{ emptyText: 'No lessons yet.' }}
          renderItem={(item) => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/lessons/${item.id}`)}
            >
              <List.Item.Meta
                title={item.title}
                description={`${item.contentType}${item.order != null ? ` · Order ${item.order}` : ''}`}
              />
            </List.Item>
          )}
        />
      </Card>
    </Space>
  );
}
