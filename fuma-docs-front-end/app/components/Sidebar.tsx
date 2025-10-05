import { Link } from 'react-router';
import type { DocItem } from '@/store/slices/docsSlice';
import { useState } from 'react';

interface SidebarProps {
  docs: DocItem[];
  currentId?: string;
  onRefresh?: () => void;
  showChangelogTab?: boolean;
}

export function Sidebar({ docs, currentId, onRefresh, showChangelogTab = true }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Documents</h2>
          )}
          <div className="flex items-center gap-2">
            {onRefresh && !isCollapsed && (
              <button
                onClick={onRefresh}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                title="Refresh documents"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-80px)]">
        {showChangelogTab && (
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <Link
              to="/docs/changelog"
              className={`block p-3 rounded-lg mb-1 transition-colors ${
                currentId === 'changelog'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!isCollapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">Changelog</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Version History</div>
                  </div>
                )}
              </div>
            </Link>
          </div>
        )}

        {docs.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <p className="text-sm">No documents available</p>
          </div>
        ) : (
          <nav className="p-2">
            {docs.map((doc) => (
              <Link
                key={doc._id}
                to={`/docs/${doc._id}`}
                className={`block p-3 rounded-lg mb-1 transition-colors ${
                  currentId === doc._id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                title={isCollapsed ? doc.metadata.moduleName || doc.source : undefined}
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {!isCollapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{doc.metadata.moduleName || doc.source}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{doc.provider} • {doc.model}</div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}
