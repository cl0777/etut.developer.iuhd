import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import type {
  AuthResponse,
  Course,
  Lesson,
  PaginatedCourseEnrollments,
} from '../types';

export function useCourses(q?: string, category?: string, tag?: string) {
  return useQuery({
    queryKey: ['courses', { q, category, tag }],
    queryFn: async () => {
      const { data } = await api.get<Course[]>('/api/courses', {
        params: { q, category, tag },
      });
      return data;
    },
  });
}

export function useCourse(id: string | undefined) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const { data } = await api.get<Course>(`/api/courses/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCourseLessons(courseId: string | undefined) {
  return useQuery({
    queryKey: ['course-lessons', courseId],
    queryFn: async () => {
      const { data } = await api.get<Lesson[]>(`/api/courses/${courseId}/lessons`);
      return data;
    },
    enabled: !!courseId,
  });
}

export function useLesson(id: string | undefined) {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      const { data } = await api.get<Lesson>(`/api/lessons/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useMyCourses(enabled = true) {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: async () => {
      const { data } = await api.get<
        { enrolledAt: string; course: Course & { _count?: { lessons: number } } }[]
      >('/api/users/me/courses');
      return data;
    },
    enabled,
  });
}

export function useAdminCourses() {
  return useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data } = await api.get<Course[]>('/api/courses/admin/all');
      return data;
    },
  });
}

export function useEnroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await api.post(`/api/courses/${courseId}/enroll`);
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['my-courses'] });
    },
  });
}

export function useUnenroll() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (courseId: string) => {
      const { data } = await api.delete(`/api/courses/${courseId}/enroll`);
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['my-courses'] });
      void qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}


export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const { data } = await api.post<Course>('/api/courses', body);
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-courses'] });
      void qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => {
      const { data } = await api.patch<Course>(`/api/courses/${id}`, body);
      return data;
    },
    onSuccess: (_, v) => {
      void qc.invalidateQueries({ queryKey: ['admin-courses'] });
      void qc.invalidateQueries({ queryKey: ['course', v.id] });
      void qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/courses/${id}`);
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin-courses'] });
      void qc.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useCreateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      body,
    }: {
      courseId: string;
      body: Record<string, unknown>;
    }) => {
      const { data } = await api.post<Lesson>(
        `/api/courses/${courseId}/lessons`,
        body,
      );
      return data;
    },
    onSuccess: (created) => {
      void qc.invalidateQueries({ queryKey: ['course-lessons', created.courseId] });
      void qc.invalidateQueries({ queryKey: ['course', created.courseId] });
      void qc.invalidateQueries({ queryKey: ['admin-courses'] });
    },
  });
}

export function useUpdateLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      courseId: string;
      body: Record<string, unknown>;
    }) => {
      const { data } = await api.patch<Lesson>(`/api/lessons/${id}`, body);
      return data;
    },
    onSuccess: (_, v) => {
      void qc.invalidateQueries({ queryKey: ['course-lessons', v.courseId] });
      void qc.invalidateQueries({ queryKey: ['lesson', v.id] });
    },
  });
}

export function useDeleteLesson() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, courseId }: { id: string; courseId: string }) => {
      await api.delete(`/api/lessons/${id}`);
      return courseId;
    },
    onSuccess: (courseId) => {
      void qc.invalidateQueries({ queryKey: ['course-lessons', courseId] });
      void qc.invalidateQueries({ queryKey: ['admin-courses'] });
    },
  });
}

export function useAdminEnrollUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      courseId,
      email,
      userId,
    }: {
      courseId: string;
      email?: string;
      userId?: string;
    }) => {
      const { data } = await api.post(`/api/courses/${courseId}/admin-enroll-user`, {
        email,
        userId,
      });
      return data;
    },
    onSuccess: (_, v) => {
      void qc.invalidateQueries({ queryKey: ['course', v.courseId] });
      void qc.invalidateQueries({ queryKey: ['my-courses'] });
      void qc.invalidateQueries({ queryKey: ['admin-courses'] });
    },
  });
}

export function useUploadLessonAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      lessonId,
      courseId,
      file,
    }: {
      lessonId: string;
      courseId: string;
      file: File;
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post<Lesson>(
        `/api/lessons/${lessonId}/upload-asset`,
        formData,
        {
        headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return data;
    },
    onSuccess: (_, v) => {
      void qc.invalidateQueries({ queryKey: ['lesson', v.lessonId] });
      void qc.invalidateQueries({ queryKey: ['course-lessons', v.courseId] });
      void qc.invalidateQueries({ queryKey: ['course', v.courseId] });
    },
  });
}

export function useCourseEnrollments(
  courseId: string | undefined,
  search: string,
  page: number,
  pageSize: number,
) {
  return useQuery({
    queryKey: ['course-enrollments', courseId, search, page, pageSize],
    queryFn: async () => {
      const { data } = await api.get<PaginatedCourseEnrollments>(
        `/api/courses/${courseId}/enrollments`,
        {
          params: { search: search || undefined, page, pageSize },
        },
      );
      return data;
    },
    enabled: !!courseId,
  });
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', {
    email,
    password,
  });
  return data;
}

export async function registerRequest(
  email: string,
  password: string,
  name: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', {
    email,
    password,
    name,
  });
  return data;
}
