import { useState, useEffect } from 'react';
import { Eye, CheckSquare, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/Common/DataTable';
import FilterBar from '../../components/Common/FilterBar';
import TimelineView from '../../components/Common/TimelineView';
import Badge from '../../components/Common/Badge';
import PageHeader from '../../components/Common/PageHeader';
import Section from '../../components/Common/Section';
import StatCard from '../../components/Common/StatCard';
import Skeleton from '../../components/Common/Skeleton';
import EmptyState from '../../components/Common/EmptyState';
import { attemptService } from '../../services/attemptService';
import { examService } from '../../services/examService';
import { subjectService } from '../../services/subjectService';
import toast from 'react-hot-toast';

export default function Attempts() {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [allAttempts, setAllAttempts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table');
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
      const data = await examService.getPublicExams({ limit: 100 });
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

      const data = await attemptService.getMyAttempts(params);
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
      console.error('Error fetching attempts:', error);
      const errorMessage = error.response?.data?.message || 'Không thể tải lịch sử bài làm';
      toast.error(errorMessage);
      setAttempts([]);
      setPagination(null);
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
        <button
          onClick={() => navigate(`/user/result/${attempt._id}`)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Eye className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const stats = [
    {
      title: 'Tổng bài làm',
      value: pagination?.total || attempts.length || 0,
      icon: CheckSquare,
      gradient: 'education-600',
      description: 'Tất cả bài thi đã làm',
    },
    {
      title: 'Điểm trung bình',
      value: attempts.length > 0 
        ? (attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length).toFixed(1) + '%'
        : '0%',
      icon: TrendingUp,
      gradient: 'primary-600',
      description: 'Điểm số trung bình',
    },
    {
      title: 'Bài đạt',
      value: attempts.filter(a => a.score >= 50).length,
      icon: CheckSquare,
      gradient: 'accent-600',
      description: 'Điểm >= 50%',
    },
  ];

  if (loading && attempts.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Lịch sử bài làm"
          description="Xem lại các bài thi đã làm và kết quả"
          icon={CheckSquare}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Lịch sử bài làm"
        description="Xem lại các bài thi đã làm và kết quả chi tiết"
        icon={CheckSquare}
      />

      {attempts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>
      )}

      <Section title="Danh sách bài làm" description="Xem chi tiết từng bài thi đã làm">
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

        {attempts.length === 0 ? (
          <EmptyState
            icon={CheckSquare}
            title="Chưa có bài làm nào"
            description="Bạn chưa làm bài thi nào. Hãy chọn một đề thi để bắt đầu!"
            action={
              <button
                onClick={() => navigate('/user/exams')}
                className="btn btn-primary"
              >
                Xem đề thi
              </button>
            }
          />
        ) : viewMode === 'table' ? (
          <div className="card p-6 border-0 shadow-soft">
            <DataTable
              columns={columns}
              data={attempts}
              pagination={pagination}
              onPageChange={setPage}
              searchValue={filters.search}
              onSearchChange={(val) => handleFilterChange({ ...filters, search: val })}
              emptyMessage="Chưa có bài làm nào"
              loading={loading}
              hideSearch={true}
            />
          </div>
        ) : (
          <div className="card p-6 border-0 shadow-soft">
            <TimelineView
              items={allAttempts}
              type="attempts"
              onItemClick={(item) => navigate(`/user/result/${item._id}`)}
              getDate={(item) => item.submittedAt}
              getTitle={(item) => item.examId?.title || 'N/A'}
              getScore={(item) => item.score}
              getSubject={(item) => item.examId?.subjectId?.name}
            />
          </div>
        )}
      </Section>
    </div>
  );
}
