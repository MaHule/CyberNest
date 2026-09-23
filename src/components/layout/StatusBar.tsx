import React from 'react';
import { useApp } from '../../context/AppContext';
import { Database, ShieldCheck } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const { tools } = useApp();
  const favCount = tools.filter((t) => t.isFavorite).length;

  return (
    <footer className="h-7 bg-[#0d121f] border-t border-[#1e293b] flex items-center justify-between px-3 text-[11px] text-[#64748b] select-none flex-shrink-0 z-40 font-mono">
      {/* Left: Storage status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] tracking-wider uppercase font-semibold">SQLite / IndexedDB 活跃</span>
        </div>
        <span className="text-[#334155]">|</span>
        <div className="flex items-center space-x-1">
          <Database className="w-3 h-3 text-[#94a3b8]" />
          <span>工具资产: <strong className="text-[#f1f5f9]">{tools.length}</strong></span>
        </div>
        <div className="flex items-center space-x-1">
          <span>常驻收藏: <strong className="text-amber-400">{favCount}</strong></span>
        </div>
      </div>

      {/* Center: System notice */}
      <div className="hidden md:flex items-center space-x-2 text-[#94a3b8]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
        <span>100% 离线零遥测保护已启用</span>
      </div>

      {/* Right: Shortcut reminders */}
      <div className="flex items-center space-x-3 text-[10px]">
        <div className="flex items-center space-x-1">
          <kbd className="px-1 py-0.5 rounded bg-[#1e293b] text-[#94a3b8] border border-[#334155]">Alt+Space</kbd>
          <span>快速唤醒</span>
        </div>
        <div className="flex items-center space-x-1">
          <kbd className="px-1 py-0.5 rounded bg-[#1e293b] text-[#94a3b8] border border-[#334155]">Tauri 2.0</kbd>
        </div>
      </div>
    </footer>
  );
};