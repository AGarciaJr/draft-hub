import gameLogs from '../data/processed/game_logs.json' with { type: 'json' };
import seasonLogs from '../data/processed/seasonLogs.json' with { type: 'json' };

type SeasonLogRaw = Record<string, unknown>;
type GameLogRaw = Record<string, unknown>;

class PlayerStatsService {
  getPlayerStats(playerId: number) {
    const playerSeasonLogs = (seasonLogs as SeasonLogRaw[]).filter(log => Number(log.playerId) === playerId);

    if (playerSeasonLogs.length === 0) {
      return null;
    }

    const latest = playerSeasonLogs[0] as SeasonLogRaw;
    const gp = Number(latest["GP"]) || 0;

    return {
      gamesPlayed: gp,
      totals: {
        points: Number(latest["PTS"]) || 0,
        rebounds: Number(latest["REB"]) || 0,
        assists: Number(latest["AST"]) || 0,
        steals: Number(latest["STL"]) || 0,
        blocks: Number(latest["BLK"]) || 0,
        turnovers: Number(latest["TOV"]) || 0,
        fgPercentage: Number(latest["FG%"] )|| 0,
        tpPercentage: Number(latest["3P%"] )|| 0,
        ftPercentage: Number(latest["FT%"] )|| 0,
      },
      perGame: {
        points: Number(latest["PPG"]) || (Number(latest["PTS"]) && gp ? Number(latest["PTS"]) / gp : 0),
        rebounds: Number(latest["RPG"]) || (Number(latest["REB"]) && gp ? Number(latest["REB"]) / gp : 0),
        assists: Number(latest["APG"]) || (Number(latest["AST"]) && gp ? Number(latest["AST"]) / gp : 0),
        steals: Number(latest["SPG"]) || (Number(latest["STL"]) && gp ? Number(latest["STL"]) / gp : 0),
        blocks: Number(latest["BPG"]) || (Number(latest["BLK"]) && gp ? Number(latest["BLK"]) / gp : 0),
        turnovers: Number(latest["TOPG"]) || (Number(latest["TOV"]) && gp ? Number(latest["TOV"]) / gp : 0),
        minutes: Number(latest["MPG"]) || (Number(latest["MP"]) && gp ? Number(latest["MP"]) / gp : 0),
      }
    };
  }

  getRecentGames(playerId: number, limit: number = 5) {
    return (gameLogs as GameLogRaw[])
      .filter(log => Number(log.playerId) === playerId)
      .slice(0, limit)
      .map(log => {
        return {
          date: new Date(String(log.date)).toLocaleDateString(),
          opponent: String(log.opponent),
          points: Number(log.pts),
          rebounds: Number(log.reb),
          assists: Number(log.ast),
          minutes: Number(log.gp),
          result: Number(log.homeTeamPts) > Number(log.visitorTeamPts) ? 'W' : 'L',
          score: `${log.homeTeamPts}-${log.visitorTeamPts}`
        };
      });
  }
}

export const playerStatsService = new PlayerStatsService();
