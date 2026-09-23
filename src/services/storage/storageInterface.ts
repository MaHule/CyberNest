import { Tool, Category, Tag, AppSettings, ExecutionLog } from '../../types';

export interface StorageService {
  init: () => Promise<void>;
  
  // Tools
  getTools: () => Promise<Tool[]>;
  getToolById: (id: string) => Promise<Tool | null>;
  saveTool: (tool: Tool) => Promise<Tool>;
  deleteTool: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<boolean>;
  recordToolUsage: (id: string) => Promise<void>;

  // Categories
  getCategories: () => Promise<Category[]>;
  saveCategory: (category: Category) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;
  reorderCategories: (orderedIds: string[]) => Promise<void>;

  // Tags
  getTags: () => Promise<Tag[]>;
  saveTag: (tag: Tag) => Promise<Tag>;
  deleteTag: (id: string) => Promise<boolean>;

  // Settings
  getSettings: () => Promise<AppSettings>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;

  // Logs
  getLogs: () => Promise<ExecutionLog[]>;
  addLog: (log: Omit<ExecutionLog, 'id' | 'timestamp'>) => Promise<ExecutionLog>;
  clearLogs: () => Promise<void>;

  // Import / Export
  exportAllData: () => Promise<string>;
  importAllData: (jsonData: string) => Promise<boolean>;
  resetToDefaults: () => Promise<void>;
}
