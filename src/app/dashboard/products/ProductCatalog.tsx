'use client';

import React, { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { toggleStockAction, deleteProductAction } from './actions';
import { Button, Input, Select, Switch, Badge, Modal, EmptyState, Card } from '@/components/ui';
import { formatINR } from '@/lib/utils';
import ProductFormModal from './ProductFormModal';
import type { Product, Category } from '@/types';
import {
  Plus,
  Search,
  Layers,
  Edit3,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  LayoutGrid,
  List,
} from 'lucide-react';

export default function ProductCatalog({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  // Synchronize state when initialProducts update from server actions
  React.useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Compute catalog stats
  const totalItems = products.length;
  const inStockItems = products.filter((p) => p.in_stock).length;
  const outOfStockItems = totalItems - inStockItems;

  // Client Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'uncategorized' && !p.category_id) ||
        p.category_id === selectedCategory;

      const matchesStock =
        selectedStock === 'all' ||
        (selectedStock === 'in_stock' && p.in_stock) ||
        (selectedStock === 'out_of_stock' && !p.in_stock);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, selectedStock]);

  // 1-Click Stock Toggle with Optimistic Feedback
  const handleToggleStock = (product: Product) => {
    const nextState = !product.in_stock;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((item) => (item.id === product.id ? { ...item, in_stock: nextState } : item))
    );

    startTransition(async () => {
      const res = await toggleStockAction(product.id, nextState);
      if (res?.error) {
        // Revert on error
        setProducts((prev) =>
          prev.map((item) => (item.id === product.id ? { ...item, in_stock: !nextState } : item))
        );
        setErrorMessage(res.error);
      }
    });
  };

  // Handle Delete
  const handleDelete = () => {
    if (!deletingProduct) return;

    const productId = deletingProduct.id;
    setDeletingProduct(null);

    // Optimistic remove
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    startTransition(async () => {
      const res = await deleteProductAction(productId);
      if (res?.error) {
        setErrorMessage(res.error);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#111827] tracking-tight">
              {t('products.title')}
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#f0f3ff] text-[#ea580c] border border-[#dce2f3]">
              {products.length} Items Listed
            </span>
          </div>
          <p className="mt-0.5 text-xs sm:text-sm text-[#4b5563]">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard/categories">
            <Button variant="secondary" size="md">
              <Layers className="w-4 h-4 mr-1 text-[#6b7280]" />
              <span>Categories ({categories.length})</span>
            </Button>
          </Link>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            <span>{t('products.add_button')}</span>
          </Button>
        </div>
      </div>

      {/* Top Bento Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs">
          <div className="text-xs font-medium text-[#6b7280] mb-0.5">
            Total Catalog
          </div>
          <div className="text-2xl font-semibold text-[#111827] font-mono-numbers">{totalItems}</div>
          <div className="text-[11px] text-[#9ca3af] mt-0.5">Across all categories</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs">
          <div className="text-xs font-medium text-[#059669] mb-0.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            In Stock
          </div>
          <div className="text-2xl font-semibold text-[#059669] font-mono-numbers">{inStockItems}</div>
          <div className="text-[11px] text-[#9ca3af] mt-0.5">Ready for ordering</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs">
          <div className="text-xs font-medium text-[#d97706] mb-0.5">
            Out of Stock
          </div>
          <div className="text-2xl font-semibold text-[#d97706] font-mono-numbers">{outOfStockItems}</div>
          <div className="text-[11px] text-[#9ca3af] mt-0.5">Marked unavailable</div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs">
          <div className="text-xs font-medium text-[#ea580c] mb-0.5">
            Categories
          </div>
          <div className="text-2xl font-semibold text-[#ea580c] font-mono-numbers">{categories.length}</div>
          <div className="text-[11px] text-[#9ca3af] mt-0.5">Active sections</div>
        </div>
      </div>

      {/* Category Pills Strip for 1-Click Fast Filtering */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#ea580c] text-white shadow-xs font-semibold'
                : 'bg-white text-[#4b5563] border border-[#e5e7eb] hover:bg-[#f9fafb]'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter((p) => p.category_id === c.id).length;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#ea580c] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#4b5563] border border-[#e5e7eb] hover:bg-[#f9fafb]'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono-numbers ${isSelected ? 'bg-black/20' : 'bg-[#f3f4f6]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Search & View Controls Bar */}
      <div className="p-3 bg-white rounded-lg border border-[#e5e7eb] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="w-full md:flex-1 relative">
          <Input
            placeholder={t('products.search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftAddon={<Search className="w-3.5 h-3.5 text-[#9ca3af]" />}
          />
        </div>

        {/* Stock Filter */}
        <div className="w-full md:w-44">
          <Select
            value={selectedStock}
            onChange={(e) => setSelectedStock(e.target.value)}
          >
            <option value="all">{t('common.all')}</option>
            <option value="in_stock">{t('products.filter_stock')}</option>
            <option value="out_of_stock">{t('products.out_of_stock')}</option>
          </Select>
        </div>

        {/* View Mode Toggle (Grid vs Table) */}
        <div className="flex items-center p-0.5 rounded bg-[#f3f4f6] border border-[#e5e7eb] shrink-0">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition cursor-pointer ${
              viewMode === 'grid' ? 'bg-white text-[#ea580c] shadow-xs' : 'text-[#6b7280] hover:text-[#111827]'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded transition cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-[#ea580c] shadow-xs' : 'text-[#6b7280] hover:text-[#111827]'
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded bg-[#fef2f2] border border-rose-200 text-[#dc2626] text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-[#dc2626] hover:text-black cursor-pointer text-base"
          >
            &times;
          </button>
        </div>
      )}

      {/* Product Content (Grid / Table / Empty States) */}
      {products.length === 0 ? (
        <EmptyState
          title="No products in your catalog yet"
          description="Start building your digital catalog by adding your first product with photos, prices, and stock status."
          icon={<ImageIcon className="w-6 h-6 text-[#ea580c]" />}
          action={
            <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Add First Product
            </Button>
          }
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No products match your filters"
          description={`No items match "${searchQuery}" or the selected filters.`}
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStock('all');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const categoryName = categories.find((c) => c.id === p.category_id)?.name;
            const discountPercent =
              p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : null;

            return (
              <div
                key={p.id}
                className="group rounded-lg bg-white border border-[#e5e7eb] hover:border-orange-300 shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Photo Container */}
                  <div className="relative h-44 w-full bg-[#f9fafb] overflow-hidden border-b border-[#f1f3f5]">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#9ca3af]">
                        <ImageIcon className="w-8 h-8 mb-1 opacity-50" />
                        <span className="text-[11px] font-medium">No Photo</span>
                      </div>
                    )}

                    {/* Stock Pill Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      {p.in_stock ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#ecfdf5] text-[#059669] border border-emerald-200 shadow-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb]">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Discount Badge */}
                    {discountPercent && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ea580c] text-white shadow-xs">
                          {discountPercent}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4">
                    <div className="mb-1.5">
                      <span className="inline-block text-[10px] font-medium uppercase tracking-wider text-[#ea580c] bg-[#fff7ed] px-2 py-0.5 rounded border border-orange-200">
                        {categoryName || 'Uncategorized'}
                      </span>
                    </div>

                    <h3 className="text-sm font-semibold text-[#111827] group-hover:text-[#ea580c] transition-colors line-clamp-1">
                      {p.name}
                    </h3>

                    {p.description && (
                      <p className="mt-1 text-xs text-[#6b7280] line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    )}

                    {/* Price Block */}
                    <div className="mt-3 flex items-baseline gap-2 font-mono-numbers">
                      <span className="text-lg font-semibold text-[#111827]">
                        {formatINR(p.price)}
                      </span>
                      {p.mrp && (
                        <span className="text-xs text-[#9ca3af] line-through">
                          {formatINR(p.mrp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Controls: 1-Click Stock Toggle + Edit/Delete */}
                <div className="px-4 py-2.5 border-t border-[#f1f3f5] bg-[#f9fafb] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={p.in_stock}
                      onChange={() => handleToggleStock(p)}
                      disabled={isPending}
                      aria-label="Stock status"
                    />
                    <span className="text-xs text-[#6b7280]">
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(p)}
                      className="p-1.5 rounded text-[#6b7280] hover:text-[#111827] hover:bg-white transition cursor-pointer"
                      title="Edit product"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(p)}
                      className="p-1.5 rounded text-[#6b7280] hover:text-[#dc2626] hover:bg-[#fef2f2] transition cursor-pointer"
                      title="Delete product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="rounded-lg bg-white border border-[#e5e7eb] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f9fafb] border-b border-[#e5e7eb] text-[#4b5563] uppercase tracking-wider font-medium">
                <tr>
                  <th className="py-2.5 px-4">Item</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Selling Price</th>
                  <th className="py-2.5 px-4">Stock Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f3f5]">
                {filteredProducts.map((p) => {
                  const categoryName = categories.find((c) => c.id === p.category_id)?.name;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#f9fafb] transition-colors group"
                    >
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-[#f9fafb] border border-[#e5e7eb] overflow-hidden shrink-0 flex items-center justify-center text-[#9ca3af]">
                            {p.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[#111827] group-hover:text-[#ea580c] transition-colors">
                              {p.name}
                            </div>
                            {p.description && (
                              <div className="text-[11px] text-[#6b7280] line-clamp-1 max-w-xs">
                                {p.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 px-4 text-[#4b5563]">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#f3f4f6] border border-[#e5e7eb]">
                          {categoryName || 'Uncategorized'}
                        </span>
                      </td>

                      <td className="py-2.5 px-4 font-mono-numbers">
                        <div className="font-semibold text-[#111827] text-xs">{formatINR(p.price)}</div>
                        {p.mrp && (
                          <div className="text-[10px] text-[#9ca3af] line-through">
                            {formatINR(p.mrp)}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={p.in_stock}
                            onChange={() => handleToggleStock(p)}
                            disabled={isPending}
                          />
                          <span className={`text-[11px] font-medium ${p.in_stock ? 'text-[#059669]' : 'text-[#6b7280]'}`}>
                            {p.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(p)}
                            className="p-1 rounded text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProduct(p)}
                            className="p-1 rounded text-[#6b7280] hover:text-[#dc2626] hover:bg-[#fef2f2] transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Form Modal (Add / Edit) */}
      <ProductFormModal
        isOpen={isCreateOpen || editingProduct !== null}
        onClose={() => {
          setIsCreateOpen(false);
          setEditingProduct(null);
        }}
        categories={categories}
        product={editingProduct}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        title="Delete Product?"
        description="Are you sure you want to permanently delete this product? This action cannot be undone."
      >
        <div className="space-y-4 pt-1">
          {deletingProduct && (
            <div className="p-3 rounded bg-[#fef2f2] border border-rose-200 text-xs text-[#dc2626]">
              You are about to delete <strong className="text-[#111827]">&ldquo;{deletingProduct.name}&rdquo;</strong>.
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => setDeletingProduct(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isPending}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
