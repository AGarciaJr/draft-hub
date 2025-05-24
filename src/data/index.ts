import internData from './intern_project_data.json' with { type: 'json' };
import playerSummaries from './player_summaries.json' with { type: 'json' };
import type { PlayerBio } from '../types/player.types.ts';

export const playerBios: PlayerBio[] = internData.bio;
export const scoutRankings = internData.scoutRankings;
export const scoutingReports = internData.scoutingReports;
export { playerSummaries };