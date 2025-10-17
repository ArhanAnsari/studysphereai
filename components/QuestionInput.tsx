'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface QuestionInputProps {
  onSubmit: (question: string, mode: 'quick' | 'detailed') => void;
  isLoading?: boolean;
  className?: string;
}

export function QuestionInput({ onSubmit, isLoading = false, className }: QuestionInputProps) {
  const [question, setQuestion] = useState('');
  const [mode, setMode] = useState<'quick' | 'detailed'>('detailed');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim(), mode);
      setQuestion('');
    }
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuestion(prev => prev + ' ' + transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Voice input is not supported in your browser.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('w-full', className)}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your doubt here... (e.g., 'Explain photosynthesis' or 'Solve: x² + 5x + 6 = 0')"
            className="pr-14 min-h-[120px] resize-none"
            disabled={isLoading}
          />
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute right-2 top-2"
            onClick={handleVoiceInput}
            disabled={isLoading || isListening}
          >
            <Mic className={cn('h-5 w-5', isListening && 'text-red-500 animate-pulse')} />
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'quick' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('quick')}
              disabled={isLoading}
            >
              ⚡ Quick Answer
            </Button>
            <Button
              type="button"
              variant={mode === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('detailed')}
              disabled={isLoading}
            >
              📚 Detailed Explanation
            </Button>
          </div>

          <Button
            type="submit"
            disabled={!question.trim() || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Ask
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
