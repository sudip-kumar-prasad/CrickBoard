# CrickBoard - Cricket Player Stats & Score Management App (50% Complete)

A simplified React Native mobile application for basic cricket player management. Built with Expo and JavaScript.

## Project Details

- **Student**: Sudip Kumar Prasad
- **Roll Number**: 2024-B-01112005A
- **Technology Stack**: React Native, Expo, JavaScript

## Features

### ✅ Implemented Features (50% Complete)

1. **Basic Player Management**
   - Add, edit, and delete player profiles
   - Player roles: Batsman, Bowler, All-rounder, Wicket-keeper
   - Team assignment for players
   - Basic player statistics tracking

2. **Simple Statistics**
   - Basic stats: Matches, runs, wickets, catches
   - Simple data display without complex calculations

3. **Basic Search**
   - Simple search by player name
   - Basic player list functionality

4. **Data Persistence**
   - Local storage using AsyncStorage
   - No internet connection required
   - Data persists across app sessions

### ❌ Removed Features (For 50% Completion)
- Advanced statistics calculations
- Leaderboards and rankings
- Match management system
- Complex filtering by role
- Advanced search functionality

## Project Structure

```
CrickBoard/
├── App.js                          # Main app component with simplified navigation
├── src/
│   ├── components/                 # Reusable UI components
│   ├── screens/                    # App screens (simplified)
│   │   ├── HomeScreen.js          # Dashboard with basic actions
│   │   ├── PlayersScreen.js       # Player list with simple search
│   │   ├── AddPlayerScreen.js     # Add new player
│   │   ├── EditPlayerScreen.js    # Edit player details
│   │   └── PlayerDetailScreen.js  # Basic player statistics view
│   ├── utils/                     # Utility functions (simplified)
│   │   ├── storage.js             # AsyncStorage operations
│   │   └── calculations.js        # Basic calculations only
│   ├── types/                     # Data structure helpers
│   │   └── index.js               # Object creation functions
│   └── data/                      # Sample data (if needed)
└── README.md                      # Project documentation
```

## Installation & Setup

1. **Prerequisites**
   - Node.js (v14 or higher)
   - npm or yarn
   - Expo CLI: `npm install -g @expo/cli`

2. **Install Dependencies**
   ```bash
   cd CrickBoard
   npm install
   ```

3. **Run the App**
   ```bash
   # Start the development server
   npm start
   
   # Run on iOS simulator
   npm run ios
   
   # Run on Android emulator
   npm run android
   
   # Run on web browser
   npm run web
   ```

## Usage

### Getting Started
1. Launch the app
2. Add your first player from the Home screen
3. View player details and basic statistics

### Adding Players
1. Navigate to Players tab
2. Tap "Add Player"
3. Enter player name, select role, and optionally add team
4. Save to create the player profile

### Viewing Statistics
1. Go to Players tab
2. Tap on any player to view basic statistics
3. See simple stats: matches, runs, wickets, catches

## Technical Implementation

### Data Storage
- Uses AsyncStorage for local data persistence
- No external database required
- Data stored as JSON objects

### Navigation
- React Navigation v6
- Bottom tab navigation (simplified to 2 tabs)
- Stack navigation for player management

### State Management
- React hooks (useState, useEffect, useCallback)
- Local state management for each screen
- AsyncStorage for data persistence

### UI/UX Design
- Modern dark theme with blue accents
- Responsive design for different screen sizes
- Simple navigation and user interactions
- Basic loading states and error handling

## Future Enhancements (For 100% Completion)

### Planned Features
- [ ] Advanced statistics calculations
- [ ] Leaderboards and rankings
- [ ] Match management system
- [ ] Player performance graphs
- [ ] Export statistics to PDF/Excel
- [ ] Team management and tournaments
- [ ] Cloud sync with Firebase
- [ ] Advanced analytics and insights

### Technical Improvements
- [ ] Add unit tests
- [ ] Implement offline-first architecture
- [ ] Add data backup/restore functionality
- [ ] Performance optimizations
- [ ] Accessibility improvements

## Dependencies

### Core Dependencies
- `expo`: React Native framework
- `@react-navigation/native`: Navigation library
- `@react-navigation/stack`: Stack navigator
- `@react-navigation/bottom-tabs`: Tab navigator
- `@react-native-async-storage/async-storage`: Local storage
- `react-native-screens`: Screen optimization
- `react-native-safe-area-context`: Safe area handling

### Development Dependencies
- `@expo/cli`: Expo command line tools
- `expo-status-bar`: Status bar component

## Contributing

This is a student project for academic purposes. For suggestions or improvements, please contact the developer.

## License

This project is created for educational purposes as part of academic coursework.

---

**Note**: This is a simplified version (50% complete) of the CrickBoard app. It provides basic player management functionality without advanced features like match tracking, leaderboards, or complex statistics calculations.