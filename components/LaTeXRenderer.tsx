'use client';

import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LaTeXRendererProps {
  content: string;
  inline?: boolean;
  className?: string;
}

export function LaTeXRenderer({ content, inline = false, className = '' }: LaTeXRendererProps) {
  try {
    if (inline) {
      return (
        <span className={`inline-math ${className}`}>
          <InlineMath math={content} />
        </span>
      );
    } else {
      return (
        <div className={`block-math my-4 flex justify-center ${className}`}>
          <BlockMath math={content} />
        </div>
      );
    }
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return (
      <code className={`bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm ${className}`}>
        {content}
      </code>
    );
  }
}

// Hook to detect and extract LaTeX expressions from text
export function useLatexExtraction(text: string) {
  const inlineRegex = /\$([^\$\n]+)\$/g;
  const blockRegex = /\$\$\n?([\s\S]*?)\n?\$\$/g;

  const parts: Array<{ type: 'text' | 'inline' | 'block'; content: string }> = [];
  let lastIndex = 0;

  // Process block math first
  let blockMatch;
  const blockRegex2 = /\$\$([\s\S]*?)\$\$/g;
  while ((blockMatch = blockRegex2.exec(text)) !== null) {
    if (blockMatch.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, blockMatch.index) });
    }
    parts.push({ type: 'block', content: blockMatch[1].trim() });
    lastIndex = blockRegex2.lastIndex;
  }

  // Process remaining text for inline math
  const remaining = text.slice(lastIndex);
  let inlineMatch;
  let remainingLastIndex = 0;

  while ((inlineMatch = inlineRegex.exec(remaining)) !== null) {
    if (inlineMatch.index > remainingLastIndex) {
      parts.push({ type: 'text', content: remaining.slice(remainingLastIndex, inlineMatch.index) });
    }
    parts.push({ type: 'inline', content: inlineMatch[1] });
    remainingLastIndex = inlineRegex.lastIndex;
  }

  if (remainingLastIndex < remaining.length) {
    parts.push({ type: 'text', content: remaining.slice(remainingLastIndex) });
  }

  return parts;
}
