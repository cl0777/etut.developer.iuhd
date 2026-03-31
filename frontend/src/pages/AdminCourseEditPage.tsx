import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
  message,
  Upload,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCourse,
  useCourseEnrollments,
  useCourseLessons,
  useCreateLesson,
  useDeleteCourse,
  useDeleteLesson,
  useAdminEnrollUser,
  useUploadLessonAsset,
  useUpdateCourse,
  useUpdateLesson,
} from '../api/hooks';
import type { Lesson, LessonContentType } from '../types';

const { Title } = Typography;

const contentTypes: { label: string; value: LessonContentType }[] = [
  { label: 'Text', value: 'TEXT' },
  { label: 'Video', value: 'VIDEO' },
  { label: 'File', value: 'FILE' },
];

export default function AdminCourseEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(id);
  const { data: lessons, refetch } = useCourseLessons(id);
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const adminEnrollUser = useAdminEnrollUser();
  const uploadLessonAsset = useUploadLessonAsset();

  const [courseForm] = Form.useForm();
  const [enrollForm] = Form.useForm();
  const [lessonOpen, setLessonOpen] = useState(false);
  const [enrolledSearch, setEnrolledSearch] = useState('');
  const [enrolledPage, setEnrolledPage] = useState(1);
  const [enrolledPageSize, setEnrolledPageSize] = useState(10);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [lessonForm] = Form.useForm();
  const lessonContentType = Form.useWatch('contentType', lessonForm);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } =
    useCourseEnrollments(
      id,
      enrolledSearch,
      enrolledPage,
      enrolledPageSize,
    );
  const tagOptions = useMemo(
    () =>
      (course?.tags ?? []).map((tag) => ({
        label: tag,
        value: tag,
      })),
    [course?.tags],
  );

  useEffect(() => {
    if (course) {
      courseForm.setFieldsValue({
        title: course.title,
        description: course.description,
        category: course.category ?? '',
        tags: course.tags,
        published: course.published,
        isPrivate: course.isPrivate,
      });
    }
  }, [course, courseForm]);

  const saveCourse = async () => {
    const v = await courseForm.validateFields();
    const tags = Array.isArray(v.tags)
      ? v.tags.map((t: string) => t.trim()).filter(Boolean)
      : [];
    if (!id) return;
    try {
      await updateCourse.mutateAsync({
        id,
        body: {
          title: v.title,
          description: v.description,
          category: v.category || undefined,
          tags,
          published: v.published,
          isPrivate: v.isPrivate,
        },
      });
      message.success('Course saved');
    } catch {
      message.error('Save failed');
    }
  };

  const openNewLesson = () => {
    setEditLesson(null);
    lessonForm.resetFields();
    lessonForm.setFieldsValue({ contentType: 'TEXT', order: 0 });
    setLessonOpen(true);
  };

  const openEditLesson = (l: Lesson) => {
    setEditLesson(l);
    lessonForm.setFieldsValue({
      title: l.title,
      description: l.description ?? '',
      order: l.order,
      contentType: l.contentType,
      body: l.body ?? '',
      contentUrl: l.contentUrl ?? '',
    });
    setLessonOpen(true);
  };

  const saveLesson = async () => {
    const v = await lessonForm.validateFields();
    if (!id) return;
    try {
      if (editLesson) {
        await updateLesson.mutateAsync({
          id: editLesson.id,
          courseId: id,
          body: {
            title: v.title,
            description: v.description || undefined,
            order: Number(v.order),
            contentType: v.contentType,
            body: v.contentType === 'TEXT' ? v.body : undefined,
            contentUrl:
              v.contentType === 'VIDEO' || v.contentType === 'FILE' ? v.contentUrl : undefined,
          },
        });
        message.success('Lesson updated');
      } else {
        await createLesson.mutateAsync({
          courseId: id,
          body: {
            title: v.title,
            description: v.description || undefined,
            order: v.order !== undefined ? Number(v.order) : undefined,
            contentType: v.contentType,
            body: v.contentType === 'TEXT' ? v.body : undefined,
            contentUrl:
              v.contentType === 'VIDEO' || v.contentType === 'FILE' ? v.contentUrl : undefined,
          },
        });
        message.success('Lesson created');
      }
      setLessonOpen(false);
      void refetch();
    } catch {
      message.error('Could not save lesson');
    }
  };

  const enrollUser = async () => {
    const values = await enrollForm.validateFields();
    if (!id) return;
    const email = String(values.email ?? '').trim();
    const userId = String(values.userId ?? '').trim();
    if (!email && !userId) {
      message.error('Provide email or user ID');
      return;
    }
    try {
      await adminEnrollUser.mutateAsync({
        courseId: id,
        email: email || undefined,
        userId: userId || undefined,
      });
      message.success('User enrolled');
      enrollForm.resetFields();
    } catch {
      message.error('Could not enroll user');
    }
  };

  if (isLoading || !course) {
    return <Typography.Paragraph>Loading…</Typography.Paragraph>;
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space>
        <Button onClick={() => navigate('/admin')}>← All courses</Button>
        <Title level={3} style={{ margin: 0 }}>
          {course.title}
        </Title>
      </Space>
      <Form form={courseForm} layout="vertical" style={{ maxWidth: 720 }}>
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
            options={tagOptions}
            optionFilterProp="label"
          />
        </Form.Item>
        <Form.Item name="published" label="Published" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item
          name="isPrivate"
          label="Private (only invited/enrolled users)"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Space>
          <Button type="primary" onClick={saveCourse} loading={updateCourse.isPending}>
            Save course
          </Button>
          <Popconfirm
            title="Delete this course and all lessons?"
            onConfirm={async () => {
              if (!id) return;
              try {
                await deleteCourse.mutateAsync(id);
                message.success('Deleted');
                navigate('/admin');
              } catch {
                message.error('Delete failed');
              }
            }}
          >
            <Button danger loading={deleteCourse.isPending}>
              Delete course
            </Button>
          </Popconfirm>
        </Space>
      </Form>

      <Form form={enrollForm} layout="inline">
        <Form.Item name="userId" label="Enroll by user ID">
          <Input placeholder="user uuid" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Invite by email"
          rules={[{ type: 'email', message: 'Valid email required' }]}
        >
          <Input placeholder="student@example.com" />
        </Form.Item>
        <Form.Item>
          <Button onClick={enrollUser} loading={adminEnrollUser.isPending}>
            Enroll user to this course
          </Button>
        </Form.Item>
      </Form>

      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4} style={{ marginBottom: 0 }}>
          Enrolled users
        </Title>
        <Input.Search
          allowClear
          placeholder="Search enrolled users by name or email"
          value={enrolledSearch}
          onChange={(e) => {
            setEnrolledSearch(e.target.value);
            setEnrolledPage(1);
          }}
          style={{ maxWidth: 420 }}
        />
        <Table
          rowKey={(row) => row.user.id}
          loading={enrollmentsLoading}
          dataSource={enrollmentsData?.items ?? []}
          pagination={{
            current: enrollmentsData?.page ?? enrolledPage,
            pageSize: enrollmentsData?.pageSize ?? enrolledPageSize,
            total: enrollmentsData?.total ?? 0,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setEnrolledPage(page);
              setEnrolledPageSize(pageSize);
            },
          }}
          columns={[
            { title: 'Name', dataIndex: ['user', 'name'] },
            { title: 'Email', dataIndex: ['user', 'email'] },
            {
              title: 'Role',
              dataIndex: ['user', 'role'],
              render: (role: string) => <Tag>{role}</Tag>,
            },
            {
              title: 'Enrolled at',
              dataIndex: 'enrolledAt',
              render: (v: string) => new Date(v).toLocaleString(),
            },
          ]}
        />
      </Space>

      <Space style={{ justifyContent: 'space-between', width: '100%' }}>
        <Title level={4}>Lessons</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openNewLesson}>
          Add lesson
        </Button>
      </Space>
      <Table
        rowKey="id"
        dataSource={lessons ?? []}
        pagination={false}
        columns={[
          { title: 'Order', dataIndex: 'order', width: 80 },
          { title: 'Title', dataIndex: 'title' },
          {
            title: 'Type',
            dataIndex: 'contentType',
            render: (t: string) => <Tag>{t}</Tag>,
          },
          {
            title: 'Actions',
            key: 'a',
            render: (_, l: Lesson) => (
              <Space>
                <Button type="link" onClick={() => openEditLesson(l)}>
                  Edit
                </Button>
                <Upload
                  showUploadList={false}
                  accept=".mp4,.mov,.avi,.mkv,.webm,.zip,.rar,.7z,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  beforeUpload={async (file) => {
                    if (!id) return false;
                    try {
                      await uploadLessonAsset.mutateAsync({
                        lessonId: l.id,
                        courseId: id,
                        file,
                      });
                      message.success('Asset uploaded');
                      void refetch();
                    } catch {
                      message.error('Upload failed or blocked file type');
                    }
                    return false;
                  }}
                >
                  <Button type="link" icon={<UploadOutlined />}>
                    Upload asset
                  </Button>
                </Upload>
                <Popconfirm
                  title="Delete lesson?"
                  onConfirm={async () => {
                    if (!id) return;
                    try {
                      await deleteLesson.mutateAsync({ id: l.id, courseId: id });
                      message.success('Deleted');
                      void refetch();
                    } catch {
                      message.error('Delete failed');
                    }
                  }}
                >
                  <Button type="link" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editLesson ? 'Edit lesson' : 'New lesson'}
        open={lessonOpen}
        onCancel={() => setLessonOpen(false)}
        onOk={saveLesson}
        confirmLoading={createLesson.isPending || updateLesson.isPending}
        width={560}
        destroyOnClose
      >
        <Form form={lessonForm} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Lesson description">
            <Input.TextArea rows={3} placeholder="Description visible for all lesson types" />
          </Form.Item>
          <Form.Item name="order" label="Order">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="contentType" label="Content type" rules={[{ required: true }]}>
            <Select options={contentTypes} />
          </Form.Item>
          {lessonContentType === 'TEXT' ? (
            <Form.Item name="body" label="Body">
              <Input.TextArea rows={6} />
            </Form.Item>
          ) : (
            <>
              <Form.Item name="contentUrl" label="URL">
                <Input placeholder="https://… or uploaded file URL" />
              </Form.Item>
              {editLesson ? (
                <Form.Item label="Upload">
                  <Upload
                    showUploadList={false}
                    accept=".mp4,.mov,.avi,.mkv,.webm,.zip,.rar,.7z,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                    beforeUpload={async (file) => {
                      if (!id) return false;
                      try {
                        const updated = await uploadLessonAsset.mutateAsync({
                          lessonId: editLesson.id,
                          courseId: id,
                          file,
                        });
                        lessonForm.setFieldValue('contentUrl', updated.contentUrl ?? '');
                        lessonForm.setFieldValue('contentType', updated.contentType);
                        message.success('Asset uploaded');
                      } catch {
                        message.error('Upload failed or blocked file type');
                      }
                      return false;
                    }}
                  >
                    <Button icon={<UploadOutlined />} loading={uploadLessonAsset.isPending}>
                      Upload video/material
                    </Button>
                  </Upload>
                </Form.Item>
              ) : (
                <Typography.Paragraph type="secondary">
                  Save lesson first, then upload file.
                </Typography.Paragraph>
              )}
            </>
          )}
        </Form>
      </Modal>
    </Space>
  );
}
