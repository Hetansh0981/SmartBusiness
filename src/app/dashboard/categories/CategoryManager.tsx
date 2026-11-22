'use client';

import React, { useState, useTransition } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from './actions';
import { Button, Input, Card, CardContent, Badge, Modal, EmptyState } from '@/components/ui';
import type { Category } from '@/types';
import { Plus, Edit3, Trash2, Layers, AlertCircle } from 'lucide-react';

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const { t } = useLanguage();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const [categoryName, setCategoryName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  // Handle Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const formData = new FormData();
    formData.append('name', categoryName);

    startTransition(async () => {
      const res = await createCategoryAction(null, formData);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setCategoryName('');
        setIsCreateOpen(false);
      }
    });
  };

  // Handle Update
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setErrorMessage('');
    const formData = new FormData();
    formData.append('id', editingCategory.id);
    formData.append('name', editingCategory.name);

    startTransition(async () => {
      const res = await updateCategoryAction(null, formData);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setEditingCategory(null);
      }
    });
  };

  // Handle Delete
  const handleDelete = () => {
    if (!deletingCategory) return;
    setErrorMessage('');

    startTransition(async () => {
      const res = await deleteCategoryAction(deletingCategory.id);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setDeletingCategory(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#111827] tracking-tight">
              {t('categories.title')}
            </h1>
            <Badge variant="brand">{categories.length} Groups</Badge>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-[#4b5563]">
            {t('categories.subtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setCategoryName('');
            setErrorMessage('');
            setIsCreateOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>{t('categories.add_button')}</span>
        </Button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <EmptyState
          title={t('categories.empty_title')}
          description={t('categories.empty_desc')}
          icon={<Layers className="w-6 h-6 text-[#ea580c]" />}
          action={
            <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> {t('categories.add_button')}
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="hover:border-orange-300 transition-colors"
            >
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono-numbers text-[11px] text-[#6b7280]">/{cat.slug}</span>
                    <Badge variant="neutral" size="sm">
                      {cat.product_count ?? 0} {(cat.product_count ?? 0) === 1 ? 'item' : 'items'}
                    </Badge>
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-[#111827] group-hover:text-[#ea580c] transition-colors">
                    {cat.name}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1f3f5] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setEditingCategory(cat);
                    }}
                    className="text-xs font-medium text-[#4b5563] hover:text-[#111827] transition flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#ea580c]" />
                    <span>Rename</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage('');
                      setDeletingCategory(cat);
                    }}
                    className="text-xs font-medium text-[#6b7280] hover:text-[#dc2626] transition flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal: Create Category */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => !isPending && setIsCreateOpen(false)}
        title="Add New Category"
        description="Categories group related items in your public storefront."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsCreateOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              isLoading={isPending}
            >
              Save Category
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Category Name"
            placeholder="e.g. Traditional Sweets, Roasted Dry Fruits"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            autoFocus
            error={errorMessage}
            helperText="Short and descriptive for quick mobile navigation."
          />
        </form>
      </Modal>

      {/* Modal: Rename Category */}
      <Modal
        isOpen={!!editingCategory}
        onClose={() => !isPending && setEditingCategory(null)}
        title="Rename Category"
        description="Update the name of this category across your storefront."
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setEditingCategory(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdate}
              isLoading={isPending}
            >
              Save Changes
            </Button>
          </>
        }
      >
        {editingCategory && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              label="Category Name"
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
              required
              autoFocus
              error={errorMessage}
            />
          </form>
        )}
      </Modal>

      {/* Modal: Delete Category Confirmation */}
      <Modal
        isOpen={!!deletingCategory}
        onClose={() => !isPending && setDeletingCategory(null)}
        title="Delete Category?"
        description={
          (deletingCategory?.product_count ?? 0) > 0
            ? `This category contains ${deletingCategory?.product_count} products. Deleting it will NOT delete your products—they will safely become "Uncategorized".`
            : 'Are you sure you want to remove this category? This action cannot be undone.'
        }
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setDeletingCategory(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isPending}
            >
              Yes, Delete Category
            </Button>
          </>
        }
      >
        {errorMessage && (
          <div className="p-3 rounded bg-[#fef2f2] text-[#dc2626] text-xs font-medium border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </Modal>
    </div>
  );
}
