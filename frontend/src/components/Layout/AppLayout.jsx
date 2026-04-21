import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
import Breadcrumbs from './Breadcrumbs';

export default function AppLayout({ children }) {
  const { theme } = useSelector((state) => state.ui);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={theme}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        <div className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-soft">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                  <div className="lg:hidden flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-glow">
                      <span className="text-white font-bold text-lg">Q</span>
                    </div>
                    <h1 className="text-xl font-bold gradient-text">Hệ Thống Thi</h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <UserMenu />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumbs />
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
