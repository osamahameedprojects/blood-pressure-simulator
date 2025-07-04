import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  UserProgress, 
  ScenarioProgress, 
  Badge, 
  AttemptRecord, 
  ScenarioKey,
  SCENARIO_UNLOCK_REQUIREMENTS,
  ACCURACY_TOLERANCE 
} from '../types/user';

interface UserContextType {
  user: User | null;
  userProgress: UserProgress | null;
  isAuthenticated: boolean;
  signup: (email: string, name: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  recordAttempt: (
    scenarioKey: ScenarioKey,
    trueSystolic: number,
    trueDiastolic: number,
    userSystolic: number,
    userDiastolic: number
  ) => { accuracy: number; isCorrect: boolean; newBadges: Badge[] };
  checkScenarioUnlocked: (scenarioKey: ScenarioKey) => boolean;
  getScenarioProgress: (scenarioKey: ScenarioKey) => ScenarioProgress | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'bp_simulator_users';
const CURRENT_USER_KEY = 'bp_simulator_current_user';

// Default scenario progress
const createDefaultScenarioProgress = (): ScenarioProgress[] => [
  {
    scenarioKey: 'healthy',
    scenarioName: 'Healthy Adult',
    attempts: 0,
    correctAttempts: 0,
    averageAccuracy: 0,
    bestAccuracy: 0,
    unlocked: true,
    completed: false,
  },
  {
    scenarioKey: 'hypertensive',
    scenarioName: 'Hypertensive',
    attempts: 0,
    correctAttempts: 0,
    averageAccuracy: 0,
    bestAccuracy: 0,
    unlocked: false,
    completed: false,
  },
  {
    scenarioKey: 'arrhythmic',
    scenarioName: 'Arrhythmic',
    attempts: 0,
    correctAttempts: 0,
    averageAccuracy: 0,
    bestAccuracy: 0,
    unlocked: false,
    completed: false,
  },
];

// Badge definitions
const AVAILABLE_BADGES: Omit<Badge, 'earnedAt'>[] = [
  {
    id: 'first_success',
    name: 'First Success',
    description: 'Complete your first measurement successfully',
    icon: '🎯',
    criteria: 'Complete 1 correct measurement',
  },
  {
    id: 'accuracy_ace',
    name: 'Accuracy Ace',
    description: 'Unlock the next scenario level',
    icon: '🏆',
    criteria: 'Complete 5 correct measurements',
  },
  {
    id: 'hypertension_hero',
    name: 'Hypertension Hero',
    description: 'Master the hypertensive scenario',
    icon: '💪',
    criteria: 'Unlock arrhythmic scenario',
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Achieve a 5-measurement winning streak',
    icon: '🔥',
    criteria: 'Get 5 correct measurements in a row',
  },
  {
    id: 'precision_expert',
    name: 'Precision Expert',
    description: 'Achieve 95%+ accuracy over 10 attempts',
    icon: '⭐',
    criteria: 'Maintain 95%+ accuracy over 10 attempts',
  },
];

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUserId) {
      const users = getUsersFromStorage();
      const userData = users[currentUserId];
      if (userData) {
        setUser(userData.user);
        setUserProgress(userData);
      }
    }
  }, []);

  const getUsersFromStorage = (): Record<string, UserProgress> => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  };

  const saveUserToStorage = (userProgress: UserProgress) => {
    const users = getUsersFromStorage();
    users[userProgress.user.id] = userProgress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  };

  const generateUserId = (email: string): string => {
    return email.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now();
  };

  const signup = async (email: string, name: string, password: string): Promise<boolean> => {
    try {
      const users = getUsersFromStorage();
      
      // Check if email already exists
      const existingUser = Object.values(users).find(u => u.user.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return false; // Email already exists
      }

      const userId = generateUserId(email);
      const now = new Date().toISOString();
      
      const newUser: User = {
        id: userId,
        email: email.toLowerCase(),
        name,
        password, // In production, this would be hashed
        createdAt: now,
        lastLogin: now,
      };

      const newUserProgress: UserProgress = {
        user: newUser,
        scenarios: createDefaultScenarioProgress(),
        badges: [],
        attempts: [],
        totalAttempts: 0,
        totalCorrect: 0,
        overallAccuracy: 0,
        currentStreak: 0,
        bestStreak: 0,
        level: 0,
        experience: 0,
      };

      saveUserToStorage(newUserProgress);
      localStorage.setItem(CURRENT_USER_KEY, userId);
      
      setUser(newUser);
      setUserProgress(newUserProgress);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = getUsersFromStorage();
      const userData = Object.values(users).find(u => u.user.email.toLowerCase() === email.toLowerCase());
      
      if (!userData) {
        return false; // User not found
      }

      // Check password
      if (userData.user.password !== password) {
        return false; // Invalid password
      }

      // Update last login
      userData.user.lastLogin = new Date().toISOString();
      saveUserToStorage(userData);
      localStorage.setItem(CURRENT_USER_KEY, userData.user.id);
      
      setUser(userData.user);
      setUserProgress(userData);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setUser(null);
    setUserProgress(null);
  };

  const calculateAccuracy = (systolicError: number, diastolicError: number): number => {
    const maxError = 50; // Maximum possible error for scaling
    const avgError = (systolicError + diastolicError) / 2;
    return Math.max(0, Math.round(100 - (avgError / maxError) * 100));
  };

  const checkForNewBadges = (updatedProgress: UserProgress): Badge[] => {
    const newBadges: Badge[] = [];
    const now = new Date().toISOString();

    AVAILABLE_BADGES.forEach(badgeTemplate => {
      // Check if badge already earned
      const alreadyEarned = updatedProgress.badges.some(b => b.id === badgeTemplate.id);
      if (alreadyEarned) return;

      let shouldEarn = false;

      switch (badgeTemplate.id) {
        case 'first_success':
          shouldEarn = updatedProgress.totalCorrect >= 1;
          break;
        case 'accuracy_ace':
          shouldEarn = updatedProgress.totalCorrect >= 5;
          break;
        case 'hypertension_hero':
          shouldEarn = updatedProgress.totalCorrect >= 10;
          break;
        case 'streak_master':
          shouldEarn = updatedProgress.currentStreak >= 5;
          break;
        case 'precision_expert':
          shouldEarn = updatedProgress.totalAttempts >= 10 && updatedProgress.overallAccuracy >= 95;
          break;
      }

      if (shouldEarn) {
        newBadges.push({
          ...badgeTemplate,
          earnedAt: now,
        });
      }
    });

    return newBadges;
  };

  const updateScenarioUnlocks = (progress: UserProgress): UserProgress => {
    const updated = { ...progress };
    
    updated.scenarios = updated.scenarios.map(scenario => {
      const requirements = SCENARIO_UNLOCK_REQUIREMENTS[scenario.scenarioKey as ScenarioKey];
      
      if (!scenario.unlocked && progress.totalCorrect >= requirements.requiredCorrect) {
        return { ...scenario, unlocked: true };
      }
      
      return scenario;
    });

    return updated;
  };

  const recordAttempt = (
    scenarioKey: ScenarioKey,
    trueSystolic: number,
    trueDiastolic: number,
    userSystolic: number,
    userDiastolic: number
  ) => {
    if (!userProgress) throw new Error('No user logged in');

    const systolicError = Math.abs(trueSystolic - userSystolic);
    const diastolicError = Math.abs(trueDiastolic - userDiastolic);
    const averageError = (systolicError + diastolicError) / 2;
    const accuracy = calculateAccuracy(systolicError, diastolicError);
    const isCorrect = systolicError <= ACCURACY_TOLERANCE && diastolicError <= ACCURACY_TOLERANCE;

    const attemptRecord: AttemptRecord = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      scenarioKey,
      timestamp: new Date().toISOString(),
      trueSystolic,
      trueDiastolic,
      userSystolic,
      userDiastolic,
      systolicError,
      diastolicError,
      averageError,
      accuracy,
      isCorrect,
    };

    let updatedProgress = { ...userProgress };
    
    // Update attempts
    updatedProgress.attempts = [...updatedProgress.attempts, attemptRecord];
    updatedProgress.totalAttempts += 1;
    
    if (isCorrect) {
      updatedProgress.totalCorrect += 1;
      updatedProgress.currentStreak += 1;
      updatedProgress.bestStreak = Math.max(updatedProgress.bestStreak, updatedProgress.currentStreak);
    } else {
      updatedProgress.currentStreak = 0;
    }

    // Update overall accuracy
    updatedProgress.overallAccuracy = Math.round((updatedProgress.totalCorrect / updatedProgress.totalAttempts) * 100);
    
    // Update experience and level
    updatedProgress.experience += isCorrect ? 50 : 10;
    updatedProgress.level = Math.floor(updatedProgress.experience / 100);

    // Update scenario progress
    updatedProgress.scenarios = updatedProgress.scenarios.map(scenario => {
      if (scenario.scenarioKey === scenarioKey) {
        const newAttempts = scenario.attempts + 1;
        const newCorrect = scenario.correctAttempts + (isCorrect ? 1 : 0);
        const scenarioAttempts = updatedProgress.attempts.filter(a => a.scenarioKey === scenarioKey);
        const scenarioAccuracies = scenarioAttempts.map(a => a.accuracy);
        const avgAccuracy = scenarioAccuracies.length > 0 
          ? Math.round(scenarioAccuracies.reduce((sum, acc) => sum + acc, 0) / scenarioAccuracies.length)
          : 0;
        
        const updated = {
          ...scenario,
          attempts: newAttempts,
          correctAttempts: newCorrect,
          averageAccuracy: avgAccuracy,
          bestAccuracy: Math.max(scenario.bestAccuracy, accuracy),
        };

        // Check if scenario is completed (5+ correct attempts)
        if (newCorrect >= 5 && !updated.completed) {
          updated.completed = true;
          updated.completedAt = new Date().toISOString();
        }

        return updated;
      }
      return scenario;
    });

    // Update scenario unlocks
    updatedProgress = updateScenarioUnlocks(updatedProgress);

    // Check for new badges
    const newBadges = checkForNewBadges(updatedProgress);
    updatedProgress.badges = [...updatedProgress.badges, ...newBadges];

    // Save to storage
    saveUserToStorage(updatedProgress);
    setUserProgress(updatedProgress);

    return { accuracy, isCorrect, newBadges };
  };

  const checkScenarioUnlocked = (scenarioKey: ScenarioKey): boolean => {
    if (!userProgress) return false;
    const scenario = userProgress.scenarios.find(s => s.scenarioKey === scenarioKey);
    return scenario?.unlocked || false;
  };

  const getScenarioProgress = (scenarioKey: ScenarioKey): ScenarioProgress | undefined => {
    if (!userProgress) return undefined;
    return userProgress.scenarios.find(s => s.scenarioKey === scenarioKey);
  };

  const value: UserContextType = {
    user,
    userProgress,
    isAuthenticated: !!user,
    signup,
    login,
    logout,
    recordAttempt,
    checkScenarioUnlocked,
    getScenarioProgress,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 