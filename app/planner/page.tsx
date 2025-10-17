'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { dbService } from '@/lib/appwrite';
import { generateStudyPlan } from '@/lib/ai';
import ProtectedRoute from '@/components/protected-route';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
  Sparkles,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

interface StudyPlan {
  $id: string;
  title: string;
  description: string;
  subject: string;
  deadline: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  tasks: Task[];
  $createdAt: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

function PlannerPageContent() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    subject: '',
    deadline: '',
    tasks: [] as Task[],
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  const fetchPlans = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const fetchedPlans = await dbService.getUserStudyPlans(user.$id);
      setPlans(fetchedPlans.documents as unknown as StudyPlan[]);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) return;

    try {
      setIsGenerating(true);
      const generatedPlan = await generateStudyPlan(
        [aiPrompt],
        14, // 2 weeks default
        'intermediate'
      );
      
      // Parse AI response to create tasks
      const tasks: Task[] = generatedPlan.tasks.map((task, i) => ({
        id: `task-${Date.now()}-${i}`,
        title: task.title,
        completed: false,
      }));

      setNewPlan({
        ...newPlan,
        title: generatedPlan.title,
        description: generatedPlan.description,
        tasks: tasks.length > 0 ? tasks : [{ id: `task-${Date.now()}`, title: 'Review material', completed: false }],
      });
      setIsCreating(true);
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreatePlan = async () => {
    if (!user || !newPlan.title.trim()) return;

    try {
      await dbService.createStudyPlan({
        userId: user.$id,
        title: newPlan.title,
        description: newPlan.description,
        goals: newPlan.tasks.map(t => t.title),
        tasks: newPlan.tasks.map(t => ({
          id: t.id,
          title: t.title,
          completed: false,
          dueDate: newPlan.deadline || new Date().toISOString(),
        })),
        startDate: new Date().toISOString(),
        endDate: newPlan.deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active' as const,
      });

      setNewPlan({ title: '', description: '', subject: '', deadline: '', tasks: [] });
      setIsCreating(false);
      fetchPlans();
    } catch (error) {
      console.error('Error creating plan:', error);
    }
  };

  const toggleTaskComplete = async (planId: string, taskId: string) => {
    const plan = plans.find(p => p.$id === planId);
    if (!plan) return;

    const updatedTasks = plan.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const progress = Math.round((updatedTasks.filter(t => t.completed).length / updatedTasks.length) * 100);
    const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';

    try {
      await dbService.updateStudyPlan(planId, {
        tasks: updatedTasks,
        progress,
        status,
      } as any);
      fetchPlans();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this study plan?')) return;

    try {
      await dbService.deleteStudyPlan(planId);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const addTask = () => {
    setNewPlan({
      ...newPlan,
      tasks: [...newPlan.tasks, { id: `task-${Date.now()}`, title: '', completed: false }],
    });
  };

  const updateTask = (index: number, title: string) => {
    const updatedTasks = [...newPlan.tasks];
    updatedTasks[index].title = title;
    setNewPlan({ ...newPlan, tasks: updatedTasks });
  };

  const removeTask = (index: number) => {
    setNewPlan({
      ...newPlan,
      tasks: newPlan.tasks.filter((_, i) => i !== index),
    });
  };

  const stats = {
    total: plans.length,
    completed: plans.filter(p => p.status === 'completed').length,
    inProgress: plans.filter(p => p.status === 'in_progress').length,
    avgProgress: plans.length > 0 ? Math.round(plans.reduce((acc, p) => acc + (p.progress || 0), 0) / plans.length) : 0,
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Study Planner
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Organize your study goals and track your progress
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Target className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Plans</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                      <p className="text-2xl font-bold">{stats.inProgress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                      <p className="text-2xl font-bold">{stats.completed}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Avg Progress</p>
                      <p className="text-2xl font-bold">{stats.avgProgress}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Generate Section */}
            <Card className="mb-6 border-2 border-dashed border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Sparkles className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-100">
                      Generate Study Plan with AI
                    </h3>
                    <div className="flex gap-2">
                      <Input
                        placeholder="E.g., Create a 2-week plan to prepare for calculus final exam"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateWithAI()}
                        className="flex-1"
                      />
                      <Button onClick={handleGenerateWithAI} disabled={isGenerating || !aiPrompt.trim()}>
                        {isGenerating ? (
                          <>Generating...</>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create Plan Button */}
            <div className="mb-6">
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Manual Plan
              </Button>
            </div>

            {/* Create Plan Form */}
            <AnimatePresence>
              {isCreating && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Create New Study Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          placeholder="Plan Title"
                          value={newPlan.title}
                          onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                        />
                        <Input
                          placeholder="Subject"
                          value={newPlan.subject}
                          onChange={(e) => setNewPlan({ ...newPlan, subject: e.target.value })}
                        />
                      </div>

                      <Textarea
                        placeholder="Description"
                        value={newPlan.description}
                        onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                        rows={3}
                      />

                      <Input
                        type="date"
                        value={newPlan.deadline}
                        onChange={(e) => setNewPlan({ ...newPlan, deadline: e.target.value })}
                      />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-semibold">Tasks</label>
                          <Button type="button" size="sm" onClick={addTask}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Task
                          </Button>
                        </div>

                        {newPlan.tasks.map((task, index) => (
                          <div key={task.id} className="flex gap-2">
                            <Input
                              placeholder="Task title"
                              value={task.title}
                              onChange={(e) => updateTask(index, e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTask(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleCreatePlan} disabled={!newPlan.title.trim()}>
                          Create Plan
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCreating(false);
                            setNewPlan({ title: '', description: '', subject: '', deadline: '', tasks: [] });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Plans List */}
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : plans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  No study plans yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Create your first study plan to get organized!
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Plan
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="line-clamp-2">{plan.title}</CardTitle>
                            {plan.subject && (
                              <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                {plan.subject}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePlan(plan.$id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {plan.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            {plan.description}
                          </p>
                        )}

                        {/* Progress */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {plan.progress || 0}%
                            </span>
                          </div>
                          <Progress value={plan.progress || 0} />
                        </div>

                        {/* Tasks */}
                        {plan.tasks && plan.tasks.length > 0 && (
                          <div className="space-y-2">
                            {plan.tasks.map((task) => (
                              <div
                                key={task.id}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                                onClick={() => toggleTaskComplete(plan.$id, task.id)}
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                )}
                                <span
                                  className={`text-sm ${
                                    task.completed
                                      ? 'line-through text-gray-500'
                                      : 'text-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {task.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Deadline */}
                        {plan.deadline && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(plan.deadline).toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  return (
    <ProtectedRoute>
      <PlannerPageContent />
    </ProtectedRoute>
  );
}
