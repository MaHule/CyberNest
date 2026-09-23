import React from 'react';
import { TitleBar } from './TitleBar';
import { Sidebar } from './Sidebar';
import { StatusBar } from './StatusBar';
import { CommandPalette } from '../modals/CommandPalette';
import { ToastContainer } from '../common/ToastContainer';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0b0f19] text-[#f1f5f9]">
      {/* 1. Desktop Window Titlebar (40px) */}
      <TitleBar />

      {/* 2. Middle Body: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 bg-[#0b0f19] overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 3. Bottom Status Bar (28px) */}
      <StatusBar />

      {/* 4. Global Modals & Notifications */}
      <CommandPalette />
      <ToastContainer />
    </div>
  );
};
