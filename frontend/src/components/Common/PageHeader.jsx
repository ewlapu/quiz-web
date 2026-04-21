export default function PageHeader({ title, description, icon: Icon, action, breadcrumb }) {
  return (
    <div className="mb-8">
      {breadcrumb && (
        <div className="mb-4">
          {breadcrumb}
        </div>
      )}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="p-4 rounded-2xl bg-primary-600 shadow-glow">
              <Icon className="h-8 w-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">{title}</h1>
            {description && (
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">{description}</p>
            )}
          </div>
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
