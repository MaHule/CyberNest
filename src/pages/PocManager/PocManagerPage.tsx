import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { platformBridge } from '../../services/bridge';
import { PocItem, PocSeverity, PocFormat } from '../../types';
import { inferVulnMetadata } from '../../utils/pocInference';
import { parseBatchPocData, BatchImportResult } from '../../utils/pocImporter';
import {
  ShieldAlert,
  Search,
  Plus,
  Copy,
  Check,
  Star,
  Edit2,
  Trash2,
  ExternalLink,
  Terminal,
  FileCode,
  LayoutGrid,
  List,
  AlertTriangle,
  FolderOpen,
  X,
  Sliders,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Globe,
  UploadCloud,
  FileText
} from 'lucide-react';

export const PocManagerPage: React.FC = () => {
  const {
    pocs,
    savePoc,
    deletePoc,
    toggleFavoritePoc,
    executePoc,
    batchImportPocs,
    addToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<PocSeverity | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<PocFormat | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Dynamic target host for testing
  const [targetHost, setTargetHost] = useState('http://192.168.1.100:8080');

  // Copy feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedFofaId, setCopiedFofaId] = useState<string | null>(null);

  // Edit / Add modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPoc, setEditingPoc] = useState<PocItem | null>(null);
  const [name, setName] = useState('');
  const [cveId, setCveId] = useState('');
  const [severity, setSeverity] = useState<PocSeverity>('high');
  const [format, setFormat] = useState<PocFormat>('nuclei');
  const [vulnType, setVulnType] = useState('');
  const [fofaQuery, setFofaQuery] = useState('');
  const [affectedComponent, setAffectedComponent] = useState('');
  const [description, setDescription] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [remediation, setRemediation] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [inferenceHint, setInferenceHint] = useState<string | null>(null);

  // Delete modal state
  const [pocToDelete, setPocToDelete] = useState<PocItem | null>(null);

  // Batch import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importPreview, setImportPreview] = useState<BatchImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract unique tags from POCs
  const availableTags = useMemo(() => {
    const set = new Set<string>();
    pocs.forEach((p) => {
      p.tags?.forEach((t) => set.add(t));
    });
    return Array.from(set).sort();
  }, [pocs]);

  // Filtered POC list
  const filteredPocs = useMemo(() => {
    return pocs.filter((p) => {
      if (selectedSeverity !== 'all' && p.severity !== selectedSeverity) {
        return false;
      }
      if (selectedFormat !== 'all' && p.format !== selectedFormat) {
        return false;
      }
      if (selectedTag && !p.tags?.includes(selectedTag)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const mName = p.name.toLowerCase().includes(q);
        const mCve = p.cveId?.toLowerCase().includes(q);
        const mComp = p.affectedComponent.toLowerCase().includes(q);
        const mDesc = p.description.toLowerCase().includes(q);
        const mFofa = p.fofaQuery?.toLowerCase().includes(q);
        const mTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!mName && !mCve && !mComp && !mDesc && !mFofa && !mTags) {
          return false;
        }
      }
      return true;
    });
  }, [pocs, selectedSeverity, selectedFormat, selectedTag, searchQuery]);

  const criticalCount = pocs.filter((p) => p.severity === 'critical').length;
  const highCount = pocs.filter((p) => p.severity === 'high').length;

  const handleStartAdd = () => {
    setEditingPoc(null);
    setName('');
    setCveId('');
    setSeverity('critical');
    setFormat('nuclei');
    setVulnType('RCE 远程代码执行');
    setFofaQuery('');
    setAffectedComponent('');
    setDescription('');
    setTargetPath('');
    setTemplateContent('');
    setRemediation('');
    setReferenceUrl('');
    setTags(['rce', 'cve']);
    setInferenceHint(null);
    setIsModalOpen(true);
  };

  const handleStartEdit = (poc: PocItem) => {
    setEditingPoc(poc);
    setName(poc.name);
    setCveId(poc.cveId || '');
    setSeverity(poc.severity);
    setFormat(poc.format);
    setVulnType(poc.vulnType || '');
    setFofaQuery(poc.fofaQuery || '');
    setAffectedComponent(poc.affectedComponent || '');
    setDescription(poc.description || '');
    setTargetPath(poc.targetPath || '');
    setTemplateContent(poc.templateContent || '');
    setRemediation(poc.remediation || '');
    setReferenceUrl(poc.references?.[0] || '');
    setTags(poc.tags || []);
    setInferenceHint(null);
    setIsModalOpen(true);
  };

  // Smart inference trigger
  const handleTriggerSmartInference = () => {
    if (!name.trim()) return;
    const res = inferVulnMetadata(name, affectedComponent);
    setSeverity(res.severity);
    setVulnType(res.vulnType);
    if (!fofaQuery.trim() && res.suggestedFofaQuery) {
      setFofaQuery(res.suggestedFofaQuery);
    }
    const merged = new Set([...tags, ...res.tags]);
    setTags(Array.from(merged));
    setInferenceHint(`✨ 已智能匹配：${res.vulnType} · ${res.severity.toUpperCase()}`);
    setTimeout(() => setInferenceHint(null), 3500);
  };

  const handleBrowseFile = async () => {
    const picked = await platformBridge.selectFile([
      { name: 'POC 脚本与模板', extensions: ['yaml', 'yml', 'py', 'sh', 'txt', 'json'] },
      { name: '所有文件', extensions: ['*'] }
    ]);
    if (picked) {
      setTargetPath(picked);
      if (!name) {
        const fname = picked.split(/[\\/]/).pop()?.replace(/\.[^/.]+$/, '') || '';
        setName(fname);
      }
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tRemove: string) => {
    setTags(tags.filter((t) => t !== tRemove));
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const referencesList = referenceUrl.trim() ? [referenceUrl.trim()] : editingPoc?.references || [];

    const payload: PocItem = {
      id: editingPoc ? editingPoc.id : 'poc_' + Date.now().toString(36),
      name: name.trim(),
      cveId: cveId.trim() || undefined,
      severity,
      format,
      vulnType: vulnType.trim() || undefined,
      fofaQuery: fofaQuery.trim() || undefined,
      affectedComponent: affectedComponent.trim() || '通用目标',
      description: description.trim(),
      targetPath: targetPath.trim() || undefined,
      templateContent: templateContent.trim() || undefined,
      remediation: remediation.trim() || undefined,
      references: referencesList,
      tags,
      author: editingPoc?.author || 'CyberNest',
      usageCount: editingPoc?.usageCount || 0,
      isFavorite: editingPoc ? editingPoc.isFavorite : false,
      createdAt: editingPoc ? editingPoc.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await savePoc(payload);
    setIsModalOpen(false);
  };

  const handleCopyTemplate = async (poc: PocItem) => {
    let content = poc.templateContent || poc.targetPath || '';
    if (targetHost.trim()) {
      content = content.replace(/{TARGET}/g, targetHost.trim());
      content = content.replace(/{{BaseURL}}/g, targetHost.trim());
      content = content.replace(/{{Hostname}}/g, targetHost.replace(/^https?:\/\//, '').split('/')[0]);
    }
    await navigator.clipboard.writeText(content);
    setCopiedId(poc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyFofa = async (queryStr: string, pocId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(queryStr);
    setCopiedFofaId(pocId);
    setTimeout(() => setCopiedFofaId(null), 2000);
    addToast({
      type: 'info',
      title: '已复制 FOFA 测绘语句',
      message: queryStr,
      duration: 2000
    });
  };

  const handleOpenFofa = (queryStr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const b64 = btoa(unescape(encodeURIComponent(queryStr)));
      const url = `https://fofa.info/result?qbase64=${encodeURIComponent(b64)}`;
      platformBridge.openExternalUrl(url);
    } catch {
      platformBridge.openExternalUrl(`https://fofa.info/result?q=${encodeURIComponent(queryStr)}`);
    }
  };

  const handleRunPoc = (poc: PocItem) => {
    executePoc(poc, targetHost.trim());
  };

  // Batch import parsing
  const handleParseImport = () => {
    setImportError(null);
    if (!importJsonText.trim()) {
      setImportError('请输入或选择需要导入的 JSON 数据');
      return;
    }
    try {
      const res = parseBatchPocData(importJsonText, pocs);
      setImportPreview(res);
      if (res.importedItems.length === 0) {
        setImportError(`未发现可新增条目：总共解析 ${res.totalParsed} 条，其中 ${res.duplicatesCount} 条与本地已有库重复。`);
      }
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'JSON 格式解析失败');
      setImportPreview(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
        try {
          const res = parseBatchPocData(content, pocs);
          setImportPreview(res);
          setImportError(null);
        } catch (err) {
          setImportError(err instanceof Error ? err.message : '文件解析失败');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteBatchImport = async () => {
    if (!importPreview || importPreview.importedItems.length === 0) return;
    setIsImporting(true);
    try {
      await batchImportPocs(importPreview.importedItems);
      setIsImportModalOpen(false);
      setImportJsonText('');
      setImportPreview(null);
    } finally {
      setIsImporting(false);
    }
  };

  const getSeverityBadge = (sev: PocSeverity) => {
    switch (sev) {
      case 'critical':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/40',
          label: '严重 CRITICAL',
          dot: 'bg-rose-500'
        };
      case 'high':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
          label: '高危 HIGH',
          dot: 'bg-amber-500'
        };
      case 'medium':
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40',
          label: '中危 MEDIUM',
          dot: 'bg-blue-500'
        };
      case 'low':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700/40',
          label: '低危 LOW',
          dot: 'bg-slate-400'
        };
      case 'info':
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/40',
          label: '信息 INFO',
          dot: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1e293b]">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-[#f1f5f9] flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>POC 漏洞验证与资产管理</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-mono font-medium border border-rose-200 dark:border-rose-800/40">
              {filteredPocs.length} / {pocs.length} 条验证规则
            </span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#94a3b8] mt-1">
            集中管理 CVE 探测模板、Nuclei YAML 规则、FOFA 资产测绘语法、智能定级推断与官方缓解指南
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={() => {
              setImportJsonText('');
              setImportPreview(null);
              setImportError(null);
              setIsImportModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#162032] dark:hover:bg-[#1e293b] border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-[#f1f5f9] text-xs font-medium flex items-center space-x-1.5 transition-colors"
            title="批量导入公开仓库导出的 POC 数据"
          >
            <UploadCloud className="w-4 h-4 text-sky-500" />
            <span>批量导入 POC 库</span>
          </button>

          <button
            type="button"
            onClick={handleStartAdd}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500 text-white text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>登记新 POC 模板</span>
          </button>
        </div>
      </div>

      {/* 2. Target Host / URL Dynamic Variable Injection Bar */}
      <div className="bg-gradient-to-r from-rose-500/10 via-sky-500/10 to-transparent p-4 rounded-xl border border-rose-500/20 dark:border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/15 border border-rose-500/25 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-[#f1f5f9] flex items-center space-x-2">
              <span>待验证目标动态注入 (Target Variable Injection)</span>
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-[#94a3b8] mt-0.5">
              拷贝或调用模板时，其中的 <code className="text-rose-600 dark:text-rose-400 font-mono font-bold bg-rose-50 dark:bg-rose-950/60 px-1 py-0.5 rounded">{'{TARGET}'}</code> 与 <code className="text-sky-600 dark:text-sky-400 font-mono font-bold bg-sky-50 dark:bg-sky-950/60 px-1 py-0.5 rounded">{'{{BaseURL}}'}</code> 将自动替换为下方目标
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white/90 dark:bg-[#0d121f]/90 p-2 rounded-lg border border-slate-200 dark:border-[#1e293b] self-start md:self-auto shadow-sm">
          <Globe className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">目标 URL / 主机:</span>
          <input
            type="text"
            value={targetHost}
            onChange={(e) => setTargetHost(e.target.value)}
            placeholder="http://192.168.1.100:8080"
            className="w-52 px-2 py-1 bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-[#1e293b] rounded text-xs font-mono text-slate-900 dark:text-rose-300 focus:outline-none focus:border-rose-500 font-medium"
          />
        </div>
      </div>

      {/* 3. Filter Toolbar & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111827] p-3 rounded-xl border border-slate-200 dark:border-[#1e293b]">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索 CVE 编号、POC 名称、组件名、FOFA 测绘或标签..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg text-xs text-slate-900 dark:text-[#f1f5f9] placeholder-slate-400 dark:placeholder-[#64748b] focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Format & View Mode Switcher */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {/* Format Dropdown */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] text-xs text-slate-700 dark:text-[#94a3b8] focus:outline-none focus:border-rose-500"
          >
            <option value="all">全部格式</option>
            <option value="nuclei">Nuclei (YAML)</option>
            <option value="http">Raw HTTP</option>
            <option value="python">Python 脚本</option>
            <option value="bash">Bash / CLI</option>
            <option value="other">其他</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-[#0d121f] p-1 rounded-lg border border-slate-200 dark:border-[#1e293b]">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#1e293b] text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f1f5f9]'
              }`}
              title="网格卡片视图"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-[#1e293b] text-rose-600 dark:text-rose-400 shadow-sm'
                  : 'text-slate-500 dark:text-[#94a3b8] hover:text-slate-900 dark:hover:text-[#f1f5f9]'
              }`}
              title="表格列表视图"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Severity Pills & Tags Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Severity Quick Filters */}
        <div className="flex items-center space-x-1.5">
          <span className="text-slate-500 dark:text-[#64748b] text-[11px] font-medium mr-1">危害等级:</span>
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((sev) => {
            const isSel = selectedSeverity === sev;
            const labelMap: Record<string, string> = {
              all: `全部 (${pocs.length})`,
              critical: `严重 (${criticalCount})`,
              high: `高危 (${highCount})`,
              medium: '中危',
              low: '低危',
            };
            return (
              <button
                key={sev}
                type="button"
                onClick={() => setSelectedSeverity(sev)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  isSel
                    ? sev === 'critical'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : sev === 'high'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e293b] hover:bg-slate-200 dark:hover:bg-[#162032]'
                }`}
              >
                {labelMap[sev]}
              </button>
            );
          })}
        </div>

        {/* Tag Filters */}
        {availableTags.length > 0 && (
          <div className="flex items-center flex-wrap gap-1">
            {availableTags.slice(0, 8).map((t) => {
              const isSel = selectedTag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(isSel ? null : t)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    isSel
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-100 dark:bg-[#111827] text-slate-600 dark:text-[#94a3b8] border border-slate-200 dark:border-[#1e293b] hover:text-rose-600 dark:hover:text-rose-400'
                  }`}
                >
                  #{t}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. POC Cards (Grid) or Table (List) */}
      {filteredPocs.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPocs.map((poc) => {
              const sevBadge = getSeverityBadge(poc.severity);
              const isCopied = copiedId === poc.id;
              const isFofaCopied = copiedFofaId === poc.id;

              return (
                <div
                  key={poc.id}
                  className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl p-4 flex flex-col justify-between hover:border-rose-500/50 dark:hover:border-rose-500/40 hover:shadow-md transition-all group relative"
                >
                  <div>
                    {/* Header: CVE + Severity + Format + Actions */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        {poc.cveId ? (
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40">
                            {poc.cveId}
                          </span>
                        ) : (
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-400">
                            POC-GEN
                          </span>
                        )}

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${sevBadge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sevBadge.dot}`} />
                          <span>{sevBadge.label}</span>
                        </span>

                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-[#94a3b8] uppercase">
                          {poc.format}
                        </span>

                        {poc.vulnType && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-sans border border-purple-200 dark:border-purple-800/40 hidden sm:inline-block">
                            {poc.vulnType}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleFavoritePoc(poc.id)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 dark:text-[#64748b] hover:text-amber-500 transition-colors"
                          title={poc.isFavorite ? '取消收藏' : '加入收藏'}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              poc.isFavorite
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-400 dark:text-[#64748b]'
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(poc)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 dark:text-[#64748b] hover:text-slate-700 dark:hover:text-[#f1f5f9] transition-colors"
                          title="编辑 POC"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPocToDelete(poc)}
                          className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 dark:text-[#64748b] hover:text-red-500 transition-colors"
                          title="删除 POC"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* POC Title */}
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#f1f5f9] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {poc.name}
                    </h3>

                    {/* Affected Component */}
                    <div className="text-[11px] font-mono text-slate-500 dark:text-[#94a3b8] mt-1 flex items-center space-x-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">受影响组件:</span>
                      <span className="truncate">{poc.affectedComponent}</span>
                    </div>

                    {/* Description */}
                    {poc.description && (
                      <p className="text-xs text-slate-600 dark:text-[#94a3b8] mt-1.5 leading-relaxed line-clamp-2">
                        {poc.description}
                      </p>
                    )}

                    {/* FOFA Asset Query Bar (Idea 1) */}
                    {poc.fofaQuery && (
                      <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/40 text-[11px] flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 truncate text-sky-800 dark:text-sky-300 min-w-0">
                          <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 flex-shrink-0" />
                          <span className="font-bold text-[10px] font-mono uppercase text-sky-600 dark:text-sky-400">FOFA:</span>
                          <span className="font-mono truncate select-all">{poc.fofaQuery}</span>
                        </div>
                        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handleCopyFofa(poc.fofaQuery!, poc.id, e)}
                            className="p-1 rounded hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-600 dark:text-sky-400 flex items-center space-x-0.5 text-[10px]"
                            title="复制 FOFA 测绘语句"
                          >
                            {isFofaCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            <span>{isFofaCopied ? '已复制' : '复制'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleOpenFofa(poc.fofaQuery!, e)}
                            className="p-1 rounded hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-600 dark:text-sky-400 flex items-center space-x-0.5 text-[10px]"
                            title="在默认浏览器中打开 FOFA 检索公网暴露面"
                          >
                            <span>搜靶机</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Verification / Template Preview Box */}
                    {(poc.templateContent || poc.targetPath) && (
                      <div className="relative mt-2.5 rounded-lg bg-[#090d16] border border-[#1e293b] p-3 overflow-hidden shadow-inner">
                        <pre className="font-mono text-xs text-slate-200 overflow-x-auto max-h-36 whitespace-pre-wrap break-all leading-5 select-all scrollbar-thin">
                          {poc.templateContent || poc.targetPath}
                        </pre>

                        <button
                          type="button"
                          onClick={() => handleCopyTemplate(poc)}
                          className={`absolute top-2 right-2 px-2.5 py-1 rounded text-xs font-mono font-medium flex items-center space-x-1.5 transition-all shadow-sm ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#1e293b] hover:bg-[#334155] text-rose-300 hover:text-rose-200'
                          }`}
                          title="一键拷贝验证代码 / 模板"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>已复制</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>复制模板</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {/* Official Remediation Note */}
                    {poc.remediation && (
                      <div className="mt-2.5 px-2.5 py-2 rounded-lg bg-emerald-50/70 dark:bg-[#0c1815] border border-emerald-200/80 dark:border-emerald-800/30 text-[11px] text-emerald-900 dark:text-emerald-300 space-y-0.5">
                        <div className="flex items-center space-x-1 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>官方修复与安全防护指引:</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-line text-[11px] opacity-90 pl-4">
                          {poc.remediation}
                        </p>
                      </div>
                    )}

                    {/* References Links */}
                    {poc.references && poc.references.length > 0 && (
                      <div className="mt-2 flex items-center space-x-2 text-[10px] text-slate-500 dark:text-[#64748b]">
                        <span>参考公告:</span>
                        {poc.references.map((ref, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => platformBridge.openExternalUrl(ref)}
                            className="text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-0.5 truncate max-w-xs"
                            title={ref}
                          >
                            <span className="truncate">参考链接 {idx + 1}</span>
                            <ExternalLink className="w-2.5 h-2.5 ml-0.5 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    {poc.tags && poc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {poc.tags.map((tag) => (
                          <span
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-[#94a3b8] hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1e293b]/70 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 dark:text-[#64748b] font-mono">
                      验证调用: {poc.usageCount || 0} 次
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleCopyTemplate(poc)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#162032] text-slate-700 dark:text-[#94a3b8] text-xs font-medium flex items-center space-x-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制模板</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRunPoc(poc)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
                      >
                        <Terminal className="w-3.5 h-3.5" />
                        <span>调用验证</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table List View */
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#0d121f] text-slate-600 dark:text-[#94a3b8] font-mono uppercase border-b border-slate-200 dark:border-[#1e293b]">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">★</th>
                    <th className="py-2.5 px-3">CVE 编号</th>
                    <th className="py-2.5 px-3">POC 名称与测绘语法</th>
                    <th className="py-2.5 px-3">危害等级</th>
                    <th className="py-2.5 px-3">格式</th>
                    <th className="py-2.5 px-3">影响组件</th>
                    <th className="py-2.5 px-3 text-right">调用频次</th>
                    <th className="py-2.5 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-[#1e293b]">
                  {filteredPocs.map((poc) => {
                    const sevBadge = getSeverityBadge(poc.severity);
                    const isFofaCopied = copiedFofaId === poc.id;
                    return (
                      <tr key={poc.id} className="hover:bg-slate-50/80 dark:hover:bg-[#162032]/40 transition-colors">
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleFavoritePoc(poc.id)}
                            className="text-slate-400 hover:text-amber-500"
                          >
                            <Star className={`w-3.5 h-3.5 ${poc.isFavorite ? 'text-amber-500 fill-amber-500' : ''}`} />
                          </button>
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-rose-600 dark:text-rose-400">
                          {poc.cveId || '-'}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900 dark:text-[#f1f5f9] flex items-center space-x-1.5">
                            <span>{poc.name}</span>
                            {poc.vulnType && (
                              <span className="text-[10px] px-1 py-0.2 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 font-sans border border-purple-200 dark:border-purple-800/40">
                                {poc.vulnType}
                              </span>
                            )}
                          </div>
                          {poc.fofaQuery && (
                            <div className="flex items-center space-x-1 text-[10px] font-mono text-sky-600 dark:text-sky-400 mt-0.5">
                              <Globe className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate max-w-xs">{poc.fofaQuery}</span>
                              <button
                                type="button"
                                onClick={(e) => handleCopyFofa(poc.fofaQuery!, poc.id, e)}
                                className="text-slate-400 hover:text-sky-500 ml-1"
                                title="复制测绘语句"
                              >
                                {isFofaCopied ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center space-x-1 w-max ${sevBadge.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sevBadge.dot}`} />
                            <span>{sevBadge.label}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 uppercase font-mono text-[11px] text-slate-600 dark:text-[#94a3b8]">
                          {poc.format}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-[#cbd5e1] truncate max-w-xs">
                          {poc.affectedComponent}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500 dark:text-[#64748b]">
                          {poc.usageCount || 0}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopyTemplate(poc)}
                              className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white"
                              title="复制模板"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRunPoc(poc)}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="调用验证"
                            >
                              <Terminal className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(poc)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
                              title="编辑"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPocToDelete(poc)}
                              className="p-1 rounded text-slate-400 hover:text-rose-500"
                              title="删除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        /* Empty State */
        <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl p-12 text-center">
          <ShieldAlert className="w-10 h-10 text-slate-300 dark:text-[#334155] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-[#f1f5f9]">未发现匹配的 POC 规则</h3>
          <p className="text-xs text-slate-500 dark:text-[#64748b] mt-1 max-w-sm mx-auto">
            {searchQuery || selectedSeverity !== 'all' || selectedFormat !== 'all' || selectedTag
              ? '当前筛选条件下暂无条目，您可以清除搜索词或重置筛选'
              : '当前尚未录入 POC 规则，您可以手动登记或从公开仓库批量导入'}
          </p>
          <div className="mt-4 flex items-center justify-center space-x-2.5">
            <button
              type="button"
              onClick={() => {
                setImportJsonText('');
                setImportPreview(null);
                setImportError(null);
                setIsImportModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#162032] border border-slate-200 dark:border-[#1e293b] text-slate-700 dark:text-white text-xs font-medium"
            >
              📥 批量导入公开库
            </button>
            <button
              type="button"
              onClick={handleStartAdd}
              className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-sm"
            >
              + 登记首条 POC 模板
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit POC Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveSubmit}
            className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e293b] pb-3">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-[#f1f5f9]">
                  {editingPoc ? `编辑 POC 模板: ${editingPoc.name}` : '登记新 POC 漏洞验证模板'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 dark:text-[#64748b] hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* POC Name with Smart Inference Button (Idea 2) */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-[#94a3b8] font-medium flex items-center space-x-1">
                    <span>POC 验证名称 *</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleTriggerSmartInference}
                    className="text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium flex items-center space-x-1 transition-colors"
                    title="根据输入的漏洞名称智能推断危害等级、漏洞类型、标签与测绘语法"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>智能推断参数 (AI / 规则)</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例如: Apache ActiveMQ OpenWire 反序列化远程代码执行漏洞"
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] focus:outline-none focus:border-rose-500"
                />
                {inferenceHint && (
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 mt-1 font-mono animate-in fade-in duration-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{inferenceHint}</span>
                  </div>
                )}
              </div>

              {/* CVE ID */}
              <div>
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">CVE / 漏洞编号</label>
                <input
                  type="text"
                  value={cveId}
                  onChange={(e) => setCveId(e.target.value)}
                  placeholder="例如: CVE-2024-4577"
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Severity */}
              <div>
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">危害等级 *</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as PocSeverity)}
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] focus:outline-none focus:border-rose-500"
                >
                  <option value="critical">严重 (Critical - 远程执行/认证绕过)</option>
                  <option value="high">高危 (High - 越权/注入/严重信息泄露)</option>
                  <option value="medium">中危 (Medium - 敏感端点暴露/配置弱点)</option>
                  <option value="low">低危 (Low - 基础信息指纹)</option>
                  <option value="info">信息 (Info - 组件探测)</option>
                </select>
              </div>

              {/* Format & Vuln Type */}
              <div>
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">模板 / 验证格式</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as PocFormat)}
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] focus:outline-none focus:border-rose-500"
                >
                  <option value="nuclei">Nuclei (YAML 规则)</option>
                  <option value="http">Raw HTTP 请求特征</option>
                  <option value="python">Python 验证脚本</option>
                  <option value="bash">Bash / CLI 命令行</option>
                  <option value="yaml">通用 YAML</option>
                  <option value="other">其他</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">漏洞分类 / 类型</label>
                <input
                  type="text"
                  value={vulnType}
                  onChange={(e) => setVulnType(e.target.value)}
                  placeholder="例如: RCE 远程代码执行 / SQL注入"
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Affected Component */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">受影响组件及版本 *</label>
                <input
                  type="text"
                  required
                  value={affectedComponent}
                  onChange={(e) => setAffectedComponent(e.target.value)}
                  placeholder="例如: Apache ActiveMQ < 5.18.3"
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* FOFA Query (Idea 1) */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-[#94a3b8] font-medium flex items-center space-x-1">
                    <Globe className="w-3.5 h-3.5 text-sky-500" />
                    <span>FOFA / 空间网络测绘语法 (可选)</span>
                  </label>
                  <span className="text-[10px] text-slate-400">用于快速检索公网暴露面靶机</span>
                </div>
                <input
                  type="text"
                  value={fofaQuery}
                  onChange={(e) => setFofaQuery(e.target.value)}
                  placeholder='例如: app="Apache-ActiveMQ" || port="61616"'
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">漏洞简述与探测机理</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="说明该漏洞触发原理、受影响端口或前置条件..."
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Command / Local Script Path */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">
                  验证命令 / 本地脚本模板路径 (可选，支持 {'{TARGET}'})
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={targetPath}
                    onChange={(e) => setTargetPath(e.target.value)}
                    placeholder="例如: nuclei -t cves/2023/CVE-2023-46604.yaml -u {TARGET}"
                    className="flex-1 bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] font-mono focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleBrowseFile}
                    className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#162032] dark:hover:bg-[#1e293b] border border-slate-200 dark:border-[#1e293b] text-xs text-slate-700 dark:text-[#38bdf8] flex items-center space-x-1.5 flex-shrink-0"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>选择文件</span>
                  </button>
                </div>
              </div>

              {/* Template Content (YAML / Raw HTTP) */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">
                  验证模板内容 (YAML / HTTP 数据包 / 验证代码)
                </label>
                <textarea
                  rows={5}
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  placeholder="在此粘贴 Nuclei YAML 探测规则、Raw HTTP 判定数据包或验证代码..."
                  className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-[#1e293b] rounded-lg p-3 text-slate-900 dark:text-slate-200 font-mono text-xs focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Remediation Guidance */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">
                  官方修复与防护缓解指南 (Remediation)
                </label>
                <textarea
                  rows={2}
                  value={remediation}
                  onChange={(e) => setRemediation(e.target.value)}
                  placeholder="官方补丁升级版本、端口防护或临时缓解措施..."
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Reference URL */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">参考资料与安全公告链接</label>
                <input
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="https://nvd.nist.gov/vuln/detail/CVE-..."
                  className="w-full bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-2 text-slate-900 dark:text-[#f1f5f9] font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Tags */}
              <div className="sm:col-span-2">
                <label className="block text-slate-700 dark:text-[#94a3b8] mb-1 font-medium">分类标签</label>
                <div className="flex items-center space-x-2 mb-2">
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
                    placeholder="输入标签名按 Enter 添加 (如: rce, deserialization)"
                    className="flex-1 bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-[#f1f5f9] focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1e293b] dark:hover:bg-[#334155] text-slate-700 dark:text-white text-xs"
                  >
                    添加标签
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1e293b] text-slate-700 dark:text-[#94a3b8] font-mono text-[11px] flex items-center space-x-1"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-[#1e293b]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-[#1e293b] text-xs text-slate-700 dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#162032]"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium shadow-sm"
              >
                保存 POC 规则
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Batch Import Modal (Idea 3) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1e293b] pb-3">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-[#f1f5f9]">
                  批量导入公开 POC 仓库数据
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 dark:text-[#64748b] hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#94a3b8] leading-relaxed">
              支持导入从 <strong className="text-slate-900 dark:text-slate-200">cryingtor/POC_platform</strong>、Nuclei 导出的 JSON 记录或 CyberNest 规则文件。系统会自动去重并智能补全危害定级与分类。
            </p>

            {/* File Pick button & Raw Text Area */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  选择本地 JSON 文件 或 直接粘贴内容:
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#1e293b] dark:hover:bg-[#334155] text-slate-700 dark:text-sky-400 flex items-center space-x-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>选择 .json 文件</span>
                </button>
              </div>

              <textarea
                rows={6}
                value={importJsonText}
                onChange={(e) => {
                  setImportJsonText(e.target.value);
                  setImportPreview(null);
                  setImportError(null);
                }}
                placeholder='在此粘贴 JSON 数组，例如: [{"vuln_name":"...", "cve":"...", "fofa_query":"...", "poc_code":"..."}]'
                className="w-full bg-slate-50 dark:bg-[#090d16] border border-slate-200 dark:border-[#1e293b] rounded-lg p-3 font-mono text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-sky-500"
              />

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleParseImport}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-medium"
                >
                  解析并校验
                </button>
              </div>
            </div>

            {/* Error Message */}
            {importError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}

            {/* Parsing Preview Summary */}
            {importPreview && (
              <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-[#1e293b]">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b]">
                    <div className="text-[10px] text-slate-500">识别总数</div>
                    <div className="text-base font-bold font-mono text-slate-800 dark:text-[#f1f5f9]">
                      {importPreview.totalParsed}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40">
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400">可新增入库</div>
                    <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                      +{importPreview.importedItems.length}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40">
                    <div className="text-[10px] text-amber-600 dark:text-amber-400">重复自动忽略</div>
                    <div className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                      {importPreview.duplicatesCount}
                    </div>
                  </div>
                </div>

                {/* Previews of the first 3 items */}
                {importPreview.importedItems.length > 0 && (
                  <div>
                    <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                      待导入数据前置预览 (前 3 条):
                    </div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {importPreview.importedItems.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded bg-slate-50 dark:bg-[#0d121f] border border-slate-200 dark:border-[#1e293b] text-xs flex items-center justify-between"
                        >
                          <div className="truncate pr-2">
                            <span className="font-semibold text-slate-900 dark:text-[#f1f5f9] truncate">
                              {item.name}
                            </span>
                            <div className="text-[10px] text-slate-500 font-mono truncate">
                              {item.cveId || '无 CVE'} · {item.vulnType || '综合利用'} · {item.fofaQuery || '无 FOFA 语句'}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 flex-shrink-0">
                            {item.severity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-[#1e293b]">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-[#1e293b] text-xs text-slate-700 dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#162032]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleExecuteBatchImport}
                disabled={!importPreview || importPreview.importedItems.length === 0 || isImporting}
                className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-medium shadow-sm flex items-center space-x-1.5"
              >
                {isImporting ? (
                  <span>导入中...</span>
                ) : (
                  <span>确认导入 ({importPreview?.importedItems.length || 0} 条)</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {pocToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1e293b] rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-500">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-[#f1f5f9]">确认移除此 POC 规则？</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#94a3b8] leading-relaxed">
              确定要删除 POC <strong className="text-slate-900 dark:text-white font-bold">“{pocToDelete.name}”</strong> 吗？
              {pocToDelete.cveId && (
                <span className="block mt-1 font-mono text-rose-500 font-semibold">
                  编号: {pocToDelete.cveId}
                </span>
              )}
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-[#1e293b]">
              <button
                type="button"
                onClick={() => setPocToDelete(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#1e293b] text-xs text-slate-700 dark:text-[#94a3b8] hover:bg-slate-100 dark:hover:bg-[#162032]"
              >
                取消
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deletePoc(pocToDelete.id);
                  setPocToDelete(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs text-white font-medium shadow-sm"
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

export default PocManagerPage;
