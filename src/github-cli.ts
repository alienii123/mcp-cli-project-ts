#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { GitHubTool } from '../tools/github.js';
import { MCPClient } from './mcp-client.js';

// Initialize tools
const client = new MCPClient();
const githubTool = new GitHubTool();

program
  .name('github-explorer')
  .description('GitHub MCP Information Explorer - Cool experiments with GitHub data')
  .version('1.0.0');

program
  .command('connect')
  .description('Test connection to GitHub MCP server')
  .action(async () => {
    try {
      console.log(chalk.blue('🐙 Testing GitHub MCP server connection...'));
      const results = await githubTool.testGitHubConnection(client);
      results.forEach(result => console.log(result));
      await client.disconnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Connection Error: ${errorMessage}`));
      console.log(chalk.yellow('\n💡 Setup Tips:'));
      console.log('   • Set GITHUB_PERSONAL_ACCESS_TOKEN environment variable');
      console.log('   • Get a token from: https://github.com/settings/tokens');
      console.log('   • Grant "repo" scope for full access');
    }
  });

program
  .command('search')
  .description('Search repositories, users, or code')
  .option('-r, --repos <query>', 'Search repositories')
  .option('-u, --users <query>', 'Search users')
  .option('-c, --code <pattern>', 'Search code patterns')
  .option('-l, --language <lang>', 'Filter by programming language')
  .option('--limit <number>', 'Limit results', '10')
  .action(async (options: { 
    repos?: string; 
    users?: string; 
    code?: string; 
    language?: string; 
    limit?: string; 
  }) => {
    try {
      await client.connectToGitHubServer();
      const limit = parseInt(options.limit || '10');

      if (options.repos) {
        console.log(chalk.blue(`🔍 Searching repositories for: "${options.repos}"`));
        const repos = await githubTool.searchRepositories(client, options.repos, limit);
        
        if (repos.length === 0) {
          console.log(chalk.yellow('No repositories found.'));
        } else {
          console.log(chalk.green(`\n📚 Found ${repos.length} repositories:\n`));
          repos.forEach((repo, index) => {
            console.log(chalk.white(`${index + 1}. ${chalk.bold(repo.owner + '/' + repo.name)}`));
            console.log(chalk.gray(`   ⭐ ${repo.stars} stars | 💻 ${repo.language || 'Unknown'}`));
            if (repo.description) {
              console.log(chalk.gray(`   📝 ${repo.description.slice(0, 100)}${repo.description.length > 100 ? '...' : ''}`));
            }
            console.log();
          });
        }
      }

      if (options.users) {
        console.log(chalk.blue(`👥 Searching users for: "${options.users}"`));
        const users = await githubTool.searchUsers(client, options.users, limit);
        
        if (users.length === 0) {
          console.log(chalk.yellow('No users found.'));
        } else {
          console.log(chalk.green(`\n👥 Found ${users.length} users:\n`));
          users.forEach((user, index) => {
            console.log(chalk.white(`${index + 1}. ${chalk.bold(user.login)}`));
            if (user.name) console.log(chalk.gray(`   Name: ${user.name}`));
            if (user.location) console.log(chalk.gray(`   📍 ${user.location}`));
            console.log(chalk.gray(`   👥 ${user.followers} followers | 📁 ${user.public_repos} repos`));
            if (user.bio) {
              console.log(chalk.gray(`   💬 ${user.bio.slice(0, 80)}${user.bio.length > 80 ? '...' : ''}`));
            }
            console.log();
          });
        }
      }

      if (options.code) {
        console.log(chalk.blue(`🔍 Searching code for pattern: "${options.code}"`));
        const codeResults = await githubTool.searchCode(client, options.code, limit);
        
        if (codeResults.length === 0) {
          console.log(chalk.yellow('No code found matching pattern.'));
        } else {
          console.log(chalk.green(`\n💻 Found ${codeResults.length} code matches:\n`));
          codeResults.slice(0, 8).forEach((result, index) => {
            console.log(chalk.white(`${index + 1}. ${chalk.bold(result.repository?.full_name || 'Unknown')}/${result.name}`));
            console.log(chalk.gray(`   🔗 ${result.html_url}`));
            console.log(chalk.gray(`   💻 ${result.repository?.language || 'Unknown'}`));
            console.log();
          });
        }
      }

      await client.disconnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Search Error: ${errorMessage}`));
    }
  });

program
  .command('trending')
  .description('Analyze trending repositories and technologies')
  .option('-l, --language <lang>', 'Filter by programming language')
  .action(async (options: { language?: string }) => {
    try {
      await client.connectToGitHubServer();
      await githubTool.trendingAnalysis(client, options.language);
      await client.disconnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Trending Analysis Error: ${errorMessage}`));
    }
  });

program
  .command('developer')
  .description('Analyze a developer\'s GitHub profile and repositories')
  .argument('<username>', 'GitHub username to analyze')
  .action(async (username: string) => {
    try {
      await client.connectToGitHubServer();
      await githubTool.developerInsights(client, username);
      await client.disconnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Developer Analysis Error: ${errorMessage}`));
    }
  });

program
  .command('pattern')
  .description('Analyze code patterns across GitHub')
  .argument('<pattern>', 'Code pattern to search for (e.g., "async/await", "useState")')
  .option('-l, --language <lang>', 'Filter by programming language')
  .action(async (pattern: string, options: { language?: string }) => {
    try {
      await client.connectToGitHubServer();
      await githubTool.codePatternAnalysis(client, pattern, options.language);
      await client.disconnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Pattern Analysis Error: ${errorMessage}`));
    }
  });

program
  .command('community')
  .description('Explore a technology community on GitHub')
  .argument('<topic>', 'Technology or topic to explore (e.g., "machine-learning", "react")')
  .action(async (topic: string) => {
    try {
      await client.connectToGitHubServer();
      await githubTool.communityExplorer(client, topic);
      await client.disconnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Community Explorer Error: ${errorMessage}`));
    }
  });

program
  .command('experiments')
  .description('Run all cool information experiments')
  .option('-t, --topic <topic>', 'Focus on specific topic', 'typescript')
  .option('-u, --user <username>', 'Analyze specific user')
  .action(async (options: { topic?: string; user?: string }) => {
    try {
      console.log(chalk.magenta('🧪 === GITHUB INFORMATION EXPERIMENTS === 🧪\n'));
      
      await client.connectToGitHubServer();
      
      const topic = options.topic || 'typescript';
      
      // Experiment 1: Trending Analysis
      console.log(chalk.cyan('🚀 Experiment 1: Trending Technology Analysis'));
      await githubTool.trendingAnalysis(client, topic === 'typescript' ? 'typescript' : undefined);
      
      // Experiment 2: Community Explorer
      console.log(chalk.cyan('\n🌐 Experiment 2: Community Explorer'));
      await githubTool.communityExplorer(client, topic);
      
      // Experiment 3: Code Pattern Analysis
      console.log(chalk.cyan('\n🔍 Experiment 3: Code Pattern Analysis'));
      const patterns = topic === 'typescript' ? 'interface' : 'async function';
      await githubTool.codePatternAnalysis(client, patterns, topic === 'typescript' ? 'typescript' : undefined);
      
      // Experiment 4: Developer Insights (if user specified)
      if (options.user) {
        console.log(chalk.cyan(`\n👨‍💻 Experiment 4: Developer Insights for ${options.user}`));
        await githubTool.developerInsights(client, options.user);
      }
      
      console.log(chalk.magenta('\n🎉 === EXPERIMENTS COMPLETE === 🎉'));
      await client.disconnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Experiments Error: ${errorMessage}`));
    }
  });

program
  .command('tools')
  .description('List available GitHub MCP tools')
  .action(async () => {
    try {
      await client.connectToGitHubServer();
      const tools = await client.listTools();
      
      console.log(chalk.green(`🛠️ Available GitHub MCP Tools (${tools.length} total):\n`));
      
      tools.forEach((tool, index) => {
        console.log(chalk.white(`${index + 1}. ${chalk.bold(tool.name)}`));
        console.log(chalk.gray(`   📝 ${tool.description || 'No description available'}`));
        
        if (tool.inputSchema?.properties) {
          const params = Object.keys(tool.inputSchema.properties);
          if (params.length > 0) {
            console.log(chalk.gray(`   🔧 Parameters: ${params.join(', ')}`));
          }
        }
        console.log();
      });
      
      console.log(chalk.blue('💡 Use these tools with the MCP server for custom experiments!'));
      await client.disconnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Tools Error: ${errorMessage}`));
    }
  });

// Show help and examples if no arguments provided
if (process.argv.length === 2) {
  console.log(chalk.cyan('🐙 GitHub MCP Information Explorer'));
  console.log(chalk.gray('Discover insights and patterns across GitHub using MCP integration\n'));
  
  console.log(chalk.yellow('🌟 Quick Examples:'));
  console.log('   npm run github connect                    # Test connection');
  console.log('   npm run github search --repos "ai"       # Search AI repositories'); 
  console.log('   npm run github trending                   # Analyze trending repos');
  console.log('   npm run github developer octocat         # Analyze octocat\'s profile');
  console.log('   npm run github pattern "useState"        # Analyze React hook usage');
  console.log('   npm run github community "machine-learning" # Explore ML community');
  console.log('   npm run github experiments               # Run all experiments');
  console.log();
  
  console.log(chalk.yellow('🔧 Setup:'));
  console.log('   export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here');
  console.log('   # Get token from: https://github.com/settings/tokens');
  console.log();
  
  program.help();
}

program.parse(); 