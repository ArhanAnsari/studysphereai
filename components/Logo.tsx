'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  useDefaultImage?: boolean;
}

export function Logo({ 
  size = 'md', 
  showText = true,
  useDefaultImage = false 
}: LogoProps) {
  const sizeMap = {
    sm: { container: 'w-8 h-8', text: 'text-sm' },
    md: { container: 'w-10 h-10', text: 'text-lg' },
    lg: { container: 'w-20 h-20', text: 'text-3xl' },
  };

  const { container, text } = sizeMap[size];

  if (useDefaultImage) {
    return (
      <div className="flex items-center gap-2">
        <div className={`${container} rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold ${text} shadow-lg flex-shrink-0`}>
          <span>🧠</span>
        </div>
        {showText && (
          <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
            StudySphere AI
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Logo Placeholder - Ready for custom logo image */}
      <div className={`${container} rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold ${text} shadow-lg flex-shrink-0`}>
        <span>📚</span>
      </div>
      {showText && (
        <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
          StudySphere AI
        </span>
      )}
    </div>
  );
}
