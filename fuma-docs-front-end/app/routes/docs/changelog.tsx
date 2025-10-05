import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { type PageTree } from 'fumadocs-core/server';
import { Changelog } from '../../components/Changelog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDocumentStats } from '@/store/slices/docsSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { DocItem } from '@/store/slices/docsSlice';

export default function ChangelogPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, loading, error } = useAppSelector((state) => state.docs);

  useEffect(() => {
    dispatch(fetchDocumentStats());
  }, [dispatch]);

  const handleDocumentSelect = (doc: DocItem) => {
    // Navigate to the individual document page using the _id
    navigate(`/docs/${doc._id}`);
  };

  return (
    <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
      <div className="flex">
        <Changelog onDocumentSelect={handleDocumentSelect} />
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">Documentation Changelog</h1>
              <p className="text-gray-600">
                Browse the version history of your documentation. Click on any document to view its content.
              </p>
            </div>
            
            {loading.stats && (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading changelog...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            
            {stats && !loading.stats && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h2 className="text-lg font-semibold text-blue-800 mb-2">Total Documents</h2>
                  <p className="text-blue-600">
                    {typeof stats.totalCount === 'object' ? stats.totalCount.count : stats.totalCount} documents across {stats.chunkTimes.length} versions
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Available Versions</h2>
                  <p className="text-gray-600 mb-4">
                    Select a version from the sidebar to view its documents, or click on any document to view its content.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
