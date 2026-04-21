import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../slices/authSlice';
import { authService } from '../../services/authService';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    dispatch(loginStart());

    try {
      const data = await authService.login(email, password);
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      toast.success('Đăng nhập thành công!');
      
      const role = data.user.role;
      if (role === 'admin') {
        navigate('/admin/users');
      } else if (role === 'teacher') {
        navigate('/teacher/questions');
      } else {
        navigate('/user/exams');
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch(loginFailure(message));
      toast.error(message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-900/20"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOWZhZmIiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40 dark:opacity-20"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-600 shadow-glow mb-4">
            <LogIn className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold gradient-text">Hệ Thống Thi Trắc Nghiệm</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Đăng nhập vào tài khoản của bạn</p>
        </div>

        <div className="card p-8 backdrop-blur-xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Nhập email của bạn"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Nhập mật khẩu của bạn"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex items-center justify-center gap-2 text-lg py-3.5"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Đăng ký tại đây
              </Link>
            </p>
          </div>

          <div className="mt-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 text-center mb-3">Tài khoản demo:</p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@demo.com', pass: 'Admin@123', bg: 'bg-red-600' },
                { role: 'Teacher', email: 'teacher@demo.com', pass: 'Teacher@123', bg: 'bg-education-600' },
                { role: 'User', email: 'user@demo.com', pass: 'User@123', bg: 'bg-primary-600' },
              ].map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className={`w-full p-3 rounded-xl ${acc.bg} text-white text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                >
                  <span className="font-bold">{acc.role}:</span> {acc.email}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
