export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
  lastLogin: string;
}

export interface ScenarioProgress {
  scenarioKey: string;
  scenarioName: string;
  attempts: number;
  correctAttempts: number;
  averageAccuracy: number;
  bestAccuracy: number;
  unlocked: boolean;
  completed: boolean;
  completedAt?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  criteria: string;
}

export interface AttemptRecord {
  id: string;
  scenarioKey: string;
  timestamp: string;
  trueSystolic: number;
  trueDiastolic: number;
  userSystolic: number;
  userDiastolic: number;
  systolicError: number;
  diastolicError: number;
  averageError: number;
  accuracy: number;
  isCorrect: boolean; // Within ±5 mmHg tolerance
}

export interface UserProgress {
  user: User;
  scenarios: ScenarioProgress[];
  badges: Badge[];
  attempts: AttemptRecord[];
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
  currentStreak: number;
  bestStreak: number;
  level: number;
  experience: number;
}

export type ScenarioKey = 'healthy' | 'hypertensive' | 'arrhythmic';

export const SCENARIO_UNLOCK_REQUIREMENTS = {
  healthy: { requiredCorrect: 0, requiredLevel: 0 }, // Always unlocked
  hypertensive: { requiredCorrect: 5, requiredLevel: 1 },
  arrhythmic: { requiredCorrect: 10, requiredLevel: 2 }
} as const;

export const ACCURACY_TOLERANCE = 5; // ±5 mmHg for "correct" answer 