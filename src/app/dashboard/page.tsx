import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/DashboardNav';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from '@/components/ui';
import { STORE_CATEGORIES } from '@/lib/constants';
import CopyLinkButton from './CopyLinkButton';
import { Package, Layers, MessageSquare, ShoppingBag, ArrowUpRight, CheckCircle2, Settings, Store } from 'lucide-react';

export const instant = false;

export const metadata: Metadata = {
  title: 'Merchant Overview — DukaanOS',
  description: 'Manage your store, products, and incoming orders.',
};

export default async function DashboardPage() {
  await connection();

  const supabase = await createClient();

  // Defense in depth: Verify session directly on server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the merchant's store
  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  // If no store exists yet, forward to onboarding wizard
  if (!store || error) {
    redirect('/onboarding');
  }

  // Fetch product and category counts
  const { count: productCount } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', store.id);

  const { count: inStockCount } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', store.id)
    .eq('in_stock', true);

  const { count: categoryCount } = await supabase
    .from('categories')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', store.id);

  const { count: orderCount } = await supabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('store_id', store.id);

  const categoryLabel =
    STORE_CATEGORIES.find((c) => c.value === store.category)?.label || store.category;

  const formattedDate = new Date(store.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const totalProducts = productCount || 0;
  const inStock = inStockCount || 0;
  const totalCategories = categoryCount || 0;
  const totalOrders = orderCount || 0;

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col">
      {/* Top Merchant Navigation & Tabs */}
      <DashboardNav
        storeName={store.name}
        storeSlug={store.slug}
        userEmail={user.email || ''}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-[#111827] tracking-tight">
                {store.name}
              </h1>
              <Badge variant="success">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-1 animate-pulse" />
                Live Store
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#4b5563]">
              {categoryLabel} &bull; {store.city}, {store.state} &bull; Created on {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`/store/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-xs font-medium text-[#111827] shadow-xs transition"
            >
              <span>View Storefront</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#ea580c]" />
            </a>
            <CopyLinkButton slug={store.slug} />
            <Link
              href="/dashboard/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-xs font-medium text-[#4b5563] shadow-xs transition"
            >
              <Settings className="w-3.5 h-3.5 text-[#6b7280]" />
              <span>Settings</span>
            </Link>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Card 1: Orders */}
          <Card className="hover:border-orange-300 transition-colors">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-[#6b7280]">
                  Total Orders
                </span>
                <div className="text-2xl font-semibold text-[#111827] mt-1 font-mono-numbers">
                  {totalOrders}
                </div>
                <div className="mt-2 text-[11px] text-[#6b7280]">
                  <Link href="/dashboard/orders" className="text-[#ea580c] hover:underline font-medium inline-flex items-center gap-0.5">
                    View Orders &rarr;
                  </Link>
                </div>
              </div>
              <div className="w-10 h-10 rounded bg-[#fff7ed] text-[#ea580c] flex items-center justify-center border border-orange-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Products */}
          <Card className="hover:border-orange-300 transition-colors">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-[#6b7280]">
                  Catalog Products
                </span>
                <div className="text-2xl font-semibold text-[#111827] mt-1 font-mono-numbers">
                  {totalProducts}
                </div>
                <div className="mt-2 text-[11px] text-[#059669] font-medium">
                  {inStock} in stock
                </div>
              </div>
              <div className="w-10 h-10 rounded bg-[#f0f3ff] text-[#ea580c] flex items-center justify-center border border-[#dce2f3]">
                <Package className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Categories */}
          <Card className="hover:border-orange-300 transition-colors">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-[#6b7280]">
                  Categories
                </span>
                <div className="text-2xl font-semibold text-[#111827] mt-1 font-mono-numbers">
                  {totalCategories}
                </div>
                <div className="mt-2 text-[11px] text-[#6b7280]">
                  <Link href="/dashboard/categories" className="text-[#ea580c] hover:underline font-medium inline-flex items-center gap-0.5">
                    Manage Groups &rarr;
                  </Link>
                </div>
              </div>
              <div className="w-10 h-10 rounded bg-[#f9fafb] text-[#575e70] flex items-center justify-center border border-[#e5e7eb]">
                <Layers className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          {/* Card 4: WhatsApp Routing */}
          <Card className="hover:border-orange-300 transition-colors">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-[#6b7280]">
                  WhatsApp Channel
                </span>
                <div className="text-sm font-semibold text-[#111827] mt-2 font-mono-numbers truncate max-w-[140px]">
                  +91 {store.whatsapp_number}
                </div>
                <div className="mt-2 text-[11px] text-[#059669] font-medium">
                  Active &bull; 0% Fee
                </div>
              </div>
              <div className="w-10 h-10 rounded bg-[#ecfdf5] text-[#059669] flex items-center justify-center border border-emerald-200">
                <MessageSquare className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Public Storefront Address & Configuration */}
          <div className="lg:col-span-7 space-y-6">
            {/* Store Address Banner Card */}
            <Card className="border-[#e5e7eb] bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#ea580c] uppercase tracking-wider">
                    Storefront Web Address
                  </span>
                  <Badge variant="brand">Active</Badge>
                </div>
                <CardTitle className="text-lg mt-1 font-mono-numbers text-[#111827]">
                  dukaanos.in/<span className="text-[#ea580c]">{store.slug}</span>
                </CardTitle>
                <CardDescription>
                  Share this link with customers on WhatsApp, Instagram bio, or print on shop packaging.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#4b5563] bg-[#f9fafb] border-t border-[#f1f3f5]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
                  <span>Public Storefront Live &bull; <strong>COD &amp; WhatsApp Checkout Active</strong></span>
                </div>
                <CopyLinkButton slug={store.slug} />
              </CardContent>
            </Card>

            {/* Business Specs Table */}
            <Card>
              <CardHeader>
                <CardTitle>Business Details</CardTitle>
                <CardDescription>Verified store contact and location parameters</CardDescription>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-[#f1f3f5]">
                <div className="px-5 py-3 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#6b7280]">Shop Name</span>
                  <span className="font-semibold text-[#111827]">{store.name}</span>
                </div>
                <div className="px-5 py-3 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#6b7280]">Store URL Slug</span>
                  <span className="font-mono-numbers text-[#ea580c] font-semibold">{store.slug}</span>
                </div>
                <div className="px-5 py-3 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#6b7280]">WhatsApp Orders Number</span>
                  <span className="font-medium text-[#111827] font-mono-numbers">
                    +91 {store.whatsapp_number}
                  </span>
                </div>
                <div className="px-5 py-3 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#6b7280]">Category</span>
                  <span className="font-medium text-[#374151]">{categoryLabel}</span>
                </div>
                <div className="px-5 py-3 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#6b7280]">Location</span>
                  <span className="font-medium text-[#374151]">{store.city}, {store.state}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Launch Checklist */}
          <div className="lg:col-span-5 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Milestone Checklist</CardTitle>
                  <Badge variant="success">All Systems Active</Badge>
                </div>
                <CardDescription>
                  Your shop setup status on DukaanOS
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Step 1 */}
                <div className="p-3 rounded border border-emerald-200 bg-[#ecfdf5]/50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#111827]">1. Account &amp; Storefront Config</h4>
                    <p className="text-[11px] text-[#4b5563] mt-0.5">
                      Store slug &amp; WhatsApp routing established. (Milestone 1 ✅)
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded border border-emerald-200 bg-[#ecfdf5]/50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-[#111827]">
                      2. Catalog &amp; Category Setup
                    </h4>
                    <p className="text-[11px] text-[#4b5563] mt-0.5">
                      {totalProducts} products listed across {totalCategories} categories. (Milestone 2 ✅)
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded border border-emerald-200 bg-[#ecfdf5]/50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-[#111827]">3. Public Merchant Storefront</h4>
                    <p className="text-[11px] text-[#4b5563] mt-0.5">
                      Rendered at dukaanos.in/{store.slug}. (Milestone 3 ✅)
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3 rounded border border-orange-200 bg-[#fff7ed]/50 flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#ea580c] text-white flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-[#c2410c]">
                        4. Orders &amp; Checkout System
                      </h4>
                      <Link href="/dashboard/orders">
                        <span className="text-[11px] font-semibold text-[#ea580c] hover:underline">
                          {totalOrders} Orders &rarr;
                        </span>
                      </Link>
                    </div>
                    <p className="text-[11px] text-[#4b5563] mt-0.5">
                      Cart drawer, atomic RPC order creation, and status management. (Milestone 4 🚀)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-[#111827]">Diagnostics &amp; Health</div>
                  <div className="text-[11px] text-[#6b7280]">Inspect system connectivity and status</div>
                </div>
                <Link href="/health">
                  <Button variant="secondary" size="sm">
                    System Health
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
