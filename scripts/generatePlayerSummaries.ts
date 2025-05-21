import * as fs from 'fs';
import { spawn } from 'child_process';
import type { PlayerBio, GameLog } from '../src/types/player.types.js';
import { playerDataService } from '../src/services/playerDataService.js';

function formatHeight(inches: number): string {
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${ft}'${inch}"`;
}

function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const age = now.getFullYear() - birth.getFullYear();
  return now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()) ? age - 1 : age;
}

function formatStats(stats: GameLog[]): string {
  if (!stats || stats.length === 0) return 'No stats available.';
  const recent = stats.slice(-5); // Last 5 games
  const lines = recent.map(game => {
    return `- ${game.date}: ${game.pts} pts, ${game.reb} reb, ${game.ast} ast`;
  });
  return lines.join('\n');
}

function buildPrompt(player: PlayerBio, stats: GameLog[]): string {
  return `
You are a professional NBA scout writing a concise summary of ${player.name}, a ${formatHeight(player.height)}, ${player.weight} lb player from ${player.currentTeam} (${player.league}).

### Background
- Hometown: ${player.homeTown}, ${player.homeCountry}
- Nationality: ${player.nationality}
- Age: ${calculateAge(player.birthDate)} years old

### Game Log Summary
${formatStats(stats)}

### Instructions
Write a 2–3 sentence scouting summary in a professional, readable tone. 
Do **not** restate the stats directly. Instead, use them to form insight:
- What is this player's style?
- Where do they thrive or struggle?
- What role might they play in the NBA?

Avoid technical jargon or basketball abbreviations. Write clearly so both fans and general readers can follow.
`.trim();
}

function generateWithOllama(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', ['run', 'llama3']);
    let output = '';
    let errorOutput = '';

    ollama.stdout.on('data', (data) => {
      output += data.toString();
    });

    ollama.stderr.on('data', (data) => {
      errorOutput += data.toString();
      //Removing this because it would just print 20 blank stderr lines?
      // console.error('stderr:', data.toString());
    });

    ollama.on('error', (err) => {
      console.error('Ollama process error:', err);
      reject(err);
    });

    ollama.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Ollama process exited with code ${code}. Error: ${errorOutput}`));
        return;
      }
      resolve(output.trim());
    });

    ollama.stdin.write(prompt + '\n');
    ollama.stdin.end();
  });
}

const summaries: { playerId: number; summary: string }[] = [];

async function generateAll() {
  const bios = playerDataService.getAllPlayers();
  console.log(`\n=== Starting Summary Generation ===`);
  console.log(`Total players loaded: ${bios.length}`);
  console.log(`Players to process: ${bios.map(p => p.name).join(', ')}\n`);

  let processedCount = 0;
  for (const player of bios) {
    processedCount++;
    console.log(`\n[${processedCount}/${bios.length}] Generating summary for ${player.name}...`);
    const stats = playerDataService.getPlayerGameLogs(player.playerId);
    console.log(`Found ${stats.length} game logs for ${player.name}`);
    
    const prompt = buildPrompt(player, stats);
    try {
      console.log(`Sending prompt to Ollama...`);
      const summary = await Promise.race<string>([
        generateWithOllama(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timed out')), 60000))
      ]);
      
      if (!summary || summary.trim() === '') {
        console.error(`Empty summary generated for ${player.name}`);
        continue;
      }
      
      console.log(`✓ Successfully generated summary for ${player.name}`);
      summaries.push({ playerId: player.playerId, summary });
      
      // Add a small delay between generations to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      console.error(`✗ Failed to generate summary for ${player.name}:`, err);
      continue;
    }
  }

  if (summaries.length > 0) {
    fs.writeFileSync('./src/data/player_summaries.json', JSON.stringify(summaries, null, 2));
    console.log(`\n=== Summary Generation Complete ===`);
    console.log(`Successfully generated ${summaries.length} summaries out of ${bios.length} players`);
    console.log(`Results saved to player_summaries.json`);
  } else {
    console.error('\n=== Summary Generation Failed ===');
    console.error('No summaries were generated successfully');
  }
}

generateAll();
