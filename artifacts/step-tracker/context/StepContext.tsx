import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  xpReward: number;
}

export interface DailyData {
  date: string;
  steps: number;
  calories: number;
  distance: number;
  activeMinutes: number;
}

interface StepContextValue {
  todaySteps: number;
  todayGoal: number;
  calories: number;
  distance: number;
  activeMinutes: number;
  weeklyData: DailyData[];
  monthlyData: DailyData[];
  achievements: Achievement[];
  streak: number;
  xp: number;
  level: number;
  sessionActive: boolean;
  sessionSteps: number;
  sessionSeconds: number;
  userProfile: UserProfile;
  addSteps: (n: number) => void;
  startSession: () => void;
  stopSession: () => void;
  updateGoal: (goal: number) => void;
  updateProfile: (p: Partial<UserProfile>) => void;
}

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  avatarColor: string;
  memberSince: string;
  isPremium: boolean;
}

const MOCK_WEEKLY: DailyData[] = [
  { date: "Mon", steps: 8432, calories: 412, distance: 6.2, activeMinutes: 64 },
  { date: "Tue", steps: 5210, calories: 253, distance: 3.8, activeMinutes: 41 },
  { date: "Wed", steps: 9876, calories: 481, distance: 7.2, activeMinutes: 78 },
  { date: "Thu", steps: 7654, calories: 372, distance: 5.6, activeMinutes: 61 },
  { date: "Fri", steps: 6543, calories: 318, distance: 4.8, activeMinutes: 52 },
  { date: "Sat", steps: 11200, calories: 545, distance: 8.2, activeMinutes: 92 },
  { date: "Sun", steps: 4321, calories: 210, distance: 3.2, activeMinutes: 35 },
];

const MOCK_MONTHLY: DailyData[] = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}`,
  steps: Math.floor(5000 + Math.random() * 7000),
  calories: Math.floor(240 + Math.random() * 300),
  distance: parseFloat((3.5 + Math.random() * 5).toFixed(1)),
  activeMinutes: Math.floor(35 + Math.random() * 60),
}));

const ACHIEVEMENTS: Achievement[] = [
  { id: "1", title: "First Steps", description: "Log your first 1,000 steps", icon: "footsteps-outline", unlocked: true, xpReward: 50 },
  { id: "2", title: "Early Bird", description: "Walk before 7am", icon: "sunny-outline", unlocked: true, xpReward: 75 },
  { id: "3", title: "Goal Crusher", description: "Hit daily goal 3 days in a row", icon: "trophy-outline", unlocked: true, xpReward: 150 },
  { id: "4", title: "10K Club", description: "Walk 10,000 steps in one day", icon: "ribbon-outline", unlocked: true, xpReward: 200 },
  { id: "5", title: "Marathon Week", description: "Walk 70,000 steps in one week", icon: "medal-outline", unlocked: false, xpReward: 500 },
  { id: "6", title: "Iron Walker", description: "Maintain a 30-day streak", icon: "flame-outline", unlocked: false, xpReward: 1000 },
  { id: "7", title: "Speed Demon", description: "Walk at 5km/h pace for 30 min", icon: "flash-outline", unlocked: false, xpReward: 300 },
  { id: "8", title: "Night Owl", description: "Walk 5,000 steps after 9pm", icon: "moon-outline", unlocked: false, xpReward: 100 },
];

const StepContext = createContext<StepContextValue | null>(null);

export function StepProvider({ children }: { children: React.ReactNode }) {
  const [todaySteps, setTodaySteps] = useState(6543);
  const [todayGoal, setTodayGoal] = useState(10000);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionSteps, setSessionSteps] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Alex Johnson",
    age: 28,
    height: 175,
    weight: 72,
    avatarColor: "#2563EB",
    memberSince: "Jan 2024",
    isPremium: false,
  });

  const calories = Math.round(todaySteps * 0.05);
  const distance = parseFloat((todaySteps * 0.0008).toFixed(2));
  const activeMinutes = Math.round(todaySteps / 120);
  const xp = 1250 + Math.round(todaySteps / 10);
  const level = Math.floor(xp / 500) + 1;
  const streak = 7;

  useEffect(() => {
    AsyncStorage.getItem("stepGoal").then((v) => {
      if (v) setTodayGoal(parseInt(v));
    });
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (sessionActive) {
      interval = setInterval(() => {
        setSessionSeconds((s) => s + 1);
        if (Math.random() < 0.6) {
          setSessionSteps((s) => s + 1);
          setTodaySteps((s) => s + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionActive]);

  const addSteps = useCallback((n: number) => {
    setTodaySteps((s) => s + n);
  }, []);

  const startSession = useCallback(() => {
    setSessionActive(true);
    setSessionSteps(0);
    setSessionSeconds(0);
  }, []);

  const stopSession = useCallback(() => {
    setSessionActive(false);
  }, []);

  const updateGoal = useCallback((goal: number) => {
    setTodayGoal(goal);
    AsyncStorage.setItem("stepGoal", String(goal));
  }, []);

  const updateProfile = useCallback((p: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...p }));
  }, []);

  return (
    <StepContext.Provider
      value={{
        todaySteps,
        todayGoal,
        calories,
        distance,
        activeMinutes,
        weeklyData: MOCK_WEEKLY,
        monthlyData: MOCK_MONTHLY,
        achievements: ACHIEVEMENTS,
        streak,
        xp,
        level,
        sessionActive,
        sessionSteps,
        sessionSeconds,
        userProfile,
        addSteps,
        startSession,
        stopSession,
        updateGoal,
        updateProfile,
      }}
    >
      {children}
    </StepContext.Provider>
  );
}

export function useSteps() {
  const ctx = useContext(StepContext);
  if (!ctx) throw new Error("useSteps must be used within StepProvider");
  return ctx;
}
