import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { type PageTree } from 'fumadocs-core/server';
import { Changelog } from '../../components/Changelog';
import { DocViewer } from '../../components/DocViewer';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDocumentStats } from '@/store/slices/docsSlice';
import { useEffect, useState } from 'react';
import type { DocItem } from '@/store/slices/docsSlice';

export default function ChangelogPage() {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.docs);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);

  useEffect(() => {
    dispatch(fetchDocumentStats());
  }, [dispatch]);

  const handleDocumentSelect = (doc: DocItem) => {
    setSelectedDoc(doc);
  };

  return (
    <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
      <div className="flex">
        <Changelog onDocumentSelect={handleDocumentSelect} />
        <div className="flex-1">
          {selectedDoc ? (
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{selectedDoc.title}</h1>
                <p className="text-gray-600 mb-4">{selectedDoc.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Version: {selectedDoc.chunkTime ? new Date(selectedDoc.chunkTime).toLocaleString() : 'Unknown'}</p>
                  {selectedDoc.runId && <p>Run ID: {selectedDoc.runId}</p>}
                </div>
              </div>
              <DocViewer content={selectedDoc.mdxContent} />
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[400px] p-8">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-600 mb-2">Select a Document Version</h2>
                <p className="text-gray-500">
                  Choose a version from the changelog to view its content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DocsLayout>
  );
}
