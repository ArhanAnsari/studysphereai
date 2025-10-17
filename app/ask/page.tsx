'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionInput } from '@/components/QuestionInput';
import { AnswerCard } from '@/components/AnswerCard';
import { generateAnswer } from '@/lib/ai';
import { Sparkles, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QA {
  id: string;
  question: string;
  answer: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timestamp: Date;
}

export default function AskPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [qaHistory, setQaHistory] = useState<QA[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleAskQuestion = async (question: string, mode: 'quick' | 'detailed') => {
    setIsLoading(true);
    try {
      const response = await generateAnswer(question, mode);
      
      const newQA: QA = {
        id: Date.now().toString(),
        question,
        answer: response.text,
        subject: response.subject,
        difficulty: response.difficulty,
        timestamp: new Date(),
      };

      setQaHistory(prev => [newQA, ...prev]);

      // TODO: Save to Appwrite database
      // await dbService.saveQuestion({
      //   userId: user.$id,
      //   question,
      //   answer: response.text,
      //   subject: response.subject || 'general',
      //   difficulty: response.difficulty || 'medium',
      //   mode,
      //   hasVisual: response.hasFormula || response.hasCode || false,
      // });

    } catch (error) {
      console.error('Error generating answer:', error);
      alert('Failed to generate answer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsNote = (qa: QA) => {
    // TODO: Save to notes
    alert('Note saved! (Feature to be implemented)');
  };

  const handleCreateFlashcard = (qa: QA) => {
    // TODO: Create flashcard
    alert('Flashcard created! (Feature to be implemented)');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ask AI Anything
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Get instant, accurate explanations for any subject. Choose between quick answers or detailed step-by-step explanations.
        </p>
      </motion.div>

      {/* Question Input */}
      <QuestionInput onSubmit={handleAskQuestion} isLoading={isLoading} />

      {/* History Toggle */}
      {qaHistory.length > 0 && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {showHistory ? 'All Questions' : 'Latest Question'}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="h-4 w-4 mr-2" />
            {showHistory ? 'Show Latest Only' : `View All (${qaHistory.length})`}
          </Button>
        </div>
      )}

      {/* Q&A Display */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {qaHistory.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                <Brain className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No questions yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start by asking a question above. I'm here to help with any subject!
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAskQuestion('Explain photosynthesis in simple terms', 'detailed')}
                >
                  Try: Photosynthesis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAskQuestion('Solve: x² + 5x + 6 = 0', 'detailed')}
                >
                  Try: Solve Equation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAskQuestion('What is recursion in programming?', 'detailed')}
                >
                  Try: Recursion
                </Button>
              </div>
            </motion.div>
          )}

          {(showHistory ? qaHistory : qaHistory.slice(0, 1)).map((qa, index) => (
            <motion.div
              key={qa.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <AnswerCard
                question={qa.question}
                answer={qa.answer}
                subject={qa.subject}
                difficulty={qa.difficulty}
                onSaveNote={() => handleSaveAsNote(qa)}
                onCreateFlashcard={() => handleCreateFlashcard(qa)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-12"
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center animate-pulse">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <p className="text-lg font-medium">AI is thinking...</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Generating your answer
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

import { Brain } from 'lucide-react';
