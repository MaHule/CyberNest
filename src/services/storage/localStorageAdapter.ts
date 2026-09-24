import { Tool, Category, Tag, AppSettings, ExecutionLog, PocItem, ToolEnvironment } from '../../types';
import { StorageService } from './storageInterface';
import { SEED_CATEGORIES, SEED_TAGS, SEED_TOOLS, DEFAULT_SETTINGS, SEED_POCS, SEED_ENVIRONMENTS } from './seedData';

const STORAGE_KEYS = {
  TOOLS: 'cybernest_tools_v1',
  CATEGORIES: 'cybernest_categories_v1',
  TAGS: 'cybernest_tags_v1',
  SETTINGS: 'cybernest_settings_v1',
  LOGS: 'cybernest_logs_v1',
  POCS: 'cybernest_pocs_v1',
  ENVIRONMENTS: 'cybernest_environments_v1',
  INITIALIZED: 'cybernest_initialized_v1',
  VERSION: 'cybernest_version_v2',
  VERSION_V3: 'cybernest_version_v3',
  VERSION_V4: 'cybernest_version_v4',
  VERSION_V5: 'cybernest_version_v5',
};

class LocalStorageService implements StorageService {
  async init(): Promise<void> {
    const isInit = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    const hasV2 = localStorage.getItem(STORAGE_KEYS.VERSION);
    const hasV3 = localStorage.getItem(STORAGE_KEYS.VERSION_V3);
    const hasV4 = localStorage.getItem(STORAGE_KEYS.VERSION_V4);
    const hasV5 = localStorage.getItem(STORAGE_KEYS.VERSION_V5);

    if (!isInit) {
      console.log('[Storage] Initializing first-run seed data with hierarchical categories, POCs, and environments...');
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(SEED_TAGS));
      localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(SEED_TOOLS));
      localStorage.setItem(STORAGE_KEYS.POCS, JSON.stringify(SEED_POCS));
      localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(SEED_ENVIRONMENTS));
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
      localStorage.setItem(STORAGE_KEYS.VERSION_V3, 'true');
      localStorage.setItem(STORAGE_KEYS.VERSION_V4, 'true');
      localStorage.setItem(STORAGE_KEYS.VERSION_V5, 'true');
      return;
    }

    // Auto-migrate from V1 to V2
    if (!hasV2) {
      try {
        console.log('[Storage] Migrating category hierarchy to V2...');
        const existingCatsRaw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        let currentCats: Category[] = existingCatsRaw ? JSON.parse(existingCatsRaw) : [];
        
        const hasSubcategories = currentCats.some((c) => Boolean(c.parentId));
        if (!hasSubcategories) {
          const catMap = new Map<string, Category>();
          currentCats.forEach((c) => {
            catMap.set(c.id, { ...c, parentId: c.parentId || null });
          });
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

        localStorage.setItem(STORAGE_KEYS.VERSION, 'true');
      } catch (err) {
        console.error('[Storage] Migration to V2 failed:', err);
      }
    }

    // Auto-migrate to V3: Separate Web tools and Cheat sheets from tactical categories
    if (!hasV3) {
      try {
        console.log('[Storage] Migrating to V3: decoupling web tools and cheat sheets...');
        // 1. Remove cat-8 and its subcategories from tactical categories
        const existingCatsRaw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        if (existingCatsRaw) {
          let currentCats: Category[] = JSON.parse(existingCatsRaw);
          currentCats = currentCats.filter((c) => c.id !== 'cat-8' && c.parentId !== 'cat-8');
          localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(currentCats));
        }

        // 2. Unbind tools from cat-8 and merge new standalone web tools & cheat sheets
        const existingToolsRaw = localStorage.getItem(STORAGE_KEYS.TOOLS);
        if (existingToolsRaw) {
          let currentTools: Tool[] = JSON.parse(existingToolsRaw);
          currentTools.forEach((t) => {
            if (t.categoryId === 'cat-8' || t.subcategoryId === 'cat-8-1' || t.subcategoryId === 'cat-8-2') {
              t.categoryId = '';
              t.subcategoryId = null;
            }
          });
          const existingIds = new Set(currentTools.map((t) => t.id));
          SEED_TOOLS.forEach((st) => {
            if (!existingIds.has(st.id)) {
              currentTools.push(st);
            }
          });
          localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(currentTools));
        }

        // 3. Merge new tags
        const existingTagsRaw = localStorage.getItem(STORAGE_KEYS.TAGS);
        if (existingTagsRaw) {
          let currentTags: Tag[] = JSON.parse(existingTagsRaw);
          const tagNames = new Set(currentTags.map((t) => t.name));
          SEED_TAGS.forEach((st) => {
            if (!tagNames.has(st.name)) {
              currentTags.push(st);
            }
          });
          localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(currentTags));
        }

        localStorage.setItem(STORAGE_KEYS.VERSION_V3, 'true');
      } catch (err) {
        console.error('[Storage] Migration to V3 failed:', err);
      }
    }

    // Auto-migrate from V3 to V4: Seed POCs
    if (!hasV4) {
      try {
        console.log('[Storage] Migrating to V4: Seeding POC validation templates...');
        const existingPocsRaw = localStorage.getItem(STORAGE_KEYS.POCS);
        if (!existingPocsRaw) {
          localStorage.setItem(STORAGE_KEYS.POCS, JSON.stringify(SEED_POCS));
        }
        localStorage.setItem(STORAGE_KEYS.VERSION_V4, 'true');
      } catch (err) {
        console.error('[Storage] Migration to V4 failed:', err);
      }
    }

    // Auto-migrate to V5: Seed Environments (Java/Python/Proxy runtimes)
    if (!hasV5) {
      try {
        console.log('[Storage] Migrating to V5: Seeding Tool Environments...');
        const existingEnvsRaw = localStorage.getItem(STORAGE_KEYS.ENVIRONMENTS);
        if (!existingEnvsRaw) {
          localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(SEED_ENVIRONMENTS));
        }
        localStorage.setItem(STORAGE_KEYS.VERSION_V5, 'true');
      } catch (err) {
        console.error('[Storage] Migration to V5 failed:', err);
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
    const remainingParent = filtered.find((c) => !c.parentId);
    let toolsChanged = false;
    tools.forEach((t) => {
      if (t.categoryId && idsToDelete.has(t.categoryId)) {
        // If parent category deleted, reassign to remaining parent category or empty
        t.categoryId = remainingParent ? remainingParent.id : '';
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

  // POCs Management
  async getPocs(): Promise<PocItem[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.POCS);
    return raw ? JSON.parse(raw) : SEED_POCS;
  }

  async getPocById(id: string): Promise<PocItem | null> {
    const pocs = await this.getPocs();
    return pocs.find((p) => p.id === id) || null;
  }

  async savePoc(poc: PocItem): Promise<PocItem> {
    const pocs = await this.getPocs();
    const existingIndex = pocs.findIndex((p) => p.id === poc.id);

    let updated: PocItem;
    if (existingIndex >= 0) {
      updated = { ...pocs[existingIndex], ...poc, updatedAt: new Date().toISOString() };
      pocs[existingIndex] = updated;
    } else {
      updated = {
        ...poc,
        id: poc.id || 'poc_' + Date.now().toString(36),
        usageCount: poc.usageCount || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      pocs.unshift(updated);
    }

    localStorage.setItem(STORAGE_KEYS.POCS, JSON.stringify(pocs));
    return updated;
  }

  async deletePoc(id: string): Promise<boolean> {
    const pocs = await this.getPocs();
    const filtered = pocs.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.POCS, JSON.stringify(filtered));
    return true;
  }

  async toggleFavoritePoc(id: string): Promise<boolean> {
    const pocs = await this.getPocs();
    const target = pocs.find((p) => p.id === id);
    if (target) {
      target.isFavorite = !target.isFavorite;
      target.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.POCS, JSON.stringify(pocs));
      return target.isFavorite;
    }
    return false;
  }

  async recordPocUsage(id: string): Promise<void> {
    const pocs = await this.getPocs();
    const target = pocs.find((p) => p.id === id);
    if (target) {
      target.usageCount = (target.usageCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.POCS, JSON.stringify(pocs));
    }
  }

  // Environments (启动环境配置管理)
  async getEnvironments(): Promise<ToolEnvironment[]> {
    const raw = localStorage.getItem(STORAGE_KEYS.ENVIRONMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(SEED_ENVIRONMENTS));
      return SEED_ENVIRONMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_ENVIRONMENTS;
    }
  }

  async getEnvironmentById(id: string): Promise<ToolEnvironment | null> {
    const envs = await this.getEnvironments();
    return envs.find((e) => e.id === id) || null;
  }

  async saveEnvironment(env: ToolEnvironment): Promise<ToolEnvironment> {
    const envs = await this.getEnvironments();
    const now = new Date().toISOString();
    const idx = envs.findIndex((e) => e.id === env.id);
    let updated: ToolEnvironment;

    if (idx >= 0) {
      updated = { ...env, updatedAt: now };
      envs[idx] = updated;
    } else {
      updated = {
        ...env,
        id: env.id || `env-${Date.now().toString(36)}`,
        createdAt: now,
        updatedAt: now,
      };
      envs.push(updated);
    }

    localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(envs));
    return updated;
  }

  async deleteEnvironment(id: string): Promise<boolean> {
    const envs = await this.getEnvironments();
    const filtered = envs.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(filtered));
    return true;
  }

  async setDefaultEnvironment(id: string): Promise<void> {
    const envs = await this.getEnvironments();
    const target = envs.find((e) => e.id === id);
    if (!target) return;
    const updated = envs.map((e) => ({
      ...e,
      isDefault: e.type === target.type ? e.id === id : e.isDefault,
    }));
    localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(updated));
  }

  async exportAllData(): Promise<string> {
    const backup = {
      version: '3.1.0',
      exportedAt: new Date().toISOString(),
      tools: await this.getTools(),
      pocs: await this.getPocs(),
      environments: await this.getEnvironments(),
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
      if (Array.isArray(data.pocs)) {
        localStorage.setItem(STORAGE_KEYS.POCS, JSON.stringify(data.pocs));
      }
      if (Array.isArray(data.environments)) {
        localStorage.setItem(STORAGE_KEYS.ENVIRONMENTS, JSON.stringify(data.environments));
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
    localStorage.removeItem(STORAGE_KEYS.VERSION_V3);
    localStorage.removeItem(STORAGE_KEYS.VERSION_V4);
    localStorage.removeItem(STORAGE_KEYS.VERSION_V5);
    localStorage.removeItem(STORAGE_KEYS.ENVIRONMENTS);
    await this.init();
  }
}

export const storageService = new LocalStorageService();
