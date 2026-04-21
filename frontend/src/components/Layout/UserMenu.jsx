import { Fragment } from 'react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { LogOut, User, Sun, Moon, ChevronDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../slices/uiSlice';
import { logout } from '../../slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function UserMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.ui);
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <HeadlessMenu as="div" className="relative">
      <HeadlessMenu.Button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-700/50 transition-all">
        <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
          {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{user?.fullName}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
        </div>
        <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 hidden sm:block" />
      </HeadlessMenu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          
          <div className="py-2">
            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors`}
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Chế độ sáng</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Chế độ tối</span>
                    </>
                  )}
                </button>
              )}
            </HeadlessMenu.Item>

            <HeadlessMenu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active ? 'bg-red-50 dark:bg-red-900/20' : ''
                  } flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 transition-colors`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              )}
            </HeadlessMenu.Item>
          </div>
        </HeadlessMenu.Items>
      </Transition>
    </HeadlessMenu>
  );
}
