import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { z } from 'zod';
import type { 
  MCPTool, 
  MCPToolCallResult, 
  MCPClientConfig,
  TransportConfig 
} from '../types/mcp-types.js';

// Define Zod schemas for responses
const ListToolsResponseSchema = z.object({
  tools: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    inputSchema: z.object({
      type: z.string(),
      properties: z.record(z.any())
    }).optional()
  }))
});

const CallToolResponseSchema = z.object({
  content: z.array(z.object({
    type: z.string(),
    text: z.string().optional(),
    data: z.any().optional()
  }))
});

export class MCPClient {
  private client: Client | null = null;
  private transport: StdioClientTransport | null = null;
  private config: MCPClientConfig;
  private currentServerType: string = 'none';

  constructor(config?: Partial<MCPClientConfig>) {
    this.config = {
      name: 'mcp-cli-client',
      version: '1.0.0',
      capabilities: {
        tools: {}
      },
      ...config
    };
  }

  async connectToWeatherServer(): Promise<void> {
    console.log('🌤️ Connecting to weather MCP server...');
    
    const transportConfig: TransportConfig = {
      command: 'npx',
      args: ['@modelcontextprotocol/server-weather'],
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(([_, value]) => value !== undefined)
        ) as Record<string, string>,
        // Weather server doesn't require an API key for basic functionality
      }
    };

    await this.connect(transportConfig);
    this.currentServerType = 'weather';
  }

  async connectToFilesystemServer(allowedPath?: string): Promise<void> {
    console.log('📁 Connecting to filesystem MCP server...');
    
    const path = allowedPath || process.cwd();
    const transportConfig: TransportConfig = {
      command: 'npx',
      args: ['@modelcontextprotocol/server-filesystem', path],
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(([_, value]) => value !== undefined)
        ) as Record<string, string>,
      }
    };

    await this.connect(transportConfig);
    this.currentServerType = 'filesystem';
  }

  async connectToGitServer(repositoryPath?: string): Promise<void> {
    console.log('🔧 Connecting to git MCP server...');
    
    const repoPath = repositoryPath || process.cwd();
    const transportConfig: TransportConfig = {
      command: 'npx',
      args: ['@modelcontextprotocol/server-git', repoPath],
      env: {
        ...Object.fromEntries(
          Object.entries(process.env).filter(([_, value]) => value !== undefined)
        ) as Record<string, string>,
      }
    };

    await this.connect(transportConfig);
    this.currentServerType = 'git';
  }

  private async connect(transportConfig: TransportConfig): Promise<void> {
    try {
      // Clean up existing connection
      await this.disconnect();

      this.transport = new StdioClientTransport({
        command: transportConfig.command,
        args: transportConfig.args,
        env: transportConfig.env
      });

      this.client = new Client(
        {
          name: this.config.name,
          version: this.config.version
        },
        {
          capabilities: this.config.capabilities
        }
      );

      await this.client.connect(this.transport);
      console.log(`✅ Connected to ${this.currentServerType} MCP server`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to connect to MCP server: ${errorMessage}`);
    }
  }

  async listTools(): Promise<MCPTool[]> {
    if (!this.client) {
      throw new Error('Not connected to MCP server');
    }

    try {
      // Use the correct request format with proper Zod schema
      const response = await this.client.request({
        method: 'tools/list'
      }, ListToolsResponseSchema);

      const tools = response?.tools || [];
      
      if (!Array.isArray(tools)) {
        console.warn('Unexpected tools response format:', response);
        return [];
      }

      return tools.map(tool => ({
        name: tool.name || 'unknown',
        description: tool.description || 'No description available',
        inputSchema: tool.inputSchema || {
          type: 'object',
          properties: {}
        }
      })) as MCPTool[];

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to list tools: ${errorMessage}`);
    }
  }

  async callTool(name: string, arguments_: Record<string, unknown> = {}): Promise<MCPToolCallResult[]> {
    if (!this.client) {
      throw new Error('Not connected to MCP server');
    }

    try {
      const response = await this.client.request({
        method: 'tools/call',
        params: {
          name,
          arguments: arguments_
        }
      }, CallToolResponseSchema);

      const content = response?.content || [];

      if (!Array.isArray(content)) {
        console.warn('Unexpected tool call response format:', response);
        return [{
          type: 'text',
          text: JSON.stringify(response),
          data: response
        }];
      }

      return content.map(item => ({
        type: item.type || 'text',
        text: item.text || JSON.stringify(item),
        data: item.data || item
      })) as MCPToolCallResult[];

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to call tool '${name}': ${errorMessage}`);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (this.transport) {
        await this.transport.close();
        this.transport = null;
      }
      if (this.client) {
        this.client = null;
      }
      if (this.currentServerType !== 'none') {
        console.log(`🔌 Disconnected from ${this.currentServerType} MCP server`);
        this.currentServerType = 'none';
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Warning during disconnect: ${errorMessage}`);
    }
  }

  isConnected(): boolean {
    return this.client !== null && this.transport !== null;
  }

  isConnectedToServer(): boolean {
    return this.isConnected();
  }

  getCurrentServerType(): string {
    return this.currentServerType;
  }

  getConfig(): MCPClientConfig {
    return { ...this.config };
  }

  async connectToDefaultServer(): Promise<void> {
    console.log('🔌 Connecting to default weather server...');
    try {
      await this.connectToWeatherServer();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn(`Failed to connect to default server: ${errorMessage}`);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      if (!this.isConnected()) {
        return false;
      }
      
      // Try to list tools as a connection test
      await this.listTools();
      return true;
    } catch (error) {
      console.warn('Connection test failed:', error);
      return false;
    }
  }
}