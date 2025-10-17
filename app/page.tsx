'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Target, BookOpen, Zap, Users } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Answers',
      description: 'Get instant, accurate explanations for any subject with step-by-step solutions.',
    },
    {
      icon: Sparkles,
      title: 'Visual Learning',
      description: 'Concepts come alive with AI-generated diagrams, graphs, and visual aids.',
    },
    {
      icon: Target,
      title: 'Smart Study Plans',
      description: 'Personalized study schedules and goals tailored to your learning pace.',
    },
    {
      icon: BookOpen,
      title: 'Notes & Flashcards',
      description: 'Convert answers into organized notes and interactive flashcards automatically.',
    },
    {
      icon: Zap,
      title: 'Quick or Detailed',
      description: 'Choose between quick answers or comprehensive explanations based on your needs.',
    },
    {
      icon: Users,
      title: 'Track Progress',
      description: 'Monitor your learning journey with streaks, badges, and weekly reports.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-2xl">
              SG
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              StudyGenius
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
            Your AI-Powered Study Companion
          </p>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Get instant answers to your doubts, create study plans, generate flashcards, and track your progress — all powered by advanced AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => router.push('/auth/signup')}
              className="text-lg px-8 py-6"
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/auth/signin')}
              className="text-lg px-8 py-6"
            >
              Sign In
            </Button>
          </div>

          {/* Demo Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700"
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Powered by Gemini AI • 100% Free
            </span>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need to Excel
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-24 text-center"
        >
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Questions Solved
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Active Students
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Satisfaction Rate
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
