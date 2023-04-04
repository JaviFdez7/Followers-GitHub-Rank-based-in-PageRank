#!/usr/bin/env node
import { pageRank } from './services/UserService.js';
import { program } from 'commander';
import fs from 'fs';


program
  .arguments('<username>')
  .description('Calculates PageRank for a given user on GitHub')
  .option('-d, --damping-factor <dampingFactor>', 'Damping factor (default: 0.85)')
  .option('-p, --precision <precision>', 'Precision of the PageRank calculation (default: 3)')
  .option('-t, --token <token>', 'GitHub personal access token')
  .option('-o, --output <f>', 'Write the results to the specified file instead of stdout')
  .action(async function(username, options) {
    const dampingFactor = options.dampingFactor || 0.85;
    const precision = options.precision || 3;
    const token = options.token;
    console.log(`Calculating PageRank of ${username} with depth ${dampingFactor} and precision ${precision} to ${options.output? options.output : 'stdout'}`);
    const rankingFollowers = await pageRank(username, dampingFactor, precision, token);
    console.log("finished");
    if (options.output) {
      fs.writeFileSync(options.output, JSON.stringify(rankingFollowers));
    } else {
      console.log(rankingFollowers);
    }
  });

program.parse(process.argv);

/*node app.js joszamama -d 0.85 -p 1 -t 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*/
