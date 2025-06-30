export class MCPError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'MCPError';
  }
}

export class ToolError extends Error {
  constructor(
    message: string,
    public readonly toolName: string,
    public readonly operation?: string
  ) {
    super(message);
    this.name = 'ToolError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}