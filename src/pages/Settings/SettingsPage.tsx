import React, { useState } from 'react';
import { useApp, ACCENT_PRESETS } from '../../context/AppContext';
import { ThemeMode } from '../../types';
import { storageService } from '../../services/storage';
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  Terminal,
  Keyboard,
  Cpu,
  Check,
  AlertCircle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDefaults, addToast } = useApp();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleThemeChange = (mode: ThemeMode) => {
    updateSettings({ theme: mode });
  };

  const handleAccentChange = (color: string) => {
    updateSettings({ accentColor: color });
  };

  const handleExportData = async () => {
    const jsonStr = await storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cybernest_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: '备份导出完成',
      message: '已保存至本地 JSON 文件',
    });
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      const success = await storageService.importAllData(content);
      if (success) {
        addToast({
          type: 'success',
          title: '数据导入成功',
          message: '已恢复中枢工具库配置',
        });
        window.location.reload();
      } else {
        addToast({
          type: 'error',
          title: '数据导入失败',
          message: '备份文件格式不兼容',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* 1. Page Header */}
      <div className="pb-2 border-b border-[#1e293b]">
        <h1 className="text-xl font-bold text-[#f1f5f9] flex items-center space-x-2">
          <span>系统首选项与数据备份</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e293b] text-[#38bdf8] font-mono">
            Settings
          </span>
        </h1>
        <p className="text-xs text-[#94a3b8] mt-1">
          个性化配置视觉主题、外观风格、桌面快捷键呼出与本地数据安全管理
        </p>
      </div>

      {/* 2. Appearance Section */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-5">
        <div>
          <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
            <Moon className="w-4 h-4 text-[#38bdf8]" />
            <span>视觉主题与外观风格</span>
          </h2>
          <p className="text-xs text-[#94a3b8] mt-1">
            实时切换明暗工作模式与专属网安对抗控制台强调色外观
          </p>
        </div>

        {/* 2.1 Color Scheme Mode */}
        <div>
          <div className="text-xs font-medium text-[#cbd5e1] mb-2 flex items-center justify-between">
            <span>明暗工作模式</span>
            <span className="text-[11px] text-[#64748b] font-mono">
              当前: {settings.theme === 'dark' ? '暗黑模式' : settings.theme === 'light' ? '明亮模式' : '跟随操作系统'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'dark', label: '暗黑模式 (推荐)', icon: Moon, desc: '护眼深灰黑，专业对抗风格' },
              { id: 'light', label: '明亮模式', icon: Sun, desc: '高采光环境与常规日间办公' },
              { id: 'system', label: '跟随操作系统', icon: Monitor, desc: '随系统调度自动切换' },
            ].map((theme) => {
              const Icon = theme.icon;
              const isSelected = settings.theme === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id as ThemeMode)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all flex flex-col space-y-1.5 ${
                    isSelected
                      ? 'bg-[#162032] border-[#38bdf8] text-[#38bdf8] shadow-sm ring-1 ring-[#38bdf8]/40'
                      : 'bg-[#0d121f] border-[#1e293b] text-[#94a3b8] hover:bg-[#162032]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-4 h-4" />
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#38bdf8]" />}
                  </div>
                  <div className="font-semibold text-xs text-[#f1f5f9]">{theme.label}</div>
                  <div className="text-[11px] text-[#64748b]">{theme.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2.2 Console Accent Styles */}
        <div className="pt-4 border-t border-[#1e293b]">
          <div className="text-xs font-medium text-[#cbd5e1] mb-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>控制台外观风格与强调色</span>
            </div>
            <span className="text-[11px] text-[#64748b] font-mono">
              6 款预置安全对抗配色方案
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {ACCENT_PRESETS.map((preset) => {
              const isSelected =
                (settings.accentColor || '#38bdf8').toLowerCase() === preset.color.toLowerCase();
              return (
                <div
                  key={preset.id}
                  onClick={() => handleAccentChange(preset.color)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col items-center text-center space-y-2 group relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#162032] border-[#38bdf8] shadow-sm ring-1 ring-[#38bdf8]/50'
                      : 'bg-[#0d121f] border-[#1e293b] hover:bg-[#162032]/50 hover:border-[#334155]'
                  }`}
                >
                  {/* Color Circle & Glow */}
                  <div
                    className="relative w-7 h-7 rounded-full flex items-center justify-center shadow-inner transition-transform group-hover:scale-110"
                    style={{ backgroundColor: preset.color }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-[#f1f5f9]">{preset.name}</div>
                    <div className="text-[10px] text-[#64748b] font-mono mt-0.5">{preset.color}</div>
                  </div>

                  <div className="text-[10px] text-[#64748b] line-clamp-1">{preset.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Desktop Behavior Section */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-4">
        <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span>桌面原生交互行为</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d121f] border border-[#1e293b]">
            <div>
              <div className="font-medium text-[#f1f5f9]">关闭主窗口时最小化到系统托盘</div>
              <div className="text-[11px] text-[#64748b] mt-0.5">保持后台待命，按下快捷键可随时瞬时唤出</div>
            </div>
            <input
              type="checkbox"
              checked={settings.closeToTray}
              onChange={(e) => updateSettings({ closeToTray: e.target.checked })}
              className="rounded bg-[#111827] border-[#1e293b] text-[#0284c7] focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d121f] border border-[#1e293b]">
            <div>
              <div className="font-medium text-[#f1f5f9]">开机自动随系统登录启动</div>
              <div className="text-[11px] text-[#64748b] mt-0.5">系统开机时常驻后台，快速响应渗透演练需求</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoLaunch}
              onChange={(e) => updateSettings({ autoLaunch: e.target.checked })}
              className="rounded bg-[#111827] border-[#1e293b] text-[#0284c7] focus:ring-0 w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d121f] border border-[#1e293b]">
            <div>
              <div className="font-medium text-[#f1f5f9]">默认拉起交互式终端</div>
              <div className="text-[11px] text-[#64748b] mt-0.5">调用 CLI 或 Python/Go 工具时宿主优先使用的控制台</div>
            </div>
            <select
              value={settings.defaultTerminal}
              onChange={(e) => updateSettings({ defaultTerminal: e.target.value as any })}
              className="bg-[#111827] border border-[#1e293b] rounded px-2.5 py-1 text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
            >
              <option value="wt">Windows Terminal (wt.exe)</option>
              <option value="powershell">PowerShell 7 / 5.1</option>
              <option value="cmd">Command Prompt (cmd.exe)</option>
              <option value="bash">Git Bash / WSL</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d121f] border border-[#1e293b]">
            <div className="flex items-center space-x-2">
              <Keyboard className="w-4 h-4 text-[#38bdf8]" />
              <div>
                <div className="font-medium text-[#f1f5f9]">全局呼出热键 (Global Shortcut)</div>
                <div className="text-[11px] text-[#64748b]">在任何应用程序界面下随时激活 CyberNest 搜索命令面板</div>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#162032] border border-[#1e293b] font-mono text-xs text-[#38bdf8] font-bold">
              {settings.globalShortcut || 'Alt+Space'}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Data Management Section */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-4">
        <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#38bdf8]" />
          <span>本地资产安全与配置备份</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={handleExportData}
            className="p-3 rounded-lg bg-[#0d121f] border border-[#1e293b] hover:border-[#38bdf8]/50 text-left transition-all group"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#f1f5f9] group-hover:text-[#38bdf8]">
              <Download className="w-4 h-4" />
              <span>全量导出备份 (JSON)</span>
            </div>
            <p className="text-[11px] text-[#64748b] mt-1">
              导出所有工具条目、分类树、快捷标签与个人运行偏好
            </p>
          </button>

          <label className="p-3 rounded-lg bg-[#0d121f] border border-[#1e293b] hover:border-emerald-500/50 text-left transition-all group cursor-pointer">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#f1f5f9] group-hover:text-emerald-400">
              <Upload className="w-4 h-4" />
              <span>导入恢复备份文件</span>
            </div>
            <p className="text-[11px] text-[#64748b] mt-1">
              读取已导出的 JSON 结构化数据并就地合入
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="p-3 rounded-lg bg-[#0d121f] border border-[#1e293b] hover:border-rose-500/50 text-left transition-all group"
          >
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#f1f5f9] group-hover:text-rose-400">
              <RefreshCw className="w-4 h-4" />
              <span>重置出厂预设</span>
            </div>
            <p className="text-[11px] text-[#64748b] mt-1">
              清空自定义修改，重新载入默认 8 大分类与预置工具条目
            </p>
          </button>
        </div>
      </div>

      {/* 5. About & Diagnostics */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
        <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>关于 CyberNest 与架构就绪状态</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded bg-[#0d121f] border border-[#1e293b]">
            <div className="text-[10px] text-[#64748b]">版本号</div>
            <div className="text-[#f1f5f9] font-bold mt-0.5">v1.0.0-desktop</div>
          </div>
          <div className="p-2.5 rounded bg-[#0d121f] border border-[#1e293b]">
            <div className="text-[10px] text-[#64748b]">原生容器</div>
            <div className="text-[#38bdf8] font-bold mt-0.5">Tauri 2.0 (Rust)</div>
          </div>
          <div className="p-2.5 rounded bg-[#0d121f] border border-[#1e293b]">
            <div className="text-[10px] text-[#64748b]">前端架构</div>
            <div className="text-emerald-400 font-bold mt-0.5">React + Vite + Tailwind</div>
          </div>
          <div className="p-2.5 rounded bg-[#0d121f] border border-[#1e293b]">
            <div className="text-[10px] text-[#64748b]">隐私保护</div>
            <div className="text-emerald-400 font-bold mt-0.5">100% 离线无外部上报</div>
          </div>
        </div>

        <p className="text-[11px] text-[#64748b] leading-relaxed">
          CyberNest 严格遵循网络安全工程师隐私第一设计原则，所有工具执行路径、分类标签、自制脚本与历史流水均保存在本地存储空间内，绝不向任何第三方服务器发送遥测数据。
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold text-sm text-[#f1f5f9]">重置为出厂预设</h3>
            </div>
            <p className="text-xs text-[#94a3b8]">
              此操作将恢复 8 大安全分类与默认工具列表（如 Nmap, Burp Suite, Wireshark, SQLmap, Ghidra 等），您自行添加的未导出数据将被覆盖。确定继续吗？
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#1e293b] text-xs text-[#94a3b8] hover:text-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={async () => {
                  await resetToDefaults();
                  setIsResetConfirmOpen(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs text-white font-medium"
              >
                确定重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
