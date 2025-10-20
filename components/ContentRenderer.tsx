'use client';

import React from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { LaTeXRenderer, useLatexExtraction } from './LaTeXRenderer';

interface ContentRendererProps {
  content: string;
  className?: string;
  supportMarkdown?: boolean;
  supportLatex?: boolean;
}

export function ContentRenderer({
  content,
  className = '',
  supportMarkdown = true,
  supportLatex = true,
}: ContentRendererProps) {
  const [processedContent, setProcessedContent] = React.useState<React.ReactNode>(null);

  React.useEffect(() => {
    if (!supportLatex && !supportMarkdown) {
      setProcessedContent(content);
      return;
    }

    if (supportLatex) {
      // Extract LaTeX expressions
      const parts = useLatexExtraction(content);
      
      const rendered = parts.map((part, index) => {
        if (part.type === 'text') {
          // Apply markdown to text parts if enabled
          if (supportMarkdown) {
            return (
              <React.Fragment key={index}>
                <MarkdownRenderer content={part.content} />
              </React.Fragment>
            );
          } else {
            return (
              <div key={index} className="whitespace-pre-wrap">
                {part.content}
              </div>
            );
          }
        } else if (part.type === 'inline') {
          return <LaTeXRenderer key={index} content={part.content} inline={true} />;
        } else if (part.type === 'block') {
          return <LaTeXRenderer key={index} content={part.content} inline={false} />;
        }
      });

      setProcessedContent(rendered);
    } else if (supportMarkdown) {
      setProcessedContent(<MarkdownRenderer content={content} />);
    } else {
      setProcessedContent(content);
    }
  }, [content, supportMarkdown, supportLatex]);

  return <div className={className}>{processedContent}</div>;
}
