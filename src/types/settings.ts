export type ThemeMode = 'dark' | 'light' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  accentColor: string;
  autoLaunch: boolean;
  minimizeToTray: boolean;
  closeToTray: boolean;
  defaultTerminal: 'powershell' | 'cmd' | 'wt' | 'bash';
  globalShortcut: string; // e.g. "Alt+Space"
  storageType: 'indexeddb' | 'sqlite';
  offlineMode: boolean;
  developerMode: boolean;
}
