import { PocSeverity } from '../types';

export interface InferredPocMeta {
  vulnType: string;
  severity: PocSeverity;
  tags: string[];
  suggestedFofaQuery?: string;
}

/**
 * 根据漏洞名称与影响组件，智能推断漏洞类型、危害等级、推荐标签与 FOFA 测绘语法
 * 规则库汲取并拓展了主流开源漏洞管理平台的实战关键词经验
 */
export function inferVulnMetadata(name: string, affectedComponent: string = ''): InferredPocMeta {
  const text = `${name} ${affectedComponent}`.toLowerCase();

  // 1. 智能推断严重等级 (参考 CVSS 与实战定级标准)
  let severity: PocSeverity = 'medium';
  const criticalKw = [
    '远程代码执行', '远程命令执行', '代码执行', '命令执行', '命令注入',
    'rce', 'getshell', '反序列化', '任意文件上传', '任意命令执行', '前台代码执行'
  ];
  const highKw = [
    'sql注入', 'sql injection', 'sqli', 'xxe', '外部实体', 'ssrf', '服务端请求伪造',
    '认证绕过', 'auth bypass', '绕过登录', '越权', '未授权访问', 'unauth', '文件上传',
    'upload', '权限提升', '提权'
  ];
  const mediumKw = [
    '信息泄露', '信息泄漏', '敏感信息', '任意文件读取', '文件读取', '路径遍历',
    '目录遍历', '目录穿越', 'lfi', 'traversal', '弱口令', '默认密码', 'leak',
    '下载漏洞', '敏感端点'
  ];
  const lowKw = ['xss', '跨站脚本', 'csrf', '跨站请求', '开放重定向', 'open redirect', 'clickjacking'];

  if (criticalKw.some((k) => text.includes(k))) {
    severity = 'critical';
  } else if (highKw.some((k) => text.includes(k))) {
    severity = 'high';
  } else if (mediumKw.some((k) => text.includes(k))) {
    severity = 'medium';
  } else if (lowKw.some((k) => text.includes(k))) {
    severity = 'low';
  }

  // 2. 智能推断漏洞核心类型 (具体类型优先)
  let vulnType = '综合利用';
  const specificTypes: [string, string[]][] = [
    ['XXE 外部实体注入', ['xxe', 'xml外部实体', '外部实体', 'xml实体']],
    ['SSRF 请求伪造', ['ssrf', '服务端请求伪造', '服务器端请求伪造']],
    ['RCE 远程代码执行', ['远程代码执行', '远程命令执行', '代码执行', '命令执行', 'rce', 'getshell']],
    ['命令注入', ['命令注入', 'command injection', '任意命令执行']],
    ['SSTI 模板注入', ['ssti', '模板注入', '模板执行']],
    ['SQL 注入', ['sql注入', 'sql injection', 'sqli', 'mssql', 'mysql', 'oracle注入', '注入']],
    ['权限绕过', ['权限绕过', '提权访问', '权限提升', '越权']],
    ['反序列化', ['反序列化', 'deserial', 'serializ']],
    ['任意文件上传', ['文件上传', '任意文件上传', 'upload']],
    ['任意文件读取', ['任意文件读取', '文件读取', '路径遍历', '目录遍历', 'lfi', 'traversal', 'file read']],
    ['未授权访问', ['未授权', '未认证', 'unauth', 'unauthorized']],
    ['敏感信息泄露', ['信息泄露', '信息泄漏', '敏感信息', 'leak', '敏感端点']],
    ['认证绕过', ['认证绕过', '绕过登录', 'auth bypass', 'bypass']],
    ['弱口令', ['弱口令', '默认口令', '默认密码', '弱密码']],
    ['XSS 跨站脚本', ['xss', '跨站脚本']],
  ];

  for (const [typ, keywords] of specificTypes) {
    if (keywords.some((k) => text.includes(k))) {
      vulnType = typ;
      break;
    }
  }

  // 3. 智能提炼标签 Tags
  const inferredTags = new Set<string>();
  if (severity === 'critical') inferredTags.add('critical');
  if (severity === 'high') inferredTags.add('high');
  if (text.includes('rce') || text.includes('代码执行') || text.includes('命令执行')) inferredTags.add('rce');
  if (text.includes('sql')) inferredTags.add('sqli');
  if (text.includes('upload') || text.includes('上传')) inferredTags.add('upload');
  if (text.includes('leak') || text.includes('泄露') || text.includes('读取')) inferredTags.add('info-leak');
  if (text.includes('bypass') || text.includes('绕过') || text.includes('未授权')) inferredTags.add('auth-bypass');
  if (text.includes('deserial') || text.includes('反序列化')) inferredTags.add('deserialization');
  if (text.includes('ssrf')) inferredTags.add('ssrf');
  if (text.includes('xxe')) inferredTags.add('xxe');
  if (text.includes('java') || text.includes('spring') || text.includes('log4j') || text.includes('activemq')) inferredTags.add('java');
  if (text.includes('php') || text.includes('thinkphp')) inferredTags.add('php');
  if (text.includes('python') || text.includes('flask') || text.includes('django')) inferredTags.add('python');
  if (text.includes('windows')) inferredTags.add('windows');
  if (text.includes('linux')) inferredTags.add('linux');

  // 4. 智能推断 FOFA 空间网络测绘语法
  let suggestedFofaQuery: string | undefined = undefined;
  const fofaMap: [string[], string][] = [
    [['activemq'], 'app="Apache-ActiveMQ"'],
    [['log4j', 'log4j2'], 'app="Apache-Log4j2"'],
    [['confluence'], 'app="Atlassian-Confluence"'],
    [['jira'], 'app="Atlassian-JIRA"'],
    [['springboot', 'spring boot', 'spring-boot', 'actuator'], 'body="Whitelabel Error Page" || icon_hash="116323821"'],
    [['nacos'], 'app="NACOS"'],
    [['thinkphp'], 'header="ThinkPHP" || body="thinkphp"'],
    [['fastjson'], 'body="fastjson"'],
    [['weblogic'], 'app="BEA-WebLogic-Server"'],
    [['tomcat'], 'app="Apache-Tomcat"'],
    [['struts2', 'struts'], 'body="struts"'],
    [['shiro'], 'header="rememberMe=deleteMe"'],
    [['gitlab'], 'app="GitLab"'],
    [['jenkins'], 'app="Jenkins"'],
    [['solr'], 'app="Apache-Solr"'],
    [['redis'], 'protocol="redis"'],
    [['elasticsearch', 'elastic'], 'app="Elasticsearch"'],
    [['drupal'], 'app="Drupal"'],
    [['wordpress'], 'app="WordPress"'],
    [['致远', 'seeyon'], 'app="致远互联-OA"'],
    [['泛微', 'weaver', 'e-cology', 'e-office'], 'app="泛微-协同办公OA"'],
    [['用友', 'yonyou', 'nc'], 'app="用友-NC-Cloud" || app="用友-UFIDA-NC"'],
    [['蓝凌', 'landray'], 'app="Landray-OA"'],
  ];

  for (const [identifiers, query] of fofaMap) {
    if (identifiers.some((id) => text.includes(id))) {
      suggestedFofaQuery = query;
      break;
    }
  }

  // 兜底提取：如果找不到专属映射，但能提取出组件英文关键词
  if (!suggestedFofaQuery && affectedComponent.trim()) {
    const cleanComp = affectedComponent.split(/[\s<>=,]/)[0].trim();
    if (cleanComp && cleanComp.length > 2) {
      suggestedFofaQuery = `app="${cleanComp}"`;
    }
  }

  return {
    vulnType,
    severity,
    tags: Array.from(inferredTags),
    suggestedFofaQuery,
  };
}
