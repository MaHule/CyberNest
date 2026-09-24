import React from 'react';
import { useApp } from '../../context/AppContext';
import { platformBridge } from '../../services/bridge';
import { Search, Minus, Square, X, ShieldCheck } from 'lucide-react';

export const TitleBar: React.FC = () => {
  const { setIsCommandPaletteOpen, activeTab } = useApp();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return '仪表盘控制台';
      case 'tools': return '全部安全工具库';
      case 'web-tools': return 'Web 在线工具枢纽';
      case 'cheat-sheets': return '渗透备忘手册 (Cheat Sheets)';
      case 'poc-manager': return 'POC 漏洞验证与资产管理';
      case 'categories': return '分类与标签资产池';
      case 'tool-studio': return '工具工作台 (Tool Studio)';
      case 'settings': return '系统首选项与备份';
      default: return '工具中枢';
    }
  };

  return (
    <header
      data-tauri-drag-region
      className="h-10 bg-[#0d121f] border-b border-[#1e293b] flex items-center justify-between px-3 select-none flex-shrink-0 z-50 text-xs"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left: Brand & Page Context */}
      <div className="flex items-center space-x-3 pointer-events-none">
        <div className="flex items-center space-x-2">
          <img src="/cybernest-icon.svg" alt="CyberNest" className="w-4 h-4" />
          <span className="font-bold text-[#f1f5f9] tracking-wide text-[13px]">CyberNest</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e293b] text-[#38bdf8] font-mono font-medium">
            CORE
          </span>
        </div>
        <span className="text-[#334155]">/</span>
        <span className="text-[#94a3b8] font-medium">{getPageTitle()}</span>
      </div>

      {/* Center: Global Search Trigger */}
      <div className="flex-1 max-w-md mx-4" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-1 bg-[#111827]/80 hover:bg-[#162032] border border-[#1e293b] hover:border-[#38bdf8]/40 rounded text-[#94a3b8] hover:text-[#f1f5f9] transition-all cursor-pointer text-xs"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>搜索工具、指令或标签...</span>
          </div>
          <div className="flex items-center space-x-1 font-mono text-[10px] bg-[#1e293b] px-1.5 py-0.5 rounded text-[#64748b]">
            <span>Alt</span>
            <span>+</span>
            <span>Space</span>
          </div>
        </button>
      </div>

      {/* Right: Security Status & Window Controls */}
      <div className="flex items-center space-x-2" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        {/* Offline Security Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>本地隔离</span>
        </div>

        {/* Window action buttons */}
        <div className="flex items-center ml-2 border-l border-[#1e293b] pl-1">
          <button
            type="button"
            onClick={() => platformBridge.minimizeWindow()}
            className="w-8 h-8 flex items-center justify-center rounded text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors"
            title="最小化"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => platformBridge.maximizeWindow()}
            className="w-8 h-8 flex items-center justify-center rounded text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors"
            title="最大化 / 还原"
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => platformBridge.closeWindow()}
            className="w-8 h-8 flex items-center justify-center rounded text-[#94a3b8] hover:text-white hover:bg-red-600 transition-colors"
            title="关闭窗口"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
