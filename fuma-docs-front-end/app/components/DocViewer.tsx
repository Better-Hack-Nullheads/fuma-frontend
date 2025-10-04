import { useMemo, useState, useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import defaultMdxComponents from 'fumadocs-ui/mdx';

interface DocViewerProps {
  content: string;
}

// Custom MDX components that work with Fumadocs
const mdxComponents = {
  ...defaultMdxComponents,
  // Add any custom components here if needed
};

// Simple MDX content renderer that handles basic markdown
function SimpleMdxRenderer({ content }: { content: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [CompiledMdx, setCompiledMdx] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const compileMdx = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // For now, we'll render the content as HTML with basic markdown parsing
        // In a production app, you'd want to use a proper MDX compiler
        const htmlContent = content
          .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
          .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold mb-3">$1</h2>')
          .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold mb-2">$1</h3>')
          .replace(/^#### (.*$)/gim, '<h4 class="text-lg font-semibold mb-2">$1</h4>')
          .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
          .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
          .replace(/`(.*?)`/gim, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
          .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>')
          .replace(/\n\n/gim, '</p><p class="mb-4">')
          .replace(/^(?!<[h1-6]|<pre|<code)(.*$)/gim, '<p class="mb-4">$1</p>');

        const Component = () => (
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        );

        setCompiledMdx(() => Component);
      } catch (err) {
        console.error('Error processing content:', err);
        setError(err instanceof Error ? err.message : 'Failed to process content');
      } finally {
        setIsLoading(false);
      }
    };

    compileMdx();
  }, [content]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">Error Rendering Document</h3>
        </div>
        <p className="text-gray-600 mb-4">There was an error processing the content.</p>
        <details className="text-left max-w-2xl mx-auto">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
            Show error details
          </summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
            {error}
          </pre>
        </details>
      </div>
    );
  }

  if (!CompiledMdx) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No content to display</p>
      </div>
    );
  }

  return <CompiledMdx />;
}

export function DocViewer({ content }: DocViewerProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-8">
        <MDXProvider components={mdxComponents}>
          <SimpleMdxRenderer content={content} />
        </MDXProvider>
      </div>
    </div>
  );
}
