import { useMemo, useState, useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Callout } from 'fumadocs-ui/components/callout';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';

interface DocViewerProps {
  content: string;
  title?: string;
  metadata?: {
    provider?: string;
    model?: string;
    timestamp?: string;
    framework?: string;
    moduleName?: string;
  };
}

// Enhanced MDX components with Fumadocs UI components
const mdxComponents = {
  ...defaultMdxComponents,
  Callout,
  Tabs,
  Tab,
  // Custom components for better documentation experience
  Info: ({ children, ...props }: any) => (
    <Callout type="info" {...props}>
      {children}
    </Callout>
  ),
  Warning: ({ children, ...props }: any) => (
    <Callout type="warn" {...props}>
      {children}
    </Callout>
  ),
  Error: ({ children, ...props }: any) => (
    <Callout type="error" {...props}>
      {children}
    </Callout>
  ),
  Success: ({ children, ...props }: any) => (
    <Callout type="check" {...props}>
      {children}
    </Callout>
  ),
};

// Enhanced markdown processor with better styling and Fumadocs components
function EnhancedMdxRenderer({ content, title, metadata }: { 
  content: string; 
  title?: string; 
  metadata?: any;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [CompiledMdx, setCompiledMdx] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const compileMdx = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Enhanced markdown processing with better styling
        let processedContent = content;

        // Process headers with better styling
        processedContent = processedContent
          .replace(/^# (.*$)/gim, '<h1 class="scroll-m-20 text-2xl font-bold tracking-tight mb-4 border-b pb-2">$1</h1>')
          .replace(/^## (.*$)/gim, '<h2 class="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0 mt-6 mb-3">$1</h2>')
          .replace(/^### (.*$)/gim, '<h3 class="scroll-m-20 text-lg font-semibold tracking-tight mt-4 mb-2">$1</h3>')
          .replace(/^#### (.*$)/gim, '<h4 class="scroll-m-20 text-base font-semibold tracking-tight mt-3 mb-2">$1</h4>')
          .replace(/^##### (.*$)/gim, '<h5 class="scroll-m-20 text-sm font-semibold tracking-tight mt-2 mb-2">$1</h5>')
          .replace(/^###### (.*$)/gim, '<h6 class="scroll-m-20 text-sm font-semibold tracking-tight mt-2 mb-2">$1</h6>');

        // Process inline formatting
        processedContent = processedContent
          .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
          .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
          .replace(/~~(.*?)~~/gim, '<del class="line-through">$1</del>')
          .replace(/`(.*?)`/gim, '<code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">$1</code>');

        // Process code blocks with syntax highlighting
        processedContent = processedContent
          .replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
            const language = lang || 'text';
            return `<pre class="mb-4 mt-6 overflow-x-auto rounded-lg border bg-muted p-4"><code class="relative rounded font-mono text-sm" data-language="${language}">${code.trim()}</code></pre>`;
          });

        // Process blockquotes
        processedContent = processedContent
          .replace(/^> (.*$)/gim, '<blockquote class="mt-6 border-l-2 pl-6 italic">$1</blockquote>');

        // Process lists
        processedContent = processedContent
          .replace(/^\* (.*$)/gim, '<li class="mb-1">$1</li>')
          .replace(/^- (.*$)/gim, '<li class="mb-1">$1</li>')
          .replace(/^(\d+)\. (.*$)/gim, '<li class="mb-1">$1. $2</li>');

        // Wrap consecutive list items in ul/ol
        processedContent = processedContent
          .replace(/(<li class="mb-1">.*<\/li>)/gims, (match) => {
            if (match.includes('class="mb-1">1.')) {
              return `<ol class="my-6 ml-6 list-decimal [&>li]:mt-2">${match}</ol>`;
            } else {
              return `<ul class="my-6 ml-6 list-disc [&>li]:mt-2">${match}</ul>`;
            }
          });

        // Process links
        processedContent = processedContent
          .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="font-medium text-primary underline underline-offset-4 hover:no-underline">$1</a>');

        // Process paragraphs
        processedContent = processedContent
          .replace(/\n\n/gim, '</p><p class="leading-7 [&:not(:first-child)]:mt-6">')
          .replace(/^(?!<[h1-6]|<pre|<blockquote|<ul|<ol|<li)(.*$)/gim, '<p class="leading-7 [&:not(:first-child)]:mt-6">$1</p>');

        // Clean up empty paragraphs
        processedContent = processedContent
          .replace(/<p class="leading-7 \[&:not\(:first-child\)\]:mt-6"><\/p>/gim, '');

        const Component = () => (
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div 
              className="prose prose-gray dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>
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
  }, [content, title, metadata]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing document...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-6">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Error Rendering Document</h3>
        </div>
        <p className="text-gray-600 mb-6">There was an error processing the content.</p>
        <details className="text-left max-w-4xl mx-auto">
          <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
            Show error details
          </summary>
          <pre className="p-4 bg-gray-100 rounded-lg text-xs overflow-auto border">
            {error}
          </pre>
        </details>
      </div>
    );
  }

  if (!CompiledMdx) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Available</h3>
        <p className="text-gray-500">This document doesn't contain any content to display.</p>
      </div>
    );
  }

  return <CompiledMdx />;
}

export function DocViewer({ content, title, metadata }: DocViewerProps) {
  return (
    <div className="flex-1 overflow-auto bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-8">
        <MDXProvider components={mdxComponents}>
          <EnhancedMdxRenderer content={content} title={title} metadata={metadata} />
        </MDXProvider>
      </div>
    </div>
  );
}