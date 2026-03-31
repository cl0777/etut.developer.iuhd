import { ArrowLeftOutlined, FileOutlined, LinkOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Card, Space, Spin, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useLesson } from '../api/hooks';

const { Title, Paragraph } = Typography;

function iconFor(type: string) {
  if (type === 'VIDEO') return <LinkOutlined />;
  if (type === 'FILE') return <FileOutlined />;
  return <ReadOutlined />;
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lesson, isLoading, error } = useLesson(id);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }
  if (error || !lesson) {
    return <Paragraph type="danger">Lesson not found.</Paragraph>;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() =>
          lesson.courseId
            ? navigate(`/courses/${lesson.courseId}`)
            : navigate('/courses')
        }
      >
        Back to course
      </Button>
      <Card>
        <Space>
          {iconFor(lesson.contentType)}
          <Title level={2} style={{ margin: 0 }}>
            {lesson.title}
          </Title>
        </Space>
        <Paragraph type="secondary">{lesson.contentType}</Paragraph>
        {lesson.description && (
          <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{lesson.description}</Paragraph>
        )}
        {lesson.contentType === 'TEXT' && lesson.body && (
          <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{lesson.body}</Paragraph>
        )}
        {(lesson.contentType === 'VIDEO' || lesson.contentType === 'FILE') &&
          lesson.contentUrl && (
            <Paragraph>
              <a href={lesson.contentUrl} target="_blank" rel="noreferrer">
                Open resource
              </a>
            </Paragraph>
          )}
      </Card>
    </Space>
  );
}
