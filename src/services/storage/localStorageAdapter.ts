import { Tool, Category, Tag, AppSettings, ExecutionLog } from '../../types';
import { StorageService } from './storageInterface';
import { SEED_CATEGORIES, SEED_TAGS, SEED_TOOLS, DEFAULT_SETTINGS } from './seedData';

const STORAGE_KEYS = {
  TOOLS: 'cybernest_tools_v1',
  CATEGORIES: 'cybernest_categories_v1',
  TAGS: 'cybernest_tags_v1',
  SETTINGS: 'cybernest_settings_v1',
  LOGS: 'cybernest_logs_v1',
  INITIALIZED: 'cybernest_initialized_v1',
  VERSION: 'cybernest_version_v2',
};

class LocalStorageService implements StorageService {
  async init(): Promise<void> {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    const hasV2 = localStorage.getItem(STORAGE_KEYS.VERSION);

    if (!isInit) {
      console.log('[Storage] Initializing first-run seed data with hierarchical categories...');
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(SEED_TAGS));
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(SEED_TOOLS));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([
        {
          id: 'log-1',
          toolId: 'tool-1',
          toolName: 'Burp Suite Professional',
          toolType: 'exe',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'success',
          commandPreview: 'BurpSuitePro.exe',
          durationMs: 120
        },
        {
          id: 'log-2',
          toolId: 'tool-2',
          toolName: 'Nmap Network Scanner',
          toolType: 'exe',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: 'success',
          commandPreview: 'nmap.exe -sV -sC -T4 10.10.10.25',
          durationMs: 450
        }
      ]));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      localStorage.setItem(STORAGE_KEYS.VERSION, 'true');
      return;
    }

    // Auto-migrate from V1 to V2 (Enrich hierarchical categories and seed tool subcategory bindings)
    if (!hasV2) {
      try {
        console.log('[Storage] Migrating category hierarchy to V2...');
        const existingCatsRaw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        let currentCats: Category[] = existingCatsRaw ? JSON.parse(existingCatsRaw) : [];
        
        // Check if subcategories already exist
        const hasSubcategories = currentCats.some((c) => Boolean(c.parentId));
        if (!hasSubcategories) {
          // Merge seed subcategories into current categories
          const catMap = new Map<string, Category>();
          // Keep user modifications to existing categories
          currentCats.forEach((c) => {
            catMap.set(c.id, { ...c, parentId: c.parentId || null });
          });
          // Add missing seed categories and subcategories
          SEED_CATEGORIES.forEach((sc) => {
            if (!catMap.has(sc.id)) {
              catMap.set(sc.id, sc);
            } else {
              const existing = catMap.get(sc.id)!;
              if (sc.parentId && !existing.parentId) {
                existing.parentId = sc.parentId;
              }
            }
          });
          currentCats = Array.from(catMap.values());
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(currentCats));
        }

        // Check if existing tools need subcategory mapping
        const existingToolsRaw = localStorage.getItem(STORAGE_KEYS.TOOLS);
        if (existingToolsRaw) {
          const currentTools: Tool[] = JSON.parse(existingToolsRaw);
          const seedMap = new Map(SEED_TOOLS.map((t) => [t.id, t]));
          let modified = false;
          currentTools.forEach((t) => {
            if (!t.subcategoryId && seedMap.has(t.id)) {
              const seed = seedMap.get(t.id)!;
              if (seed.subcategoryId) {
                t.subcategoryId = seed.subcategoryId;
                modified = true;
              }
            }
          });
          if (modified) {
            localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(currentTools));
          }
        }

        localStorage.setItem(STORAGE_KEYS.VERSION, 'true');
      } catch (err) {
        console.error('[Storage] Migration to V2 failed:', err);
      }
    }
  }

  async getTools(): Promise<Tool[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.TOOLS);
    return raw ? JSON.parse(raw) : SEED_TOOLS;
  }

  async getToolById(id: string): Promise<Tool | null> {
    const tools = await this.getTools();
    return tools.find((t) => t.id === id) || null;
  }

  async saveTool(tool: Tool): Promise<Tool> {
    const tools = await this.getTools();
    const existingIndex = tools.findIndex((t) => t.id === tool.id);
    
    let updated: Tool;
    if (existingIndex >= 0) {
      updated = { ...tools[existingIndex], ...tool, updatedAt: new Date().toISOString() };
      tools[existingIndex] = updated;
    } else {
      updated = {
        ...tool,
        id: tool.id || 'tool_' + Date.now().toString(36),
        usageCount: tool.usageCount || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      tools.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(tools));
    return updated;
  }

  async deleteTool(id: string): Promise<boolean> {
    const tools = await this.getTools();
    const filtered = tools.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(filtered));
    return true;
  }

  async toggleFavorite(id: string): Promise<boolean> {
    const tools = await this.getTools();
    const tool = tools.find((t) => t.id === id);
    if (tool) {
      tool.isFavorite = !tool.isFavorite;
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(tools));
      return tool.isFavorite;
    }
    return false;
  }

  async recordToolUsage(id: string): Promise<void> {
    const tools = await this.getTools();
    const tool = tools.find((t) => t.id === id);
    if (tool) {
      tool.usageCount = (tool.usageCount || 0) + 1;
      tool.lastUsedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(tools));
    }
  }

  async getCategories(): Promise<Category[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : SEED_CATEGORIES;
  }

  async saveCategory(category: Category): Promise<Category> {
    const list = await this.getCategories();
    const idx = list.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      list[idx] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(list));
    return category;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const list = await this.getCategories();
    // Cascade delete: if this is a parent, also delete child categories
    const idsToDelete = new Set<string>([id]);
    list.forEach((c) => {
      if (c.parentId === id) {
        idsToDelete.add(c.id);
      }
    });

    const filtered = list.filter((c) => !idsToDelete.has(c.id));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));

    // Also update tools that were in the deleted categories
    const tools = await this.getTools();
    let toolsChanged = false;
    tools.forEach((t) => {
      if (idsToDelete.has(t.categoryId)) {
        // If parent category deleted, reassign to uncategorized or first remaining
        t.categoryId = filtered[0]?.id || 'cat-1';
        t.subcategoryId = undefined;
        toolsChanged = true;
      } else if (t.subcategoryId && idsToDelete.has(t.subcategoryId)) {
        t.subcategoryId = undefined;
        toolsChanged = true;
      }
    });
    if (toolsChanged) {
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(tools));
    }

    return true;
  }

  async reorderCategories(orderedIds: string[]): Promise<void> {
    const list = await this.getCategories();
    const map = new Map(list.map((c) => [c.id, c]));
    const reordered: Category[] = [];
    orderedIds.forEach((id, index) => {
      const cat = map.get(id);
      if (cat) {
        cat.sortOrder = index + 1;
        reordered.push(cat);
      }
    });
    // Add any categories not in orderedIds to the end
    list.forEach((c) => {
      if (!orderedIds.includes(c.id)) {
        reordered.push(c);
      }
    });
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(reordered));
  }

  async getTags(): Promise<Tag[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.TAGS);
    return raw ? JSON.parse(raw) : SEED_TAGS;
  }

  async saveTag(tag: Tag): Promise<Tag> {
    const tags = await this.getTags();
    const idx = tags.findIndex((t) => t.id === tag.id);
    if (idx >= 0) {
      tags[idx] = tag;
    } else {
      tags.push(tag);
    }
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    return tag;
  }

  async deleteTag(id: string): Promise<boolean> {
    const tags = await this.getTags();
    const filtered = tags.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(filtered));
    return true;
  }

  async getSettings(): Promise<AppSettings> {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  async getLogs(): Promise<ExecutionLog[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    return raw ? JSON.parse(raw) : [];
  }

  async addLog(log: Omit<ExecutionLog, 'id' | 'timestamp'>): Promise<ExecutionLog> {
    const logs = await this.getLogs();
    const newLog: ExecutionLog = {
      ...log,
      id: 'log_' + Date.now().toString(36),
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    // Keep max 100 logs
    const trimmed = logs.slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(trimmed));
    return newLog;
  }

  async clearLogs(): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([]));
  }

  async exportAllData(): Promise<string> {
    const backup = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      tools: await this.getTools(),
      categories: await this.getCategories(),
      tags: await this.getTags(),
      settings: await this.getSettings(),
    };
    return JSON.stringify(backup, null, 2);
  }

  async importAllData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data.tools)) {
        localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(data.tools));
      }
      if (Array.isArray(data.categories)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
      }
      if (Array.isArray(data.tags)) {
        localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(data.tags));
      }
      if (data.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      }
      return true;
    } catch (e) {
      console.error('[Storage] Failed to parse import JSON:', e);
      return false;
    }
  }

  async resetToDefaults(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    localStorage.removeItem(STORAGE_KEYS.VERSION);
    await this.init();
  }
}

export const storageService = new LocalStorageService();
