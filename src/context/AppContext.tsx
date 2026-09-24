import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Tool,
  Category,
  Tag,
  AppSettings,
  ExecutionLog,
  NavigationTab,
  ToolType,
  ThemeMode,
  PocItem,
  ToolEnvironment
} from '../types';
import { storageService } from '../services/storage';
import { platformBridge } from '../services/bridge';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface AccentPreset {
  id: string;
  name: string;
  color: string;
  primary: string;
  hover: string;
  light: string;
  border: string;
  description: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  {
    id: 'cyber-sky',
    name: '科技天蓝',
    color: '#38bdf8',
    primary: '#0284c7',
    hover: '#0ea5e9',
    light: 'rgba(56, 189, 248, 0.15)',
    border: 'rgba(56, 189, 248, 0.35)',
    description: '经典网安科技蓝，沉稳敏捷',
  },
  {
    id: 'matrix-green',
    name: '矩阵荧绿',
    color: '#10b981',
    primary: '#059669',
    hover: '#10b981',
    light: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
    description: '黑客终端矩阵绿，对抗锐利',
  },
  {
    id: 'aurora-violet',
    name: '极光霓虹紫',
    color: '#a855f7',
    primary: '#7c3aed',
    hover: '#a855f7',
    light: 'rgba(168, 85, 247, 0.15)',
    border: 'rgba(168, 85, 247, 0.35)',
    description: '现代极光霓虹紫，高信息密度',
  },
  {
    id: 'solar-amber',
    name: '警示烈焰金',
    color: '#f59e0b',
    primary: '#d97706',
    hover: '#f59e0b',
    light: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.35)',
    description: '预警高亮烈焰金，洞悉态势',
  },
  {
    id: 'crimson-red',
    name: '炽热警报红',
    color: '#ef4444',
    primary: '#dc2626',
    hover: '#ef4444',
    light: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.35)',
    description: '应急响应与重保攻防红队',
  },
  {
    id: 'quantum-cyan',
    name: '量子幽青',
    color: '#06b6d4',
    primary: '#0891b2',
    hover: '#06b6d4',
    light: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.35)',
    description: '量子纵深安全感，清爽通透',
  },
];

export function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num) || c.length !== 6) {
    return `rgba(56, 189, 248, ${alpha})`;
  }
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function applyThemeAndAccent(theme: ThemeMode, accentColor?: string) {
  if (typeof document === 'undefined') return;

  // 1. Resolve Theme Mode (Dark / Light / System)
  let isDark = true;
  if (theme === 'system') {
    isDark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : true;
  } else if (theme === 'light') {
    isDark = false;
  } else {
    isDark = true;
  }

  const root = document.documentElement;
  if (isDark) {
    root.classList.remove('light');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
  }

  // 2. Resolve Accent Color and inject CSS variables
  const selectedAccent = accentColor || '#38bdf8';
  const preset = ACCENT_PRESETS.find(
    (p) => p.color.toLowerCase() === selectedAccent.toLowerCase()
  ) || {
    id: 'custom',
    name: '自定义风格',
    color: selectedAccent,
    primary: selectedAccent,
    hover: selectedAccent,
    light: hexToRgba(selectedAccent, 0.15),
    border: hexToRgba(selectedAccent, 0.35),
    description: '',
  };

  if (isDark) {
    root.style.setProperty('--accent-color', preset.color);
    root.style.setProperty('--accent-primary', preset.primary);
    root.style.setProperty('--accent-hover', preset.hover);
    root.style.setProperty('--accent-light', preset.light);
    root.style.setProperty('--accent-border', preset.border);
  } else {
    // In light mode, ensure accent text color is dark and saturated for clear readability
    root.style.setProperty('--accent-color', preset.primary);
    root.style.setProperty('--accent-primary', preset.primary);
    root.style.setProperty('--accent-hover', preset.hover);
    root.style.setProperty('--accent-light', hexToRgba(preset.primary, 0.1));
    root.style.setProperty('--accent-border', hexToRgba(preset.primary, 0.3));
  }
}

export function getCategoryBadgeStyle(catColor?: string, isDark: boolean = true) {
  const baseColor = catColor || '#38bdf8';
  if (isDark) {
    return {
      borderColor: `${baseColor}40`,
      color: baseColor,
      backgroundColor: `${baseColor}15`,
    };
  }
  // Light Mode high-contrast mapping for sharp category badge typography
  const lightColorMap: Record<string, string> = {
    '#38bdf8': '#0284c7', // Sky-600
    '#10b981': '#059669', // Emerald-600
    '#f59e0b': '#b45309', // Amber-700
    '#a855f7': '#7c3aed', // Purple-600
    '#ef4444': '#dc2626', // Red-600
    '#06b6d4': '#0891b2', // Cyan-600
    '#ec4899': '#db2777', // Pink-600
    '#64748b': '#475569', // Slate-600
  };
  const darkText = lightColorMap[baseColor.toLowerCase()] || baseColor;
  return {
    borderColor: `${darkText}40`,
    color: darkText,
    backgroundColor: `${darkText}12`,
  };
}

export interface InitialStudioCategory {
  categoryId?: string;
  subcategoryId?: string | null;
  type?: ToolType;
}

interface AppContextType {
  // Navigation & View
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Data
  tools: Tool[];
  categories: Category[];
  parentCategories: Category[];
  getSubcategories: (parentId: string) => Category[];
  tags: Tag[];
  settings: AppSettings;
  logs: ExecutionLog[];
  isLoading: boolean;
  isDarkTheme: boolean;
  
  // Filtering & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategoryFilter: string;
  selectedSubcategoryFilter: string | null;
  setSelectedCategoryFilter: (catId: string, subcatId?: string | null) => void;
  setSelectedSubcategoryFilter: (subcatId: string | null) => void;
  selectedTypeFilter: ToolType | 'all';
  setSelectedTypeFilter: (type: ToolType | 'all') => void;
  selectedTagFilter: string | null;
  setSelectedTagFilter: (tag: string | null) => void;
  filteredTools: Tool[];
  favoriteTools: Tool[];
  
  // Editing flow
  editingToolId: string | null;
  initialStudioCategory: InitialStudioCategory | null;
  startAddTool: (initialCategoryId?: string, initialSubcategoryId?: string | null, initialType?: ToolType) => void;
  startEditTool: (toolId: string) => void;
  cancelEditTool: () => void;
  
  // POC Data & Operations
  pocs: PocItem[];
  savePoc: (poc: PocItem) => Promise<PocItem>;
  deletePoc: (id: string) => Promise<void>;
  toggleFavoritePoc: (id: string) => Promise<void>;
  executePoc: (poc: PocItem, customTarget?: string) => Promise<void>;
  batchImportPocs: (newPocs: PocItem[]) => Promise<void>;
  
  // Environments Data & Operations (工具启动环境管理)
  environments: ToolEnvironment[];
  saveEnvironment: (env: ToolEnvironment) => Promise<ToolEnvironment>;
  deleteEnvironment: (id: string) => Promise<void>;
  setDefaultEnvironment: (id: string) => Promise<void>;

  // Actions
  launchTool: (tool: Tool, customArgs?: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  saveTool: (tool: Tool) => Promise<Tool>;
  deleteTool: (id: string) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  saveTag: (tag: Tag) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Modals & Command Palette
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [settings, setSettings] = useState<AppSettings>({} as AppSettings);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [pocs, setPocs] = useState<PocItem[]>([]);
  const [environments, setEnvironments] = useState<ToolEnvironment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilterState] = useState<string>('all');
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilterState] = useState<string | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<ToolType | 'all'>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  
  // Editing state
  const [editingToolId, setEditingToolId] = useState<string | null>(null);
  const [initialStudioCategory, setInitialStudioCategory] = useState<InitialStudioCategory | null>(null);
  
  // Command palette & Toasts
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = 'toast_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 3500;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const refreshData = async () => {
    try {
      await storageService.init();
      const [tList, cList, tagList, sObj, lList, pocList, envList] = await Promise.all([
        storageService.getTools(),
        storageService.getCategories(),
        storageService.getTags(),
        storageService.getSettings(),
        storageService.getLogs(),
        storageService.getPocs(),
        storageService.getEnvironments(),
      ]);
      setTools(tList);
      setCategories(cList.sort((a, b) => a.sortOrder - b.sortOrder));
      setTags(tagList);
      setSettings(sObj);
      setLogs(lList);
      setPocs(pocList);
      setEnvironments(envList);
      
      // Sync theme & accent color
      applyThemeAndAccent(sObj.theme, sObj.accentColor);
    } catch (err) {
      console.error('[AppContext] Failed to load initial data:', err);
      addToast({
        type: 'error',
        title: '数据加载异常',
        message: String(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Watch for theme / accent changes and system color scheme events
  useEffect(() => {
    if (settings.theme) {
      applyThemeAndAccent(settings.theme, settings.accentColor);
    }

    if (settings.theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        applyThemeAndAccent('system', settings.accentColor);
      };
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [settings.theme, settings.accentColor]);

  // Derived parent categories
  const parentCategories = useMemo(() => {
    return categories
      .filter((c) => !c.parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories]);

  // Helper to query subcategories of a given parent
  const getSubcategories = (parentId: string) => {
    return categories
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  // Unified Category Filter Setter
  const setSelectedCategoryFilter = (catId: string, subcatId?: string | null) => {
    if (catId === 'all') {
      setSelectedCategoryFilterState('all');
      setSelectedSubcategoryFilterState(null);
      return;
    }

    const targetCat = categories.find((c) => c.id === catId);
    if (targetCat && targetCat.parentId) {
      // If a subcategory ID was provided as the first argument
      setSelectedCategoryFilterState(targetCat.parentId);
      setSelectedSubcategoryFilterState(targetCat.id);
    } else {
      setSelectedCategoryFilterState(catId);
      setSelectedSubcategoryFilterState(subcatId !== undefined ? subcatId : null);
    }
  };

  const setSelectedSubcategoryFilter = (subcatId: string | null) => {
    if (!subcatId) {
      setSelectedSubcategoryFilterState(null);
      return;
    }
    const targetSub = categories.find((c) => c.id === subcatId);
    if (targetSub && targetSub.parentId) {
      setSelectedCategoryFilterState(targetSub.parentId);
    }
    setSelectedSubcategoryFilterState(subcatId);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  const startAddTool = (
    initialCategoryId?: string,
    initialSubcategoryId?: string | null,
    initialType?: ToolType
  ) => {
    setEditingToolId(null);
    if (initialCategoryId || initialType) {
      setInitialStudioCategory({
        categoryId: initialCategoryId,
        subcategoryId: initialSubcategoryId ?? null,
        type: initialType,
      });
    } else {
      setInitialStudioCategory(null);
    }
    setActiveTab('tool-studio');
  };

  const startEditTool = (toolId: string) => {
    setEditingToolId(toolId);
    setInitialStudioCategory(null);
    setActiveTab('tool-studio');
  };

  const cancelEditTool = () => {
    setEditingToolId(null);
    setInitialStudioCategory(null);
    setActiveTab('tools');
  };

  const launchTool = async (tool: Tool, customArgs?: string) => {
    try {
      const startTime = Date.now();
      const env = tool.environmentId ? environments.find((e) => e.id === tool.environmentId) : null;
      const result = await platformBridge.executeTool(tool, customArgs, env);
      const durationMs = Date.now() - startTime;

      // Update usage count in local memory and storage
      await storageService.recordToolUsage(tool.id);
      setTools((prev) =>
        prev.map((t) =>
          t.id === tool.id
            ? { ...t, usageCount: (t.usageCount || 0) + 1, lastUsedAt: new Date().toISOString() }
            : t
        )
      );

      // Record log
      const newLog = await storageService.addLog({
        toolId: tool.id,
        toolName: tool.name,
        toolType: tool.type,
        status: result.success ? 'success' : 'error',
        commandPreview: result.commandExecuted || tool.targetPath,
        durationMs,
      });
      setLogs((prev) => [newLog, ...prev.slice(0, 99)]);

      if (result.success) {
        addToast({
          type: 'success',
          title: '工具已调用',
          message: result.message,
        });
      } else {
        addToast({
          type: 'error',
          title: '执行未成功',
          message: result.message,
        });
      }
    } catch (err) {
      console.error('[LaunchTool Error]:', err);
      addToast({
        type: 'error',
        title: '工具启动异常',
        message: String(err),
      });
    }
  };

  const toggleFavorite = async (id: string) => {
    const isFav = await storageService.toggleFavorite(id);
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: isFav } : t))
    );
    const targetTool = tools.find((t) => t.id === id);
    addToast({
      type: 'info',
      title: isFav ? '已加入收藏' : '已取消收藏',
      message: targetTool?.name,
      duration: 2000,
    });
  };

  const saveTool = async (toolData: Tool): Promise<Tool> => {
    const saved = await storageService.saveTool(toolData);
    await refreshData();
    addToast({
      type: 'success',
      title: '工具已保存',
      message: saved.name,
    });
    return saved;
  };

  const deleteTool = async (id: string) => {
    const target = tools.find((t) => t.id === id);
    await storageService.deleteTool(id);
    setTools((prev) => prev.filter((t) => t.id !== id));
    addToast({
      type: 'warning',
      title: '已移除工具',
      message: target?.name,
    });
  };

  const saveCategory = async (category: Category) => {
    await storageService.saveCategory(category);
    await refreshData();
    addToast({
      type: 'success',
      title: '分类已更新',
      message: category.name,
    });
  };

  const deleteCategory = async (id: string) => {
    if (selectedCategoryFilter === id || selectedSubcategoryFilter === id) {
      setSelectedCategoryFilterState('all');
      setSelectedSubcategoryFilterState(null);
    }
    await storageService.deleteCategory(id);
    await refreshData();
    addToast({
      type: 'warning',
      title: '分类已删除',
    });
  };

  const saveTag = async (tag: Tag) => {
    await storageService.saveTag(tag);
    await refreshData();
    addToast({
      type: 'success',
      title: '标签已保存',
      message: '#' + tag.name,
    });
  };

  const deleteTag = async (id: string) => {
    await storageService.deleteTag(id);
    await refreshData();
  };

  // POC actions
  const savePoc = async (pocData: PocItem): Promise<PocItem> => {
    const saved = await storageService.savePoc(pocData);
    await refreshData();
    addToast({
      type: 'success',
      title: 'POC 模板已保存',
      message: saved.name,
    });
    return saved;
  };

  const deletePoc = async (id: string) => {
    const target = pocs.find((p) => p.id === id);
    await storageService.deletePoc(id);
    setPocs((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'warning',
      title: '已移除 POC 条目',
      message: target?.name,
    });
  };

  const toggleFavoritePoc = async (id: string) => {
    const isFav = await storageService.toggleFavoritePoc(id);
    setPocs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: isFav } : p))
    );
    const target = pocs.find((p) => p.id === id);
    addToast({
      type: 'info',
      title: isFav ? '已加入收藏' : '已取消收藏',
      message: target?.name,
      duration: 2000,
    });
  };

  const executePoc = async (poc: PocItem, customTarget?: string) => {
    await storageService.recordPocUsage(poc.id);
    setPocs((prev) =>
      prev.map((p) => (p.id === poc.id ? { ...p, usageCount: (p.usageCount || 0) + 1 } : p))
    );
    if (poc.targetPath) {
      let cmd = poc.targetPath;
      if (customTarget) {
        cmd = cmd.replace(/{TARGET}/g, customTarget);
      }
      await platformBridge.openTerminal(cmd);
      addToast({
        type: 'success',
        title: '已调用 POC 验证命令',
        message: cmd,
      });
    } else if (poc.templateContent) {
      await navigator.clipboard.writeText(poc.templateContent);
      addToast({
        type: 'success',
        title: 'POC 验证模板已复制到剪贴板',
        message: poc.name,
      });
    }
  };

  const batchImportPocs = async (newPocs: PocItem[]) => {
    for (const p of newPocs) {
      await storageService.savePoc(p);
    }
    await refreshData();
    addToast({
      type: 'success',
      title: '批量导入成功',
      message: `已新增 ${newPocs.length} 份 POC 验证模板`,
    });
  };

  // Environment actions (工具启动环境管理)
  const saveEnvironment = async (envData: ToolEnvironment): Promise<ToolEnvironment> => {
    const saved = await storageService.saveEnvironment(envData);
    await refreshData();
    addToast({
      type: 'success',
      title: '环境配置已保存',
      message: saved.name,
    });
    return saved;
  };

  const deleteEnvironment = async (id: string) => {
    const target = environments.find((e) => e.id === id);
    await storageService.deleteEnvironment(id);
    await refreshData();
    addToast({
      type: 'warning',
      title: '已删除环境配置',
      message: target?.name,
    });
  };

  const setDefaultEnvironment = async (id: string) => {
    await storageService.setDefaultEnvironment(id);
    await refreshData();
    addToast({
      type: 'success',
      title: '已设为默认环境',
    });
  };

  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = await storageService.saveSettings(newSettings);
    setSettings(updated);
    applyThemeAndAccent(updated.theme, updated.accentColor);
    addToast({
      type: 'success',
      title: '系统设置已更新',
    });
  };

  const resetToDefaults = async () => {
    await storageService.resetToDefaults();
    await refreshData();
    setSelectedCategoryFilterState('all');
    setSelectedSubcategoryFilterState(null);
    applyThemeAndAccent('dark', '#38bdf8');
    addToast({
      type: 'info',
      title: '已重置为出厂预设',
    });
  };

  // Hierarchical filtered tools computation
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      // Category & Subcategory filter
      if (selectedCategoryFilter !== 'all') {
        if (selectedSubcategoryFilter) {
          // Specific subcategory selected
          const matchesSub = tool.subcategoryId === selectedSubcategoryFilter;
          const matchesDirect = tool.categoryId === selectedSubcategoryFilter;
          if (!matchesSub && !matchesDirect) {
            return false;
          }
        } else {
          // Parent category selected: match tools directly assigned to parent OR belonging to any of its subcategories
          const subcategoryIds = categories.filter((c) => c.parentId === selectedCategoryFilter).map((c) => c.id);
          const matchesParent = tool.categoryId === selectedCategoryFilter;
          const matchesSub = Boolean(tool.subcategoryId && subcategoryIds.includes(tool.subcategoryId));
          if (!matchesParent && !matchesSub) {
            return false;
          }
        }
      }
      // Type filter
      if (selectedTypeFilter !== 'all' && tool.type !== selectedTypeFilter) {
        return false;
      }
      // Tag filter
      if (selectedTagFilter && !tool.tags.includes(selectedTagFilter)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tool.name.toLowerCase().includes(q);
        const matchesDesc = tool.description?.toLowerCase().includes(q);
        const matchesPath = tool.targetPath?.toLowerCase().includes(q);
        const matchesTags = tool.tags?.some((tag) => tag.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesPath && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [tools, categories, selectedCategoryFilter, selectedSubcategoryFilter, selectedTypeFilter, selectedTagFilter, searchQuery]);

  const favoriteTools = useMemo(() => {
    return tools.filter((t) => t.isFavorite);
  }, [tools]);

  const isDarkTheme = useMemo(() => {
    if (settings.theme === 'light') return false;
    if (settings.theme === 'dark') return true;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  }, [settings.theme]);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        toggleSidebar,
        tools,
        categories,
        parentCategories,
        getSubcategories,
        tags,
        settings,
        logs,
        isLoading,
        isDarkTheme,
        searchQuery,
        setSearchQuery,
        selectedCategoryFilter,
        selectedSubcategoryFilter,
        setSelectedCategoryFilter,
        setSelectedSubcategoryFilter,
        selectedTypeFilter,
        setSelectedTypeFilter,
        selectedTagFilter,
        setSelectedTagFilter,
        filteredTools,
        favoriteTools,
        editingToolId,
        initialStudioCategory,
        startAddTool,
        startEditTool,
        cancelEditTool,
        launchTool,
        toggleFavorite,
        saveTool,
        deleteTool,
        pocs,
        savePoc,
        deletePoc,
        toggleFavoritePoc,
        executePoc,
        batchImportPocs,
        environments,
        saveEnvironment,
        deleteEnvironment,
        setDefaultEnvironment,
        saveCategory,
        deleteCategory,
        saveTag,
        deleteTag,
        updateSettings,
        resetToDefaults,
        refreshData,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
