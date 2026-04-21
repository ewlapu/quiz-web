import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle, FileText } from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import FilterBar from '../../components/Common/FilterBar';
import TimelineView from '../../components/Common/TimelineView';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import Badge from '../../components/Common/Badge';
import PageHeader from '../../components/Common/PageHeader';
import { examService } from '../../services/examService';
import { subjectService } from '../../services/subjectService';
import { questionService } from '../../services/questionService';
import { useDispatch, useSelector } from 'react-redux';
import { setExams, addExam, updateExam, removeExam } from '../../slices/examsSlice';
import toast from 'react-hot-toast';

export default function Exams() {
  const dispatch = useDispatch();
  const { exams, pagination } = useSelector((state) => state.exams);
  const { subjects } = useSelector((state) => state.subjects);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewExam, setPreviewExam] = useState(null);
  const [editingExam, setEditingExam] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, exam: null });
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    subjectId: '',
    isPublished: '',
    sortBy: '',
  });
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    questionIds: [],
    timeLimit: 30,
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchExams();
  }, [page, filters]);

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getSubjects();
      dispatch({ type: 'subjects/setSubjects', payload: data.subjects });
    } catch (error) {
      toast.error('Không thể tải danh sách môn học');
    }
  };

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = { page, limit: viewMode === 'timeline' ? 100 : 10 };
      if (filters.search) params.search = filters.search;
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.isPublished !== '') params.isPublished = filters.isPublished === 'true';
      if (filters.sortBy) {
        const [field, order] = filters.sortBy.split('_');
        params.sortBy = field;
        params.sortOrder = order;
      }
      const data = await examService.getExams(params);
      dispatch(setExams({ exams: data.exams, pagination: data.pagination }));
    } catch (error) {
      toast.error('Không thể tải danh sách đề thi');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (subjectId) => {
    try {
      const data = await questionService.getQuestions({ subjectId, limit: 100 });
      setAvailableQuestions(data.questions);
    } catch (error) {
      toast.error('Không thể tải câu hỏi');
    }
  };

  const handleSubjectChange = (subjectId) => {
    setFormData({ ...formData, subjectId, questionIds: [] });
    if (subjectId) fetchQuestions(subjectId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        const data = await examService.updateExam(editingExam._id, formData);
        dispatch(updateExam(data.exam));
        toast.success('Cập nhật đề thi thành công');
      } else {
        const data = await examService.createExam(formData);
        dispatch(addExam(data.exam));
        toast.success('Tạo đề thi thành công');
      }
      setModalOpen(false);
      setEditingExam(null);
      setFormData({ title: '', subjectId: '', questionIds: [], timeLimit: 30 });
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      title: exam.title,
      subjectId: exam.subjectId._id || exam.subjectId,
      questionIds: exam.questionIds.map(q => q._id || q),
      timeLimit: exam.timeLimit,
    });
    if (exam.subjectId._id || exam.subjectId) {
      fetchQuestions(exam.subjectId._id || exam.subjectId);
    }
    setModalOpen(true);
  };

  const handlePublish = async (exam) => {
    try {
      await examService.publishExam(exam._id);
      toast.success('Đã công bố đề thi');
      fetchExams();
    } catch (error) {
      toast.error('Không thể công bố đề thi');
    }
  };

  const handleUnpublish = async (exam) => {
    try {
      await examService.unpublishExam(exam._id);
      toast.success('Đã hủy công bố đề thi');
      fetchExams();
    } catch (error) {
      toast.error('Không thể hủy công bố đề thi');
    }
  };

  const handleDelete = async () => {
    try {
      await examService.deleteExam(deleteDialog.exam._id);
      dispatch(removeExam(deleteDialog.exam._id));
      toast.success('Đã xóa đề thi');
      fetchExams();
    } catch (error) {
      toast.error('Không thể xóa đề thi');
    }
  };

  const handlePreview = async (exam) => {
    try {
      const data = await examService.getPublicExam(exam._id);
      setPreviewExam(data.exam);
      setPreviewOpen(true);
    } catch (error) {
      toast.error('Không thể xem trước đề thi');
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
      isPublished: '',
      sortBy: '',
    });
    setPage(1);
  };

  const columns = [
    { key: 'title', label: 'Tiêu đề' },
    {
      key: 'subject',
      label: 'Môn học',
      render: (exam) => exam.subjectId?.name || 'N/A',
    },
    {
      key: 'questions',
      label: 'Số câu hỏi',
      render: (exam) => exam.questionIds?.length || 0,
    },
    {
      key: 'timeLimit',
      label: 'Thời gian (phút)',
      render: (exam) => exam.timeLimit,
    },
    {
      key: 'status',
      label: 'Trạng thái',
      render: (exam) => (
        <Badge variant={exam.isPublished ? 'success' : 'warning'}>
          {exam.isPublished ? 'Đã công bố' : 'Chưa công bố'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (exam) => (
        <div className="flex gap-2">
          <button onClick={() => handlePreview(exam)} className="text-green-600 hover:text-green-800">
            <Eye className="h-4 w-4" />
          </button>
          <button onClick={() => handleEdit(exam)} className="text-blue-600 hover:text-blue-800">
            <Edit className="h-4 w-4" />
          </button>
          {exam.isPublished ? (
            <button onClick={() => handleUnpublish(exam)} className="text-yellow-600 hover:text-yellow-800">
              <XCircle className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={() => handlePublish(exam)} className="text-green-600 hover:text-green-800">
              <CheckCircle className="h-4 w-4" />
            </button>
          )}
          <button onClick={() => setDeleteDialog({ open: true, exam })} className="text-red-600 hover:text-red-800">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý đề thi"
        description="Quản lý tất cả đề thi trong hệ thống"
        icon={FileText}
        action={
          <button onClick={() => { setEditingExam(null); setFormData({ title: '', subjectId: '', questionIds: [], timeLimit: 30 }); setModalOpen(true); }} className="btn btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Thêm đề thi
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
          data={exams}
          pagination={pagination}
          onPageChange={setPage}
          searchValue={filters.search}
          onSearchChange={(val) => handleFilterChange({ ...filters, search: val })}
          emptyMessage="Không có đề thi nào"
          loading={loading}
          hideSearch={true}
        />
      ) : (
        <div className="card p-6 border-0 shadow-soft">
          <TimelineView
            items={exams}
            type="exams"
            onItemClick={handlePreview}
            getDate={(item) => item.createdAt}
            getTitle={(item) => item.title}
            getStatus={(item) => item.isPublished}
            getSubject={(item) => item.subjectId?.name}
          />
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingExam ? 'Chỉnh sửa đề thi' : 'Thêm đề thi'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tiêu đề</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Môn học</label>
            <select
              value={formData.subjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
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
          {formData.subjectId && (
            <div>
              <label className="block text-sm font-medium mb-2">Chọn câu hỏi</label>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-2">
                {availableQuestions.length === 0 ? (
                  <p className="text-sm text-gray-500">Không có câu hỏi nào</p>
                ) : (
                  availableQuestions.map((question) => (
                    <label key={question._id} className="flex items-start gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.questionIds.includes(question._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, questionIds: [...formData.questionIds, question._id] });
                          } else {
                            setFormData({ ...formData, questionIds: formData.questionIds.filter(id => id !== question._id) });
                          }
                        }}
                        className="mt-1"
                      />
                      <span className="text-sm flex-1">{question.content}</span>
                    </label>
                  ))
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Đã chọn: {formData.questionIds.length} câu hỏi</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-2">Thời gian (phút)</label>
            <input
              type="number"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
              className="input"
              min="1"
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-secondary">
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {editingExam ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Xem trước đề thi" size="xl">
        {previewExam && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{previewExam.title}</h3>
              <p className="text-sm text-gray-500">Môn: {previewExam.subjectId?.name}</p>
              <p className="text-sm text-gray-500">Thời gian: {previewExam.timeLimit} phút</p>
            </div>
            <div className="space-y-4">
              {previewExam.questionIds?.map((question, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <p className="font-medium mb-2">{idx + 1}. {question.content}</p>
                  <div className="space-y-1 ml-4">
                    {['A', 'B', 'C', 'D'].map((opt) => (
                      <p key={opt} className="text-sm">{opt}. {question.options[opt]}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, exam: null })}
        onConfirm={handleDelete}
        title="Xóa đề thi"
        message={`Bạn có chắc chắn muốn xóa đề thi "${deleteDialog.exam?.title}"?`}
        confirmText="Xóa"
      />
    </div>
  );
}
