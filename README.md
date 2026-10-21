# SW HUB — Hybrid B2B / B2C Daily Needs Marketplace

SW Hub is a modern, full-stack hybrid daily-needs marketplace serving both retail customers (B2C) and franchise business partners (B2B). The platform delivers everyday essentials across India, covering food staples, packaged snacks, beverages, kitchenware, stationery, and household cleaning products.

---

## 🚀 Key Features

### 🛒 1. Customer Experience (B2C Storefront)
- **Catalog & Search**: Fast multi-department navigation, brand filtering, dynamic category trees, and live search.
- **Daily Flash Steals**: Curated high-discount flash sale banner with countdown and quick-add actions.
- **Shopping Basket & Cart Drawer**: Slide-over drawer and dedicated basket page with quantity controls, free-delivery progress indicator (orders $\ge$ ₹499), and coupon savings calculator.
- **Checkout & Address System**: Preserves all shipping, contact, and delivery details during authentication interruptions.
- **Dual Payment Options**:
  - **Online Payments**: Razorpay gateway supporting UPI, debit/credit cards, and net banking with cryptographic HMAC signature verification.
  - **Cash on Delivery (COD)**: Instant order creation with automated admin cash reconciliation.
- **Order Tracking**: Real-time status updates (`PENDING` $\to$ `CONFIRMED` $\to$ `PACKED` $\to$ `SHIPPED` $\to$ `DELIVERED`).

### 🔐 2. Authentication & Identity
- **Google Sign-In**: Powered by Google Identity Services (`google-auth-library`) with FedCM compliance, immutable `sub` claim mapping, and protection against unauthorized account takeover.
- **Email & Password**: Bcrypt-hashed credentials with optional transactional OTP email verification via Brevo.
- **Client & Server JWT Protection**: Automatic token expiration detection with graceful in-place re-authentication.

### 🏢 3. Franchise & B2B Partner Portal
- **Wholesale Catalog**: Volume-tiered franchise pricing for wholesale store partners.
- **Franchise Dashboard**: Order history, balance ledgers, and depot fulfillment tracking.
- **Partner Onboarding**: Franchise and vendor lead application pipelines.

### 🛠️ 4. Comprehensive Admin Control Panel
- **Product Management**: SKU generation (`SWH-`), categories, subcategories, MRP, retail pricing, franchise pricing, and live inventory control.
- **Fulfillment & Lifecycle Dispatch**: Validated state-machine order processing with atomic stock restoration upon cancellation.
- **Promotions & Homepage Content**: Visual editors for flash sales, promotional banners, hero sliders, and coupons.
- **Customer & Access Moderation**: Account blocking, verification status, and order dispute management.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org) (App Router, Turbopack), [React 19](https://react.dev), Tailwind CSS, Lucide Icons, React Hot Toast |
| **Backend** | [Node.js](https://nodejs.org), Express.js, TypeScript |
| **Database & ORM** | [Supabase PostgreSQL](https://supabase.com) with PgBouncer connection pooling, [Prisma ORM](https://www.prisma.io) |
| **Payment Gateway** | [Razorpay](https://razorpay.com) (Standard Checkout, Webhooks, HMAC-SHA256 signature verification) |
| **Media Storage** | [Cloudinary](https://cloudinary.com) CDN |
| **Email Service** | [Brevo](https://www.brevo.com) (Transactional OTP & order receipts) |
| **Deployment** | [Vercel](https://vercel.com) (Frontend), [Render](https://render.com) (Backend) |

---

## 📁 Repository Structure

```text
SW Hub/
├── swhub-frontend/             # Next.js App Router frontend
│   ├── app/                    # Pages, routes, admin panel, and checkout
│   ├── components/             # Reusable UI components & homepage sections
│   ├── lib/                    # API client, auth modal events, and helpers
│   └── public/                 # Static brand assets and icons
│
├── swhub-backend/              # Express + TypeScript backend API
│   ├── prisma/                 # Prisma schema and database migrations
│   ├── src/
│   │   ├── config/             # Database connection, env, and third-party SDKs
│   │   ├── modules/            # Domain modules (auth, order, payment, product, etc.)
│   │   └── tests/              # Automated lifecycle & admin verification suites
│   └── dist/                   # Compiled production JavaScript
│
└── README.md                   # Project documentation
```

---

## ⚙️ Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Supabase PostgreSQL** instance (or local PostgreSQL)

---

### 1. Backend Setup

```bash
cd swhub-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Supabase, Razorpay, Brevo, and Google credentials

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Seed initial admin account
npm run seed:admin

# Start development server (runs on port 5000)
npm run dev
```

#### Backend Environment Variables (`swhub-backend/.env`)
```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://user:pass@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/postgres"

JWT_SECRET="your-strong-random-jwt-secret"
JWT_EXPIRES_IN=7d
CORS_ORIGINS="http://localhost:3000,https://swhub-gilt.vercel.app"

RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

BREVO_API_KEY="..."
BREVO_SENDER_EMAIL="support@swhub.com"
BREVO_SENDER_NAME="SW Hub"

CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

INITIAL_ADMIN_USERNAME=admin
INITIAL_ADMIN_PASSWORD=Admin@123
INITIAL_ADMIN_EMAIL=admin@swhub.com
```

---

### 2. Frontend Setup

```bash
cd swhub-frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your backend API URL and public keys

# Start Next.js development server (runs on port 3000)
npm run dev
```

#### Frontend Environment Variables (`swhub-frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL="https://swhub.onrender.com/api"
NEXT_PUBLIC_BACKEND_URL="https://swhub.onrender.com"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing & Verification

The project includes thorough automated test suites covering mission-critical order handling, Razorpay payments, webhooks, and catalog administration.

To execute the automated tests:

```bash
cd swhub-backend

# Run the 33-step Order & Payment Lifecycle Suite
npm run test:orders

# Run the Product & Admin Verification Suite
npm run test:admin
```

### Verified Test Matrix: 41 Passed, 0 Failed

#### Order, Payment & Lifecycle Suite (33 Tests):
- ✅ Empty cart rejection & stock shortage handling
- ✅ Accurate server-side price recalculation & shipping fee thresholds
- ✅ Amount unit conversion (rupees to paise in Razorpay payload)
- ✅ Razorpay HMAC-SHA256 signature verification & forgery rejection
- ✅ Cross-customer order access prevention
- ✅ Idempotent payment verification and webhook handling
- ✅ State-machine transition verification (`CONFIRMED` $\to$ `PACKED` $\to$ `SHIPPED` $\to$ `DELIVERED`)
- ✅ Customer cancellation with atomic single-execution stock restoration
- ✅ Prevention of manual payment overrides on unpaid online orders
- ✅ Resilient handling of delayed/out-of-order `payment.failed` and `order.paid` webhooks
- ✅ Safe refund ledgering, over-refund protection, and idempotent retry recovery

#### Product & Admin Catalog Suite (8 Tests):
- ✅ Category foreign-key validation and rejection of orphaned products
- ✅ Subcategory-to-category hierarchical matching
- ✅ Product creation with full daily-needs specifications & `SWH-` SKU format
- ✅ Discount calculation validation against frontend calculator
- ✅ Product field updates and visibility toggling
- ✅ Product filtering by curated daily-needs aisles
- ✅ Foreign-key protection preventing deletion of categories containing active products
- ✅ Database cleanup and teardown verification

---

## 🚢 Production Deployment

### Frontend (Vercel)
1. Import the repository into Vercel and set the Root Directory to `swhub-frontend`.
2. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed Render API (`https://swhub.onrender.com/api`)
   - `NEXT_PUBLIC_BACKEND_URL`: Your backend root (`https://swhub.onrender.com`)
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`: Your Razorpay Key ID
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your single-line Google OAuth Client ID
3. Deploy. All 57 static and dynamic routes compile automatically.

### Backend (Render)
1. Create a Web Service pointing to `swhub-backend`.
2. Build Command: `npx prisma generate && tsc`
3. Start Command: `node dist/server.js`
4. Add all environment variables listed in `.env.example`.
5. Ensure `CORS_ORIGINS` includes your production Vercel domain.

---

## 📄 License
This project is proprietary and confidential to SW Hub. All rights reserved.
