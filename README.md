# MCP CLI Project (TypeScript)

A Command Line Interface (CLI) project demonstrating the **Model Context Protocol (MCP)** integration with custom tools, built in TypeScript.

## 🌟 Features

This CLI application showcases three main functionalities:

- **📝 Todo Management**: Add, list, mark done, and manage tasks
- **🧮 Calculator**: Perform basic and advanced mathematical calculations  
- **🌤️ Weather**: Get weather information (with optional MCP server integration)
- **🔌 MCP Integration**: Test and explore MCP servers with real-time tool discovery

## 📋 Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v8 or higher  
- **TypeScript**: v5.x (installed as dev dependency)

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

## 🛠️ Usage

### Basic Commands

#### Todo Management
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

#### Calculator
```bash
# Basic calculation
npm run calc "2 + 3 * 4"

# Advanced calculations with functions
npm run calc -- --advanced "sin(pi/2) + cos(0)"

# Examples of supported functions: sin, cos, tan, sqrt, log, exp, abs
npm run calc -- --advanced "sqrt(16) + log(10)"
```

#### Weather
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

#### MCP Server Testing
```bash
# Test weather MCP server
npm run build && node dist/src/index.js mcp --server weather --list

# Test filesystem MCP server 
npm run build && node dist/src/index.js mcp --server filesystem --path ./data --list

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
```

## 🏗️ Project Structure

```
mcp-cli-project-ts/
├── src/
│   ├── index.ts          # Main CLI entry point
│   └── mcp-client.ts     # MCP client implementation
├── tools/
│   ├── todo.ts           # Todo management functionality
│   ├── calculator.ts     # Calculator operations
│   └── weather.ts        # Weather tools with MCP integration
├── types/
│   ├── todo-types.ts     # Todo-related type definitions
│   ├── calculator-types.ts # Calculator type definitions
│   ├── weather-types.ts  # Weather type definitions
│   ├── mcp-types.ts      # MCP protocol types
│   └── cli-types.ts      # CLI-specific types
├── config/              # Configuration files (if any)
├── data/               # Data storage (todos.json, etc.)
├── dist/               # Compiled JavaScript output
├── package.json        # Project configuration and dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md          # This file
```

## 🔧 Architecture

### Core Components

1. **CLI Framework**: Built with [Commander.js](https://github.com/tj/commander.js/) for command parsing
2. **MCP Integration**: Uses [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) for protocol communication
3. **Type Safety**: Full TypeScript implementation with strict type checking
4. **Modular Design**: Separate tools for different functionalities

### MCP Integration

The project demonstrates real Model Context Protocol integration:

- **MCP Client**: Connects to various MCP servers (weather, filesystem, git)
- **Tool Discovery**: Dynamically lists available tools from connected servers
- **Resource Access**: Reads resources exposed by MCP servers
- **Error Handling**: Graceful fallbacks when MCP servers are unavailable

## 📚 Model Context Protocol (MCP)

This project showcases **MCP**, an open protocol for connecting AI applications with external data sources and tools. Key MCP concepts demonstrated:

- **Servers**: Provide tools, resources, and prompts
- **Clients**: Connect to servers and make requests  
- **Transports**: Communication channels (stdio, HTTP, SSE)
- **Tools**: Executable functions (like weather API calls)
- **Resources**: Data sources (like file contents)

### MCP Servers Used

- **Weather Server**: `@modelcontextprotocol/server-weather` - Real weather data
- **Filesystem Server**: `@modelcontextprotocol/server-filesystem` - File operations
- **Git Server**: `@modelcontextprotocol/server-git` - Git repository access

## 🧪 Testing

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

## 🔒 Security Considerations

- **Data Privacy**: Todo data stored locally in `data/todos.json`
- **MCP Safety**: All MCP server connections require explicit user consent
- **Input Validation**: Calculator expressions are sanitized for safety
- **Environment Variables**: Secure handling of API keys and credentials

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
- [Anthropic MCP Documentation](https://docs.anthropic.com/en/docs/build-with-claude/tool-use)

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

---

**Built with ❤️ using TypeScript and the Model Context Protocol** 