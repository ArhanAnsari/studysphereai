'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { dbService } from '@/lib/appwrite';
import ProtectedRoute from '@/components/protected-route';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  BookOpen,
  FileText,
  Target,
  Edit2,
  Save,
  X,
  LogOut,
} from 'lucide-react';

function ProfilePageContent() {
  const { user, signOut, updateProfile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalNotes: 0,
    totalPlans: 0,
    completedPlans: 0,
    streak: 5,
    badges: [] as string[],
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
      setProfileData({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      const [questions, notes, plans] = await Promise.all([
        dbService.getUserQuestions(user.$id, 1000),
        dbService.getUserNotes(user.$id),
        dbService.getUserStudyPlans(user.$id),
      ]);

      const completedPlans = (plans.documents as any[]).filter(
        (p) => p.status === 'completed'
      ).length;

      // Calculate badges based on activity
      const badges: string[] = [];
      if (questions.total >= 10) badges.push('Curious Mind');
      if (questions.total >= 50) badges.push('Knowledge Seeker');
      if (questions.total >= 100) badges.push('Question Master');
      if (notes.total >= 20) badges.push('Note Taker');
      if (completedPlans >= 5) badges.push('Goal Achiever');
      if (stats.streak >= 7) badges.push('Week Warrior');
      if (stats.streak >= 30) badges.push('Monthly Master');

      setStats({
        totalQuestions: questions.total,
        totalNotes: notes.total,
        totalPlans: plans.total,
        completedPlans,
        streak: stats.streak,
        badges,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      await updateProfile({
        name: profileData.name,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const badgeColors = {
    'Curious Mind': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'Knowledge Seeker': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    'Question Master': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    'Note Taker': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    'Goal Achiever': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    'Week Warrior': 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    'Monthly Master': 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account and view your progress
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Card */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Profile Information</CardTitle>
                      {!isEditing ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveProfile}>
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setIsEditing(false);
                              setProfileData({
                                name: user?.name || '',
                                email: user?.email || '',
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1">
                        {isEditing ? (
                          <Input
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData({ ...profileData, name: e.target.value })
                            }
                            placeholder="Your name"
                          />
                        ) : (
                          <h2 className="text-2xl font-bold">{user?.name}</h2>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Mail className="h-5 w-5" />
                        <span>{user?.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                        <Calendar className="h-5 w-5" />
                        <span>
                          Joined {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold">{stats.totalQuestions}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Questions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-2xl font-bold">{stats.totalNotes}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">{stats.completedPlans}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <p className="text-2xl font-bold">{stats.streak}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Badges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Achievements & Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats.badges.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {stats.badges.map((badge, index) => (
                          <motion.div
                            key={badge}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`px-4 py-2 rounded-full font-medium ${
                              badgeColors[badge as keyof typeof badgeColors] || badgeColors['Curious Mind']
                            }`}
                          >
                            <Award className="h-4 w-4 inline mr-2" />
                            {badge}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">
                        Keep using StudyGenius to earn badges!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Actions & Settings */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Update Email
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>

                {/* Activity Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Total Study Plans
                      </span>
                      <span className="font-semibold">{stats.totalPlans}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Completion Rate
                      </span>
                      <span className="font-semibold">
                        {stats.totalPlans > 0
                          ? Math.round((stats.completedPlans / stats.totalPlans) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Active Badges
                      </span>
                      <span className="font-semibold">{stats.badges.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}
