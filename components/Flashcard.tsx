'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashcardProps {
  front: string;
  back: string;
  subject?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  className?: string;
}

export function Flashcard({ front, back, subject, onDelete, onEdit, className }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className={cn('perspective-1000', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative h-64 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isFlipped ? 'back' : 'front'}
            initial={{ rotateY: isFlipped ? -180 : 180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 180 : -180, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            <Card className="h-full w-full">
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                {!isFlipped ? (
                  <>
                    {subject && (
                      <span className="absolute top-4 left-4 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {subject}
                      </span>
                    )}
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Question</div>
                    <p className="text-lg font-medium">{front}</p>
                    <div className="absolute bottom-4 text-xs text-gray-400">
                      Click to flip
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Answer</div>
                    <p className="text-lg">{back}</p>
                    <div className="absolute bottom-4 text-xs text-gray-400">
                      Click to flip
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-4 justify-center">
        <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Flip
        </Button>
        {onEdit && (
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
        {onDelete && (
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
    </motion.div>
  );
}
