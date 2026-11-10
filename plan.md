# CaféUI — College Cafeteria Food Ordering Platform
## Project Plan & Architecture Document

> **This file is the single source of truth for the entire project.**
> Read this file before every modification. Update it after every completed task.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [UX and Visual Identity Audit](#2-ux-and-visual-identity-audit)
3. [Functional Requirements](#3-functional-requirements)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Authentication Workflows](#5-authentication-workflows)
6. [Pages & Responsibilities](#6-pages--responsibilities)
7. [UI/UX Design System & Responsive Strategy](#7-uiux-design-system--responsive-strategy)
8. [Technology Stack & Architecture](#8-technology-stack--architecture)
9. [Folder & File Structure](#9-folder--file-structure)
10. [Component Hierarchy](#10-component-hierarchy)
11. [Routing Structure & User Flow](#11-routing-structure--user-flow)
12. [State Management](#12-state-management)
13. [Future Admin Panel Architecture (FUTURE / NOT IMPLEMENTED)](#13-future-admin-panel-architecture-future--not-implemented)
14. [Validation & Error Handling](#14-validation--error-handling)
15. [Responsive Design Strategy](#15-responsive-design-strategy)
16. [Implementation Roadmap](#16-implementation-roadmap)
17. [Testing Strategy](#17-testing-strategy)
18. [Known Limitations & Pending Decisions](#18-known-limitations--pending-decisions)

---

## 1. Project Overview

**Project Name:** CAFETERIA — College of Engineering Vadakara  
**Type:** College Cafeteria Food Ordering Web Application  
**Target Users:** Students, Faculty, and Guests of College of Engineering Vadakara (CEV)  
**Primary Device Audience:** 90% Mobile Users (Mobile-First Experience is Priority #1)  
**Developed by:** IEDC CEV  
**Primary Goal:** Provide a dedicated campus cafeteria welcome and pre-ordering platform, allowing students, faculty, and guests to browse food items, order meals in advance, skip queues, and pick up fresh food hassle-free.

---

## 2. UX and Visual Identity Audit

### A. Existing Design Strengths
- **Cohesive Color Palette:** Recognizable orange-and-white identity (`#F47721`, `#FFF7F0`, `#252525`, `#EEEEEE`).
- **Clean SVG Iconography:** Entire application uses Lucide React with zero emoji placeholders.
- **Fast Client Architecture:** Centralized `menuService.ts` and in-memory caches allow instant filtering.
- **Universal Attribution:** Exact mandatory footer (`Designed and Developed by IEDC CEV`) displayed uniformly.
- **Interactive Takeaway Receipt & QR:** Stepped mechanical animation and canvas PNG export for offline pickup.

### B. Identified Problems by Priority

| Priority | Category | Problem Description | Affected Files | Planned Solution |
|---|---|---|---|---|
| **P0** | Mobile Usability | **Sub-standard Touch Targets:** Stepper buttons in `FoodCard` and `CartItemRow` are `w-6 h-6` (24px) with tiny 12px icons. Fails WCAG 2.5.5 minimum 44px touch target guidelines; leads to frequent mis-taps on mobile. | `FoodCard.tsx`, `CartItem.tsx`, `Button.tsx` | Enlarge touch hitboxes to minimum 44x44px equivalent (`w-8 h-8` with tap padding); ensure comfortable finger tap targets on all devices down to 320px. |
| **P0** | Mobile Journey | **Buried Cart & Checkout Actions:** On mobile devices with 3+ items, "Proceed to Checkout" on `/cart` and "Confirm & Place Order" on `/checkout` are pushed beneath long vertical scrolls. Students must scroll through all items to see totals or submit. | `app/cart/page.tsx`, `app/checkout/page.tsx` | Implement a persistent mobile sticky bottom action bar (`sm:hidden`) displaying live totals, item counts, and one-tap checkout submission above the bottom bar. |
| **P1** | Card Hierarchy | **Inconsistent Card Heights & Ragged Grid Alignment:** In a 2-column mobile food grid, differing title lengths and descriptions create ragged uneven rows and inconsistent card heights. | `FoodCard.tsx`, `FoodGrid.tsx` | Enforce rigid `h-full` flex-column structure, standard 2-line title clamps, normalized image aspect ratios, and unified price-action row pinning. |
| **P1** | Design Tokens | **Inconsistent Spacing, Radii, and Focus Indicators:** Components mix arbitrary classes (`rounded-xl`, `rounded-2xl`, `rounded-3xl`, arbitrary padding). `Button.tsx` lacks visible accessible focus rings (`focus-visible:ring-2`). | `globals.css`, `Button.tsx`, `Input.tsx` | Formalize design tokens in `globals.css` and Tailwind: standard border radii (`rounded-2xl` for cards, `rounded-xl` for controls), standard button heights (44px min), and focus rings. |
| **P1** | Navigation UX | **Category Carousel Affordance:** On mobile, `CategoryFilter` scrolls horizontally with no edge fade or hint that more categories exist off-screen, causing users to miss items like Desserts/Drinks. | `CategoryFilter.tsx` | Add subtle scroll fades on carousel edges and clear horizontal scrolling cues with active pill highlight. |
| **P1** | Safe Areas | **Mobile Safe-Area Clearance:** Fixed bottom navigation (`BottomNav.tsx`) lacks explicit `env(safe-area-inset-bottom)` support on modern smartphones with home indicator gestures (iPhone/Android). | `BottomNav.tsx`, `AppShell.tsx`, `Footer.tsx` | Add `pb-[env(safe-area-inset-bottom)]` and corresponding padding to `AppShell` to ensure zero gesture bar overlap. |
| **P1** | Accessibility | **Form Field & Error Association:** Input error messages in `Input.tsx` lack `aria-describedby` linking; screen readers do not announce validation errors automatically. Text contrast on secondary labels (`#777777`) is borderline AA on white. | `Input.tsx`, `globals.css` | Link `aria-invalid` and `aria-describedby` on inputs; adjust secondary text token to `#666666` (5.7:1 contrast ratio). |
| **P2** | Microinteractions | **Cart & Action Feedback:** Adding items to cart changes button text to "Added", but lacks animated cart badge bounce or notification pulse on the bottom nav / header icon. | `Header.tsx`, `BottomNav.tsx`, `FoodCard.tsx` | Add subtle scale pulse to cart count badges when items are added to provide clear confirmation. |
| **P2** | Performance | **Food Card Image Loading:** Images use `unoptimized` without blur placeholders or progressive skeletons during initial fetch. | `FoodCard.tsx`, `FoodGrid.tsx` | Implement skeleton loading states and graceful image fade-ins. |

### Objectives
- **Full-Screen Responsive Website:** Expand naturally on desktop up to full viewport width (`max-w-7xl` container) with balanced spacing and wider food grids, while preserving compact touch-friendly mobile layouts with 2-column food grids and fixed bottom navigation.
- **Dedicated Welcome Landing Page:** Official college portal branding for "College of Engineering Vadakara" with clear "Sign In" and "Create Account" options, and the mandatory attribution "Designed and Developed by IEDC CEV".
- **Structured Authentication:** Student, Faculty (mandatory Teacher ID), and Guest (no department) with Google OAuth and Email OTP verification.
- **Dedicated Authenticated Home:** Accessible at `/home` after login, offering search, category shortcuts, hot meals, popular dishes, and menu preview.
- **Future-Admin Ready Architecture:** Centralized data access layer (`menuService.ts`) isolating UI components from static data, ready for future administrative catalog management without component rework.

---

## 2. Functional Requirements

### A. Public Landing Page (`/`)
- [x] Official Cafeteria identity: "CAFETERIA — College of Engineering Vadakara"
- [x] Institutional Header: logo on left, College name below brand name, Sign In action on right
- [x] Two-column desktop hero layout with strong typography hierarchy & natural alignment
- [x] Food visual composition on right side of hero: authentic Kerala Meals showcase, counter open badge, prep time indicator, and Masala Dosa hot accent
- [x] Distinctive "Create Account" CTA: glowing / glazed orange button (`.btn-glazed-orange`) with surface highlight, layered soft glow, and hover light sheen
- [x] Secondary quieter "Sign In" action button
- [x] Campus Community access indicators (Students, Faculty with Teacher ID, Guests)
- [x] Three polished feature cards: Fresh Campus Meals, Quick Counter Pickup, Campus Community (1 row on desktop, equal height, subtle warm background)
- [x] Sticky footer with exact attribution: `Designed and Developed by IEDC CEV`

### B. Authentication System
- [x] Email + password login (`/login`)
- [x] One-time password (OTP) email login
- [x] Google OAuth login & registration (role-preserving)
- [x] Sign-up (`/signup`) with three user modes:
  - **Student:** Name, Email, Phone (optional), Department (optional), Password
  - **Faculty:** Name, Email, Phone (optional), Department (optional), **Teacher ID (mandatory)**, Password
  - **Guest:** Name, Email, Phone (optional), Password (no department field)
- [x] Faculty Google registration additional step: prompts for Teacher ID
- [x] Email OTP verification screen (`/verify-otp`) with 10s redirect countdown
- [x] Forgot password page (`/forgot-password`)
- [x] Reset password page (`/reset-password`)
- [x] Exact footer attribution on all auth pages: `Designed and Developed by IEDC CEV`

### C. Main Cafeteria Application (`/home`)
- [x] Responsive header with brand name, college subtitle, cart counter, and desktop nav links
- [x] Mobile fixed bottom navigation (Home, Menu, Cart, Profile)
- [x] Food search bar with instant query filtering
- [x] 6-category quick-access shortcuts (Breakfast, Lunch, Hot Meals, Snacks, Drinks, Desserts)
- [x] Interactive promotional banner (Kerala Meals combo special)
- [x] Hot Meals section (swipeable on mobile, multi-column on desktop)
- [x] Popular food items section
- [x] Menu preview with "View Full Menu" CTA

### D. Complete Menu Page (`/menu`)
- [x] Full catalog listing through `menuService`
- [x] Live search and Category filter pills with URL sync (`?category=`)
- [x] Responsive FoodGrid: 2 columns on mobile, 3–5 columns on tablet/desktop
- [x] Food cards with realistic food imagery, status badges, price in ₹, and Add to Cart feedback

### E. Shopping Cart Page (`/cart`)
- [x] Responsive 2-column desktop layout (items list + sticky order summary)
- [x] Item quantity increment / decrement / remove controls
- [x] Clear cart with confirmation
- [x] Bill breakdown: subtotal, 5% service charge, grand total
- [x] Empty cart state with "Browse Menu" CTA
- [x] Proceed to Checkout navigation

### F. Checkout & Ordering Experience (`/checkout`, `/orders`, `/orders/[id]`)
- [x] Order review and special kitchen instructions input
- [x] Pay at Counter notification (Cash and UPI accepted)
- [x] Order confirmation screen with estimated time & 10s auto-redirect
- [x] Orders history listing (`/orders`)
- [x] Single order status tracking (`/orders/[id]`) with live status badge and cancellation

### G. User Profile (`/profile`)
- [x] Role-aware profile card: shows Department only for Student/Faculty; Teacher ID only for Faculty
- [x] Edit profile modal (name, phone, department)
- [x] My Orders link & Sign Out (redirects to `/`)

---

## 3. User Roles & Permissions

| Feature | Student | Faculty | Guest |
|---|---|---|---|
| Browse landing page & menu | ✅ | ✅ | ✅ |
| Add to cart & place orders | ✅ | ✅ | ✅ |
| Track order history | ✅ | ✅ | ✅ |
| Department field | Optional | Optional | ❌ (Hidden) |
| Teacher ID field | ❌ (Hidden) | ✅ **Mandatory** | ❌ (Hidden) |
| Profile & settings | ✅ | ✅ | ✅ |

---

## 4. Authentication Workflows

### A. Email + Password Login
```
Landing Page (/) → Sign In (/login) → Enter Credentials → Home (/home)
```

### B. OTP Login
```
/login (Email OTP tab) → Enter email → Send OTP → Enter 6-digit OTP → Home (/home)
```

### C. Google OAuth Flow
```
/login or /signup → Continue with Google →
  If Faculty: Teacher ID prompt step → Home (/home)
  If Student/Guest: Immediate authentication → Home (/home)
```

### D. Registration & Email Verification
```
/signup → Select Role (Student/Faculty/Guest) → Fill fields → Submit
→ OTP Screen (/verify-otp) → Enter code → Success screen (10s countdown) → Home (/home)
```

### E. Forgot & Reset Password
```
/login → Forgot Password (/forgot-password) → Enter Email → Submit
→ Reset Password (/reset-password) → Enter OTP + New Password → Success → Login (/login)
```

---

## 5. Pages & Responsibilities

| Route | File Path | Access | Responsibility |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Public | **Public Landing Page** — College branding, welcome message, Sign In & Create Account CTAs, IEDC CEV footer |
| `/login` | `src/app/login/page.tsx` | Public | **Sign In** — Email/Password & Email OTP tabs, Google Sign-in, demo credentials |
| `/signup` | `src/app/signup/page.tsx` | Public | **Registration** — Student, Faculty (Teacher ID), Guest modes, Google OAuth |
| `/verify-otp` | `src/app/verify-otp/page.tsx` | Public | **OTP Verification** — 6-digit code input, resend countdown, 10s redirect to `/home` |
| `/forgot-password` | `src/app/forgot-password/page.tsx` | Public | **Password Recovery** — Email submission for reset code |
| `/reset-password` | `src/app/reset-password/page.tsx` | Public | **Password Reset** — Code validation and new password entry |
| `/home` | `src/app/home/page.tsx` | Authenticated | **Main Cafeteria Dashboard** — Search, categories, hot meals, popular items, menu preview |
| `/menu` | `src/app/menu/page.tsx` | Authenticated | **Full Catalog Menu** — Search & category filter pills, multi-column food grid |
| `/cart` | `src/app/cart/page.tsx` | Authenticated | **Shopping Cart** — 2-column desktop layout, quantity controls, sticky summary |
| `/checkout` | `src/app/checkout/page.tsx` | Authenticated | **Order Confirmation** — Special instructions, bill review, counter payment notice |
| `/orders` | `src/app/orders/page.tsx` | Authenticated | **Order History** — Responsive grid of past and active cafeteria orders |
| `/orders/[id]` | `src/app/orders/[id]/page.tsx` | Authenticated | **Order Status & Receipt** — Live status tracking, wait time, cancellation |
| `/profile` | `src/app/profile/page.tsx` | Authenticated | **User Profile** — Role-aware user card, profile editing modal, logout |

---

## 6. UI/UX Design System & Responsive Strategy

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#F47721` | Brand orange, primary action buttons, active navigation indicators |
| `primary-hover` | `#e06310` | Button hover and active states |
| `primary-light` | `#FFF7F0` | Card surfaces, category badges, soft backgrounds |
| `white` | `#FFFFFF` | Main page background, card surfaces |
| `dark-text` | `#252525` | Headings, primary titles, body text |
| `secondary-text` | `#777777` | Captions, descriptions, inactive icons, placeholders |
| `border` | `#EEEEEE` | Card borders, dividers, inputs |
| `success` | `#269B62` | Order success, available items, verification confirmations |
| `error` | `#D94A43` | Out-of-stock badges, form errors, cancellations |

### Responsive Viewport Strategy
- **Desktop (≥ 1024px):** Full-screen professional layout. The AppShell uses a container width of `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` removing any narrow phone-like restrictions. The desktop header displays horizontal navigation links (`Home`, `Menu`, `My Orders`), cart counter pill, and user profile badge. The bottom navigation bar is hidden (`sm:hidden`). Food items render in a wide 4 to 5-column grid. Cart and Checkout use side-by-side 2-column layouts.
- **Tablet (640px – 1023px):** 3-column food grids, 6-column category shortcut chips, compact desktop header.
- **Mobile (< 640px):** Strictly mobile-first. 2-column food grid (`grid-cols-2`), touch targets ≥ 44px, fixed bottom navigation bar (64px height) with active orange indicator, sticky header, and zero horizontal scroll.

---

## 7. Technology Stack & Architecture

| Layer | Technology | Details |
|---|---|---|
| Framework | Next.js 16 (App Router) | Server and Client components with Turbopack |
| UI Library | React 19 | Hooks, Context, Suspense-safe client hydration |
| Language | TypeScript 5 | Strict type definitions for auth, menu, cart, orders |
| Styling | Tailwind CSS v4 | CSS `@theme` variables in `globals.css` |
| Icons | Lucide React | Clean, lightweight icon suite |
| State | React Context API + Reducers | `AuthContext` and `CartContext` with `localStorage` persistence |
| Data Layer | `menuService.ts` | Centralized catalog access service, decoupled from UI |

---

## 8. Folder & File Structure

```
cafe-ui/
├── plan.md                          ← Central project truth document
├── package.json
├── tsconfig.json
├── next.config.ts
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx               ← Root layout (fonts, providers, viewport)
    │   ├── globals.css              ← Tailwind directives & theme tokens
    │   ├── page.tsx                 ← PUBLIC LANDING PAGE (CEV Cafeteria + IEDC CEV)
    │   ├── home/
    │   │   └── page.tsx             ← MAIN AUTHENTICATED CAFETERIA DASHBOARD
    │   ├── login/
    │   │   └── page.tsx             ← Sign in page (Password + OTP)
    │   ├── signup/
    │   │   └── page.tsx             ← Registration (Student / Faculty / Guest)
    │   ├── verify-otp/
    │   │   └── page.tsx             ← OTP confirmation with 10s countdown
    │   ├── forgot-password/
    │   │   └── page.tsx             ← Password reset request
    │   ├── reset-password/
    │   │   └── page.tsx             ← Password update
    │   ├── menu/
    │   │   └── page.tsx             ← Full food menu with search & category filters
    │   ├── cart/
    │   │   └── page.tsx             ← Shopping cart (desktop 2-column layout)
    │   ├── checkout/
    │   │   └── page.tsx             ← Order checkout & confirmation
    │   ├── orders/
    │   │   ├── page.tsx             ← Order history
    │   │   └── [id]/
    │   │       └── page.tsx         ← Individual order receipt & live status
    │   ├── profile/
    │   │   └── page.tsx             ← User profile & edit modal
    │   └── auth/                    ← Backward-compatible aliases for auth routes
    │       ├── login/page.tsx
    │       ├── signup/page.tsx
    │       ├── verify-otp/page.tsx
    │       ├── forgot-password/page.tsx
    │       └── reset-password/page.tsx
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx           ← Responsive header with desktop nav & Suspense
    │   │   ├── BottomNav.tsx        ← Mobile fixed 4-tab bottom navigation
    │   │   ├── Footer.tsx           ← Universal footer with IEDC CEV attribution & bottom nav offset
    │   │   └── AppShell.tsx         ← Full-width max-w-7xl responsive wrapper with universal Footer
    │   ├── auth/
    │   │   ├── RoleSelector.tsx     ← Student / Faculty / Guest selector
    │   │   └── GoogleAuthButton.tsx ← Branded Google OAuth button
    │   ├── menu/
    │   │   ├── CategoryIcon.tsx     ← Lucide icon renderer for menu categories
    │   │   ├── FoodCard.tsx         ← Food card with image, price, quantity controls
    │   │   ├── FoodGrid.tsx         ← Responsive 2-to-5 column food grid
    │   │   ├── CategoryFilter.tsx   ← Horizontal scrollable category pill chips
    │   │   ├── SearchBar.tsx        ← Fast search input with clear trigger
    │   │   └── MenuSection.tsx      ← Section container with title and action link
    │   ├── home/
    │   │   ├── PromoBanner.tsx      ← Today's cafeteria special banner
    │   │   ├── CategoryShortcuts.tsx← 3-to-6 column category quick links
    │   │   └── HotMealsSection.tsx  ← Featured hot meals section
    │   ├── cart/
    │   │   ├── CartItem.tsx         ← Cart item row with quantity stepper
    │   │   ├── CartSummary.tsx      ← Bill breakdown with 5% service charge
    │   │   └── EmptyCart.tsx        ← Empty cart illustration and menu CTA
    │   ├── profile/
    │   │   ├── TakeawayQRPass.tsx   ← Display & save takeaway pickup QR pass as high-res PNG image
    │   │   ├── ProfileHeader.tsx    ← Avatar, name, and role badge
    │   │   └── ProfileMenu.tsx      ← Settings & navigation options
    │   ├── orders/
    │   │   ├── ReceiptPrinter.tsx   ← Animated POS thermal receipt printer with takeaway QR
    │   │   ├── OrderCard.tsx        ← Order summary card for history list
    │   │   └── OrderStatusBadge.tsx ← Color-coded status badge
    │   └── ui/
    │       ├── Button.tsx           ← Button variants (primary, outline, danger)
    │       ├── Input.tsx            ← Form input with icon and error display
    │       ├── Badge.tsx            ← Tag and status badge
    │       ├── Spinner.tsx          ← Loading spinner
    │       ├── Modal.tsx            ← Accessible dialog overlay
    │       └── Toast.tsx            ← Notification toast manager
    ├── context/
    │   ├── AuthContext.tsx          ← User login, role, and persistent auth state
    │   └── CartContext.tsx          ← Item selection, quantity, totals state
    ├── hooks/
    │   ├── useAuth.ts               ← Auth context hook
    │   └── useCart.ts               ← Cart context hook
    └── lib/
        ├── data/
        │   ├── categories.ts        ← Initial categories definition
        │   ├── menuItems.ts         ← Initial catalog of 28 cafeteria items
        │   └── mockOrders.ts        ← Initial mock order records
        ├── services/
        │   ├── authService.ts       ← Authentication API simulator
        │   ├── orderService.ts      ← Order placement API simulator
        │   └── menuService.ts       ← CENTRALIZED CATALOG ACCESS (Future Admin Ready)
        ├── types/
        │   ├── auth.ts              ← User, UserRole, credentials types
        │   ├── menu.ts              ← MenuItem, Category, CategoryId types
        │   ├── cart.ts              ← CartItem, CartState, CartAction types
        │   └── order.ts             ← Order, OrderStatus types
        └── utils/
            ├── formatCurrency.ts    ← ₹ currency formatter
            └── validators.ts        ← Form validation utilities
```

---

## 9. Component Hierarchy

```
RootLayout (layout.tsx)
└── AuthProvider
    └── CartProvider
        └── ToastProvider
            ├── Route: / (Landing Page)
            │   ├── Header (Public Branding)
            │   ├── Hero & Welcome Section
            │   ├── Campus Dining Highlights
            │   └── Footer ("Designed and Developed by IEDC CEV")
            │
            ├── Route: /login, /signup, etc.
            │   └── Auth Form + RoleSelector + Footer ("Designed and Developed by IEDC CEV")
            │
            └── Routes: /home, /menu, /cart, /checkout, /orders, /profile
                └── AppShell (max-w-7xl, pt-16, pb-12 sm / pb-[80px] mobile)
                    ├── Header (with Suspense: Logo, Desktop Nav, Cart Counter, Avatar)
                    ├── <Page Content>
                    │   ├── HomePage: PromoBanner, CategoryShortcuts, HotMeals, Popular, Preview
                    │   ├── MenuPage: SearchBar, CategoryFilter, FoodGrid (2-5 cols)
                    │   ├── CartPage: 2-column layout (Items List + Sticky CartSummary)
                    │   ├── CheckoutPage: 2-column layout (Items + Billing + Confirm)
                    │   ├── OrdersPage: Responsive 1-to-3 column order cards
                    │   └── ProfilePage: Role-aware profile card + Edit modal
                    └── BottomNav (with Suspense: Mobile fixed 4 tabs, hidden on desktop)
```

---

## 10. Routing Structure & User Flow

```
PUBLIC PAGES:
  /                  → Landing Page (College of Engineering Vadakara cafeteria welcome)
  /login             → Sign In (Email/Password & Email OTP tabs, Google)
  /signup            → Register (Student, Faculty with Teacher ID, Guest)
  /verify-otp        → OTP verification (10-second redirect to /home)
  /forgot-password   → Password reset request
  /reset-password    → Password update

AUTHENTICATED CAFETERIA APPLICATION:
  /home              → Main Food Ordering Dashboard
  /menu              → Complete Food Menu
  /cart              → Shopping Cart
  /checkout          → Order Checkout & Confirmation
  /orders            → Order History
  /orders/[id]       → Individual Order Receipt & Status
  /profile           → User Profile & Settings
```

**Access & Redirect Rules:**
1. Visitors landing on `/` see the welcome page and choose to Sign In or Create an Account.
2. Upon successful authentication or OTP verification, users are routed to `/home`.
3. If an unauthenticated user navigates directly to `/profile` or `/orders`, they are prompted to sign in.
4. When a user logs out from `/profile`, their session is cleared and they are safely redirected to `/` (Landing Page).

---

## 11. State Management

- **`AuthContext` (`src/context/AuthContext.tsx`):** Tracks `user` object (`id`, `name`, `email`, `role`, `department`, `teacherId`, `phone`), `isAuthenticated`, and `isLoading`. State changes synchronize with `localStorage['cafe-ui:user']`.
- **`CartContext` (`src/context/CartContext.tsx`):** Tracks item array, item quantities, total item count, and subtotal. Dispatches actions: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QTY`, `CLEAR_CART`. Synchronizes with `localStorage['cafe-ui:cart']`.
- **`ToastContext` (`src/components/ui/Toast.tsx`):** Provides instant feedback for actions like adding items to cart, updating profile, and order placement.

---

## 12. Future Admin Panel Architecture (FUTURE / NOT IMPLEMENTED)

> [!NOTE]
> **Status:** Architecture Designed & Prepared. Implementation is deferred to a future development phase. No mock admin buttons or fake admin routes are exposed to users in this version.

### Key Architectural Isolation
To prevent future rewrites when an Admin Panel is built, food catalog management has been completely decoupled from the UI:
1. **Centralized Service (`src/lib/services/menuService.ts`):** All components read menu data exclusively via `menuService`. No food card or homepage section imports raw static JSON directly.
2. **Standardized Schema (`src/lib/types/menu.ts`):** Food items follow a consistent TypeScript interface:
   ```typescript
   export interface MenuItem {
     id: string;
     name: string;
     description: string;
     price: number;
     category: CategoryId;
     image: string;
     available: boolean;
     popular?: boolean;
     hot?: boolean;
     tags?: string[];
   }
   ```
3. **Future Admin Operations Interface:** The `menuService` defines and exports the necessary method signatures ready to be plugged into backend API endpoints:
   - `addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem>` — Adding dishes.
   - `updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem>` — Updating price, title, image, description.
   - `updateItemAvailability(id: string, available: boolean): Promise<MenuItem>` — Toggling in-stock / sold-out status in real-time.
   - `deleteMenuItem(id: string): Promise<boolean>` — Removing items from the catalog.
   - `getDailySpecials(): Promise<MenuItem[]>` — Configuring daily featured specials.
4. **Zero UI Disruption:** When backend admin endpoints (`/api/admin/...`) become active, only `menuService.ts` will be updated to make HTTP fetch calls. Zero changes will be required in `FoodCard`, `FoodGrid`, `HomePage`, or `MenuPage`.

---

## 13. Validation & Error Handling

- **Email Validation:** RFC-compliant regex verification.
- **Password Validation:** Enforces minimum 8 characters with at least 1 numeric digit.
- **Role Verification:**
  - Faculty members **must** provide a Teacher ID.
  - Guests are not asked for a Department.
- **OTP Validation:** Restricts input to 6 numeric digits with clear expired/invalid messages. Universal demo code `123456` enabled for demonstration.
- **Prerender / Hydration Safety:** Suspense boundaries configured around all runtime dynamic hooks (`usePathname()`, `useSearchParams()`, `useParams()`), ensuring Next.js 16 build safety.

---

## 14. Responsive Design Strategy

| Screen Size | Food Grid | Navigation | Layout Container | Cart & Checkout |
|---|---|---|---|---|
| **Mobile (< 640px)** | 2 Columns | Fixed Bottom Nav (64px) | `px-4` compact | Stacked vertically |
| **Tablet (640–1023px)** | 3 Columns | Header actions | `px-6` medium | Stacked with wider summary |
| **Desktop (≥ 1024px)** | 4 to 5 Columns | Top Header Nav links | `max-w-7xl px-8` | 2-Column (2/3 items + 1/3 sticky bill) |

---

## 15. Implementation Roadmap

### Phase 1: Project Setup & Documentation ✅
- [x] TASK-001: Examine existing project
- [x] TASK-002: Create Next.js 16 app with TypeScript + Tailwind v4
- [x] TASK-003: Create plan.md

### Phase 2: Design System & Shared Components ✅
- [x] TASK-004: Configure Tailwind v4 with @theme custom colours in globals.css
- [x] TASK-005: Install Lucide React (v1.70)
- [x] TASK-006: Create UI primitives: Button, Input, Badge, Spinner, Toast, Modal
- [x] TASK-007: Create AppShell, Header, BottomNav
- [x] TASK-008: Create global styles with scrollbar-hide, page-content, etc.

### Phase 3: Authentication & Registration ✅
- [x] TASK-009: TypeScript types (auth.ts, menu.ts, cart.ts, order.ts)
- [x] TASK-010: AuthContext with useReducer + localStorage persistence
- [x] TASK-011: authService (mock): login, sendOtp, verifyOtp, register, googleSignIn
- [x] TASK-012: Login page — email/password + OTP tabs, Google button, demo credentials
- [x] TASK-013: Sign-up page — role selector (Student/Faculty/Guest), role-specific fields
- [x] TASK-014: OTP verification page — 10s countdown redirect on success
- [x] TASK-015: Forgot password page — email input → OTP sent feedback
- [x] TASK-016: Reset password page — OTP verify step → new password → success

### Phase 4: Home Page ✅
- [x] TASK-017: Mock menu data (28 items across 7 categories)
- [x] TASK-018: CartContext with useReducer + localStorage persistence
- [x] TASK-019: Home page layout (greeting, promo banner, shortcuts, sections)
- [x] TASK-020: SearchBar + CategoryFilter (horizontal scroll, pills)
- [x] TASK-021: FoodCard (image, name, price, add/qty controls, unavailable state)
- [x] TASK-022: HotMealsSection (horizontal scroll)
- [x] TASK-023: MenuSection with View More button

### Phase 5: Complete Menu ✅
- [x] TASK-024: Menu page with live search + category filter
- [x] TASK-025: Category filter integrated with URL params (category=)
- [x] TASK-026: Full food grid with item count + available count

### Phase 6: Cart Functionality ✅
- [x] TASK-027: CartItem component with qty controls and remove
- [x] TASK-028: CartSummary with 5% service charge breakdown
- [x] TASK-029: Cart page with clear cart, empty state, checkout CTA

### Phase 7: Profile ✅
- [x] TASK-030: Profile page with role-aware field display
- [x] TASK-031: Edit profile modal (name, phone, department)

### Phase 8: Ordering Experience ✅
- [x] TASK-032: Checkout page with order review + special instructions
- [x] TASK-033: Order confirmation screen (10s redirect countdown)
- [x] TASK-034: Order history page with order cards
- [x] TASK-035: Order detail page — status badge, cancel, bill breakdown

### Phase 9: Responsive Optimization & Desktop Width Fix ✅
- [x] TASK-036: Re-architect AppShell to full-width `max-w-7xl` container
- [x] TASK-037: Expand FoodGrid to multi-column desktop grid (3–5 columns)
- [x] TASK-038: Redesign Cart and Checkout with 2-column desktop layouts
- [x] TASK-039: Header expanded with desktop navigation links (Home, Menu, Orders)

### Phase 10: Dedicated Landing Page & Attribution ✅
- [x] TASK-040: Create dedicated public landing page at `/`
- [x] TASK-041: Add official "CAFETERIA — College of Engineering Vadakara" identity
- [x] TASK-042: Add clear "Sign In to Order" and "Create Account" action buttons
- [x] TASK-043: Implement clean sticky footer with exact attribution: `Designed and Developed by IEDC CEV`
- [x] TASK-044: Move main food ordering dashboard to `/home`

### Phase 11: Future-Admin Architecture & Centralized Catalog Service ✅
- [x] TASK-045: Create `src/lib/services/menuService.ts` for centralized catalog access
- [x] TASK-046: Decouple food components (`FoodGrid`, `HotMealsSection`, `MenuPage`, `HomePage`) from raw JSON
- [x] TASK-047: Define future admin methods (`addMenuItem`, `updateMenuItem`, `updateItemAvailability`, `deleteMenuItem`)
- [x] TASK-048: Document future admin panel architecture in plan.md (FUTURE / NOT IMPLEMENTED)

### Phase 12: Route Re-organization & Quality Verification ✅
- [x] TASK-049: Canonical top-level routes (`/`, `/login`, `/signup`, `/verify-otp`, `/forgot-password`, `/reset-password`, `/home`, `/menu`, `/cart`, `/checkout`, `/orders`, `/profile`)
- [x] TASK-050: Retain `/auth/*` as aliases for backward compatibility
- [x] TASK-051: Production build verification — 21 static/prerendered routes, 0 errors
- [x] TASK-052: Verified exact string `Designed and Developed by IEDC CEV` in landing page HTML

### Phase 13: Landing Page UI/UX Refinement ✅
- [x] TASK-053: Institutional header refinement (consistent height, logo on left, College subtitle directly below, Sign In on right)
- [x] TASK-054: Balanced two-column desktop hero layout eliminating dead white space
- [x] TASK-055: Authentic food visual showcase on right side of hero (Kerala Meals combo card, live counter status badge, wait time, Masala Dosa accent)
- [x] TASK-056: Distinctive "Create Account" glazed glowing orange CTA button (`.btn-glazed-orange` with surface gloss, soft glow, hover sheen, accessible focus ring, prefers-reduced-motion respected)
- [x] TASK-057: Secondary quieter "Sign In" button with clean border and active feedback
- [x] TASK-058: Refined three feature cards in a balanced desktop row with consistent height, custom icon containers, and warm backgrounds
- [x] TASK-059: Verified mobile-responsive stacked view with accessible touch targets and zero overflow

### Phase 14: Universal Footer Integration Across All Pages ✅
- [x] TASK-060: Created reusable standalone `Footer.tsx` component with exact attribution `Designed and Developed by IEDC CEV`
- [x] TASK-061: Integrated `Footer` into `AppShell.tsx` with mobile offset `pb-24` ensuring fixed bottom nav never overlaps footer content
- [x] TASK-062: Integrated `Footer` across all public and authentication pages (`/`, `/login`, `/signup`, `/verify-otp`, `/forgot-password`, `/reset-password`)
- [x] TASK-063: Verified footer renders with HTTP 200 on every single route in both desktop and mobile modes
- [x] TASK-064: Resolved duplicate footer in `AppShell.tsx` ensuring exactly one footer instance across all dashboard and app pages

### Phase 15: Complete Emoji Removal & Lucide Icon Integration ✅
- [x] TASK-065: Scanned and identified all emojis and unicode symbols across the entire application codebase
- [x] TASK-066: Created `src/components/menu/CategoryIcon.tsx` to map category IDs (`all`, `breakfast`, `lunch`, `hot-meals`, `snacks`, `drinks`, `desserts`) to Lucide React icons (`Utensils`, `Sun`, `UtensilsCrossed`, `Flame`, `Sandwich`, `CupSoda`, `CakeSlice`)
- [x] TASK-067: Updated `CategoryShortcuts.tsx` and `CategoryFilter.tsx` to render professional Lucide icons
- [x] TASK-068: Replaced emojis in `FoodCard.tsx` (`Flame` for Hot, `Star` for Popular, `Check` for Added)
- [x] TASK-069: Replaced emojis in `RoleSelector.tsx` and `/login` (`GraduationCap` for Student, `BookOpen` for Faculty, `Users` for Guest)
- [x] TASK-070: Replaced emojis in landing page (`GraduationCap`, `BookOpen`, `Users`, `Flame`)
- [x] TASK-071: Replaced emojis and unicode symbols in `Input.tsx` (`AlertCircle`), `SearchBar.tsx` (`X`), `FoodGrid.tsx` (`Search`), `CartSummary.tsx` (`Info`), checkout & orders (`CreditCard`, `CheckCircle2`)
- [x] TASK-072: Executed automated regex verification confirming 0 emojis remain in `src/`
- [x] TASK-073: Verified production build (`npm run build`) succeeds with 0 TypeScript/Turbopack errors across 21 routes

### Phase 16: Takeaway Receipt Printer Machine & QR Code Animation ✅
- [x] TASK-074: Installed `motion` library for smooth mechanical stepped paper feeding
- [x] TASK-075: Implemented `src/components/orders/ReceiptPrinter.tsx` adapted to the orange & dark-slate POS cafeteria aesthetic
- [x] TASK-076: Integrated serrated receipt tooth paper cut (`clipPath`), takeaway pickup QR code, token identifier, items breakdown, and total billed amount
- [x] TASK-077: Integrated `ReceiptPrinterAnimation` into checkout confirmation (`src/app/checkout/page.tsx`) triggering automatically after order placement
- [x] TASK-078: Integrated permanent takeaway QR code pass into order tracking sidebar (`src/app/orders/[id]/page.tsx`)
- [x] TASK-079: Verified production build (`npm run build`) with 0 errors across 21 routes

### Phase 17: User Profile Takeaway QR Code Display & Save Feature ✅
- [x] TASK-080: Installed `qrcode.react` for scannable high-resolution QR rendering
- [x] TASK-081: Created `src/components/profile/TakeawayQRPass.tsx` allowing students/faculty to view, switch between, and manage takeaway passes
- [x] TASK-082: Added composite canvas generator allowing users to "Save QR Pass (PNG)" directly to their device downloads/gallery with offline reliability
- [x] TASK-083: Added one-click token clipboard copying and printable receipt trigger
- [x] TASK-084: Integrated `TakeawayQRPass` into `src/app/profile/page.tsx` with dynamic order fetching
- [x] TASK-085: Verified clean production build with 21/21 routes passing and 0 errors

### Phase 18: Complete Visual Identity Audit & Mobile-First UX Optimization ✅
- [x] TASK-086 [P0]: Addressed sub-standard mobile touch targets across `FoodCard.tsx`, `CartItem.tsx`, `SearchBar.tsx`, `Button.tsx` (upgraded steppers to `w-8 h-8` with tap buffers meeting WCAG 2.5.5 minimum 44px guideline)
- [x] TASK-087 [P0]: Implemented persistent mobile sticky floating checkout bar on `/cart` (`sm:hidden`) displaying live totals and one-tap checkout access above the bottom navigation
- [x] TASK-088 [P0]: Implemented persistent mobile sticky floating order confirmation bar on `/checkout` (`sm:hidden`) providing instant order submission without scrolling past long item lists
- [x] TASK-089 [P1]: Enforced rigid `h-full` flex-column card architecture and normalized aspect ratios on `FoodCard.tsx` preventing ragged uneven grid rows on mobile viewports
- [x] TASK-090 [P1]: Enhanced `globals.css` design tokens, darkened secondary text token to `#666666` (5.7:1 contrast ratio), and added accessible focus rings (`focus-ring`)
- [x] TASK-091 [P1]: Added safe-area padding `env(safe-area-inset-bottom)` to `BottomNav.tsx` and sticky bars for home-indicator gesture clearance on modern smartphones
- [x] TASK-092 [P1]: Enhanced `Input.tsx` with programmatic `aria-invalid` and `aria-describedby` linking for screen readers
- [x] TASK-093 [P1]: Enhanced `CategoryFilter.tsx` with tab semantics, min 40px touch height, and smooth horizontal scrolling
- [x] TASK-094 [P2]: Added microinteraction pop animation (`animate-cart-pop`) to cart counter badges across Header and Mobile BottomNav
- [x] TASK-095 [P2]: Verified responsive layout across 320px, 360px, 375px, 390px, 412px, 430px viewports with zero horizontal overflow
- [x] TASK-096: Executed production build (`npm run build`) with 0 errors across 21 routes

### Phase 19: Online Payment (UPI) Gateway & "Pay Now" Receipt Printing Trigger ✅
- [x] TASK-097: Updated `Order` type definitions (`src/lib/types/order.ts`) with `paymentMethod: 'online_upi' | 'pay_at_counter'` and `paymentStatus: 'paid' | 'pending'`
- [x] TASK-098: Updated `orderService.placeOrder()` to support online payment methods, setting `paymentStatus: 'paid'` for instant UPI orders
- [x] TASK-099: Implemented interactive Payment Mode Selector in `src/app/checkout/page.tsx` with "Online Pay (UPI)" as the primary default and "Pay at Counter (Cash)" as secondary
- [x] TASK-100: Fixed mobile visibility of "Pay Now" buttons across `/cart` and `/checkout`: removed `hidden sm:block` restrictions so the button is always rendered inline in the document flow, elevated sticky floating bars to `z-50`, and suppressed conflicting bottom nav tabs on checkout via `<AppShell hideNav>`
- [x] TASK-101: Created responsive Online Payment Gateway modal with institutional branding ("College of Engineering Vadakara"), instant UPI app selection (Google Pay, PhonePe, Paytm, custom UPI ID), and simulated banking authorization
- [x] TASK-102: Connected payment approval directly to the Animated POS Thermal Receipt Printer (`ReceiptPrinterAnimation`), automatically stamping `PAID ONLINE (UPI)` in green `#269B62` with live itemized bill and takeaway QR code
- [x] TASK-103: Verified production build (`npm run build`) with 0 errors across all 21 routes

---

## 16. Testing Strategy

### Verification Matrix
- [x] Zero emojis or unicode symbol placeholders in any source file across `src/`
- [x] Lucide icons correctly integrated for all categories, roles, badges, indicators, and alerts
- [x] Footer with exact attribution `Designed and Developed by IEDC CEV` renders on EVERY single page (`/`, `/login`, `/signup`, `/verify-otp`, `/forgot-password`, `/reset-password`, `/home`, `/menu`, `/cart`, `/checkout`, `/orders`, `/profile`)
- [x] Dedicated landing page at `/` displays "CAFETERIA" and "College of Engineering Vadakara"
- [x] Landing page hero features balanced 2-column desktop layout with food photo showcase
- [x] "Create Account" button features glazed orange styling, glossy highlight, and hover light sheen
- [x] Desktop layout expands across full browser viewport up to `max-w-7xl`
- [x] Mobile retains 2-column food grid and fixed bottom navigation bar without obscuring footer
- [x] Desktop header displays navigation links (`Home`, `Menu`, `My Orders`) and user badge
- [x] Food catalog queries routed through `menuService.ts`
- [x] Sign In (`/login`) validates credentials and redirects to `/home`
- [x] Sign Up (`/signup`) enforces Teacher ID for Faculty and hides Department for Guests
- [x] OTP verification (`/verify-otp`) works with demo code `123456` and redirects to `/home`
- [x] Cart page operates in 2-column mode on desktop and vertical stack on mobile
- [x] Checkout places order and generates tracked order token
- [x] Profile shows correct role fields and redirects to `/` on logout
- [x] `npm run build` passes with 0 errors across 21 routes

---

## 17. Known Limitations & Pending Decisions

| Item | Status | Decision |
|---|---|---|
| Admin Panel | **FUTURE / NOT IMPLEMENTED** | Documented & architecture prepared via `menuService.ts`. Admin routes and UI deferred. |
| Backend Database | Simulated | In-memory service layers (`authService.ts`, `menuService.ts`, `orderService.ts`) with `localStorage` client persistence. |
| Google OAuth Provider | Simulated | Ready for Google Firebase/NextAuth credentials in production. |
| Payment Gateway | Out of scope | "Pay at Counter" (Cash / UPI) per college cafeteria workflow. |
| Email Delivery Service | Simulated | Development OTP `123456` enabled for evaluation. |

---

*Last Updated: Phase 18 COMPLETED — Complete Visual Identity Audit & Mobile-First UX Optimization executed. P0/P1 issues resolved (comfortable 44px touch targets on steppers and actions, persistent mobile floating checkout/order bars, rigid FoodCard grid height alignment, darkened 5.7:1 contrast tokens, safe-area inset support, and input a11y linking). Verified clean across 320px–430px viewports with 21/21 production build passing.*  
*Status: ✅ COMPLETE & READY*
