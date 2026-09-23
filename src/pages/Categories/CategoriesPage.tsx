import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Category, Tag } from '../../types';
import {
  FolderTree,
  Tag as TagIcon,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  FolderPlus,
  CornerDownRight,
  AlertTriangle
} from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const {
    categories,
    parentCategories,
    getSubcategories,
    tools,
    tags,
    saveCategory,
    deleteCategory,
    saveTag,
    deleteTag,
    setSelectedCategoryFilter,
    setSelectedTagFilter,
    setActiveTab
  } = useApp();

  // Category Edit / Add state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catColor, setCatColor] = useState('#38bdf8');
  const [catParentId, setCatParentId] = useState<string | null>(null);

  // Deletion confirmation state
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Tag Add state
  const [newTagName, setNewTagName] = useState('');
  const [tagSearch, setTagSearch] = useState('');

  const colorPresets = [
    '#38bdf8', '#10b981', '#f59e0b', '#a855f7',
    '#ef4444', '#06b6d4', '#ec4899', '#64748b'
  ];

  const handleStartAddCategory = (preselectedParentId?: string | null) => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setCatColor(
      preselectedParentId
        ? categories.find((c) => c.id === preselectedParentId)?.color || '#38bdf8'
        : '#38bdf8'
    );
    setCatParentId(preselectedParentId ?? null);
    setIsAddingCategory(true);
  };

  const handleStartEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description || '');
    setCatColor(cat.color || '#38bdf8');
    setCatParentId(cat.parentId || null);
    setIsAddingCategory(true);
  };

  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const isSub = Boolean(catParentId);
    const siblings = isSub
      ? categories.filter((c) => c.parentId === catParentId)
      : parentCategories;

    const payload: Category = {
      id: editingCategory ? editingCategory.id : (isSub ? 'subcat-' : 'cat-') + Date.now().toString(36),
      name: catName.trim(),
      slug: catSlug.trim() || catName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: catDesc.trim(),
      icon: editingCategory ? editingCategory.icon : isSub ? 'CornerDownRight' : 'Folder',
      color: catColor,
      sortOrder: editingCategory ? editingCategory.sortOrder : siblings.length + 1,
      isSystem: editingCategory ? editingCategory.isSystem : false,
      parentId: catParentId || null,
    };

    await saveCategory(payload);
    setIsAddingCategory(false);
    setEditingCategory(null);
  };

  const handleConfirmDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  const handleAddTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const cleanName = newTagName.trim().toLowerCase().replace(/^#/, '');
    if (tags.some((t) => t.name.toLowerCase() === cleanName)) {
      setNewTagName('');
      return;
    }

    await saveTag({
      id: 'tag-' + Date.now().toString(36),
      name: cleanName,
      color: '#38bdf8',
    });
    setNewTagName('');
  };

  const filteredTags = tags.filter((t) =>
    t.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const totalSubcategoriesCount = categories.filter((c) => Boolean(c.parentId)).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto w-full">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1e293b]">
        <div>
          <h1 className="text-xl font-bold text-[#f1f5f9] flex items-center space-x-2">
            <span>战术分类与标签资产池</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1e293b] text-[#38bdf8] font-mono">
              Taxonomy Studio
            </span>
          </h1>
          <p className="text-xs text-[#94a3b8] mt-1">
            支持二级树状分类体系（一级大类 + 二级子类），构建高维网安工具图谱
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleStartAddCategory(null)}
            className="px-3.5 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建一级主分类</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Categories Hierarchy (7 cols ~ 58%) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
                <FolderTree className="w-4 h-4 text-[#38bdf8]" />
                <span>核心战术分类架构</span>
              </h2>
              <span className="text-xs font-mono text-[#94a3b8]">
                {parentCategories.length} 个一级大类 · {totalSubcategoriesCount} 个二级子类
              </span>
            </div>

            {/* Hierarchical Cards List */}
            <div className="space-y-3 pt-1">
              {parentCategories.map((parent) => {
                const subcategories = getSubcategories(parent.id);
                const subIds = subcategories.map((s) => s.id);
                const parentToolCount = tools.filter(
                  (t) => t.categoryId === parent.id || (t.subcategoryId && subIds.includes(t.subcategoryId))
                ).length;

                return (
                  <div
                    key={parent.id}
                    className="rounded-xl bg-[#0d121f] border border-[#1e293b] hover:border-[#38bdf8]/40 transition-all overflow-hidden"
                  >
                    {/* Parent Header Card */}
                    <div className="p-3.5 flex items-center justify-between bg-[#131b2c]/60 border-b border-[#1e293b]/60">
                      <div className="flex items-center space-x-3 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-md flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: parent.color || '#38bdf8' }}
                        />
                        <div className="truncate">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-[#f1f5f9]">
                              {parent.name}
                            </span>
                            <span className="text-[11px] font-mono text-[#64748b]">
                              /{parent.slug}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#1e293b] text-[#94a3b8]">
                              一级大类
                            </span>
                          </div>
                          {parent.description && (
                            <div className="text-xs text-[#94a3b8] truncate mt-0.5">
                              {parent.description}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Parent Actions */}
                      <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCategoryFilter(parent.id, null);
                            setActiveTab('tools');
                          }}
                          className="text-xs font-mono px-2 py-0.5 rounded bg-[#162032] text-[#38bdf8] hover:bg-[#0284c7] hover:text-white transition-colors"
                          title="查看该大类下全部工具"
                        >
                          共 {parentToolCount} 款
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartAddCategory(parent.id)}
                          className="px-2 py-1 rounded bg-[#1e293b] hover:bg-[#334155] text-white text-xs flex items-center space-x-1 transition-colors"
                          title={`在“${parent.name}”下添加子类`}
                        >
                          <FolderPlus className="w-3 h-3 text-[#38bdf8]" />
                          <span>+ 子类</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStartEditCategory(parent)}
                          className="p-1.5 rounded text-[#94a3b8] hover:text-white hover:bg-[#1e293b] transition-colors"
                          title="编辑分类"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {!parent.isSystem && (
                          <button
                            type="button"
                            onClick={() => setCategoryToDelete(parent)}
                            className="p-1.5 rounded text-[#94a3b8] hover:text-rose-400 hover:bg-[#1e293b] transition-colors"
                            title="删除分类"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Subcategories Branch List */}
                    <div className="p-3 bg-[#0d121f] space-y-1.5">
                      {subcategories.length > 0 ? (
                        subcategories.map((sub) => {
                          const subToolCount = tools.filter(
                            (t) => t.subcategoryId === sub.id || t.categoryId === sub.id
                          ).length;

                          return (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-[#111827] border border-[#1e293b]/80 hover:border-[#38bdf8]/30 transition-all text-xs group"
                            >
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <CornerDownRight className="w-3.5 h-3.5 text-[#64748b] flex-shrink-0" />
                                <span
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: sub.color || parent.color }}
                                />
                                <div className="truncate">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-[#e2e8f0] group-hover:text-[#38bdf8] transition-colors">
                                      {sub.name}
                                    </span>
                                    <span className="text-[10px] font-mono text-[#64748b]">
                                      /{sub.slug}
                                    </span>
                                  </div>
                                  {sub.description && (
                                    <div className="text-[11px] text-[#64748b] truncate mt-0.5">
                                      {sub.description}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedCategoryFilter(parent.id, sub.id);
                                    setActiveTab('tools');
                                  }}
                                  className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#162032] text-[#94a3b8] hover:text-[#38bdf8] hover:bg-[#1e293b] transition-colors"
                                  title="筛选该子类工具"
                                >
                                  {subToolCount} 款
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleStartEditCategory(sub)}
                                  className="p-1 rounded text-[#64748b] hover:text-white hover:bg-[#1e293b]"
                                  title="编辑子类"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setCategoryToDelete(sub)}
                                  className="p-1 rounded text-[#64748b] hover:text-rose-400 hover:bg-[#1e293b]"
                                  title="删除子类"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#111827]/40 border border-dashed border-[#1e293b] text-xs text-[#64748b]">
                          <span>当前大类暂未分子类</span>
                          <button
                            type="button"
                            onClick={() => handleStartAddCategory(parent.id)}
                            className="text-xs text-[#38bdf8] hover:underline flex items-center space-x-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>立即添加子类</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Tags Asset Pool (5 cols ~ 42%) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-xl bg-[#111827] border border-[#1e293b] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[#f1f5f9] flex items-center space-x-2">
                <TagIcon className="w-4 h-4 text-emerald-400" />
                <span>安全标签资产池 ({tags.length})</span>
              </h2>
            </div>

            {/* Quick Add Tag Form */}
            <form onSubmit={handleAddTagSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="创建新标签 (如: red-team, poc)..."
                className="flex-1 bg-[#0d121f] border border-[#1e293b] focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </form>

            {/* Tag Search filter */}
            <div className="relative">
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="过滤现有标签..."
                className="w-full bg-[#0d121f] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#38bdf8]"
              />
            </div>

            {/* Tags Cloud / Grid */}
            <div className="flex flex-wrap gap-2 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredTags.map((tag) => {
                const count = tools.filter((t) => t.tags.includes(tag.name)).length;
                return (
                  <div
                    key={tag.id}
                    className="flex items-center space-x-1.5 pl-2.5 pr-1.5 py-1 rounded-lg bg-[#0d121f] border border-[#1e293b] text-xs hover:border-[#38bdf8]/40 transition-colors group"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTagFilter(tag.name);
                        setActiveTab('tools');
                      }}
                      className="text-[#cbd5e1] hover:text-[#38bdf8] flex items-center space-x-1"
                      title="查看关联工具"
                    >
                      <span className="font-mono">#{tag.name}</span>
                      <span className="text-[10px] font-mono text-[#64748b] bg-[#162032] px-1 rounded">
                        {count}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTag(tag.id)}
                      className="text-[#64748b] hover:text-rose-400 p-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                      title="移除标签"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Taxonomy Tips */}
            <div className="p-3 rounded-lg bg-[#0d121f] border border-[#1e293b] text-[11px] text-[#64748b] space-y-1">
              <div className="flex items-center space-x-1.5 text-[#94a3b8] font-medium">
                <Info className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>层级分类与标签使用建议</span>
              </div>
              <p>
                <strong>一级大类</strong>用于区分安全核心领域（如 Web 安全、逆向工程）；
                <strong>二级子类</strong>细化工具具体作战场景（如抓包代理、PoC框架）；
                <strong>标签</strong>用于交叉组合协议、漏洞特征或行动类型。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form
            onSubmit={handleSaveCategorySubmit}
            className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <h3 className="font-semibold text-sm text-[#f1f5f9]">
                {editingCategory
                  ? `编辑${editingCategory.parentId ? '二级子类' : '一级分类'}`
                  : catParentId
                  ? '创建新二级子分类'
                  : '创建新一级主分类'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="text-[#64748b] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Parent Category Selector */}
              <div>
                <label className="block text-[#94a3b8] mb-1 font-medium">所属层级 / 归属大类 *</label>
                <select
                  value={catParentId || 'root'}
                  onChange={(e) => setCatParentId(e.target.value === 'root' ? null : e.target.value)}
                  disabled={Boolean(editingCategory && !editingCategory.parentId && getSubcategories(editingCategory.id).length > 0)}
                  className="w-full bg-[#0d121f] border border-[#1e293b] rounded-lg px-3 py-2 text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
                >
                  <option value="root">作为顶级一级大类 (主战术域)</option>
                  {parentCategories
                    .filter((p) => !editingCategory || p.id !== editingCategory.id)
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        ↳ 归属于大类: {p.name}
                      </option>
                    ))}
                </select>
                {editingCategory && !editingCategory.parentId && getSubcategories(editingCategory.id).length > 0 && (
                  <p className="text-[10px] text-[#64748b] mt-1">
                    当前分类下已存在子类，不可变更为子分类
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1 font-medium">分类名称 *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder={catParentId ? '例如: 自动化接口挖掘' : '例如: 云原生与容器安全'}
                  className="w-full bg-[#0d121f] border border-[#1e293b] rounded-lg px-3 py-2 text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1 font-medium">URL Slug (英文别名)</label>
                <input
                  type="text"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="例如: api-fuzzing"
                  className="w-full bg-[#0d121f] border border-[#1e293b] rounded-lg px-3 py-2 text-[#f1f5f9] font-mono focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1 font-medium">描述简介</label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="概述该分类涵盖的工具范围与测试场景..."
                  className="w-full bg-[#0d121f] border border-[#1e293b] rounded-lg px-3 py-2 text-[#f1f5f9] focus:outline-none focus:border-[#38bdf8]"
                />
              </div>

              <div>
                <label className="block text-[#94a3b8] mb-1.5 font-medium">分类主题标色</label>
                <div className="flex items-center space-x-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCatColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        catColor === color ? 'scale-110 border-white' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#1e293b]">
              <button
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="px-3 py-1.5 rounded-lg border border-[#1e293b] text-xs text-[#94a3b8] hover:text-white"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-xs text-white font-medium shadow-sm"
              >
                保存生效
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#111827] border border-[#1e293b] rounded-xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center space-x-3 text-amber-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <h3 className="font-semibold text-sm text-[#f1f5f9]">确认移除此分类？</h3>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              确定要删除分类 <strong className="text-white">“{categoryToDelete.name}”</strong> 吗？
              {!categoryToDelete.parentId && getSubcategories(categoryToDelete.id).length > 0 && (
                <span className="block mt-1 text-rose-400">
                  注意：该大类下的 {getSubcategories(categoryToDelete.id).length} 个二级子类也将一并被清理。
                </span>
              )}
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1e293b]">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-3 py-1.5 rounded-lg border border-[#1e293b] text-xs text-[#94a3b8] hover:text-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs text-white font-medium"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
