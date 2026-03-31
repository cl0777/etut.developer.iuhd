import { SearchOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Input, Row, Select, Space, Spin, Tag, Typography } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../api/hooks';

const { Title, Paragraph } = Typography;

export default function CatalogPage() {
  const [q, setQ] = useState('');
  const [category, setCategory] = useState<string | undefined>();
  const [tag, setTag] = useState<string | undefined>();
  const { data, isLoading, error } = useCourses(q || undefined, category, tag);
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const s = new Set<string>();
    data?.forEach((c) => {
      if (c.category) s.add(c.category);
    });
    return [...s].sort();
  }, [data]);

  const tags = useMemo(() => {
    const s = new Set<string>();
    data?.forEach((c) => c.tags.forEach((t) => s.add(t)));
    return [...s].sort();
  }, [data]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={2}>Course catalog</Title>
      <Space wrap>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search title or description"
          style={{ width: 280 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Select
          allowClear
          placeholder="Category"
          style={{ width: 180 }}
          value={category}
          onChange={setCategory}
          options={categories.map((c) => ({ label: c, value: c }))}
        />
        <Select
          allowClear
          placeholder="Tag"
          style={{ width: 180 }}
          value={tag}
          onChange={setTag}
          options={tags.map((t) => ({ label: t, value: t }))}
        />
      </Space>
      {isLoading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      )}
      {error && <Paragraph type="danger">Failed to load courses.</Paragraph>}
      {!isLoading && data?.length === 0 && <Empty description="No courses match your filters." />}
      <Row gutter={[24, 24]}>
        {data?.map((course) => (
          <Col xs={24} sm={12} lg={8} key={course.id}>
            <Card
              hoverable
              title={course.title}
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <Paragraph ellipsis={{ rows: 3 }}>{course.description}</Paragraph>
              <Space wrap>
                {course.category && <Tag>{course.category}</Tag>}
                {course.tags.slice(0, 4).map((t) => (
                  <Tag key={t} color="blue">
                    {t}
                  </Tag>
                ))}
              </Space>
              <Paragraph type="secondary" style={{ marginTop: 8, marginBottom: 0 }}>
                {course._count?.lessons ?? course.lessons?.length ?? 0} lessons
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
}
