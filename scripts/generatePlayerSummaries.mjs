import fs from 'fs';
import { spawn } from 'child_process';

const rawData = fs.readFileSync('./src/data/intern_project_data.json');
const bios = JSON.parse(rawData).bio;

function formatHeight(inches) {
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${ft}'${inch}"`;
}

function buildPrompt(player) {
  return `
Write a 2–3 sentence scouting summary for ${player.name}, a ${formatHeight(player.height)}, ${player.weight} lb ${player.position || 'basketball player'}.
They play for ${player.currentTeam} in the ${player.league}. Their hometown is ${player.homeTown}, ${player.homeCountry}.
Use a professional scouting tone.
`.trim();
}

function generateWithOllama(prompt) {
  return new Promise((resolve, reject) => {
    const ollama = spawn('ollama', ['run', 'llama3']);
    let output = '';

    ollama.stdout.on('data', (data) => {
      output += data.toString();
    });

    ollama.stderr.on('data', (data) => {
      console.error('stderr:', data.toString());
    });

    ollama.on('error', reject);

    ollama.on('close', () => {
      resolve(output.trim());
    });

    ollama.stdin.write(prompt + '\n');
    ollama.stdin.end();
  });
}

const summaries = [];

async function generateAll() {
  for (const player of bios.slice(0, 1)) {
    console.log(`Generating summary for ${player.name}...`);
    const prompt = buildPrompt(player);
    try {
      const summary = await generateWithOllama(prompt);
      console.log(`Summary for ${player.name}: ${summary}`);
      summaries.push({ playerId: player.playerId, summary });
    } catch (err) {
      console.error(`Failed: ${player.name}`, err);
    }
  }

  fs.writeFileSync('./src/data/player_summaries.json', JSON.stringify(summaries, null, 2));
  console.log('All summaries saved to player_summaries.json');
}

generateAll();
