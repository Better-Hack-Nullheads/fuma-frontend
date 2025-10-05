import { Link, useParams, useNavigate } from 'react-router';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { type PageTree } from 'fumadocs-core/server';
import { Sidebar } from '../../../components/Sidebar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDocById, fetchDocsList, updateDoc, clearError } from '@/store/slices/docsSlice';
import { useEffect, useState } from 'react';
import type { Route } from './+types/[id]';

export default function EditDocPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { docs, currentDoc, loading, error } = useAppSelector((state) => state.docs);
  const { id } = useParams();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mdxContent: ''
  });

  // Load document data
  useEffect(() => {
    if (id) {
      dispatch(clearError());
      dispatch(fetchDocById(id));
    }
  }, [dispatch, id]);

  // Load docs list for sidebar
  useEffect(() => {
    if (docs.length === 0) {
      dispatch(fetchDocsList());
    }
  }, [dispatch, docs.length]);

  // Update form when current doc changes
  useEffect(() => {
    if (currentDoc.content) {
      // Find the full document data from docs list
      const fullDoc = docs.find(doc => doc._id === id);
      if (fullDoc) {
        setFormData({
          title: fullDoc.title,
          description: fullDoc.description,
          mdxContent: fullDoc.mdxContent
        });
      }
    }
  }, [currentDoc, docs, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await dispatch(updateDoc({ 
        id, 
        data: {
          title: formData.title,
          description: formData.description,
          mdxContent: formData.mdxContent
        }
      })).unwrap();
      
      // Navigate back to the document view
      navigate(`/docs/${id}`);
    } catch (error) {
      console.error('Failed to update document:', error);
    }
  };

  const handleCancel = () => {
    navigate(`/docs/${id}`);
  };

  if (error && !currentDoc.content) {
    return (
      <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
        <div className="flex">
          <Sidebar docs={docs} currentId={id} />
          <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Document</h1>
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

  return (
    <DocsLayout {...baseOptions()} tree={{ name: 'docs', children: [] } as PageTree.Root}>
      <div className="flex">
        <Sidebar docs={docs} currentId={id} />
        <div className="flex-1">
          <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Edit Document</h1>
              <p className="text-gray-600">Make changes to your document content</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="mdxContent" className="block text-sm font-medium text-gray-700 mb-2">
                  MDX Content
                </label>
                <textarea
                  id="mdxContent"
                  name="mdxContent"
                  value={formData.mdxContent}
                  onChange={handleInputChange}
                  rows={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Write your content in MDX format. Supports Markdown syntax and React components.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading.currentDoc}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading.currentDoc ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DocsLayout>
  );
}
