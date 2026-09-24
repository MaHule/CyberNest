import { PocItem, PocSeverity, PocFormat } from '../types';
import { inferVulnMetadata } from './pocInference';

export interface BatchImportResult {
  importedItems: PocItem[];
  duplicatesCount: number;
  invalidCount: number;
  totalParsed: number;
}

const SEVERITY_CN_MAP: Record<string, PocSeverity> = {
  '严重': 'critical',
  'critical': 'critical',
  '高危': 'high',
  'high': 'high',
  '中危': 'medium',
  'medium': 'medium',
  '低危': 'low',
  'low': 'low',
  '信息': 'info',
  'info': 'info',
};

/**
 * 智能解析批量导入的 POC 数据
 * 兼容:
 * 1. cryingtor/POC_platform 的 JSON 格式 (vuln_name, fofa_query, poc_code 等)
 * 2. CyberNest 原生导出的 PocItem 数组
 * 3. 泛用性安全漏洞清单 (带 name/title/cve 字段)
 */
export function parseBatchPocData(rawJson: string, existingPocs: PocItem[]): BatchImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new Error('JSON 格式解析失败，请检查文件是否为有效的 JSON 格式');
  }

  const list: any[] = Array.isArray(parsed) ? parsed : (parsed as any)?.pocs || [];
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error('未在数据中找到有效的 POC 数组记录');
  }

  // 建立去重索引库 (按 cveId 或 name 进行快速碰撞排重)
  const existingNames = new Set(existingPocs.map((p) => p.name.trim().toLowerCase()));
  const existingCves = new Set(
    existingPocs.map((p) => p.cveId?.trim().toUpperCase()).filter(Boolean)
  );

  const importedItems: PocItem[] = [];
  let duplicatesCount = 0;
  let invalidCount = 0;

  for (const raw of list) {
    if (!raw || typeof raw !== 'object') {
      invalidCount++;
      continue;
    }

    const name: string = (raw.name || raw.vuln_name || raw.title || '').trim();
    if (!name) {
      invalidCount++;
      continue;
    }

    // 提取 CVE
    let cveId: string | undefined = (raw.cveId || raw.cve || '').trim();
    if (!cveId) {
      const cveMatch = name.match(/CVE-\d{4}-\d{4,7}/i) || (raw.description || '').match(/CVE-\d{4}-\d{4,7}/i);
      if (cveMatch) {
        cveId = cveMatch[0].toUpperCase();
      }
    } else {
      cveId = cveId.toUpperCase();
    }

    // 重复判定
    const normName = name.toLowerCase();
    if (existingNames.has(normName) || (cveId && existingCves.has(cveId))) {
      duplicatesCount++;
      continue;
    }

    // 影响组件与版本
    const affectedComponent: string = (raw.affectedComponent || raw.affected || '').trim();

    // 智能推断缺省的类型、等级与标签
    const inferred = inferVulnMetadata(name, affectedComponent);

    // 判定危害等级
    let severity: PocSeverity = inferred.severity;
    const rawSev = String(raw.severity || '').toLowerCase();
    if (SEVERITY_CN_MAP[rawSev]) {
      severity = SEVERITY_CN_MAP[rawSev];
    }

    // 判定格式 (Nuclei / HTTP / Python / Bash / YAML / Other)
    let format: PocFormat = 'nuclei';
    const codeContent = String(raw.templateContent || raw.poc_code || '').trim();
    if (raw.format && ['nuclei', 'yaml', 'python', 'http', 'bash', 'other'].includes(raw.format)) {
      format = raw.format;
    } else if (codeContent.startsWith('id:') || codeContent.includes('requests:') || codeContent.includes('matchers:')) {
      format = 'nuclei';
    } else if (codeContent.startsWith('GET ') || codeContent.startsWith('POST ') || codeContent.startsWith('PUT ')) {
      format = 'http';
    } else if (codeContent.includes('import requests') || codeContent.includes('def ') || codeContent.includes('python')) {
      format = 'python';
    } else if (codeContent.startsWith('#!/bin/bash') || codeContent.includes('curl ') || codeContent.includes('wget ')) {
      format = 'bash';
    }

    // 标签处理
    const tagsSet = new Set<string>(inferred.tags);
    if (Array.isArray(raw.tags)) {
      raw.tags.forEach((t: string) => tagsSet.add(String(t).trim().toLowerCase()));
    } else if (typeof raw.tags === 'string' && raw.tags.trim()) {
      raw.tags.split(/[,，\s]+/).forEach((t: string) => {
        if (t.trim()) tagsSet.add(t.trim().toLowerCase());
      });
    }

    // 测绘语法
    const fofaQuery: string | undefined = (raw.fofaQuery || raw.fofa_query || inferred.suggestedFofaQuery || '').trim() || undefined;

    // 引用链接
    let references: string[] = [];
    if (Array.isArray(raw.references)) {
      references = raw.references.map(String);
    } else if (typeof raw.references === 'string' && raw.references.trim()) {
      references = raw.references.split('\n').map((s: string) => s.trim()).filter(Boolean);
    }

    const newItem: PocItem = {
      id: raw.id && !existingPocs.some((e) => e.id === raw.id) ? raw.id : `poc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      cveId: cveId || undefined,
      severity,
      format,
      vulnType: raw.vulnType || raw.vuln_type || inferred.vulnType,
      fofaQuery,
      affectedComponent: affectedComponent || '通用版本',
      description: (raw.description || '').trim() || `${name} 安全漏洞验证模板`,
      targetPath: (raw.targetPath || '').trim() || undefined,
      templateContent: codeContent || undefined,
      remediation: (raw.remediation || raw.repair || '').trim() || '暂无详细缓解指引，建议关注官方最新安全补丁。',
      references,
      tags: Array.from(tagsSet),
      author: raw.author || raw.source || 'Batch Imported',
      usageCount: 0,
      isFavorite: false,
      createdAt: raw.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    importedItems.push(newItem);
    existingNames.add(normName);
    if (cveId) existingCves.add(cveId);
  }

  return {
    importedItems,
    duplicatesCount,
    invalidCount,
    totalParsed: list.length,
  };
}
