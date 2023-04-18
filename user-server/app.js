#!/usr/bin/env node
import { pageRank } from './services/UserService.js';
import { program } from 'commander';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();


program
  .arguments('<username>')
  .description('Calculates PageRank for a given user on GitHub')
  .option('-d, --damping-factor <dampingFactor>', 'Damping factor (default: 0.85)')
  .option('-p, --depth <depth>', 'Depth of the PageRank calculation (default: 3)')
  .option('-t, --token <token>', 'GitHub personal access token')
  .option('-o, --output <f>', 'Write the results to the specified file instead of stdout')
  .helpOption('-h, --help', 'Display this page')
  .addHelpText('after', '\nExamples:\n  github-pagerank joszamama\n  github-pagerank joszamama -d 0.85 -p 1 -t <generated-token> -o hola1.txt\n')
  .action(async function(username, options) {
    const dampingFactor = options.dampingFactor || 0.85;
    const depth = options.depth || 3;
    const tokenPred = process.env.TOKEN;
    const token = options.token || tokenPred;
    const database = false;
    console.log(`\nCalculating PageRank of ${username} with damping factor ${dampingFactor} and depth ${depth} to ${options.output? options.output : 'stdout'}...\n`);
    const rankingFollowers = await pageRank(username, dampingFactor, depth, token, database);
    if (options.output) {
      const data = JSON.stringify(Array.from(rankingFollowers.entries()), null, 2);
      console.log("\nFinished\n");
      fs.writeFileSync(options.output, data);
      console.log(`Written to the indicated text file (${options.output})`);
    } else {
      console.log("\nFinished\n");
      console.log(rankingFollowers);
    }
  });


program.parse(process.argv);