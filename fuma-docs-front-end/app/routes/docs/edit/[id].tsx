import { Link, useParams, useNavigate } from 'react-router';
import { CustomLayout } from '../../../components/CustomLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDocById, fetchDocsList, updateDoc, clearError } from '@/store/slices/docsSlice';
import { useEffect, useState } from 'react';
import type { Route } from './+types/[id]';

export default function EditDocPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { docs, currentDoc, loading, error } = useAppSelector((state) => state.docs);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mdxContent: ''
  });

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

  useEffect(() => {
    if (currentDoc) {
      setFormData({
        title: currentDoc.metadata.moduleName || currentDoc.source || '',
        description: `${currentDoc.provider} • ${currentDoc.model}`,
        mdxContent: currentDoc.content || ''
      });
    }
  }, [currentDoc]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !currentDoc) return;

    try {
      await dispatch(updateDoc({
        id: currentDoc._id,
        data: { content: formData.mdxContent }
      })).unwrap();
      
      navigate(`/docs/${id}`);
    } catch (err) {
      console.error('Failed to update document:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (error) {
    return (
      <CustomLayout docs={docs} currentId={id} showChangelogTab={true}>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold text-red-600 mb-4">Error Loading Document</h1>
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
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold mb-2">Edit Document</h1>
          <p className="text-gray-600">Make changes to your document content</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
            />
          </div>

          <div>
            <label htmlFor="mdxContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content (MDX)
            </label>
            <textarea
              id="mdxContent"
              name="mdxContent"
              value={formData.mdxContent}
              onChange={handleChange}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Enter your MDX content here..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Link
              to={`/docs/${id}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading.currentDoc}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.currentDoc ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </CustomLayout>
  );
}