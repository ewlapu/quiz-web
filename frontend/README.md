# Quiz/Exam System Frontend

Modern React frontend for Quiz/Exam Management System

## Tech Stack

- **React 18** + **Vite**
- **React Router** v6
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Headless UI** - UI primitives
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Features

✅ Role-based authentication (Admin/Teacher/User)
✅ Responsive design + Dark mode
✅ Protected routes
✅ Modern UI with Tailwind CSS
✅ Exam taking with timer
✅ Auto-submit on time limit
✅ Question navigator
✅ User management (Admin)
✅ CRUD operations
✅ Excel export

## Installation

```bash
npm install
```

## Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_API_URL=http://localhost:2409/api
```

## Development

```bash
npm run dev
```

Frontend will run on: http://localhost:2910

## Build

```bash
npm run build
```

## Demo Accounts

- **Admin**: admin@demo.com / Admin@123
- **Teacher**: teacher@demo.com / Teacher@123
- **User**: user@demo.com / User@123

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   └── store.js
│   ├── slices/
│   │   ├── authSlice.js
│   │   ├── uiSlice.js
│   │   └── ...
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   └── ...
│   ├── components/
│   │   ├── Layout/
│   │   └── Common/
│   ├── pages/
│   │   ├── Auth/
│   │   ├── Admin/
│   │   ├── Teacher/
│   │   └── User/
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

## Key Features

### Authentication
- JWT token-based auth
- Auto-redirect based on role
- Protected routes

### UI/UX
- Dark mode toggle
- Responsive sidebar
- Mobile drawer menu
- Toast notifications
- Loading states
- Empty states

### Exam Taking
- Question navigator
- Timer countdown
- Auto-submit on timeout
- Answer tracking
- Confirm dialog

## Pages

### Admin
- Users management
- Subjects management
- Questions management
- Exams management
- Attempts view
- Excel export

### Teacher
- Questions CRUD (own)
- Exams CRUD (own)
- Attempts view
- Excel export

### User
- Browse exams
- Take exams
- View results
- Attempt history
- Profile management
