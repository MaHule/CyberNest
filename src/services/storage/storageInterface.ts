import { Tool, Category, Tag, AppSettings, ExecutionLog, PocItem, ToolEnvironment } from '../../types';

export interface StorageService {
  init: () => Promise<void>;
  
  // Tools
  getTools: () => Promise<Tool[]>;
  getToolById: (id: string) => Promise<Tool | null>;
  saveTool: (tool: Tool) => Promise<Tool>;
  deleteTool: (id: string) => Promise<boolean>;
  toggleFavorite: (id: string) => Promise<boolean>;
  recordToolUsage: (id: string) => Promise<void>;

  // Environments (启动环境配置管理)
  getEnvironments: () => Promise<ToolEnvironment[]>;
  getEnvironmentById: (id: string) => Promise<ToolEnvironment | null>;
  saveEnvironment: (env: ToolEnvironment) => Promise<ToolEnvironment>;
  deleteEnvironment: (id: string) => Promise<boolean>;
  setDefaultEnvironment: (id: string) => Promise<void>;

  // POCs
  getPocs: () => Promise<PocItem[]>;
  getPocById: (id: string) => Promise<PocItem | null>;
  savePoc: (poc: PocItem) => Promise<PocItem>;
  deletePoc: (id: string) => Promise<boolean>;
  toggleFavoritePoc: (id: string) => Promise<boolean>;
  recordPocUsage: (id: string) => Promise<void>;

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
