# CaféUI — College Cafeteria Food Ordering Platform
## Project Plan & Architecture Document

> **This file is the single source of truth for the entire project.**
> Read this file before every modification. Update it after every completed task.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Functional Requirements](#2-functional-requirements)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Authentication Workflows](#4-authentication-workflows)
5. [Pages & Responsibilities](#5-pages--responsibilities)
6. [UI/UX Design System](#6-uiux-design-system)
7. [Technology Stack & Architecture](#7-technology-stack--architecture)
8. [Folder & File Structure](#8-folder--file-structure)
9. [Component Hierarchy](#9-component-hierarchy)
10. [Routing Structure](#10-routing-structure)
11. [State Management](#11-state-management)
12. [Data Flow & API Integration](#12-data-flow--api-integration)
13. [Validation & Error Handling](#13-validation--error-handling)
14. [Responsive Design Strategy](#14-responsive-design-strategy)
15. [Implementation Roadmap](#15-implementation-roadmap)
16. [Testing Strategy](#16-testing-strategy)
17. [Known Limitations & Pending Decisions](#17-known-limitations--pending-decisions)

---

## 1. Project Overview

**Project Name:** CaféUI  
**Type:** College Cafeteria Food Ordering Web Application (Frontend Prototype)  
**Target Users:** Students, Faculty, Guests of a college cafeteria  
**Primary Goal:** Enable users to browse the cafeteria menu, add items to a cart, and place orders through a clean, mobile-first interface.

### Objectives
- Provide a fast, intuitive food ordering experience on mobile devices.
- Support three user types (Student, Faculty, Guest) with appropriate fields.
- Implement a complete authentication flow (Email/Password, OTP login, Google OAuth).
- Display a browsable menu with categories, search, and filtering.
- Enable cart management with quantity controls and order placement.
- Maintain a clean orange-and-white design that feels like a real product.
- Serve as a college project with professional-grade code quality and documentation.

---

## 2. Functional Requirements

### Authentication
- [x] Email + password login
- [x] One-time password (OTP) login via email
- [x] Google OAuth login/registration
- [x] Sign-up with three user modes: Student, Faculty, Guest
- [x] Email OTP verification for new registrations
- [x] Forgot password page (email input → OTP/reset link)
- [x] Reset password page (new password + confirm)
- [x] Role-preserving Google auth flow
- [x] Faculty Google auth additional step: Teacher ID collection

### Home Page
- [x] Compact header with logo and profile shortcut
- [x] Fixed bottom navigation bar (Home, Menu, Cart, Profile)
- [x] Food search bar with category filter button
- [x] Food category shortcuts (chips/pills)
- [x] Welcome message
- [x] Optional promotional banner
- [x] Hot Meals section (horizontal scroll or grid)
- [x] Popular Items section
- [x] Complete menu preview (2-col grid) + View More button

### Menu Page
- [x] Full menu listing
- [x] Search bar
- [x] Category filter (All, Breakfast, Lunch, Hot Meals, Snacks, Drinks, Desserts)
- [x] Two-column mobile grid
- [x] Food cards (image, name, price, availability, Add to Cart)
- [x] Visual feedback on Add to Cart

### Cart Page
- [x] List of selected items (image, name, price, quantity)
- [x] Quantity increment / decrement
- [x] Remove individual item
- [x] Clear entire cart
- [x] Subtotal + extra charges + grand total
- [x] Empty cart state
- [x] Proceed to Checkout button

### Profile Page
- [x] Display name, email, role, department (if applicable), Teacher ID (if faculty), phone (if provided)
- [x] Edit profile
- [x] My Orders
- [x] Account settings
- [x] Logout

### Ordering Experience
- [x] Checkout / order summary page
- [x] Order confirmation screen
- [x] Order status display
- [x] Order history list

---

## 3. User Roles & Permissions

| Feature | Student | Faculty | Guest |
|---|---|---|---|
| Browse menu | ✅ | ✅ | ✅ |
| Add to cart | ✅ | ✅ | ✅ |
| Place order | ✅ | ✅ | ✅ |
| View order history | ✅ | ✅ | ✅ |
| Department field | Optional | Optional | ❌ |
| Teacher ID field | ❌ | ✅ (Mandatory) | ❌ |
| Profile page | ✅ | ✅ | ✅ |

---

## 4. Authentication Workflows

### A. Email + Password Login
```
Login Page → Validate email & password → Redirect to Home
```

### B. OTP Login
```
Login Page (OTP tab) → Enter email → Send OTP → OTP Verification Screen → Redirect to Home
```

### C. Google OAuth Login
```
Login Page → Click Google → OAuth popup/redirect → Role selection (if new user) → Home
```

### D. Email + Password Registration (Student/Faculty/Guest)
```
Sign-Up Page → Select role → Fill fields (role-specific) → Submit
→ OTP sent to email → OTP Verification Screen → Success → Redirect to Home (~10s)
```

### E. Google Registration
```
Sign-Up Page → Select role → Click Google → OAuth → 
  If Faculty: Collect Teacher ID step → 
  OTP not required (Google verified) → Redirect to Home
```

### F. Forgot Password
```
Login Page (Forgot link) → Forgot Password Page → Enter email → Submit
→ Password reset OTP/link sent → Reset Password Page → Confirm → Login Page
```

### G. Reset Password
```
Reset Password Page → New password + Confirm → Submit → Success → Login
```

---

## 5. Pages & Responsibilities

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Home page — menu preview, search, categories |
| `/menu` | `src/app/menu/page.tsx` | Full menu page |
| `/cart` | `src/app/cart/page.tsx` | Shopping cart |
| `/profile` | `src/app/profile/page.tsx` | User profile |
| `/checkout` | `src/app/checkout/page.tsx` | Order summary & placement |
| `/orders` | `src/app/orders/page.tsx` | Order history |
| `/orders/[id]` | `src/app/orders/[id]/page.tsx` | Single order status |
| `/auth/login` | `src/app/auth/login/page.tsx` | Login page |
| `/auth/signup` | `src/app/auth/signup/page.tsx` | Sign-up page |
| `/auth/verify-otp` | `src/app/auth/verify-otp/page.tsx` | OTP verification |
| `/auth/forgot-password` | `src/app/auth/forgot-password/page.tsx` | Forgot password |
| `/auth/reset-password` | `src/app/auth/reset-password/page.tsx` | Reset password |

---

## 6. UI/UX Design System

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#F47721` | CTA buttons, active nav, highlights |
| `primary-light` | `#FFF7F0` | Card backgrounds, hover states |
| `white` | `#FFFFFF` | Page backgrounds, card surfaces |
| `dark-text` | `#252525` | Headings, body text |
| `secondary-text` | `#777777` | Captions, placeholders |
| `border` | `#EEEEEE` | Card borders, dividers |
| `success` | `#269B62` | Order success, in-stock |
| `error` | `#D94A43` | Errors, out-of-stock |

### Typography
- **Font:** System font stack (Inter via Next.js Google Fonts or system-ui)
- **Headings:** 20–24px, font-weight 700
- **Body:** 14–16px, font-weight 400
- **Captions:** 12px, font-weight 400, secondary-text

### Spacing
- Base unit: 4px (Tailwind default)
- Card padding: 12px
- Section gap: 24px
- Bottom nav height: 60px
- Header height: 56px

### Components Design Principles
- Rounded corners: `rounded-xl` (12px) for cards, `rounded-full` for pills
- Shadows: subtle `shadow-sm` only
- No glassmorphism, no heavy gradients
- Touch targets: minimum 44×44px
- Buttons: bold, solid fills, clear labels

---

## 7. Technology Stack & Architecture

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| State | React Context API + useReducer |
| Data | Mock JSON (frontend prototype) |
| Auth | Simulated auth context (mock) |
| Routing | Next.js App Router file-based routing |
| Images | next/image with placeholder URLs |

### Architecture Pattern
- **App Router** layout files for shared UI (header, bottom nav)
- **React Context** for cart state and auth state
- **Custom hooks** for reusable logic
- **Modular components** in `/components` grouped by domain
- **Mock data** in `/lib/data` — ready to be replaced by API calls
- **Service layer** in `/lib/services` — API integration stubs

---

## 8. Folder & File Structure

```
cafe-ui/
├── plan.md                          ← This document
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── public/
│   ├── logo.svg
│   └── images/
│       └── food/                    ← Food placeholder images
└── src/
    ├── app/
    │   ├── layout.tsx               ← Root layout (providers)
    │   ├── page.tsx                 ← Home page
    │   ├── globals.css              ← Global styles + Tailwind directives
    │   ├── menu/
    │   │   └── page.tsx             ← Full menu page
    │   ├── cart/
    │   │   └── page.tsx             ← Cart page
    │   ├── profile/
    │   │   └── page.tsx             ← Profile page
    │   ├── checkout/
    │   │   └── page.tsx             ← Checkout page
    │   ├── orders/
    │   │   ├── page.tsx             ← Order history
    │   │   └── [id]/
    │   │       └── page.tsx         ← Single order detail
    │   └── auth/
    │       ├── login/
    │       │   └── page.tsx         ← Login page
    │       ├── signup/
    │       │   └── page.tsx         ← Sign-up page
    │       ├── verify-otp/
    │       │   └── page.tsx         ← OTP verification
    │       ├── forgot-password/
    │       │   └── page.tsx         ← Forgot password
    │       └── reset-password/
    │           └── page.tsx         ← Reset password
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx           ← App header
    │   │   ├── BottomNav.tsx        ← Mobile fixed bottom navigation
    │   │   └── AppShell.tsx         ← Layout wrapper (header + content + bottom nav)
    │   ├── auth/
    │   │   ├── LoginForm.tsx        ← Email/password login form
    │   │   ├── OtpLoginForm.tsx     ← OTP-based login form
    │   │   ├── SignUpForm.tsx       ← Registration form (role-aware)
    │   │   ├── OtpVerification.tsx  ← OTP input + resend
    │   │   ├── RoleSelector.tsx     ← Student/Faculty/Guest tabs
    │   │   ├── GoogleAuthButton.tsx ← Google sign-in button
    │   │   ├── ForgotPasswordForm.tsx
    │   │   └── ResetPasswordForm.tsx
    │   ├── menu/
    │   │   ├── FoodCard.tsx         ← Individual food item card
    │   │   ├── FoodGrid.tsx         ← 2-column grid of food cards
    │   │   ├── CategoryFilter.tsx   ← Category pill filters
    │   │   ├── SearchBar.tsx        ← Search input
    │   │   └── MenuSection.tsx      ← Section with title + grid
    │   ├── cart/
    │   │   ├── CartItem.tsx         ← Single cart row
    │   │   ├── CartSummary.tsx      ← Subtotal + total breakdown
    │   │   └── EmptyCart.tsx        ← Empty state
    │   ├── home/
    │   │   ├── PromoBanner.tsx      ← Optional banner
    │   │   ├── CategoryShortcuts.tsx← Quick-access category chips
    │   │   └── HotMealsSection.tsx  ← Featured meals
    │   ├── profile/
    │   │   ├── ProfileHeader.tsx    ← Avatar + name + role badge
    │   │   └── ProfileMenu.tsx      ← Action list (Edit, Orders, etc.)
    │   ├── orders/
    │   │   ├── OrderCard.tsx        ← Order summary card
    │   │   └── OrderStatusBadge.tsx ← Status pill (Pending/Ready/etc.)
    │   └── ui/
    │       ├── Button.tsx           ← Reusable button variants
    │       ├── Input.tsx            ← Styled input field
    │       ├── Badge.tsx            ← Status/count badge
    │       ├── Spinner.tsx          ← Loading spinner
    │       ├── Modal.tsx            ← Generic modal overlay
    │       └── Toast.tsx            ← Toast notification
    ├── context/
    │   ├── CartContext.tsx          ← Cart state: items, add, remove, qty, clear
    │   └── AuthContext.tsx          ← Auth state: user, login, logout, role
    ├── hooks/
    │   ├── useCart.ts               ← Cart context consumer hook
    │   ├── useAuth.ts               ← Auth context consumer hook
    │   └── useLocalStorage.ts       ← Persistent local storage hook
    ├── lib/
    │   ├── data/
    │   │   ├── menuItems.ts         ← Mock menu data array
    │   │   ├── categories.ts        ← Category list
    │   │   └── mockOrders.ts        ← Mock order history data
    │   ├── services/
    │   │   ├── authService.ts       ← Auth API stubs (mock)
    │   │   └── orderService.ts      ← Order API stubs (mock)
    │   ├── types/
    │   │   ├── auth.ts              ← Auth types (User, Role, LoginPayload…)
    │   │   ├── menu.ts              ← MenuItem, Category types
    │   │   ├── cart.ts              ← CartItem, CartState types
    │   │   └── order.ts             ← Order, OrderStatus types
    │   └── utils/
    │       ├── formatCurrency.ts    ← ₹ price formatter
    │       └── validators.ts        ← Email, password, OTP validators
    └── styles/
        └── (additional CSS modules if needed)
```

---

## 9. Component Hierarchy

```
RootLayout (layout.tsx)
└── AuthProvider
    └── CartProvider
        └── AppShell
            ├── Header
            ├── <Page Content>
            │   ├── HomePage
            │   │   ├── PromoBanner
            │   │   ├── SearchBar + CategoryFilter
            │   │   ├── CategoryShortcuts
            │   │   ├── HotMealsSection → FoodCard[]
            │   │   └── MenuSection → FoodGrid → FoodCard[]
            │   ├── MenuPage
            │   │   ├── SearchBar
            │   │   ├── CategoryFilter
            │   │   └── FoodGrid → FoodCard[]
            │   ├── CartPage
            │   │   ├── CartItem[]
            │   │   ├── CartSummary
            │   │   └── EmptyCart
            │   └── ProfilePage
            │       ├── ProfileHeader
            │       └── ProfileMenu
            └── BottomNav
```

---

## 10. Routing Structure

```
/                       → Home (requires auth)
/menu                   → Full menu (requires auth)
/cart                   → Cart (requires auth)
/profile                → Profile (requires auth)
/checkout               → Checkout (requires auth)
/orders                 → Order history (requires auth)
/orders/[id]            → Order detail (requires auth)
/auth/login             → Login (public)
/auth/signup            → Sign-up (public)
/auth/verify-otp        → OTP verification (public, params via URL/state)
/auth/forgot-password   → Forgot password (public)
/auth/reset-password    → Reset password (public)
```

---

## 11. State Management

### Cart State (CartContext)
```typescript
interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: string }     // id
  | { type: 'UPDATE_QTY'; payload: { id: string; qty: number } }
  | { type: 'CLEAR_CART' };
```

### Auth State (AuthContext)
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

Both contexts persist to `localStorage` via `useLocalStorage` hook.

---

## 12. Data Flow & API Integration

### Current State (Frontend Prototype)
- All data served from `/lib/data/` mock files.
- Auth operations simulated in `/lib/services/authService.ts`.
- Order operations simulated in `/lib/services/orderService.ts`.

### Integration Points (Future Backend)
| Integration Point | File | Method |
|---|---|---|
| Login | `authService.ts` → `POST /api/auth/login` |
| Register | `authService.ts` → `POST /api/auth/register` |
| Send OTP | `authService.ts` → `POST /api/auth/send-otp` |
| Verify OTP | `authService.ts` → `POST /api/auth/verify-otp` |
| Get Menu | `menuService.ts` → `GET /api/menu` |
| Place Order | `orderService.ts` → `POST /api/orders` |
| Get Orders | `orderService.ts` → `GET /api/orders` |

---

## 13. Validation & Error Handling

### Form Validation
- **Email:** RFC-compliant regex check
- **Password:** Minimum 8 characters, at least one number
- **OTP:** 6-digit numeric only
- **Teacher ID:** Non-empty string (Faculty only)
- **Name:** Minimum 2 characters

### Error States
- Inline field-level error messages (red text below input)
- Toast notifications for async operation results
- Empty state components for empty lists
- Loading spinners for async operations

---

## 14. Responsive Design Strategy

| Breakpoint | Layout |
|---|---|
| `< 640px` (Mobile) | Single column; 2-col food grid; fixed bottom nav |
| `640px–1024px` (Tablet) | Wider single column; 3-col food grid |
| `> 1024px` (Desktop) | Max-width container centered; bottom nav hidden; sidebar nav (future) |

### Mobile-First Rules
- Design for 375px width first
- Touch targets ≥ 44px
- Bottom nav fixed at bottom (z-50)
- No horizontal scroll ever
- Forms: full-width inputs, large tap areas

---

## 15. Implementation Roadmap

### Phase 1: Project Setup & Documentation ✅
- [x] TASK-001: Examine existing project
- [x] TASK-002: Create Next.js app
- [x] TASK-003: Create plan.md

### Phase 2: Design System & Shared Components 🔄
- [ ] TASK-004: Configure Tailwind with custom colours
- [ ] TASK-005: Install Lucide React
- [ ] TASK-006: Create UI primitives (Button, Input, Badge, Spinner, Toast)
- [ ] TASK-007: Create AppShell, Header, BottomNav
- [ ] TASK-008: Create global styles

### Phase 3: Authentication & Registration
- [ ] TASK-009: Create TypeScript types (auth, menu, cart, order)
- [ ] TASK-010: Create AuthContext
- [ ] TASK-011: Create auth service (mock)
- [ ] TASK-012: Login page (email/password + OTP tabs)
- [ ] TASK-013: Sign-up page (role selector + forms)
- [ ] TASK-014: OTP verification page
- [ ] TASK-015: Forgot password page
- [ ] TASK-016: Reset password page

### Phase 4: Home Page
- [ ] TASK-017: Create mock menu data
- [ ] TASK-018: Create CartContext
- [ ] TASK-019: Home page layout
- [ ] TASK-020: SearchBar + CategoryFilter components
- [ ] TASK-021: FoodCard component
- [ ] TASK-022: HotMealsSection
- [ ] TASK-023: MenuSection with View More

### Phase 5: Complete Menu
- [ ] TASK-024: Menu page layout
- [ ] TASK-025: Category filter + search integration
- [ ] TASK-026: Full food grid

### Phase 6: Cart Functionality
- [ ] TASK-027: CartItem component
- [ ] TASK-028: CartSummary component
- [ ] TASK-029: Cart page

### Phase 7: Profile
- [ ] TASK-030: Profile page
- [ ] TASK-031: Edit profile form

### Phase 8: Ordering Experience
- [ ] TASK-032: Checkout page
- [ ] TASK-033: Order confirmation
- [ ] TASK-034: Order history page
- [ ] TASK-035: Order detail page

### Phase 9: Responsive Optimisation
- [ ] TASK-036: Mobile layout testing
- [ ] TASK-037: Desktop adaptation

### Phase 10: Testing & Final Refinement
- [ ] TASK-038: Full route testing
- [ ] TASK-039: Console error cleanup
- [ ] TASK-040: Accessibility pass

---

## 16. Testing Strategy

### Manual Testing Checklist
- [ ] All routes load without errors
- [ ] Bottom nav navigation works
- [ ] Login form validates inputs
- [ ] Registration form validates role-specific fields
- [ ] OTP UI shows countdown and resend
- [ ] Google auth button visible and styled
- [ ] Search filters menu items
- [ ] Category filters work
- [ ] Add to Cart updates cart count in nav
- [ ] Cart quantities can be changed
- [ ] Items can be removed from cart
- [ ] Empty cart shows empty state
- [ ] Checkout shows order summary
- [ ] Profile shows correct role fields
- [ ] 375px mobile: no horizontal scroll
- [ ] Desktop: layout adapts properly

---

## 17. Known Limitations & Pending Decisions

| Item | Status | Decision |
|---|---|---|
| Backend API | Not implemented | Mock data only; integration points documented |
| Google OAuth | Simulated | Requires real Firebase/NextAuth config for production |
| Payment integration | Out of scope | Not implemented; noted in checkout as "Pay at Counter" |
| Phone number login | Deferred | Noted as future feature |
| Real food images | Placeholder | Using picsum.photos or similar placeholder service |
| Email OTP delivery | Simulated | Real integration needs SMTP/SendGrid/etc. |
| Teacher ID verification | Not verified | Treated as self-declared; verification deferred |
| Admin panel | Out of scope | Not included in this phase |

---

*Last Updated: Phase 1 — Project Setup*  
*Status: plan.md created, Next.js scaffolding in progress*
