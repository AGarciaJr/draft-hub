import type { 
  PlayerBio, 
  PlayerData, 
  PlayerStats, 
  ScoutRanking,
  PlayerMeasurements,
  GameLog,
  SeasonLog,
  ScoutingReport
} from '../types/player.types';
import playerData from '../data/intern_project_data.json';

class PlayerDataService {
  private data: PlayerData;

  constructor() {
    this.data = this.processData();
  }

  private processData(): PlayerData {
    const bios = playerData.bio as PlayerBio[];
    const rankings = playerData.scoutRankings as ScoutRanking[];
    const measurements = playerData.measurements as PlayerMeasurements[];
    const gameLogs = playerData.game_logs as GameLog[];
    const seasonLogs = playerData.seasonLogs as SeasonLog[];
    const scoutingReports = playerData.scoutingReports as ScoutingReport[];

    const stats: PlayerStats = {
      totalPlayers: bios.length,
      totalRankings: rankings.length,
      playersWithPhotos: bios.filter(player => player.photoUrl !== null).length,
      playersByLeague: this.groupByLeague(bios),
      playersByNationality: this.groupByNationality(bios),
      averageHeight: this.calculateAverageHeight(bios),
      averageWeight: this.calculateAverageWeight(bios),
      ageDistribution: this.calculateAgeDistribution(bios)
    };

    return {
      stats,
      data: {
        bios,
        rankings,
        measurements,
        gameLogs,
        seasonLogs,
        scoutingReports
      }
    };
  }

  private groupByLeague(bios: PlayerBio[]): Record<string, number> {
    return bios.reduce((acc, player) => {
      acc[player.league] = (acc[player.league] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private groupByNationality(bios: PlayerBio[]): Record<string, number> {
    return bios.reduce((acc, player) => {
      acc[player.nationality] = (acc[player.nationality] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateAverageHeight(bios: PlayerBio[]): number {
    const totalHeight = bios.reduce((sum, player) => sum + player.height, 0);
    return totalHeight / bios.length;
  }

  private calculateAverageWeight(bios: PlayerBio[]): number {
    const totalWeight = bios.reduce((sum, player) => sum + player.weight, 0);
    return totalWeight / bios.length;
  }

  private calculateAgeDistribution(bios: PlayerBio[]): Record<string, number> {
    return bios.reduce((acc, player) => {
      const age = this.calculateAge(player.birthDate);
      acc[age] = (acc[age] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  // Public methods for accessing data
  public getAllPlayers(): PlayerBio[] {
    return this.data.data.bios;
  }

  public getAllRankings(): ScoutRanking[] {
    return this.data.data.rankings;
  }

  public getAllMeasurements(): PlayerMeasurements[] {
    return this.data.data.measurements;
  }

  public getAllGameLogs(): GameLog[] {
    return this.data.data.gameLogs;
  }

  public getAllSeasonLogs(): SeasonLog[] {
    return this.data.data.seasonLogs;
  }

  public getAllScoutingReports(): ScoutingReport[] {
    return this.data.data.scoutingReports;
  }

  public getPlayerById(playerId: number): PlayerBio | undefined {
    return this.data.data.bios.find(player => player.playerId === playerId);
  }

  public getPlayerRankings(playerId: number): ScoutRanking | undefined {
    return this.data.data.rankings.find(ranking => ranking.playerId === playerId);
  }

  public getPlayerMeasurements(playerId: number): PlayerMeasurements | undefined {
    return this.data.data.measurements.find(measurement => measurement.playerId === playerId);
  }

  public getPlayerGameLogs(playerId: number): GameLog[] {
    return this.data.data.gameLogs.filter(log => log.playerId === playerId);
  }

  public getPlayerSeasonLogs(playerId: number): SeasonLog[] {
    return this.data.data.seasonLogs.filter(log => log.playerId === playerId);
  }

  public getPlayerScoutingReports(playerId: number): ScoutingReport[] {
    return this.data.data.scoutingReports.filter(report => report.playerId === playerId);
  }

  public getPlayerStats(): PlayerStats {
    return this.data.stats;
  }

  public searchPlayers(query: string): PlayerBio[] {
    const searchTerm = query.toLowerCase();
    return this.data.data.bios.filter(player => 
      player.name.toLowerCase().includes(searchTerm) ||
      player.currentTeam.toLowerCase().includes(searchTerm) ||
      player.league.toLowerCase().includes(searchTerm) ||
      player.nationality.toLowerCase().includes(searchTerm)
    );
  }

  public getPlayersByLeague(league: string): PlayerBio[] {
    return this.data.data.bios.filter(player => player.league === league);
  }

  public getPlayersByNationality(nationality: string): PlayerBio[] {
    return this.data.data.bios.filter(player => player.nationality === nationality);
  }

  public getTopRankedPlayers(limit: number = 10): PlayerBio[] {
    const topRankings = this.data.data.rankings
      .sort((a, b) => {
        const aAvg = this.calculateAverageRank(a);
        const bAvg = this.calculateAverageRank(b);
        return aAvg - bAvg;
      })
      .slice(0, limit);

    return topRankings.map(ranking => 
      this.getPlayerById(ranking.playerId)
    ).filter((player): player is PlayerBio => player !== undefined);
  }

  private calculateAverageRank(ranking: ScoutRanking): number {
    const ranks = [
      ranking["ESPN Rank"],
      ranking["Sam Vecenie Rank"],
      ranking["Kevin O'Connor Rank"],
      ranking["Kyle Boone Rank"],
      ranking["Gary Parrish Rank"]
    ].filter((rank): rank is number => rank !== null);

    return ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length;
  }

  // New methods for additional data types
  public getPlayerCompleteProfile(playerId: number) {
    const player = this.getPlayerById(playerId);
    if (!player) return undefined;

    return {
      bio: player,
      rankings: this.getPlayerRankings(playerId),
      measurements: this.getPlayerMeasurements(playerId),
      gameLogs: this.getPlayerGameLogs(playerId),
      seasonLogs: this.getPlayerSeasonLogs(playerId),
      scoutingReports: this.getPlayerScoutingReports(playerId)
    };
  }

  public getPlayersWithMeasurements(): PlayerBio[] {
    const playerIdsWithMeasurements = new Set(
      this.data.data.measurements.map(m => m.playerId)
    );
    return this.data.data.bios.filter(player => 
      playerIdsWithMeasurements.has(player.playerId)
    );
  }

  public getPlayersWithGameLogs(): PlayerBio[] {
    const playerIdsWithLogs = new Set(
      this.data.data.gameLogs.map(log => log.playerId)
    );
    return this.data.data.bios.filter(player => 
      playerIdsWithLogs.has(player.playerId)
    );
  }

  public getPlayersWithScoutingReports(): PlayerBio[] {
    const playerIdsWithReports = new Set(
      this.data.data.scoutingReports.map(report => report.playerId)
    );
    return this.data.data.bios.filter(player => 
      playerIdsWithReports.has(player.playerId)
    );
  }
}

// Export a singleton instance
export const playerDataService = new PlayerDataService(); 