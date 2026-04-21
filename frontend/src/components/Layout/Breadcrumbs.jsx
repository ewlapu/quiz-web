import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbName = (path) => {
    const names = {
      admin: 'Quản trị',
      teacher: 'Giáo viên',
      user: 'Người dùng',
      users: 'Người dùng',
      subjects: 'Môn học',
      questions: 'Câu hỏi',
      exams: 'Đề thi',
      attempts: 'Bài làm',
      export: 'Xuất dữ liệu',
      profile: 'Hồ sơ',
    };
    return names[path] || path;
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
      <Link
        to="/"
        className="flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = getBreadcrumbName(value);

        return (
          <div key={to} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {isLast ? (
              <span className="font-semibold text-gray-900 dark:text-white">{name}</span>
            ) : (
              <Link
                to={to}
                className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
