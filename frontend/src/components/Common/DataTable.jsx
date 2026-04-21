import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({ 
  columns, 
  data, 
  pagination, 
  onPageChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  emptyMessage = "No data found",
  actions,
  hideSearch = false
}) {
  return (
    <div className="space-y-4">
      {(searchValue !== undefined && onSearchChange && !hideSearch) || actions ? (
        <div className="flex justify-between items-center">
          {searchValue !== undefined && onSearchChange && !hideSearch ? (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder || "Tìm kiếm..."}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="input pl-10"
              />
            </div>
          ) : <div></div>}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      ) : null}

      <div className="card overflow-hidden border-0 shadow-soft">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    {emptyMessage || 'Không có dữ liệu'}
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all duration-200 group">
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Trang <span className="font-medium">{pagination.page}</span> /{' '}
            <span className="font-medium">{pagination.totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn btn-secondary disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="btn btn-secondary disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
