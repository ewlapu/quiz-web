export default function Section({ title, description, children, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
