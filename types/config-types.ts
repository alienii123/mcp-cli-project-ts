export interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface ProjectConfig {
  servers: Record<string, MCPServerConfig>;
  defaultServer: string;
  dataDirectory?: string;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}