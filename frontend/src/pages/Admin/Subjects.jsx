import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import Badge from '../../components/Common/Badge';
import PageHeader from '../../components/Common/PageHeader';
import Section from '../../components/Common/Section';
import StatCard from '../../components/Common/StatCard';
import { subjectService } from '../../services/subjectService';
import { useDispatch, useSelector } from 'react-redux';
import { setSubjects, addSubject, updateSubject, removeSubject } from '../../slices/subjectsSlice';
import toast from 'react-hot-toast';

export default function Subjects() {
  const dispatch = useDispatch();
  const { subjects } = useSelector((state) => state.subjects);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, subject: null });
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = subjects.filter(subject =>
        subject.name.toLowerCase().includes(search.toLowerCase()) ||
        (subject.description && subject.description.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects(subjects);
    }
  }, [search, subjects]);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const data = await subjectService.getSubjects();
      dispatch(setSubjects(data.subjects));
      setFilteredSubjects(data.subjects);
    } catch (error) {
      toast.error('Không thể tải danh sách môn học');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSubject) {
        const data = await subjectService.updateSubject(editingSubject._id, formData);
        dispatch(updateSubject(data.subject));
        toast.success('Cập nhật môn học thành công');
      } else {
        const data = await subjectService.createSubject(formData);
        dispatch(addSubject(data.subject));
        toast.success('Tạo môn học thành công');
      }
      setModalOpen(false);
      setEditingSubject(null);
      setFormData({ name: '', description: '', status: 'active' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name, description: subject.description || '', status: subject.status });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await subjectService.deleteSubject(deleteDialog.subject._id);
      dispatch(removeSubject(deleteDialog.subject._id));
      toast.success('Đã xóa môn học');
    } catch (error) {
      toast.error('Không thể xóa môn học');
    }
  };

  const columns = [
    { key: 'name', label: 'Tên môn học' },
    { key: 'description', label: 'Mô tả' },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (subject) => (
        <Badge variant={subject.status === 'active' ? 'success' : 'warning'}>
          {subject.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (subject) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(subject)} className="text-blue-600 hover:text-blue-800">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteDialog({ open: true, subject })} className="text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const stats = [
    {
      title: 'Tổng môn học',
      value: subjects.length,
      icon: BookOpen,
      gradient: 'education-600',
      description: 'Tất cả môn học',
    },
    {
      title: 'Đang hoạt động',
      value: subjects.filter(s => s.status === 'active').length,
      icon: BookOpen,
      gradient: 'primary-600',
      description: 'Môn học đang sử dụng',
    },
    {
      title: 'Không hoạt động',
      value: subjects.filter(s => s.status === 'inactive').length,
      icon: BookOpen,
      gradient: 'gray-600',
      description: 'Môn học đã tạm dừng',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản lý môn học"
        description="Quản lý và tổ chức các môn học trong hệ thống"
        icon={BookOpen}
        action={
          <button
            onClick={() => { setEditingSubject(null); setFormData({ name: '', description: '', status: 'active' }); setModalOpen(true); }}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Thêm môn học
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <Section title="Danh sách môn học" description="Xem và quản lý chi tiết từng môn học">
        <div className="card p-6 border-0 shadow-soft">
          <DataTable
            columns={columns}
            data={filteredSubjects}
            pagination={null}
            onPageChange={() => {}}
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Tìm kiếm môn học..."
            emptyMessage="Không có môn học nào"
          />
        </div>
      </Section>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingSubject ? 'Chỉnh sửa môn học' : 'Thêm môn học'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên môn học</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="input"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSubject ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, subject: null })}
        onConfirm={handleDelete}
        title="Xóa môn học"
        message={`Bạn có chắc chắn muốn xóa môn học "${deleteDialog.subject?.name}"?`}
        confirmText="Xóa"
      />
    </div>
  );
}
