import { useState, useEffect } from 'react';
import { Eye, CheckSquare } from 'lucide-react';
import DataTable from '../../components/Common/DataTable';
import FilterBar from '../../components/Common/FilterBar';
import TimelineView from '../../components/Common/TimelineView';
import Modal from '../../components/Common/Modal';
import Badge from '../../components/Common/Badge';
import PageHeader from '../../components/Common/PageHeader';
import { attemptService } from '../../services/attemptService';
import { examService } from '../../services/examService';
import { subjectService } from '../../services/subjectService';
import toast from 'react-hot-toast';

export default function Attempts() {
  const [attempts, setAttempts] = useState([]);
  const [allAttempts, setAllAttempts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    subjectId: '',
    examId: '',
    scoreMin: '',
    scoreMax: '',
    sortBy: '',
  });

  useEffect(() => {
    fetchExams();
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchAttempts();
  }, [page, filters]);

  const fetchExams = async () => {
    try {
      const data = await examService.getExams({ limit: 100 });
      setExams(data.exams || []);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getSubjects();
      setSubjects(data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: viewMode === 'timeline' ? 100 : 10 };
      if (filters.search) params.search = filters.search;
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.examId) params.examId = filters.examId;
      if (filters.sortBy) {
        const [field, order] = filters.sortBy.split('_');
        params.sortBy = field;
        params.sortOrder = order;
      }

      const data = await attemptService.getAttempts(params);
      let filteredAttempts = data.attempts || [];

      if (filters.scoreMin || filters.scoreMax) {
        filteredAttempts = filteredAttempts.filter(attempt => {
          const score = attempt.score;
          if (filters.scoreMin && score < parseFloat(filters.scoreMin)) return false;
          if (filters.scoreMax && score > parseFloat(filters.scoreMax)) return false;
          return true;
        });
      }

      setAttempts(filteredAttempts);
      setAllAttempts(filteredAttempts);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Không thể tải danh sách bài làm');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (attempt) => {
    try {
      const data = await attemptService.getAttempt(attempt._id);
      setSelectedAttempt(data.attempt);
      setDetailOpen(true);
    } catch (error) {
      toast.error('Không thể tải chi tiết bài làm');
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
      examId: '',
      scoreMin: '',
      scoreMax: '',
      sortBy: '',
    });
    setPage(1);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const columns = [
    {
      key: 'user',
      label: 'Người làm',
      render: (attempt) => attempt.userId?.fullName || 'N/A',
    },
    {
      key: 'exam',
      label: 'Đề thi',
      render: (attempt) => attempt.examId?.title || 'N/A',
    },
    {
      key: 'score',
      label: 'Điểm số',
      render: (attempt) => (
        <Badge variant={getScoreColor(attempt.score)}>
          {attempt.score.toFixed(2)}%
        </Badge>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Thời gian nộp',
      render: (attempt) => new Date(attempt.submittedAt).toLocaleString('vi-VN'),
    },
    {
      key: 'actions',
      label: 'Thao tác',
      render: (attempt) => (
        <button onClick={() => handleViewDetail(attempt)} className="text-blue-600 hover:text-blue-800">
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý bài làm"
        description="Xem bài làm của học sinh"
        icon={CheckSquare}
      />

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        showViewToggle={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        subjects={subjects}
        exams={exams}
      />

      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={attempts}
          pagination={pagination}
          onPageChange={setPage}
          searchValue={filters.search}
          onSearchChange={(val) => handleFilterChange({ ...filters, search: val })}
          emptyMessage="Không có bài làm nào"
          loading={loading}
          hideSearch={true}
        />
      ) : (
        <div className="card p-6 border-0 shadow-soft">
          <TimelineView
            items={allAttempts}
            type="attempts"
            onItemClick={handleViewDetail}
            getDate={(item) => item.submittedAt}
            getTitle={(item) => item.examId?.title || 'N/A'}
            getScore={(item) => item.score}
            getSubject={(item) => item.examId?.subjectId?.name}
            getUser={(item) => item.userId?.fullName}
          />
        </div>
      )}

      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="Chi tiết bài làm" size="xl">
        {selectedAttempt && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Người làm</p>
                <p className="font-medium">{selectedAttempt.userId?.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Đề thi</p>
                <p className="font-medium">{selectedAttempt.examId?.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Điểm số</p>
                <p className="font-medium text-2xl">{selectedAttempt.score.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian nộp</p>
                <p className="font-medium">{new Date(selectedAttempt.submittedAt).toLocaleString('vi-VN')}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Chi tiết câu trả lời</h4>
              <div className="space-y-3">
                {selectedAttempt.answers?.map((answer, idx) => {
                  const question = answer.questionId;
                  const isCorrect = question?.correctOption === answer.selectedOption;
                  return (
                    <div key={idx} className={`border rounded-lg p-3 ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <p className="font-medium mb-2">{question?.content || 'Câu hỏi'}</p>
                      <div className="space-y-1">
                        <p className="text-sm">Đáp án đã chọn: <span className="font-semibold">{answer.selectedOption}</span></p>
                        <p className="text-sm">Đáp án đúng: <span className="font-semibold text-green-600">{question?.correctOption}</span></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
