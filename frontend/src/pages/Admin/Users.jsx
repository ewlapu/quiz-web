import { useState, useEffect } from 'react';
import { Plus, Edit, Lock, Unlock, Trash2, Users as UsersIcon, Search, Filter } from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import Badge from '../../components/Common/Badge';
import PageHeader from '../../components/Common/PageHeader';
import StatCard from '../../components/Common/StatCard';
import Section from '../../components/Common/Section';
import { userService } from '../../services/userService';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers({ page, limit: 10, search });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, { fullName: formData.fullName, role: formData.role });
        toast.success('Cập nhật người dùng thành công');
      } else {
        await userService.createUser(formData);
        toast.success('Tạo người dùng thành công');
      }
      setModalOpen(false);
      setEditingUser(null);
      setFormData({ fullName: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ fullName: user.fullName, email: user.email, password: '', role: user.role });
    setModalOpen(true);
  };

  const handleLock = async (user) => {
    try {
      await userService.lockUser(user.id);
      toast.success('Đã khóa người dùng');
      fetchUsers();
    } catch (error) {
      toast.error('Không thể khóa người dùng');
    }
  };

  const handleUnlock = async (user) => {
    try {
      await userService.unlockUser(user.id);
      toast.success('Đã mở khóa người dùng');
      fetchUsers();
    } catch (error) {
      toast.error('Không thể mở khóa người dùng');
    }
  };

  const handleDelete = async () => {
    try {
      await userService.deleteUser(deleteDialog.user.id);
      toast.success('Đã xóa người dùng');
      fetchUsers();
    } catch (error) {
      toast.error('Không thể xóa người dùng');
    }
  };

  const columns = [
    { key: 'fullName', label: 'Họ và tên' },
    { key: 'email', label: 'Email' },
    {
      key: 'role',
      label: 'Vai trò',
      render: (user) => (
        <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'teacher' ? 'warning' : 'default'}>
          {user.role === 'admin' ? 'Quản trị viên' : user.role === 'teacher' ? 'Giáo viên' : 'Người dùng'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (user) => (
        <Badge variant={user.status === 'active' ? 'success' : 'danger'}>
          {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (user) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800">
            <Edit className="h-4 w-4" />
          </button>
          {user.status === 'active' ? (
            <button onClick={() => handleLock(user)} className="text-yellow-600 hover:text-yellow-800">
              <Lock className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => handleUnlock(user)} className="text-green-600 hover:text-green-800">
              <Unlock className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setDeleteDialog({ open: true, user })} className="text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const stats = [
    {
      title: 'Tổng người dùng',
      value: pagination?.total || users.length || 0,
      icon: UsersIcon,
      gradient: 'education-600',
      description: 'Tất cả người dùng trong hệ thống',
    },
    {
      title: 'Người dùng hoạt động',
      value: users.filter(u => u.status === 'active').length,
      icon: UsersIcon,
      gradient: 'primary-600',
      description: 'Đang hoạt động',
    },
    {
      title: 'Quản trị viên',
      value: users.filter(u => u.role === 'admin').length,
      icon: UsersIcon,
      gradient: 'accent-600',
      description: 'Có quyền quản trị',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản lý người dùng"
        description="Quản lý và theo dõi tất cả người dùng trong hệ thống"
        icon={UsersIcon}
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Thêm người dùng
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <Section title="Danh sách người dùng" description="Xem và quản lý chi tiết từng người dùng">
        <div className="card p-6 border-0 shadow-soft">
          <DataTable
            columns={columns}
            data={users}
            pagination={pagination}
            onPageChange={setPage}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Tìm kiếm người dùng..."
            emptyMessage="Không tìm thấy người dùng"
          />
        </div>
      </Section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Họ và tên</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="input"
              required
            />
          </div>
          {!editingUser && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  required
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Vai trò</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="input"
            >
              <option value="user">Người dùng</option>
              <option value="teacher">Giáo viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {editingUser ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, user: null })}
        onConfirm={handleDelete}
        title="Xóa người dùng"
        message={`Bạn có chắc chắn muốn xóa ${deleteDialog.user?.fullName}?`}
        confirmText="Xóa"
      />
    </div>
  );
}
