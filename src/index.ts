import { program } from 'commander';
import chalk from 'chalk';
import { WeatherTool } from '../tools/weather.js';
import { TodoTool } from '../tools/todo.js';
import { CalculatorTool } from '../tools/calculator.js';
import { GitHubTool } from '../tools/github.js';
import { MCPClient } from './mcp-client.js';
import type { WeatherOptions, TodoOptions } from '../types/cli-types.js';

// Initialize tools
const client = new MCPClient();
const weatherTool = new WeatherTool();
const todoTool = new TodoTool();
const calcTool = new CalculatorTool();
const githubTool = new GitHubTool();

program
  .name('mcp-cli')
  .description('CLI tool with real MCP server integration')
  .version('1.0.0');

program
  .command('weather')
  .description('Get weather information')
  .option('-c, --city <city>', 'City name', 'San Francisco')
  .option('-r, --real', 'Use real MCP weather server (default: simulation)')
  .option('-t, --test', 'Test multiple MCP weather servers')
  .action(async (options: WeatherOptions & { real?: boolean; test?: boolean }) => {
    try {
      console.log(chalk.blue(`🌤️  Getting weather for ${options.city}...`));
      
      if (options.test) {
        // Test multiple servers
        console.log(chalk.yellow('🧪 Testing MCP weather servers...'));
        const results = await weatherTool.testMCPWeatherServers(client, options.city);
        results.forEach((result: string) => console.log(chalk.cyan(result)));
        await client.disconnect();
        return;
      }

      if (options.real) {
        // Try real MCP server
        try {
          console.log(chalk.gray('📡 Connecting to real MCP weather server...'));
          await client.connectToWeatherServer();
          const result = await weatherTool.getWeatherFromMCP(client, options.city);
          console.log(chalk.green(result));
          await client.disconnect();
          return;
        } catch (error) {
          console.log(chalk.yellow(`⚠️ Real MCP server failed: ${error}`));
          console.log(chalk.gray('Falling back to simulation...'));
        }
      }
      
      // Use local simulation
      const result = await weatherTool.getWeather(options.city);
      console.log(chalk.green(result));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Error: ${errorMessage}`));
    } finally {
      await client.disconnect();
    }
  });

program
  .command('todo')
  .description('Manage todo items')
  .option('-a, --add <task>', 'Add a new task')
  .option('-l, --list', 'List all tasks')
  .option('-d, --done <id>', 'Mark task as done')
  .option('-c, --clear', 'Clear completed tasks')
  .option('-s, --stats', 'Show todo statistics')
  .action(async (options: TodoOptions & { stats?: boolean }) => {
    try {
      if (options.add) {
        const result = await todoTool.addTask(options.add);
        console.log(chalk.green(`✅ ${result}`));
      } else if (options.list) {
        const tasks = await todoTool.listTasks();
        if (tasks.length === 0) {
          console.log(chalk.blue('📝 No tasks found. Add some with --add "task name"'));
        } else {
          console.log(chalk.blue('📝 Your tasks:'));
          tasks.forEach(task => {
            const status = task.done ? '✅' : '⏳';
            const date = new Date(task.created).toLocaleDateString();
            console.log(`  ${status} ${task.id}: ${task.text} ${chalk.gray(`(${date})`)}`);
          });
        }
      } else if (options.done) {
        const result = await todoTool.markDone(parseInt(options.done));
        console.log(chalk.green(`✅ ${result}`));
      } else if (options.clear) {
        const result = await todoTool.clearCompleted();
        console.log(chalk.green(`🗑️ ${result}`));
      } else if (options.stats) {
        const stats = await todoTool.getStats();
        console.log(chalk.blue('📊 Todo Statistics:'));
        console.log(`   Total tasks: ${stats.total}`);
        console.log(`   Completed: ${stats.completed}`);
        console.log(`   Pending: ${stats.pending}`);
        console.log(`   Completion rate: ${stats.completionRate.toFixed(1)}%`);
      } else {
        console.log(chalk.yellow('Use --add, --list, --done, --clear, or --stats options'));
        console.log(chalk.gray('Example: npm run todo -- --add "Learn TypeScript"'));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Error: ${errorMessage}`));
    }
  });

program
  .command('calc')
  .description('Perform calculations')
  .argument('<expression>', 'Mathematical expression')
  .option('-a, --advanced', 'Use advanced math functions')
  .action(async (expression: string, options: { advanced?: boolean }) => {
    try {
      console.log(chalk.blue(`🧮 Calculating: ${expression}`));
      
      if (options.advanced) {
        const result = await calcTool.calculateAdvanced(expression);
        console.log(chalk.green(`Result: ${result.result}`));
        console.log(chalk.gray(`Processed: ${result.processedExpression}`));
      } else {
        const result = await calcTool.calculate(expression);
        console.log(chalk.green(`Result: ${result}`));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`Error: ${errorMessage}`));
      console.log(chalk.gray('Tip: Try simpler expressions or use --advanced for functions like sin, cos, sqrt'));
    }
  });

program
  .command('mcp')
  .description('Test and explore MCP servers')
  .option('-s, --server <type>', 'Server type (weather, filesystem, git)', 'weather')
  .option('-p, --path <path>', 'Path for filesystem/git server', process.cwd())
  .option('-l, --list', 'List available tools')
  .option('-t, --test <tool>', 'Test a specific tool')
  .action(async (options: { server?: string; path?: string; list?: boolean; test?: string }) => {
    try {
      console.log(chalk.blue('🔌 Connecting to MCP server...'));
      
      // Connect to specified server
      switch (options.server) {
        case 'weather':
          await client.connectToWeatherServer();
          break;
        case 'filesystem':
          await client.connectToFilesystemServer(options.path);
          break;
        case 'git':
          await client.connectToGitServer(options.path);
          break;
        default:
          console.log(chalk.yellow(`Unknown server type: ${options.server}. Using weather server.`));
          await client.connectToWeatherServer();
      }

      const tools = await client.listTools();
      console.log(chalk.green(`✅ Connected to ${client.getCurrentServerType()} MCP server!`));
      
      if (options.list || !options.test) {
        console.log(chalk.blue('📋 Available tools:'));
        tools.forEach((tool, index) => {
          console.log(`  ${index + 1}. ${chalk.cyan(tool.name)}: ${tool.description}`);
          if (tool.inputSchema?.properties) {
            const params = Object.keys(tool.inputSchema.properties).join(', ');
            console.log(`     ${chalk.gray(`Parameters: ${params}`)}`);
          }
        });
      }

      if (options.test) {
        console.log(chalk.blue(`🧪 Testing tool: ${options.test}`));
        
        // Test specific tool with sample data
        let testParams = {};
        if (options.test.includes('weather')) {
          testParams = { location: 'San Francisco' };
        } else if (options.test.includes('file')) {
          testParams = { path: '.' };
        }

        try {
          const result = await client.callTool(options.test, testParams);
          console.log(chalk.green('✅ Tool test result:'));
          result.forEach((item, index) => {
            console.log(`   ${index + 1}. ${item.text}`);
          });
        } catch (error) {
          console.error(chalk.red(`❌ Tool test failed: ${error}`));
        }
      }

      await client.disconnect();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(chalk.red(`MCP Error: ${errorMessage}`));
      
      console.log(chalk.yellow('\n💡 Troubleshooting tips:'));
      console.log('   • Make sure you have internet connection');
      console.log('   • Try: npm install @modelcontextprotocol/server-weather@latest');
      console.log('   • Use --server filesystem for local testing');
      console.log('   • Check if the MCP server package is available');
    }
  });

program
  .command('servers')
  .description('List and test available MCP servers')
  .action(async () => {
    console.log(chalk.blue('🌐 Testing available MCP servers...\n'));

    const servers = [
      { name: 'Weather', type: 'weather', description: 'Get weather information' },
      { name: 'Filesystem', type: 'filesystem', description: 'File operations' },
      { name: 'Git', type: 'git', description: 'Git repository operations' }
    ];

    for (const server of servers) {
      console.log(chalk.cyan(`Testing ${server.name} server...`));
      try {
        // Connect to server
        switch (server.type) {
          case 'weather':
            await client.connectToWeatherServer();
            break;
          case 'filesystem':
            await client.connectToFilesystemServer('./data');
            break;
          case 'git':
            await client.connectToGitServer('.');
            break;
        }

        const tools = await client.listTools();
        console.log(chalk.green(`   ✅ ${server.name}: ${tools.length} tools available`));
        tools.slice(0, 3).forEach(tool => {
          console.log(chalk.gray(`      - ${tool.name}`));
        });
        
        await client.disconnect();
      } catch (error) {
        console.log(chalk.red(`   ❌ ${server.name}: Failed to connect`));
        console.log(chalk.gray(`      Error: ${error}`));
      }
      console.log();
    }
  });

// Show help if no arguments provided
if (process.argv.length === 2) {
  console.log(chalk.cyan('🚀 MCP CLI Tool - Real Server Edition'));
  console.log(chalk.gray('A TypeScript CLI with real MCP server integration\n'));
  
  console.log(chalk.yellow('🌟 Quick start with real MCP servers:'));
  console.log('   npm run weather -- --real --city "London"');
  console.log('   npm start mcp --server weather --list');
  console.log('   npm start servers');
  console.log();
  
  program.help();
}

program.parse();