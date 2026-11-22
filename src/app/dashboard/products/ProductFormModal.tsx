'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { createProductAction, updateProductAction } from './actions';
import { Button, Input, Select, Switch, Modal } from '@/components/ui';
import type { Product, Category } from '@/types';
import { Upload, AlertCircle, Sparkles } from 'lucide-react';

export interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  categories: Category[];
}

export default function ProductFormModal({
  isOpen,
  onClose,
  product,
  categories,
}: ProductFormModalProps) {
  const isEditing = !!product;

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [description, setDescription] = useState('');
  const [inStock, setInStock] = useState(true);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  // Reset or populate form when modal opens
  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.category_id || '');
      setPrice(product.price.toString());
      setMrp(product.mrp ? product.mrp.toString() : '');
      setDescription(product.description || '');
      setInStock(product.in_stock);
      setPreviewUrl(product.image_url);
    } else {
      setName('');
      setCategoryId('');
      setPrice('');
      setMrp('');
      setDescription('');
      setInStock(true);
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setErrorMessage('');
  }, [product, isOpen]);

  // Handle Image Selection with Client Validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrorMessage('Invalid file type. Only JPEG, PNG, and WEBP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 5MB limit.');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const discountPercent =
    mrp && price && Number(mrp) > Number(price)
      ? Math.round(((Number(mrp) - Number(price)) / Number(mrp)) * 100)
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Product title is required.');
      return;
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setErrorMessage('Selling price must be a valid non-negative number.');
      return;
    }

    const formData = new FormData();
    if (isEditing && product) {
      formData.append('id', product.id);
    }
    formData.append('name', name);
    formData.append('category_id', categoryId);
    formData.append('price', price);
    formData.append('mrp', mrp);
    formData.append('description', description);
    formData.append('in_stock', inStock ? 'true' : 'false');

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    startTransition(async () => {
      const res = isEditing
        ? await updateProductAction(null, formData)
        : await createProductAction(null, formData);

      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        onClose();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !isPending && onClose()}
      title={isEditing ? 'Edit Product' : 'Add New Product'}
      description={
        isEditing
          ? 'Update product details, pricing, stock, and photo.'
          : 'Add an item to your online catalog with photos and Indian Rupee pricing.'
      }
      maxWidth="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isPending}>
            {isEditing ? 'Save Changes' : 'Create Product'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded bg-[#fef2f2] border border-rose-200 text-[#dc2626] text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Product Photo Upload with Live Preview */}
        <div>
          <label className="block text-xs font-medium text-[#4b5563] mb-1.5">
            Product Photo
          </label>
          <div className="flex items-center gap-3">
            <div className="relative w-20 h-20 rounded border border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-[#9ca3af] p-2">
                  <Upload className="w-5 h-5 mx-auto mb-0.5 opacity-60" />
                  <span className="text-[10px]">No Photo</span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="product-photo-upload"
                className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 border border-[#e5e7eb] bg-white hover:bg-[#f9fafb] rounded text-xs font-medium text-[#111827] shadow-xs transition"
              >
                <Upload className="w-3.5 h-3.5 mr-1 text-[#ea580c]" />
                <span>{previewUrl ? 'Replace Photo' : 'Upload Image'}</span>
                <input
                  id="product-photo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <p className="mt-1 text-[11px] text-[#6b7280]">
                JPG, PNG, or WEBP up to 5 MB. Photos are hosted on Supabase Storage.
              </p>
            </div>
          </div>
        </div>

        {/* Product Name */}
        <Input
          label="Product Title"
          placeholder="e.g. Kaju Katli (Pure Desi Ghee) 500g"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Category Dropdown */}
        <Select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">(Uncategorized)</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Selling Price (₹)"
            type="number"
            min="0"
            step="1"
            placeholder="450"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            leftAddon="₹"
            helperText="Customer checkout price."
          />

          <div>
            <Input
              label="Original MRP (₹) (Optional)"
              type="number"
              min="0"
              step="1"
              placeholder="500"
              value={mrp}
              onChange={(e) => setMrp(e.target.value)}
              leftAddon="₹"
              helperText={
                discountPercent ? (
                  <span className="text-[#059669] font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#ea580c]" />
                    Shows {discountPercent}% OFF badge
                  </span>
                ) : (
                  'Shown with a strikethrough.'
                )
              }
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[#4b5563] mb-1">
            Product Description (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Tell customers about ingredients, freshness, or sizing..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded border border-[#e5e7eb] bg-white px-2.5 py-1.5 text-xs sm:text-sm text-[#111827] placeholder:text-[#9ca3af] transition-all focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]/20"
          />
        </div>

        {/* In Stock Switch */}
        <div className="pt-2 flex items-center justify-between border-t border-[#f1f3f5]">
          <div>
            <div className="text-xs font-medium text-[#111827]">Stock Availability</div>
            <div className="text-[11px] text-[#6b7280]">
              {inStock ? 'Item is visible and ready to order.' : 'Item is marked as Out of Stock.'}
            </div>
          </div>
          <Switch checked={inStock} onChange={setInStock} label={inStock ? 'In Stock' : 'Out of Stock'} />
        </div>
      </form>
    </Modal>
  );
}
