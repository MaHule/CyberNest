import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Play, Globe, Terminal, FileCode, Bookmark, X, Star } from 'lucide-react';
import { Tool } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tools,
    categories,
    launchTool,
    startEditTool,
    setActiveTab,
    startAddTool
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

  const filtered = tools.filter((t) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
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
  }).slice(0, 8);

  const handleSelect = (tool: Tool) => {
    setIsCommandPaletteOpen(false);
    launchTool(tool);
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
        className="w-full max-w-xl bg-[#111827] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-100"
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3 border-b border-[#1e293b] bg-[#0d121f]">
          <Search className="w-4 h-4 text-[#38bdf8] mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="搜索并一键执行安全工具、大类/子类、脚本、指令..."
            className="w-full bg-transparent text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-[#64748b] hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              const parentCat = categories.find((c) => c.id === tool.categoryId);
              const subCat = tool.subcategoryId ? categories.find((c) => c.id === tool.subcategoryId) : null;

              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors text-xs ${
                    isSelected ? 'bg-[#162032] text-[#38bdf8]' : 'text-[#94a3b8] hover:bg-[#162032]/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-7 h-7 rounded bg-[#1e293b] flex items-center justify-center flex-shrink-0 text-xs">
                      {tool.type === 'web' ? (
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      ) : tool.type === 'script' ? (
                        <FileCode className="w-3.5 h-3.5 text-amber-400" />
                      ) : tool.type === 'cheat_sheet' ? (
                        <Bookmark className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
                      )}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-[#f1f5f9] truncate">{tool.name}</span>
                        {tool.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                      </div>
                      <div className="text-[11px] text-[#64748b] truncate font-mono mt-0.5">
                        {tool.targetPath}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                    {parentCat && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded border border-[#1e293b] flex items-center space-x-1"
                        style={{
                          borderColor: `${parentCat.color}35`,
                          color: parentCat.color,
                          backgroundColor: `${parentCat.color}10`
                        }}
                      >
                        <span>{parentCat.name}</span>
                        {subCat && (
                          <>
                            <span className="opacity-40 text-[9px]">›</span>
                            <span className="text-[#e2e8f0] font-medium">{subCat.name}</span>
                          </>
                        )}
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]">
                      Enter 执行
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-[#64748b]">
              未检索到符合条件的工具，按 Esc 退出
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3 py-2 border-t border-[#1e293b] bg-[#0d121f] text-[10px] text-[#64748b] flex items-center justify-between font-mono">
          <div className="flex items-center space-x-3">
            <span>↑↓ 切换</span>
            <span>Enter 启动</span>
            <span>Esc 关闭</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsCommandPaletteOpen(false);
              startAddTool();
            }}
            className="text-[#38bdf8] hover:underline"
          >
            + 注册新工具到此库
          </button>
        </div>
      </div>
    </div>
  );
};
