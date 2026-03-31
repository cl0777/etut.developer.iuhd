import { BookOutlined, RocketOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ textAlign: 'center', padding: '48px 0' }}>
        <Title level={1}>Learn without limits</Title>
        <Paragraph style={{ fontSize: 18, maxWidth: 640, margin: '0 auto' }}>
          Bilim Portal is your place for structured courses, lessons with text, video,
          and downloadable materials — with enrollment tracking and an admin workspace
          for content teams.
        </Paragraph>
        <Space style={{ marginTop: 24 }}>
          <Button type="primary" size="large" icon={<BookOutlined />} onClick={() => navigate('/courses')}>
            Browse courses
          </Button>
          <Button size="large" icon={<RocketOutlined />} onClick={() => navigate('/register')}>
            Create account
          </Button>
        </Space>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card title="Catalog & search" bordered={false}>
            Filter by category and tags, search across titles and descriptions.
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Rich lessons" bordered={false}>
            Text, video links, and file resources in one learning path per course.
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Your profile" bordered={false}>
            See all courses you are enrolled in from one place.
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
