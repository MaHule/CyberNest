import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DesktopLayout } from './components/layout/DesktopLayout';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { AllToolsPage } from './pages/AllTools/AllToolsPage';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { ToolStudioPage } from './pages/ToolStudio/ToolStudioPage';
import { WebToolsPage } from './pages/WebTools/WebToolsPage';
import { CheatSheetsPage } from './pages/CheatSheets/CheatSheetsPage';
import { PocManagerPage } from './pages/PocManager/PocManagerPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

const MainViewRouter: React.FC = () => {
  const { activeTab, isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#0b0f19]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#94a3b8] font-mono">加载 CyberNest 引擎与本地数据中...</span>
        </div>
      </div>
    );
  }

  switch (activeTab) {
    case 'dashboard':
      return <DashboardPage />;
    case 'tools':
      return <AllToolsPage />;
    case 'web-tools':
      return <WebToolsPage />;
    case 'cheat-sheets':
      return <CheatSheetsPage />;
    case 'poc-manager':
      return <PocManagerPage />;
    case 'categories':
      return <CategoriesPage />;
    case 'tool-studio':
      return <ToolStudioPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
};

export function App() {
  return (
    <AppProvider>
      <DesktopLayout>
        <MainViewRouter />
      </DesktopLayout>
    </AppProvider>
  );
}

export default App;
