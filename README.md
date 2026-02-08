# 🏏 CrickBoard - Complete Cricket Management App

**CrickBoard** is a comprehensive React Native mobile application for managing cricket teams, tracking player statistics, recording matches, organizing tournaments, and celebrating victories. Built with Expo, it provides an offline-first solution for cricket coaches, captains, and enthusiasts.

## 📱 Project Information

- **Developer**: Sudip Kumar Prasad  
- **Roll Number**: 2024-B-01112005A  
- **Tech Stack**: React Native, Expo, React Navigation, React Native Paper, AsyncStorage, react-native-chart-kit
- **Platform**: iOS & Android

---

## ✨ Key Features

### 1. **🔐 Authentication System**
- Secure user registration and login
- Profile management with avatar upload
- Persistent authentication state
- Logout functionality

### 2. **👥 Player Management**
- Add, edit, and delete player profiles
- Role-based categorization (Batsman, Bowler, All-rounder, Wicket-keeper)
- Team assignment and organization
- Detailed player statistics dashboard
- Advanced metrics (strike rate, batting average, economy rate)

### 3. **🏆 Match Recording**
- Record complete match details (date, opponent, venue, result)
- Capture individual player performances:
  - Batting: runs, balls, fours, sixes
  - Bowling: overs, maidens, runs conceded, wickets
  - Fielding: catches, stumpings, run-outs
- Automatic stat aggregation and player profile updates
- Match history with detailed scorecards
- Add match photos and notes

### 4. **🏅 Tournament Management**
- Create and manage cricket tournaments
- Track tournament progress and standings
- View tournament details and statistics
- Organize multiple teams and matches within tournaments

### 5. **📊 Insights & Analytics**
- Visual dashboards with charts and graphs
- Season statistics overview
- Leaderboards (top run scorers, wicket takers, fielders)
- Performance trends and comparisons
- Player-wise analytics

### 6. **🎉 Victory Wall (Community)**
- Social feed for celebrating match wins
- Post victory photos with captions
- Camera and gallery integration
- Delete unwanted celebration posts
- Victory timeline

### 7. **👤 User Profile**
- Editable profile with photo upload
- Account details and member information
- App information and settings
- Logout option

### 8. **⚙️ Settings & Customization**
- App preferences and configurations
- Theme customization support
- App version and developer information

---

## 🗂️ App Structure

### Navigation
The app uses a **hybrid navigation system** combining:
- **Bottom Tabs** (3 main tabs): Home, Matches, Community
- **Side Drawer** (additional features): Players, Insights, Tournaments, Settings, Profile

#### Bottom Navigation (Always Visible)
| Tab | Screen | Description |
|-----|--------|-------------|
| **Home** | `HomeScreen` | Dashboard with quick stats, recent match, and top performers |
| **Matches** | `MatchesStack` | Match history, record new matches, view match details |
| **Community** | `VictoryFeedScreen` | Victory Wall - celebrate and share wins |

#### Drawer Navigation (Side Menu)
| Menu Item | Stack | Description |
|-----------|-------|-------------|
| **Players** | `PlayersStack` | Player roster, add/edit/view player details |
| **Insights** | `InsightsStack` | Analytics, leaderboards, and performance charts |
| **Tournaments** | `TournamentStack` | Create and manage tournaments |
| **Settings** | `SettingsStack` | App preferences and configurations |
| **Profile** | `ProfileStack` | User profile, account settings, logout |

### Project Structure

```
CrickBoard/
├── App.js                          # Main navigation and theme setup
├── index.js                        # Entry point
├── app.json                        # Expo configuration
├── babel.config.js                 # Babel configuration
├── package.json                    # Dependencies
├── assets/                         # App icons and images
└── src/
    ├── components/
    │   └── CustomDrawer.js         # Custom drawer navigation component
    ├── context/
    │   └── ThemeContext.js         # Theme management context
    ├── screens/
    │   ├── HomeScreen.js           # Dashboard
    │   ├── LoginScreen.js          # Authentication
    │   ├── ProfileScreen.js        # User profile & settings
    │   ├── PlayersScreen.js        # Player list with filters
    │   ├── AddPlayerScreen.js      # Create new player
    │   ├── EditPlayerScreen.js     # Edit player details
    │   ├── PlayerDetailScreen.js   # Player stats & analytics
    │   ├── MatchesScreen.js        # Match history
    │   ├── RecordMatchScreen.js    # Record match details
    │   ├── MatchDetailScreen.js    # Match scorecard
    │   ├── InsightsScreen.js       # Analytics dashboard
    │   ├── VictoryFeedScreen.js    # Victory Wall
    │   ├── TournamentScreen.js     # Tournament list
    │   ├── CreateTournamentScreen.js # Create new tournament
    │   ├── TournamentDetailScreen.js # Tournament details
    │   └── SettingsScreen.js       # App settings
    └── utils/
        ├── auth.js                 # Authentication utilities
        ├── storage.js              # AsyncStorage data management
        └── calculations.js         # Stats calculations
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on physical device)

### Installation

```bash
# Install Expo CLI globally (if not already installed)
npm install -g expo-cli

# Clone the repository
cd CrickBoard

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Device

1. **iOS/Android Simulator**:
   ```bash
   npm run ios       # iOS simulator
   npm run android   # Android emulator
   npm run web       # Web browser
   ```

2. **Physical Device**:
   - Install **Expo Go** from App Store (iOS) or Play Store (Android)
   - Scan the QR code from the terminal
   - App will load on your device

---

## 📖 How to Use

### Initial Setup
1. **Create an Account**: Register with name, email, and password
2. **Login**: Sign in with your credentials

### Managing Players
1. Open the **side drawer** (tap menu icon)
2. Navigate to **Players**
3. Tap **+ Add Player**
4. Enter player details (name, role, team)
5. Tap on any player to view detailed statistics

### Recording Matches
1. Go to **Matches** tab from bottom navigation
2. Tap **Record Match**
3. Fill in match details (opponent, venue, date)
4. Add player performances
5. Save - stats update automatically!

### Managing Tournaments
1. Open the **side drawer**
2. Navigate to **Tournaments**
3. Tap **+ Create Tournament**
4. Enter tournament details
5. Track progress and view standings

### Celebrating Victories
1. Open **Community** tab from bottom navigation
2. Tap **+** to add a celebration
3. Choose photo from camera/gallery
4. Add caption and publish
5. View all team victories in one place

### Viewing Analytics
1. Open the **side drawer**
2. Navigate to **Insights**
3. View charts, leaderboards, and statistics
4. Tap on any player for detailed analytics

---

## 🎨 UI/UX Design

- **Dark Theme**: Modern dark color scheme with vibrant accents
- **Glassmorphism**: Premium card designs with elevation
- **Responsive**: Optimized for both phones and tablets
- **Intuitive**: Clear navigation with drawer + tabs hybrid system
- **Smooth Animations**: Polished user experience
- **Custom Components**: Beautifully designed custom drawer

### Color Palette
- Primary: `#1e40af` (Blue)
- Secondary: `#10b981` (Green)
- Success: `#22c55e` (Victory Green)
- Background: `#0f172a` (Dark Navy)
- Surface: `#1e293b` (Dark Gray)

---

## 📦 Dependencies

```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/bottom-tabs": "^7.4.7",
  "@react-navigation/native": "^7.1.17",
  "@react-navigation/stack": "^7.4.8",
  "expo": "~54.0.33",
  "expo-image-picker": "~17.0.10",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-chart-kit": "^6.12.0",
  "react-native-paper": "^5.14.5",
  "react-native-safe-area-context": "^5.6.1",
  "react-native-screens": "^4.16.0",
  "react-native-svg": "^15.12.1",
  "react-native-vector-icons": "^10.3.0"
}
```

---

## 🔧 Technical Highlights

### Navigation Architecture
- **Hybrid Navigation**: Combines Bottom Tabs with Drawer for optimal UX
- **Stack Navigators**: Each feature area has its own stack for deep navigation
- **Custom Drawer**: Beautifully designed side menu with smooth animations

### Theme Management
- **ThemeContext**: Centralized theme management using React Context
- **Consistent Theming**: All components use the same theme values
- **Easy Customization**: Change app-wide theme from a single location

### Data Management
- **AsyncStorage**: All data stored locally for offline functionality
- **Persistent State**: Data survives app restarts
- **Auto-sync**: Player stats update automatically after matches
- **Efficient Storage**: Optimized data structure for quick access

### Calculations
- **Strike Rate**: (Runs / Balls) × 100
- **Batting Average**: Runs / Matches
- **Economy Rate**: Runs Conceded / Overs
- **Bowling Average**: Runs Conceded / Wickets

### Image Handling
- Camera integration with permissions
- Gallery picker for photos
- Image compression for optimal storage
- Profile avatars and match photos

---

## 🐛 Known Issues & Solutions

### Issue: Camera not working
**Solution**: Make sure camera permissions are granted in device settings

### Issue: App crashes on startup
**Solution**: Clear app data and restart:
```bash
npm start --clear
```

### Issue: Navigation issues
**Solution**: Clear cache and reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🚦 Future Enhancements

- ☐ Cloud backup and sync
- ☐ Multi-team management
- ☐ Live match scoring
- ☐ Export stats to PDF
- ☐ Light theme variant
- ☐ Social sharing features
- ☐ Push notifications for matches
- ☐ Player comparison tool
- ☐ Advanced tournament formats (knockout, league, etc.)

---

## 📄 License

This project is created for educational purposes as part of a college assignment.

---

## 👨‍💻 Developer

**Sudip Kumar Prasad**  
Roll Number: 2024-B-01112005A

---

## 🙏 Acknowledgments

- **React Native Community**: For excellent documentation
- **Expo Team**: For the amazing development platform
- **React Native Paper**: For beautiful UI components
- **react-native-chart-kit**: For stunning data visualizations

---

**Built with ❤️ and ☕ for cricket enthusiasts everywhere! 🏏**
