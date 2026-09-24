import { Tool, ToolEnvironment } from '../../types';

export interface ExecutionResult {
  success: boolean;
  message: string;
  commandExecuted?: string;
  output?: string;
}

export interface PlatformBridge {
  isTauri: () => boolean;
  openExternalUrl: (url: string) => Promise<boolean>;
  executeTool: (tool: Tool, customArgs?: string, env?: ToolEnvironment | null) => Promise<ExecutionResult>;
  openTerminal: (command: string) => Promise<ExecutionResult>;
  selectFile: (filters?: { name: string; extensions: string[] }[]) => Promise<string | null>;
  selectDirectory: () => Promise<string | null>;
  copyToClipboard: (text: string) => Promise<boolean>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  closeWindow: () => Promise<void>;
}

class DesktopPlatformBridge implements PlatformBridge {
  isTauri(): boolean {
    return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
  }

  async openExternalUrl(url: string): Promise<boolean> {
    try {
      if (this.isTauri()) {
        const { openUrl } = await import('@tauri-apps/plugin-opener');
        await openUrl(url);
        return true;
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
        return true;
      }
    } catch (err) {
      console.warn('[PlatformBridge] Failed to open URL:', err);
      window.open(url, '_blank', 'noopener,noreferrer');
      return true;
    }
  }

  async executeTool(tool: Tool, customArgs?: string, env?: ToolEnvironment | null): Promise<ExecutionResult> {
    const finalArgs = customArgs || tool.defaultArgs || '';

    if (tool.type === 'web') {
      await this.openExternalUrl(tool.targetPath);
      return {
        success: true,
        message: `已在默认浏览器中打开安全站点: ${tool.name}`,
        commandExecuted: tool.targetPath,
      };
    }

    if (tool.type === 'cheat_sheet') {
      await this.copyToClipboard(tool.targetPath);
      return {
        success: true,
        message: `备忘指令已复制到剪贴板: ${tool.name}`,
        commandExecuted: tool.targetPath,
      };
    }

    // 根据配置的环境构造包装执行命令与参数
    let binary = tool.targetPath;
    let cmdArgs: string[] = [];
    let fullCommand = '';

    if (env) {
      const extraArgs = env.extraArgs ? env.extraArgs.trim().split(/\s+/).filter(Boolean) : [];
      if (env.type === 'java' || tool.targetPath.toLowerCase().endsWith('.jar')) {
        const javaBin = env.binPath || 'java';
        binary = javaBin;
        cmdArgs = [...extraArgs, '-jar', tool.targetPath, ...(finalArgs ? finalArgs.split(/\s+/).filter(Boolean) : [])];
        fullCommand = `"${binary}" ${extraArgs.join(' ')} -jar "${tool.targetPath}" ${finalArgs}`.trim();
      } else if (env.type === 'python' || tool.targetPath.toLowerCase().endsWith('.py')) {
        const pyBin = env.binPath || 'python';
        binary = pyBin;
        cmdArgs = [...extraArgs, tool.targetPath, ...(finalArgs ? finalArgs.split(/\s+/).filter(Boolean) : [])];
        fullCommand = `"${binary}" ${extraArgs.join(' ')} "${tool.targetPath}" ${finalArgs}`.trim();
      } else if (env.binPath) {
        binary = env.binPath;
        cmdArgs = [...extraArgs, tool.targetPath, ...(finalArgs ? finalArgs.split(/\s+/).filter(Boolean) : [])];
        fullCommand = `"${binary}" ${extraArgs.join(' ')} "${tool.targetPath}" ${finalArgs}`.trim();
      } else {
        cmdArgs = finalArgs ? finalArgs.split(/\s+/).filter(Boolean) : [];
        fullCommand = `${tool.targetPath} ${finalArgs}`.trim();
      }
    } else {
      cmdArgs = finalArgs ? finalArgs.split(/\s+/).filter(Boolean) : [];
      fullCommand = `${tool.targetPath} ${finalArgs}`.trim();
    }

    // 注入环境变量前缀 (如 HTTP_PROXY, JAVA_HOME 等)
    let envPrefix = '';
    if (env?.envVars && Object.keys(env.envVars).length > 0) {
      envPrefix = Object.entries(env.envVars)
        .map(([k, v]) => `set ${k}=${v}`)
        .join(' && ') + ' && ';
    }

    if (this.isTauri()) {
      try {
        const { Command } = await import('@tauri-apps/plugin-shell');
        
        if (tool.openInTerminal || envPrefix) {
          const terminalExecStr = `${envPrefix}${fullCommand}`;
          const terminalCommand = Command.create('cmd', [
            '/c', 'start', 'cmd', '/k',
            terminalExecStr
          ]);
          await terminalCommand.spawn();
        } else {
          const cmd = Command.create(binary, cmdArgs);
          await cmd.spawn();
        }

        const envNotice = env ? ` (已加载环境: ${env.name})` : '';
        return {
          success: true,
          message: `已成功启动本地安全工具: ${tool.name}${envNotice}`,
          commandExecuted: envPrefix + fullCommand,
        };
      } catch (err) {
        console.error('[PlatformBridge] Local execution failed:', err);
        return {
          success: false,
          message: `启动失败: ${err instanceof Error ? err.message : String(err)}`,
          commandExecuted: envPrefix + fullCommand,
        };
      }
    } else {
      console.log(`[PlatformBridge (Web Mock)] Executed: ${envPrefix}${fullCommand}`);
      const envNotice = env ? ` [环境: ${env.name}]` : '';
      return {
        success: true,
        message: `[开发环境模拟调用] ${tool.name}${envNotice}: ${envPrefix}${fullCommand}`,
        commandExecuted: envPrefix + fullCommand,
      };
    }
  }

  async openTerminal(command: string): Promise<ExecutionResult> {
    if (this.isTauri()) {
      try {
        const { Command } = await import('@tauri-apps/plugin-shell');
        const terminalCommand = Command.create('cmd', [
          '/c', 'start', 'cmd', '/k', command
        ]);
        await terminalCommand.spawn();
        return {
          success: true,
          message: `已在独立终端中执行指令`,
          commandExecuted: command,
        };
      } catch (err) {
        console.error('[PlatformBridge] Terminal launch failed:', err);
        return {
          success: false,
          message: `启动终端失败: ${err instanceof Error ? err.message : String(err)}`,
          commandExecuted: command,
        };
      }
    } else {
      console.log(`[PlatformBridge (Web Mock)] Open terminal with command: ${command}`);
      await this.copyToClipboard(command);
      return {
        success: true,
        message: `[Web 预览模式] 指令已复制到剪贴板: ${command}`,
        commandExecuted: command,
      };
    }
  }

  async selectFile(filters?: { name: string; extensions: string[] }[]): Promise<string | null> {
    if (this.isTauri()) {
      try {
        const { open } = await import('@tauri-apps/plugin-dialog');
        const selected = await open({
          multiple: false,
          directory: false,
          filters: filters?.map(f => ({ name: f.name, extensions: f.extensions }))
        });
        return typeof selected === 'string' ? selected : null;
      } catch (err) {
        console.warn('[PlatformBridge] File picker error:', err);
        return null;
      }
    } else {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = () => {
          if (input.files && input.files[0]) {
            resolve(input.files[0].name);
          } else {
            resolve(null);
          }
        };
        input.click();
      });
    }
  }

  async selectDirectory(): Promise<string | null> {
    if (this.isTauri()) {
      try {
        const { open } = await import('@tauri-apps/plugin-dialog');
        const selected = await open({
          directory: true,
          multiple: false
        });
        return typeof selected === 'string' ? selected : null;
      } catch (err) {
        console.warn('[PlatformBridge] Directory picker error:', err);
        return null;
      }
    } else {
      return prompt('Web 预览模式: 请输入目标工作目录路径', 'C:\\Tools\\SecTools');
    }
  }

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      console.warn('[PlatformBridge] Copy failed:', err);
      return false;
    }
  }

  async minimizeWindow(): Promise<void> {
    if (this.isTauri()) {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().minimize();
      } catch (e) {
        console.warn('Minimize error:', e);
      }
    } else {
      console.log('[Window] Minimize requested');
    }
  }

  async maximizeWindow(): Promise<void> {
    if (this.isTauri()) {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().toggleMaximize();
      } catch (e) {
        console.warn('Maximize error:', e);
      }
    } else {
      console.log('[Window] Maximize/Restore requested');
    }
  }

  async closeWindow(): Promise<void> {
    if (this.isTauri()) {
      try {
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        await getCurrentWindow().close();
      } catch (e) {
        console.warn('Close error:', e);
      }
    } else {
      console.log('[Window] Close requested');
    }
  }
}

export const platformBridge = new DesktopPlatformBridge();
