export enum AppStage {
  LANDING = 'LANDING',
  MATCHING = 'MATCHING',
  PLANNING = 'PLANNING',
  SPRINTING = 'SPRINTING',
  COMPLETED = 'COMPLETED',
  HISTORY = 'HISTORY'
}

export interface Message {
  id: string;
  sender: 'user' | 'buddy' | 'system';
  text: string;
  timestamp: number;
}

export interface Buddy {
  id: string;
  name: string;
  avatarUrl: string;
  personality: string;
}

export interface SprintSession {
  id: string;
  task: string;
  durationMinutes: number;
  completedAt: number;
  rewardImageUrl?: string;
  focusRating?: number;
}

export type TimerMode = 'work' | 'break';

export const BUDDY_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley'];
export const BUDDY_PERSONALITIES = [
  'Strict but fair. Keeps you on track.',
  'Encouraging and cheerful. Loves progress.',
  'Stoic and focused. Minimal distractions.',
  'Scientific and precise. Obsessed with efficiency.'
];
