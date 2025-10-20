'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm md:prose-base dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
          // Code blocks with syntax highlighting
          code({ node, inline, className: codeClassName, children, ...props }: any) {
            const match = /language-(\w+)/.exec(codeClassName || '');
            const language = match ? match[1] : '';

            if (inline) {
              return (
                <code
                  className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <SyntaxHighlighter
                style={atomDark}
                language={language || 'text'}
                PreTag="div"
                className="rounded-lg my-4"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            );
          },

          // Enhanced headings
          h1: ({ node, ...props }: any) => (
            <h1 className="text-3xl font-bold mt-6 mb-4 text-gray-900 dark:text-white" {...props} />
          ),
          h2: ({ node, ...props }: any) => (
            <h2 className="text-2xl font-bold mt-5 mb-3 text-gray-900 dark:text-white" {...props} />
          ),
          h3: ({ node, ...props }: any) => (
            <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900 dark:text-white" {...props} />
          ),

          // Enhanced paragraphs
          p: ({ node, ...props }: any) => (
            <p className="my-3 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
          ),

          // Enhanced lists
          ul: ({ node, ...props }: any) => (
            <ul className="list-disc list-inside my-3 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
          ),
          ol: ({ node, ...props }: any) => (
            <ol className="list-decimal list-inside my-3 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
          ),
          li: ({ node, ...props }: any) => (
            <li className="ml-4" {...props} />
          ),

          // Enhanced blockquotes
          blockquote: ({ node, ...props }: any) => (
            <blockquote
              className="border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/30 pl-4 py-2 my-4 rounded-r-lg italic text-gray-700 dark:text-gray-300"
              {...props}
            />
          ),

          // Enhanced tables
          table: ({ node, ...props }: any) => (
            <table className="border-collapse border border-gray-300 dark:border-gray-700 my-4 w-full" {...props} />
          ),
          th: ({ node, ...props }: any) => (
            <th className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-3 text-left font-bold" {...props} />
          ),
          td: ({ node, ...props }: any) => (
            <td className="border border-gray-300 dark:border-gray-700 p-3" {...props} />
          ),

          // Enhanced links
          a: ({ node, ...props }: any) => (
            <a className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),

          // Horizontal rule
          hr: ({ node, ...props }: any) => (
            <hr className="my-6 border-t-2 border-gray-300 dark:border-gray-700" {...props} />
          ),

          // Images
          img: ({ node, ...props }: any) => (
            <img className="rounded-lg my-4 max-w-full h-auto" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
