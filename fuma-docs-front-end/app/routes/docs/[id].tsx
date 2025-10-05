import { Link, useParams } from 'react-router';
import { CustomLayout } from '../../components/CustomLayout';
import { DocViewer } from '../../components/DocViewer';
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
      <CustomLayout docs={docs} currentId={id} showChangelogTab={true}>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">Document Not Found</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link 
              to="/docs" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Documents
            </Link>
          </div>
        </div>
      </CustomLayout>
    );
  }

  if (loading.currentDoc) {
    return (
      <CustomLayout docs={docs} currentId={id} showChangelogTab={true}>
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading document...</p>
          </div>
        </div>
      </CustomLayout>
    );
  }

  if (!currentDoc) {
    return (
      <CustomLayout docs={docs} currentId={id} showChangelogTab={true}>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-600 mb-4">Document Not Found</h1>
            <p className="text-gray-500 mb-4">The requested document could not be found.</p>
            <Link 
              to="/docs" 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Documents
            </Link>
          </div>
        </div>
      </CustomLayout>
    );
  }

  return (
    <CustomLayout docs={docs} currentId={id} showChangelogTab={true}>
      <div className="bg-white dark:bg-gray-900 min-h-screen">
        {/* Enhanced Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-8 py-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Link
                    to="/docs"
                    className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Documents
                  </Link>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {currentDoc.metadata.moduleName || currentDoc.source || 'Document'}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {currentDoc.provider}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    {currentDoc.model}
                  </span>
                  {currentDoc.timestamp && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(currentDoc.timestamp).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <Link
                to={`/docs/edit/${id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Document
              </Link>
            </div>
          </div>
        </div>

        {/* Enhanced Document Content */}
        <DocViewer 
          content={currentDoc.content} 
          title={currentDoc.metadata.moduleName || currentDoc.source}
          metadata={{
            provider: currentDoc.provider,
            model: currentDoc.model,
            timestamp: currentDoc.timestamp,
            framework: currentDoc.metadata.framework,
            moduleName: currentDoc.metadata.moduleName
          }}
        />
      </div>
    </CustomLayout>
  );
}