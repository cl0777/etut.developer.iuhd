import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminCourses, useCreateCourse } from '../api/hooks';
import type { Course } from '../types';

const { Title } = Typography;

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useAdminCourses();
  const createCourse = useCreateCourse();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const allTagOptions = useMemo(
    () =>
      [...new Set((data ?? []).flatMap((course) => course.tags))].map((tag) => ({
        label: tag,
        value: tag,
      })),
    [data],
  );
  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter((course) => {
      const haystack = [
        course.title,
        course.slug,
        course.category ?? '',
        course.tags.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [data, search]);

  const submit = async () => {
    const v = await form.validateFields();
    const tags = Array.isArray(v.tags)
      ? v.tags.map((t: string) => t.trim()).filter(Boolean)
      : [];
    try {
      await createCourse.mutateAsync({
        title: v.title,
        description: v.description,
        category: v.category || undefined,
        tags,
        published: v.published ?? false,
        isPrivate: v.isPrivate ?? false,
      });
      message.success('Course created');
      setOpen(false);
      form.resetFields();
    } catch {
      message.error('Failed to create course');
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <Title level={2} style={{ margin: 0 }}>
          Admin · Courses
        </Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          New course
        </Button>
      </Space>
      <Input.Search
        allowClear
        placeholder="Search courses by title, slug, category, tags"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ maxWidth: 480, marginBottom: 12 }}
      />
      <Table<Course>
        rowKey="id"
        loading={isLoading}
        dataSource={filteredCourses}
        pagination={{ pageSize: 10 }}
        columns={[
          { title: 'Title', dataIndex: 'title' },
          { title: 'Slug', dataIndex: 'slug', responsive: ['md'] },
          {
            title: 'Published',
            dataIndex: 'published',
            render: (p: boolean) => (p ? <Tag color="green">Yes</Tag> : <Tag>No</Tag>),
          },
          {
            title: 'Visibility',
            dataIndex: 'isPrivate',
            render: (isPrivate: boolean) =>
              isPrivate ? <Tag color="purple">Private</Tag> : <Tag color="blue">Public</Tag>,
          },
          {
            title: 'Lessons',
            key: 'lessons',
            render: (_, r) => r._count?.lessons ?? 0,
          },
          {
            title: 'Actions',
            key: 'a',
            render: (_, r) => (
              <Button type="link" onClick={() => navigate(`/admin/courses/${r.id}`)}>
                Manage
              </Button>
            ),
          },
        ]}
      />
      <Modal
        title="New course"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={submit}
        confirmLoading={createCourse.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="category" label="Category">
            <Input />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              showSearch
              allowClear
              placeholder="Type or select tags"
              options={allTagOptions}
              optionFilterProp="label"
            />
          </Form.Item>
          <Form.Item name="published" label="Published" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
          <Form.Item
            name="isPrivate"
            label="Private (invite/enrolled users only)"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
