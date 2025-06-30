export interface MCPTool {
  name: string;
  description: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

export interface MCPToolCallResult {
  type: string;
  text?: string;
  data?: unknown;
}

export interface MCPClientConfig {
  name: string;
  version: string;
  capabilities: {
    tools: Record<string, unknown>;
  };
}

export interface TransportConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}