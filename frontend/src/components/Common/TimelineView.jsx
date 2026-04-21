import { Calendar, Clock, BookOpen, TrendingUp, Award, XCircle, CheckCircle } from 'lucide-react';
import Badge from './Badge';

export default function TimelineView({ 
  items, 
  type = 'attempts',
  onItemClick,
  getDate = (item) => item.submittedAt || item.createdAt,
  getTitle = (item) => item.examId?.title || item.title,
  getScore = (item) => item.score,
  getStatus = (item) => item.isPublished,
  getSubject = (item) => item.subjectId?.name || item.examId?.subjectId?.name,
  getUser = (item) => item.userId?.fullName,
}) {
  const groupByDate = (items) => {
    const groups = {};
    items.forEach((item) => {
      const date = new Date(getDate(item));
      const dateKey = date.toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const dateSortKey = date.toISOString().split('T')[0];
      
      if (!groups[dateSortKey]) {
        groups[dateSortKey] = {
          dateKey,
          dateSortKey,
          items: [],
        };
      }
      groups[dateSortKey].items.push(item);
    });
    
    return Object.values(groups).sort((a, b) => 
      new Date(b.dateSortKey) - new Date(a.dateSortKey)
    );
  };

  const groupedItems = groupByDate(items);

  const getScoreColor = (score) => {
    if (!score && score !== 0) return 'default';
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Không có dữ liệu
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          Chưa có {type === 'attempts' ? 'bài làm' : type === 'exams' ? 'đề thi' : 'câu hỏi'} nào
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
      
      <div className="space-y-8">
        {groupedItems.map((group, groupIdx) => (
          <div key={group.dateSortKey} className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 border-4 border-white dark:border-gray-800 relative z-10">
                <Calendar className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {group.dateKey}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {group.items.length} {type === 'attempts' ? 'bài làm' : type === 'exams' ? 'đề thi' : 'câu hỏi'}
                </p>
              </div>
            </div>

            <div className="ml-24 space-y-4">
              {group.items.map((item, itemIdx) => (
                <div
                  key={item._id || itemIdx}
                  onClick={() => onItemClick && onItemClick(item)}
                  className="card p-5 border-0 shadow-soft hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {getTitle(item)}
                        </h4>
                        {type === 'exams' && (
                          <Badge variant={getStatus(item) ? 'success' : 'warning'}>
                            {getStatus(item) ? 'Đã công bố' : 'Chưa công bố'}
                          </Badge>
                        )}
                        {type === 'attempts' && getScore(item) !== undefined && (
                          <Badge variant={getScoreColor(getScore(item))}>
                            {getScore(item).toFixed(1)}%
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {getSubject(item) && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{getSubject(item)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(getDate(item))}</span>
                        </div>

                        {getUser(item) && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getUser(item)}</span>
                          </div>
                        )}

                        {type === 'exams' && (
                          <>
                            <div className="flex items-center gap-2">
                              <span>{item.questionIds?.length || 0} câu hỏi</span>
                            </div>
                            {item.timeLimit && (
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{item.timeLimit} phút</span>
                              </div>
                            )}
                          </>
                        )}

                        {type === 'questions' && (
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              Đáp án: {item.correctOption}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 rounded-full bg-primary-500 group-hover:bg-primary-600 transition-colors"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
