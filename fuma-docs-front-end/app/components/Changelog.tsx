import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDocumentsByChunkTime, fetchDocumentStats, clearChangelog } from '@/store/slices/docsSlice';
import { useEffect, useState } from 'react';
import type { DocItem, ChangelogEntry } from '@/store/slices/docsSlice';

interface ChangelogProps {
  onDocumentSelect?: (doc: DocItem) => void;
}

export function Changelog({ onDocumentSelect }: ChangelogProps) {
  const dispatch = useAppDispatch();
  const { changelog, stats, loading, error } = useAppSelector((state) => state.docs);
  const [selectedChunkTime, setSelectedChunkTime] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Load stats on component mount
    dispatch(fetchDocumentStats());
  }, [dispatch]);

  const handleTimelineSelect = (chunkTime: string) => {
    setSelectedChunkTime(chunkTime);
    setIsDropdownOpen(false);
    dispatch(fetchDocumentsByChunkTime(chunkTime));
  };

  const handleRefresh = () => {
    dispatch(clearChangelog());
    dispatch(fetchDocumentStats());
    setSelectedChunkTime('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const selectedChangelogEntry = changelog.find(entry => entry.chunkTime === selectedChunkTime);

  return (
    <div className="bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 w-96">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Documentation Changelog</h2>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Refresh changelog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Documents</div>
              <div className="text-lg font-bold text-blue-800 dark:text-blue-300">
                {typeof stats.totalCount === 'object' ? stats.totalCount.count : stats.totalCount}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">Versions</div>
              <div className="text-lg font-bold text-green-800 dark:text-green-300">{stats.chunkTimes.length}</div>
            </div>
          </div>
        )}

        {/* Timeline Dropdown */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Version Timeline
          </label>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <span className="text-sm text-gray-900 dark:text-gray-100">
              {selectedChunkTime 
                ? formatDate(selectedChunkTime)
                : 'Choose a version...'
              }
            </span>
            <svg 
              className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {stats?.chunkTimes.map((chunkTime) => (
                <button
                  key={chunkTime}
                  onClick={() => handleTimelineSelect(chunkTime)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(chunkTime)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getTimeAgo(chunkTime)}
                      </div>
                    </div>
                    {selectedChunkTime === chunkTime && (
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {loading.stats && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Loading changelog...</p>
          </div>
        )}

        {!selectedChunkTime && !loading.stats && (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Version</h3>
            <p className="text-gray-500 text-sm">
              Choose a timeline from the dropdown above to view documents from that version.
            </p>
          </div>
        )}

        {selectedChunkTime && loading.changelog && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Loading documents...</p>
          </div>
        )}

        {selectedChunkTime && selectedChangelogEntry && !loading.changelog && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Documents from {formatDate(selectedChunkTime)}
              </h3>
              <p className="text-sm text-gray-600">
                {selectedChangelogEntry.documentCount} documents found
              </p>
            </div>

            <div className="space-y-2">
              {selectedChangelogEntry.documents.map((doc) => (
                <button
                  key={doc._id}
                  onClick={() => onDocumentSelect?.(doc)}
                  className="w-full text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {doc.metadata.moduleName || doc.source}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {doc.provider} • {doc.model}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {getTimeAgo(doc.timestamp)}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedChunkTime && !selectedChangelogEntry && !loading.changelog && (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Found</h3>
            <p className="text-gray-500 text-sm">
              No documents were found for the selected timeline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}