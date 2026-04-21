import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard,
  Users, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  CheckSquare,
  Download,
  User as UserIcon,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function TopNav({ mobileMenuOpen, setMobileMenuOpen }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

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

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <>
      <nav className="hidden lg:flex items-center gap-1 flex-1">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active || isActive
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-xl z-50">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        active || isActive
                          ? 'bg-primary-600 text-white shadow-glow'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
