// Player data structure
export const createPlayer = (id, name, role, team, stats, createdAt, updatedAt) => ({
  id,
  name,
  role,
  team,
  stats,
  createdAt,
  updatedAt,
});

// Player statistics structure
export const createPlayerStats = () => ({
  matches: 0,
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  wickets: 0,
  overs: 0,
  runsConceded: 0,
  maidens: 0,
  catches: 0,
  stumpings: 0,
  runOuts: 0,
});

// Match data structure
export const createMatch = (id, date, team1, team2, players, result, createdAt) => ({
  id,
  date,
  team1,
  team2,
  players,
  result,
  createdAt,
});

// Match player data structure
export const createMatchPlayer = (playerId, playerName, batting, bowling, fielding) => ({
  playerId,
  playerName,
  batting,
  bowling,
  fielding,
});

// Batting statistics structure
export const createBattingStats = () => ({
  runs: 0,
  balls: 0,
  fours: 0,
  sixes: 0,
  isOut: false,
  howOut: null,
});

// Bowling statistics structure
export const createBowlingStats = () => ({
  overs: 0,
  maidens: 0,
  runs: 0,
  wickets: 0,
});

// Fielding statistics structure
export const createFieldingStats = () => ({
  catches: 0,
  stumpings: 0,
  runOuts: 0,
});

// Leaderboard entry structure
export const createLeaderboardEntry = (playerId, playerName, value, matches) => ({
  playerId,
  playerName,
  value,
  matches,
});
