import type { PlayerEntry, Stat } from '../components/StatCard';
import internData from '../data/intern_project_data.json';
import scrapedPositions from '../data/processed/scraped_positions.json' with { type: 'json' };

const nameToPositionMap = new Map<string, string>(Object.entries(scrapedPositions));

const statKeyMap: Record<Stat, string> = {
  points: 'PTS',
  rebounds: 'TRB',
  assists: 'AST',
  blocks: 'BLK',
  steals: 'STL',
  fieldGoalPercentage: 'FG%'
};

interface GameLog {
  playerId: number;
  [key: string]: number | string;
}

interface PlayerBio {
  playerId: number;
  name: string;
  photoUrl?: string;
}

export const getTopPlayers = (stat: Stat, topN = 5): PlayerEntry[] => {
  const bios = internData.bio as PlayerBio[];
  const logs = internData.seasonLogs as GameLog[];

  const result: PlayerEntry[] = [];

  logs.forEach((entry: GameLog) => {
    const bio = bios.find((b: PlayerBio) => b.playerId === entry.playerId);
    if (!bio) return;

    const statValue = entry[statKeyMap[stat]];
    if (typeof statValue !== 'number') return;

    const name = bio.name;
    const position = nameToPositionMap.get(name) || 'Unknown';

    const player: PlayerEntry = {
      playerName: name,
      position,
      imageUrl: bio.photoUrl ?? undefined,
      stats: {
        [stat]: statValue,
      },
    };
    result.push(player);
  });

  return result
    .sort((a, b) => (b.stats[stat] ?? 0) - (a.stats[stat] ?? 0))
    .slice(0, topN);
};