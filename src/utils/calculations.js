// No imports needed for JavaScript

export class StatsCalculator {
  // Batting calculations
  static calculateStrikeRate(runs, balls) {
    if (balls === 0) return 0;
    return Number(((runs / balls) * 100).toFixed(2));
  }

  static calculateBattingAverage(runs, matches) {
    if (matches === 0) return 0;
    return Number((runs / matches).toFixed(2));
  }

  // Bowling calculations
  static calculateBowlingAverage(runs, wickets) {
    if (wickets === 0) return 0;
    return Number((runs / wickets).toFixed(2));
  }

  static calculateEconomyRate(runs, overs) {
    if (overs === 0) return 0;
    return Number((runs / overs).toFixed(2));
  }

  static calculateBowlingStrikeRate(balls, wickets) {
    if (wickets === 0) return 0;
    return Number((balls / wickets).toFixed(2));
  }

  // Update player stats after a match
  static updatePlayerStats(currentStats, matchStats) {
    return {
      matches: currentStats.matches + 1,
      runs: currentStats.runs + (matchStats.batting?.runs || 0),
      balls: currentStats.balls + (matchStats.batting?.balls || 0),
      fours: currentStats.fours + (matchStats.batting?.fours || 0),
      sixes: currentStats.sixes + (matchStats.batting?.sixes || 0),
      wickets: currentStats.wickets + (matchStats.bowling?.wickets || 0),
      overs: currentStats.overs + (matchStats.bowling?.overs || 0),
      runsConceded: currentStats.runsConceded + (matchStats.bowling?.runs || 0),
      maidens: currentStats.maidens + (matchStats.bowling?.maidens || 0),
      catches: currentStats.catches + (matchStats.fielding?.catches || 0),
      stumpings: currentStats.stumpings + (matchStats.fielding?.stumpings || 0),
      runOuts: currentStats.runOuts + (matchStats.fielding?.runOuts || 0),
    };
  }

  // Advanced leaderboard features removed for 50% completion
}
