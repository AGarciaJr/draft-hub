import internData from './intern_project_data.json' assert { type: 'json' };
import type { PlayerBio } from '../types/player';

export const playerBios: PlayerBio[] = internData.bio;
export const scoutRankings = internData.scoutRankings; 