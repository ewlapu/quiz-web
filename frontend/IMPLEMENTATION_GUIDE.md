# Frontend Implementation Guide

## ✅ Core Implementation Complete

The following has been fully implemented:

### 1. Project Setup & Configuration
- ✅ Vite + React 18
- ✅ TailwindCSS with dark mode
- ✅ Redux Toolkit store
- ✅ Axios client with interceptors
- ✅ Environment config

### 2. Redux Slices
- ✅ authSlice - Authentication state
- ✅ uiSlice - Theme & UI state
- ✅ subjectsSlice
- ✅ questionsSlice
- ✅ examsSlice
- ✅ attemptsSlice

### 3. API Services
- ✅ authService - Login, register, profile
- ✅ userService - User CRUD
- ✅ subjectService - Subject CRUD
- ✅ questionService - Question CRUD
- ✅ examService - Exam CRUD + public endpoints
- ✅ attemptService - Submit & view attempts
- ✅ exportService - Excel downloads

### 4. Shared Components
- ✅ AppLayout - Sidebar + Topbar
- ✅ Sidebar - Role-based navigation
- ✅ DataTable - Reusable table with pagination
- ✅ Modal - Headless UI modal
- ✅ ConfirmDialog - Confirmation dialogs
- ✅ Badge - Status badges
- ✅ EmptyState - Empty state component
- ✅ Skeleton - Loading skeletons

### 5. Pages Implemented
- ✅ Login page
- ✅ Register page
- ✅ Admin/Users - Full CRUD with search/filter
- ✅ User/ExamTaking - Complete exam UI with timer

### 6. Routes & Protection
- ✅ ProtectedRoute component
- ✅ Role-based routing
- ✅ App.jsx with route setup

## 📋 Remaining Pages to Implement

Follow the same pattern as Users page for these:

### Admin Pages

**1. Subjects** (`/admin/subjects`)
```jsx
import DataTable from '../../components/Common/DataTable';
import { subjectService } from '../../services/subjectService';
```

**2. Questions** (`/admin/questions`)
```jsx
import { questionService } from '../../services/questionService';
```

**3. Exams** (`/admin/exams`)
```jsx
import { examService } from '../../services/examService';
```

**4. Attempts** (`/admin/attempts`)
```jsx
import { attemptService } from '../../services/attemptService';
```

**5. Export** (`/admin/export`)
```jsx
import { exportService } from '../../services/exportService';
import { Download } from 'lucide-react';

export default function Export() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Export Data</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => exportService.exportUsers()} className="btn btn-primary">
          <Download /> Export Users
        </button>
        <button onClick={() => exportService.exportExams()} className="btn btn-primary">
          <Download /> Export Exams
        </button>
        <button onClick={() => exportService.exportAttempts()} className="btn btn-primary">
          <Download /> Export Attempts
        </button>
      </div>
    </div>
  );
}
```

### Teacher Pages

**1. Questions** (`/teacher/questions`)
- Same as Admin/Questions but filtered by createdBy

**2. Exams** (`/teacher/exams`)
- Same as Admin/Exams but filtered by createdBy

**3. Attempts** (`/teacher/attempts`)
- Filtered by teacher's exams

**4. Export** (`/teacher/export`)
- Only exams and attempts

### User Pages

**1. Exams List** (`/user/exams`)
```jsx
import { examService } from '../../services/examService';
import { useNavigate } from 'react-router-dom';
import { Clock, BookOpen } from 'lucide-react';

export default function UserExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  
  useEffect(() => {
    examService.getPublicExams().then(data => setExams(data.exams));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Exams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam._id} className="card p-6">
            <h3 className="font-bold text-lg mb-2">{exam.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Clock className="h-4 w-4" />
              {exam.timeLimit} minutes
            </div>
            <button 
              onClick={() => navigate(`/user/exams/${exam._id}`)}
              className="btn btn-primary w-full"
            >
              Start Exam
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**2. Result Page** (`/user/result/:attemptId`)
```jsx
import { attemptService } from '../../services/attemptService';
import { useParams } from 'react-router-dom';

export default function Result() {
  const { attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    attemptService.getAttempt(attemptId).then(data => setAttempt(data.attempt));
  }, [attemptId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Exam Result</h1>
      {attempt && (
        <div className="card p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-primary-600">
              {attempt.score.toFixed(2)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

**3. Attempts History** (`/user/attempts`)
```jsx
import { attemptService } from '../../services/attemptService';
import DataTable from '../../components/Common/DataTable';
```

**4. Profile** (`/user/profile`)
```jsx
import { authService } from '../../services/authService';
import { useDispatch, useSelector } from 'react-redux';

export default function Profile() {
  const { user } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await authService.updateProfile(formData);
    toast.success('Profile updated');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <div className="card p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
      </div>
    </div>
  );
}
```

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

## 📦 Add Routes in App.jsx

```jsx
import Subjects from './pages/Admin/Subjects';
import Questions from './pages/Admin/Questions';
import Exams from './pages/Admin/Exams';
import Attempts from './pages/Admin/Attempts';
import Export from './pages/Admin/Export';

import TeacherQuestions from './pages/Teacher/Questions';
import TeacherExams from './pages/Teacher/Exams';
import TeacherAttempts from './pages/Teacher/Attempts';
import TeacherExport from './pages/Teacher/Export';

import UserExams from './pages/User/Exams';
import ExamTaking from './pages/User/ExamTaking';
import Result from './pages/User/Result';
import UserAttempts from './pages/User/Attempts';
import Profile from './pages/User/Profile';

<Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AppLayout><Routes>
  <Route path="users" element={<Users />} />
  <Route path="subjects" element={<Subjects />} />
  <Route path="questions" element={<Questions />} />
  <Route path="exams" element={<Exams />} />
  <Route path="attempts" element={<Attempts />} />
  <Route path="export" element={<Export />} />
</Routes></AppLayout></ProtectedRoute>} />

<Route path="/teacher/*" element={<ProtectedRoute roles={['teacher']}><AppLayout><Routes>
  <Route path="questions" element={<TeacherQuestions />} />
  <Route path="exams" element={<TeacherExams />} />
  <Route path="attempts" element={<TeacherAttempts />} />
  <Route path="export" element={<TeacherExport />} />
</Routes></AppLayout></ProtectedRoute>} />

<Route path="/user/*" element={<ProtectedRoute roles={['user']}><AppLayout><Routes>
  <Route path="exams" element={<UserExams />} />
  <Route path="exams/:id" element={<ExamTaking />} />
  <Route path="result/:attemptId" element={<Result />} />
  <Route path="attempts" element={<UserAttempts />} />
  <Route path="profile" element={<Profile />} />
</Routes></AppLayout></ProtectedRoute>} />
```

## 🎨 UI Patterns

### Data Table Pattern
```jsx
<DataTable
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', render: (row) => <Badge>{row.status}</Badge> }
  ]}
  data={items}
  pagination={pagination}
  onPageChange={setPage}
  searchValue={search}
  onSearchChange={setSearch}
/>
```

### Modal Pattern
```jsx
<Modal isOpen={open} onClose={() => setOpen(false)} title="Title">
  <form onSubmit={handleSubmit}>
    <input className="input" />
    <button type="submit" className="btn btn-primary">Submit</button>
  </form>
</Modal>
```

### Confirm Pattern
```jsx
<ConfirmDialog
  isOpen={open}
  onClose={() => setOpen(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  message="Are you sure?"
/>
```

## 🔥 Key Features Already Working

✅ JWT authentication with auto-logout on 401
✅ Dark mode toggle
✅ Responsive sidebar (mobile drawer)
✅ Protected routes by role
✅ Toast notifications
✅ Loading states
✅ Exam timer with auto-submit
✅ Question navigator
✅ Excel export

## 📝 Notes

- All API services are ready to use
- Redux slices handle state management
- Components are reusable
- Follow the Users page pattern for CRUD
- Follow the ExamTaking page for complex UI
- No comments in code as required
