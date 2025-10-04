import { Link, useLoaderData, useParams } from 'react-router';
import { getDocById, getDocsList } from '@/lib/api';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { type PageTree } from 'fumadocs-core/server';
import { DocViewer } from '../../components/DocViewer';
import { Sidebar } from '../../components/Sidebar';
import type { Route } from './+types/[id]';

export async function loader({ params }: Route.LoaderArgs) {
  const { id } = params;
  
  if (!id) {
    throw new Response('Document ID is required', { status: 400 });
  }

  try {
    const [docContent, docsList] = await Promise.all([
      getDocById(id),
      getDocsList()
    ]);
    
    return { 
      docContent, 
      docsList, 
      currentId: id,
      error: null 
    };
  } catch (error) {
    console.error('Error loading document:', error);
    const docsList = await getDocsList().catch(() => []);
    return { 
      docContent: null, 
      docsList, 
      currentId: id,
      error: error instanceof Error ? error.message : 'Failed to load document' 
    };
  }
}

export default function DocPage() {
  const { docContent, docsList, currentId, error } = useLoaderData<typeof loader>();

  if (error) {
    return (
      <DocsLayout {...baseOptions()} tree={{} as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={docsList} currentId={currentId} />
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

  if (!docContent) {
    return (
      <DocsLayout {...baseOptions()} tree={{} as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={docsList} currentId={currentId} />
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

  return (
    <DocsLayout {...baseOptions()} tree={{} as PageTree.Root}>
      <div className="flex">
        <Sidebar docs={docsList} currentId={currentId} />
        <div className="flex-1">
          <DocViewer content={docContent} />
        </div>
      </div>
    </DocsLayout>
  );
}
