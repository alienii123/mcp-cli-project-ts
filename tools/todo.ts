import fs from 'fs/promises';
import path from 'path';
import type { TodoItem, TodoStats } from '../types/todo-types.js';

export class TodoTool {
  private readonly todoFile: string;

  constructor(dataDir?: string) {
    const baseDir = dataDir || path.join(process.cwd(), 'data');
    this.todoFile = path.join(baseDir, 'todos.json');
    this.ensureDataDir();
  }

  private async ensureDataDir(): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.todoFile), { recursive: true });
    } catch (error) {
      // Directory already exists or other non-critical error
      console.warn('Could not create data directory:', error);
    }
  }

  async loadTasks(): Promise<TodoItem[]> {
    try {
      const data = await fs.readFile(this.todoFile, 'utf8');
      const tasks = JSON.parse(data) as TodoItem[];
      
      // Validate loaded data
      return tasks.filter(this.isValidTodoItem);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return []; // File doesn't exist yet
      }
      throw new Error(`Failed to load tasks: ${error}`);
    }
  }

  private isValidTodoItem(item: unknown): item is TodoItem {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof (item as TodoItem).id === 'number' &&
      typeof (item as TodoItem).text === 'string' &&
      typeof (item as TodoItem).done === 'boolean' &&
      typeof (item as TodoItem).created === 'string'
    );
  }

  async saveTasks(tasks: TodoItem[]): Promise<void> {
    try {
      await fs.writeFile(this.todoFile, JSON.stringify(tasks, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to save tasks: ${errorMessage}`);
    }
  }

  async addTask(text: string): Promise<string> {
    if (!text.trim()) {
      throw new Error('Task text cannot be empty');
    }

    try {
      const tasks = await this.loadTasks();
      const newTask: TodoItem = {
        id: Date.now(),
        text: text.trim(),
        done: false,
        created: new Date().toISOString()
      };
      
      tasks.push(newTask);
      await this.saveTasks(tasks);
      
      return `Added task: "${text}"`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to add task: ${errorMessage}`);
    }
  }

  async listTasks(): Promise<TodoItem[]> {
    return await this.loadTasks();
  }

  async markDone(id: number): Promise<string> {
    try {
      const tasks = await this.loadTasks();
      const task = tasks.find(t => t.id === id);
      
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }
      
      if (task.done) {
        return `Task "${task.text}" is already completed`;
      }
      
      task.done = true;
      task.completed = new Date().toISOString();
      
      await this.saveTasks(tasks);
      
      return `Marked task "${task.text}" as done`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to mark task as done: ${errorMessage}`);
    }
  }

  async clearCompleted(): Promise<string> {
    try {
      const tasks = await this.loadTasks();
      const activeTasks = tasks.filter(t => !t.done);
      
      await this.saveTasks(activeTasks);
      
      const removedCount = tasks.length - activeTasks.length;
      return `Removed ${removedCount} completed task${removedCount !== 1 ? 's' : ''}`;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to clear completed tasks: ${errorMessage}`);
    }
  }

  async getStats(): Promise<TodoStats> {
    const tasks = await this.loadTasks();
    const completedTasks = tasks.filter(t => t.done);
    const pendingTasks = tasks.filter(t => !t.done);

    return {
      total: tasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0
    };
  }
}