export interface TodoItem {
  id: number;
  text: string;
  done: boolean;
  created: string;
  completed?: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}