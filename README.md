# CyberNest (赛博巢穴) 🛡️

现代化网络安全工具导航与管理桌面客户端 | Modern Cyber Security Toolset & Navigation Platform

基于 **Tauri v2 + React 18 + TypeScript + Tailwind CSS** 构建的现代化、高性能安全工具箱。为安全工程师、白帽子、渗透测试从业者提供高效的工具集中管理、快速检索与一键启动工作台。

---

## ✨ 核心特性

- 🎯 **仪表盘大屏 (Dashboard)**：集中展示工具统计、分类占比、高频使用排行及最近使用动态。
- 🔍 **全能工具库 (All Tools)**：
  - 支持多维度搜索与即时筛选（按分类、标签、平台、支持协议）。
  - 支持网格/列表双视图切换，支持收藏、置顶与快速启动。
- 📁 **多级分类系统 (Categories)**：结构化梳理渗透测试全流程工具（信息收集、Web安全、漏洞利用、内网渗透、密码破解、逆向工程等）。
- 🛠️ **工具工作台 (Tool Studio)**：
  - 轻松添加与编辑自定义工具。
  - 支持本地程序路径绑定、一键启动、Web 链接直达、参数模板与使用文档记录。
- ⌨️ **命令面板 (Command Palette)**：全局快捷键快速唤起，毫秒级定位目标工具。
- ⚙️ **灵活配置与备份 (Settings)**：支持数据本地持久化存储、配置备份与 JSON 导入/导出。
- 🚀 **轻量与安全 (Tauri v2)**：基于 Rust 底层驱动，原生系统资源占用低，兼顾安全与速度。

---

## 🛠️ 技术栈

- **框架内核**: [Tauri v2](https://v2.tauri.app/) (Rust)
- **前端视图**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **构建工具**: [Vite 5](https://vitejs.dev/)
- **样式方案**: [Tailwind CSS](https://tailwindcss.com/)
- **图标系统**: [Lucide React](https://lucide.dev/)

---

## 📦 项目结构

```text
CyberNest/
├── src/                    # 前端源码
│   ├── components/         # 公共组件、布局与弹窗 (Header, Sidebar, CommandPalette等)
│   ├── context/            # 全局状态管理 (AppContext)
│   ├── pages/              # 各功能页面 (Dashboard, AllTools, Categories, ToolStudio, Settings)
│   ├── services/           # 平台桥接 (platformBridge) 与存储层 (localStorageAdapter, seedData)
│   └── types/              # TypeScript 类型定义
├── src-tauri/              # Tauri (Rust) 后端源码与系统配置
├── prototypes/             # 原型设计与 SVG 示意图
├── public/                 # 静态资源
├── package.json
└── README.md
```

---

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) (建议 18.x 或以上)
- [Rust & Cargo](https://www.rust-lang.org/) (用于 Tauri 桌面编译)
- C++ 构建工具 (Windows 需安装 Visual Studio C++ build tools)

### 1. 克隆项目

```bash
git clone https://github.com/<your-username>/CyberNest.git
cd CyberNest
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地开发

启动 Web 端预览：
```bash
npm run dev
```

启动 Tauri 桌面应用窗口进行调试：
```bash
npm run tauri dev
```

### 4. 生产打包

打包前端静态产物：
```bash
npm run build
```

打包可执行安装包 (Windows `.msi` / `.exe`)：
```bash
npm run tauri build
```

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 协议开源。
