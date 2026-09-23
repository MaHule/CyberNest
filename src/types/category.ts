export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  isSystem?: boolean;
  parentId?: string | null; // null or undefined means top-level category; string means subcategory of parentId
}
