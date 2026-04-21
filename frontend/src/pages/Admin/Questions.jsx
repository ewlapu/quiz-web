import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import FilterBar from '../../components/Common/FilterBar';
import TimelineView from '../../components/Common/TimelineView';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import PageHeader from '../../components/Common/PageHeader';
import { questionService } from '../../services/questionService';
import { subjectService } from '../../services/subjectService';
import { useDispatch, useSelector } from 'react-redux';
import { setQuestions, addQuestion, updateQuestion, removeQuestion } from '../../slices/questionsSlice';
import toast from 'react-hot-toast';

export default function Questions() {
  const dispatch = useDispatch();
  const { questions, pagination } = useSelector((state) => state.questions);
  const { subjects } = useSelector((state) => state.subjects);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, question: null });
  const [filters, setFilters] = useState({
    search: '',
    subjectId: '',
    correctOption: '',
    sortBy: '',
  });
  const [formData, setFormData] = useState({
    subjectId: '',
    content: '',
    options: { A: '', B: '', C: '', D: '' },
    correctOption: 'A',
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [page, filters]);

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getSubjects();
      dispatch({ type: 'subjects/setSubjects', payload: data.subjects });
    } catch (error) {
      toast.error('Không thể tải danh sách môn học');
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = { page, limit: viewMode === 'timeline' ? 100 : 10 };
      if (filters.search) params.search = filters.search;
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.sortBy) {
        const [field, order] = filters.sortBy.split('_');
        params.sortBy = field;
        params.sortOrder = order;
      }

      const data = await questionService.getQuestions(params);
      let filteredQuestions = data.questions || [];

      if (filters.correctOption) {
        filteredQuestions = filteredQuestions.filter(q => q.correctOption === filters.correctOption);
      }

      dispatch(setQuestions({ questions: filteredQuestions, pagination: data.pagination }));
    } catch (error) {
      toast.error('Không thể tải danh sách câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        const data = await questionService.updateQuestion(editingQuestion._id, formData);
        dispatch(updateQuestion(data.question));
        toast.success('Cập nhật câu hỏi thành công');
      } else {
        const data = await questionService.createQuestion(formData);
        dispatch(addQuestion(data.question));
        toast.success('Tạo câu hỏi thành công');
      }
      setModalOpen(false);
      setEditingQuestion(null);
      setFormData({ subjectId: '', content: '', options: { A: '', B: '', C: '', D: '' }, correctOption: 'A' });
      fetchQuestions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      subjectId: question.subjectId._id || question.subjectId,
      content: question.content,
      options: question.options,
      correctOption: question.correctOption,
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await questionService.deleteQuestion(deleteDialog.question._id);
      dispatch(removeQuestion(deleteDialog.question._id));
      toast.success('Đã xóa câu hỏi');
      fetchQuestions();
    } catch (error) {
      toast.error('Không thể xóa câu hỏi');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      subjectId: '',
      correctOption: '',
      sortBy: '',
    });
    setPage(1);
  };

  const handleViewDetail = (question) => {
    handleEdit(question);
  };

  const columns = [
    {
      key: 'content',
      label: 'Nội dung',
      render: (question) => <div className="max-w-md truncate">{question.content}</div>,
    },
    {
      key: 'subject',
      label: 'Môn học',
      render: (question) => question.subjectId?.name || 'N/A',
    },
    {
      key: 'correctOption',
      label: 'Đáp án đúng',
      render: (question) => <span className="font-semibold text-green-600">{question.correctOption}</span>,
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (question) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(question)} className="text-blue-600 hover:text-blue-800">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteDialog({ open: true, question })} className="text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý câu hỏi"
        description="Quản lý tất cả câu hỏi trong hệ thống"
        icon={HelpCircle}
        action={
          <button onClick={() => { setEditingQuestion(null); setFormData({ subjectId: '', content: '', options: { A: '', B: '', C: '', D: '' }, correctOption: 'A' }); setModalOpen(true); }} className="btn btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Thêm câu hỏi
          </button>
        }
      />

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        showViewToggle={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        subjects={subjects}
      />

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={questions}
          pagination={pagination}
          onPageChange={setPage}
          searchValue={filters.search}
          onSearchChange={(val) => handleFilterChange({ ...filters, search: val })}
          emptyMessage="Không có câu hỏi nào"
          loading={loading}
          hideSearch={true}
        />
      ) : (
        <div className="card p-6 border-0 shadow-soft">
          <TimelineView
            items={questions}
            type="questions"
            onItemClick={handleViewDetail}
            getDate={(item) => item.createdAt}
            getTitle={(item) => item.content}
            getSubject={(item) => item.subjectId?.name}
          />
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Môn học</label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="input"
              required
            >
              <option value="">Chọn môn học</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nội dung câu hỏi</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input"
              rows="3"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-2">Các lựa chọn</label>
            {['A', 'B', 'C', 'D'].map((option) => (
              <div key={option} className="flex items-center gap-2">
                <span className="w-8 font-semibold">{option}:</span>
                <input
                  type="text"
                  value={formData.options[option]}
                  onChange={(e) => setFormData({ ...formData, options: { ...formData.options, [option]: e.target.value } })}
                  className="input flex-1"
                  required
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Đáp án đúng</label>
            <select
              value={formData.correctOption}
              onChange={(e) => setFormData({ ...formData, correctOption: e.target.value })}
              className="input"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {editingQuestion ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, question: null })}
        onConfirm={handleDelete}
        title="Xóa câu hỏi"
        message="Bạn có chắc chắn muốn xóa câu hỏi này?"
        confirmText="Xóa"
      />
    </div>
  );
}
