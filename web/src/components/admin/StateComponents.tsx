export function EmptyState({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-600">{title}</h3>
      {description && <p className="text-xs text-slate-400 mt-1 max-w-xs text-center">{description}</p>}
    </div>
  );
}

export function LoadingSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3 p-4">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded animate-pulse flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-8 bg-slate-100 rounded animate-pulse flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="h-12 w-12 rounded-xl bg-rose-100 flex items-center justify-center mb-4">
        <span className="text-xl">⚠️</span>
      </div>
      <h3 className="text-sm font-semibold text-slate-600">Something went wrong</h3>
      <p className="text-xs text-slate-400 mt-1">{message || 'Failed to load data. Please try again.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          Retry
        </button>
      )}
    </div>
  );
}
