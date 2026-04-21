import { useState, useEffect } from 'react';
import { FileText, CheckSquare, TrendingUp, Award, Clock, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import StatCard from '../../components/Common/StatCard';
import Section from '../../components/Common/Section';
import { questionService } from '../../services/questionService';
import { examService } from '../../services/examService';
import { attemptService } from '../../services/attemptService';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    questions: { total: 0 },
    exams: { total: 0, published: 0, unpublished: 0 },
    attempts: { total: 0, averageScore: 0, passed: 0 },
    recentAttempts: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [questionsData, examsData, attemptsData] = await Promise.all([
        questionService.getQuestions({ limit: 1000 }),
        examService.getExams({ limit: 1000 }),
        attemptService.getAttempts({ limit: 100 }),
      ]);

      const questions = questionsData.questions || [];
      const exams = examsData.exams || [];
      const attempts = attemptsData.attempts || [];

      const examStats = {
        total: exams.length,
        published: exams.filter(e => e.isPublished).length,
        unpublished: exams.filter(e => !e.isPublished).length,
      };

      const attemptStats = {
        total: attempts.length,
        averageScore: attempts.length > 0
          ? attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
          : 0,
        passed: attempts.filter(a => a.score >= 50).length,
      };

      setStats({
        questions: { total: questions.length },
        exams: examStats,
        attempts: attemptStats,
        recentAttempts: attempts.slice(0, 5),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Câu hỏi của tôi',
      value: stats.questions.total,
      icon: FileText,
      gradient: 'primary-600',
      description: 'Tổng số câu hỏi đã tạo',
      onClick: () => navigate('/teacher/questions'),
    },
    {
      title: 'Đề thi của tôi',
      value: stats.exams.total,
      icon: BookOpen,
      gradient: 'education-600',
      description: `${stats.exams.published} đã công bố`,
      onClick: () => navigate('/teacher/exams'),
    },
    {
      title: 'Bài làm',
      value: stats.attempts.total,
      icon: CheckSquare,
      gradient: 'accent-600',
      description: `${stats.attempts.passed} bài đạt`,
      onClick: () => navigate('/teacher/attempts'),
    },
    {
      title: 'Điểm trung bình',
      value: stats.attempts.averageScore > 0 ? stats.attempts.averageScore.toFixed(1) + '%' : '0%',
      icon: TrendingUp,
      gradient: 'primary-600',
      description: 'Điểm trung bình học sinh',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="Dashboard" description="Tổng quan hoạt động" icon={TrendingUp} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card p-6 border-0 shadow-soft animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Tổng quan hoạt động và thống kê"
        icon={TrendingUp}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} onClick={stat.onClick} className={stat.onClick ? 'cursor-pointer' : ''}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Trạng thái đề thi" description="Thống kê đề thi của bạn">
          <div className="card p-6 border-0 shadow-soft">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/30">
                    <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Đã công bố</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Đề thi công khai</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.exams.published}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Chưa công bố</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Đề thi nháp</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.exams.unpublished}</p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {stats.recentAttempts.length > 0 && (
          <Section title="Bài làm gần đây" description="5 bài làm mới nhất">
            <div className="card p-6 border-0 shadow-soft">
              <div className="space-y-3">
                {stats.recentAttempts.map((attempt, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate('/teacher/attempts')}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">
                          {attempt.examId?.title || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {attempt.userId?.fullName || 'N/A'} • {new Date(attempt.submittedAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          attempt.score >= 80 ? 'text-green-600' :
                          attempt.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {attempt.score.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
