export default function StatCard({ title, value, icon: Icon, trend, gradient, description }) {
  const getColorClass = (gradient) => {
    if (gradient === 'primary-600' || gradient.includes('primary')) return 'bg-primary-600';
    if (gradient === 'education-600' || gradient.includes('education')) return 'bg-education-600';
    if (gradient === 'accent-600' || gradient.includes('accent')) return 'bg-accent-600';
    if (gradient === 'gray-600' || gradient.includes('gray')) return 'bg-gray-600';
    if (gradient.includes('green')) return 'bg-green-600';
    if (gradient.includes('blue')) return 'bg-blue-600';
    if (gradient.includes('purple')) return 'bg-purple-600';
    return 'bg-gray-600';
  };

  const colorClass = getColorClass(gradient);
  const hoverColorClass = colorClass.replace('600', '700');

  return (
    <div className="card-hover p-6 relative overflow-hidden group">
      <div className={`absolute inset-0 ${colorClass} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClass} shadow-lg`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend && (
            <span className={`text-sm font-semibold px-2 py-1 rounded-lg ${
              trend > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
