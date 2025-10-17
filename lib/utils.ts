import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function calculateStreak(lastActivityDate: Date | string, currentDate: Date = new Date()): number {
  const last = typeof lastActivityDate === 'string' ? new Date(lastActivityDate) : lastActivityDate;
  const diffTime = Math.abs(currentDate.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= 1 ? 1 : 0;
}

export function getMotivationalMessage(streak: number): string {
  if (streak === 0) return "Let's start your learning journey! 🚀";
  if (streak < 7) return `${streak} day streak! Keep going! 💪`;
  if (streak < 30) return `Amazing ${streak} day streak! You're unstoppable! 🔥`;
  return `Legendary ${streak} day streak! You're a true scholar! 🏆`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
