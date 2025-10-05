import { Link } from 'react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { Sidebar } from '../../components/Sidebar';
import { type PageTree } from 'fumadocs-core/server';
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
      <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={[]} onRefresh={handleRefresh} showChangelogTab={true} />
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Documents</h1>
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
        </div>
      </DocsLayout>
    );
  }

  if (docs.length === 0) {
    return (
      <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={[]} onRefresh={handleRefresh} showChangelogTab={true} />
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">No Documents Found</h1>
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
        </div>
      </DocsLayout>
    );
  }

  return (
    <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
      <div className="flex">
        <Sidebar docs={docs} onRefresh={handleRefresh} showChangelogTab={true} />
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Documentation</h1>
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
                  <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
                  <p className="text-gray-600 mb-2">{doc.description}</p>
                  <p className="text-sm text-gray-500">Created: {new Date(doc.createdAt).toLocaleDateString()}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
