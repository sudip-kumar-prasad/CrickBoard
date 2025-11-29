# CrickBoard – Cricket Player Stats & Score Management App (Complete Build)

CrickBoard is a full–featured React Native + Expo application for cricket coaches, captains, and enthusiasts who want a lightweight way to manage squads, log matches, and view rich insights completely offline.

## Project Details

- **Student**: Sudip Kumar Prasad  
- **Roll Number**: 2024-B-01112005A  
- **Tech Stack**: React Native, Expo, React Navigation, React Native Paper, AsyncStorage, react-native-chart-kit

## Feature Highlights

1. **Player Management Suite**
   - Create, edit, and delete player profiles with role & team metadata
   - Detailed player dashboards with batting, bowling, and fielding metrics
   - Advanced analytics (strike rate, averages, economy, consistency)

2. **Match Engine & Auto Stat Updates**
   - Record fixtures with opponent, venue, result, and notes
   - Capture granular per-player performances (batting/bowling/fielding)
   - Player aggregates update automatically after every saved match

3. **Leaderboards & Insights**
   - Dedicated Insights tab with season snapshot, bar/line charts, and rankings
   - Quick-glance leaderboards for runs, wickets, and fielding impact
   - Recent-form timeline on every player profile

4. **Smart Search & Filters**
   - Role/Team filters, advanced sorting (runs/wickets/matches), and instant search
   - Refined player cards with key stats for rapid comparisons

5. **Offline-First Reliability**
   - All data stored locally via AsyncStorage
   - Works without internet connectivity; data persists across sessions

## Screens & Navigation

| Tab | Stack / Screen | Purpose |
| --- | -------------- | ------- |
| `Home` | `HomeScreen` | Dashboard, quick stats, last match, top performers |
| `Players` | `PlayersScreen` → `AddPlayerScreen` → `EditPlayerScreen` → `PlayerDetailScreen` | Manage roster, drill into individuals |
| `Matches` | `MatchesScreen` → `RecordMatchScreen` | Fixture log, record performances, auto-update stats |
| `Insights` | `InsightsScreen` | Visual analytics, leaderboards, performance charts |

## Project Structure

```
CrickBoard/
├── App.js                       # Navigation + theme setup
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── PlayersScreen.js
│   │   ├── AddPlayerScreen.js
│   │   ├── EditPlayerScreen.js
│   │   ├── PlayerDetailScreen.js
│   │   ├── MatchesScreen.js
│   │   ├── RecordMatchScreen.js
│   │   └── InsightsScreen.js
│   ├── utils/
│   │   ├── storage.js           # AsyncStorage helpers + match recorder
│   │   └── calculations.js      # Strike rate, averages, leader math
│   └── types/
│       └── index.js             # Factory helpers for data structures
├── assets/                      # Icons & splash screens
├── App.js / index.js            # Expo entry points
└── README.md
```

## Installation & Setup

```bash
# prerequisites
npm install -g @expo/cli

# install dependencies
cd CrickBoard
npm install

# run locally
npm start          # Expo Dev Tools
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web preview
```

## Using the App

### 1. Add Players
1. Open the **Players** tab  
2. Tap **+ Add Player**  
3. Fill out name, role, optional team, and save  

### 2. Record a Match
1. Go to the **Matches** tab and tap **Record Match**  
2. Enter fixture metadata (date, opponent, venue, result, notes)  
3. Add player performances (runs, wickets, catches, etc.)  
4. Save to automatically update player aggregates and log the match  

### 3. Explore Insights
1. Visit the **Insights** tab for charts and leaderboards  
2. Tap into any player to review advanced metrics, recent form graph, and detailed stats  

## Data & Calculations

- **StatsCalculator** provides:
  - Batting strike rate & averages
  - Bowling averages, economy, strike rates
  - Aggregations for leaderboards and charts
- **StorageService** ensures:
  - Players & matches persist via AsyncStorage
  - `recordMatch` updates player stats and prepends the new fixture

## UI / UX

- Modern dark palette with glassmorphism-inspired cards
- React Native Paper components for consistent look & feel
- Responsive layouts with large tap targets and contextual CTAs

## Quality Notes

- Entire codebase is JavaScript (no TypeScript tooling required)
- Modular screens + utility layers for maintainability
- Lint-ready and Expo-compatible with the latest React Native 0.81 stack

---

CrickBoard now represents a polished, end-to-end cricket management companion that satisfies the original specification and the previously deferred advanced requirements. Enjoy building winning lineups! 🎯🏏
