export interface PlayerBio {
  name: string;
  playerId: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  height: number;
  weight: number;
  highSchool: string | null;
  highSchoolState: string | null;
  homeTown: string;
  homeState: string | null;
  homeCountry: string;
  nationality: string;
  photoUrl: string | null;
  currentTeam: string;
  league: string;
  leagueType: string;
  position?: string;
}

export interface ScoutRanking {
  playerId: number;
  "ESPN Rank": number | null;
  "Sam Vecenie Rank": number | null;
  "Kevin O'Connor Rank": number | null;
  "Kyle Boone Rank": number | null;
  "Gary Parrish Rank": number | null;
}

export interface PlayerMeasurements {
  playerId: number;
  heightNoShoes: number | null;
  heightShoes: number | null;
  wingspan: number | null;
  reach: number | null;
  maxVertical: number | null;
  noStepVertical: number | null;
  weight: number | null;
  bodyFat: number | null;
  handLength: number | null;
  handWidth: number | null;
  agility: number | null;
  sprint: number | null;
  shuttleLeft: number | null;
  shuttleRight: number | null;
  shuttleBest: number | null;
}

export interface GameLog {
  playerId: number;
  gameId: number;
  season: number;
  league: string;
  date: string;
  team: string;
  teamId: number;
  opponentId: number;
  isHome: number | null;
  opponent: string;
  homeTeamPts: number;
  visitorTeamPts: number;
  gp: number;
  gs: number;
  timePlayed: string;
  fgm: number;
  fga: number;
  "fg%": number | null;
  tpm: number;
  tpa: number;
  "tp%": number | null;
  ftm: number;
  fta: number;
  "ft%": number | null;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  tov: number;
  pf: number;
  pts: number;
  plusMinus: number;
  rn: number;
}

export interface SeasonLog {
  playerId: number;
  age: string;
  Season: number;
  League: string;
  Team: string;
  w: number;
  l: number;
  GP: number;
  GS: number;
  MP: number;
  FGM: number;
  FGA: number;
  "FG%": number;
  FG2M: number;
  FG2A: number;
  "FG2%": number;
  FGM3: number;
  FGA3: number;
  "3P%": number;
  FTM: number;
  FTA: number;
  "FT%": number;
  OREB: number;
  DREB: number;
  REB: number;
  AST: number;
  STL: number;
  BLK: number;
  TOV: number;
  PF: number;
  PTS: number;
}

export interface ScoutingReport {
  scout?: string;         
  user?: string;          
  reportId: string;
  playerId: number;
  report: string;
  date?: string;
}

export interface PlayerStats {
  totalPlayers: number;
  totalRankings: number;
  playersWithPhotos: number;
  playersByLeague: Record<string, number>;
  playersByNationality: Record<string, number>;
  averageHeight: number;
  averageWeight: number;
  ageDistribution: Record<string, number>;
}

export interface PlayerData {
  stats: PlayerStats;
  data: {
    bios: PlayerBio[];
    rankings: ScoutRanking[];
    measurements: PlayerMeasurements[];
    gameLogs: GameLog[];
    seasonLogs: SeasonLog[];
    scoutingReports: ScoutingReport[];
  };
} 