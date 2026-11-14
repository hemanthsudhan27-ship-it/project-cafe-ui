# 🍽️ Cafe UI — Project Directory & File Structure

> **Overview**: Comprehensive map of the **Cafe UI** Next.js web application codebase, showing directory hierarchies, core modules, components, utilities, and application routes.

---

## 🌳 Interactive File Tree

```text
cafe-ui/
├── 📁 public/                                # Static assets & icons
│   ├── 📄 favicon.svg
│   ├── 📄 file.svg
│   ├── 📄 globe.svg
│   ├── 📄 logo.svg                          # Official Cafeteria logo
│   ├── 📄 next.svg
│   ├── 📄 student-egg-puff.png              # Landing hero student illustration
│   ├── 📄 vercel.svg
│   └── 📄 window.svg
│
├── 📁 src/
│   ├── 📁 app/                              # Next.js App Router pages & routes
│   │   ├── 📁 auth/                         # Dedicated nested auth routes
│   │   │   ├── 📁 forgot-password/
│   │   │   │   └── 📄 page.tsx              # Password reset request route
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx              # Nested sign-in route
│   │   │   ├── 📁 reset-password/
│   │   │   │   └── 📄 page.tsx              # Nested reset password confirmation
│   │   │   ├── 📁 signup/
│   │   │   │   └── 📄 page.tsx              # Nested account registration route
│   │   │   └── 📁 verify-otp/
│   │   │       └── 📄 page.tsx              # Nested OTP verification route
│   │   ├── 📁 cart/
│   │   │   └── 📄 page.tsx                  # Shopping cart view & item review
│   │   ├── 📁 checkout/
│   │   │   └── 📄 page.tsx                  # Checkout & payment processing
│   │   ├── 📁 forgot-password/
│   │   │   └── 📄 page.tsx                  # Direct forgot-password route
│   │   ├── 📁 home/
│   │   │   └── 📄 page.tsx                  # Dedicated home view
│   │   ├── 📁 login/
│   │   │   └── 📄 page.tsx                  # Direct customer/staff login route
│   │   ├── 📁 menu/
│   │   │   └── 📄 page.tsx                  # Food & beverage browsing screen
│   │   ├── 📁 orders/
│   │   │   ├── 📄 page.tsx                  # Order history listing
│   │   │   └── 📁 [id]/
│   │   │       └── 📄 page.tsx              # Dynamic order details & tracking
│   │   ├── 📁 profile/
│   │   │   └── 📄 page.tsx                  # User profile, QR pass & settings
│   │   ├── 📁 reset-password/
│   │   │   └── 📄 page.tsx                  # Direct reset password route
│   │   ├── 📁 signup/
│   │   │   └── 📄 page.tsx                  # Direct registration route
│   │   ├── 📁 verify-otp/
│   │   │   └── 📄 page.tsx                  # Direct OTP validation screen
│   │   ├── 📄 favicon.ico                   # Application favicon
│   │   ├── 📄 globals.css                   # Global Tailwind CSS styles & themes
│   │   ├── 📄 layout.tsx                    # Root layout with context providers
│   │   └── 📄 page.tsx                      # Root landing page (/)
│   │
│   ├── 📁 components/                       # Reusable UI & feature components
│   │   ├── 📁 auth/                         # Authentication components
│   │   │   ├── 📄 GoogleAuthButton.tsx      # Social Google authentication trigger
│   │   │   └── 📄 RoleSelector.tsx          # Role switcher (Customer / Staff / Admin)
│   │   ├── 📁 cart/                         # Cart management components
│   │   │   ├── 📄 CartItem.tsx              # Line item with quantity adjustments
│   │   │   ├── 📄 CartSummary.tsx           # Subtotal, taxes & checkout trigger
│   │   │   └── 📄 EmptyCart.tsx             # Friendly empty cart state illustration
│   │   ├── 📁 home/                         # Landing / Home page sections
│   │   │   ├── 📄 CategoryShortcuts.tsx     # Quick category filter chips
│   │   │   ├── 📄 HotMealsSection.tsx       # Trending / featured daily meals
│   │   │   └── 📄 PromoBanner.tsx           # Special offers & discounts carousel
│   │   ├── 📁 layout/                       # Structural layout elements
│   │   │   ├── 📄 AppShell.tsx              # Master responsive wrapper
│   │   │   ├── 📄 BottomNav.tsx             # Mobile-friendly navigation dock
│   │   │   ├── 📄 Footer.tsx                # App footer with links & credits
│   │   │   └── 📄 Header.tsx                # Top navigation bar, search & cart badge
│   │   ├── 📁 menu/                         # Menu catalog components
│   │   │   ├── 📄 CategoryFilter.tsx        # Dietary & category filter pills
│   │   │   ├── 📄 CategoryIcon.tsx          # Dynamic SVG category icons
│   │   │   ├── 📄 FoodCard.tsx              # Product display card with 'Add' button
│   │   │   ├── 📄 FoodGrid.tsx              # Responsive product card grid
│   │   │   ├── 📄 MenuSection.tsx           # Menu segment with category headers
│   │   │   └── 📄 SearchBar.tsx             # Live menu search input
│   │   ├── 📁 orders/                       # Order lifecycle components
│   │   │   ├── 📄 OrderCard.tsx             # Order summary ticket card
│   │   │   ├── 📄 OrderStatusBadge.tsx      # Status indicators (Preparing/Ready/Done)
│   │   │   └── 📄 ReceiptPrinter.tsx        # Printable receipt & invoice modal
│   │   ├── 📁 profile/                      # Profile & identity components
│   │   │   ├── 📄 ProfileHeader.tsx         # User avatar, tier & summary stats
│   │   │   ├── 📄 ProfileMenu.tsx           # Account preferences & security options
│   │   │   └── 📄 TakeawayQRPass.tsx        # Digital pickup QR code badge
│   │   └── 📁 ui/                           # Primitives & design system atoms
│   │       ├── 📄 Badge.tsx                 # Status & dietary tag badge
│   │       ├── 📄 Button.tsx                # Reusable accessible button
│   │       ├── 📄 Input.tsx                 # Styled form input field
│   │       ├── 📄 Logo.tsx                  # Reusable responsive branding logo
│   │       ├── 📄 Modal.tsx                 # Dialog / popup wrapper
│   │       ├── 📄 Spinner.tsx               # Animated loading spinner
│   │       └── 📄 Toast.tsx                 # Notification alerts & toast popups
│   │
│   ├── 📁 context/                          # Global React Context providers
│   │   ├── 📄 AuthContext.tsx               # User authentication session state
│   │   └── 📄 CartContext.tsx               # Shopping cart & persistent order items
│   │
│   ├── 📁 hooks/                            # Custom React hooks
│   │   ├── 📄 useAuth.ts                    # Hook consuming AuthContext
│   │   └── 📄 useCart.ts                    # Hook consuming CartContext
│   │
│   └── 📁 lib/                              # Shared logic, data, services & types
│       ├── 📁 data/                         # Static datasets & fixtures
│       │   ├── 📄 categories.ts             # Predefined cafe categories
│       │   ├── 📄 menuItems.ts              # Dish catalog & pricing data
│       │   └── 📄 mockOrders.ts             # Demo order history dataset
│       ├── 📁 services/                     # Business logic & API clients
│       │   ├── 📄 authService.ts            # Auth requests & token operations
│       │   ├── 📄 menuService.ts            # Fetching & filtering dishes
│       │   └── 📄 orderService.ts           # Order creation & status queries
│       ├── 📁 types/                        # TypeScript type definitions
│       │   ├── 📄 auth.ts                   # Auth credentials & user models
│       │   ├── 📄 cart.ts                   # Cart item & price breakdown types
│       │   ├── 📄 menu.ts                   # Category, dish & option types
│       │   └── 📄 order.ts                  # Order status, line items & invoice types
│       └── 📁 utils/                        # Helper utilities & validators
│           ├── 📄 formatCurrency.ts         # Monetary amount formatter (e.g. ₹ / $)
│           └── 📄 validators.ts             # Email, phone & password validators
│
├── 📄 .gitignore                            # Git untracked pattern definitions
├── 📄 AGENTS.md                             # Agent guidelines & Next.js rules
├── 📄 eslint.config.mjs                     # ESLint linting configuration
├── 📄 next-env.d.ts                         # Next.js TypeScript declarations
├── 📄 next.config.ts                        # Next.js framework configuration
├── 📄 package-lock.json                     # Locked dependency tree
├── 📄 package.json                          # Project scripts & package manifest
├── 📄 plan.md                               # Roadmap & implementation tracker
├── 📄 README.md                             # Project overview & getting started guide
└── 📄 tsconfig.json                         # TypeScript compiler configuration
```

---

## 📂 Architectural Breakdown

| Directory / File | Description & Purpose |
| :--- | :--- |
| **`public/`** | Contains static public media and SVG illustrations served directly. |
| **`src/app/`** | Next.js App Router root defining layout hierarchy and client routes (`/menu`, `/cart`, `/checkout`, `/orders`, `/profile`, `/auth/*`). |
| **`src/components/auth/`** | Authentication widgets including OAuth triggers and role switches. |
| **`src/components/cart/`** | Shopping cart elements, item quantities, prices, and empty states. |
| **`src/components/home/`** | Promotional banners, category chips, and hero sections. |
| **`src/components/layout/`** | Header, Bottom navigation bar, responsive AppShell, and Footer. |
| **`src/components/menu/`** | Food item cards, search filters, category buttons, and menu grids. |
| **`src/components/orders/`** | Order tickets, tracking badges, and takeaway printable receipts. |
| **`src/components/profile/`** | Account overview, profile menus, and QR pickup passes. |
| **`src/components/ui/`** | Generic primitive components: Button, Input, Modal, Badge, Spinner, Toast. |
| **`src/context/`** | Global application state management via React Context (`Auth`, `Cart`). |
| **`src/hooks/`** | Clean ergonomic custom React hooks exposing context states and methods. |
| **`src/lib/data/`** | Mock datasets and seeds for dishes, categories, and test orders. |
| **`src/lib/services/`** | API communication layer separating business logic from components. |
| **`src/lib/types/`** | Strict TypeScript interfaces and schemas for end-to-end type safety. |
| **`src/lib/utils/`** | Pure reusable utility functions (currency formatting, input validation). |

---

## 📊 Summary Statistics

- **Total Directories**: `27`
- **Total Project Files**: `82`
- **Application Pages / Routes**: `16`
- **Reusable UI Components**: `27`
- **State Contexts & Hooks**: `4`
- **Services & Lib Utilities**: `11`
