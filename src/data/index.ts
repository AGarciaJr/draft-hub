import internData from './intern_project_data.json';
import type { PlayerBio } from '../types/player.types.ts';

export const playerBios: PlayerBio[] = internData.bio;
export const scoutRankings = internData.scoutRankings; 