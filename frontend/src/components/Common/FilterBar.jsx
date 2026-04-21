import { useState } from 'react';
import { Filter, X, Calendar, TrendingUp, BookOpen, CheckCircle, XCircle } from 'lucide-react';

export default function FilterBar({ 
  filters, 
  onFilterChange, 
  onReset,
  showViewToggle = false,
  viewMode = 'table',
  onViewModeChange,
  subjects = [],
  exams = [],
  users = [],
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '').length;

  return (
    <div className="card p-4 border-0 shadow-soft mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input pl-10"
            />
          </div>

          {subjects.length > 0 && (
            <div className="relative min-w-[180px]">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filters.subjectId || ''}
                onChange={(e) => handleFilterChange('subjectId', e.target.value)}
                className="input pl-10 pr-4 appearance-none"
              >
                <option value="">Tất cả môn học</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {exams.length > 0 && (
            <div className="relative min-w-[180px]">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filters.examId || ''}
                onChange={(e) => handleFilterChange('examId', e.target.value)}
                className="input pl-10 pr-4 appearance-none"
              >
                <option value="">Tất cả đề thi</option>
                {exams.map((exam) => (
                  <option key={exam._id} value={exam._id}>
                    {exam.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {users.length > 0 && (
            <div className="relative min-w-[180px]">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={filters.userId || ''}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
                className="input pl-10 pr-4 appearance-none"
              >
                <option value="">Tất cả người dùng</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filters.hasOwnProperty('isPublished') && (
            <div className="relative min-w-[150px]">
              <select
                value={filters.isPublished || ''}
                onChange={(e) => handleFilterChange('isPublished', e.target.value)}
                className="input"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đã công bố</option>
                <option value="false">Chưa công bố</option>
              </select>
            </div>
          )}

          {filters.hasOwnProperty('scoreMin') && (
            <div className="relative min-w-[120px]">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                placeholder="Điểm tối thiểu"
                value={filters.scoreMin || ''}
                onChange={(e) => handleFilterChange('scoreMin', e.target.value)}
                className="input pl-10"
                min="0"
                max="100"
              />
            </div>
          )}

          {filters.hasOwnProperty('scoreMax') && (
            <div className="relative min-w-[120px]">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                placeholder="Điểm tối đa"
                value={filters.scoreMax || ''}
                onChange={(e) => handleFilterChange('scoreMax', e.target.value)}
                className="input pl-10"
                min="0"
                max="100"
              />
            </div>
          )}

          {filters.hasOwnProperty('correctOption') && (
            <div className="relative min-w-[150px]">
              <select
                value={filters.correctOption || ''}
                onChange={(e) => handleFilterChange('correctOption', e.target.value)}
                className="input"
              >
                <option value="">Tất cả đáp án</option>
                <option value="A">Đáp án A</option>
                <option value="B">Đáp án B</option>
                <option value="C">Đáp án C</option>
                <option value="D">Đáp án D</option>
              </select>
            </div>
          )}

          <div className="relative min-w-[150px]">
            <select
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input"
            >
              <option value="">Sắp xếp</option>
              <option value="date_desc">Mới nhất</option>
              <option value="date_asc">Cũ nhất</option>
              <option value="score_desc">Điểm cao nhất</option>
              <option value="score_asc">Điểm thấp nhất</option>
              <option value="title_asc">Tên A-Z</option>
              <option value="title_desc">Tên Z-A</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          {showViewToggle && (
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => onViewModeChange('table')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Bảng
              </button>
              <button
                onClick={() => onViewModeChange('timeline')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Timeline
              </button>
            </div>
          )}

          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="btn btn-secondary flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Xóa bộ lọc ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
