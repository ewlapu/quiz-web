import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { setUser } from './slices/authSlice';
import { authService } from './services/authService';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import AdminDashboard from './pages/Admin/Dashboard';
import Users from './pages/Admin/Users';
import Subjects from './pages/Admin/Subjects';
import Questions from './pages/Admin/Questions';
import AdminExams from './pages/Admin/Exams';
import AdminAttempts from './pages/Admin/Attempts';
import AdminExport from './pages/Admin/Export';

import TeacherDashboard from './pages/Teacher/Dashboard';
import TeacherQuestions from './pages/Teacher/Questions';
import TeacherExams from './pages/Teacher/Exams';
import TeacherAttempts from './pages/Teacher/Attempts';
import TeacherExport from './pages/Teacher/Export';

import UserExams from './pages/User/Exams';
import ExamTaking from './pages/User/ExamTaking';
import Result from './pages/User/Result';
import UserAttempts from './pages/User/Attempts';
import Profile from './pages/User/Profile';

export default function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && !user) {
      authService.getMe().then((data) => {
        dispatch(setUser(data.user));
      }).catch(() => {});
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'teacher' ? '/teacher/dashboard' : '/user/exams'} />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/user/exams" />} />
          
          <Route path="/admin/*" element={
            <ProtectedRoute roles={['admin']}>
              <AppLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<Users />} />
                  <Route path="subjects" element={<Subjects />} />
                  <Route path="questions" element={<Questions />} />
                  <Route path="exams" element={<AdminExams />} />
                  <Route path="attempts" element={<AdminAttempts />} />
                  <Route path="export" element={<AdminExport />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/teacher/*" element={
            <ProtectedRoute roles={['teacher']}>
              <AppLayout>
                <Routes>
                  <Route path="dashboard" element={<TeacherDashboard />} />
                  <Route path="questions" element={<TeacherQuestions />} />
                  <Route path="exams" element={<TeacherExams />} />
                  <Route path="attempts" element={<TeacherAttempts />} />
                  <Route path="export" element={<TeacherExport />} />
                  <Route path="*" element={<Navigate to="/teacher/dashboard" />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/user/*" element={
            <ProtectedRoute roles={['user']}>
              <AppLayout>
                <Routes>
                  <Route path="exams" element={<UserExams />} />
                  <Route path="exams/:id" element={<ExamTaking />} />
                  <Route path="result/:attemptId" element={<Result />} />
                  <Route path="attempts" element={<UserAttempts />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/user/exams" />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin/dashboard' : user?.role === 'teacher' ? '/teacher/dashboard' : '/user/exams') : '/login'} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
