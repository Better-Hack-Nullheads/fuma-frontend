import { Link, useParams } from 'react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { type PageTree } from 'fumadocs-core/server';
import { DocViewer } from '../../components/DocViewer';
import { Sidebar } from '../../components/Sidebar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDocById, fetchDocsList, clearError } from '@/store/slices/docsSlice';
import { useEffect } from 'react';
import type { Route } from './+types/[id]';

export default function DocPage() {
  const dispatch = useAppDispatch();
  const { docs, currentDoc, loading, error } = useAppSelector((state) => state.docs);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      dispatch(clearError());
      dispatch(fetchDocById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (docs.length === 0) {
      dispatch(fetchDocsList());
    }
  }, [dispatch, docs.length]);

  if (error) {
    return (
      <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={docs} currentId={id} />
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Document Not Found</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link 
                to="/docs" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Back to Documents
              </Link>
            </div>
          </div>
        </div>
      </DocsLayout>
    );
  }

  if (loading.currentDoc) {
    return (
      <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={docs} currentId={id} />
          <div className="flex-1 flex items-center justify-center min-h-[400px] p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading document...</p>
            </div>
          </div>
        </div>
      </DocsLayout>
    );
  }

  if (!currentDoc.content) {
    return (
      <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={docs} currentId={id} />
          <div className="flex-1 flex items-center justify-center min-h-[400px] p-8">
            <div className="text-center">
              <p className="text-gray-600">No document content available</p>
            </div>
          </div>
        </div>
      </DocsLayout>
    );
  }

  return (
    <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
      <div className="flex">
        <Sidebar docs={docs} currentId={id} />
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {docs.find(doc => doc._id === id)?.title || 'Document'}
                </h1>
                <p className="text-gray-600">
                  {docs.find(doc => doc._id === id)?.description || ''}
                </p>
              </div>
              <Link
                to={`/docs/edit/${id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Document
              </Link>
            </div>
            <DocViewer content={currentDoc.content} />
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
