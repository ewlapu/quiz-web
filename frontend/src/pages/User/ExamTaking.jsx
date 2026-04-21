import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, Send, AlertCircle, CheckCircle2, BookOpen, ArrowLeft } from 'lucide-react';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import Badge from '../../components/Common/Badge';
import { examService } from '../../services/examService';
import { attemptService } from '../../services/attemptService';
import toast from 'react-hot-toast';

export default function ExamTaking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitDialog, setSubmitDialog] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [id]);

  useEffect(() => {
    if (exam && exam.timeLimit && timeLeft === null) {
      setTimeLeft(exam.timeLimit * 60);
    }
  }, [exam]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchExam = async () => {
    try {
      const data = await examService.getPublicExam(id);
      setExam(data.exam);
    } catch (error) {
      toast.error('Không thể tải đề thi');
      navigate('/user/exams');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleAutoSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    await handleSubmitExam(true);
  };

  const handleSubmitExam = async (isAutoSubmit = false) => {
    if (!exam) return;

    const questions = exam.questionIds || [];
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = questions.length - answeredCount;

    if (!isAutoSubmit && unansweredCount > 0) {
      toast.error(`Bạn còn ${unansweredCount} câu hỏi chưa trả lời. Vui lòng trả lời tất cả câu hỏi trước khi nộp bài.`);
      setSubmitDialog(false);
      return;
    }

    const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    try {
      const data = await attemptService.submitAttempt({
        examId: exam._id,
        answers: formattedAnswers,
      });
      
      if (isAutoSubmit) {
        toast.success('Hết thời gian! Bài thi đã được tự động nộp.');
      } else {
        toast.success('Nộp bài thành công!');
      }
      
      navigate(`/user/result/${data.attempt._id}`);
    } catch (error) {
      toast.error('Không thể nộp bài');
      setSubmitting(false);
    }
  };

  const handleReviewClick = () => {
    const questions = exam.questionIds || [];
    const answeredCount = Object.keys(answers).length;
    const unansweredCount = questions.length - answeredCount;
    
    if (unansweredCount > 0) {
      setReviewDialog(true);
    } else {
      setSubmitDialog(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!exam) return 0;
    const questions = exam.questionIds || [];
    return (Object.keys(answers).length / questions.length) * 100;
  };

  const getUnansweredQuestions = () => {
    if (!exam) return [];
    const questions = exam.questionIds || [];
    return questions.filter(q => !answers[q._id]).map((q, idx) => idx + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">Đang tải đề thi...</p>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const questions = exam.questionIds || [];
  const question = questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = questions.length - answeredCount;
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl sticky top-0 z-50 shadow-soft">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn thoát? Tiến trình làm bài sẽ không được lưu.')) {
                    navigate('/user/exams');
                  }
                }}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{exam.title}</h1>
                <div className="flex items-center gap-3 text-sm">
                  <Badge variant="info">{exam.subjectId?.name || 'N/A'}</Badge>
                  <span className="text-gray-600 dark:text-gray-400">
                    {questions.length} câu hỏi
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Đã trả lời: {answeredCount}/{questions.length}
                </span>
              </div>

              {timeLeft !== null && (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                  timeLeft < 300 
                    ? 'bg-red-600 text-white shadow-glow animate-pulse' 
                    : timeLeft < 600
                    ? 'bg-yellow-600 text-white shadow-glow'
                    : 'bg-primary-600 text-white shadow-glow'
                }`}>
                  <Clock className="h-5 w-5" />
                  <span className="text-lg tabular-nums">{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tiến độ: {answeredCount}/{questions.length} câu hỏi
              </span>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-32 border-0 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Điều hướng</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Câu {currentQuestion + 1}/{questions.length}
                </span>
              </div>
              
              {unansweredCount > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-xs font-semibold">
                      Còn {unansweredCount} câu chưa trả lời
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-5 gap-2 max-h-96 overflow-y-auto">
                {questions.map((q, idx) => {
                  const isCurrent = idx === currentQuestion;
                  const isAnswered = answers[q._id];
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      className={`relative p-3 rounded-xl text-sm font-bold transition-all duration-200 transform hover:scale-110 ${
                        isCurrent
                          ? 'bg-primary-600 text-white shadow-glow scale-110 ring-4 ring-primary-200 dark:ring-primary-800 z-10'
                          : isAnswered
                          ? 'bg-green-500 text-white shadow-md hover:shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title={isAnswered ? `Câu ${idx + 1}: Đã trả lời` : `Câu ${idx + 1}: Chưa trả lời`}
                    >
                      {idx + 1}
                      {isCurrent && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-primary-600"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary-600"></div>
                    <span className="text-gray-600 dark:text-gray-400">Câu hiện tại</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-green-500"></div>
                    <span className="text-gray-600 dark:text-gray-400">Đã trả lời</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-600"></div>
                    <span className="text-gray-600 dark:text-gray-400">Chưa trả lời</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="card p-8 border-0 shadow-soft animate-fade-in">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                      <BookOpen className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-bold">
                      Câu hỏi {currentQuestion + 1} / {questions.length}
                    </span>
                  </div>
                  {answers[question._id] && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Đã trả lời
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                  {question.content}
                </h2>
              </div>

              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const isSelected = answers[question._id] === option;
                  return (
                    <label
                      key={option}
                      className={`flex items-start p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.01] ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-lg ring-4 ring-primary-100 dark:ring-primary-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 mt-0.5 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'border-primary-500 bg-primary-500 shadow-md' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-white animate-scale-in"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-2">
                          <span className={`font-bold text-lg ${
                            isSelected 
                              ? 'text-primary-600 dark:text-primary-400' 
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {option}.
                          </span>
                          <span className="text-gray-900 dark:text-white text-lg leading-relaxed">
                            {question.options[option]}
                          </span>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name={`question-${question._id}`}
                        value={option}
                        checked={isSelected}
                        onChange={() => handleAnswerChange(question._id, option)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 gap-4">
              <button
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="btn btn-secondary flex items-center gap-2 px-6 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
                Câu trước
              </button>

              <div className="flex items-center gap-2">
                {currentQuestion < questions.length - 1 ? (
                  <>
                    <button
                      onClick={() => {
                        if (!answers[question._id]) {
                          toast.error('Vui lòng chọn đáp án trước khi chuyển câu');
                          return;
                        }
                        setCurrentQuestion((prev) => prev + 1);
                      }}
                      className="btn btn-primary flex items-center gap-2 px-6"
                    >
                      Câu sau
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleReviewClick}
                      className="btn btn-secondary flex items-center gap-2 px-6"
                    >
                      Xem lại
                    </button>
                    <button
                      onClick={() => {
                        if (unansweredCount > 0) {
                          toast.error(`Bạn còn ${unansweredCount} câu hỏi chưa trả lời. Vui lòng trả lời tất cả câu hỏi trước khi nộp bài.`);
                          return;
                        }
                        setSubmitDialog(true);
                      }}
                      className="btn btn-primary flex items-center gap-2 px-8 shadow-glow"
                    >
                      <Send className="h-5 w-5" />
                      Nộp bài
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={submitDialog}
        onClose={() => setSubmitDialog(false)}
        onConfirm={() => handleSubmitExam(false)}
        title="Xác nhận nộp bài"
        message={
          <div className="space-y-2">
            <p className="font-semibold">Bạn đã trả lời {answeredCount} / {questions.length} câu hỏi.</p>
            {unansweredCount > 0 && (
              <p className="text-red-600 dark:text-red-400 font-semibold">
                ⚠️ Còn {unansweredCount} câu hỏi chưa trả lời: {getUnansweredQuestions().join(', ')}
              </p>
            )}
            <p>Bạn có chắc chắn muốn nộp bài?</p>
          </div>
        }
        confirmText="Nộp bài"
        type="primary"
      />

      <ConfirmDialog
        isOpen={reviewDialog}
        onClose={() => setReviewDialog(false)}
        onConfirm={() => {
          setReviewDialog(false);
          setSubmitDialog(true);
        }}
        title="Còn câu hỏi chưa trả lời"
        message={
          <div className="space-y-2">
            <p className="font-semibold text-red-600 dark:text-red-400">
              Bạn còn {unansweredCount} câu hỏi chưa trả lời:
            </p>
            <p className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
              Câu số: {getUnansweredQuestions().join(', ')}
            </p>
            <p>Vui lòng trả lời tất cả câu hỏi trước khi nộp bài.</p>
          </div>
        }
        confirmText="Đã hiểu"
        type="warning"
      />
    </div>
  );
}
