// src\app\admin\blogs\categories\page.tsx

'use client';

import { useEffect, useState } from 'react';
import { AdminBlogsService } from '@/services/admin-blogs.service';
import { Card } from '@/components/admin/ui/Card';
import { Badge } from '@/components/admin/ui/Badge';
import { Switch } from '@/components/admin/ui/Switch';
import { Edit, Trash2, Plus, X } from 'lucide-react';

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await AdminBlogsService.getCategories();
setCategories(res.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: !editingId ? generateSlug(name) : prev.slug // Only auto-generate on create
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', isActive: true });
    setIsModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      isActive: category.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? Deleting a category might orphan its blogs.')) return;
    try {
      await AdminBlogsService.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete. Ensure no blogs are currently using this category.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await AdminBlogsService.updateCategory(editingId, formData);
      } else {
        await AdminBlogsService.createCategory(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage dynamic categories for your journal.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading categories...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                  <th className="p-4 font-medium">Name & Slug</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{cat.name}</div>
                      <div className="text-xs text-gray-500">/{cat.slug}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 max-w-xs truncate">
                      {cat.description || <span className="text-gray-400 italic">No description</span>}
                    </td>
                    <td className="p-4">
                      <Badge variant={cat.isActive ? 'success' : 'error'}>
                        {cat.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEditModal(cat)} className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No categories found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Tailwind Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. Skincare"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  required
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-t mt-4">
                <span className="text-sm font-medium text-gray-700">Active Status</span>
                <Switch 
                  checked={formData.isActive}
                  onChange={(checked) => setFormData({...formData, isActive: checked})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}