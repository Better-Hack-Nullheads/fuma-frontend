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
  const [selectedChunkTime, setSelectedChunkTime] = useState<string | null>(null);

  useEffect(() => {
    // Load stats on component mount
    dispatch(fetchDocumentStats());
  }, [dispatch]);

  const handleChunkTimeClick = (chunkTime: string) => {
    setSelectedChunkTime(chunkTime);
    dispatch(fetchDocumentsByChunkTime(chunkTime));
  };

  const handleRefresh = () => {
    dispatch(clearChangelog());
    dispatch(fetchDocumentStats());
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

  return (
    <div className="bg-gray-50 border-r border-gray-200 w-80">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Changelog</h2>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
            title="Refresh changelog"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        {stats && (
          <div className="mt-3 text-sm text-gray-600">
            <p>Total Documents: <span className="font-semibold">{typeof stats.totalCount === 'object' ? stats.totalCount.count : stats.totalCount}</span></p>
            <p>Available Versions: <span className="font-semibold">{stats.chunkTimes.length}</span></p>
          </div>
        )}
      </div>

      <div className="overflow-y-auto h-[calc(100vh-140px)]">
        {error && (
          <div className="p-4 text-center text-red-600">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading.stats && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading stats...</p>
          </div>
        )}

        {stats && stats.chunkTimes.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            <p className="text-sm">No versions available</p>
          </div>
        )}

        {stats && stats.chunkTimes.length > 0 && (
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-700 mb-3 px-2">Available Versions</h3>
            {stats.chunkTimes.map((chunkTime) => {
              const changelogEntry = changelog.find(entry => entry.chunkTime === chunkTime);
              const isSelected = selectedChunkTime === chunkTime;
              
              return (
                <div key={chunkTime} className="mb-2">
                  <button
                    onClick={() => handleChunkTimeClick(chunkTime)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {formatDate(chunkTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getTimeAgo(chunkTime)}
                        </div>
                        {changelogEntry && (
                          <div className="text-xs text-gray-500 mt-1">
                            {changelogEntry.documentCount} documents
                          </div>
                        )}
                      </div>
                      {loading.changelog && isSelected && (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      )}
                    </div>
                  </button>

                  {/* Show documents for selected chunk time */}
                  {isSelected && changelogEntry && (
                    <div className="ml-4 mt-2 space-y-1">
                      {changelogEntry.documents.map((doc) => (
                        <button
                          key={doc._id}
                          onClick={() => onDocumentSelect?.(doc)}
                          className="block w-full text-left p-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded"
                        >
                          <div className="truncate font-medium">{doc.metadata.moduleName || doc.source}</div>
                          <div className="truncate text-gray-500">{doc.provider} • {doc.model}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
