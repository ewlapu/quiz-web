import { useState, useEffect } from 'react';
import { Clock, BookOpen, Play, FileText, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import { subjectService } from '../../services/subjectService';
import { useDispatch, useSelector } from 'react-redux';
import { setExams } from '../../slices/examsSlice';
import { setSubjects } from '../../slices/subjectsSlice';
import toast from 'react-hot-toast';
import Badge from '../../components/Common/Badge';
import FilterBar from '../../components/Common/FilterBar';
import TimelineView from '../../components/Common/TimelineView';
import PageHeader from '../../components/Common/PageHeader';
import Section from '../../components/Common/Section';

export default function Exams() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { exams, pagination } = useSelector((state) => state.exams);
  const { subjects } = useSelector((state) => state.subjects);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    subjectId: '',
    sortBy: '',
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
      dispatch(setSubjects(data.subjects));
    } catch (error) {
      toast.error('Không thể tải danh sách môn học');
    }
  };

  const fetchExams = async () => {
    setLoading(true);
    try {
      const params = { page, limit: viewMode === 'timeline' ? 100 : 12 };
      if (filters.search) params.search = filters.search;
      if (filters.subjectId) params.subjectId = filters.subjectId;
      if (filters.sortBy) {
        const [field, order] = filters.sortBy.split('_');
        params.sortBy = field;
        params.sortOrder = order;
      }
      const data = await examService.getPublicExams(params);
      dispatch(setExams({ exams: data.exams, pagination: data.pagination }));
    } catch (error) {
      toast.error('Không thể tải danh sách đề thi');
    } finally {
      setLoading(false);
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
      sortBy: '',
    });
    setPage(1);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Đề thi có sẵn"
        description="Chọn đề thi để bắt đầu làm bài và kiểm tra kiến thức của bạn"
        icon={FileText}
      />

      <Section>
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          showViewToggle={true}
          viewMode={viewMode}
          onViewModeChange={(mode) => {
            setViewMode(mode);
            setPage(1);
          }}
          subjects={subjects}
        />

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải đề thi...</p>
          </div>
        ) : exams.length === 0 ? (
          <div className="card p-12 text-center border-0 shadow-soft">
            <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Không có đề thi nào</p>
            <p className="text-gray-600 dark:text-gray-400">Hiện tại chưa có đề thi công khai nào</p>
          </div>
        ) : viewMode === 'timeline' ? (
          <div className="card p-6 border-0 shadow-soft">
            <TimelineView
              items={exams}
              type="exams"
              onItemClick={(exam) => navigate(`/user/exams/${exam._id}`)}
              getDate={(item) => item.createdAt}
              getTitle={(item) => item.title}
              getStatus={(item) => item.isPublished}
              getSubject={(item) => item.subjectId?.name}
            />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam, idx) => (
                <div key={exam._id} className="card-hover p-6 group animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all">{exam.title}</h3>
                      <Badge variant="success" className="mt-1">Đã công bố</Badge>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                        <BookOpen className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{exam.subjectId?.name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30">
                        <Clock className="h-4 w-4 text-accent-600 dark:text-accent-400" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{exam.timeLimit} phút</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <span className="text-green-600 dark:text-green-400 font-bold">{exam.questionIds?.length || 0}</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">câu hỏi</span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/user/exams/${exam._id}`)}
                    className="btn btn-primary w-full flex items-center justify-center gap-2 group-hover:shadow-glow"
                  >
                    <Play className="h-5 w-5" />
                    Bắt đầu làm bài
                  </button>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Trước
                </button>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Trang {page} / {pagination.totalPages}
                  </span>
                </div>
                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </Section>
    </div>
  );
}
