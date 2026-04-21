import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  CheckSquare,
  Download,
  User as UserIcon
} from 'lucide-react';

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { user } = useSelector((state) => state.auth);

  const adminNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Người dùng', href: '/admin/users', icon: Users },
    { name: 'Môn học', href: '/admin/subjects', icon: BookOpen },
    { name: 'Câu hỏi', href: '/admin/questions', icon: HelpCircle },
    { name: 'Đề thi', href: '/admin/exams', icon: FileText },
    { name: 'Bài làm', href: '/admin/attempts', icon: CheckSquare },
    { name: 'Xuất dữ liệu', href: '/admin/export', icon: Download },
  ];

  const teacherNavigation = [
    { name: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
    { name: 'Câu hỏi', href: '/teacher/questions', icon: HelpCircle },
    { name: 'Đề thi', href: '/teacher/exams', icon: FileText },
    { name: 'Bài làm', href: '/teacher/attempts', icon: CheckSquare },
    { name: 'Xuất dữ liệu', href: '/teacher/export', icon: Download },
  ];

  const userNavigation = [
    { name: 'Đề thi', href: '/user/exams', icon: FileText },
    { name: 'Bài làm của tôi', href: '/user/attempts', icon: CheckSquare },
    { name: 'Hồ sơ', href: '/user/profile', icon: UserIcon },
  ];

  const navigation = user?.role === 'admin' 
    ? adminNavigation 
    : user?.role === 'teacher' 
    ? teacherNavigation 
    : userNavigation;

  return (
    <>
      <div className={`hidden lg:flex flex-col w-64 shrink-0 gap-y-5 overflow-y-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 px-6 pb-4`}>
        <div className="flex h-16 shrink-0 items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <h1 className="text-xl font-bold gradient-text">Hệ Thống Thi</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200 ${
                          isActive
                            ? 'bg-primary-600 text-white shadow-glow scale-105'
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:scale-105'
                        }`
                      }
                    >
                      <item.icon className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-y-auto">
            <div className="flex flex-col h-full">
              <div className="flex h-16 shrink-0 items-center justify-between gap-3 px-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow">
                    <span className="text-white font-bold text-lg">Q</span>
                  </div>
                  <h1 className="text-xl font-bold gradient-text">Hệ Thống Thi</h1>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex flex-1 flex-col px-6 py-4">
                <ul role="list" className="flex flex-1 flex-col gap-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200 ${
                            isActive
                              ? 'bg-primary-600 text-white shadow-glow'
                              : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
