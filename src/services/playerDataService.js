import * as fs from 'fs';
import * as path from 'path';
class PlayerDataService {
    constructor() {
        Object.defineProperty(this, "data", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.data = this.processData();
    }
    processData() {
        const jsonPath = path.join(process.cwd(), 'src', 'data', 'intern_project_data.json');
        const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        const bios = rawData.bio;
        const rankings = rawData.scoutRankings;
        const measurements = rawData.measurements;
        const gameLogs = rawData.game_logs;
        const seasonLogs = rawData.seasonLogs;
        const scoutingReports = rawData.scoutingReports;
        const stats = {
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
    groupByLeague(bios) {
        return bios.reduce((acc, player) => {
            acc[player.league] = (acc[player.league] || 0) + 1;
            return acc;
        }, {});
    }
    groupByNationality(bios) {
        return bios.reduce((acc, player) => {
            acc[player.nationality] = (acc[player.nationality] || 0) + 1;
            return acc;
        }, {});
    }
    calculateAverageHeight(bios) {
        const totalHeight = bios.reduce((sum, player) => sum + player.height, 0);
        return totalHeight / bios.length;
    }
    calculateAverageWeight(bios) {
        const totalWeight = bios.reduce((sum, player) => sum + player.weight, 0);
        return totalWeight / bios.length;
    }
    calculateAgeDistribution(bios) {
        return bios.reduce((acc, player) => {
            const age = this.calculateAge(player.birthDate);
            acc[age] = (acc[age] || 0) + 1;
            return acc;
        }, {});
    }
    calculateAge(birthDate) {
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
    getAllPlayers() {
        return this.data.data.bios;
    }
    getAllRankings() {
        return this.data.data.rankings;
    }
    getAllMeasurements() {
        return this.data.data.measurements;
    }
    getAllGameLogs() {
        return this.data.data.gameLogs;
    }
    getAllSeasonLogs() {
        return this.data.data.seasonLogs;
    }
    getAllScoutingReports() {
        return this.data.data.scoutingReports;
    }
    getPlayerById(playerId) {
        return this.data.data.bios.find(player => player.playerId === playerId);
    }
    getPlayerRankings(playerId) {
        return this.data.data.rankings.find(ranking => ranking.playerId === playerId);
    }
    getPlayerMeasurements(playerId) {
        return this.data.data.measurements.find(measurement => measurement.playerId === playerId);
    }
    getPlayerGameLogs(playerId) {
        return this.data.data.gameLogs.filter(log => log.playerId === playerId);
    }
    getPlayerSeasonLogs(playerId) {
        return this.data.data.seasonLogs.filter(log => log.playerId === playerId);
    }
    getPlayerScoutingReports(playerId) {
        return this.data.data.scoutingReports.filter(report => report.playerId === playerId);
    }
    getPlayerStats() {
        return this.data.stats;
    }
    searchPlayers(query) {
        const searchTerm = query.toLowerCase();
        return this.data.data.bios.filter(player => player.name.toLowerCase().includes(searchTerm) ||
            player.currentTeam.toLowerCase().includes(searchTerm) ||
            player.league.toLowerCase().includes(searchTerm) ||
            player.nationality.toLowerCase().includes(searchTerm));
    }
    getPlayersByLeague(league) {
        return this.data.data.bios.filter(player => player.league === league);
    }
    getPlayersByNationality(nationality) {
        return this.data.data.bios.filter(player => player.nationality === nationality);
    }
    getTopRankedPlayers(limit = 10) {
        const topRankings = this.data.data.rankings
            .sort((a, b) => {
            const aAvg = this.calculateAverageRank(a);
            const bAvg = this.calculateAverageRank(b);
            return aAvg - bAvg;
        })
            .slice(0, limit);
        return topRankings.map(ranking => this.getPlayerById(ranking.playerId)).filter((player) => player !== undefined);
    }
    calculateAverageRank(ranking) {
        const ranks = [
            ranking["ESPN Rank"],
            ranking["Sam Vecenie Rank"],
            ranking["Kevin O'Connor Rank"],
            ranking["Kyle Boone Rank"],
            ranking["Gary Parrish Rank"]
        ].filter((rank) => rank !== null);
        return ranks.reduce((sum, rank) => sum + rank, 0) / ranks.length;
    }
    // New methods for additional data types
    getPlayerCompleteProfile(playerId) {
        const player = this.getPlayerById(playerId);
        if (!player)
            return undefined;
        return {
            bio: player,
            rankings: this.getPlayerRankings(playerId),
            measurements: this.getPlayerMeasurements(playerId),
            gameLogs: this.getPlayerGameLogs(playerId),
            seasonLogs: this.getPlayerSeasonLogs(playerId),
            scoutingReports: this.getPlayerScoutingReports(playerId)
        };
    }
    getPlayersWithMeasurements() {
        const playerIdsWithMeasurements = new Set(this.data.data.measurements.map(m => m.playerId));
        return this.data.data.bios.filter(player => playerIdsWithMeasurements.has(player.playerId));
    }
    getPlayersWithGameLogs() {
        const playerIdsWithLogs = new Set(this.data.data.gameLogs.map(log => log.playerId));
        return this.data.data.bios.filter(player => playerIdsWithLogs.has(player.playerId));
    }
    getPlayersWithScoutingReports() {
        const playerIdsWithReports = new Set(this.data.data.scoutingReports.map(report => report.playerId));
        return this.data.data.bios.filter(player => playerIdsWithReports.has(player.playerId));
    }
}
// Export a singleton instance
export const playerDataService = new PlayerDataService();
