'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Volume2, BookmarkPlus, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContentRenderer } from '@/components/ContentRenderer';

interface AnswerCardProps {
  question: string;
  answer: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  onSaveNote?: () => void;
  onCreateFlashcard?: () => void;
}

export function AnswerCard({
  question,
  answer,
  subject,
  difficulty,
  onSaveNote,
  onCreateFlashcard,
}: AnswerCardProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-2">{question}</CardTitle>
              <div className="flex gap-2">
                {subject && (
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {subject}
                  </span>
                )}
                {difficulty && (
                  <span className={`px-2 py-1 rounded-full text-xs ${difficultyColors[difficulty]}`}>
                    {difficulty}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <ContentRenderer content={answer} supportMarkdown={true} supportLatex={true} className="mb-4" />

          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            
            <Button size="sm" variant="outline" onClick={handleSpeak}>
              <Volume2 className={`h-4 w-4 mr-2 ${isSpeaking ? 'animate-pulse' : ''}`} />
              {isSpeaking ? 'Stop' : 'Read Aloud'}
            </Button>
            
            {onSaveNote && (
              <Button size="sm" variant="outline" onClick={onSaveNote}>
                <FileText className="h-4 w-4 mr-2" />
                Save as Note
              </Button>
            )}
            
            {onCreateFlashcard && (
              <Button size="sm" variant="outline" onClick={onCreateFlashcard}>
                <BookmarkPlus className="h-4 w-4 mr-2" />
                Create Flashcard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
