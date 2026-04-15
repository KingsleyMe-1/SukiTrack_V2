# SukiTrack

**Intelligent inventory and credit management for Filipino sari-sari store owners.**

SukiTrack is a dedicated business management platform built to empower the backbone of neighborhood commerce in the Philippines. It replaces the pen-and-paper "listahan" system most small store owners still rely on — bringing inventory control, customer credit tracking, and multi-store analytics into one clean, intuitive dashboard accessible from any device.

Whether you run a single corner store or several branches, SukiTrack keeps your entire operation organized, accountable, and data-driven — without requiring any accounting background or technical expertise.

---

## Features

### Dashboard & Analytics
- **Personalized greeting banner** with a live count of pending alerts
- **Stats grid** showing total revenue, outstanding customer credit, and overall credit risk level across all stores
- **Weekly growth chart** displaying sales bars for each day (Mon–Sun) with a "Today" highlight for instant context
- **Stock alerts panel** prioritizing critical out-of-stock items above low-stock items
- **Activity feed** for a rolling log of recent store transactions

### Inventory Management
- Track every product with its name, category, stock count, cost price, selling price, and last restock date
- Seven product categories: Grains & Rice, Canned Goods, Beverages, Cooking Essentials, Baking & Spices, Quick Meals, and Household
- Three stock statuses per item: **Healthy**, **Low Stock**, and **Out of Stock**
- Full CRUD — add new items, edit existing ones, bulk restock, and delete
- Filter and search across all inventory items
- Responsive table view on desktop; card view on mobile

### Customer Credit Management (Sukis)
- Maintain a digital ledger for every regular customer (suki)
- Track each customer's outstanding credit balance and last purchase date
- Four credit risk statuses per customer: **New**, **Stable**, **Due Soon**, and **High Risk**
- Collection rate metric — shows what percentage of your customer base is in good standing
- Add, edit, and remove customer records at any time

### Multi-Store Management
- Register and manage multiple physical or pop-up store locations under one account
- Per-store visibility into today's sales, stock level percentage, daily revenue target, and assigned manager
- Store status tracking: **Active**, **Ongoing Maintenance**, or **Closed**
- Credit account avatars on each store card for quick customer-at-a-glance reference
- Deleting a store automatically cleans up all associated credit account records

### Authentication & Security
- Full account authentication — sign up, log in, and log out
- Every piece of data (stores, inventory, customers) is scoped to the authenticated owner
- Server-side session handling ensures no data leaks between accounts
- Auth-guarded dashboard routes automatically redirect unauthenticated visitors

---

## Project Structure

```
app/
├── (landing)/          # Public marketing site (hero, features, journey, footer)
├── (store_owner)/      # Protected dashboard routes (auth-guarded)
│   ├── dashboard/      # Overview, stats, charts, alerts
│   ├── customers/      # Suki credit accounts
│   ├── inventory/      # Product stock tracking
│   └── stores/         # Multi-location store management
├── auth/callback/      # Supabase auth callback handler
├── components/         # Shared UI components (Button, GlassCard, InputField, etc.)
├── contexts/           # React context providers (ThemeContext)
├── data/
│   ├── mock/           # Static fallback data for UI development
│   └── supabase/       # Live database query functions (full CRUD per domain)
├── db/
│   ├── index.ts        # Database connection
│   └── schema.ts       # Full database schema definitions
├── hooks/              # Custom React hooks
├── types/              # TypeScript types for all data domains
└── utils/
    ├── cn.ts           # Class name utility
    ├── format.ts       # Locale-aware (en-PH) date and number formatters
    └── supabase/       # Supabase client helpers (server + client)
```

---

## Database Schema

| Table | Description |
|---|---|
| `stores` | Each store location owned by a user. Tracks sales, stock level %, daily target, manager, and status. |
| `store_credit_accounts` | Avatar records (initials + color) linked to a store. Cascades on store delete. |
| `inventory_items` | Individual products linked to a store. Tracks category, stock count, cost, price, and restock history. |
| `customers` | Suki credit accounts linked to an owner. Tracks credit balance, risk status, and last purchase. |

All tables are scoped by `owner_id` (referencing the authenticated user's ID) to ensure complete data isolation between accounts.

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project with the schema applied

### Environment Variables

Create a `.env.local` file at the root with the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_postgres_connection_string
```

### Install & Run

```bash
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build the app for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the codebase |
| `npm run db:generate` | Generate Drizzle migration files from schema changes |
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:studio` | Open Drizzle Studio for visual database browsing |

---

## Design System

- **Color tokens** use the OKLch color space with full light and dark mode support via CSS custom properties
- **Glassmorphism** effects are applied to floating elements and hero section badges using backdrop blur
- **Material Symbols** provide a consistent icon vocabulary throughout the UI
- **DM Sans** is used as the primary typeface for a clean, modern feel
- All components are **mobile-first** with responsive breakpoints for tablet and desktop
