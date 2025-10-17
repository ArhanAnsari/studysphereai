'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { dbService } from '@/lib/appwrite';
import ProtectedRoute from '@/components/protected-route';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, Target, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';

function DashboardPageContent() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    questionsAsked: 0,
    notesCreated: 0,
    goalsCompleted: 0,
    totalPlans: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const [questions, notes, plans] = await Promise.all([
        dbService.getUserQuestions(user.$id, 100),
        dbService.getUserNotes(user.$id),
        dbService.getUserStudyPlans(user.$id),
      ]);

      const completedPlans = (plans.documents as any[]).filter(
        (p) => p.status === 'completed'
      ).length;

      setStats({
        questionsAsked: questions.total,
        notesCreated: notes.total,
        goalsCompleted: completedPlans,
        totalPlans: plans.total,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Brain, label: 'Questions Asked', value: stats.questionsAsked.toString(), color: 'blue' },
    { icon: BookOpen, label: 'Notes Created', value: stats.notesCreated.toString(), color: 'purple' },
    { icon: Target, label: 'Goals Completed', value: stats.goalsCompleted.toString(), color: 'green' },
    { icon: TrendingUp, label: 'Total Plans', value: stats.totalPlans.toString(), color: 'orange' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Student'}! 👋</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Ready to continue your learning journey? Let's achieve your goals today!
              </p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      {loading ? (
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                            <p className="text-3xl font-bold mt-1">{stat.value}</p>
                          </div>
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                            stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                            'bg-orange-100 dark:bg-orange-900/30'
                          }`}>
                            <stat.icon className={`h-6 w-6 ${
                              stat.color === 'blue' ? 'text-blue-600' :
                              stat.color === 'purple' ? 'text-purple-600' :
                              stat.color === 'green' ? 'text-green-600' :
                              'text-orange-600'
                            }`} />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Link href="/ask">
                      <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Brain className="h-6 w-6 text-blue-600" />
                        <span>Ask AI</span>
                      </Button>
                    </Link>
                    <Link href="/notes">
                      <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                        <span>Create Note</span>
                      </Button>
                    </Link>
                    <Link href="/planner">
                      <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-900/20">
                        <Target className="h-6 w-6 text-green-600" />
                        <span>New Goal</span>
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                        <Award className="h-6 w-6 text-orange-600" />
                        <span>View Profile</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <Award className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Keep Learning! 🚀</h3>
                      <p className="text-blue-100">You're doing great! Continue your learning streak.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}
