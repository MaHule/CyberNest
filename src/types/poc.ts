export type PocSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type PocFormat = 'nuclei' | 'yaml' | 'python' | 'http' | 'bash' | 'other';

export interface PocItem {
  id: string;
  name: string;                         // POC 漏洞验证名称, e.g. "Apache ActiveMQ 远程代码执行漏洞验证"
  cveId?: string;                       // e.g. "CVE-2023-46604"
  severity: PocSeverity;                // 危害级别
  format: PocFormat;                    // 模板/脚本格式
  vulnType?: string;                    // 漏洞类型, e.g. "RCE" / "SQL注入" / "未授权访问"
  fofaQuery?: string;                   // FOFA / 空间网络测绘语法, e.g. app="Apache-ActiveMQ"
  affectedComponent: string;            // 影响组件与版本, e.g. "Apache ActiveMQ <= 5.18.2"
  description: string;                  // 漏洞简介与探测原理
  targetPath?: string;                  // 本地验证脚本或模板文件绝对路径
  templateContent?: string;             // 探测模板内容 (如 YAML 规则或 HTTP 数据包)
  remediation?: string;                 // 官方修复缓解建议
  references?: string[];                // 参考公告 / NVD / 补丁链接
  tags: string[];                       // 标签: rce, deserialization, auth-bypass, web 等
  author?: string;                      // 编写者 / 来源
  usageCount: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}
