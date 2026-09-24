import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Tool } from '../../types';
import {
  Bookmark,
  Terminal,
  Copy,
  Check,
  Star,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sliders,
  Shield,
  FileCode,
  Flame,
  Info,
  CornerDownRight,
  ExternalLink
} from 'lucide-react';

export const CheatSheetsPage: React.FC = () => {
  const {
    tools,
    launchTool,
    toggleFavorite,
    deleteTool,
    startAddTool,
    startEditTool,
    isDarkTheme
  } = useApp();

  // Attack Parameters for live substitution
  const [lhost, setLhost] = useState('10.10.14.8');
  const [lport, setLport] = useState('4444');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toolToDelete, setToolToDelete] = useState<Tool | null>(null);

  // Filter only cheat sheets
  const cheatSheets = useMemo(() => {
    return tools.filter((t) => t.type === 'cheat_sheet');
  }, [tools]);

  // Extract unique tags
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    cheatSheets.forEach((t) => {
      t.tags?.forEach((tag) => set.add(tag));
    });
    return Array.from(set).sort();
  }, [cheatSheets]);

  // Substitute {LHOST} and {LPORT}
  const substituteCommand = (rawText: string, currentHost: string, currentPort: string) => {
    if (!rawText) return '';
    let result = rawText;
    result = result.replace(/{LHOST}/g, currentHost.trim() || '10.10.14.8');
    result = result.replace(/{lhost}/g, currentHost.trim() || '10.10.14.8');
    result = result.replace(/{LPORT}/g, currentPort.trim() || '4444');
    result = result.replace(/{lport}/g, currentPort.trim() || '4444');
    result = result.replace(/{PORT}/g, currentPort.trim() || '4444');
    return result;
  };

  // Filtered list
  const filteredSheets = useMemo(() => {
    return cheatSheets.filter((tool) => {
      if (selectedTag && !tool.tags?.includes(selectedTag)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = tool.name.toLowerCase().includes(q);
        const matchDesc = tool.description?.toLowerCase().includes(q);
        const matchCmd = tool.targetPath.toLowerCase().includes(q);
        const matchNotes = tool.notes?.toLowerCase().includes(q);
        const matchTags = tool.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchCmd && !matchNotes && !matchTags) {
          return false;
        }
      }
      return true;
    });
  }, [cheatSheets, selectedTag, searchQuery]);

  const handleCopy = async (tool: Tool) => {
    const substituted = substituteCommand(tool.targetPath, lhost, lport);
    await navigator.clipboard.writeText(substituted);
    setCopiedId(tool.id);
    setTimeout(() => setCopiedId(null), 2000);
    // Also record usage execution in audit logs
    launchTool(tool, substituted);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1e293b]">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-[#f1f5f9] flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-amber-500 dark:text-amber-400" />
            <span>渗透备忘手册 (Cheat Sheets)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-mono font-medium border border-amber-200 dark:border-amber-800/40">
              {filteredSheets.length} / {cheatSheets.length} 条高频指令
            </span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#94a3b8] mt-1">
            独立管理反弹Shell、Linux/Windows权限提升、流量监听与快速后渗透 Payload，支持动态参数注入与一键秒拷
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => startAddTool(undefined, null, 'cheat_sheet')}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>新建备忘指令</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Parameter Substitution Workbench */}
      <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-transparent p-4 rounded-xl border border-amber-500/20 dark:border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 flex-shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-[#f1f5f9] flex items-center space-x-2">
              <span>全局攻击参数动态注入器 (Dynamic Variable Injection)</span>
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-[#94a3b8] mt-0.5">
              修改下方 IP 与端口，所有备忘指令中的 <code className="text-amber-600 dark:text-amber-400 font-mono font-bold bg-amber-50 dark:bg-amber-950/60 px-1 py-0.5 rounded">`{'{LHOST}'}`</code> 与 <code className="text-sky-600 dark:text-sky-400 font-mono font-bold bg-sky-50 dark:bg-sky-950/60 px-1 py-0.5 rounded">`{'{LPORT}'}`</code> 将实时自动替换
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-white/80 dark:bg-[#0d121f]/90 p-2 rounded-lg border border-slate-200 dark:border-[#1e293b] self-start md:self-auto shadow-sm">
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400">LHOST:</span>
            <input
              type="text"
              value={lhost}
              onChange={(e) => setLhost(e.target.value)}
              placeholder="10.10.14.8"
              className="w-28 px-2 py-1 bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1e293b] rounded text-xs font-mono text-slate-900 dark:text-amber-300 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-[#1e293b]" />

          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400">LPORT:</span>
            <input
              type="text"
              value={lport}
              onChange={(e) => setLport(e.target.value)}
              placeholder="4444"
              className="w-16 px-2 py-1 bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1e293b] rounded text-xs font-mono text-slate-900 dark:text-sky-300 focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* 3. Search and Tags Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-[#1e293b]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索备忘指令名称、代码片段、标签或说明..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg text-xs text-slate-900 dark:text-[#f1f5f9] placeholder-slate-400 dark:placeholder-[#64748b] focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 text-xs">
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-md text-[11px] transition-all font-mono ${
                selectedTag === null
                  ? 'bg-amber-600 text-white font-medium shadow-sm'
                  : 'bg-slate-100 dark:bg-[#0d121f] text-slate-700 dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#162032]'
              }`}
            >
              全部 ({cheatSheets.length})
            </button>
            {availableTags.map((tag) => {
              const count = cheatSheets.filter((t) => t.tags?.includes(tag)).length;
              const isSelected = selectedTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(isSelected ? null : tag)}
                  className={`px-2 py-1 rounded-md text-[11px] transition-all font-mono flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-amber-600 text-white font-medium shadow-sm'
                      : 'bg-slate-100 dark:bg-[#0d121f] text-slate-700 dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#162032]'
                  }`}
                >
                  <span>#{tag}</span>
                  <span className="text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Cheat Sheets Grid */}
      {filteredSheets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSheets.map((sheet) => {
            const liveCmd = substituteCommand(sheet.targetPath, lhost, lport);
            const isCopied = copiedId === sheet.id;

            return (
              <div
                key={sheet.id}
                className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/50 dark:hover:border-amber-500/40 hover:shadow-md transition-all group relative"
              >
                <div>
                  {/* Top Bar: Title, Favorite, Edit/Delete */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400">
                        <Terminal className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9] truncate">
                        {sheet.name}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleFavorite(sheet.id)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 dark:text-[#64748b] hover:text-amber-500 transition-colors"
                        title={sheet.isFavorite ? '取消收藏' : '加入收藏'}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            sheet.isFavorite
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-slate-400 dark:text-[#64748b]'
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => startEditTool(sheet.id)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 dark:text-[#64748b] hover:text-slate-700 dark:hover:text-[#f1f5f9] transition-colors"
                        title="编辑指令"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setToolToDelete(sheet)}
                        className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 dark:text-[#64748b] hover:text-red-500 transition-colors"
                        title="删除指令"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  {sheet.description && (
                    <p className="text-xs text-slate-600 dark:text-[#94a3b8] mb-3 leading-relaxed">
                      {sheet.description}
                    </p>
                  )}

                  {/* Code Snippet Box (Always high-contrast terminal styling) */}
                  <div className="relative rounded-lg bg-[#090d16] border border-[#1e293b] p-3 overflow-hidden shadow-inner group/code">
                    <pre className="font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap break-all leading-5 select-all">
                      {liveCmd}
                    </pre>

                    {/* Copy overlay button in top-right of snippet */}
                    <button
                      type="button"
                      onClick={() => handleCopy(sheet)}
                      className={`absolute top-2 right-2 px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center space-x-1.5 transition-all shadow-sm ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#1e293b] hover:bg-[#334155] text-amber-300 hover:text-amber-200'
                      }`}
                      title="一键拷贝指令"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>复制</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Operational Notes / Usage Guide */}
                  {sheet.notes && (
                    <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0d121f] border border-slate-200/80 dark:border-[#1e293b]/70 flex items-start space-x-2 text-[11px] text-slate-600 dark:text-[#94a3b8]">
                      <Info className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                      <div className="leading-relaxed whitespace-pre-line">{sheet.notes}</div>
                    </div>
                  )}

                  {/* Tags */}
                  {sheet.tags && sheet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {sheet.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-[#94a3b8] hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1e293b]/70 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 dark:text-[#64748b] font-mono">
                    调用统计: {sheet.usageCount || 0} 次
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(sheet)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>已复制到剪贴板！</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>一键复制指令</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl p-12 text-center">
          <Bookmark className="w-10 h-10 text-slate-300 dark:text-[#334155] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#f1f5f9]">未检索到符合条件的备忘指令</h3>
          <p className="text-xs text-slate-500 dark:text-[#64748b] mt-1 max-w-sm mx-auto">
            {searchQuery || selectedTag
              ? '当前筛选条件下暂无条目，您可以清除搜索词或重置标签筛选'
              : '当前尚未登记备忘指令，点击下方按钮立即添加常用反弹 Shell 或提权 Payload'}
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
              onClick={() => startAddTool(undefined, null, 'cheat_sheet')}
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-sm"
            >
              + 新建首条备忘指令
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
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9]">确认删除该备忘指令？</h3>
                <p className="text-xs text-slate-500 dark:text-[#94a3b8] mt-0.5">
                  指令名称: <span className="font-semibold text-slate-800 dark:text-white">{toolToDelete.name}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#94a3b8]">
              删除后此指令将从备忘手册中移除，该操作无法撤销。
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
export default CheatSheetsPage;
