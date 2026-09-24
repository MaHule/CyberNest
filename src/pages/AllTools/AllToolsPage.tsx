import React, { useState } from 'react';
import { useApp, getCategoryBadgeStyle } from '../../context/AppContext';
import { Tool, ToolType } from '../../types';
import {
  Search,
  LayoutGrid,
  List,
  Star,
  Play,
  Edit2,
  Trash2,
  Globe,
  Terminal,
  FileCode,
  Bookmark,
  Plus,
  X,
  ChevronRight,
  Filter
} from 'lucide-react';

export const AllToolsPage: React.FC = () => {
  const {
    tools,
    filteredTools,
    categories,
    parentCategories,
    getSubcategories,
    tags,
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
    launchTool,
    toggleFavorite,
    deleteTool,
    startAddTool,
    startEditTool,
    isDarkTheme,
  } = useApp();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);

  const typeOptions: { id: ToolType | 'all'; label: string }[] = [
    { id: 'all', label: '全部类型' },
    { id: 'exe', label: '本地程序' },
    { id: 'script', label: '脚本/CLI' },
    { id: 'web', label: 'Web工具' },
    { id: 'cheat_sheet', label: '备忘手册' },
  ];

  const handleConfirmDelete = async () => {
    if (toolToDelete) {
      await deleteTool(toolToDelete.id);
      setToolToDelete(null);
    }
  };

  // Subcategories of currently selected parent
  const activeParentSubcategories =
    selectedCategoryFilter !== 'all' ? getSubcategories(selectedCategoryFilter) : [];

  const activeParentCat = categories.find((c) => c.id === selectedCategoryFilter);
  const activeSubCat = selectedSubcategoryFilter
    ? categories.find((c) => c.id === selectedSubcategoryFilter)
    : null;

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto w-full">
      {/* 1. Header with Title & Add Tool CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-bold text-[#f1f5f9] flex items-center space-x-2">
            <span>全部安全工具库</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e293b] text-[#38bdf8] font-mono">
              {filteredTools.length} 款工具
            </span>
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            左侧导航聚焦核心战术大类，右侧细化战术子类场景与免提调用
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            startAddTool(
              selectedCategoryFilter !== 'all' ? selectedCategoryFilter : undefined,
              selectedSubcategoryFilter
            )
          }
          className="px-3.5 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新建安全工具</span>
        </button>
      </div>

      {/* 2. Filter & Toolbar */}
      <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
        {/* Row 1: Search, Parent Category Selector, View Switcher */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="快速检索工具名称、说明、路径或标签 (如: nmap, proxy, poc)..."
              className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#f1f5f9] placeholder-[#64748b] transition-colors focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[#64748b] hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Parent Category Dropdown */}
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value, null)}
              className="bg-[#0d121f] border border-[#1e293b] text-xs text-[#f1f5f9] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="all">全部分类 ({parentCategories.length} 大类)</option>
              {parentCategories.map((cat) => {
                const subCount = getSubcategories(cat.id).length;
                return (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {subCount > 0 ? `(${subCount}子类)` : ''}
                  </option>
                );
              })}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#0d121f] border border-[#1e293b] rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${
                  viewMode === 'grid' ? 'bg-[#162032] text-[#38bdf8]' : 'text-[#64748b] hover:text-white'
                }`}
                title="网格卡片视图"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${
                  viewMode === 'list' ? 'bg-[#162032] text-[#38bdf8]' : 'text-[#64748b] hover:text-white'
                }`}
                title="高密度列表视图"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Type Filter Pills + Active Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1e293b]/70">
          {/* Type Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
            {typeOptions.map((opt) => {
              const active = selectedTypeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedTypeFilter(opt.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    active
                      ? 'bg-[#0284c7] text-white shadow-sm'
                      : 'bg-[#0d121f] text-[#94a3b8] hover:bg-[#162032] hover:text-[#f1f5f9] border border-[#1e293b]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Active Breadcrumb Badges */}
          <div className="flex items-center space-x-2">
            {selectedCategoryFilter !== 'all' && activeParentCat && (
              <div className="flex items-center space-x-1.5 bg-[#162032] border border-[#38bdf8]/30 px-2 py-0.5 rounded text-[11px] text-[#38bdf8]">
                <span>分类: {activeParentCat.name}</span>
                {activeSubCat && (
                  <>
                    <span className="opacity-50">›</span>
                    <span className="font-semibold text-slate-800 dark:text-white font-sans">{activeSubCat.name}</span>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('all', null)}
                  className="hover:text-slate-900 dark:hover:text-white ml-0.5"
                  title="清除分类筛选"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {selectedTagFilter && (
              <div className="flex items-center space-x-1.5 bg-[#0284c7]/20 border border-[#0284c7]/40 px-2 py-0.5 rounded text-[11px] text-[#38bdf8]">
                <span>标签: #{selectedTagFilter}</span>
                <button
                  type="button"
                  onClick={() => setSelectedTagFilter(null)}
                  className="hover:text-slate-900 dark:hover:text-white"
                  title="清除标签筛选"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Subcategories Strip on the Right: 子类在右侧清晰展示与快捷筛选 */}
      {selectedCategoryFilter !== 'all' && activeParentCat ? (
        <div className="p-3.5 rounded-xl bg-[#111827] border border-[#1e293b] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center space-x-3 min-w-0">
            <span
              className="w-3.5 h-3.5 rounded-md flex-shrink-0 shadow-sm"
              style={{ backgroundColor: activeParentCat.color || '#38bdf8' }}
            />
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-[#f1f5f9]">{activeParentCat.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1e293b] text-[#94a3b8]">
                  一级大类
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('all', null)}
                  className="text-xs text-[#38bdf8] hover:underline ml-1"
                >
                  查看全部大类
                </button>
              </div>
              {activeParentCat.description && (
                <div className="text-xs text-[#64748b] truncate mt-0.5 max-w-lg">
                  {activeParentCat.description}
                </div>
              )}
            </div>
          </div>

          {/* Subcategory Pills */}
          {activeParentSubcategories.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 flex-1 md:justify-end">
              <span className="text-xs text-[#64748b] mr-1 hidden lg:inline">细分子类:</span>
              {/* All subcategories button */}
              <button
                type="button"
                onClick={() => setSelectedSubcategoryFilter(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  !selectedSubcategoryFilter
                    ? 'bg-[#0284c7] text-white shadow-sm font-semibold'
                    : 'bg-[#0d121f] text-[#94a3b8] hover:text-white hover:bg-[#162032] border border-[#1e293b]'
                }`}
              >
                全部子类 ({
                  tools.filter(
                    (t) =>
                      t.categoryId === activeParentCat.id ||
                      (t.subcategoryId &&
                        activeParentSubcategories.some((s) => s.id === t.subcategoryId))
                  ).length
                })
              </button>

              {/* Subcategories buttons */}
              {activeParentSubcategories.map((sub) => {
                const isSelected = selectedSubcategoryFilter === sub.id;
                const count = tools.filter(
                  (t) => t.subcategoryId === sub.id || t.categoryId === sub.id
                ).length;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubcategoryFilter(isSelected ? null : sub.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#0284c7] text-white shadow-sm font-semibold'
                        : 'bg-[#0d121f] text-[#94a3b8] hover:text-white hover:bg-[#162032] border border-[#1e293b]'
                    }`}
                  >
                    <span>{sub.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#1e293b] text-[#64748b]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-xs text-[#64748b]">该大类暂未划分细分子类</div>
          )}
        </div>
      ) : (
        /* When "All Categories" is active, show quick category jump ribbon */
        <div className="p-3 rounded-xl bg-[#111827] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#94a3b8]">快捷切换大类:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 flex-1 sm:justify-end">
            {parentCategories.map((cat) => {
              const subcategories = getSubcategories(cat.id);
              const subIds = subcategories.map((s) => s.id);
              const count = tools.filter(
                (t) =>
                  t.categoryId === cat.id ||
                  (t.subcategoryId && subIds.includes(t.subcategoryId))
              ).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat.id, null)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0d121f] hover:bg-[#162032] hover:text-[#38bdf8] border border-[#1e293b] text-[#cbd5e1] transition-all flex items-center space-x-1.5"
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color || '#38bdf8' }}
                  />
                  <span>{cat.name}</span>
                  <span className="text-[10px] font-mono text-[#64748b]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Main Tools Content Display */}
      {filteredTools.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#162032] text-[#64748b] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="text-sm font-medium text-[#f1f5f9]">没有找到符合条件的工具条目</div>
          <p className="text-xs text-[#64748b] max-w-sm mx-auto">
            请尝试调整搜索关键词、重置筛选分类，或在此战术分类下登记新工具
          </p>
          <div className="pt-2 flex items-center justify-center space-x-3">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('all', null);
                setSelectedTypeFilter('all');
                setSelectedTagFilter(null);
              }}
              className="px-3 py-1.5 rounded-lg border border-[#1e293b] text-xs text-[#94a3b8] hover:text-white hover:bg-[#162032]"
            >
              清除全部筛选
            </button>
            <button
              type="button"
              onClick={() =>
                startAddTool(
                  selectedCategoryFilter !== 'all' ? selectedCategoryFilter : undefined,
                  selectedSubcategoryFilter
                )
              }
              className="px-3 py-1.5 rounded-lg bg-[#0284c7] text-white text-xs font-medium hover:bg-[#0369a1]"
            >
              在此分类下新建工具
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => {
            const parentCat = categories.find((c) => c.id === tool.categoryId);
            const subCat = tool.subcategoryId
              ? categories.find((c) => c.id === tool.subcategoryId)
              : null;

            return (
              <div
                key={tool.id}
                className="group p-4 rounded-xl bg-[#111827] border border-[#1e293b] hover:border-[#38bdf8]/50 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Top Header: Icon + Name + Category Breadcrumb + Star */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-[#162032] border border-[#1e293b] flex items-center justify-center flex-shrink-0">
                        {tool.type === 'web' ? (
                          <Globe className="w-4 h-4 text-emerald-400" />
                        ) : tool.type === 'script' ? (
                          <FileCode className="w-4 h-4 text-amber-400" />
                        ) : tool.type === 'cheat_sheet' ? (
                          <Bookmark className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Terminal className="w-4 h-4 text-[#38bdf8]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-[#f1f5f9] group-hover:text-[#38bdf8] transition-colors truncate">
                          {tool.name}
                        </h3>
                        {/* Category Breadcrumb Badge */}
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          {parentCat ? (
                            <span
                              className="text-[10px] px-1.5 py-0.2 rounded border flex items-center space-x-1 font-mono"
                              style={getCategoryBadgeStyle(parentCat.color, isDarkTheme)}
                            >
                              <span>{parentCat.name}</span>
                              {subCat && (
                                <>
                                  <span className="opacity-40 text-[9px]">›</span>
                                  <span className="text-slate-800 dark:text-[#e2e8f0] font-medium font-sans">
                                    {subCat.name}
                                  </span>
                                </>
                              )}
                            </span>
                          ) : tool.type === 'web' ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-mono">
                              Web 在线工具
                            </span>
                          ) : tool.type === 'cheat_sheet' ? (
                            <span className="text-[10px] px-1.5 py-0.2 rounded border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 font-mono">
                              渗透备忘手册
                            </span>
                          ) : null}
                          <span className="text-[10px] text-[#64748b] font-mono uppercase">
                            {tool.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(tool.id)}
                      className={`p-1 hover:scale-110 transition-transform ${
                        tool.isFavorite ? 'text-amber-400' : 'text-[#64748b] hover:text-amber-400'
                      }`}
                      title={tool.isFavorite ? '取消常驻收藏' : '加入常驻收藏'}
                    >
                      <Star className={`w-4 h-4 ${tool.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#94a3b8] mt-2.5 line-clamp-2 leading-relaxed">
                    {tool.description || '暂无工具详细描述信息'}
                  </p>

                  {/* Tags */}
                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {tool.tags.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTagFilter(t === selectedTagFilter ? null : t)}
                          className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                            selectedTagFilter === t
                              ? 'bg-[#0284c7] text-white border-[#0284c7]'
                              : 'bg-[#0d121f] text-[#64748b] border-[#1e293b] hover:text-[#38bdf8]'
                          }`}
                        >
                          #{t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer: Metadata & Actions */}
                <div className="mt-4 pt-3 border-t border-[#1e293b]/70 flex items-center justify-between">
                  <div className="text-[11px] text-[#64748b] font-mono">
                    已调 {tool.usageCount || 0} 次
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => startEditTool(tool.id)}
                      className="p-1.5 rounded hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors"
                      title="编辑工具参数"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setToolToDelete(tool)}
                      className="p-1.5 rounded hover:bg-[#1e293b] text-[#94a3b8] hover:text-rose-400 transition-colors"
                      title="移出工具库"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => launchTool(tool)}
                      className="px-2.5 py-1 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-medium flex items-center space-x-1 transition-all shadow-sm"
                      title="本地运行/浏览器打开"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>唤醒</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW (High Information Density) */
        <div className="rounded-xl bg-[#111827] border border-[#1e293b] overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1e293b] bg-[#0d121f] text-[#64748b] font-mono">
                <th className="py-2.5 px-3 w-10 text-center">★</th>
                <th className="py-2.5 px-3">工具名称</th>
                <th className="py-2.5 px-3">所属战术架构 (大类 › 子类)</th>
                <th className="py-2.5 px-3">形态</th>
                <th className="py-2.5 px-3">目标/执行路径</th>
                <th className="py-2.5 px-3 text-right">调用频次</th>
                <th className="py-2.5 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filteredTools.map((tool) => {
                const parentCat = categories.find((c) => c.id === tool.categoryId);
                const subCat = tool.subcategoryId
                  ? categories.find((c) => c.id === tool.subcategoryId)
                  : null;

                return (
                  <tr key={tool.id} className="hover:bg-[#162032]/50 transition-colors">
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(tool.id)}
                        className={`hover:scale-110 transition-transform ${
                          tool.isFavorite ? 'text-amber-400' : 'text-[#64748b]'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${tool.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#f1f5f9]">
                      <div className="flex items-center space-x-2">
                        <span>{tool.name}</span>
                        {tool.notes && (
                          <span className="text-[10px] text-[#64748b] font-mono">[注]</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {parentCat ? (
                        <div className="flex items-center space-x-1.5 truncate">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: parentCat.color || '#38bdf8' }}
                          />
                          <span className="text-[#f1f5f9] truncate">{parentCat.name}</span>
                          {subCat && (
                            <>
                              <span className="text-[#64748b]">›</span>
                              <span className="text-[#38bdf8] truncate font-medium">
                                {subCat.name}
                              </span>
                            </>
                          )}
                        </div>
                      ) : tool.type === 'web' ? (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                          Web 独立工具
                        </span>
                      ) : tool.type === 'cheat_sheet' ? (
                        <span className="text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                          备忘手册
                        </span>
                      ) : (
                        <span className="text-[#64748b]">-</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 uppercase font-mono text-[10px] text-[#94a3b8]">
                      {tool.type}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#64748b] max-w-xs truncate">
                      {tool.targetPath}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#94a3b8]">
                      {tool.usageCount || 0}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => startEditTool(tool.id)}
                          className="p-1 rounded text-[#64748b] hover:text-white hover:bg-[#1e293b]"
                          title="编辑"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setToolToDelete(tool)}
                          className="p-1 rounded text-[#64748b] hover:text-rose-400 hover:bg-[#1e293b]"
                          title="删除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => launchTool(tool)}
                          className="p-1 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white"
                          title="启动"
                        >
                          <Play className="w-3 h-3 fill-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {toolToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-semibold text-sm text-[#f1f5f9]">确认移除工具</h3>
            <p className="text-xs text-[#94a3b8]">
              确定要删除 <strong className="text-slate-900 dark:text-white">“{toolToDelete.name}”</strong> 吗？
              该操作不可撤销。
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setToolToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-[#1e293b] text-xs text-[#94a3b8] hover:text-slate-900 dark:hover:text-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs text-white font-medium"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
