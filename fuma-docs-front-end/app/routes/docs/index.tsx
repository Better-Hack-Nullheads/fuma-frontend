import { Link, useLoaderData, useRevalidator } from 'react-router';
import { getDocsList } from '@/lib/api';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { Sidebar } from '../../components/Sidebar';
import { type PageTree } from 'fumadocs-core/server';
import type { Route } from './+types/index';

export async function loader() {
  try {
    const docs = await getDocsList();
    return { docs, error: null };
  } catch (error) {
    console.error('Error loading docs:', error);
    return { 
      docs: [], 
      error: error instanceof Error ? error.message : 'Failed to load documents' 
    };
  }
}

export default function DocsIndex() {
  const { docs, error } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  const handleRefresh = () => {
    revalidator.revalidate();
  };

  if (error) {
    return (
      <DocsLayout {...baseOptions()} tree={{} as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={[]} onRefresh={handleRefresh} />
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Documents</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {revalidator.state === 'loading' ? 'Retrying...' : 'Retry'}
              </button>
            </div>
          </div>
        </div>
      </DocsLayout>
    );
  }

  if (docs.length === 0) {
    return (
      <DocsLayout {...baseOptions()} tree={{} as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={[]} onRefresh={handleRefresh} />
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">No Documents Found</h1>
              <p className="text-gray-600 mb-4">No documents are available at the moment.</p>
              <button 
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {revalidator.state === 'loading' ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </DocsLayout>
    );
  }

  return (
    <DocsLayout {...baseOptions()} tree={{} as PageTree.Root}>
      <div className="flex">
        <Sidebar docs={docs} onRefresh={handleRefresh} />
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Documentation</h1>
              <button 
                onClick={handleRefresh}
                disabled={revalidator.state === 'loading'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {revalidator.state === 'loading' ? 'Refreshing...' : 'Refresh Docs'}
              </button>
            </div>
            <div className="grid gap-4">
              {docs.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/docs/${doc.id}`}
                  className="block p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <h2 className="text-xl font-semibold mb-2">{doc.content}</h2>
                  <p className="text-gray-600">ID: {doc.id}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
