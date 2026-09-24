# CyberNest (赛博巢穴) 🛡️

<div align="center">

**现代化网络安全工具武器库中枢与 POC 知识验证平台**  
*Modern Cyber Security Hub, Runtime Isolated Workbench & POC Validation Platform*

[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Tauri](https://img.shields.io/badge/Tauri-v2.0-FFC131.svg?style=flat-square&logo=tauri)](https://v2.tauri.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](LICENSE)

[功能特性](#-核心功能亮点) • [快速上手](#-快速启动与使用) • [运行环境管理](#-工具多环境隔离管理) • [POC 管理平台](#-poc-验证与知识库平台) • [打包构建](#-桌面端打包指南) • [免责声明](#-免责声明)

</div>

---

## 📖 项目简介

**CyberNest (赛博巢穴)** 是一款专为**白帽子、渗透测试工程师、红蓝对抗队员及安全研究员**打造的高性能本地安全武器库调度中枢与知识验证平台。

在日常渗透测试与攻防演练中，安全工程师经常面临以下痛点：
- 🛠️ **工具繁多分散**：GUI 工具、CLI 脚本、在线平台零散存放在不同目录，寻找和调用成本高；
- ☕ **环境版本冲突**：旧版工具必须依赖 Java 8（如旧版反序列化工具），新版工具需要 Java 17/21（如新版 Burp Suite、Ghidra），全局 PATH 频繁切换极其繁琐；
- 🐍 **Python 版本割裂**：早期 Exploit 需 Python 2.7 运行，现代扫描脚本依赖 Python 3.10+；
- 🌐 **抓包与代理配置繁重**：部分工具需强制挂载 Burp 本地代理（127.0.0.1:8080）或 SOCKS5 代理隧道才能审计流量；
- 📑 **POC 缺乏统一编排**：大量公开 POC 和自写脚本没有集中分类、变量参数替换与快速验证机制。

**CyberNest** 提供了一体化解决方案：结合**现代化暗黑/明亮科技感界面**、**层级战术攻防分类树**、**独立 Web 工具与备忘手册导航**、**POC 批量导入与验证平台**、以及**工具专属运行时环境隔离引擎**，让你的安全武器库井井有条，瞬时响应。

---

## ✨ 核心功能亮点

### 1. 🎯 仪表盘态势感知驾驶舱 (Dashboard)
- **全局数字看板**：集中汇总已接入工具总数、常驻收藏、分类资产占比及执行调用总频次。
- **高频武器与最近动态**：动态追踪最常用工具排行与实时执行流水记录。
- **安全分类全景分布**：直观展示从信息收集、Web渗透、权限提升到逆向工程的资产就绪度。

### 2. 🧰 全能工具库与层级战术分类 (All Tools & Categories)
- **ATT&CK 战术多级分类**：支持「一级战术大类 + 二级细分子类」层级梳理，可自由自定义分类名、图标与高饱和强调色。
- **多维度即时检索**：支持工具名称、功能描述、标签关键字、执行路径及工具类型（GUI/CLI/Web/脚本/手册）毫秒级过滤。
- **双视图切换**：提供信息密度饱满的所见即所得卡片网格与紧凑高密度数据列表视图。
- **原生终端无缝呼出**：本地 EXE / 脚本可配置独立控制台运行（Windows Terminal / PowerShell / CMD / Git Bash）。

### 3. 🧪 POC 资产与漏洞验证管理中心 (POC Manager)
> 借鉴集成开源 POC 平台的精髓，打造本地一站式 POC 武器库。
- **漏洞分级与技术栈分类**：涵盖 Web 漏洞、中间件/框架、服务应用、网络设备、操作系统，支持 Critical / High / Medium / Low 严重程度评级。
- **动态目标参数插值**：内置 `{TARGET}` 智能占位符，输入目标域名/IP 后自动完成命令参数实时替换。
- **双重执行模式**：支持一键拉起独立终端运行 CLI 验证命令，或一键复制标准 HTTP 探测报文 / Exploit 模板至剪贴板。
- **开源 POC 仓库批量合入**：支持选择包含多个 `.py`、`.yaml`、`.json`、`.md` 的公开 POC 仓库目录，系统自动提取标题、推导 CVE 编号并打上指纹标签批量合入。

### 4. 🌐 独立 Web 在线工具与命令备忘手册 (Web Tools & Cheat Sheets)
- **解耦独立展示**：将高频在线渗透平台与速查备忘手册从战术大类中剥离为一级专属导航页面。
- **Web 在线工具导航**：内置/自建在线工具库（CyberChef、DNSDumpster、FOFA、Hunter、VirusTotal 等），卡片直达外链。
- **命令备忘手册 (Cheat Sheets)**：包含反弹 Shell 生成、常用提权命令、内网穿透及排查指令，支持一键替换参数并复制。

### 5. ⚡ 工具专属启动运行环境隔离引擎 (Runtime Environments)
- **解决环境冲突痛点**：可在系统设置中为不同工具分配专属的运行时环境：
  - **Java 运行时隔离**：为不同工具单独绑定 Java 8 或 Java 17/21 LTS 解释器路径与特定 JVM 参数（如 `-Xmx4g -Dfile.encoding=utf-8`），支持自动拼接 `-jar` 启动。
  - **Python 双版本支持**：无缝切换指定 Python 2.7 解释器或 Python 3.x 解释器。
  - **网络透明代理注入**：工具启动时前置注入 `HTTP_PROXY`、`HTTPS_PROXY` 或 `ALL_PROXY`（如透明走本地 127.0.0.1:8080 Burp 监听端口），免去手动配置代理的烦琐操作。
  - **自定义环境变量注入**：支持灵活添加定制环境变量键值对。
- **出厂预设模板**：内置 Java 8、Java 17/21、Python 3、Python 2、Burp 本地代理、SOCKS5 隧道代理等多款常用预设，一键添加。

### 6. 🎨 深度主题适配与视觉风格
- **专业暗黑/明亮工作模式**：专为夜间对抗与日间高采光办公打造，标签与卡片均经过严格的高对比度配色校准。
- **6 套控制台强调色外观**：科技天蓝、矩阵荧绿、极光霓虹紫、警示烈焰金、炽热警报红、量子幽青，支持一键随心换肤。

### 7. 🔒 隐私第一与本地资产持久化
- **100% 离线无外部上报**：所有接入工具配置、自研 POC 模板、执行流水均保存在本地 `localStorage`，绝不上传任何第三方。
- **一键全量备份与迁移**：支持导出全量 JSON 备份配置，并在任何新设备上一键导入恢复。

---

## 🖥️ 快速启动与使用

### 方式一：直接运行独立免安装版（推荐 Windows 用户）

本项目根目录或 Releases 中已预编译生成便携式启动程序：

1. **直接运行 `CyberNest.exe`**：
   - 双击根目录下的 [`CyberNest.exe`](CyberNest.exe) 即可直接启动桌面应用。
   - 原生 Win32 进程拉起独立窗口，无多余黑框命令行弹窗，即开即用。
2. **下载免安装便携压缩包**：
   - 下载 `CyberNest-v1.0.0-windows-x64.zip`，解压至任意目录，双击 `CyberNest.exe` 即可运行（无需安装 Node.js、Rust 或任何编译器环境）。

---

### 方式二：从源码本地开发与调试

#### 前置要求
- [Node.js](https://nodejs.org/) (推荐 18.x 或以上版本)
- [npm](https://www.npmjs.com/) 或 [pnpm](https://pnpm.io/)

#### 1. 克隆代码仓库
```bash
git clone https://github.com/MaHule/CyberNest.git
cd CyberNest
```

#### 2. 安装项目依赖
```bash
npm install
```

#### 3. 启动本地开发服务
```bash
npm run dev
```
打开浏览器访问控制台提示的地址（默认 `http://localhost:1420`）即可开始体验。

---

## 🔨 桌面端打包指南

CyberNest 支持两种打包交付路径：

### 1. 本地极速编译生成 `CyberNest.exe`
基于内置编译管线，利用 Windows 预装的 .NET 编译器在 5 秒内完成生产编译与桌面程序封装：

```bash
# 执行前端生产构建并生成 CyberNest.exe
npm run build:exe

# 构建并打包生成 CyberNest-v1.0.0-windows-x64.zip 便携分发包
npm run package:zip
```

### 2. 构建 Tauri v2 原生客户端 (Rust)
若本地已安装 Rust 工具链与 Visual Studio C++ 构建套件：

```bash
# 启动 Tauri 桌面客户端调试窗口
npm run tauri dev

# 编译生成原生 NSIS 安装包与完整 Release
npm run tauri build
```

> **提示**：仓库在 `scripts/release-workflow.yml` 中提供了完整的 GitHub Actions 持续集成自动化打包工作流文件，可在 GitHub 云端 Windows 镜像上自动编译并发布全平台安装包。

---

## 📂 项目结构概览

```text
CyberNest/
├── CyberNest.exe               # Windows 本地独立原生桌面启动程序
├── launcher/
│   └── Program.cs              # 原生桌面启动器 C# 源代码 (无边框窗口与资产代理)
├── scripts/
│   ├── build-exe.ps1           # 一键编译本地 EXE 辅助脚本
│   └── release-workflow.yml    # GitHub Actions 云端自动打包发布工作流模板
├── src-tauri/                  # Tauri v2 (Rust) 原生层
│   ├── capabilities/           # 桌面系统权限描述 (Shell, FS, Dialog 等)
│   ├── icons/                  # 全套高分辨率桌面应用图标 (.ico, .icns, .png)
│   ├── src/                    # Rust 后端入口 (main.rs, lib.rs)
│   └── tauri.conf.json         # Tauri 核心桌面配置
├── src/                        # 前端应用程序源码
│   ├── components/             # 公共布局与交互组件 (Sidebar, TitleBar, CommandPalette 等)
│   ├── context/                # 全局状态中枢 (AppContext，管理工具、环境、分类、POC、设置)
│   ├── pages/                  # 业务功能主页面
│   │   ├── AllTools/           # 全能工具库网格/列表页面
│   │   ├── Categories/         # 分类与安全标签管理页面
│   │   ├── CheatSheets/        # 命令备忘速查手册页面
│   │   ├── Dashboard/          # 仪表盘态势看板页面
│   │   ├── PocManager/         # POC 验证与模板资产管理平台
│   │   ├── Settings/           # 系统设置与工具运行环境配置管理
│   │   ├── ToolStudio/         # 工具工坊 (登记/编辑工具并绑定运行环境)
│   │   └── WebTools/           # 独立 Web 在线工具导航页面
│   ├── services/               # 基础设施服务
│   │   ├── bridge/             # 宿主平台调用桥接 (命令行动态封装、环境变量注入)
│   │   └── storage/            # 数据存储层 (版本迁移、种子数据、CRUD 接口)
│   ├── types/                  # 完整 TypeScript 类型契约 (Tool, Poc, Environment 等)
│   └── utils/                  # 批量 POC 解析导入与指纹技术栈推导工具
├── package.json
└── README.md
```

---

## 🛠️ 技术选型矩阵

| 技术模块 | 采用方案 | 说明 |
| :--- | :--- | :--- |
| **桌面运行时** | Tauri 2.0 (Rust) + Win32 Launcher | 极低内存占用，告别臃肿的 Chromium 内存包袱 |
| **前端架构** | React 18 + TypeScript 5.7 | 现代化组件化架构与严格类型保障 |
| **构建驱动** | Vite 5.4 | 毫秒级极速热重载 (HMR) 与轻量代码分卷打包 |
| **样式与主题** | Tailwind CSS 3.4 | 精心调优的现代科技感暗黑/明亮工作模式与高对比度组件 |
| **图标矢量库** | Lucide React | 高一致性网络安全与开发常用视觉符号 |
| **本地持久化** | 本地 Web 存储 + 结构化 JSON 导入导出 | 离线自主可控，保护安全工程师私有兵器谱不泄露 |

---

## ⚠️ 免责声明 (Disclaimer)

1. **CyberNest** 仅作为网络安全工程工具整合、日常测试与学习研究的工作台软件。
2. 本项目内置的所有工具条目、POC 模板及推荐脚本仅供安全测试人员在**已获得正式合法授权**的目标网络环境中进行安全评估或演练使用。
3. 请使用者严格遵守《中华人民共和国网络安全法》及所在地相关法律法规。严禁将本软件或其中工具用于任何未经授权的入侵、攻击或破坏行为。因使用者个人行为引发的任何直接或间接法律责任均由使用者自行承担，本项目作者及贡献者概不承担任何责任。

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 许可证开源，欢迎白帽子与开发者共同参与建设与贡献！
