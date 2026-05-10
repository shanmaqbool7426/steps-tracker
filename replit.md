# StepX - Step Tracker

A premium futuristic step tracker & pedometer mobile app with glassmorphism cards, animated progress rings, and a full health dashboard.

## Run & Operate

- `pnpm --filter @workspace/step-tracker run dev` — run the Expo dev server
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo + React Native, Expo Router
- Animations: react-native-reanimated
- Charts: react-native-svg (custom animated bar chart + circular progress)
- Gradients: expo-linear-gradient
- State: React Context + AsyncStorage
- Fonts: @expo-google-fonts/inter (400/500/600/700)

## Where things live

- `artifacts/step-tracker/` — Expo mobile app
- `artifacts/step-tracker/context/StepContext.tsx` — global step state, session, achievements
- `artifacts/step-tracker/components/` — CircularProgress, BarChart, GlassCard, StatCard
- `artifacts/step-tracker/app/(tabs)/` — 5 tab screens: index, analytics, goals, session, profile
- `artifacts/step-tracker/constants/colors.ts` — design tokens (blue/white theme)

## Product

StepX is a premium health tracking app with:
- Animated circular step ring with gradient SVG
- 5 screens: Home Dashboard, Analytics, Goals & Achievements, Walking Session, Profile
- XP/level system with achievement badges
- Real-time walking session with live metrics (steps, pace, distance, calories)
- BMI calculator and body stats
- Premium subscription card
- Weekly/monthly analytics with bar charts

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- react-native-svg v^15 — use AnimatedCircle via `Animated.createAnimatedComponent(Circle)`
- expo-sensors (Pedometer) has no web support — use mock/simulated step data on web
- react-native-maps pinned to exactly 1.18.0 if used; skipped in this build (simulated route instead)
- fontFamily like "Inter_700Bold" works on native; web falls back to system font gracefully
- Session screen uses dark navy gradient background (different from other screens)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
