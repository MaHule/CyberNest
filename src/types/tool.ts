export type ToolType = 'web' | 'exe' | 'script' | 'cheat_sheet';

export type ToolPlatform = 'all' | 'windows' | 'macos' | 'linux';

export interface Tool {
  id: string;
  name: string;
  description: string;
  type: ToolType;
  categoryId?: string | null;
  subcategoryId?: string | null;
  tags: string[];
  
  // Execution target
  targetPath: string; // URL for web, file path for exe/script, content for cheat_sheet
  defaultArgs?: string;
  workingDir?: string;
  platform?: ToolPlatform;
  
  // UI & Metadata
  icon?: string; // Lucide icon name or emoji or custom svg
  color?: string; // Accent color hex
  isFavorite: boolean;
  sortOrder: number;
  
  // Usage statistics
  usageCount: number;
  lastUsedAt?: string; // ISO string
  createdAt: string;
  updatedAt: string;
  
  // Security / Execution flags
  runAsAdmin?: boolean;
  openInTerminal?: boolean;
  environmentId?: string | null; // 独立配置的启动环境 ID
  notes?: string;
}
