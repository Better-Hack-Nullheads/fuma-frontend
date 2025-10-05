import { Link } from 'react-router';
import { CustomLayout } from '../../components/CustomLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDocsList, clearError } from '@/store/slices/docsSlice';
import { useEffect } from 'react';
import type { Route } from './+types/index';

export default function DocsIndex() {
  const dispatch = useAppDispatch();
  const { docs, loading, error } = useAppSelector((state) => state.docs);

  console.log('DocsIndex component rendered, state:', { docs, loading, error });

  useEffect(() => {
    console.log('Dispatching fetchDocsList...');
    dispatch(fetchDocsList());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(fetchDocsList());
  };

  if (error) {
    return (
      <CustomLayout docs={[]} onRefresh={handleRefresh} showChangelogTab={true}>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">Error Loading Documents</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              disabled={loading.docsList}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.docsList ? 'Retrying...' : 'Retry'}
            </button>
          </div>
        </div>
      </CustomLayout>
    );
  }

  if (docs.length === 0) {
    return (
      <CustomLayout docs={[]} onRefresh={handleRefresh} showChangelogTab={true}>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-4">No Documents Found</h1>
            <p className="text-gray-600 mb-4">No documents are available at the moment.</p>
            <button 
              onClick={handleRefresh}
              disabled={loading.docsList}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.docsList ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout docs={docs} onRefresh={handleRefresh} showChangelogTab={true}>
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">Documentation</h1>
          <button 
            onClick={handleRefresh}
            disabled={loading.docsList}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.docsList ? 'Refreshing...' : 'Refresh Docs'}
          </button>
        </div>
        <div className="grid gap-4">
          {docs.map((doc) => (
            <Link
              key={doc._id}
              to={`/docs/${doc._id}`}
              className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h2 className="text-lg font-semibold mb-2">{doc.metadata.moduleName || doc.source}</h2>
              <p className="text-gray-600 mb-2">{doc.provider} • {doc.model}</p>
              <p className="text-sm text-gray-500">Created: {new Date(doc.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>
      </div>
    </CustomLayout>
  );
}
