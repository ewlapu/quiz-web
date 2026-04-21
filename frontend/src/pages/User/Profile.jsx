import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Calendar, Shield, CheckSquare, TrendingUp, Award, Clock, Edit2, Save, X, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../services/authService';
import { attemptService } from '../../services/attemptService';
import { setUser } from '../../slices/authSlice';
import PageHeader from '../../components/Common/PageHeader';
import Section from '../../components/Common/Section';
import StatCard from '../../components/Common/StatCard';
import Badge from '../../components/Common/Badge';
import toast from 'react-hot-toast';

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('info');
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    passedExams: 0,
    recentAttempts: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const data = await attemptService.getMyAttempts({ page: 1, limit: 5 });
      const attempts = data.attempts || [];
      const total = data.pagination?.total || 0;
      const average = attempts.length > 0
        ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        : 0;
      const passed = attempts.filter(a => a.score >= 50).length;

      setStats({
        totalAttempts: total,
        averageScore: average,
        passedExams: passed,
        recentAttempts: attempts.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await authService.updateProfile({
        fullName: formData.fullName,
        email: formData.email,
      });
      dispatch(setUser(data.user));
      toast.success('Cập nhật thông tin thành công');
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);
    try {
      await authService.updateProfile({
        password: passwordData.newPassword,
      });
      toast.success('Đổi mật khẩu thành công');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setActiveTab('info');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Quản trị viên',
      teacher: 'Giáo viên',
      user: 'Người dùng',
    };
    return labels[role] || role;
  };

  const getStatusLabel = (status) => {
    const labels = {
      active: 'Hoạt động',
      locked: 'Đã khóa',
    };
    return labels[status] || status;
  };

  const statCards = [
    {
      title: 'Tổng bài làm',
      value: stats.totalAttempts,
      icon: CheckSquare,
      gradient: 'education-600',
      description: 'Số bài thi đã làm',
    },
    {
      title: 'Điểm trung bình',
      value: stats.averageScore > 0 ? stats.averageScore.toFixed(1) + '%' : '0%',
      icon: TrendingUp,
      gradient: 'primary-600',
      description: 'Điểm số trung bình',
    },
    {
      title: 'Bài đạt',
      value: stats.passedExams,
      icon: Award,
      gradient: 'accent-600',
      description: 'Điểm >= 50%',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Hồ sơ của tôi"
        description="Quản lý thông tin cá nhân và xem thống kê hoạt động"
        icon={User}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 border-0 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thông tin cá nhân</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Chỉnh sửa
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setFormData({
                        fullName: user?.fullName || '',
                        email: user?.email || '',
                      });
                    }}
                    className="btn btn-secondary flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                    <User className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Họ và tên</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.fullName || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="p-3 rounded-xl bg-education-100 dark:bg-education-900/30">
                    <Mail className="h-5 w-5 text-education-600 dark:text-education-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="p-3 rounded-xl bg-accent-100 dark:bg-accent-900/30">
                    <Shield className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Vai trò</p>
                    <Badge variant={user?.role === 'admin' ? 'danger' : user?.role === 'teacher' ? 'warning' : 'default'}>
                      {getRoleLabel(user?.role)}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
                    <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Ngày tham gia</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card p-6 border-0 shadow-soft">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Đổi mật khẩu</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="input pr-10"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="input pr-10"
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="input"
                  placeholder="Nhập lại mật khẩu mới"
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex items-center gap-2 w-full"
              >
                <Lock className="h-4 w-4" />
                {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6 border-0 shadow-soft">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Thông tin tài khoản</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Trạng thái</span>
                <Badge variant={user?.status === 'active' ? 'success' : 'danger'}>
                  {getStatusLabel(user?.status)}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Vai trò</span>
                <Badge variant={user?.role === 'admin' ? 'danger' : user?.role === 'teacher' ? 'warning' : 'default'}>
                  {getRoleLabel(user?.role)}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-600 dark:text-gray-400">Thành viên từ</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {stats.recentAttempts.length > 0 && (
            <div className="card p-6 border-0 shadow-soft">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Bài làm gần đây
              </h2>
              <div className="space-y-3">
                {stats.recentAttempts.map((attempt, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {attempt.examId?.title || 'N/A'}
                      </p>
                      <Badge variant={attempt.score >= 50 ? 'success' : 'danger'}>
                        {attempt.score.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(attempt.submittedAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
