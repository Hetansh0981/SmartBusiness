# DukaanOS — Project Brief & Product Specification

**Version:** 1.0  
**Status:** Draft / Pending Founder Approval  
**Target Market:** Indian Local Merchants & SMBs (Kirana, Fashion Boutiques, Bakeries, Electronics, Home Businesses)

---

## 1. Executive Summary & Vision

**DukaanOS** is an AI-powered, no-code digital storefront builder tailored specifically for the Indian retail ecosystem.

In India, millions of local shop owners want to sell online, but existing platforms (like Shopify or WooCommerce) are:
- **Too complex:** Designed for Western e-commerce workflows with complicated inventory setups, tax configurations, and foreign jargon.
- **Too expensive:** High monthly subscriptions ($29–$79/month) plus transaction cut fees that kill thin retail margins.
- **Misaligned with consumer behavior:** Traditional checkout flows demand credit cards and complex address forms. Indian consumers and merchants thrive on **WhatsApp** communication and **direct UPI** payments.

**The DukaanOS Promise:**  
A local merchant with zero technical skills should be able to create an attractive, mobile-optimized business website in under 5 minutes from their phone or laptop, upload products, and start receiving verified orders directly on WhatsApp and UPI.

---

## 2. Target Customers (Ideal Customer Profiles)

| Customer Segment | Typical Business | Core Need | Key Feature Used |
| :--- | :--- | :--- | :--- |
| **Fashion & Boutiques** | Saree centers, ethnic wear, custom tailors | Visual catalogs, size variations, Instagram integration | Lookbook galleries, product variant toggles, WhatsApp inquiry |
| **Kirana & Daily Essentials** | Neighborhood grocery, organic stores, dry fruits | Fast ordering, local delivery radius, repeat customers | Quick item list, minimum order values, instant order ping |
| **Bakeries & Food Crafters** | Home bakers, cloud kitchens, sweet shops | Advance pre-orders, date pickers, custom message fields | Pre-order scheduling, flavor selection, UPI advance payment |
| **Local Services & Hardware** | Mobile repair, electronics, plumbing/electrical | Inquiries, quotation requests, store location & hours | Click-to-call, Google Maps embed, inquiry lead form |

---

## 3. Core Problems We Are Solving

1. **The "High Cart Abandonment" Problem in India:**  
   Indian customers often abandon carts when forced to sign up with emails and enter debit/credit cards. DukaanOS provides a **1-Tap WhatsApp Checkout** and **UPI QR / Direct Intent**, matching how Bharat actually shops.
2. **The "Expensive Agency & Developer Dependency" Trap:**  
   Hiring an agency costs ₹20,000–₹50,000 upfront plus recurring maintenance. DukaanOS gives the shopkeeper full visual control through simple toggle switches, color pickers, and pre-designed blocks.
3. **The "Catalog Upload Friction":**  
   Typing out 50 product descriptions is exhausting for a busy shopkeeper. AI assistance will help auto-generate descriptions, titles, and tags from simple photo uploads or short bullet points.

---

## 4. Key Feature Roadmap (Phased)

### Phase 1: Minimum Viable Product (MVP)
* **Merchant Authentication:** Secure sign-up/login using email and password (with OTP/phone login planned).
* **Store Creation Wizard:** Setup store name, slug (e.g., `dukaanos.in/sharma-sweets`), currency (₹ INR), address, and WhatsApp business number.
* **Product Catalog:**
  * Add, edit, archive products.
  * Image uploads with automatic optimization.
  * Pricing: Selling Price, MRP (shows % discount badge), and stock availability toggle.
  * Simple category management (e.g., "Sweets", "Namkeen", "Gift Boxes").
* **Public Storefront Engine (Reusable Renderer):**
  * Blazing fast, mobile-first responsive public website for shoppers.
  * Built first so any store can render cleanly and reliably before adding complex drag-and-drop tools.
  * Search and category filtering.
  * Shopping cart drawer with instant quantity adjustments.
* **1-Tap WhatsApp & Cash on Delivery (COD) Checkout:**
  * Customers place orders with delivery address and items via WhatsApp.
  * Cash on Delivery (COD) enabled out-of-the-box.
  * Zero gateway transaction fees. Payment verification is handled separately (merchant verifies UPI screenshot/cash on delivery).

### Phase 2: AI Storefront Generation (Core Flagship Feature)
* **Full AI Storefront Generation:** Merchant provides a business name, category, and brief description (or voice note). AI automatically generates:
  * Catchy store tagline and About Us story.
  * Recommended product categories.
  * 5–10 starter products with realistic Indian market pricing, descriptions, and placeholder imagery.
  * Matching brand color scheme.
* **AI Product Copywriter:** One-click generation of product descriptions in English and Hinglish.

### Phase 3: No-Code Visual Storefront Customizer
* **Visual Theme Customizer:** Toggle banner images, announcement bar (e.g., *"Free delivery on orders above ₹499"*), primary accent colors, and font styles.
* **Social & Business Links:** Direct links to Instagram, Facebook, Google Maps location, and store timing badges (Open/Closed status).
* **Product Variants:** Sizes (S, M, L, XL), Colors, Weights (250g, 500g, 1kg).

### Phase 4: Growth, Custom Domains & Analytics
* **Custom Domain Mapping:** Connect `www.mybrand.com` directly using Cloudflare.
* **Manual Payment Reconciliation & Verification:** Mark orders as "Paid via UPI", "Payment Pending", or "COD Collected".
* **Basic Analytics:** Daily visitors, total catalog views, and top clicked products.
* **Customer Inquiries & Order Status Tracker:** Track pending, completed, or cancelled orders inside the merchant dashboard.

---

## 5. Non-Negotiable Product Principles

1. **Mobile-First Everything:** Over 85% of shoppers and merchants will access DukaanOS on smartphones. Desktop experience will be great, but mobile must be flawless.
2. **Sub-2-Second Load Time:** Fast loading on 4G networks across Tier-1, Tier-2, and Tier-3 cities in India.
3. **Zero Jargon:** No words like "DNS record", "API endpoint", or "Webhook" in merchant-facing screens. We use human words like "Your Web Address", "Order Notifications", and "Shop Link".
4. **Data Ownership:** Merchants own their customer data and product catalogs. No lock-in, and easy CSV export anytime.
