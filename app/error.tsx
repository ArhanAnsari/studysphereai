'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error Icon Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8"
          >
            <div className="inline-block relative">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-32 h-32 mx-auto bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl"
              >
                <AlertTriangle className="h-16 w-16 text-white" />
              </motion.div>

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-red-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [0, (Math.cos((i * Math.PI) / 3) * 100)],
                    y: [0, (Math.sin((i * Math.PI) / 3) * 100)],
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Oops! Something Went Wrong
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-4">
              Don't worry, even the best students make mistakes!
            </p>
            
            {error.digest && (
              <p className="text-sm text-gray-500 dark:text-gray-500 font-mono bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg inline-block">
                Error ID: {error.digest}
              </p>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" onClick={reset} className="w-full sm:w-auto">
              <RefreshCw className="h-5 w-5 mr-2" />
              Try Again
            </Button>
            
            <Link href="/">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </motion.div>

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400">
              If the problem persists, please try:
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-xl mx-auto">
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="font-semibold mb-1 text-sm">🔄 Refresh</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Reload the page
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="font-semibold mb-1 text-sm">🗑️ Clear Cache</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Clear browser data
                </p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <p className="font-semibold mb-1 text-sm">📧 Contact Us</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Report the issue
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
