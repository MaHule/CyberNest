import React, { useState } from 'react';
import { useApp, ACCENT_PRESETS } from '../../context/AppContext';
import { ThemeMode, ToolEnvironment, EnvironmentType } from '../../types';
import { storageService } from '../../services/storage';
import { platformBridge } from '../../services/bridge';
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
  AlertCircle,
  Layers,
  Plus,
  Trash2,
  Edit2,
  FolderOpen,
  Coffee,
  FileCode,
  Shield,
  X,
  Globe
} from 'lucide-react';

const QUICK_ENV_PRESETS: Array<{
  label: string;
  preset: Omit<ToolEnvironment, 'id' | 'createdAt' | 'updatedAt'>;
}> = [
  {
    label: '+ Java 8 (JRE 1.8)',
    preset: {
      name: 'Java 8 (JRE 1.8)',
      type: 'java',
      binPath: 'java',
      extraArgs: '-Xmx2g -Dfile.encoding=UTF-8',
      description: '经典 Java 8 兼容运行时，支持旧版 Sqlmap-GUI、反序列化利用工具',
      isDefault: false,
    },
  },
  {
    label: '+ Java 17/21 LTS',
    preset: {
      name: 'Java 17/21 LTS',
      type: 'java',
      binPath: 'java',
      extraArgs: '-Dfile.encoding=UTF-8',
      description: '现代化高版本 Java LTS 环境，兼容最新 Burp Suite 与 Ghidra',
      isDefault: false,
    },
  },
  {
    label: '+ Python 3.x',
    preset: {
      name: 'Python 3.x (默认)',
      type: 'python',
      binPath: 'python',
      extraArgs: '-u',
      description: '标准 Python 3 安全脚本执行环境',
      isDefault: false,
    },
  },
  {
    label: '+ Python 2.7',
    preset: {
      name: 'Python 2.7 (Legacy)',
      type: 'python',
      binPath: 'python2',
      extraArgs: '-u',
      description: '专用于执行历史遗留 Exploit 与反编译分析工具',
      isDefault: false,
    },
  },
  {
    label: '+ Burp 本地代理 (8080)',
    preset: {
      name: 'Burp 本地代理环境',
      type: 'proxy',
      envVars: {
        HTTP_PROXY: 'http://127.0.0.1:8080',
        HTTPS_PROXY: 'http://127.0.0.1:8080',
      },
      description: '注入 HTTP/HTTPS 代理变量，流量全部通过本地 Burp 监听端口转发',
      isDefault: false,
    },
  },
  {
    label: '+ SOCKS5 代理 (10808)',
    preset: {
      name: 'SOCKS5 隧道代理 (10808)',
      type: 'proxy',
      envVars: {
        ALL_PROXY: 'socks5://127.0.0.1:10808',
      },
      description: '注入全局 SOCKS5 代理隧道变量，实现安全扫描流量穿透',
      isDefault: false,
    },
  },
];

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToDefaults,
    addToast,
    environments,
    saveEnvironment,
    deleteEnvironment,
    setDefaultEnvironment,
  } = useApp();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Environment management states
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [editingEnvId, setEditingEnvId] = useState<string | null>(null);
  const [envName, setEnvName] = useState('');
  const [envType, setEnvType] = useState<EnvironmentType>('java');
  const [envBinPath, setEnvBinPath] = useState('');
  const [envExtraArgs, setEnvExtraArgs] = useState('');
  const [envDescription, setEnvDescription] = useState('');
  const [envIsDefault, setEnvIsDefault] = useState(false);
  const [envVarsList, setEnvVarsList] = useState<{ key: string; value: string }[]>([]);

  const handleOpenAddEnv = () => {
    setEditingEnvId(null);
    setEnvName('');
    setEnvType('java');
    setEnvBinPath('');
    setEnvExtraArgs('');
    setEnvDescription('');
    setEnvIsDefault(false);
    setEnvVarsList([]);
    setIsEnvModalOpen(true);
  };

  const handleOpenEditEnv = (env: ToolEnvironment) => {
    setEditingEnvId(env.id);
    setEnvName(env.name);
    setEnvType(env.type);
    setEnvBinPath(env.binPath || '');
    setEnvExtraArgs(env.extraArgs || '');
    setEnvDescription(env.description || '');
    setEnvIsDefault(Boolean(env.isDefault));
    setEnvVarsList(
      env.envVars
        ? Object.entries(env.envVars).map(([key, value]) => ({ key, value }))
        : []
    );
    setIsEnvModalOpen(true);
  };

  const handleBrowseEnvBin = async () => {
    let extensions = ['exe', 'bat', 'cmd', 'sh', '*'];
    if (envType === 'java') {
      extensions = ['exe', 'bat', 'cmd', '*'];
    } else if (envType === 'python') {
      extensions = ['exe', 'bat', 'cmd', 'sh', '*'];
    }
    const picked = await platformBridge.selectFile([
      { name: '解释器或执行程序', extensions },
      { name: '所有文件', extensions: ['*'] },
    ]);
    if (picked) {
      setEnvBinPath(picked);
    }
  };

  const handleAddEnvVarRow = (initialKey = '', initialVal = '') => {
    setEnvVarsList([...envVarsList, { key: initialKey, value: initialVal }]);
  };

  const handleUpdateEnvVarRow = (index: number, key: string, value: string) => {
    const next = [...envVarsList];
    next[index] = { key, value };
    setEnvVarsList(next);
  };

  const handleRemoveEnvVarRow = (index: number) => {
    setEnvVarsList(envVarsList.filter((_, i) => i !== index));
  };

  const handleSaveEnv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!envName.trim()) return;

    const envVarsRecord: Record<string, string> = {};
    envVarsList.forEach(({ key, value }) => {
      const k = key.trim();
      if (k) {
        envVarsRecord[k] = value.trim();
      }
    });

    const now = new Date().toISOString();
    const envPayload: ToolEnvironment = {
      id: editingEnvId || `env_${Date.now().toString(36)}`,
      name: envName.trim(),
      type: envType,
      binPath: envBinPath.trim() || undefined,
      extraArgs: envExtraArgs.trim() || undefined,
      envVars: Object.keys(envVarsRecord).length > 0 ? envVarsRecord : undefined,
      description: envDescription.trim() || undefined,
      isDefault: envIsDefault,
      createdAt: editingEnvId ? (environments.find((e) => e.id === editingEnvId)?.createdAt || now) : now,
      updatedAt: now,
    };

    await saveEnvironment(envPayload);
    if (envIsDefault) {
      await setDefaultEnvironment(envPayload.id);
    }
    setIsEnvModalOpen(false);
  };

  const handleQuickAddPreset = async (preset: Omit<ToolEnvironment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEnv: ToolEnvironment = {
      ...preset,
      id: `env_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
      createdAt: now,
      updatedAt: now,
    };
    await saveEnvironment(newEnv);
  };

  const getEnvIcon = (type: EnvironmentType) => {
    switch (type) {
      case 'java':
        return <Coffee className="w-4 h-4 text-amber-400" />;
      case 'python':
        return <FileCode className="w-4 h-4 text-emerald-400" />;
      case 'proxy':
        return <Shield className="w-4 h-4 text-[#38bdf8]" />;
      case 'wsl':
        return <Terminal className="w-4 h-4 text-purple-400" />;
      default:
        return <Cpu className="w-4 h-4 text-[#38bdf8]" />;
    }
  };

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

      {/* 4. Tool Runtime Environment Management Section */}
      <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#38bdf8]" />
              <span>工具启动环境配置管理</span>
            </h2>
            <p className="text-xs text-[#94a3b8] mt-1">
              为 Java JAR、Python 脚本或本地代理工具配置独立的运行时环境（如不同 Java / Python 版本、专用网络代理与启动参数）
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAddEnv}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#38bdf8]/10 hover:bg-[#38bdf8]/20 border border-[#38bdf8]/30 text-xs text-[#38bdf8] font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建运行环境</span>
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="p-3 rounded-lg bg-[#0d121f] border border-[#1e293b] space-y-2">
          <div className="text-[11px] font-medium text-[#cbd5e1] flex items-center justify-between">
            <span>常用运行环境快速添加 (点击直接合入)</span>
            <span className="text-[10px] text-[#64748b] font-mono">QUICK PRESETS</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_ENV_PRESETS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickAddPreset(p.preset)}
                className="px-2.5 py-1 rounded bg-[#111827] hover:bg-[#162032] border border-[#1e293b] hover:border-[#38bdf8]/40 text-xs text-[#94a3b8] hover:text-[#38bdf8] transition-all font-mono"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Registered Environments List */}
        <div className="space-y-2.5">
          {environments.length === 0 ? (
            <div className="p-6 rounded-lg bg-[#0d121f] border border-[#1e293b] text-center text-xs text-[#64748b]">
              暂无已配置的独立运行环境，点击上方按钮或预设快速添加。
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {environments.map((env) => {
                return (
                  <div
                    key={env.id}
                    className="p-3.5 rounded-lg bg-[#0d121f] border border-[#1e293b] hover:border-[#38bdf8]/30 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="p-1.5 rounded bg-[#162032] border border-[#1e293b]">
                            {getEnvIcon(env.type)}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-[#f1f5f9] flex items-center space-x-1.5">
                              <span>{env.name}</span>
                              {env.isDefault && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono">
                                  默认
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[#64748b] font-mono uppercase mt-0.5">
                              类型: {env.type}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          {!env.isDefault && (
                            <button
                              type="button"
                              onClick={() => setDefaultEnvironment(env.id)}
                              className="px-2 py-0.8 rounded text-[10px] bg-[#111827] hover:bg-[#162032] border border-[#1e293b] text-[#94a3b8] hover:text-[#38bdf8] transition-colors"
                              title="设为此类别的默认环境"
                            >
                              设为默认
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditEnv(env)}
                            className="p-1 rounded text-[#94a3b8] hover:text-[#38bdf8] hover:bg-[#162032] transition-colors"
                            title="编辑环境配置"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEnvironment(env.id)}
                            className="p-1 rounded text-[#94a3b8] hover:text-rose-400 hover:bg-[#162032] transition-colors"
                            title="删除环境配置"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {env.description && (
                        <p className="text-[11px] text-[#94a3b8] line-clamp-2">
                          {env.description}
                        </p>
                      )}

                      {/* Detail Tags */}
                      <div className="space-y-1 text-[11px] font-mono pt-1 border-t border-[#1e293b]">
                        {env.binPath && (
                          <div className="text-[#64748b] truncate">
                            <span className="text-[#94a3b8]">解释器:</span>{' '}
                            <span className="text-[#38bdf8]">{env.binPath}</span>
                          </div>
                        )}
                        {env.extraArgs && (
                          <div className="text-[#64748b] truncate">
                            <span className="text-[#94a3b8]">附加参数:</span>{' '}
                            <span className="text-amber-400">{env.extraArgs}</span>
                          </div>
                        )}
                        {env.envVars && Object.keys(env.envVars).length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                            <span className="text-[#94a3b8] text-[10px]">环境变量:</span>
                            {Object.entries(env.envVars).map(([k, v]) => (
                              <span
                                key={k}
                                className="px-1.5 py-0.2 rounded text-[10px] bg-[#162032] border border-[#1e293b] text-emerald-400 truncate max-w-[200px]"
                                title={`${k}=${v}`}
                              >
                                {k}={v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 5. Data Management Section */}
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
                className="px-3 py-1.5 rounded-lg border border-[#1e293b] text-xs text-[#94a3b8] hover:text-slate-900 dark:hover:text-white"
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

      {/* Add / Edit Environment Modal */}
      {isEnvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 max-w-lg w-full space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#38bdf8]" />
                <h3 className="font-semibold text-sm text-[#f1f5f9]">
                  {editingEnvId ? '编辑启动运行环境' : '新增独立运行环境'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEnvModalOpen(false)}
                className="text-[#94a3b8] hover:text-[#f1f5f9] p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEnv} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-[#cbd5e1] mb-1">
                  环境名称 *
                </label>
                <input
                  type="text"
                  required
                  value={envName}
                  onChange={(e) => setEnvName(e.target.value)}
                  placeholder="例如: Java 8 (Oracle JDK) 或 Burp 本地代理"
                  className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#cbd5e1] mb-1">
                    环境类型 *
                  </label>
                  <select
                    value={envType}
                    onChange={(e) => setEnvType(e.target.value as EnvironmentType)}
                    className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-2.5 py-2 text-[#f1f5f9] focus:outline-none"
                  >
                    <option value="java">Java 运行时 (JAR封装)</option>
                    <option value="python">Python 解释器 (脚本封装)</option>
                    <option value="proxy">网络代理注入 (HTTP/SOCKS5)</option>
                    <option value="wsl">WSL 2 Linux 容器</option>
                    <option value="custom">自定义可执行环境</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#cbd5e1] mb-1">
                    默认环境设定
                  </label>
                  <label className="flex items-center space-x-2 pt-2 cursor-pointer text-[#cbd5e1]">
                    <input
                      type="checkbox"
                      checked={envIsDefault}
                      onChange={(e) => setEnvIsDefault(e.target.checked)}
                      className="rounded bg-[#0d121f] border-[#1e293b] text-[#0284c7] focus:ring-0 w-4 h-4"
                    />
                    <span>设为该类型的默认推荐环境</span>
                  </label>
                </div>
              </div>

              {/* Binary / Interpreter Path */}
              <div>
                <label className="block font-medium text-[#cbd5e1] mb-1">
                  解释器 / 执行程序完整路径 (可选)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={envBinPath}
                    onChange={(e) => setEnvBinPath(e.target.value)}
                    placeholder={
                      envType === 'java'
                        ? 'C:\\Program Files\\Java\\jdk1.8.0_202\\bin\\java.exe'
                        : envType === 'python'
                        ? 'C:\\Python310\\python.exe'
                        : '留空则从系统 PATH 中自动搜寻'
                    }
                    className="flex-1 bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleBrowseEnvBin}
                    className="px-3 py-2 rounded-lg bg-[#162032] hover:bg-[#1e293b] border border-[#1e293b] text-[#38bdf8] flex items-center space-x-1.5 flex-shrink-0"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>浏览文件</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#64748b] mt-1">
                  若填入具体路径，CyberNest 将直接使用该路径调用二进制程序；若留空则使用该类型的默认命令。
                </p>
              </div>

              {/* Extra Arguments */}
              <div>
                <label className="block font-medium text-[#cbd5e1] mb-1">
                  预置附加参数 (可选)
                </label>
                <input
                  type="text"
                  value={envExtraArgs}
                  onChange={(e) => setEnvExtraArgs(e.target.value)}
                  placeholder={
                    envType === 'java'
                      ? '-Xmx4g -Dfile.encoding=utf-8'
                      : envType === 'python'
                      ? '-u'
                      : ''
                  }
                  className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
                />
              </div>

              {/* Custom Environment Variables Editor */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-medium text-[#cbd5e1]">
                    自定义环境变量注入 (ENV VARS)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddEnvVarRow()}
                    className="text-[11px] text-[#38bdf8] hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>添加变量</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                  <span className="text-[#64748b]">快捷填充:</span>
                  <button
                    type="button"
                    onClick={() => handleAddEnvVarRow('HTTP_PROXY', 'http://127.0.0.1:8080')}
                    className="px-1.5 py-0.5 rounded bg-[#0d121f] border border-[#1e293b] text-[#38bdf8] hover:bg-[#162032]"
                  >
                    HTTP_PROXY
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddEnvVarRow('HTTPS_PROXY', 'http://127.0.0.1:8080')}
                    className="px-1.5 py-0.5 rounded bg-[#0d121f] border border-[#1e293b] text-[#38bdf8] hover:bg-[#162032]"
                  >
                    HTTPS_PROXY
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddEnvVarRow('ALL_PROXY', 'socks5://127.0.0.1:10808')}
                    className="px-1.5 py-0.5 rounded bg-[#0d121f] border border-[#1e293b] text-[#38bdf8] hover:bg-[#162032]"
                  >
                    ALL_PROXY
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddEnvVarRow('JAVA_HOME', 'C:\\Program Files\\Java\\jdk-17')}
                    className="px-1.5 py-0.5 rounded bg-[#0d121f] border border-[#1e293b] text-amber-400 hover:bg-[#162032]"
                  >
                    JAVA_HOME
                  </button>
                </div>

                {envVarsList.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {envVarsList.map((row, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={row.key}
                          onChange={(e) => handleUpdateEnvVarRow(idx, e.target.value, row.value)}
                          placeholder="KEY (如 HTTP_PROXY)"
                          className="w-1/3 bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded px-2 py-1.5 font-mono text-[#f1f5f9] focus:outline-none text-[11px]"
                        />
                        <span className="text-[#64748b] font-mono">=</span>
                        <input
                          type="text"
                          value={row.value}
                          onChange={(e) => handleUpdateEnvVarRow(idx, row.key, e.target.value)}
                          placeholder="VALUE (如 http://127.0.0.1:8080)"
                          className="flex-1 bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded px-2 py-1.5 font-mono text-[#f1f5f9] focus:outline-none text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEnvVarRow(idx)}
                          className="p-1 rounded text-[#94a3b8] hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2.5 rounded bg-[#0d121f] border border-[#1e293b] text-[11px] text-[#64748b] text-center">
                    未配置注入环境变量。如需代理或 PATH 替换可在此添加。
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block font-medium text-[#cbd5e1] mb-1">
                  用途说明 (可选)
                </label>
                <textarea
                  rows={2}
                  value={envDescription}
                  onChange={(e) => setEnvDescription(e.target.value)}
                  placeholder="例如: 专用于运行各类历史 Java 8 反序列化漏洞利用脚本..."
                  className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 text-[#f1f5f9] placeholder-[#64748b] focus:outline-none text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#1e293b]">
                <button
                  type="button"
                  onClick={() => setIsEnvModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[#1e293b] text-xs text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#162032] transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-xs text-white font-medium shadow-sm transition-colors"
                >
                  保存环境配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
