import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { attemptService } from '../../services/attemptService';
import toast from 'react-hot-toast';
import Badge from '../../components/Common/Badge';

export default function Result() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      const data = await attemptService.getAttempt(attemptId);
      if (data && data.attempt) {
        setAttempt(data.attempt);
      } else {
        toast.error('Không tìm thấy kết quả');
        navigate('/user/attempts');
      }
    } catch (error) {
      console.error('Error fetching result:', error);
      const errorMessage = error.response?.data?.message || 'Không thể tải kết quả';
      toast.error(errorMessage);
      navigate('/user/attempts');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-primary-600 shadow-glow">
            <CheckCircle className="h-8 w-8 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Đang tải kết quả...</h1>
            <p className="text-gray-600 dark:text-gray-400">Vui lòng đợi trong giây lát</p>
          </div>
        </div>
        <div className="card p-12 border-0 shadow-soft">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="space-y-8">
        <div className="card p-12 text-center border-0 shadow-soft">
          <XCircle className="h-16 w-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy kết quả</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Bài làm này không tồn tại hoặc bạn không có quyền xem</p>
          <button
            onClick={() => navigate('/user/attempts')}
            className="btn btn-primary"
          >
            Quay lại danh sách bài làm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => navigate('/user/attempts')} className="mb-4 btn btn-secondary flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </button>

      <div className="card p-8 border-0 shadow-soft">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-600 shadow-glow mb-6">
            <span className="text-4xl font-bold text-white">{attempt.score >= 50 ? '✓' : '✗'}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 gradient-text">Kết quả bài thi</h1>
          <div className="inline-block">
            <div className={`text-6xl font-bold ${getScoreColor(attempt.score) === 'success' ? 'text-green-600' : getScoreColor(attempt.score) === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
              {attempt.score.toFixed(1)}%
            </div>
            <Badge variant={getScoreColor(attempt.score)} className="mt-2 text-lg px-4 py-2">
              {attempt.score >= 80 ? 'Xuất sắc' : attempt.score >= 50 ? 'Đạt' : 'Chưa đạt'}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200/50 dark:border-primary-700/50">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Đề thi</p>
            <p className="font-bold text-lg text-gray-900 dark:text-white">{attempt.examId?.title || 'N/A'}</p>
          </div>
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Thời gian nộp</p>
            <p className="font-bold text-lg text-gray-900 dark:text-white">{new Date(attempt.submittedAt).toLocaleString('vi-VN')}</p>
          </div>
        </div>

        <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-6">
          <h2 className="text-2xl font-bold mb-6 gradient-text">Chi tiết câu trả lời</h2>
          <div className="space-y-4">
            {attempt.answers?.map((answer, idx) => {
              const question = answer.questionId;
              const isCorrect = question?.correctOption === answer.selectedOption;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 border-2 transition-all duration-200 ${
                    isCorrect 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {isCorrect ? (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <p className="font-semibold text-gray-900 dark:text-white flex-1">Câu {idx + 1}: {question?.content}</p>
                  </div>
                  <div className="ml-11 space-y-2">
                    {['A', 'B', 'C', 'D'].map((opt) => {
                      const isSelected = answer.selectedOption === opt;
                      const isCorrectOpt = question?.correctOption === opt;
                      return (
                        <div key={opt} className="flex items-center gap-2">
                          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                            isCorrectOpt
                              ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                              : isSelected
                              ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            {opt}
                          </span>
                          <span className={`text-sm flex-1 ${
                            isCorrectOpt
                              ? 'font-semibold text-green-700 dark:text-green-300'
                              : isSelected
                              ? 'font-semibold text-red-700 dark:text-red-300'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {question?.options[opt]}
                            {isCorrectOpt && ' ✓'}
                            {isSelected && !isCorrectOpt && ' (Đã chọn)'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
