export type UserRole = 'USER' | 'TEACHER' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt?: string;
};

export type LessonContentType = 'TEXT' | 'VIDEO' | 'FILE';

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string | null;
  tags: string[];
  published: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
  _count?: { lessons: number; enrollments?: number };
};

export type Lesson = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  contentType: LessonContentType;
  body: string | null;
  contentUrl: string | null;
  course?: Course;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
};

export type CourseEnrollmentItem = {
  enrolledAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
};

export type PaginatedCourseEnrollments = {
  items: CourseEnrollmentItem[];
  total: number;
  page: number;
  pageSize: number;
};
