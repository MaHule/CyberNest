import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { platformBridge } from '../../services/bridge';
import { Tool } from '../../types';
import {
  Globe,
  ExternalLink,
  Copy,
  Check,
  Star,
  Plus,
  Search,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Bookmark
} from 'lucide-react';

export const WebToolsPage: React.FC = () => {
  const {
    tools,
    launchTool,
    toggleFavorite,
    deleteTool,
    startAddTool,
    startEditTool,
    isDarkTheme
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);

  // Filter only web tools
  const webTools = useMemo(() => {
    return tools.filter((t) => t.type === 'web');
  }, [tools]);

  // Extract unique tags present in web tools
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    webTools.forEach((t) => {
      t.tags?.forEach((tag) => set.add(tag));
    });
    return Array.from(set).sort();
  }, [webTools]);

  // Filtered list by query and tag
  const filteredTools = useMemo(() => {
    return webTools.filter((tool) => {
      if (selectedTag && !tool.tags?.includes(selectedTag)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.description?.toLowerCase().includes(q);
        const matchUrl = tool.targetPath.toLowerCase().includes(q);
        const matchTags = tool.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchUrl && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [webTools, selectedTag, searchQuery]);

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenUrl = (tool: Tool) => {
    launchTool(tool);
  };

  const getHostname = (urlStr: string) => {
    try {
      const u = new URL(urlStr.startsWith('http') ? urlStr : `https://${urlStr}`);
      return u.hostname;
    } catch {
      return urlStr;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Page Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1e293b]">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-[#f1f5f9] flex items-center space-x-2">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Web 在线工具枢纽</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-mono font-medium border border-emerald-200 dark:border-emerald-800/40">
              {filteredTools.length} / {webTools.length} 款在线平台
            </span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#94a3b8] mt-1">
            免本地下载安装，独立汇聚威胁情报、OSINT 测绘、编码解密与在线利用平台，支持一键浏览器访问
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => startAddTool(undefined, null, 'web')}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>添加 Web 工具</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Tag Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-[#1e293b]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索 Web 在线工具名称、域名、URL 或功能描述..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg text-xs text-slate-900 dark:text-[#f1f5f9] placeholder-slate-400 dark:placeholder-[#64748b] focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 dark:bg-[#0d121f] p-1 rounded-lg border border-slate-200 dark:border-[#1e293b]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#1e293b] text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f1f5f9]'
              }`}
              title="网格视图"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#1e293b] text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f1f5f9]'
              }`}
              title="列表视图"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Tag Filter Chips */}
      {availableTags.length > 0 && (
        <div className="flex items-center flex-wrap gap-1.5 text-xs">
          <span className="text-slate-500 dark:text-[#64748b] mr-1 text-[11px] font-medium">标签筛选:</span>
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={`px-2.5 py-1 rounded-md text-[11px] transition-all font-mono ${
              selectedTag === null
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#162032]'
            }`}
          >
            全部 ({webTools.length})
          </button>
          {availableTags.map((tag) => {
            const count = webTools.filter((t) => t.tags?.includes(tag)).length;
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all font-mono flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-medium shadow-sm'
                    : 'bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#162032]'
                }`}
              >
                <span>#{tag}</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Tools Grid / List View */}
      {filteredTools.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => {
              const hostname = getHostname(tool.targetPath);
              return (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/50 dark:hover:border-emerald-500/40 hover:shadow-md transition-all group relative"
                >
                  <div>
                    {/* Header: Domain Badge + Favorite + Actions */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-emerald-400/90 border border-slate-200 dark:border-emerald-900/30 truncate block">
                            {hostname}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(tool.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 dark:text-[#64748b] hover:text-amber-500 transition-colors"
                          title={tool.isFavorite ? '取消收藏' : '加入收藏'}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              tool.isFavorite
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-400 dark:text-[#64748b]'
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditTool(tool.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 dark:text-[#64748b] hover:text-slate-700 dark:hover:text-[#f1f5f9] transition-colors"
                          title="编辑工具"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setToolToDelete(tool)}
                          className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 dark:text-[#64748b] hover:text-red-500 transition-colors"
                          title="删除工具"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Tool Name & Description */}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-[#94a3b8] mt-1.5 line-clamp-2 leading-relaxed">
                      {tool.description || '暂无描述信息'}
                    </p>

                    {/* URL Snippet */}
                    <div className="mt-3 p-2 rounded-lg bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] flex items-center justify-between text-xs font-mono text-slate-600 dark:text-[#64748b]">
                      <span className="truncate mr-2 text-[11px]">{tool.targetPath}</span>
                      <button
                        type="button"
                        onClick={() => copyUrl(tool.targetPath, tool.id)}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#1e293b] text-slate-500 dark:text-[#94a3b8] hover:text-emerald-600 dark:hover:text-emerald-400 flex-shrink-0"
                        title="复制完整网址"
                      >
                        {copiedId === tool.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Tags */}
                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tool.tags.map((tag) => (
                          <span
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-[#94a3b8] hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Launch Button */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1e293b]/70 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-[#64748b] font-mono">
                      点击即刻唤起浏览器
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenUrl(tool)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
                    >
                      <span>打开站点</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List Mode */
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-[#1e293b]">
            {filteredTools.map((tool) => {
              const hostname = getHostname(tool.targetPath);
              return (
                <div
                  key={tool.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-[#162032]/40 transition-colors"
                >
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center flex-shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9] truncate">
                          {tool.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-900/30">
                          {hostname}
                        </span>
                        {tool.isFavorite && (
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-[#94a3b8] mt-0.5 truncate">
                        {tool.description || '暂无描述'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-[11px] font-mono text-slate-500 dark:text-[#64748b] truncate max-w-sm">
                          {tool.targetPath}
                        </span>
                        {tool.tags?.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-1 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-500 dark:text-[#94a3b8]"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => copyUrl(tool.targetPath, tool.id)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-600 dark:text-[#94a3b8] text-xs flex items-center space-x-1"
                      title="复制完整网址"
                    >
                      {copiedId === tool.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-600 dark:text-emerald-400">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenUrl(tool)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center space-x-1 shadow-sm"
                    >
                      <span>打开</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startEditTool(tool.id)}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 dark:text-[#64748b] hover:text-slate-700 dark:hover:text-[#f1f5f9]"
                      title="编辑"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setToolToDelete(tool)}
                      className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 dark:text-[#64748b] hover:text-red-500"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl p-12 text-center">
          <Globe className="w-10 h-10 text-slate-300 dark:text-[#334155] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#f1f5f9]">未发现匹配的 Web 工具</h3>
          <p className="text-xs text-slate-500 dark:text-[#64748b] mt-1 max-w-sm mx-auto">
            {searchQuery || selectedTag
              ? '当前筛选条件下暂无条目，您可以清除搜索词或重置标签筛选'
              : '当前尚未添加任何 Web 在线工具，点击下方按钮立即注册常用站点'}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            {(searchQuery || selectedTag) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTag(null);
                }}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#1e293b] text-xs text-slate-700 dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#162032]"
              >
                清除所有筛选
              </button>
            )}
            <button
              type="button"
              onClick={() => startAddTool(undefined, null, 'web')}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm"
            >
              + 登记首个 Web 工具
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {toolToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/40 flex items-center justify-center text-red-600 dark:text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9]">确认删除该 Web 工具？</h3>
                <p className="text-xs text-slate-500 dark:text-[#94a3b8] mt-0.5">
                  条目名称: <span className="font-semibold text-slate-800 dark:text-white">{toolToDelete.name}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#94a3b8]">
              删除后此条目将从工具库与独立列表中移除，该操作无法撤销。
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setToolToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#1e293b] text-xs text-slate-700 dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#162032]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteTool(toolToDelete.id);
                  setToolToDelete(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-sm"
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
export default WebToolsPage;
