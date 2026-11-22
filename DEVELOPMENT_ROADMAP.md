# DukaanOS — Development Roadmap

**Version:** 1.0  
**Strategy:** Incremental, Test-Driven & Milestone-Based  
**Approach:** Each milestone delivers a working, testable piece of software. We never move to the next milestone until the current one is tested and approved by you.

---

## Roadmap Overview

```
Milestone 0: Project Setup & Architecture Scaffold
     │
     ▼
Milestone 1: Merchant Authentication & Store Setup
     │
     ▼
Milestone 2: Product & Category Management
     │
     ▼
Milestone 3: High-Speed Reusable Storefront Engine (Renderer)
     │
     ▼
Milestone 4: Cart System & WhatsApp / COD Checkout Flow
     │
     ▼
Milestone 5: Full AI Website Generation (Storefronts, Themes & Catalogs)
     │
     ▼
Milestone 6: No-Code Visual Storefront Customizer
     │
     ▼
Milestone 7: Custom Domains, Production Hardening & Launch
```

---

## Detailed Milestones

### Milestone 0: Foundation & Environment Setup
* **Goal:** Initialize our project repository, configure development tools, and prepare a rock-solid, production-ready scaffold.
* **Deliverables:**
  * Clean Next.js application initialized with TypeScript and Tailwind CSS.
  * Project folder structure set up for scalability and clean code separation.
  * Supabase project connected with environment variable safeguards (`.env.local`).
  * Basic health-check page confirming frontend and database connectivity.
* **How We Will Test It Together:**
  1. We will run the local development server.
  2. You will open `http://localhost:3000` in your browser.
  3. You will verify that a clean "DukaanOS System Status: Online" screen loads with zero errors in the browser console.
* **Definition of Done:** Both of us confirm the project boots cleanly, TypeScript checks pass with zero errors, and Supabase connection is established.

---

### Milestone 1: Merchant Authentication & Store Creation
* **Status:** Completed & Verified ✅
* **Deliverables:**
  * Clean, mobile-friendly Sign-Up and Login screens.
  * Secure merchant authentication via Supabase Auth with server-side cookie sessions.
  * Next.js 16 Proxy (`src/proxy.ts`) with automatic session refresh and route guards.
  * Reusable DukaanOS Design System (`Button`, `Input`, `Select`, `Card`, `Badge`).
  * First-time Store Setup Wizard:
    * Shop Name
    * Real-time auto-generated unique slug (`dukaanos.in/[slug]`)
    * WhatsApp Business Phone Number (+91...)
    * Curated Indian retail categories
    * City and State dropdown
  * Database-level auto-ownership (`DEFAULT auth.uid()`), RLS policies, and unique `owner_id`.
  * Merchant Dashboard home screen showing store details and public store link.

---

### Milestone 2: Product & Category Management
* **Status:** Completed & Verified ✅
* **Goal:** Give shop owners an effortless way to create, organize, and manage products and categories.
* **Deliverables:**
  * Reusable UI components: `Switch` (toggle), `Modal` (smooth dialogs), `EmptyState`.
  * Categories Management (`/dashboard/categories`):
    * Create, rename, and safely delete categories.
    * Composite foreign key `ON DELETE SET NULL (category_id)` to prevent accidental product loss.
    * Case-insensitive uniqueness guards on category name and slug per store.
  * Product Catalog Management (`/dashboard/products`):
    * Real-time search filter and category/stock filter dropdowns.
    * Add/Edit product modal with image upload, selling price (₹), optional MRP with auto-calculated discount badge (`% OFF`), and description.
    * 1-Click Stock Availability Toggle Switch with optimistic UI updates.
    * Delete product with safety confirmation modal and automatic image storage cleanup.
  * Supabase Storage (`product-images` bucket):
    * 5 MB file size limit and MIME-type restrictions enforced at storage layer.
    * Deterministic path isolation (`{store_id}/{uuid}.{ext}`) with text-matching RLS policies.
  * Automated `updated_at` trigger for stores, categories, and products.

---

### Milestone 3: High-Speed Reusable Storefront Engine (Renderer)
* **Status:** Completed & Verified ✅
* **Goal:** Generate a lightning-fast, beautiful, mobile-first public website renderer that can display any merchant's store dynamically based on data.
* **Deliverables:**
  * Public route: `/store/[slug]` (e.g. `http://localhost:3000/store/ambica-dalwada-and-kheeru`).
  * Adaptive Category Theme Engine (`src/lib/storefrontThemes.ts`) with custom palettes and badges for Bakery/Sweets, Boutiques, Kirana, Electronics, Jewelry, etc.
  * Verified WhatsApp normalization with E.164 formatting (`src/lib/whatsapp.ts`) and contextual "Order on WhatsApp" vs "Enquire on WhatsApp" actions.
  * Mobile-first responsive layout with horizontal swipeable category pills and real-time search.
  * Fallback cards for missing photos, distinguishing empty catalogs from zero filter matches.
  * Secure PostgreSQL column-level security excluding `owner_id` from anonymous visitors.
  * Publication status (`is_published`) with RLS policies restricting anonymous access strictly to published stores.
  * Store Deletion & Reset System (`/dashboard/settings`) allowing merchants to safely delete their store and immediately launch a new one.

---

### Milestone 4: Cart System & WhatsApp / COD Checkout Flow
* **Status:** Completed & Verified ✅
* **Goal:** Enable customers to build a cart and place structured orders with Cash on Delivery (COD) support and direct WhatsApp order confirmation to the merchant.
* **Deliverables:**
  * Floating shopping cart bar with real-time item counter and slide-up animation.
  * Slide-over Cart Drawer:
    * Store-isolated state persisted per store in `localStorage` (`dukaanos_cart_${storeId}`).
    * Increase/decrease quantities, remove items, clear cart.
    * Real-time calculation of item line totals and subtotal.
  * Responsive Indian Checkout Modal:
    * Customer Name (min 2 chars, max 100).
    * Phone Number (10-digit Indian mobile validation with `+91` prefix).
    * Delivery Mode selection: "Home Delivery" or "Self-Pickup / Takeaway".
    * Street address, city, state, and 6-digit Indian PIN code validation (`^[1-9][0-9]{5}$`).
    * Optional customer delivery instructions / notes (max 500 chars).
    * Payment Option: Cash on Delivery (COD).
    * Order Channel: Website or WhatsApp dispatch.
  * Atomic PostgreSQL Order Creation RPC (`public.create_order`):
    * `SET search_path = ''` with schema-qualified security.
    * Concurrency-safe store-isolated idempotency lock (`pg_advisory_xact_lock`).
    * Deterministic row locking (`FOR SHARE`) preventing concurrent price changes during checkout.
    * Authoritative server-side price calculation and immutable item snapshot recording.
    * Unique collision-resistant order references (`DK-YYMM-XXXXXX`).
    * Composite foreign key integrity `(order_id, store_id) REFERENCES orders(id, store_id) ON DELETE CASCADE`.
    * Store deletion restriction `ON DELETE RESTRICT` preserving legal order history.
  * Order Confirmation & WhatsApp Dispatch:
    * Receipt modal showing confirmed order reference and total.
    * 1-Tap "Send Order to Shop on WhatsApp" button generating structured order text.
  * Merchant Order Dashboard (`/dashboard/orders`):
    * Real-time orders feed and metrics strip (Total Orders, Pending Action, Fulfilled, Gross Volume).
    * Search filter by Order Ref, Customer Name, or Phone Number.
    * Status filter chips (`All`, `Pending`, `Confirmed`, `Processing`, `Ready for Pickup`, `Shipped`, `Delivered`, `Cancelled`).
    * Order Details Modal with itemized snapshots, customer details, and 1-tap WhatsApp chat button.
    * Server-side finite state machine trigger enforcing valid lifecycle transitions.
    * Column-level privilege confinement (merchants can only modify `status`).

---

### Milestone 5: Full AI Website Generation (Flagship Feature)
* **Goal:** Allow a shop owner to type a 2-sentence business idea and have AI generate their entire storefront (branding, hero banners, category structure, and starter catalog).
* **Deliverables:**
  * "AI Store Generator" wizard in dashboard:
    * Input: Shop name, category (e.g. "Organic Spice Shop in Jaipur"), and target audience.
    * Output:
      * Catchy tagline and brand story / About Us section.
      * 3–5 tailored product categories.
      * 6–10 starter products with realistic Indian market prices, descriptions, and placeholder images.
      * Recommended color theme (e.g., earthy tones for organic goods).
  * One-click "Apply to My Store" action with complete preview.
  * Standalone AI Product Copywriter for individual items (English & Hinglish).
* **How We Will Test It Together:**
  1. In the dashboard, you will click "Generate Store with AI".
  2. You will type a test prompt like "Home Bakery in Pune specializing in sourdough and tea cakes".
  3. You will review the generated store draft, approve it, and see your public storefront instantly populated with relevant bakery products and warm branding.
* **Definition of Done:** AI generates a fully populated, cohesive storefront with categories, copy, and products in under 30 seconds.

---

### Milestone 6: No-Code Visual Storefront Customizer
* **Goal:** Enable shopkeepers to fine-tune and customize their generated store without writing a single line of CSS or code.
* **Deliverables:**
  * Dashboard "Store Appearance" settings:
    * Primary Brand Color picker (preset palette for non-designers: Royal Blue, Emerald Green, Warm Saffron, Berry Purple, Midnight Black).
    * Store Banner upload & Announcement Bar text (e.g., "Special 10% Diwali Discount!").
    * Store Social Links (Instagram handle, Facebook page, Google Maps link).
    * About Us / Store Story text block.
  * Live Preview panel showing how changes look on a mobile screen before publishing.
* **How We Will Test It Together:**
  1. You will change your store's primary color from the dashboard.
  2. You will type an announcement bar message and upload a header banner.
  3. You will save changes and refresh your public storefront to see your custom branding applied immediately.
* **Definition of Done:** Storefront appearance dynamically reflects merchant's custom theme settings.

---

### Milestone 7: Custom Domains, Production Hardening & Cloudflare Deployment
* **Goal:** Prepare the platform for public beta launch with custom domain routing, SSL certificates, and high-availability hosting.
* **Deliverables:**
  * Cloudflare DNS and edge configuration for wildcard subdomains (`*.dukaanos.in`) and custom domains (`www.myshop.in`).
  * Automated security checks and rate limiting to prevent spam orders.
  * SEO metadata generation (OpenGraph previews so sharing the shop link on WhatsApp shows shop image and name).
  * Production deployment guide and monitoring setup.
* **How We Will Test It Together:**
  1. Deploy to a live staging URL.
  2. Share the link in WhatsApp to confirm the preview card (logo + title + description) looks professional.
  3. Perform an end-to-end order test on a physical smartphone on mobile data.
* **Definition of Done:** Application deployed live, fully secure, performing with sub-2s response times, ready for merchant onboarding.
