import { CustomLayout } from '../../components/CustomLayout';
import { Changelog } from '../../components/Changelog';
import { DocViewer } from '../../components/DocViewer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDocumentStats, fetchDocById } from '@/store/slices/docsSlice';
import { useEffect, useState } from 'react';
import type { DocItem } from '@/store/slices/docsSlice';

export default function ChangelogPage() {
  const dispatch = useAppDispatch();
  const { stats, loading, error, currentDoc } = useAppSelector((state) => state.docs);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);

  useEffect(() => {
    dispatch(fetchDocumentStats());
  }, [dispatch]);

  const handleDocumentSelect = async (doc: DocItem) => {
    // Set the selected document to show inline
    setSelectedDoc(doc);
    // Fetch the full document content
    dispatch(fetchDocById(doc._id));
  };

  return (
    <CustomLayout docs={[]} showChangelogTab={true}>
      <div className="flex">
        <Changelog onDocumentSelect={handleDocumentSelect} />
        <div className="flex-1 bg-gray-50 dark:bg-gray-800">
          {selectedDoc && currentDoc ? (
            // Show selected document content
            <div className="bg-white dark:bg-gray-900 min-h-screen">
              {/* Document Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-8 py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          onClick={() => setSelectedDoc(null)}
                          className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Back to Changelog
                        </button>
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
                  </div>
                </div>
              </div>

              {/* Document Content */}
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
          ) : (
            // Show changelog overview
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-8">
                <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Documentation Changelog</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Browse the version history of your documentation. Select a timeline from the dropdown to view documents from that version.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <div className="text-center">
                  <div className="text-gray-400 mb-6">
                    <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Version History</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                    Use the dropdown in the sidebar to select a specific timeline and view all documents from that version. 
                    Click on any document to view its full content.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Select Timeline</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Choose from available version timestamps</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Browse Documents</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">View all documents from selected version</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">View Content</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Click to read full document content</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomLayout>
  );
}
