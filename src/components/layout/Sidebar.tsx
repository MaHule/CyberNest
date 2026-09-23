import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  PlusCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Folder,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isSidebarCollapsed,
    toggleSidebar,
    tools,
    parentCategories,
    getSubcategories,
    startAddTool,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
  } = useApp();

  const totalCount = tools.length;
  const favCount = tools.filter((t) => t.isFavorite).length;

  const navItems: {
    id: NavigationTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
    highlight?: boolean;
  }[] = [
    { id: 'dashboard', label: '控制台首页', icon: LayoutDashboard, badge: favCount },
    { id: 'tools', label: '全部安全工具', icon: Layers, badge: totalCount },
    { id: 'categories', label: '分类与标签', icon: FolderTree, badge: parentCategories.length },
    { id: 'tool-studio', label: '添加 / 编辑工具', icon: PlusCircle, highlight: true },
  ];

  const handleParentCategoryClick = (catId: string) => {
    setSelectedCategoryFilter(catId, null);
    setActiveTab('tools');
  };

  return (
    <aside
      className={`${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } bg-[#0d121f] border-r border-[#1e293b] flex flex-col justify-between flex-shrink-0 transition-all duration-200 z-40 select-none h-full`}
    >
      {/* Top & Middle: Nav Links + Parent Categories Only (Fills full height) */}
      <div className="p-3 flex-1 flex flex-col min-h-0 overflow-hidden space-y-4">
        {/* Quick Add CTA */}
        <button
          type="button"
          onClick={() => startAddTool()}
          className={`flex-shrink-0 w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-xs transition-all shadow-sm ${
            isSidebarCollapsed
              ? 'bg-[#0284c7] text-white hover:bg-[#0369a1]'
              : 'bg-gradient-to-r from-[#0284c7] to-[#0ea5e9] text-white hover:opacity-95 shadow-cyan-950/40'
          }`}
          title="登记新安全工具"
        >
          <PlusCircle className="w-4 h-4 flex-shrink-0" />
          {!isSidebarCollapsed && <span>新建工具条目</span>}
        </button>

        {/* Main Navigation */}
        <nav className="flex-shrink-0 space-y-1">
          <div
            className={`text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2 px-2.5 ${
              isSidebarCollapsed ? 'text-center' : ''
            }`}
          >
            {isSidebarCollapsed ? '•' : '导航'}
          </div>

          {navItems.map((item) => {
            const isActive =
              item.id === 'tools'
                ? activeTab === 'tools' && selectedCategoryFilter === 'all'
                : activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'tool-studio') {
                    startAddTool();
                  } else if (item.id === 'tools') {
                    setSelectedCategoryFilter('all', null);
                    setActiveTab('tools');
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-[#162032] text-[#38bdf8] border-l-2 border-[#38bdf8] shadow-sm'
                    : 'text-[#94a3b8] hover:bg-[#111827] hover:text-[#f1f5f9]'
                }`}
                title={item.label}
              >
                <div className="flex items-center space-x-3 truncate">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#38bdf8]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
                    }`}
                  />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isSidebarCollapsed && item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      isActive ? 'bg-[#0284c7]/30 text-[#38bdf8]' : 'bg-[#1e293b] text-[#94a3b8]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Categories: 左侧仅展示大类，子类移至右侧操作 */}
        {!isSidebarCollapsed && (
          <div className="flex-1 min-h-0 flex flex-col pt-3 border-t border-[#1e293b]">
            <div className="flex-shrink-0 text-xs font-semibold uppercase tracking-wider px-2.5 mb-2 flex items-center justify-between">
              <span className="tracking-wide text-[#94a3b8] font-medium">战术大类</span>
              <span className="text-xs text-[#64748b] font-mono">{parentCategories.length} 个</span>
            </div>

            {/* 大类列表 (单层，无折叠展开干扰) */}
            <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-thin space-y-1">
              {parentCategories.map((parent) => {
                const subcategories = getSubcategories(parent.id);
                const subIds = subcategories.map((s) => s.id);
                const parentToolCount = tools.filter(
                  (t) =>
                    t.categoryId === parent.id ||
                    (t.subcategoryId && subIds.includes(t.subcategoryId))
                ).length;

                const isParentActive =
                  activeTab === 'tools' && selectedCategoryFilter === parent.id;

                return (
                  <button
                    key={parent.id}
                    type="button"
                    onClick={() => handleParentCategoryClick(parent.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2.5 rounded-lg text-sm transition-all group ${
                      isParentActive
                        ? 'bg-[#162032] text-[#38bdf8] font-medium border-l-2 border-[#38bdf8] shadow-sm'
                        : 'text-[#cbd5e1] hover:bg-[#111827] hover:text-[#f1f5f9]'
                    }`}
                    title={parent.name}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-sm transition-transform group-hover:scale-125"
                        style={{ backgroundColor: parent.color || '#38bdf8' }}
                      />
                      <span className="truncate">{parent.name}</span>
                    </div>

                    <span
                      className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                        isParentActive
                          ? 'bg-[#0284c7]/25 text-[#38bdf8] font-bold'
                          : 'text-[#64748b] bg-[#1e293b]/60 group-hover:text-[#94a3b8]'
                      }`}
                    >
                      {parentToolCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Settings (Above Engine Ready) + Collapse button & System Info (Fixed at bottom) */}
      <div className="flex-shrink-0 p-2.5 border-t border-[#1e293b] bg-[#0b0f19]/40 space-y-2">
        {/* 系统设置：左下角，引擎就绪的上面 */}
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center ${
            isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-2.5'
          } py-2.5 rounded-lg text-sm font-medium transition-all group ${
            activeTab === 'settings'
              ? 'bg-[#162032] text-[#38bdf8] border-l-2 border-[#38bdf8] shadow-sm'
              : 'text-[#94a3b8] hover:bg-[#111827] hover:text-[#f1f5f9]'
          }`}
          title="系统设置 (外观偏好 / 备份导出与导入)"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <Settings
              className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:rotate-45 ${
                activeTab === 'settings' ? 'text-[#38bdf8]' : 'text-[#64748b] group-hover:text-[#94a3b8]'
              }`}
            />
            {!isSidebarCollapsed && <span className="truncate">系统设置</span>}
          </div>
          {!isSidebarCollapsed && (
            <span className="text-[10px] text-[#64748b] group-hover:text-[#94a3b8] font-mono px-1.5 py-0.5 rounded bg-[#1e293b]">
              偏好
            </span>
          )}
        </button>

        {/* 引擎就绪 & 折叠控制 */}
        {!isSidebarCollapsed ? (
          <div className="flex items-center justify-between text-xs text-[#64748b] pt-2 border-t border-[#1e293b]/70">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>引擎就绪 (v1.0)</span>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1 rounded hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors"
              title="折叠边栏"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggleSidebar}
            className="w-full py-1.5 flex items-center justify-center rounded hover:bg-[#1e293b] text-[#94a3b8] hover:text-white transition-colors pt-1.5 border-t border-[#1e293b]/70"
            title="展开边栏"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
