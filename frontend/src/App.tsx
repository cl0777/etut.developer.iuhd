import { Layout } from 'antd';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from './store';
import AppLayout from './components/AppLayout';
import AdminCourseEditPage from './pages/AdminCourseEditPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CatalogPage from './pages/CatalogPage';
import CoursePage from './pages/CoursePage';
import HomePage from './pages/HomePage';
import LessonPage from './pages/LessonPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useSelector((s: RootState) => s.auth.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'ADMIN' && user.role !== 'TEACHER') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CatalogPage />} />
          <Route path="courses/:id" element={<CoursePage />} />
          <Route path="lessons/:id" element={<LessonPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="admin/courses/:id"
            element={
              <AdminRoute>
                <AdminCourseEditPage />
              </AdminRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
