import React, { useState, useEffect, useRef } from 'react';
import { useApp, getCategoryBadgeStyle } from '../../context/AppContext';
import { Search, Globe, Terminal, FileCode, Bookmark, X, Star, ShieldAlert } from 'lucide-react';
import { Tool, PocItem } from '../../types';

type PaletteItem =
  | { kind: 'tool'; data: Tool }
  | { kind: 'poc'; data: PocItem };

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tools,
    pocs,
    categories,
    launchTool,
    setActiveTab,
    startAddTool,
    isDarkTheme,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredTools: PaletteItem[] = tools
    .filter((t) => {
      if (!q) return true;
      const parentCat = categories.find((c) => c.id === t.categoryId);
      const subCat = t.subcategoryId ? categories.find((c) => c.id === t.subcategoryId) : null;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.targetPath.toLowerCase().includes(q) ||
        parentCat?.name.toLowerCase().includes(q) ||
        subCat?.name.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    })
    .map((t) => ({ kind: 'tool' as const, data: t }));

  const filteredPocs: PaletteItem[] = (pocs || [])
    .filter((p) => {
      if (!q) return false;
      return (
        p.name.toLowerCase().includes(q) ||
        p.cveId?.toLowerCase().includes(q) ||
        p.affectedComponent?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    })
    .map((p) => ({ kind: 'poc' as const, data: p }));

  const filtered: PaletteItem[] = (
    q ? [...filteredTools, ...filteredPocs] : filteredTools
  ).slice(0, 8);

  const handleSelect = (item: PaletteItem) => {
    setIsCommandPaletteOpen(false);
    if (item.kind === 'tool') {
      launchTool(item.data);
    } else {
      setActiveTab('poc-manager');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-100"
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#0d121f]">
          <Search className="w-4 h-4 text-sky-500 dark:text-[#38bdf8] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="搜索安全工具、CVE 漏洞模板、分类标签、脚本指令..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-[#f1f5f9] placeholder-slate-400 dark:placeholder-[#64748b] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-slate-700 dark:text-[#64748b] dark:hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              if (item.kind === 'tool') {
                const tool = item.data;
                const parentCat = categories.find((c) => c.id === tool.categoryId);
                const subCat = tool.subcategoryId ? categories.find((c) => c.id === tool.subcategoryId) : null;

                return (
                  <div
                    key={`tool-${tool.id}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
                      isSelected
                        ? 'bg-sky-50 dark:bg-[#162032] text-sky-600 dark:text-[#38bdf8]'
                        : 'text-slate-600 dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#162032]/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-7 h-7 rounded bg-slate-100 dark:bg-[#1e293b] flex items-center justify-center flex-shrink-0 text-xs">
                        {tool.type === 'web' ? (
                          <Globe className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                        ) : tool.type === 'script' ? (
                          <FileCode className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                        ) : tool.type === 'cheat_sheet' ? (
                          <Bookmark className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                        ) : (
                          <Terminal className="w-3.5 h-3.5 text-sky-500 dark:text-[#38bdf8]" />
                        )}
                      </div>
                      <div className="truncate">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-slate-800 dark:text-[#f1f5f9] truncate">
                            {tool.name}
                          </span>
                          {tool.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-[#64748b] truncate font-mono mt-0.5">
                          {tool.targetPath}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                      {parentCat ? (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded border flex items-center space-x-1 font-mono"
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
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 font-mono">
                          Web 独立工具
                        </span>
                      ) : tool.type === 'cheat_sheet' ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 font-mono">
                          备忘手册
                        </span>
                      ) : null}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-[#94a3b8]">
                        Enter 执行
                      </span>
                    </div>
                  </div>
                );
              }

              // POC item
              const poc = item.data;
              return (
                <div
                  key={`poc-${poc.id}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected
                      ? 'bg-rose-50 dark:bg-[#162032] text-rose-600 dark:text-rose-400'
                      : 'text-slate-600 dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#162032]/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-7 h-7 rounded bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center flex-shrink-0 text-xs">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-slate-800 dark:text-[#f1f5f9] truncate">
                          {poc.name}
                        </span>
                        {poc.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-[#64748b] truncate font-mono mt-0.5">
                        {poc.cveId ? `${poc.cveId} • ${poc.affectedComponent}` : poc.affectedComponent}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                    <span className="text-[10px] px-1.5 py-0.5 rounded border border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 font-mono">
                      POC 验证
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-[#94a3b8]">
                      Enter 查看
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-[#64748b]">
              未检索到符合条件的工具或 POC，按 Esc 退出
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 py-2 border-t border-slate-200 dark:border-[#1e293b] bg-slate-50 dark:bg-[#0d121f] text-[10px] text-slate-500 dark:text-[#64748b] flex items-center justify-between font-mono">
          <div className="flex items-center space-x-3">
            <span>↑↓ 切换</span>
            <span>Enter 执行/查看</span>
            <span>Esc 关闭</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCommandPaletteOpen(false);
              startAddTool();
            }}
            className="text-sky-600 dark:text-[#38bdf8] hover:underline"
          >
            + 注册新工具到此库
          </button>
        </div>
      </div>
    </div>
  );
};
