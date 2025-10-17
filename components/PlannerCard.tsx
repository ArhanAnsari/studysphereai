'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Calendar, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
}

interface PlannerCardProps {
  title: string;
  description?: string;
  tasks: Task[];
  onTaskToggle?: (taskId: string) => void;
  onViewDetails?: () => void;
  className?: string;
}

export function PlannerCard({
  title,
  description,
  tasks,
  onTaskToggle,
  onViewDetails,
  className,
}: PlannerCardProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const getUpcomingTasks = () => {
    return tasks
      .filter(t => !t.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 3);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      className={cn('', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                {title}
              </CardTitle>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">
                Progress: {completedCount}/{tasks.length} tasks
              </span>
              <span className="font-medium text-purple-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Tasks
            </h4>
            
            {getUpcomingTasks().length > 0 ? (
              <div className="space-y-2">
                {getUpcomingTasks().map((task) => (
                  <motion.div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => onTaskToggle?.(task.id)}
                      className="mt-0.5"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm',
                        task.completed && 'line-through text-gray-500'
                      )}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(task.dueDate)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                All tasks completed! 🎉
              </p>
            )}

            {onViewDetails && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={onViewDetails}
              >
                View Full Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
