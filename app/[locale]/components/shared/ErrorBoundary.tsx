'use client';

import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded">
      <p>⚠️ 出错了：{error.message}</p>
      <button
        className="mt-2 px-4 py-1 text-sm bg-red-600 text-white rounded"
        onClick={resetErrorBoundary}
      >
        重试
      </button>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // 重置逻辑，如重新加载数据，或 setState(null)
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
