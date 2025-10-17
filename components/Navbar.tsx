'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Sun, Moon, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface NavbarProps {
  onMenuClick: () => void;
  streak?: number;
  userName?: string;
}

export function Navbar({ onMenuClick, streak = 0, userName }: NavbarProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-6 w-6" />
          </Button>

          {userName && (
            <div className="hidden md:block">
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back,</p>
              <p className="font-semibold">{userName}!</p>
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Streak */}
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-100 dark:bg-orange-900/30"
            >
              <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="font-bold text-orange-600 dark:text-orange-400">{streak}</span>
              <span className="text-sm text-orange-600 dark:text-orange-400 hidden sm:inline">
                day streak
              </span>
            </motion.div>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}
