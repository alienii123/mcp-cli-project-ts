# MCP CLI Project (TypeScript)

A comprehensive Command Line Interface (CLI) project demonstrating **Model Context Protocol (MCP)** integration with multiple tools and servers, built in TypeScript.

## 🌟 Features

This CLI application showcases five main functionalities:

- **📝 Todo Management**: Add, list, mark done, and manage tasks
- **🧮 Calculator**: Perform basic and advanced mathematical calculations  
- **🌤️ Weather**: Get weather information with MCP server integration
- **🐙 GitHub Integration**: Comprehensive GitHub analysis, search, and discovery tools
- **🔌 MCP Integration**: Test and explore multiple MCP servers with real-time tool discovery

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v8 or higher  
- **TypeScript**: v5.x (installed as dev dependency)
- **GitHub Personal Access Token** (optional): For enhanced GitHub functionality

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd mcp-cli-project-ts
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Set up GitHub token** (optional but recommended):
   ```bash
   npm run github:setup
   ```

## 🛠️ Usage

### Todo Management
```bash
# List all tasks
npm run todo -- --list

# Add a new task
npm run todo -- --add "Learn MCP protocol"

# Mark a task as done (use task ID from list)
npm run todo -- --done 1

# Clear completed tasks
npm run todo -- --clear

# Show todo statistics
npm run todo -- --stats
```

### Calculator
```bash
# Basic calculation
npm run calc "2 + 3 * 4"

# Advanced calculations with functions
npm run calc -- --advanced "sin(pi/2) + cos(0)"

# Examples of supported functions: sin, cos, tan, sqrt, log, exp, abs
npm run calc -- --advanced "sqrt(16) + log(10)"
```

### Weather
```bash
# Get weather for default city (San Francisco)
npm run weather

# Get weather for specific city
npm run weather -- --city "New York"

# Test with real MCP weather server
npm run weather -- --real --city "London"

# Test multiple MCP weather servers
npm run weather -- --test --city "Tokyo"
```

### 🐙 GitHub Integration (NEW!)

#### Quick Start
```bash
# Test GitHub MCP server connection
npm run github connect

# Discover all available GitHub tools
npm run github tools

# Run comprehensive GitHub experiments
npm run github experiments
```

#### Search & Discovery
```bash
# Search repositories
npm run github search --repos "typescript"
npm run github search --repos "machine-learning" --limit 10

# Search users
npm run github search --users "developer-name"

# Search code patterns
npm run github search --code "async function" --lang typescript
```

#### Analysis & Insights
```bash
# Analyze trending repositories
npm run github trending

# Get developer insights
npm run github developer octocat
npm run github developer microsoft

# Explore technology communities  
npm run github community "machine-learning"
npm run github community "typescript"

# Analyze code patterns across GitHub
npm run github pattern "interface"
npm run github pattern "async/await"
```

#### Comprehensive Experiments
```bash
# Run all experiments for a topic
npm run github experiments --topic "python"
npm run github experiments --topic "react"

# Run GitHub test suite
npm run github:test
```

### MCP Server Testing
```bash
# Test weather MCP server
npm run build && node dist/src/index.js mcp --server weather --list

# Test filesystem MCP server 
npm run build && node dist/src/index.js mcp --server filesystem --path ./data --list

# Test GitHub MCP server
npm run build && node dist/src/index.js mcp --server github --list

# Test specific MCP tool
npm run build && node dist/src/index.js mcp --server weather --test get_weather
```

### Development Commands

```bash
# Development mode with auto-reload
npm run dev

# Watch mode (auto-rebuild on changes)
npm run watch

# Type checking without compilation
npm run type-check

# Clean build artifacts
npm run clean

# GitHub setup helper
npm run github:setup

# GitHub testing suite
npm run github:test
```

## 🏗️ Project Structure

```
mcp-cli-project-ts/
├── src/
│   ├── index.ts          # Main CLI entry point
│   ├── mcp-client.ts     # MCP client implementation
│   └── github-cli.ts     # GitHub CLI interface (NEW!)
├── tools/
│   ├── todo.ts           # Todo management functionality
│   ├── calculator.ts     # Calculator operations
│   ├── weather.ts        # Weather tools with MCP integration
│   └── github.ts         # GitHub analysis tools (NEW!)
├── types/
│   ├── todo-types.ts     # Todo-related type definitions
│   ├── calculator-types.ts # Calculator type definitions
│   ├── weather-types.ts  # Weather type definitions
│   ├── mcp-types.ts      # MCP protocol types
│   ├── cli-types.ts      # CLI-specific types
│   ├── config-types.ts   # Configuration types (NEW!)
│   └── errors.ts         # Error handling types (NEW!)
├── config/
│   ├── mcp-config.json   # MCP server configurations
│   └── github-experiments.json # GitHub experiment presets (NEW!)
├── scripts/
│   ├── setup-github.sh   # GitHub setup script (NEW!)
│   └── test-github-experiments.sh # GitHub test suite (NEW!)
├── data/                 # Data storage (todos.json, etc.)
├── dist/                 # Compiled JavaScript output
├── package.json          # Project configuration and dependencies
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🔧 Architecture

### Core Components

1. **CLI Framework**: Built with [Commander.js](https://github.com/tj/commander.js/) for command parsing
2. **MCP Integration**: Uses [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) for protocol communication
3. **Type Safety**: Full TypeScript implementation with strict type checking
4. **Modular Design**: Separate tools for different functionalities
5. **GitHub Integration**: Advanced GitHub analysis and discovery capabilities

### MCP Integration

The project demonstrates real Model Context Protocol integration with multiple servers:

- **MCP Client**: Connects to various MCP servers (weather, filesystem, git, github)
- **Tool Discovery**: Dynamically lists available tools from connected servers
- **Resource Access**: Reads resources exposed by MCP servers
- **Error Handling**: Graceful fallbacks when MCP servers are unavailable
- **Multi-Server Support**: Manages connections to multiple MCP servers simultaneously

## 📚 Model Context Protocol (MCP)

This project showcases **MCP**, an open protocol for connecting AI applications with external data sources and tools. Key MCP concepts demonstrated:

- **Servers**: Provide tools, resources, and prompts
- **Clients**: Connect to servers and make requests  
- **Transports**: Communication channels (stdio, HTTP, SSE)
- **Tools**: Executable functions (like GitHub API calls, weather data)
- **Resources**: Data sources (like file contents, repository data)

### MCP Servers Used

- **Weather Server**: `@modelcontextprotocol/server-weather` - Real weather data
- **Filesystem Server**: `@modelcontextprotocol/server-filesystem` - File operations
- **Git Server**: `@modelcontextprotocol/server-git` - Git repository access
- **GitHub Server**: `@modelcontextprotocol/server-github` - GitHub API integration (NEW!)

## 🐙 GitHub MCP Integration

### Features

The GitHub integration provides comprehensive analysis and discovery capabilities:

#### 🔍 **Search & Discovery**
- **Repository Search**: Find repositories by topic, language, stars, creation date
- **User Search**: Discover developers and organizations
- **Code Search**: Find code patterns across GitHub (requires authentication)
- **Advanced Filtering**: Date ranges, star counts, language filters

#### 📊 **Analysis & Insights**
- **Trending Analysis**: Discover trending repositories and technologies
- **Developer Insights**: Analyze developer profiles, repositories, and activity
- **Community Explorer**: Explore technology communities and ecosystems
- **Code Pattern Analysis**: Analyze usage patterns of programming constructs
- **Language Distribution**: Statistical analysis of programming languages

#### 🧪 **Experiments**
- **Technology Trends**: Comprehensive analysis of technology adoption
- **Ecosystem Exploration**: Deep dive into technology communities
- **Developer Profiling**: Detailed analysis of developer contributions
- **Pattern Discovery**: Find interesting code patterns and practices

### GitHub Tools Available (26 total)

The GitHub MCP server provides access to 26 powerful tools:

**Repository Management:**
- `search_repositories` - Search GitHub repositories
- `create_repository` - Create new repositories
- `fork_repository` - Fork repositories
- `get_file_contents` - Read file contents
- `create_or_update_file` - Create/update files
- `push_files` - Batch file operations

**Issue & PR Management:**
- `list_issues` - List repository issues
- `create_issue` - Create new issues
- `update_issue` - Update existing issues
- `add_issue_comment` - Comment on issues
- `list_pull_requests` - List pull requests
- `create_pull_request` - Create pull requests
- `merge_pull_request` - Merge pull requests

**Search & Discovery:**
- `search_code` - Search code across GitHub
- `search_issues` - Search issues and PRs
- `search_users` - Search GitHub users

**And many more advanced tools for repository analysis and management**

### Authentication

For full GitHub functionality, set up a GitHub Personal Access Token:

1. **Generate token**: Visit https://github.com/settings/tokens
2. **Required scopes**: `repo` (for repository access)
3. **Set environment variable**:
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
   ```
4. **Verify setup**:
   ```bash
   npm run github connect
   ```

**Without token**: Basic search works with rate limits
**With token**: Full API access (5000 requests/hour) + private repositories

## 🧪 Testing

### Basic Functionality Tests
```bash
# Test todo functionality
npm run todo -- --add "Test task" && npm run todo -- --list

# Test calculator
npm run calc "sqrt(25)" && npm run calc -- --advanced "sin(pi/4)"

# Test weather (local simulation)
npm run weather -- --city "Paris"

# Test MCP integration
npm run build && node dist/src/index.js mcp --list
```

### GitHub Integration Tests
```bash
# Quick connectivity test
npm run github connect

# Test repository search
npm run github search --repos "typescript"

# Test trending analysis
npm run github trending

# Test developer analysis
npm run github developer octocat

# Run comprehensive test suite
npm run github:test

# Test specific experiments
npm run github experiments --topic "machine-learning"
```

## 🔒 Security Considerations

- **Data Privacy**: Todo data stored locally in `data/todos.json`
- **MCP Safety**: All MCP server connections require explicit user consent
- **Input Validation**: Calculator expressions are sanitized for safety
- **Environment Variables**: Secure handling of API keys and credentials
- **GitHub Token**: Store securely, never commit to version control
- **Rate Limiting**: Respects GitHub API rate limits and provides graceful degradation

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Start in development mode
```

### Production Build
```bash
npm run build
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
CMD ["node", "dist/src/index.js"]
```

## 📊 Examples

### Adding and Managing Todos
```bash
$ npm run todo -- --add "Learn TypeScript"
✅ Added task: "Learn TypeScript"

$ npm run todo -- --add "Build MCP client"  
✅ Added task: "Build MCP client"

$ npm run todo -- --list
📝 Your tasks:
  ⏳ 1698123456789: Learn TypeScript (10/24/2023)
  ⏳ 1698123456790: Build MCP client (10/24/2023)

$ npm run todo -- --done 1698123456789
✅ Marked task "Learn TypeScript" as done

$ npm run todo -- --stats
📊 Todo Statistics:
   Total tasks: 2
   Completed: 1  
   Pending: 1
   Completion rate: 50.0%
```

### Calculator Examples
```bash
$ npm run calc "2 + 3 * 4"
🧮 Calculating: 2 + 3 * 4
Result: 14

$ npm run calc -- --advanced "sqrt(16) + sin(pi/2)"
🧮 Calculating: sqrt(16) + sin(pi/2)
Result: 5
Processed: Math.sqrt(16) + Math.sin(Math.PI/2)
```

### Weather with MCP
```bash
$ npm run weather -- --city "London" --real
🌤️ Getting weather for London...
📡 Connecting to real MCP weather server...
✅ Connected to weather MCP server
🌤️ London: Partly cloudy, 18°C, Humidity: 65%, Wind: 12 km/h
```

### GitHub Analysis Examples
```bash
$ npm run github trending
🚀 === TRENDING ANALYSIS EXPERIMENT === 🚀
📈 Top Trending Repositories:
  1. deepseek-ai/DeepSeek-V3
     ⭐ 15,234 stars | 💻 Python
     📝 Advanced AI reasoning model

  2. cline/cline  
     ⭐ 8,567 stars | 💻 TypeScript
     📝 Autonomous coding agent right in your IDE

$ npm run github developer microsoft
👨‍💻 === DEVELOPER INSIGHTS: microsoft === 👨‍💻
📊 Repository Statistics:
  📁 Total Repositories: 1,247
  ⭐ Total Stars: 2,847,392
  📈 Average Stars per Repo: 2,284.5

💻 Programming Languages:
  TypeScript: 234 repos (18.8%)
  Python: 187 repos (15.0%)
  JavaScript: 156 repos (12.5%)

$ npm run github community "machine-learning"
🌐 === COMMUNITY EXPLORER: "machine-learning" === 🌐
📚 Top Repositories:
  1. josephmisiti/awesome-machine-learning
     ⭐ 67,234 stars | 💻 Python
     📝 A curated list of awesome Machine Learning frameworks

👥 Community Members:
  1. Machine-Learning-Tokyo
     👥 1,234 followers | 📁 45 repos
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Links

- [Model Context Protocol Specification](https://spec.modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Community Servers](https://github.com/modelcontextprotocol/servers)
- [GitHub MCP Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [Anthropic MCP Documentation](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)

## 🎯 What's New

### v1.1.0 - GitHub Integration
- ✨ **New**: Complete GitHub MCP server integration
- 🔍 **New**: Advanced repository search and analysis
- 📊 **New**: Developer insights and community exploration
- 🧪 **New**: Technology trend analysis experiments
- 🛠️ **New**: 26 GitHub API tools via MCP
- 📝 **New**: Comprehensive testing suite
- 🚀 **New**: Setup automation scripts

### Previous Features
- 📝 Todo management system
- 🧮 Advanced calculator with mathematical functions
- 🌤️ Weather information with MCP integration
- 🔌 Multi-server MCP client support

---

**Built with ❤️ using TypeScript and the Model Context Protocol**

*Explore the power of MCP with real GitHub integration, advanced analysis tools, and comprehensive development workflows.* 