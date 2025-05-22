import { spawn } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

interface Player {
  name: string;
  position: string;
  stats: Record<string, number>;
}

interface GameLog {
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
  'fg%': number;
  tpm: number;
  tpa: number;
  'tp%': number;
  ftm: number;
  fta: number;
  'ft%': number;
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

// Add this interface before the main() function
interface PlayerAnalysis {
  playerName: string;
  position: string;
  analysis: {
    stat1: {
      stat: string;
      value: string;
      explanation: string;
    };
    stat2: {
      stat: string;
      value: string;
      explanation: string;
    };
    stat3: {
      stat: string;
      value: string;
      explanation: string;
    };
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playerDataPath = path.join(__dirname, '..', 'src', 'data', 'player_classes_positions.json');
const gameLogsPath = path.join(__dirname, '..', 'src', 'data', 'intern_project_data.json');

// Read both files
const playerData = JSON.parse(fs.readFileSync(playerDataPath, 'utf-8'));
const gameLogsData = JSON.parse(fs.readFileSync(gameLogsPath, 'utf-8'));

// Map player names to positions
const playerPositions = new Map(
  playerData.players.map((p: { name: string; position: string }) => [p.name, p.position])
);

// Accumulate stats per player
const playerStats = new Map<string, { totals: Partial<GameLog>; count: number }>();

gameLogsData.game_logs.forEach((log: GameLog) => {
  const playerBio = gameLogsData.bio.find((b: { playerId: number }) => b.playerId === log.playerId);
  if (!playerBio) return;

  const playerName = playerBio.name;
  const current = playerStats.get(playerName) || { totals: {}, count: 0 };

  // Accumulate totals for relevant stats
  // Accumulate totals for relevant stats
  const statsToAccumulate = ['fgm', 'fga', 'tpm', 'tpa', 'ftm', 'fta', 'reb', 'ast', 'stl', 'blk', 'tov', 'pts'];
  statsToAccumulate.forEach(stat => {
    const totals = current.totals as Record<string, number>;  // Force numeric type
    totals[stat] = (totals[stat] || 0) + (log[stat as keyof GameLog] as number);
  });


  current.count += 1;
  playerStats.set(playerName, current);
});

// Build final player objects
const players: Player[] = Array.from(playerPositions.entries()).map((entry) => {
  const [name, position] = entry as [string, string];
  const statsEntry = playerStats.get(name);
  const totals = statsEntry?.totals || {};
  const count = statsEntry?.count || 1;

  return {
    name,
    position,
    stats: {
      points: (totals.pts || 0) / count,
      rebounds: (totals.reb || 0) / count,
      assists: (totals.ast || 0) / count,
      steals: (totals.stl || 0) / count,
      blocks: (totals.blk || 0) / count,
      turnovers: (totals.tov || 0) / count,
      fieldGoalPercentage: totals.fga ? ((totals.fgm || 0) / totals.fga) * 100 : 0,
      threePointPercentage: totals.tpa ? ((totals.tpm || 0) / totals.tpa) * 100 : 0,
      freeThrowPercentage: totals.fta ? ((totals.ftm || 0) / totals.fta) * 100 : 0,
    },
  };
});

// Prompt builder
const generatePrompt = (player: Player) => {
  const statsList = Object.entries(player.stats)
    .map(([stat, value]) => `${stat}: ${value.toFixed(1)}`)
    .join(', ');

  return `You are a JSON-only response bot. Respond with ONLY a valid JSON object, no other text.
The response MUST follow this exact structure with these exact keys:

{
  "playerName": "${player.name}",
  "position": "${player.position}",
  "analysis": {
    "stat1": {
      "stat": "Points Per Game",
      "value": "${player.stats.points.toFixed(1)}",
      "explanation": "Explain why points per game is important for a ${player.position}"
    },
    "stat2": {
      "stat": "Rebounds Per Game",
      "value": "${player.stats.rebounds.toFixed(1)}",
      "explanation": "Explain why rebounds per game is important for a ${player.position}"
    },
    "stat3": {
      "stat": "Field Goal Percentage",
      "value": "${player.stats.fieldGoalPercentage.toFixed(1)}",
      "explanation": "Explain why field goal percentage is important for a ${player.position}"
    }
  }
}

Available stats: ${statsList}

Remember:
1. Use ONLY the provided player name and position
2. Use ONLY the provided stat values
3. Include ALL three stats in the analysis
4. Write specific explanations, not placeholders`;
};

// Run Ollama and get response
const runOllamaPrompt = (prompt: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', ['run', 'llama3'], { stdio: ['pipe', 'pipe', 'inherit'] });

    let output = '';

    ollama.stdout.on('data', (data) => {
      output += data.toString();
    });

    ollama.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Ollama exited with code ${code}`));
      }
    });

    ollama.stdin.write(prompt);
    ollama.stdin.end();
  });
};

// Extract clean JSON block
const extractJSON = (text: string): string | null => {
  // Look for first brace
  const start = text.indexOf('{');
  if (start === -1) return null;

  let braceCount = 0;
  let end = -1;

  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') braceCount++;
    if (text[i] === '}') braceCount--;

    if (braceCount === 0) {
      end = i;
      break;
    }
  }

  if (end === -1) return null;

  const maybeJSON = text.slice(start, end + 1);
  try {
    JSON.parse(maybeJSON); // validate
    return maybeJSON;
  } catch {
    return null;
  }
};

// Add this function before main()
const checkPlayerStats = () => {
  console.log('\nPlayers with stats:');
  console.log('------------------');
  
  for (const [name, position] of playerPositions.entries() as IterableIterator<[string, string]>) {
    const stats = playerStats.get(name);
    if (stats && stats.count > 0) {
      console.log(`✅ ${name} (${position}) - ${stats.count} games`);
    } else {
      console.log(`❌ ${name} (${position}) - No stats found`);
    }
  }
  console.log('\n');
};

// Modify main() to call this first
const main = async () => {
  checkPlayerStats(); // Add this line at the start of main()
  
  const allAnalyses: PlayerAnalysis[] = [];

  for (const player of players) {
    const prompt = generatePrompt(player);
    try {
      console.log(`\n=== ${player.name} (${player.position}) ===`);
      const result = await runOllamaPrompt(prompt);
      const extracted = extractJSON(result);

      if (!extracted) {
        console.error(`❌ Failed to extract valid JSON for ${player.name}`);
        continue;
      }

      const json = JSON.parse(extracted);
      allAnalyses.push(json);
      console.log(json);
    } catch (error) {
      console.error(`❌ Failed to parse JSON for ${player.name}:`, error);
    }
  }

  // Write all results to a file
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'player_stats_info.json');
  fs.writeFileSync(outputPath, JSON.stringify(allAnalyses, null, 2));
  console.log(`\n✅ Analyses written to ${outputPath}`);
};

main();
